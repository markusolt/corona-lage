const leaf = use.leaf;

let metrics = (() => {
    let map = new Map();

    function add(id, func, config) {
        let name = config.name || id.replace(/(?:[^a-zA-Z0-9]+|^)([a-zA-Z])/g, (m, c) => " " + c.toUpperCase()).trim();

        map.set(id, {
            id,
            name,
            eval: func,
            precision: config.precision || 0,
            link: () => leaf().a(name, "{HOME}/metric/" + id),
            synopsis: config.synopsis || (() => leaf()),
            explanation: config.explanation || (() => leaf()),
        });
    }

    function get(id) {
        let ret = map.get(id);
        if (ret === undefined) {
            console.error("unknown metric %o", id);
        }
        return ret;
    }

    function all() {
        return Array.from(map.values());
    }

    return {
        add,
        get,
        all,
    };
})();

metrics.add(
    "cases",
    (sample) => {
        return sample.measures.cases;
    },
    {}
);

metrics.add(
    "deaths",
    (sample) => {
        return sample.measures.deaths;
    },
    {}
);

metrics.add(
    "reproduction",
    (sample) => {
        return Math.pow(sample.measures.cases_w_0 / sample.measures.cases_w_7, 4 / 7);
    },
    {
        name: "Rate of Reproduction",
        precision: 3,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The factor by which the number of ")
                    .a("new cases", "{HOME}/metric/cases", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" is multiplied by every ")
                    .i("four days")
                    .t(".")
            ),
    }
);

metrics.add(
    "incidence",
    (sample) => {
        let r = Math.pow(sample.measures.cases_w_0 / sample.measures.cases_w_7, 1 / 7);
        let exp_base =
            sample.measures.cases_w_7 /
            (Math.pow(r, 0) + Math.pow(r, 1) + Math.pow(r, 2) + Math.pow(r, 3) + Math.pow(r, 4) + Math.pow(r, 5) + Math.pow(r, 6));
        return (exp_base * Math.pow(r, 13) * 700000) / sample.reg.population;
    },
    {}
);

metrics.add(
    "incidence-rki",
    (sample) => {
        return (sample.measures.cases_w_0 * 100000) / sample.reg.population;
    },
    {
        name: "Incidence (RKI)",
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The average ")
                    .a("number of cases", "{HOME}/metric/cases", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" for the past 7 days per 100.000 people.")
            ),
    }
);

metrics.add(
    "deaths_total",
    (sample) => {
        return (sample.measures.deaths_total * 1000000) / sample.reg.population;
    },
    {
        name: "Deaths (aggregate)",
        synopsis: () => leaf().p(leaf().t("The number of deaths per 1.000.000 people.")),
    }
);

return metrics;
