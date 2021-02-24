const leaf = use.leaf;

let routes = [];

function add_route(path, func) {
    let pattern = path
        .split("/")
        .filter((s) => s.length > 0)
        .map((s) =>
            s === "{}"
                ? (p, params) => {
                      params.push(p);
                      return true;
                  }
                : (p, params) => s === p
        );

    routes.push((path, args, page) => {
        let params = [];
        if (path.length === pattern.length && pattern.every((pat, i) => pat(path[i], params))) {
            let res = func.apply(null, params.concat([args]));
            if (res) {
                page.append(res);
                return true;
            }
        }
        return false;
    });
}

function router(path, args) {
    let page = leaf();
    if (routes.some((r) => r(path, args, page))) {
        return page;
    }

    console.error("unknown resource: %o", {path: "{HOME}/" + args.path.join("/")});
    return leaf();
}

router.add = add_route;
return router;
