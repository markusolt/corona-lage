const csv = use.csv;
const day = use.day;
const hay = use.hay;

let data_updated = null;
let data = null;

class Api {
    constructor() {}

    async update() {
        let updated = (await fetch_txt("{HOME}/api/updated?r=" + Math.floor(Math.random() * 100000))).trim();
        if (data_updated === updated) {
            return false;
        }

        let p_regions = fetch_csv("{HOME}/api/regions/regions.csv?v=" + updated.replace(/[^0-9]/g, ""));
        let p_cases = fetch_csv("{HOME}/api/cases/sum.csv?v=" + updated.replace(/[^0-9]/g, ""));

        let regions = await p_regions;
        let cases = await p_cases;

        let regions_map = new Map();
        let regions_haystack = hay();
        for (let rec of regions) {
            let {key, name, population, words} = rec;

            let reg = {
                key,
                name,
                population: Number(population),
            };

            regions_map.set(key, reg);
            regions_haystack.insert(key, reg);
            regions_haystack.insert(name, reg);
            regions_haystack.insert(words, reg);
        }
        for (let rec of regions_map.values()) {
            if (rec.key.length > 4) {
                regions_haystack.insert(regions_map.get(rec.key.substring(0, 4)).name, rec);
            }
        }

        let asof = day(updated.substring(0, 10)); // todo: this is inaccurate!
        // todo: assume we don't have records more than 500 days into the past
        let days = new Array(500).fill(0).map((v, i) => {
            let d = asof.add(-i);
            return {
                iso: d.iso(),
                rel: i,
                week_day: d.week_day(),
            };
        });

        let cases_table = [];
        for (let rec of cases) {
            let date = days[asof.since(day(rec.date))];
            let reg = regions_map.get(rec.region);
            let cases = Number(rec.cases);
            let w_0 = Number(rec.cases_week_0);
            let w_7 = Number(rec.cases_week_7);

            let r = Math.pow(w_0 / w_7, 1 / 7);
            let exp_base =
                w_7 /
                (Math.pow(r, 0) + Math.pow(r, 1) + Math.pow(r, 2) + Math.pow(r, 3) + Math.pow(r, 4) + Math.pow(r, 5) + Math.pow(r, 6));
            let incidence = (exp_base * Math.pow(r, 13) * 700000) / reg.population;
            let change = incidence * (r - 1);

            // todo: mortality should probably not be computed per county; the number of deaths per week is too low
            // todo: also, deaths should not be compared with cases on the same day, deaths may lag behind cases
            let d_0 = Number(rec.deaths_week_0);
            let d_7 = Number(rec.deaths_week_7);
            let mortality = ((d_0 + d_7) * 1000) / (w_0 + w_7);

            let sample = {
                reg,
                date,
                cases,
                incidence_rollingsum: (w_0 * 100000) / reg.population,
                incidence,
                r,
                change,
                mortality,
            };
            cases_table.push(sample);
        }
        cases_table.sort((a, b) => a.reg.key.localeCompare(b.reg.key) || Math.sign(a.date.rel - b.date.rel));

        data_updated = updated;
        data = {
            updated,
            asof,
            regions_map,
            regions_haystack,
            cases_table,
        };

        return true;
    }

    updated() {
        return new Date(data.updated);
    }

    data() {
        return data;
    }
}

let data_ready = new Api().update().then((success) => (success ? true : new Promise(() => {})));

async function api() {
    await data_ready;
    return new Api();
}

async function fetch_txt(path) {
    let resp = await fetch(path);
    if (resp.ok) {
        return resp.text();
    }

    console.error("Failed to load %o: %o", path, resp);
    return "";
}

async function fetch_csv(path) {
    return csv(await fetch_txt(path));
}

return api;
