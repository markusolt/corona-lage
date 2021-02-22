const api = use.api;
const spa = use.spa;
const leaf = use.leaf;
const lorem = use.lorem;

if (sessionStorage.href) {
    history.replaceState(null, "", sessionStorage.href);
    sessionStorage.href = "";
}

api().then((api) => {
    window.api = api;
});

{
    document.body.textContent = "";
    let page = document.body.appendChild(document.createElement("main"));
    let footer = document.body.appendChild(document.createElement("footer"));
    footer.textContent = "markus";

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
    if (args.path.length === 0) {
        return leaf()
            .h1("home")
            .a("/foo", "{HOME}/foo")
            .a("/bar", "{HOME}/bar")
            .append(router({path: ["foo"]}));
    } else if (args.path[0] !== "foo") {
        return leaf()
            .h1(JSON.stringify(args, null, 4), (node) => {
                node.style.whiteSpace = "pre";
            })
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
            )
            .append(router({path: [], query: {}}))
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
