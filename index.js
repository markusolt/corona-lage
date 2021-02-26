"use strict";const e={};e.box=(()=>{class e{constructor(e){this._val=void 0,this._ver_prev=0,this._ver=0,this._subs=[],this._subs_once=[],this.set(e)}get value(){return this._val}map(e){let n=t(void 0);return this.watch((t=>{n.set(e(t))})),n}set(e){this._ver+=1;let t=this._ver;n(e).then((e=>{this._ver_prev<t&&(this._ver_prev=t,Object.is(this._val,e)||(this._val=e,this.touch()))}))}then(e){if(void 0!==this._val)return n(e(this._val));{let t,n=new Promise((e=>{t=e}));return this._subs_once.push((n=>{t(e(n))})),n}}touch(){if(void 0!==this._val){for(let e of this._subs)e(this._val);for(let e of this._subs_once)e(this._val);this._subs_once.length=0}}until(e){void 0===this._val&&e()}watch(e){this._subs.push(e),void 0!==this._val&&e(this._val)}}function t(t){return new e(t)}function n(e){return null!=e&&"function"==typeof e.then?e:{then:t=>n(t(e))}}return t.all=function(e){let n=Array.from(e),a=n.map((e=>e.value)),r=t(a.includes(void 0)?void 0:a);return n.forEach(((e,t)=>{e.watch((e=>{a[t]=e,void 0!==e&&void 0!==r._val?r.touch():(r.set(void 0),a.includes(void 0)||r.set(a))}))})),r},t.any=function(e){let n=Array.from(e),a=n.map((e=>e.value)),r=t(a);return n.forEach(((e,t)=>{e.watch((e=>{a[t]=e,r.touch()}))})),r},t.thenable=n,t})(),e.hay=(()=>{class e{constructor(){this._everything=new Set,this._map=new Map}insert(e,n){this._everything.add(n);for(let a of t(e))for(let e=0;e<a.length;e++){let t=a.substr(0,e+1);this._map.has(t)||this._map.set(t,new Set),this._map.get(t).add(n)}}find_sets(e){let n=t(e);return 0===n.length?[this._everything]:n.map((e=>this._map.get(e)||new Set))}find(e){return function(e){if(0===e.length)return[];let t=(e=e.filter(((e,t,n)=>n.indexOf(e)===t)).sort(((e,t)=>e.size-t.size))).slice(1);return Array.from(e[0]).filter((e=>t.every((t=>t.has(e)))))}(this.find_sets(e))}}function t(e){return e.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss").split(/[^a-z0-9]+/g).filter(((e,t,n)=>e.length>2&&n.indexOf(e)===t))}return function(){return new e}})(),e.csv=function*(e){let t=function*(e){let t=/(?<val>[^",\n]*("[^"]*"[^",\n]*)*)(?<del>,|\n+|$)/g,n=[];for(let a of e.matchAll(t)){let{val:e,del:t}=a.groups;if(n.push(e.trim().replace(/"/,"").replace(/"([^"]*)"?/g,((e,t)=>'""'===e?'"':t))),","!==t){if(""===t&&1===n.length&&""===n[0])return;yield n,n=[]}}}(e),n=t.next().value;for(let e of t)yield Object.fromEntries(n.map(((t,n)=>[t,e[n]])))},e.leaf=(()=>{const t=e.box;class n{constructor(e){this._node=e}append(e,t){return a(this._node,e,t),this}h1(e,t){return this.append(a(document.createElement("h1"),e),t)}h2(e,t){return this.append(a(document.createElement("h2"),e),t)}h3(e,t){return this.append(a(document.createElement("h3"),e),t)}p(e,t){return this.append(a(document.createElement("p"),e),t)}div(e,t){return this.append(a(document.createElement("div"),e),t)}t(e,t){return this.append(document.createTextNode(e),t)}br(e){return this.append(document.createElement("br"),e)}i(e,t){return this.append(a(document.createElement("i"),e),t)}b(e,t){return this.append(a(document.createElement("b"),e),t)}a(e,t,n){let r=document.createElement("a");return r.href=t,a(r,e),this.append(r,n)}ul(e,t){let n=document.createElement("ul"),r=e&&e[Symbol.iterator]?e:[e];for(let e of r)n.appendChild(a(document.createElement("li"),e));return this.append(n,t)}pre(e,t){return this.append(a(document.createElement("pre"),e),t)}table(e,n,a){let r=document.createElement("div");r.classList.add("wide");let s=r.appendChild(document.createElement("div"));s.classList.add("padded");let o=s.appendChild(document.createElement("table")),i=o.createTHead().insertRow(),l=o.createTBody();for(let t of e){let e=i.appendChild(document.createElement("th"));e.textContent=t.name,e.classList.toggle("num",t.numeric)}return t.thenable(n).then((t=>{for(let n of t){let t=l.insertRow();for(let a of e){let e=t.insertCell(),r=n[a.field];a.numeric?(e.classList.add("num"),e.classList.toggle("empty",!Number.isFinite(r)||"0"===r.toFixed(a.precision)),e.textContent=Number.isFinite(r)?r.toFixed(a.precision):"-"):(e.classList.toggle("empty",!r),e.textContent=r||"-")}}})),this.append(r,a)}}function a(e,t,a){let r=t instanceof Node?t:t instanceof n?t._node:document.createTextNode(t);return a&&a(r),e.appendChild(r),e}return function(e){return new n(e||document.createDocumentFragment())}})(),e.router=(()=>{const t=e.box,n=e.leaf;let a=[];function r(e,r,s){let o=!1;for(let{pattern:t,func:n}of a){let a=t.exec(e);if(a){o=n.apply(null,a.slice(1).concat([r,s]));break}}t.thenable(o).then((e=>{e||s.h1("Status 404").p("There is nothing here, are you lost?").p(n().a("Go home","/corona-lage/").t("."))}))}return r.add=function(e,t){let n=new RegExp("^"+e.replace(/{}/g,"([^/]+)")+"$");a.push({pattern:n,func:t})},r})(),e.lorem=(()=>{const e=["ac","adipiscing","amet","ante","at","bibendum","blandit","consectetur","curabitur","cursus","dapibus","diam","dictum","dolor","donec","dui","eget","elementum","elit","enim","eros","et","eu","ex","fames","faucibus","finibus","fringilla","hendrerit","iaculis","imperdiet","in","interdum","ipsum","leo","lobortis","lorem","luctus","malesuada","mauris","metus","morbi","nec","neque","nisi","nisl","non","nulla","nunc","orci","phasellus","porttitor","posuere","primis","quisque","sapien","sem","semper","sit","sollicitudin","tempus","tincidunt","turpis","ut","vitae","viverra","vulputate"];return function(t){let n=e[Math.floor(Math.random()*e.length)];return n=n.substring(0,1).toUpperCase()+n.substring(1),n+new Array(t).fill(null).map((()=>e[Math.floor(Math.random()*e.length)])).join(" ")+"."}})(),e.day=(()=>{class e{constructor(e){this._val=e}add(t){return new e(this._val+t)}since(e){return this._val-e._val}iso(){return new Date(864e5*this._val).toISOString().substr(0,10)}week_day(){return new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(new Date(864e5*this._val))}}return function(t){return new e(Date.parse(t)/864e5)}})(),e.api=(()=>{const t=e.box,n=e.csv,a=e.day,r=e.hay;let s={update:null,asof:null,days:null,regions:null,regions_index:null,samples:null},o=t();class i{constructor(){}async update(){let e=(await l("/corona-lage/api/updated?r="+Math.floor(Math.random()*Math.pow(16,4)).toString(16).padStart(4,"0"))).trim();if(s.updated===e)return!1;let t=d("/corona-lage/api/regions/regions.csv?v="+e.replace(/[^0-9]/g,"")),n=d("/corona-lage/api/cases/sum_28.csv?v="+e.replace(/[^0-9]/g,"")),i=new Map,c=r();for(let e of await t){let t={key:e.key,name:e.name,population:Number(e.population)};i.set(t.key,t),c.insert(e.key+" "+e.name+" "+e.words,t)}let u=new Map,p=a(e.substring(0,10)),h=[];for(let e of await n){let t=i.get(e.region),n=p.since(a(e.date));if(!u.has(n)){let e=p.add(-n);u.set(n,{rel:n,iso:e.iso(),week_day:e.week_day()})}let r=u.get(n),s=Number(e.cases),o=Number(e.cases_week_0),l=Number(e.cases_week_7),d=Number(e.cases_total),c=Number(e.deaths),m=Number(e.deaths_week_0),f=Number(e.deaths_week_7),g=Number(e.deaths_total);h.push({reg:t,day:r,measures:{cases:s,cases_w_0:o,cases_w_7:l,cases_total:d,deaths:c,deaths_w_0:m,deaths_w_7:f,deaths_total:g}})}return s={updated:e,asof:p,days:u,regions:i,regions_index:c,samples:h},o.touch(),!0}get updated(){return new Date(s.updated)}get asof(){return s.asof}day(e){if(!s.days.has(e)){let t=s.asof.add(-e);s.days.set(e,{rel:e,iso:t.iso(),week_day:t.week_day()})}return s.days.get(e)}region(e){return s.regions.get(e)}find_regions(e){return s.regions_index.find(e)}samples({reg:e,day:t}){return t=Number.isFinite(t)?this.day(t):t,e&&t?s.samples.filter((n=>n.reg===e&&n.day===t)):e?s.samples.filter((t=>t.reg===e)):t?s.samples.filter((e=>e.day===t)):s.samples}}async function l(e){let t=await fetch(e);return t.ok?t.text():(console.error("Failed to load %o: %o",e,t),"")}async function d(e){return n(await l(e))}return(async()=>{let e=new i;await e.update()&&o.set(e)})(),o})(),e.metrics=(()=>{const t=e.leaf;let n=new Map;return n.set("cases",{name:"Cases",eval:e=>e.measures.cases,precision:0,synopsis:()=>t(),explanation:()=>t()}),n.set("deaths",{name:"Deaths",eval:e=>e.measures.deaths,precision:0,synopsis:()=>t(),explanation:()=>t()}),n.set("reproduction",{name:"Rate of Reproduction",eval:e=>Math.pow(e.measures.cases_w_0/e.measures.cases_w_7,4/7),precision:3,synopsis:()=>t().p(t().t("The factor by which the number of ").a("new cases","/corona-lage/metric/cases").t(" is multiplied by every ").i("four days").t(".")),explanation:()=>t().t("<explanation>")}),n.set("incidence",{name:"Incidence",eval:e=>{let t=Math.pow(e.measures.cases_w_0/e.measures.cases_w_7,1/7);return e.measures.cases_w_7/(Math.pow(t,0)+Math.pow(t,1)+Math.pow(t,2)+Math.pow(t,3)+Math.pow(t,4)+Math.pow(t,5)+Math.pow(t,6))*Math.pow(t,13)*7e5/e.reg.population},precision:0,synopsis:()=>t(),explanation:()=>t()}),n.set("incidence-rki",{name:"Incidence (RKI)",eval:e=>1e5*e.measures.cases_w_0/e.reg.population,precision:0,synopsis:()=>t().p(t().t("The average ").a("number of cases","/corona-lage/metric/cases").t(" for the past 7 days per 100.000 people.")),explanation:()=>t()}),n.set("deaths_total",{name:"Deaths",eval:e=>1e6*e.measures.deaths_total/e.reg.population,precision:0,synopsis:()=>t().p(t().t("The number of deaths per 1.000.000 people.")),explanation:()=>t()}),n})(),e.pages=(()=>{const t=e.leaf,n=e.api,a=e.metrics,r=e.router;function s(e){return t().a(e.name,"/corona-lage/region/"+e.key)}function o(e){let t=document.createElement("span");return t.classList.add("num"),t.textContent=e.toFixed(0).replace(/(\d)(?=(\d\d\d)+(\D|$))/g,"$1 "),t}r.add("/",((e,r)=>(r.h1("Welcome").p(t().t("Welcome to ").i("Corona Lage").t(". This is your daily update of Covid-19 incidence values across Germany. Go ahead and select a ").a("region","/corona-lage/region/").t(" here.")).ul(Array.from(a.entries()).map((([e,n])=>t().a(n.name,"/corona-lage/metric/"+e)))).p(t().t("Or go to a ").a("random region","/corona-lage/region/DE",(e=>{n.then((t=>{let n=t.find_regions("");e.href="/corona-lage/region/"+n[Math.floor(Math.random()*n.length)].key}))})).t(".")),!0))),r.add("/region",((e,a)=>{let r=e.filter||"",o=document.createElement("ul"),i=n.then((e=>{let n=[];for(let a of e.find_regions("").sort(((e,t)=>t.population-e.population))){let e=document.createElement("li");e.style.display="none",t(e).append(s(a)),o.appendChild(e),n.push({reg:a,li:e})}return n}));return a.h1("Regions").append(function(e,t,n){let a=!1,r=null;async function s(e){if(r=e,!a){for(a=!0;null!==r;){let e=r;r=null,await t(e),await new Promise((e=>setTimeout(e,100)))}a=!1}}s(n||"");let o=document.createElement("input");return o.type="search",o.classList.add("search"),o.placeholder=e,o.spellcheck=!1,o.enterKeyHint="search",o.value=n||"",o.addEventListener("keydown",(e=>{"Escape"===e.key&&(o.value="",s(""),e.preventDefault())})),o.addEventListener("input",(e=>{s(e.target.value)})),o}("filter",(e=>{try{history.replaceState(null,"","?filter="+encodeURIComponent(e))}catch{}n.then((t=>{i.then((n=>{let a=0,r=new Set(t.find_regions(e));for(let{reg:e,li:t}of n)a<25&&r.has(e)?(a+=1,t.style.display=null):t.style.display="none"}))}))}),r)).append(o),!0})),r.add("/region/{}",((e,r,s)=>n.then((n=>{let r=n.region(e.toUpperCase());if(!r)return!1;let i=[a.get("cases"),a.get("deaths"),a.get("reproduction"),a.get("incidence"),a.get("incidence-rki")],l=n.samples({reg:r,day:0})[0].measures.deaths_total;return s.h1(r.name).p(t().t(r.name+" is a region with a population of ").append(o(r.population)).t(" people. So far, ").append(o(l)).t(" have lost their lives in relation to ").i("Covid-19").t(". Many more had their lives permanently changed for the worse.")).table([{name:"Date",field:"date"},{name:"day",field:"week_day"}].concat(i.map(((e,t)=>({name:e.name,field:t,numeric:!0,precision:e.precision})))),n.samples({reg:r}).sort(((e,t)=>e.day.rel-t.day.rel)).map((e=>Object.fromEntries([["date",e.day.iso],["week_day",e.day.week_day]].concat(i.map(((t,n)=>[n,t.eval(e)]))))))),!0})))),r.add("/metric/{}",((e,r,s)=>{if(!a.has(e))return!1;let o=a.get(e),i=n.then((e=>e.samples({day:0}).map((e=>({reg:e.reg,val:o.eval(e)}))).sort(((e,t)=>t.val-e.val))));return s.h1(o.name).append(o.synopsis()).p(t().a("Tell me more","/corona-lage/metric/"+e+"/explanation").t(".")).append(document.createElement("div"),(e=>{i.then((n=>{let a=n.find((e=>2===e.reg.key.length));t(e).t(a.reg.name+": ").b(a.val.toFixed(o.precision))}))})).h3("Bundeslander").ul([],(e=>{i.then((n=>{for(let a of n)if(4===a.reg.key.length){let n=document.createElement("li");t(n).t(a.reg.name+": ").b(a.val.toFixed(o.precision)),e.appendChild(n)}}))})).h3("Cities").ul([],(e=>{i.then((n=>{n=n.filter((e=>7===e.reg.key.length));for(let a of n.slice(0,10)){let n=document.createElement("li");t(n).t(a.reg.name+": ").b(a.val.toFixed(o.precision)),e.appendChild(n)}let a=document.createElement("li");a.textContent="...",e.appendChild(a);for(let a of n.slice(n.length-10)){let n=document.createElement("li");t(n).t(a.reg.name+": ").b(a.val.toFixed(o.precision)),e.appendChild(n)}}))})),!0})),r.add("/metric/{}/synopsis",((e,t,n)=>{if(!a.has(e))return!1;let r=a.get(e);return n.h1(r.name).append(r.synopsis()),!0})),r.add("/metric/{}/explanation",((e,t,n)=>{if(!a.has(e))return!1;let r=a.get(e);return n.h1(r.name).append(r.synopsis()).append(r.explanation()),!0}))})(),e.spa=(()=>{let e=()=>!1,t=()=>{};function n(){t(e(window.location.href))}return sessionStorage.href&&(history.replaceState(null,"",sessionStorage.href),sessionStorage.href=""),window.addEventListener("click",(n=>{let a,r;!1===n.altKey&&!1===n.ctrlKey&&!1===n.metaKey&&!1===n.shiftKey&&Boolean(a=function(e){for(;e&&"A"!==e.tagName;)e=e.parentElement;return e}(n.target))&&Boolean(r=e(a.href))&&(n.preventDefault(),a.href!==window.location.href&&history.pushState(null,"",a.href),window.scrollTo(0,0),t(r))})),window.addEventListener("popstate",n),{install:function(a,r){e=a,t=r,n()},refresh:n}})(),e.main=(()=>{const t=e.spa,n=e.api,a=e.leaf,r=e.router;{document.body.textContent="";let e=document.body.appendChild(document.createElement("main")),s=document.body.appendChild(document.createElement("footer")).appendChild(document.createElement("div"));s.classList.add("signature"),a(s).t("data: ").append(document.createElement("time"),(e=>{e.textContent="...",n.watch((t=>{let n=t.updated;e.dateTime=n,e.textContent=n.toISOString().substring(0,19).replace("T"," ")}))})).br().t("website: ").append(document.createElement("time"),(e=>{let t=new Date("2021-02-26T21:43:38");e.dateTime=t,e.textContent=t.toISOString().substring(0,19).replace("T"," ")})).br().t("source: ").a("github.com","https://github.com/markusolt/corona-lage",(e=>{e.classList.add("subtle")})).br().t("author: ").a("markus","mailto:markus@blaumond.net",(e=>{e.classList.add("subtle")}));let i=location.origin+"/corona-lage";t.install((e=>{if(e.startsWith(i)){let t=e.substring(i.length),{path:n,query:a,tag:r}=/^(?<path>[^\?#]*)(\?(?<query>[^#]*))?(#(?<tag>.*))?$/.exec(t).groups;n="/"+n.split("/").map((e=>decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""))).filter((e=>e.length>0)).join("/"),a=Object.fromEntries((a||"").split("&").map((e=>/(?<key>[^\=]*)(\=(?<val>.*))?/.exec(e).groups)).map((({key:e,val:t})=>[decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""),decodeURIComponent(t||"").trim()])).filter((([e,t])=>e.length>0))),r=decodeURIComponent(r||"").toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,"");Object.keys(a).length>0&&Object.entries(a).map((([e,t])=>e+"="+encodeURIComponent(t))).join("&");return{path:n,query:a}}return null}),(t=>{o(),e.textContent="",a(e).append(document.createElement("article"),(e=>{r(t.path,t.query,a(e))})).p(a().a("home","/corona-lage/"))}))}let s=new Date;function o(){n.value&&new Date-s>6e4&&(s=new Date,n.value.update().then((e=>{e&&t.refresh()})))}window.addEventListener("focus",(()=>{o()}))})();
