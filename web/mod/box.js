class Box {
    constructor(val) {
        this._val = undefined;
        this._ver_prev = 0;
        this._ver = 0;
        this._subs = [];
        this._subs_once = [];

        this.set(val);
    }

    get value() {
        return this._val;
    }

    map(func) {
        let ret = box(undefined);

        this.watch((val) => {
            ret.set(func(val));
        });

        return ret;
    }

    set(val) {
        this._ver += 1;

        let ver = this._ver;
        thenable(val).then((val) => {
            if (this._ver_prev < ver) {
                this._ver_prev = ver;

                if (!Object.is(this._val, val)) {
                    this._val = val;
                    this.touch();
                }
            }
        });
    }

    then(func) {
        if (this._val !== undefined) {
            func(this._val);
        } else {
            this._subs_once.push(resolve);
        }
    }

    touch() {
        if (this._val !== undefined) {
            for (let sub of this._subs) {
                sub(this._val);
            }

            for (let sub of this._subs_once) {
                sub(this._val);
            }
            this._subs_once.length = 0;
        }
    }

    until(func) {
        if (this._val === undefined) {
            func();
        }
    }

    watch(func) {
        this._subs.push(func);

        if (this._val !== undefined) {
            func(this._val);
        }
    }
}

function box(val) {
    return new Box(val);
}

function all(list) {
    let children = Array.from(list);
    let values = children.map((c) => c.value);
    let ret = box(values.includes(undefined) ? undefined : values);
    children.forEach((c, i) => {
        c.watch((val) => {
            values[i] = val;
            if (val !== undefined && ret._val !== undefined) {
                ret.touch();
            } else {
                ret.set(undefined);
                if (!values.includes(undefined)) {
                    ret.set(values);
                }
            }
        });
    });

    return ret;
}

function any(list) {
    let children = Array.from(list);
    let values = children.map((c) => c.value);
    let ret = box(values);
    children.forEach((c, i) => {
        c.watch((val) => {
            values[i] = val;
            ret.touch();
        });
    });

    return ret;
}

function thenable(val) {
    return !(val === null || val === undefined) && typeof val.then === "function"
        ? val
        : {
              then: (res) => thenable(res(val)),
          };
}

box.all = all;
box.any = any;
box.thenable = thenable;

return box;
