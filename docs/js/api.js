"use strict";

{
    window.csv = mod_csv();
    window.day = mod_day();
    window.hay = mod_hay();
    window.api = mod_api();

    function mod_csv() {
        function* csv(text) {
            let iter = rows(text);
            let header = iter.next().value;

            for (let rec of iter) {
                yield Object.fromEntries(header.map((col, i) => [col, rec[i]]));
            }
        }

        function* rows(text) {
            let r_cell = /(?<val>[^",\n]*("[^"]*"[^",\n]*)*)(?<del>,|\n+|$)/g;
            let row = [];

            for (let m of text.matchAll(r_cell)) {
                let { val, del } = m.groups;
                row.push(val.trim().replace(/"/, '').replace(/"([^"]*)"?/g, (m, t) => m === '""' ? '"' : t));

                if (del === ",") {
                    continue;
                }
                if (del === "" && row.length === 1 && row[0] === "") {
                    return;
                }
                yield row;
                row = [];
            }
        }

        return csv;
    }

    function mod_day() {
        class Day {
            constructor(val) {
                this._val = val;
            }

            add(days) {
                return new Day(this._val + days);
            }

            since(other) {
                return this._val - other._val;
            }

            iso() {
                return new Date(this._val * 8.64e7).toISOString().substr(0, 10);
            }

            week_day() {
                return new Intl.DateTimeFormat(undefined, {
                    weekday: "short",
                }).format(new Date(this._val * 8.64e7));
            }
        }

        function day(str) {
            return new Day(Date.parse(str) / 8.64e7);
        }

        return day;
    }

    function mod_hay() {
        class Hay {
            constructor() {
                this._everything = new Set();
                this._map = new Map();
            }

            insert(key, val) {
                this._everything.add(val);

                for (let word of split_into_words(key)) {
                    for (let i = 0; i < word.length; i++) {
                        let chunk = word.substr(0, i + 1);

                        if (!this._map.has(chunk)) {
                            this._map.set(chunk, new Set());
                        }
                        this._map.get(chunk).add(val);
                    }
                }
            }

            find_sets(key) {
                let words = split_into_words(key);
                if (words.length === 0) {
                    return [this._everything];
                }

                return words.map((word) => this._map.get(word) || new Set());
            }

            find(key) {
                return set_intersection(this.find_sets(key));
            }
        }

        function hay() {
            return new Hay();
        }

        function split_into_words(key) {
            return key
                .toLowerCase()
                .replace(/ä/g, "a")
                .replace(/ö/g, "o")
                .replace(/ü/g, "u")
                .replace(/ß/g, "ss")
                .split(/[^a-z0-9]+/g)
                .filter(
                    (word, i, list) => word.length > 2 && list.indexOf(word) === i
                );
        }

        function set_intersection(sets) {
            if (sets.length === 0) {
                return [];
            }

            sets = sets
                .filter((set, i, list) => list.indexOf(set) === i)
                .sort((a, b) => a.size - b.size);
            let tail = sets.slice(1);
            return Array.from(sets[0]).filter((item) =>
                tail.every((set) => set.has(item))
            );
        }

        return hay;
    }

    function mod_api() {
        const { csv, day, hay } = window;

        return (async () => {
            {
                let { asof, cases_table, regions_map, regions_haystack, timestamp } = await update("");

                return {
                    asof,
                    cases: {
                        all: () => cases_table,
                        by_day: (rel_date) => cases_table.filter((rec) => rec.day.rel === rel_date),
                        by_region: (reg_key) => cases_table.filter((rec) => rec.reg.key === reg_key),
                    },
                    regions: {
                        get: (key) => regions_map.get(key),
                        search: (name) => regions_haystack.find(name),
                    },
                    update: async () => {
                        let res = await update(timestamp);
                        if (res) {
                            asof = res.asof;
                            cases_table = res.cases_table;
                            regions_map = res.regions_map;
                            regions_haystack = res.regions_haystack;
                            timestamp = res.timestamp;

                            return true;
                        }

                        return false;
                    },
                };
            }

            async function update(timestamp) {
                let p_api_timestamp = fetch_txt("api/updated", true);
                if (timestamp && (await p_api_timestamp) === timestamp) {
                    return false;
                }

                let p_regions = fetch_csv("api/regions/regions.csv", true);
                let p_cases = fetch_csv("api/cases/sum.csv", true);

                let regions_map = new Map();
                let regions_haystack = hay();
                for (let rec of await p_regions) {
                    let { key, name, population, words } = rec;

                    let reg = {
                        key,
                        name,
                        population: Number(population),
                    };

                    regions_map.set(key, reg);
                    regions_haystack.insert(key, reg);
                    regions_haystack.insert(name, reg);
                    regions_haystack.insert(words, reg);
                    if (key.length > 4) {
                        // todo: this relies on bundeslander being listed above their cities
                        regions_haystack.insert(regions_map.get(key.substring(0, 4)).name, reg);
                    }
                }

                let asof = day((await p_api_timestamp).substring(0, 10)); // todo: this is inaccurate!
                let days = new Array(28).fill(0).map((v, i) => {
                    let d = asof.add(-i);
                    return {
                        iso: d.iso(),
                        rel: i,
                        week_day: d.week_day(),
                    };
                });

                let cases_table = [];
                for (let rec of await p_cases) {
                    let date = days[asof.since(day(rec.date))];
                    let reg = regions_map.get(rec.region);
                    let w_0 = Number(rec.cases_week_0);
                    let w_7 = Number(rec.cases_week_7);

                    let r = Math.pow(w_0 / w_7, 1 / 7);
                    let exp_base = w_7 / (Math.pow(r, 0) + Math.pow(r, 1) + Math.pow(r, 2) + Math.pow(r, 3) + Math.pow(r, 4) + Math.pow(r, 5) + Math.pow(r, 6));
                    let incidence = exp_base * Math.pow(r, 13) * 700000 / reg.population;
                    let change = incidence * (r - 1);

                    let d_0 = Number(rec.deaths_week_0);
                    let d_7 = Number(rec.deaths_week_7);
                    let mortality = (d_0 + d_7) * 1000 / (w_0 + w_7);

                    let sample = {
                        reg,
                        date,
                        incidence,
                        r,
                        change,
                        mortality,
                    };
                    cases_table.push(sample);
                }
                cases_table.sort((a, b) => a.reg.key.localeCompare(b.reg.key) || Math.sign(a.date.rel - b.date.rel));

                return {
                    asof: asof.iso(),
                    cases_table,
                    regions_map,
                    regions_haystack,
                    timestamp: await p_api_timestamp,
                };
            }
        })();

        async function fetch_txt(path, disable_cache) {
            let resp = await fetch(path + (Boolean(disable_cache) ? "?r=" + Math.floor(Math.random() * 100000) : ""));
            if (resp.ok) {
                return await resp.text();
            }

            console.error("Failed to load %o: %o", path, resp);
            return "";
        }

        async function fetch_csv(path, disable_cache) {
            return csv(await fetch_txt(path, disable_cache));
        }

        function* iter_map(iter, map) {
            for (let item of iter) {
                yield map(item);
            }
        }
    }
}
