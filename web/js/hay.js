class Hay {
    constructor() {
        this._everything = new Set();
        this._map = new Map();
    }

    insert(key, val) {
        this._everything.add(val);

        for (let word of split_into_words(key)) {
            for (let i = 0; i < word.length; i++) {
                let chunk = word.substr(0, i + 1);

                if (!this._map.has(chunk)) {
                    this._map.set(chunk, new Set());
                }
                this._map.get(chunk).add(val);
            }
        }
    }

    find_sets(key) {
        let words = split_into_words(key);
        if (words.length === 0) {
            return [this._everything];
        }

        return words.map((word) => this._map.get(word) || new Set());
    }

    find(key) {
        return set_intersection(this.find_sets(key));
    }
}

function hay() {
    return new Hay();
}

function split_into_words(key) {
    return key
        .toLowerCase()
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/ü/g, "u")
        .replace(/ß/g, "ss")
        .split(/[^a-z0-9]+/g)
        .filter((word, i, list) => word.length > 2 && list.indexOf(word) === i);
}

function set_intersection(sets) {
    if (sets.length === 0) {
        return [];
    }

    sets = sets.filter((set, i, list) => list.indexOf(set) === i).sort((a, b) => a.size - b.size);
    let tail = sets.slice(1);
    return Array.from(sets[0]).filter((item) => tail.every((set) => set.has(item)));
}

return hay;
