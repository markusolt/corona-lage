const spa = use.spa;
const leaf = use.leaf;
const api = use.api;
const metrics = use.metrics;
const router = use.router;

router.add("/", (args, page) => {
    page.h1("Corona-Lage")
        .p(leaf().t("Welcome to ").i("Corona Lage").t(". This is your daily update of Covid-19 incidence values across Germany."))
        .p(
            leaf()
                .t("You can either select a ")
                .a("region", "{HOME}/region")
                .t(" to see local statistics for the past ")
                .i("21 days")
                .t(", or you can select a ")
                .a("metric", "{HOME}/metric")
                .t(" to see a ranked list of regions.")
        )
        .append(
            search_box("Search for City", () => {}),
            (input) => {
                input.addEventListener("focus", () => {
                    history.pushState(null, "", "{HOME}/region");
                    spa.refresh();
                });
            }
        )
        .h2("Downloads")
        .p(
            leaf()
                .t("You are welcome to download the data directly as ")
                .i("csv")
                .t(" files. These files are updated every day some time in the morning. You can check ")
                .a("here", "{HOME}/api/updated")
                .t(" to see when these files were last updated. Here is a short overview of the available tables.")
        )
        .ul([
            leaf()
                .a("regions.csv", "{HOME}/api/regions/regions.csv")
                .p(leaf().t("Definitions of the ").i("412").t(" counties and ").i("17").t(" hierarchy regions.")),
            leaf()
                .a("cases.csv", "{HOME}/api/cases/cases.csv")
                .p(
                    leaf()
                        .t("The raw source data listing all cases and deaths published by the RKI since ")
                        .i("2020-10-24")
                        .t(". Cases and deaths published before that date are also included, but their value in the ")
                        .i("date")
                        .t(
                            " column is null. This column documents when a case was first published by the RKI, which is not always the day after the "
                        )
                        .i("rep_date")
                        .t(". Please be aware that this is a very large table and can probably not be opened in Excel.")
                ),
            leaf()
                .a("sum.csv", "{HOME}/api/cases/sum.csv")
                .p(
                    leaf()
                        .t(
                            "This is a convinient table that summarizes the published cases and deaths by region and publishing date. The information about gender and age group is not available. To experiment with this table it is recommended to use "
                        )
                        .a("sum_21.csv", "{HOME}/api/cases/sum_21.csv")
                        .t(" which only contains data for the past ")
                        .i("21")
                        .t(" days.")
                ),
        ])
        .h2("Experiments")
        .p(
            leaf().t(
                "These are links to experimental pages for my eyes only. You may visit these pages, but they might not make sense to you."
            )
        )
        .ul([
            leaf().a("random region", "{HOME}/region/DE", (a) => {
                api.then((api) => {
                    let regions = api.find_regions("");
                    a.href = "{HOME}/region/" + regions[Math.floor(Math.random() * regions.length)].key;
                });
            }),
        ]);

    return true;
});

router.add("/region", (args, page) => {
    let init_search = args.filter || "";

    let ul = document.createElement("ul");
    let items = api.then((api) => {
        let ret = [];
        for (let reg of api.find_regions("").sort((a, b) => b.population - a.population)) {
            let li = document.createElement("li");
            li.style.display = "none";
            leaf(li).append(link_reg(reg));

            ul.appendChild(li);
            ret.push({reg, li});
        }

        return ret;
    });

    page.h1("Regions")
        .append(
            search_box(
                "Search for City",
                (query) => {
                    // safari is known to block replaceState when called too frequently
                    // in this case we simply stop updating the url.
                    try {
                        // todo: try to merge better with current url
                        history.replaceState(null, "", "?filter=" + encodeURIComponent(query));
                    } catch {}

                    api.then((api) => {
                        items.then((items) => {
                            let res =
                                query.trim() === ""
                                    ? api.find_regions("").filter((reg) => reg.key.length < 5)
                                    : api.find_regions(query).filter((reg) => reg.key.length > 4);
                            let white_list = new Set(res);
                            let limit = 25;
                            for (let {reg, li} of items) {
                                if (limit > 0 && white_list.has(reg)) {
                                    limit -= 1;
                                    li.style.display = null;
                                } else {
                                    li.style.display = "none";
                                }
                            }
                        });
                    });
                },
                init_search
            ),
            (input) => {
                input.autofocus = true;
            }
        )
        .append(ul);

    return true;
});

router.add("/region/{}", (reg_key, args, page) => {
    return api.then((api) => {
        let reg = api.region(reg_key.toUpperCase());
        if (!reg) {
            return false;
        }

        let table_metrics = ["incidence_rki", "r", "deaths_r", "new_cases", "new_deaths"].map((id) => metrics.get(id));
        let samples = api.samples({reg}).sort((a, b) => a.day.rel - b.day.rel);

        page.h1(reg.name)
            .p(
                leaf()
                    .t(reg.name + " is a region with a population of ")
                    .append(fmt_int(reg.population))
                    .t(" people.")
            )
            .table(
                [
                    {name: "Date", field: "date"},
                    {name: "day", field: "week_day"},
                ].concat(
                    table_metrics.map((mtrc, i) => {
                        return {name: mtrc.link(), field: i, numeric: true, precision: mtrc.precision};
                    })
                ),
                samples.map((sample) =>
                    Object.fromEntries(
                        [
                            ["date", sample.day.iso],
                            ["week_day", sample.day.week_day],
                        ].concat(table_metrics.map((mtrc, i) => [i, mtrc.eval(sample)]))
                    )
                )
            );

        return true;
    });
});

router.add("/metric", (args, page) => {
    page.h1("Metrics").ul(metrics.all().map((mtrc) => mtrc.link().append(mtrc.synopsis())));

    return true;
});

router.add("/metric/{}", (metric_name, args, page) => {
    let mtrc = metrics.get(metric_name);
    if (!mtrc) {
        return false;
    }

    page.h1(mtrc.name)
        .append(mtrc.synopsis())
        .h3("Regions")
        .ul([], (node) => {
            api.then((api) => {
                let data = api
                    .samples({day: 0})
                    .filter((sample) => sample.reg.key.length < 5)
                    .map((sample) => {
                        return {
                            reg: sample.reg,
                            val: mtrc.eval(sample),
                        };
                    })
                    .sort((a, b) => b.val - a.val);

                for (let rec of data) {
                    let li = document.createElement("li");
                    leaf(li)
                        .a(rec.reg.name, "{HOME}/region/" + rec.reg.key, (a) => {
                            a.classList.add("subtle");
                        })
                        .t(": ")
                        .b(rec.val.toFixed(mtrc.precision));

                    node.appendChild(li);
                }
            });
        });

    return true;
});

router.add("/metric/{}/explanation", (metric_name, args, page) => {
    let mtrc = metrics.get(metric_name);
    if (!mtrc) {
        return false;
    }

    page.h1(mtrc.name).append(mtrc.synopsis()).append(mtrc.explanation());

    return true;
});

function link_reg(reg) {
    return leaf().a(reg.name, "{HOME}/region/" + reg.key);
}

function fmt_int(num) {
    let ret = document.createElement("span");
    ret.classList.add("num");
    ret.textContent = num.toFixed(0).replace(/(\d)(?=(\d\d\d)+(\D|$))/g, "$1 ");

    return ret;
}

function search_box(prompt, func, initial) {
    let running = false;
    let pending = null;

    async function exec(query) {
        pending = query;

        if (!running) {
            running = true;
            while (pending !== null) {
                let up_next = pending;
                pending = null;

                await func(up_next);
                await new Promise((res) => setTimeout(res, 100));
            }
            running = false;
        }
    }
    exec(initial || "");

    let ret = document.createElement("input");
    ret.type = "search";
    ret.classList.add("search");
    ret.placeholder = prompt;
    ret.spellcheck = false;
    ret.enterKeyHint = "search";
    ret.value = initial || "";
    ret.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            ret.value = "";
            exec("");

            event.preventDefault();
        }
    });
    ret.addEventListener("input", (event) => {
        exec(event.target.value);
    });

    return ret;
}
