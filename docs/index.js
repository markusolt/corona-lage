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

        function table(data, columns) {
            let ret = document.createElement("table");

            let head = ret.createTHead().insertRow();
            for (let col of columns) {
                head.insertCell().textContent = col;
            }

            let body = ret.createTBody();
            for (let rec of data) {
                let tr = body.insertRow();
                for (let col of columns) {
                    tr.insertCell().textContent = rec[col];
                }
            }

            ret.createTBody();

            return ret;
        }

        return {
            search_box,
            table,
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
        unknown: async (stage, args) => {
            let h1 = stage.appendChild(document.createElement("h1"));
            h1.appendChild(document.createTextNode("404"));

            let p = document.createElement("p");
            p.textContent = "Resource does not exist.";
            stage.appendChild(p);
        },
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
                    let a = li.appendChild(document.createElement("a"));
                    a.href = "?/regions/" + key;
                    let pre = a.appendChild(document.createElement("pre"));
                    pre.textContent = JSON.stringify({ key, name, incidence: Math.round(incidence), change: Math.round(change), mortality: Math.round(mortality) }, null, 4);
                }
            }));
            stage.appendChild(output);
        },
        region: async (stage, key) => {
            const api = await window.api;

            // todo: handle invalid region key
            let reg = api.regions.get(key);

            let h1 = stage.appendChild(document.createElement("h1"));
            h1.appendChild(document.createTextNode(reg.name));

            stage.appendChild(ui.table(api.cases.by_region(reg.key).map(rec => { return { day: rec.date.week_day, incidence: Math.round(rec.incidence), r: Math.round(rec.r * 1000) / 1000, mortality: Math.round(rec.mortality) }; }), ["day", "incidence", "r", "mortality"]));
        },
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

            if (args[0] === "regions") {
                if (args.length === 1) {
                    pages.regions(stage);
                } else if (args.length === 2) {
                    pages.region(stage, args[1]);
                } else {
                    pages.unknown(stage, args);
                }
            } else {
                pages.unknown(stage, args);
            }
        }
    );
}
