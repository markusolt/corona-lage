function* csv(text) {
    let iter = rows(text);
    let header = iter.next().value;

    for (let rec of iter) {
        yield Object.fromEntries(header.map((col, i) => [col, rec[i]]));
    }
}

function* rows(text) {
    let r_cell = /(?<val>[^",\n]*("[^"]*"[^",\n]*)*)(?<del>,|\n+|$)/g;
    let row = [];

    for (let m of text.matchAll(r_cell)) {
        let {val, del} = m.groups;
        row.push(
            val
                .trim()
                .replace(/"/, "")
                .replace(/"([^"]*)"?/g, (m, t) => (m === '""' ? '"' : t))
        );

        if (del === ",") {
            continue;
        }
        if (del === "" && row.length === 1 && row[0] === "") {
            return;
        }
        yield row;
        row = [];
    }
}

return csv;
