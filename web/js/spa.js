let _filter = () => false;
let _reload = () => {};

if (sessionStorage.href) {
    history.replaceState(null, "", sessionStorage.href);
    sessionStorage.href = "";
}

window.addEventListener("click", (event) => {
    let anchor;
    let args;
    if (
        event.altKey === false &&
        event.ctrlKey === false &&
        event.metaKey === false &&
        event.shiftKey === false &&
        Boolean((anchor = nearest_anchor(event.target))) &&
        !anchor.classList.contains("no-spa") &&
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
