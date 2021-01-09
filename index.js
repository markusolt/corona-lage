"use strict";

{
    window.ui = mod_ui();
    window.spa = mod_spa();

    function mod_ui() {
        function search_box(prompt, func) {
            let running = false;
            let pending = null;
            async function exec(query) {
                pending = query;

                if (!running) {
                    running = true;
                    while (pending !== null) {
                        let up_next = pending;
                        pending = null;

                        await Promise.resolve(func(up_next)).then(
                            () => { },
                            () => { }
                        );
                        await new Promise((res) => setTimeout(res, 0));
                    }
                    running = false;
                }
            }

            pending = "";
            Promise.resolve().then(() => {
                exec(pending);
            });

            let ret = document.createElement("p");
            ret.classList.add("overflow-hidden", "flex-row");

            let text_box = ret.appendChild(document.createElement("input"));
            text_box.type = "search";
            text_box.classList.add("search", "card");
            text_box.placeholder = prompt;
            text_box.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    text_box.value = "";
                    exec("");

                    event.preventDefault();
                }
            });
            text_box.addEventListener("input", (event) => {
                exec(event.target.value);
            });

            let clear = ret.appendChild(document.createElement("button"));
            clear.classList.add("link", "search-cancel");
            clear.textContent = "Cancel";
            clear.addEventListener("click", (event) => {
                text_box.value = "";
                exec("");
            });

            return ret;
        }

        return {
            search_box,
        };
    }

    function mod_spa() {
        let _filter = () => false;
        let _reload = () => { };

        // capture clicking of hyperlinks
        window.addEventListener("click", (event) => {
            let anchor;
            let args;
            if (
                event.altKey === false &&
                event.ctrlKey === false &&
                event.metaKey === false &&
                event.shiftKey === false &&
                Boolean((anchor = nearest_anchor(event.target))) &&
                Boolean((args = _filter(anchor.href)))
            ) {
                event.preventDefault();
                if (anchor.href !== window.location.href) {
                    history.pushState(null, "", anchor.href);
                }
                window.scrollTo(0, 0);
                _reload(args);
            }
        });

        window.addEventListener("popstate", refresh);

        function install(filter, reload) {
            _filter = filter;
            _reload = reload;

            refresh();
        }

        function refresh() {
            _reload(_filter(window.location.href));
        }

        function nearest_anchor(node) {
            while (node && node.tagName !== "A") {
                node = node.parentElement;
            }

            return node;
        }

        return {
            install,
            refresh,
        };
    }
}

{
    const { ui, spa } = window;

    const pages = {
        regions: async (stage) => {
            let h1 = stage.appendChild(document.createElement("h1"));
            h1.appendChild(document.createTextNode("Regions"));

            let output = document.createElement("p");
            let ul = output.appendChild(document.createElement("ul"));
            ul.classList.add("regions");
            stage.appendChild(ui.search_box("Search", async (query) => {
                const api = await window.api;

                ul.innerHTML = "";
                let regions = api.regions.search(query).sort((a, b) => b.population - a.population);
                for (let reg of regions) {
                    let { key, name } = reg;
                    let { incidence, change, mortality } = api.cases.by_region(reg.key)[0];

                    let li = ul.appendChild(document.createElement("li"));
                    let pre = li.appendChild(document.createElement("pre"));
                    pre.textContent = JSON.stringify({ key, name, incidence: Math.round(incidence), change: Math.round(change), mortality: Math.round(mortality) }, null, 4);
                }
            }));
            stage.appendChild(output);
        }
    };

    let base_url = /^([^\?]*)/.exec(window.location.href)[1] + "?";
    spa.install(
        (url) => {
            // detect external url
            if (!(url + "?").startsWith(base_url)) {
                return false;
            }

            // parse url
            return /[^\?]*\??([^#]*)/
                .exec(url)[1]
                .split("/")
                .filter((str) => str.length > 0)
                .map((str) => decodeURIComponent(str));
        },
        (args) => {
            let stage = document.body;
            stage.innerHTML = "";

            pages.regions(stage);
        }
    );
}

// todo: remove; for testing purposes only
{
    (async () => {
        if (!window.location.href.startsWith("http://127.0.0.1")) {
            return;
        }

        const api = await window.api;

        // todo: remove once the rewrite of the api module is done and it works as intended.
        console.table(api.regions.search("darmstadt").map(reg => { return { key: reg.key, name: reg.name, population: reg.population, area: reg.area }; }));
        console.table(api.cases.by_region("DE06411").map(rec => { return { reg: rec.reg.name, date: rec.date.iso, r: Math.round(rec.r * 1000) / 1000, incidence: Math.round(rec.incidence), change: Math.round(rec.change), mortality: Math.round(rec.mortality) }; }));
        console.table(api.cases.by_region("DE06432").map(rec => { return { reg: rec.reg.name, date: rec.date.iso, r: Math.round(rec.r * 1000) / 1000, incidence: Math.round(rec.incidence), change: Math.round(rec.change), mortality: Math.round(rec.mortality) }; }));
    })();
}
