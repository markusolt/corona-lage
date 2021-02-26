const leaf = use.leaf;
const api = use.api;
const metrics = use.metrics;
const router = use.router;

router.add("/", (args, page) => {
    page.h1("Welcome")
        .p(
            leaf()
                .t("Welcome to ")
                .i("Corona Lage")
                .t(". This is your daily update of Covid-19 incidence values across Germany. Go ahead and select a ")
                .a("region", "{HOME}/region/")
                .t(" here.")
        )
        .ul(Array.from(metrics.entries()).map(([key, mtrc]) => leaf().a(mtrc.name, "{HOME}/metric/" + key)))
        .p(
            leaf()
                .t("Or go to a ")
                .a("random region", "{HOME}/region/DE", (a) => {
                    api.then((api) => {
                        let regions = api.find_regions("");
                        a.href = "{HOME}/region/" + regions[Math.floor(Math.random() * regions.length)].key;
                    });
                })
                .t(".")
        );

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
                "filter",
                (query) => {
                    // safari is known to block replaceState when called too frequently
                    // in this case we simply stop updating the url.
                    try {
                        // todo: try to merge better with current url
                        history.replaceState(null, "", "?filter=" + encodeURIComponent(query));
                    } catch {}

                    api.then((api) => {
                        items.then((items) => {
                            let count = 0;
                            let res = new Set(api.find_regions(query));
                            for (let {reg, li} of items) {
                                if (count < 25 && res.has(reg)) {
                                    count += 1;
                                    li.style.display = null;
                                } else {
                                    li.style.display = "none";
                                }
                            }
                        });
                    });
                },
                init_search
            )
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

        let selected_metrics = [
            metrics.get("cases"),
            metrics.get("deaths"),
            metrics.get("reproduction"),
            metrics.get("incidence"),
            metrics.get("incidence-rki"),
        ];
        let deaths_total = api.samples({reg, day: 0})[0].measures.deaths_total;
        page.h1(reg.name)
            .p(
                leaf()
                    .t(reg.name + " is a region with a population of ")
                    .append(fmt_int(reg.population))
                    .t(" people. So far, ")
                    .append(fmt_int(deaths_total))
                    .t(" have lost their lives in relation to ")
                    .i("Covid-19")
                    .t(". Many more had their lives permanently changed for the worse.")
            )
            .table(
                [
                    {name: "Date", field: "date"},
                    {name: "day", field: "week_day"},
                ].concat(
                    selected_metrics.map((mtrc, i) => {
                        return {name: mtrc.name, field: i, numeric: true, precision: mtrc.precision};
                    })
                ),
                api
                    .samples({reg})
                    .sort((a, b) => a.day.rel - b.day.rel)
                    .map((sample) =>
                        Object.fromEntries(
                            [
                                ["date", sample.day.iso],
                                ["week_day", sample.day.week_day],
                            ].concat(selected_metrics.map((mtrc, i) => [i, mtrc.eval(sample)]))
                        )
                    )
            );

        return true;
    });
});

router.add("/metric/{}", (metric_name, args, page) => {
    if (!metrics.has(metric_name)) {
        return false;
    }

    let mtrc = metrics.get(metric_name);
    let data = api.then((api) =>
        api
            .samples({day: 0})
            .map((sample) => {
                return {
                    reg: sample.reg,
                    val: mtrc.eval(sample),
                };
            })
            .sort((a, b) => b.val - a.val)
    );

    page.h1(mtrc.name)
        .append(mtrc.synopsis())
        .p(
            leaf()
                .a("Tell me more", "{HOME}/metric/" + metric_name + "/explanation")
                .t(".")
        )
        .append(document.createElement("div"), (node) => {
            data.then((table) => {
                let rec = table.find((rec) => rec.reg.key.length === 2);
                leaf(node)
                    .t(rec.reg.name + ": ")
                    .b(rec.val.toFixed(mtrc.precision));
            });
        })
        .h3("Bundeslander")
        .ul([], (node) => {
            data.then((table) => {
                for (let rec of table) {
                    if (rec.reg.key.length === 4) {
                        let li = document.createElement("li");
                        leaf(li)
                            .t(rec.reg.name + ": ")
                            .b(rec.val.toFixed(mtrc.precision));

                        node.appendChild(li);
                    }
                }
            });
        })
        .h3("Cities")
        .ul([], (node) => {
            data.then((table) => {
                table = table.filter((rec) => rec.reg.key.length === 7);
                for (let rec of table.slice(0, 10)) {
                    let li = document.createElement("li");
                    leaf(li)
                        .t(rec.reg.name + ": ")
                        .b(rec.val.toFixed(mtrc.precision));

                    node.appendChild(li);
                }

                let li = document.createElement("li");
                li.textContent = "...";
                node.appendChild(li);

                for (let rec of table.slice(table.length - 10)) {
                    let li = document.createElement("li");
                    leaf(li)
                        .t(rec.reg.name + ": ")
                        .b(rec.val.toFixed(mtrc.precision));

                    node.appendChild(li);
                }
            });
        });

    return true;
});

router.add("/metric/{}/synopsis", (metric_name, args, page) => {
    if (!metrics.has(metric_name)) {
        return false;
    }

    let mtrc = metrics.get(metric_name);
    page.h1(mtrc.name).append(mtrc.synopsis());

    return true;
});

router.add("/metric/{}/explanation", (metric_name, args, page) => {
    if (!metrics.has(metric_name)) {
        return false;
    }

    let mtrc = metrics.get(metric_name);
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
