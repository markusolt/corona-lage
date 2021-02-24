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
            leaf(page).append(router(args.path, args.query));
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
