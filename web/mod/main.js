const spa = use.spa;
const lorem = use.lorem;

if (sessionStorage.href) {
    history.replaceState(null, "", sessionStorage.href);
    sessionStorage.href = "";
}

{
    let origin = location.origin + "{HOME}";
    spa.install(
        (url) => {
            if (url.startsWith(origin)) {
                return url.substring(origin.length);
            }
        },
        (args) => {
            document.body.innerHTML = "";
            let main = document.body.appendChild(document.createElement("main"));

            main.appendChild(document.createElement("h1")).textContent = args;
            let intro = main.appendChild(document.createElement("p"));
            intro.appendChild(document.createTextNode("Welcome to "));
            intro.appendChild(document.createElement("i")).textContent = "Corona Lage";
            intro.appendChild(
                document.createTextNode(". This is the daily update of Covid-19 incidence values across Germany. You can visit ")
            );
            intro.appendChild(hlink("the overview page", "{HOME}/overview"));
            intro.appendChild(document.createTextNode(" for more details. Or go to a "));
            intro.appendChild(
                hlink(
                    "random page",
                    "{HOME}/" +
                        lorem(rand_between(0, 4))
                            .toLowerCase()
                            .replace(/[^a-z ]+/g, "")
                            .replace(/ /g, "/")
                )
            );
            intro.appendChild(document.createTextNode("."));

            let ul = main.appendChild(document.createElement("ul"));
            for (let i = rand_between(3, 12); i > 0; i--) {
                ul.appendChild(document.createElement("li")).textContent = lorem(rand_between(5, 20));
            }
            main.appendChild(document.createElement("p")).textContent = lorem(rand_between(30, 70));

            let footer = document.body.appendChild(document.createElement("footer"));
            footer.textContent = "markus";
        }
    );
}

function rand_between(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function hlink(title, href) {
    let a = document.createElement("a");
    a.title = title;
    a.textContent = title;
    a.href = href;

    return a;
}

/*
let page = Page.empty();
page
    .header()
    .title("Welcome")
    .text("lorem ipsum")
    .a("click me", "/target")
    .text(".")
    .p()
    .inline("/legal")
    .footer();
*/
