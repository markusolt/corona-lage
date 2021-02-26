const box = use.box;
const leaf = use.leaf;

let routes = [];

function add_route(path, func) {
    let pattern = new RegExp("^" + path.replace(/{}/g, "([^/]+)") + "$");
    routes.push({
        pattern,
        func,
    });
}

function router(path, args, page) {
    let success = false;
    for (let {pattern, func} of routes) {
        let m = pattern.exec(path);
        if (m) {
            success = func.apply(null, m.slice(1).concat([args, page]));
            break;
        }
    }
    box.thenable(success).then((success) => {
        if (!success) {
            page.h1("Status 404").p("There is nothing here, are you lost?").p(leaf().a("Go home", "{HOME}/").t("."));
        }
    });
}

router.add = add_route;
return router;
