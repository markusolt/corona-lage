class Day {
    constructor(val) {
        this._val = val;
    }

    add(days) {
        return new Day(this._val + days);
    }

    since(other) {
        return this._val - other._val;
    }

    iso() {
        return new Date(this._val * 8.64e7).toISOString().substr(0, 10);
    }

    week_day() {
        return new Intl.DateTimeFormat(undefined, {
            weekday: "short",
        }).format(new Date(this._val * 8.64e7));
    }
}

function day(str) {
    return new Day(Date.parse(str) / 8.64e7);
}

return day;
