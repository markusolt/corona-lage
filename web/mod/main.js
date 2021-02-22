const api = use.api;
const spa = use.spa;
const leaf = use.leaf;
const lorem = use.lorem;

if (sessionStorage.href) {
    history.replaceState(null, "", sessionStorage.href);
    sessionStorage.href = "";
}

let on_api_update = [];
api().then((api) => {
    window.api = api;
    on_api_update.forEach((func) => {
        func(api);
    });
});

{
    document.body.textContent = "";
    let page = document.body.appendChild(document.createElement("main"));
    let footer = document.body.appendChild(document.createElement("footer")).appendChild(document.createElement("div"));
    footer.classList.add("signature");
    leaf(footer)
        .t("data: ")
        .append(document.createElement("time"), (node) => {
            node.textContent = "...";
            on_api_update.push((api) => {
                let d = api.updated();
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
            page.textContent = "";
            leaf(page).append(router(args));
            if (page.childNodes.length === 0) {
                leaf(page).h1("Status 404").p("There is nothing here, are you lost?").p(leaf().a("Go home", "{HOME}/").t("."));
            }
        }
    );
}

function router(args) {
    if (args.path.length === 1 && args.path[0] === "greet") {
        return leaf()
            .h1("Welcome")
            .p(
                leaf()
                    .t("Welcome to ")
                    .i("Corona Lage")
                    .t(". This is your daily update of Covid-19 incidence values across Germany. Go ahead and visit a ")
                    .a(
                        "random page",
                        "{HOME}/" +
                            lorem(rand_between(0, 4))
                                .toLowerCase()
                                .replace(/[^a-z ]+/g, "")
                                .replace(/ /g, "/")
                    )
                    .t(".")
            );
    } else if (args.path[0] !== "foo") {
        return leaf()
            .append(router({path: ["greet"], query: {}}))
            .p(JSON.stringify(args, null, 4), (node) => {
                node.style.whiteSpace = "pre";
            })
            .ul(new Array(rand_between(3, 12)).fill(null).map(() => lorem(rand_between(5, 20))))
            .p(lorem(rand_between(30, 70)));
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
