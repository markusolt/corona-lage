"use strict";const e={};e.box=(()=>{class e{constructor(e){this._val=void 0,this._ver_prev=0,this._ver=0,this._subs=[],this._subs_once=[],this.set(e)}get value(){return this._val}map(e){let a=t(void 0);return this.watch((t=>{a.set(e(t))})),a}set(e){this._ver+=1;let t=this._ver;a(e).then((e=>{this._ver_prev<t&&(this._ver_prev=t,Object.is(this._val,e)||(this._val=e,this.touch()))}))}then(e){if(void 0!==this._val)return a(e(this._val));{let t,a=new Promise((e=>{t=e}));return this._subs_once.push((a=>{t(e(a))})),a}}touch(){if(void 0!==this._val){for(let e of this._subs)e(this._val);for(let e of this._subs_once)e(this._val);this._subs_once.length=0}}until(e){void 0===this._val&&e()}watch(e){this._subs.push(e),void 0!==this._val&&e(this._val)}}function t(t){return new e(t)}function a(e){return null!=e&&"function"==typeof e.then?e:{then:t=>a(t(e))}}return t.all=function(e){let a=Array.from(e),n=a.map((e=>e.value)),s=t(n.includes(void 0)?void 0:n);return a.forEach(((e,t)=>{e.watch((e=>{n[t]=e,void 0!==e&&void 0!==s._val?s.touch():(s.set(void 0),n.includes(void 0)||s.set(n))}))})),s},t.any=function(e){let a=Array.from(e),n=a.map((e=>e.value)),s=t(n);return a.forEach(((e,t)=>{e.watch((e=>{n[t]=e,s.touch()}))})),s},t.thenable=a,t})(),e.hay=(()=>{class e{constructor(){this._everything=new Set,this._map=new Map}insert(e,a){this._everything.add(a);for(let n of t(e))for(let e=0;e<n.length;e++){let t=n.substr(0,e+1);this._map.has(t)||this._map.set(t,new Set),this._map.get(t).add(a)}}find_sets(e){let a=t(e);return 0===a.length?[this._everything]:a.map((e=>this._map.get(e)||new Set))}find(e){return function(e){if(0===e.length)return[];let t=(e=e.filter(((e,t,a)=>a.indexOf(e)===t)).sort(((e,t)=>e.size-t.size))).slice(1);return Array.from(e[0]).filter((e=>t.every((t=>t.has(e)))))}(this.find_sets(e))}}function t(e){return e.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss").split(/[^a-z0-9]+/g).filter(((e,t,a)=>e.length>2&&a.indexOf(e)===t))}return function(){return new e}})(),e.csv=function*(e){let t=function*(e){let t=/(?<val>[^",\n]*("[^"]*"[^",\n]*)*)(?<del>,|\n+|$)/g,a=[];for(let n of e.matchAll(t)){let{val:e,del:t}=n.groups;if(a.push(e.trim().replace(/"/,"").replace(/"([^"]*)"?/g,((e,t)=>'""'===e?'"':t))),","!==t){if(""===t&&1===a.length&&""===a[0])return;yield a,a=[]}}}(e),a=t.next().value;for(let e of t)yield Object.fromEntries(a.map(((t,a)=>[t,e[a]])))},e.leaf=(()=>{const t=e.box;class a{constructor(e){this._node=e}append(e,t){return n(this._node,e,t),this}h1(e,t){return this.append(n(document.createElement("h1"),e),t)}h2(e,t){return this.append(n(document.createElement("h2"),e),t)}h3(e,t){return this.append(n(document.createElement("h3"),e),t)}p(e,t){return this.append(n(document.createElement("p"),e),t)}div(e,t){return this.append(n(document.createElement("div"),e),t)}t(e,t){return this.append(document.createTextNode(e),t)}br(e){return this.append(document.createElement("br"),e)}i(e,t){return this.append(n(document.createElement("i"),e),t)}b(e,t){return this.append(n(document.createElement("b"),e),t)}a(e,t,a){let s=document.createElement("a");return s.href=t,n(s,e),this.append(s,a)}ul(e,t){let a=document.createElement("ul"),s=e&&e[Symbol.iterator]?e:[e];for(let e of s)a.appendChild(n(document.createElement("li"),e));return this.append(a,t)}ol(e,t){let a=document.createElement("ol"),s=e&&e[Symbol.iterator]?e:[e];for(let e of s)a.appendChild(n(document.createElement("li"),e));return this.append(a,t)}pre(e,t){return this.append(n(document.createElement("pre"),e),t)}table(e,a,n){let r=document.createElement("div");r.classList.add("wide");let i=r.appendChild(document.createElement("div"));i.classList.add("padded");let o=i.appendChild(document.createElement("table")),l=o.createTHead().insertRow(),d=o.createTBody();for(let t of e){let e=l.appendChild(document.createElement("th"));s(e).append(t.name),e.classList.toggle("num",t.numeric)}return t.thenable(a).then((t=>{for(let a of t){let t=d.insertRow();for(let n of e){let e=t.insertCell(),s=a[n.field];n.numeric?(e.classList.add("num"),e.classList.toggle("empty",!Number.isFinite(s)||"0"===s.toFixed(n.precision)),e.textContent=Number.isFinite(s)?s.toFixed(n.precision):"-"):(e.classList.toggle("empty",!s),e.textContent=s||"-")}}})),this.append(r,n)}}function n(e,t,n){let s=t instanceof Node?t:t instanceof a?t._node:document.createTextNode(t);return n&&n(s),e.appendChild(s),e}function s(e){return new a(e||document.createDocumentFragment())}return s})(),e.spa=(()=>{let e=()=>!1,t=()=>{};function a(){t(e(window.location.href))}return sessionStorage.href&&(history.replaceState(null,"",sessionStorage.href),sessionStorage.href=""),window.addEventListener("click",(a=>{let n,s;!1===a.altKey&&!1===a.ctrlKey&&!1===a.metaKey&&!1===a.shiftKey&&Boolean(n=function(e){for(;e&&"A"!==e.tagName;)e=e.parentElement;return e}(a.target))&&Boolean(s=e(n.href))&&(a.preventDefault(),n.href!==window.location.href&&history.pushState(null,"",n.href),window.scrollTo(0,0),t(s))})),window.addEventListener("popstate",a),{install:function(n,s){e=n,t=s,a()},refresh:a}})(),e.router=(()=>{const t=e.box,a=e.leaf;let n=[];function s(e,s,r){let i=!1;for(let{pattern:t,func:a}of n){let n=t.exec(e);if(n){i=a.apply(null,n.slice(1).concat([s,r]));break}}t.thenable(i).then((e=>{e||r.h1("Status 404").p("There is nothing here, are you lost?").p(a().a("Go home","/corona-lage/").t("."))}))}return s.add=function(e,t){let a=new RegExp("^"+e.replace(/{}/g,"([^/]+)")+"$");n.push({pattern:a,func:t})},s})(),e.lorem=(()=>{const e=["ac","adipiscing","amet","ante","at","bibendum","blandit","consectetur","curabitur","cursus","dapibus","diam","dictum","dolor","donec","dui","eget","elementum","elit","enim","eros","et","eu","ex","fames","faucibus","finibus","fringilla","hendrerit","iaculis","imperdiet","in","interdum","ipsum","leo","lobortis","lorem","luctus","malesuada","mauris","metus","morbi","nec","neque","nisi","nisl","non","nulla","nunc","orci","phasellus","porttitor","posuere","primis","quisque","sapien","sem","semper","sit","sollicitudin","tempus","tincidunt","turpis","ut","vitae","viverra","vulputate"];return function(t){let a=e[Math.floor(Math.random()*e.length)];return a=a.substring(0,1).toUpperCase()+a.substring(1),a+new Array(t).fill(null).map((()=>e[Math.floor(Math.random()*e.length)])).join(" ")+"."}})(),e.day=(()=>{class e{constructor(e){this._val=e}add(t){return new e(this._val+t)}since(e){return this._val-e._val}iso(){return new Date(864e5*this._val).toISOString().substr(0,10)}week_day(){return new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(new Date(864e5*this._val))}}return function(t){return new e(Date.parse(t)/864e5)}})(),e.api=(()=>{const t=e.box,a=e.csv,n=e.day,s=e.hay;let r={update:null,asof:null,days:null,regions:null,regions_index:null,samples:null},i=t();class o{constructor(){}async update(){let e=(await l("/corona-lage/api/updated?r="+Math.floor(Math.random()*Math.pow(16,4)).toString(16).padStart(4,"0"))).trim();if(r.updated===e)return!1;let t=d("/corona-lage/api/regions/regions.csv?v="+e.replace(/[^0-9]/g,"")),a=d("/corona-lage/api/cases/sum_21.csv?v="+e.replace(/[^0-9]/g,"")),o=new Map,c=s();for(let e of await t){let t={key:e.key,name:e.name,population:Number(e.population)};o.set(t.key,t),c.insert(e.key+" "+e.name+" "+e.words,t)}let u=new Map,p=n(e.substring(0,10)),h=[];for(let e of await a){let t=o.get(e.region),a=p.since(n(e.date));if(!u.has(a)){let e=p.add(-a);u.set(a,{rel:a,iso:e.iso(),week_day:e.week_day()})}let s=u.get(a),r=Number(e.cases),i=Number(e.cases_week_0),l=Number(e.cases_week_7),d=Number(e.cases_md_week_0),c=Number(e.cases_md_week_7),m=Number(e.cases_total),f=Number(e.deaths),g=Number(e.deaths_week_0),y=Number(e.deaths_week_7),_=Number(e.deaths_total);h.push({reg:t,day:s,measures:{cases:r,cases_w_0:i,cases_w_7:l,cases_md_w_0:d,cases_md_w_7:c,cases_total:m,deaths:f,deaths_w_0:g,deaths_w_7:y,deaths_total:_}})}return r={updated:e,asof:p,days:u,regions:o,regions_index:c,samples:h},i.touch(),!0}get updated(){return new Date(r.updated)}get asof(){return r.asof}day(e){if(!r.days.has(e)){let t=r.asof.add(-e);r.days.set(e,{rel:e,iso:t.iso(),week_day:t.week_day()})}return r.days.get(e)}region(e){return r.regions.get(e)}find_regions(e){return r.regions_index.find(e)}samples({reg:e,day:t}){return t=Number.isFinite(t)?this.day(t):t,e&&t?r.samples.filter((a=>a.reg===e&&a.day===t)):e?r.samples.filter((t=>t.reg===e)):t?r.samples.filter((e=>e.day===t)):r.samples}}async function l(e){let t=await fetch(e);return t.ok?t.text():(console.error("Failed to load %o: %o",e,t),"")}async function d(e){return a(await l(e))}return(async()=>{let e=new o;await e.update()&&i.set(e)})(),i})(),e.metrics=(()=>{const t=e.leaf;let a=(()=>{let e=new Map;return{add:function(a,n,s){let r=s.name||a.replace(/(?:[^a-zA-Z0-9]+|^)([a-zA-Z])/g,((e,t)=>" "+t.toUpperCase())).trim();e.set(a,{id:a,name:r,eval:n,precision:s.precision||0,link:()=>t().a(r,"/corona-lage/metric/"+a),synopsis:s.synopsis||(()=>t()),explanation:s.explanation||(()=>t())})},get:function(t){let a=e.get(t);return void 0===a&&console.error("unknown metric %o",t),a},all:function(){return Array.from(e.values())}}})();return a.add("new_cases",(e=>e.measures.cases),{name:"Cases",precision:0,synopsis:()=>t().p(t().t("The number of new ").i("Covid-19").t(" cases published by the ").i("RKI").t(" on this day with a reporting date that is no older than ").i("five days").t(". Cases published more than ").i("five days").t(" after their reporting date are ignored."))}),a.add("new_cases_7d",(e=>e.measures.cases_w_0),{name:"Cases (7 days)",precision:0,synopsis:()=>t().p(t().t("The number of ").a("cases","/corona-lage/metric/new_cases",(e=>{e.classList.add("subtle")})).t(" during the past ").i("seven days").t(". This value is the absolute number of cases, and is not adjusted for population size."))}),a.add("new_deaths",(e=>e.measures.deaths),{name:"Deaths",precision:0,synopsis:()=>t().p(t().t("The number of new deaths related to ").i("Covid-19").t(" published by the ").i("RKI").t(" on this day."))}),a.add("new_deaths_7d",(e=>e.measures.deaths_w_0),{name:"Deaths (7 days)",precision:0,synopsis:()=>t().p(t().t("The number of ").a("deaths","/corona-lage/metric/new_deaths",(e=>{e.classList.add("subtle")})).t(" during the past ").i("seven days").t("."))}),a.add("r",(e=>Math.pow(Math.max(0,e.measures.cases_w_0)/Math.max(1,e.measures.cases_w_7),5/7)),{name:"R (5 days)",precision:2,synopsis:()=>t().p(t().t("The ").i("rate of reproduction").t(" is the factor by which the number of ").a("cases","/corona-lage/metric/new_cases",(e=>{e.classList.add("subtle")})).t(" seems to multiply by every ").i("five days").t(". It is computed by comparing the total number of cases of the past ").i("7 days").t(" with the total number of cases of the prior ").i("7 days").t("."))}),a.add("incidence",(e=>{let t=Math.pow(Math.max(0,e.measures.cases_w_0)/Math.max(1,e.measures.cases_w_7),1/7);return Math.max(1,e.measures.cases_w_7)/(Math.pow(t,0)+Math.pow(t,1)+Math.pow(t,2)+Math.pow(t,3)+Math.pow(t,4)+Math.pow(t,5)+Math.pow(t,6))*Math.pow(t,13)*7e5/e.reg.population}),{name:"Incidence (Exp)",precision:0,synopsis:()=>t().p(t().t("The number of ").a("cases","/corona-lage/metric/new_cases",(e=>{e.classList.add("subtle")})).t(" per ").i("700.000").t(" people. The value is smoothed by reordering the number of daily cases over the previous 14 days so that they form an exponential curve, respecting the current value of ").a("r","/corona-lage/metric/r",(e=>{e.classList.add("subtle")})).t(". The value of the last day is used to compute the incidence.")).p(t().t("This is different from the ").a("official incidence","/corona-lage/metric/incidence_rki",(e=>{e.classList.add("subtle")})).t("."))}),a.add("incidence_rki",(e=>1e5*e.measures.cases_md_w_0/e.reg.population),{name:"Incidence",precision:0,synopsis:()=>t().p(t().t("The official incidence of ").i("Covid-19").t(" as reported by the ").a("RKI","https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html").t("."))}),a.add("deaths_r",(e=>Math.pow(Math.max(0,e.measures.deaths_w_0)/Math.max(1,e.measures.deaths_w_7),5/7)),{name:"R (Deaths)",precision:2,synopsis:()=>t().p(t().t("The ").i("rate of reproduction of deaths").t(" is the factor by which the number of ").a("deaths","/corona-lage/metric/new_deaths",(e=>{e.classList.add("subtle")})).t(" seems to multiply by every ").i("five days").t(". This is similar to the metric ").a("R","/corona-lage/metric/r",(e=>{e.classList.add("subtle")})).t("."))}),a.add("deaths_total",(e=>e.measures.deaths_total),{name:"Total Number of Deaths",precision:0,synopsis:()=>t().p(t().t("The total number of ").i("Covid-19").t(" related deaths."))}),a})(),e.pages=(()=>{const t=e.spa,a=e.leaf,n=e.api,s=e.metrics,r=e.router;function i(e){return a().a(e.name,"/corona-lage/region/"+e.key)}function o(e,t,a){let n=!1,s=null;async function r(e){if(s=e,!n){for(n=!0;null!==s;){let e=s;s=null,await t(e),await new Promise((e=>setTimeout(e,100)))}n=!1}}r(a||"");let i=document.createElement("input");return i.type="search",i.classList.add("search"),i.placeholder=e,i.spellcheck=!1,i.enterKeyHint="search",i.value=a||"",i.addEventListener("keydown",(e=>{"Escape"===e.key&&(i.value="",r(""),e.preventDefault())})),i.addEventListener("input",(e=>{r(e.target.value)})),i}r.add("/",((e,s)=>(s.h1("Corona-Lage").p(a().t("Welcome to ").i("Corona Lage").t(". This is your daily update of Covid-19 incidence values across Germany.")).p(a().t("You can either select a ").a("region","/corona-lage/region").t(" to see local statistics for the past ").i("21 days").t(", or you can select a ").a("metric","/corona-lage/metric").t(" to see a ranked list of regions.")).append(o("Search for City",(()=>{})),(e=>{e.addEventListener("focus",(()=>{history.pushState(null,"","/corona-lage/region"),t.refresh()}))})).h2("Downloads").p(a().t("You are welcome to download the data directly as ").i("csv").t(" files. These files are updated every day some time in the morning. You can check ").a("here","/corona-lage/api/updated").t(" to see when these files were last updated. Here is a short overview of the available tables.")).ul([a().a("regions.csv","/corona-lage/api/regions/regions.csv").p(a().t("Definitions of the ").i("412").t(" counties and ").i("17").t(" hierarchy regions.")),a().a("cases.csv","/corona-lage/api/cases/cases.csv").p(a().t("The raw source data listing all cases and deaths published by the RKI since ").i("2020-10-24").t(". Cases and deaths published before that date are also included, but their value in the ").i("date").t(" column is null. This column documents when a case was first published by the RKI, which is not always the day after the ").i("rep_date").t(". Please be aware that this is a very large table and can probably not be opened in Excel.")),a().a("sum.csv","/corona-lage/api/cases/sum.csv").p(a().t("This is a convinient table that summarizes the published cases and deaths by region and publishing date. The information about gender and age group is not available. To experiment with this table it is recommended to use ").a("sum_21.csv","/corona-lage/api/cases/sum_21.csv").t(" which only contains data for the past ").i("21").t(" days."))]).h2("Experiments").p(a().t("These are links to experimental pages for my eyes only. You may visit these pages, but they might not make sense to you.")).ul([a().a("random region","/corona-lage/region/DE",(e=>{n.then((t=>{let a=t.find_regions("");e.href="/corona-lage/region/"+a[Math.floor(Math.random()*a.length)].key}))}))]),!0))),r.add("/region",((e,t)=>{let s=e.filter||"",r=document.createElement("ul"),l=n.then((e=>{let t=[];for(let n of e.find_regions("").sort(((e,t)=>t.population-e.population))){let e=document.createElement("li");e.style.display="none",a(e).append(i(n)),r.appendChild(e),t.push({reg:n,li:e})}return t}));return t.h1("Regions").append(o("Search for City",(e=>{try{history.replaceState(null,"","?filter="+encodeURIComponent(e))}catch{}n.then((t=>{l.then((a=>{let n=""===e.trim()?t.find_regions("").filter((e=>e.key.length<5)):t.find_regions(e).filter((e=>e.key.length>4)),s=new Set(n),r=25;for(let{reg:e,li:t}of a)r>0&&s.has(e)?(r-=1,t.style.display=null):t.style.display="none"}))}))}),s),(e=>{e.autofocus=!0})).append(r),!0})),r.add("/region/{}",((e,t,r)=>n.then((t=>{let n=t.region(e.toUpperCase());if(!n)return!1;let i=["incidence_rki","r","deaths_r","new_cases","new_deaths"].map((e=>s.get(e))),o=t.samples({reg:n}).sort(((e,t)=>e.day.rel-t.day.rel));return r.h1(n.name).p(a().t(n.name+" is a region with a population of ").append(function(e){let t=document.createElement("span");return t.classList.add("num"),t.textContent=e.toFixed(0).replace(/(\d)(?=(\d\d\d)+(\D|$))/g,"$1 "),t}(n.population)).t(" people.")).table([{name:"Date",field:"date"},{name:"day",field:"week_day"}].concat(i.map(((e,t)=>({name:e.link(),field:t,numeric:!0,precision:e.precision})))),o.map((e=>Object.fromEntries([["date",e.day.iso],["week_day",e.day.week_day]].concat(i.map(((t,a)=>[a,t.eval(e)]))))))),!0})))),r.add("/metric",((e,t)=>(t.h1("Metrics").ul(s.all().map((e=>e.link().append(e.synopsis())))),!0))),r.add("/metric/{}",((e,t,r)=>{let i=s.get(e);return!!i&&(r.h1(i.name).append(i.synopsis()).h3("Regions").ul([],(e=>{n.then((t=>{let n=t.samples({day:0}).filter((e=>e.reg.key.length<5)).map((e=>({reg:e.reg,val:i.eval(e)}))).sort(((e,t)=>t.val-e.val));for(let t of n){let n=document.createElement("li");a(n).a(t.reg.name,"/corona-lage/region/"+t.reg.key,(e=>{e.classList.add("subtle")})).t(": ").b(t.val.toFixed(i.precision)),e.appendChild(n)}}))})),!0)})),r.add("/metric/{}/explanation",((e,t,a)=>{let n=s.get(e);return!!n&&(a.h1(n.name).append(n.synopsis()).append(n.explanation()),!0)}))})(),e.main=(()=>{const t=e.spa,a=e.api,n=e.leaf,s=e.router;{document.body.textContent="";let e=document.body.appendChild(document.createElement("main")),r=document.body.appendChild(document.createElement("footer")).appendChild(document.createElement("div"));r.classList.add("signature"),n(r).t("data: ").append(document.createElement("time"),(e=>{e.textContent="...",a.watch((t=>{let a=t.updated;e.dateTime=a,e.textContent=a.toISOString().substring(0,19).replace("T"," ")}))})).br().t("website: ").append(document.createElement("time"),(e=>{let t=new Date("2021-07-14T22:04:53");e.dateTime=t,e.textContent=t.toISOString().substring(0,19).replace("T"," ")})).br().t("source: ").a("github.com","https://github.com/markusolt/corona-lage",(e=>{e.classList.add("subtle")})).br().t("author: ").a("markus","mailto:markus@blaumond.net",(e=>{e.classList.add("subtle")}));let o=location.origin+"/corona-lage";t.install((e=>{if(e.startsWith(o)){let t=e.substring(o.length),{path:a,query:n,tag:s}=/^(?<path>[^\?#]*)(\?(?<query>[^#]*))?(#(?<tag>.*))?$/.exec(t).groups;a="/"+a.split("/").map((e=>decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""))).filter((e=>e.length>0)).join("/"),n=Object.fromEntries((n||"").split("&").map((e=>/(?<key>[^\=]*)(\=(?<val>.*))?/.exec(e).groups)).map((({key:e,val:t})=>[decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""),decodeURIComponent(t||"").trim()])).filter((([e,t])=>e.length>0))),s=decodeURIComponent(s||"").toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,"");Object.keys(n).length>0&&Object.entries(n).map((([e,t])=>e+"="+encodeURIComponent(t))).join("&");return{path:a,query:n}}return null}),(t=>{i(),e.textContent="",n(e).append(document.createElement("article"),(e=>{s(t.path,t.query,n(e))})).p(n().a("home","/corona-lage/"))}))}let r=new Date;function i(){a.value&&new Date-r>6e4&&(r=new Date,a.value.update().then((e=>{e&&t.refresh()})))}window.addEventListener("focus",(()=>{i()}))})();
