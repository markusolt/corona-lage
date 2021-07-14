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
        name: "Cases",
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
                    .t(". Cases published more than ")
                    .i("five days")
                    .t(" after their reporting date are ignored.")
            ),
    }
);

metrics.add(
    "new_cases_7d",
    (sample) => {
        return sample.measures.cases_w_0;
    },
    {
        name: "Cases (7 days)",
        precision: 0,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The number of ")
                    .a("cases", "{HOME}/metric/new_cases", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" during the past ")
                    .i("seven days")
                    .t(". This value is the absolute number of cases, and is not adjusted for population size.")
            ),
    }
);

metrics.add(
    "new_deaths",
    (sample) => {
        return sample.measures.deaths;
    },
    {
        name: "Deaths",
        precision: 0,
        synopsis: () =>
            leaf().p(leaf().t("The number of new deaths related to ").i("Covid-19").t(" published by the ").i("RKI").t(" on this day.")),
    }
);

metrics.add(
    "new_deaths_7d",
    (sample) => {
        return sample.measures.deaths_w_0;
    },
    {
        name: "Deaths (7 days)",
        precision: 0,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The number of ")
                    .a("deaths", "{HOME}/metric/new_deaths", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" during the past ")
                    .i("seven days")
                    .t(".")
            ),
    }
);

metrics.add(
    "r",
    (sample) => {
        return Math.pow(Math.max(0, sample.measures.cases_w_0) / Math.max(1, sample.measures.cases_w_7), 5 / 7);
    },
    {
        name: "R (5 days)",
        precision: 2,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The ")
                    .i("rate of reproduction")
                    .t(" is the factor by which the number of ")
                    .a("cases", "{HOME}/metric/new_cases", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" seems to multiply by every ")
                    .i("five days")
                    .t(". It is computed by comparing the total number of cases of the past ")
                    .i("7 days")
                    .t(" with the total number of cases of the prior ")
                    .i("7 days")
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
        name: "Incidence (Exp)",
        precision: 0,
        synopsis: () =>
            leaf()
                .p(
                    leaf()
                        .t("The number of ")
                        .a("cases", "{HOME}/metric/new_cases", (a) => {
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
                )
                .p(
                    leaf()
                        .t("This is different from the ")
                        .a("official incidence", "{HOME}/metric/incidence_rki", (a) => {
                            a.classList.add("subtle");
                        })
                        .t(".")
                ),
    }
);

metrics.add(
    "incidence_rki",
    (sample) => {
        return (sample.measures.cases_md_w_0 * 100000) / sample.reg.population;
    },
    {
        name: "Incidence",
        precision: 0,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The official incidence of ")
                    .i("Covid-19")
                    .t(" as reported by the ")
                    .a("RKI", "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html")
                    .t(".")
            ),
    }
);

metrics.add(
    "deaths_r",
    (sample) => {
        return Math.pow(Math.max(0, sample.measures.deaths_w_0) / Math.max(1, sample.measures.deaths_w_7), 5 / 7);
    },
    {
        name: "R (Deaths)",
        precision: 2,
        synopsis: () =>
            leaf().p(
                leaf()
                    .t("The ")
                    .i("rate of reproduction of deaths")
                    .t(" is the factor by which the number of ")
                    .a("deaths", "{HOME}/metric/new_deaths", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(" seems to multiply by every ")
                    .i("five days")
                    .t(". This is similar to the metric ")
                    .a("R", "{HOME}/metric/r", (a) => {
                        a.classList.add("subtle");
                    })
                    .t(".")
            ),
    }
);

metrics.add(
    "deaths_total",
    (sample) => {
        return sample.measures.deaths_total;
    },
    {
        name: "Total Number of Deaths",
        precision: 0,
        synopsis: () => leaf().p(leaf().t("The total number of ").i("Covid-19").t(" related deaths.")),
    }
);

return metrics;
