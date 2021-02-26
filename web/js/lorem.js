const words = [
    "ac",
    "adipiscing",
    "amet",
    "ante",
    "at",
    "bibendum",
    "blandit",
    "consectetur",
    "curabitur",
    "cursus",
    "dapibus",
    "diam",
    "dictum",
    "dolor",
    "donec",
    "dui",
    "eget",
    "elementum",
    "elit",
    "enim",
    "eros",
    "et",
    "eu",
    "ex",
    "fames",
    "faucibus",
    "finibus",
    "fringilla",
    "hendrerit",
    "iaculis",
    "imperdiet",
    "in",
    "interdum",
    "ipsum",
    "leo",
    "lobortis",
    "lorem",
    "luctus",
    "malesuada",
    "mauris",
    "metus",
    "morbi",
    "nec",
    "neque",
    "nisi",
    "nisl",
    "non",
    "nulla",
    "nunc",
    "orci",
    "phasellus",
    "porttitor",
    "posuere",
    "primis",
    "quisque",
    "sapien",
    "sem",
    "semper",
    "sit",
    "sollicitudin",
    "tempus",
    "tincidunt",
    "turpis",
    "ut",
    "vitae",
    "viverra",
    "vulputate",
];

function lorem(num) {
    let first = words[Math.floor(Math.random() * words.length)];
    first = first.substring(0, 1).toUpperCase() + first.substring(1);

    return (
        first +
        new Array(num)
            .fill(null)
            .map(() => words[Math.floor(Math.random() * words.length)])
            .join(" ") +
        "."
    );
}

return lorem;
