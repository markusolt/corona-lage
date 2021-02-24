const leaf = use.leaf;
const api = use.api;
const metrics = use.metrics;
const router = use.router;

router.add("/", (args) => {
    return leaf()
        .h1("Welcome")
        .p(
            leaf()
                .t("Welcome to ")
                .i("Corona Lage")
                .t(". This is your daily update of Covid-19 incidence values across Germany. Go ahead and start ")
                .a("here", "{HOME}/metric/incidence")
                .t(".")
        )
        .ul(Array.from(metrics.entries()).map(([key, mtrc]) => leaf().a(mtrc.name, "{HOME}/metric/" + key)));
});

router.add("/metric/{}", (metric_name, args) => {
    if (!metrics.has(metric_name)) {
        return null;
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

    return leaf()
        .h1(mtrc.name)
        .append(mtrc.synopsis())
        .append(mtrc.description())
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
});
