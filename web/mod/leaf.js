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
