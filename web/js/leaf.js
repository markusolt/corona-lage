const box = use.box;

class Leaf {
    constructor(node) {
        this._node = node;
    }

    append(content, func) {
        append(this._node, content, func);
        return this;
    }

    h1(content, func) {
        return this.append(append(document.createElement("h1"), content), func);
    }

    h2(content, func) {
        return this.append(append(document.createElement("h2"), content), func);
    }

    h3(content, func) {
        return this.append(append(document.createElement("h3"), content), func);
    }

    p(content, func) {
        return this.append(append(document.createElement("p"), content), func);
    }

    div(content, func) {
        return this.append(append(document.createElement("div"), content), func);
    }

    t(content, func) {
        return this.append(document.createTextNode(content), func);
    }

    br(func) {
        return this.append(document.createElement("br"), func);
    }

    i(content, func) {
        return this.append(append(document.createElement("i"), content), func);
    }

    b(content, func) {
        return this.append(append(document.createElement("b"), content), func);
    }

    a(content, href, func) {
        let node = document.createElement("a");
        node.href = href;
        append(node, content);

        return this.append(node, func);
    }

    ul(content, func) {
        let node = document.createElement("ul");
        let iter = content && content[Symbol.iterator] ? content : [content];
        for (let entry of iter) {
            node.appendChild(append(document.createElement("li"), entry));
        }

        return this.append(node, func);
    }

    pre(content, func) {
        return this.append(append(document.createElement("pre"), content), func);
    }

    table(columns, data, func) {
        let node = document.createElement("div");
        node.classList.add("wide");

        let inner = node.appendChild(document.createElement("div"));
        inner.classList.add("padded");

        let t = inner.appendChild(document.createElement("table"));
        let head = t.createTHead().insertRow();
        let body = t.createTBody();

        for (let col of columns) {
            let th = head.appendChild(document.createElement("th"));
            th.textContent = col.name;
            th.classList.toggle("num", col.numeric);
        }

        box.thenable(data).then((data) => {
            for (let rec of data) {
                let tr = body.insertRow();

                for (let col of columns) {
                    let td = tr.insertCell();
                    let val = rec[col.field];
                    if (col.numeric) {
                        td.classList.add("num");
                        td.classList.toggle("empty", !Number.isFinite(val) || val.toFixed(col.precision) === "0");
                        td.textContent = Number.isFinite(val) ? val.toFixed(col.precision) : "-";
                    } else {
                        td.classList.toggle("empty", !val);
                        td.textContent = val ? val : "-";
                    }
                }
            }
        });

        return this.append(node, func);
    }
}

function append(parent, child, func) {
    let child_node = child instanceof Node ? child : child instanceof Leaf ? child._node : document.createTextNode(child);
    if (func) {
        func(child_node);
    }

    parent.appendChild(child_node);
    return parent;
}

function leaf(node) {
    return new Leaf(node || document.createDocumentFragment());
}

return leaf;
