"use strict";const e={};e.box=(()=>{class e{constructor(e){this._val=void 0,this._ver_prev=0,this._ver=0,this._subs=[],this._subs_once=[],this.set(e)}get value(){return this._val}map(e){let a=t(void 0);return this.watch((t=>{a.set(e(t))})),a}set(e){this._ver+=1;let t=this._ver;a(e).then((e=>{this._ver_prev<t&&(this._ver_prev=t,Object.is(this._val,e)||(this._val=e,this.touch()))}))}then(e){if(void 0!==this._val)return a(e(this._val));{let t,a=new Promise((e=>{t=e}));return this._subs_once.push((a=>{t(e(a))})),a}}touch(){if(void 0!==this._val){for(let e of this._subs)e(this._val);for(let e of this._subs_once)e(this._val);this._subs_once.length=0}}until(e){void 0===this._val&&e()}watch(e){this._subs.push(e),void 0!==this._val&&e(this._val)}}function t(t){return new e(t)}function a(e){return null!=e&&"function"==typeof e.then?e:{then:t=>a(t(e))}}return t.all=function(e){let a=Array.from(e),n=a.map((e=>e.value)),r=t(n.includes(void 0)?void 0:n);return a.forEach(((e,t)=>{e.watch((e=>{n[t]=e,void 0!==e&&void 0!==r._val?r.touch():(r.set(void 0),n.includes(void 0)||r.set(n))}))})),r},t.any=function(e){let a=Array.from(e),n=a.map((e=>e.value)),r=t(n);return a.forEach(((e,t)=>{e.watch((e=>{n[t]=e,r.touch()}))})),r},t.thenable=a,t})(),e.hay=(()=>{class e{constructor(){this._everything=new Set,this._map=new Map}insert(e,a){this._everything.add(a);for(let n of t(e))for(let e=0;e<n.length;e++){let t=n.substr(0,e+1);this._map.has(t)||this._map.set(t,new Set),this._map.get(t).add(a)}}find_sets(e){let a=t(e);return 0===a.length?[this._everything]:a.map((e=>this._map.get(e)||new Set))}find(e){return function(e){if(0===e.length)return[];let t=(e=e.filter(((e,t,a)=>a.indexOf(e)===t)).sort(((e,t)=>e.size-t.size))).slice(1);return Array.from(e[0]).filter((e=>t.every((t=>t.has(e)))))}(this.find_sets(e))}}function t(e){return e.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss").split(/[^a-z0-9]+/g).filter(((e,t,a)=>e.length>2&&a.indexOf(e)===t))}return function(){return new e}})(),e.csv=function*(e){let t=function*(e){let t=/(?<val>[^",\n]*("[^"]*"[^",\n]*)*)(?<del>,|\n+|$)/g,a=[];for(let n of e.matchAll(t)){let{val:e,del:t}=n.groups;if(a.push(e.trim().replace(/"/,"").replace(/"([^"]*)"?/g,((e,t)=>'""'===e?'"':t))),","!==t){if(""===t&&1===a.length&&""===a[0])return;yield a,a=[]}}}(e),a=t.next().value;for(let e of t)yield Object.fromEntries(a.map(((t,a)=>[t,e[a]])))},e.leaf=(()=>{const t=e.box;class a{constructor(e){this._node=e}append(e,t){return n(this._node,e,t),this}h1(e,t){return this.append(n(document.createElement("h1"),e),t)}h2(e,t){return this.append(n(document.createElement("h2"),e),t)}h3(e,t){return this.append(n(document.createElement("h3"),e),t)}p(e,t){return this.append(n(document.createElement("p"),e),t)}div(e,t){return this.append(n(document.createElement("div"),e),t)}t(e,t){return this.append(document.createTextNode(e),t)}br(e){return this.append(document.createElement("br"),e)}i(e,t){return this.append(n(document.createElement("i"),e),t)}b(e,t){return this.append(n(document.createElement("b"),e),t)}a(e,t,a){let r=document.createElement("a");return r.href=t,n(r,e),this.append(r,a)}ul(e,t){let a=document.createElement("ul"),r=e&&e[Symbol.iterator]?e:[e];for(let e of r)a.appendChild(n(document.createElement("li"),e));return this.append(a,t)}ol(e,t){let a=document.createElement("ol"),r=e&&e[Symbol.iterator]?e:[e];for(let e of r)a.appendChild(n(document.createElement("li"),e));return this.append(a,t)}pre(e,t){return this.append(n(document.createElement("pre"),e),t)}table(e,a,n){let s=document.createElement("div");s.classList.add("wide");let o=s.appendChild(document.createElement("div"));o.classList.add("padded");let i=o.appendChild(document.createElement("table")),l=i.createTHead().insertRow(),d=i.createTBody();for(let t of e){let e=l.appendChild(document.createElement("th"));r(e).append(t.name),e.classList.toggle("num",t.numeric)}return t.thenable(a).then((t=>{for(let a of t){let t=d.insertRow();for(let n of e){let e=t.insertCell(),r=a[n.field];n.numeric?(e.classList.add("num"),e.classList.toggle("empty",!Number.isFinite(r)||"0"===r.toFixed(n.precision)),e.textContent=Number.isFinite(r)?r.toFixed(n.precision):"-"):(e.classList.toggle("empty",!r),e.textContent=r||"-")}}})),this.append(s,n)}}function n(e,t,n){let r=t instanceof Node?t:t instanceof a?t._node:document.createTextNode(t);return n&&n(r),e.appendChild(r),e}function r(e){return new a(e||document.createDocumentFragment())}return r})(),e.spa=(()=>{let e=()=>!1,t=()=>{};function a(){t(e(window.location.href))}return sessionStorage.href&&(history.replaceState(null,"",sessionStorage.href),sessionStorage.href=""),window.addEventListener("click",(a=>{let n,r;!1===a.altKey&&!1===a.ctrlKey&&!1===a.metaKey&&!1===a.shiftKey&&Boolean(n=function(e){for(;e&&"A"!==e.tagName;)e=e.parentElement;return e}(a.target))&&Boolean(r=e(n.href))&&(a.preventDefault(),n.href!==window.location.href&&history.pushState(null,"",n.href),window.scrollTo(0,0),t(r))})),window.addEventListener("popstate",a),{install:function(n,r){e=n,t=r,a()},refresh:a}})(),e.router=(()=>{const t=e.box,a=e.leaf;let n=[];function r(e,r,s){let o=!1;for(let{pattern:t,func:a}of n){let n=t.exec(e);if(n){o=a.apply(null,n.slice(1).concat([r,s]));break}}t.thenable(o).then((e=>{e||s.h1("Status 404").p("There is nothing here, are you lost?").p(a().a("Go home","/corona-lage/").t("."))}))}return r.add=function(e,t){let a=new RegExp("^"+e.replace(/{}/g,"([^/]+)")+"$");n.push({pattern:a,func:t})},r})(),e.lorem=(()=>{const e=["ac","adipiscing","amet","ante","at","bibendum","blandit","consectetur","curabitur","cursus","dapibus","diam","dictum","dolor","donec","dui","eget","elementum","elit","enim","eros","et","eu","ex","fames","faucibus","finibus","fringilla","hendrerit","iaculis","imperdiet","in","interdum","ipsum","leo","lobortis","lorem","luctus","malesuada","mauris","metus","morbi","nec","neque","nisi","nisl","non","nulla","nunc","orci","phasellus","porttitor","posuere","primis","quisque","sapien","sem","semper","sit","sollicitudin","tempus","tincidunt","turpis","ut","vitae","viverra","vulputate"];return function(t){let a=e[Math.floor(Math.random()*e.length)];return a=a.substring(0,1).toUpperCase()+a.substring(1),a+new Array(t).fill(null).map((()=>e[Math.floor(Math.random()*e.length)])).join(" ")+"."}})(),e.day=(()=>{class e{constructor(e){this._val=e}add(t){return new e(this._val+t)}since(e){return this._val-e._val}iso(){return new Date(864e5*this._val).toISOString().substr(0,10)}week_day(){return new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(new Date(864e5*this._val))}}return function(t){return new e(Date.parse(t)/864e5)}})(),e.api=(()=>{const t=e.box,a=e.csv,n=e.day,r=e.hay;let s={update:null,asof:null,days:null,regions:null,regions_index:null,samples:null},o=t();class i{constructor(){}async update(){let e=(await l("/corona-lage/api/updated?r="+Math.floor(Math.random()*Math.pow(16,4)).toString(16).padStart(4,"0"))).trim();if(s.updated===e)return!1;let t=d("/corona-lage/api/regions/regions.csv?v="+e.replace(/[^0-9]/g,"")),a=d("/corona-lage/api/cases/sum_28.csv?v="+e.replace(/[^0-9]/g,"")),i=new Map,u=r();for(let e of await t){let t={key:e.key,name:e.name,population:Number(e.population)};i.set(t.key,t),u.insert(e.key+" "+e.name+" "+e.words,t)}let c=new Map,p=n(e.substring(0,10)),h=[];for(let e of await a){let t=i.get(e.region),a=p.since(n(e.date));if(!c.has(a)){let e=p.add(-a);c.set(a,{rel:a,iso:e.iso(),week_day:e.week_day()})}let r=c.get(a),s=Number(e.cases),o=Number(e.cases_week_0),l=Number(e.cases_week_7),d=Number(e.cases_total),u=Number(e.deaths),m=Number(e.deaths_week_0),f=Number(e.deaths_week_7),g=Number(e.deaths_total);h.push({reg:t,day:r,measures:{cases:s,cases_w_0:o,cases_w_7:l,cases_total:d,deaths:u,deaths_w_0:m,deaths_w_7:f,deaths_total:g}})}return s={updated:e,asof:p,days:c,regions:i,regions_index:u,samples:h},o.touch(),!0}get updated(){return new Date(s.updated)}get asof(){return s.asof}day(e){if(!s.days.has(e)){let t=s.asof.add(-e);s.days.set(e,{rel:e,iso:t.iso(),week_day:t.week_day()})}return s.days.get(e)}region(e){return s.regions.get(e)}find_regions(e){return s.regions_index.find(e)}samples({reg:e,day:t}){return t=Number.isFinite(t)?this.day(t):t,e&&t?s.samples.filter((a=>a.reg===e&&a.day===t)):e?s.samples.filter((t=>t.reg===e)):t?s.samples.filter((e=>e.day===t)):s.samples}}async function l(e){let t=await fetch(e);return t.ok?t.text():(console.error("Failed to load %o: %o",e,t),"")}async function d(e){return a(await l(e))}return(async()=>{let e=new i;await e.update()&&o.set(e)})(),o})(),e.metrics=(()=>{const t=e.leaf;let a=(()=>{let e=new Map;return{add:function(a,n,r){let s=r.name||a.replace(/(?:[^a-zA-Z0-9]+|^)([a-zA-Z])/g,((e,t)=>" "+t.toUpperCase())).trim();e.set(a,{id:a,name:s,eval:n,precision:r.precision||0,link:()=>t().a(s,"/corona-lage/metric/"+a),synopsis:r.synopsis||(()=>t()),explanation:r.explanation||(()=>t())})},get:function(t){let a=e.get(t);return void 0===a&&console.error("unknown metric %o",t),a},all:function(){return Array.from(e.values())}}})();return a.add("cases",(e=>e.measures.cases),{}),a.add("deaths",(e=>e.measures.deaths),{}),a.add("reproduction",(e=>Math.pow(e.measures.cases_w_0/e.measures.cases_w_7,4/7)),{name:"Rate of Reproduction",precision:3,synopsis:()=>t().p(t().t("The factor by which the number of ").a("new cases","/corona-lage/metric/cases",(e=>{e.classList.add("subtle")})).t(" is multiplied by every ").i("four days").t("."))}),a.add("incidence",(e=>{let t=Math.pow(e.measures.cases_w_0/e.measures.cases_w_7,1/7);return e.measures.cases_w_7/(Math.pow(t,0)+Math.pow(t,1)+Math.pow(t,2)+Math.pow(t,3)+Math.pow(t,4)+Math.pow(t,5)+Math.pow(t,6))*Math.pow(t,13)*7e5/e.reg.population}),{}),a.add("incidence-rki",(e=>1e5*e.measures.cases_w_0/e.reg.population),{name:"Incidence (RKI)",synopsis:()=>t().p(t().t("The average ").a("number of cases","/corona-lage/metric/cases",(e=>{e.classList.add("subtle")})).t(" for the past 7 days per 100.000 people."))}),a.add("deaths_total",(e=>1e6*e.measures.deaths_total/e.reg.population),{name:"Deaths (aggregate)",synopsis:()=>t().p(t().t("The number of deaths per 1.000.000 people."))}),a})(),e.pages=(()=>{const t=e.spa,a=e.leaf,n=e.api,r=e.metrics,s=e.router;function o(e){return a().a(e.name,"/corona-lage/region/"+e.key)}function i(e){let t=document.createElement("span");return t.classList.add("num"),t.textContent=e.toFixed(0).replace(/(\d)(?=(\d\d\d)+(\D|$))/g,"$1 "),t}function l(e,t,a){let n=!1,r=null;async function s(e){if(r=e,!n){for(n=!0;null!==r;){let e=r;r=null,await t(e),await new Promise((e=>setTimeout(e,100)))}n=!1}}s(a||"");let o=document.createElement("input");return o.type="search",o.classList.add("search"),o.placeholder=e,o.spellcheck=!1,o.enterKeyHint="search",o.value=a||"",o.addEventListener("keydown",(e=>{"Escape"===e.key&&(o.value="",s(""),e.preventDefault())})),o.addEventListener("input",(e=>{s(e.target.value)})),o}s.add("/",((e,r)=>(r.h1("Corona-Lage").p(a().t("Welcome to ").i("Corona Lage").t(". This is your daily update of Covid-19 incidence values across Germany.")).p(a().t("You can either select a ").a("region","/corona-lage/region").t(" to see local statistics for the past ").i("28 days").t(", or you can select a ").a("metric","/corona-lage/metric").t(" to see a ranked list of regions.")).append(l("Search for City",(()=>{})),(e=>{e.addEventListener("focus",(()=>{history.pushState(null,"","/corona-lage/region"),t.refresh()}))})).h2("Experiments").p(a().t("These are links to experimental pages for my eyes only. You may visit these pages, but they might not make sense to you.")).ul([a().a("random region","/corona-lage/region/DE",(e=>{n.then((t=>{let a=t.find_regions("");e.href="/corona-lage/region/"+a[Math.floor(Math.random()*a.length)].key}))}))]),!0))),s.add("/region",((e,t)=>{let r=e.filter||"",s=document.createElement("ul"),i=n.then((e=>{let t=[];for(let n of e.find_regions("").sort(((e,t)=>t.population-e.population))){let e=document.createElement("li");e.style.display="none",a(e).append(o(n)),s.appendChild(e),t.push({reg:n,li:e})}return t}));return t.h1("Regions").append(l("Search for City",(e=>{try{history.replaceState(null,"","?filter="+encodeURIComponent(e))}catch{}n.then((t=>{i.then((a=>{let n=""===e.trim()?t.find_regions("").filter((e=>e.key.length<5)):t.find_regions(e).filter((e=>e.key.length>4)),r=new Set(n),s=25;for(let{reg:e,li:t}of a)s>0&&r.has(e)?(s-=1,t.style.display=null):t.style.display="none"}))}))}),r),(e=>{e.autofocus=!0})).append(s),!0})),s.add("/region/{}",((e,t,s)=>n.then((t=>{let n=t.region(e.toUpperCase());if(!n)return!1;let o=["cases","deaths","reproduction","incidence","incidence-rki"].map((e=>r.get(e))),l=t.samples({reg:n,day:0})[0].measures.deaths_total;return s.h1(n.name).p(a().t(n.name+" is a region with a population of ").append(i(n.population)).t(" people. So far, ").append(i(l)).t(" have lost their lives in relation to ").i("Covid-19").t(". Many more had their lives permanently changed for the worse.")).table([{name:"Date",field:"date"},{name:"day",field:"week_day"}].concat(o.map(((e,t)=>({name:e.link(),field:t,numeric:!0,precision:e.precision})))),t.samples({reg:n}).sort(((e,t)=>e.day.rel-t.day.rel)).map((e=>Object.fromEntries([["date",e.day.iso],["week_day",e.day.week_day]].concat(o.map(((t,a)=>[a,t.eval(e)]))))))),!0})))),s.add("/metric",((e,t)=>(t.h1("Metrics").ul(r.all().map((e=>e.link().append(e.synopsis())))),!0))),s.add("/metric/{}",((e,t,s)=>{let o=r.get(e);return!!o&&(s.h1(o.name).append(o.synopsis()).p(a().a("Tell me more","/corona-lage/metric/"+o.id+"/explanation").t(".")).h3("Regions").ul([],(e=>{n.then((t=>{let n=t.samples({day:0}).filter((e=>e.reg.key.length<5)).map((e=>({reg:e.reg,val:o.eval(e)}))).sort(((e,t)=>t.val-e.val));for(let t of n){let n=document.createElement("li");a(n).a(t.reg.name,"/corona-lage/region/"+t.reg.key,(e=>{e.classList.add("subtle")})).t(": ").b(t.val.toFixed(o.precision)),e.appendChild(n)}}))})),!0)})),s.add("/metric/{}/explanation",((e,t,a)=>{let n=r.get(e);return!!n&&(a.h1(n.name).append(n.synopsis()).append(n.explanation()),!0)}))})(),e.main=(()=>{const t=e.spa,a=e.api,n=e.leaf,r=e.router;{document.body.textContent="";let e=document.body.appendChild(document.createElement("main")),s=document.body.appendChild(document.createElement("footer")).appendChild(document.createElement("div"));s.classList.add("signature"),n(s).t("data: ").append(document.createElement("time"),(e=>{e.textContent="...",a.watch((t=>{let a=t.updated;e.dateTime=a,e.textContent=a.toISOString().substring(0,19).replace("T"," ")}))})).br().t("website: ").append(document.createElement("time"),(e=>{let t=new Date("2021-02-28T19:00:47");e.dateTime=t,e.textContent=t.toISOString().substring(0,19).replace("T"," ")})).br().t("source: ").a("github.com","https://github.com/markusolt/corona-lage",(e=>{e.classList.add("subtle")})).br().t("author: ").a("markus","mailto:markus@blaumond.net",(e=>{e.classList.add("subtle")}));let i=location.origin+"/corona-lage";t.install((e=>{if(e.startsWith(i)){let t=e.substring(i.length),{path:a,query:n,tag:r}=/^(?<path>[^\?#]*)(\?(?<query>[^#]*))?(#(?<tag>.*))?$/.exec(t).groups;a="/"+a.split("/").map((e=>decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""))).filter((e=>e.length>0)).join("/"),n=Object.fromEntries((n||"").split("&").map((e=>/(?<key>[^\=]*)(\=(?<val>.*))?/.exec(e).groups)).map((({key:e,val:t})=>[decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""),decodeURIComponent(t||"").trim()])).filter((([e,t])=>e.length>0))),r=decodeURIComponent(r||"").toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,"");Object.keys(n).length>0&&Object.entries(n).map((([e,t])=>e+"="+encodeURIComponent(t))).join("&");return{path:a,query:n}}return null}),(t=>{o(),e.textContent="",n(e).append(document.createElement("article"),(e=>{r(t.path,t.query,n(e))})).p(n().a("home","/corona-lage/"))}))}let s=new Date;function o(){a.value&&new Date-s>6e4&&(s=new Date,a.value.update().then((e=>{e&&t.refresh()})))}window.addEventListener("focus",(()=>{o()}))})();
