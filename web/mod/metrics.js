const leaf = use.leaf;

let metrics = new Map();

metrics.set("cases", {
    name: "Cases",
    eval: (sample) => {
        return sample.measures.cases;
    },
    precision: 0,
    synopsis: () => leaf(),
    description: () => leaf(),
});

metrics.set("reproduction", {
    name: "Rate of Reproduction",
    eval: (sample) => {
        return Math.pow(sample.measures.cases_w_0 / sample.measures.cases_w_7, 4 / 7);
    },
    precision: 3,
    synopsis: () =>
        leaf().p(
            leaf()
                .t("The factor by which the number of ")
                .a("new cases", "{HOME}/metric/cases")
                .t(" is multiplied by every ")
                .i("four days")
                .t(".")
        ),
    description: () => leaf(),
});

metrics.set("incidence", {
    name: "Incidence",
    eval: (sample) => {
        let r = Math.pow(sample.measures.cases_w_0 / sample.measures.cases_w_7, 1 / 7);
        let exp_base =
            sample.measures.cases_w_7 /
            (Math.pow(r, 0) + Math.pow(r, 1) + Math.pow(r, 2) + Math.pow(r, 3) + Math.pow(r, 4) + Math.pow(r, 5) + Math.pow(r, 6));
        return (exp_base * Math.pow(r, 13) * 700000) / sample.reg.population;
    },
    precision: 0,
    synopsis: () => leaf(),
    description: () => leaf(),
});

metrics.set("incidence-rki", {
    name: "Incidence (RKI)",
    eval: (sample) => {
        return (sample.measures.cases_w_0 * 100000) / sample.reg.population;
    },
    precision: 0,
    synopsis: () =>
        leaf().p(leaf().t("The average ").a("number of cases", "{HOME}/metric/cases").t(" for the past 7 days per 100.000 people.")),
    description: () => leaf(),
});

return metrics;
