const spa = use.spa;
const api = use.api;
const metrics = use.metrics;
const leaf = use.leaf;
const lorem = use.lorem;

{
    document.body.textContent = "";
    let page = document.body.appendChild(document.createElement("main"));
    let footer = document.body.appendChild(document.createElement("footer")).appendChild(document.createElement("div"));
    footer.classList.add("signature");
    leaf(footer)
        .t("data: ")
        .append(document.createElement("time"), (node) => {
            node.textContent = "...";
            api.watch((api) => {
                let d = api.updated;
                node.dateTime = d;
                node.textContent = d.toISOString().substring(0, 19).replace("T", " ");
            });
        })
        .br()
        .t("website: ")
        .append(document.createElement("time"), (node) => {
            let d = new Date("{DATE}");
            node.dateTime = d;
            node.textContent = d.toISOString().substring(0, 19).replace("T", " ");
        })
        .br()
        .t("source: ")
        .a("github.com", "https://github.com/markusolt/corona-lage", (node) => {
            node.classList.add("subtle");
        })
        .br()
        .t("author: ")
        .a("markus", "mailto:markus@blaumond.net", (node) => {
            node.classList.add("subtle");
        });

    let origin = location.origin + "{HOME}";
    spa.install(
        (url) => {
            if (url.startsWith(origin)) {
                let rel_url = url.substring(origin.length);

                let path = split_at(rel_url, "?")[0]
                    .split("/")
                    .map((w) =>
                        decodeURIComponent(w)
                            .toLowerCase()
                            .replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g, "")
                    )
                    .filter((w) => w.length > 0);
                let query = Object.fromEntries(
                    split_at(split_at(rel_url, "?")[1], "#")[0]
                        .split("&")
                        .map((w) => split_at(w, "="))
                        .map(([key, val]) => [
                            decodeURIComponent(key)
                                .toLowerCase()
                                .replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g, ""),
                            decodeURIComponent(val).trim() || true,
                        ])
                        .filter(([key, val]) => key.length > 0)
                );

                return {
                    path,
                    query,
                };
            }

            return null;
        },
        (args) => {
            api_update();

            page.textContent = "";
            leaf(page).append(router(args));
            if (page.childNodes.length === 0) {
                leaf(page).h1("Status 404").p("There is nothing here, are you lost?").p(leaf().a("Go home", "{HOME}/").t("."));
            }
        }
    );
}

let last_api_update = new Date();
function api_update() {
    if (api.value && new Date() - last_api_update > 60000) {
        last_api_update = new Date();
        api.value.update().then((success) => {
            if (success) {
                spa.refresh();
            }
        });
    }
}
window.addEventListener("focus", () => {
    api_update();
});

function router(args) {
    let path = "/" + args.path.join("/");
    if (path === "/") {
        return leaf()
            .h1("Welcome")
            .p(
                leaf()
                    .t("Welcome to ")
                    .i("Corona Lage")
                    .t(". This is your daily update of Covid-19 incidence values across Germany. Go ahead and start ")
                    .a("here", "{HOME}/incidence")
                    .t(".")
            )
            .ul(Array.from(metrics.entries()).map(([key, mtrc]) => leaf().a(mtrc.name, "{HOME}/metric/" + key)));
    }
    if (args.path.length === 2 && args.path[0] === "metric" && metrics.has(args.path[1])) {
        let mtrc = metrics.get(args.path[1]);
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
                        .b(rec.val.toFixed(0));
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
                                .b(rec.val.toFixed(0));

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
                            .b(rec.val.toFixed(0));

                        node.appendChild(li);
                    }

                    let li = document.createElement("li");
                    li.textContent = "...";
                    node.appendChild(li);

                    for (let rec of table.slice(table.length - 10)) {
                        let li = document.createElement("li");
                        leaf(li)
                            .t(rec.reg.name + ": ")
                            .b(rec.val.toFixed(0));

                        node.appendChild(li);
                    }
                });
            });
    }

    console.error("unknown resource: %o", {path: "{HOME}/" + args.path.join("/")});
    return leaf();
}

function split_at(str, del) {
    let i = (str.indexOf(del) + str.length + 1) % (str.length + 1);
    return [str.substring(0, i), str.substring(i + 1)];
}

function rand_between(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function hlink(title, href) {
    let a = document.createElement("a");
    a.title = title;
    a.textContent = title;
    a.href = href;

    return a;
}

/*
todo:

[x] import box module
[x] rewrite api module
[x] create metric abstraction
[ ] rewrite router
[ ] move things from main into separate modules
[x] auto reload the page on api update
[ ] create the following pages
    [ ] /
    [ ] /metric #{mtrc}
    [ ] /metric/{mtrc}
    [ ] /metric/{mtrc}/synopsis
    [ ] /metric/{mtrc}/description
    [ ] /region ?filter={}
    [ ] /region/{reg} #{mtrc}
    [ ] /region/{reg}/synopsis
    [ ] /region/{reg}/news #{date}
    [ ] /region/{reg}/news/{date}
    [ ] /blog #art
    [ ] /blog/{art}
[ ] add variable definitions to config.json and refactor build.ps1
[ ] add an optional arg "?day={date}"
    [ ] show a warning
    [ ] persist this value across navigation
[ ] offline support

*/
