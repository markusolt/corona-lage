const spa = use.spa;
const api = use.api;
const leaf = use.leaf;
const router = use.router;

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

                let {path, query, tag} = /^(?<path>[^\?#]*)(\?(?<query>[^#]*))?(#(?<tag>.*))?$/.exec(rel_url).groups;
                path =
                    "/" +
                    path
                        .split("/")
                        .map((w) =>
                            decodeURIComponent(w)
                                .toLowerCase()
                                .replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g, "")
                        )
                        .filter((w) => w.length > 0)
                        .join("/");
                query = Object.fromEntries(
                    (query || "")
                        .split("&")
                        .map((w) => /(?<key>[^\=]*)(\=(?<val>.*))?/.exec(w).groups)
                        .map(({key, val}) => [
                            decodeURIComponent(key)
                                .toLowerCase()
                                .replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g, ""),
                            decodeURIComponent(val || "").trim(),
                        ])
                        .filter(([key, val]) => key.length > 0)
                );
                tag = decodeURIComponent(tag || "")
                    .toLowerCase()
                    .replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g, "");

                // i wanted to clean up the browser url using 'history.replaceState', but for some
                // reason this breaks the session history. i am leaving the expression here, but the
                // variable is currently unused.
                let recommended_url =
                    "{HOME}" +
                    path +
                    (Object.keys(query).length > 0
                        ? "?" +
                          Object.entries(query)
                              .map(([key, val]) => key + "=" + encodeURIComponent(val))
                              .join("&")
                        : "") +
                    (tag ? "#" + tag : "");

                return {
                    path,
                    query,
                };
            }

            return null;
        },
        (loc) => {
            api_update();

            page.textContent = "";
            leaf(page)
                .append(document.createElement("article"), (article) => {
                    router(loc.path, loc.query, leaf(article));
                })
                .p(leaf().a("home", "{HOME}/"));
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

function split_at(str, del) {
    let i = (str.indexOf(del) + str.length + 1) % (str.length + 1);
    return [str.substring(0, i), str.substring(i + 1)];
}

/*
todo:

[x] import box module
[x] rewrite api module
[x] create metric abstraction
[x] rewrite router
[x] auto reload the page on api update
[x] create specialized rendering abstractions
    [x] metric hyperlink
    [x] replace inline urls with js functions
[ ] create the following pages
    [x] /
    [ ] /metric #{mtrc}
    [x] /metric/{mtrc}
    [x] /metric/{mtrc}/synopsis
    [x] /metric/{mtrc}/explanation
    [ ] /region ?filter={}
    [ ] /region/{reg} #{mtrc}
    [ ] /region/{reg}/synopsis
    [ ] /region/{reg}/news #{date}
    [ ] /region/{reg}/news/{date}
    [ ] /blog #art
    [ ] /blog/{art}
[ ] refine metric abstraction
[ ] rethink number formatting
[ ] extend spa module to save state in history (replacestate)
[ ] remove main module
[ ] add variable definitions to config.json and refactor build.ps1
[ ] add an optional arg "?day={date}"
    [ ] show a warning
    [ ] persist this value across navigation
[ ] offline support

*/
