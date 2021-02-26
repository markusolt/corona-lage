const box = use.box;
const csv = use.csv;
const day = use.day;
const hay = use.hay;

let state = {
    update: null,
    asof: null,
    days: null,
    regions: null,
    regions_index: null,
    samples: null,
};
let access = box();

class Api {
    constructor() {}

    async update() {
        let updated = (await fetch_txt("{HOME}/api/updated?r=" + rand_hex())).trim();
        if (state.updated === updated) {
            return false;
        }

        let p_regions = fetch_csv("{HOME}/api/regions/regions.csv?v=" + updated.replace(/[^0-9]/g, ""));
        let p_cases = fetch_csv("{HOME}/api/cases/sum_28.csv?v=" + updated.replace(/[^0-9]/g, ""));

        let regions = new Map();
        let regions_index = hay();
        for (let rec of await p_regions) {
            let reg = {
                key: rec.key,
                name: rec.name,
                population: Number(rec.population),
            };

            regions.set(reg.key, reg);
            regions_index.insert(rec.key + " " + rec.name + " " + rec.words, reg);
        }

        let days = new Map();
        let asof = day(updated.substring(0, 10));
        let samples = [];
        for (let rec of await p_cases) {
            let reg = regions.get(rec.region);

            let date_rel = asof.since(day(rec.date));
            if (!days.has(date_rel)) {
                let d = asof.add(-date_rel);
                days.set(date_rel, {
                    rel: date_rel,
                    iso: d.iso(),
                    week_day: d.week_day(),
                });
            }
            let d = days.get(date_rel);

            let cases = Number(rec.cases);
            let cases_w_0 = Number(rec.cases_week_0);
            let cases_w_7 = Number(rec.cases_week_7);
            let cases_total = Number(rec.cases_total);
            let deaths = Number(rec.deaths);
            let deaths_w_0 = Number(rec.deaths_week_0);
            let deaths_w_7 = Number(rec.deaths_week_7);
            let deaths_total = Number(rec.deaths_total);

            samples.push({
                reg,
                day: d,
                measures: {
                    cases,
                    cases_w_0,
                    cases_w_7,
                    cases_total,
                    deaths,
                    deaths_w_0,
                    deaths_w_7,
                    deaths_total,
                },
            });
        }

        state = {
            updated,
            asof,
            days,
            regions,
            regions_index,
            samples,
        };

        access.touch();
        return true;
    }

    get updated() {
        return new Date(state.updated);
    }

    get asof() {
        return state.asof;
    }

    day(date_rel) {
        if (!state.days.has(date_rel)) {
            let d = state.asof.add(-date_rel);
            state.days.set(date_rel, {
                rel: date_rel,
                iso: d.iso(),
                week_day: d.week_day(),
            });
        }

        return state.days.get(date_rel);
    }

    region(key) {
        return state.regions.get(key);
    }

    find_regions(query) {
        return state.regions_index.find(query);
    }

    samples({reg, day}) {
        day = Number.isFinite(day) ? this.day(day) : day;

        if (reg && day) {
            return state.samples.filter((rec) => rec.reg === reg && rec.day === day);
        }
        if (reg) {
            return state.samples.filter((rec) => rec.reg === reg);
        }
        if (day) {
            return state.samples.filter((rec) => rec.day === day);
        }
        return state.samples;
    }
}

function rand_hex() {
    return Math.floor(Math.random() * Math.pow(16, 4))
        .toString(16)
        .padStart(4, "0");
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

(async () => {
    let api = new Api();
    if (await api.update()) {
        access.set(api);
    }
})();

return access;
