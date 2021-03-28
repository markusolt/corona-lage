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
    "new_cases",
    (sample) => {
        return sample.measures.cases;
    },
    {
        name: "New Cases",
        precision: 0,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The number of new ")
                    .i("Covid-19")
                    .t(" cases published by the ")
                    .i("RKI")
                    .t(" on this day with a reporting date that is no older than ")
                    .i("five days")
                    .t(".")
            ),
    }
);

metrics.add(
    "new_deaths",
    (sample) => {
        return sample.measures.deaths;
    },
    {
        name: "New Deaths",
        precision: 0,
        synopsis: () => leaf().p(leaf().t("New number of new deaths related to ").i("Covid-19").t(" published by the ").i("RKI").t(".")),
    }
);

metrics.add(
    "r",
    (sample) => {
        return Math.pow(Math.max(0, sample.measures.cases_w_0) / Math.max(1, sample.measures.cases_w_7), 5 / 7);
    },
    {
        name: "Rate of Reproduction (5 days)",
        precision: 2,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The factor by which the number of ")
                    .a("new cases", "{HOME}/metric/new_cases", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" is multiplied by every ")
                    .i("five days")
                    .t(". You can expect the ")
                    .a("incidence", "{HOME}/metric/incidence", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" to multiply by this factor every ")
                    .i("five days")
                    .t(".")
            ),
    }
);

metrics.add(
    "incidence",
    (sample) => {
        let r = Math.pow(Math.max(0, sample.measures.cases_w_0) / Math.max(1, sample.measures.cases_w_7), 1 / 7);
        let exp_base =
            Math.max(1, sample.measures.cases_w_7) /
            (Math.pow(r, 0) + Math.pow(r, 1) + Math.pow(r, 2) + Math.pow(r, 3) + Math.pow(r, 4) + Math.pow(r, 5) + Math.pow(r, 6));
        return (exp_base * Math.pow(r, 13) * 700000) / sample.reg.population;
    },
    {
        name: "Incidence",
        precision: 0,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The number of ")
                    .a("new cases", "{HOME}/metric/new_cases", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" per ")
                    .i("700.000")
                    .t(
                        " people. The value is smoothed by reordering the number of daily cases over the previous 14 days so that they form an exponential curve, respecting the current value of "
                    )
                    .a("r", "{HOME}/metric/r", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(". The value of the last day is used to compute the incidence.")
            ),
    }
);

metrics.add(
    "deaths_total",
    (sample) => {
        return (sample.measures.deaths_total * 1000000) / sample.reg.population;
    },
    {
        name: "Total Number of Deaths",
        precision: 0,
        synopsis: () => leaf().p(leaf().t("The total number of deaths so far per ").i("1.000.000").t(" people.")),
    }
);

return metrics;
