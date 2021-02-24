"use strict";const e={};e.box=(()=>{class e{constructor(e){this._val=void 0,this._ver_prev=0,this._ver=0,this._subs=[],this._subs_once=[],this.set(e)}get value(){return this._val}map(e){let n=t(void 0);return this.watch((t=>{n.set(e(t))})),n}set(e){this._ver+=1;let t=this._ver;n(e).then((e=>{this._ver_prev<t&&(this._ver_prev=t,Object.is(this._val,e)||(this._val=e,this.touch()))}))}then(e){if(void 0!==this._val)return n(e(this._val));{let t,n=new Promise((e=>{t=e}));return this._subs_once.push((n=>{t(e(n))})),n}}touch(){if(void 0!==this._val){for(let e of this._subs)e(this._val);for(let e of this._subs_once)e(this._val);this._subs_once.length=0}}until(e){void 0===this._val&&e()}watch(e){this._subs.push(e),void 0!==this._val&&e(this._val)}}function t(t){return new e(t)}function n(e){return null!=e&&"function"==typeof e.then?e:{then:t=>n(t(e))}}return t.all=function(e){let n=Array.from(e),a=n.map((e=>e.value)),r=t(a.includes(void 0)?void 0:a);return n.forEach(((e,t)=>{e.watch((e=>{a[t]=e,void 0!==e&&void 0!==r._val?r.touch():(r.set(void 0),a.includes(void 0)||r.set(a))}))})),r},t.any=function(e){let n=Array.from(e),a=n.map((e=>e.value)),r=t(a);return n.forEach(((e,t)=>{e.watch((e=>{a[t]=e,r.touch()}))})),r},t.thenable=n,t})(),e.csv=function*(e){let t=function*(e){let t=/(?<val>[^",\n]*("[^"]*"[^",\n]*)*)(?<del>,|\n+|$)/g,n=[];for(let a of e.matchAll(t)){let{val:e,del:t}=a.groups;if(n.push(e.trim().replace(/"/,"").replace(/"([^"]*)"?/g,((e,t)=>'""'===e?'"':t))),","!==t){if(""===t&&1===n.length&&""===n[0])return;yield n,n=[]}}}(e),n=t.next().value;for(let e of t)yield Object.fromEntries(n.map(((t,n)=>[t,e[n]])))},e.day=(()=>{class e{constructor(e){this._val=e}add(t){return new e(this._val+t)}since(e){return this._val-e._val}iso(){return new Date(864e5*this._val).toISOString().substr(0,10)}week_day(){return new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(new Date(864e5*this._val))}}return function(t){return new e(Date.parse(t)/864e5)}})(),e.hay=(()=>{class e{constructor(){this._everything=new Set,this._map=new Map}insert(e,n){this._everything.add(n);for(let a of t(e))for(let e=0;e<a.length;e++){let t=a.substr(0,e+1);this._map.has(t)||this._map.set(t,new Set),this._map.get(t).add(n)}}find_sets(e){let n=t(e);return 0===n.length?[this._everything]:n.map((e=>this._map.get(e)||new Set))}find(e){return function(e){if(0===e.length)return[];let t=(e=e.filter(((e,t,n)=>n.indexOf(e)===t)).sort(((e,t)=>e.size-t.size))).slice(1);return Array.from(e[0]).filter((e=>t.every((t=>t.has(e)))))}(this.find_sets(e))}}function t(e){return e.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss").split(/[^a-z0-9]+/g).filter(((e,t,n)=>e.length>2&&n.indexOf(e)===t))}return function(){return new e}})(),e.api=(()=>{const t=e.box,n=e.csv,a=e.day,r=e.hay;let s={update:null,asof:null,days:null,regions:null,regions_index:null,samples:null},i=t();class o{constructor(){}async update(){let e=(await l("/corona-lage/api/updated?r="+Math.floor(Math.random()*Math.pow(16,4)).toString(16).padStart(4,"0"))).trim();if(s.updated===e)return!1;let t=u("/corona-lage/api/regions/regions.csv?v="+e.replace(/[^0-9]/g,"")),n=u("/corona-lage/api/cases/sum.csv?v="+e.replace(/[^0-9]/g,"")),o=new Map,c=r();for(let e of await t){let t={key:e.key,name:e.name,population:Number(e.population)};o.set(t.key,t),c.insert(t.key+" "+t.name+" "+t.words,t)}let d=new Map,h=a(e.substring(0,10)),p=[];for(let e of await n){let t=o.get(e.region),n=h.since(a(e.date));if(!d.has(n)){let e=h.add(-n);d.set(n,{rel:n,iso:e.iso(),week_day:e.week_day()})}let r=d.get(n),s=Number(e.cases),i=Number(e.cases_week_0),l=Number(e.cases_week_7),u=Number(e.deaths),c=Number(e.deaths_week_0),m=Number(e.deaths_week_7);p.push({reg:t,day:r,measures:{cases:s,cases_w_0:i,cases_w_7:l,deaths:u,deaths_w_0:c,deaths_w_7:m}})}return s={updated:e,asof:h,days:d,regions:o,regions_index:c,samples:p},i.touch(),!0}get updated(){return new Date(s.updated)}get asof(){return s.asof}day(e){if(!s.days.has(e)){let t=s.asof.add(-e);s.days.set(e,{rel:e,iso:t.iso(),week_day:t.week_day()})}return s.days.get(e)}region(e){return s.regions.get(e)}find_region(e){return s.regions_index.find(e)}samples({reg:e,day:t}){return t=Number.isFinite(t)?this.day(t):t,e&&t?s.samples.filter((n=>n.reg===e&&n.day===t)):e?s.samples.filter((t=>t.reg===e)):t?s.samples.filter((e=>e.day===t)):s.samples}}async function l(e){let t=await fetch(e);return t.ok?t.text():(console.error("Failed to load %o: %o",e,t),"")}async function u(e){return n(await l(e))}return(async()=>{let e=new o;await e.update()&&i.set(e)})(),i})(),e.spa=(()=>{let e=()=>!1,t=()=>{};function n(){t(e(window.location.href))}return sessionStorage.href&&(history.replaceState(null,"",sessionStorage.href),sessionStorage.href=""),window.addEventListener("click",(n=>{let a,r;!1===n.altKey&&!1===n.ctrlKey&&!1===n.metaKey&&!1===n.shiftKey&&Boolean(a=function(e){for(;e&&"A"!==e.tagName;)e=e.parentElement;return e}(n.target))&&Boolean(r=e(a.href))&&(n.preventDefault(),a.href!==window.location.href&&history.pushState(null,"",a.href),window.scrollTo(0,0),t(r))})),window.addEventListener("popstate",n),{install:function(a,r){e=a,t=r,n()},refresh:n}})(),e.leaf=(()=>{class e{constructor(e){this._node=e}append(e,n){return t(this._node,e,n),this}h1(e,n){return this.append(t(document.createElement("h1"),e),n)}h2(e,n){return this.append(t(document.createElement("h2"),e),n)}h3(e,n){return this.append(t(document.createElement("h3"),e),n)}p(e,n){return this.append(t(document.createElement("p"),e),n)}t(e,t){return this.append(document.createTextNode(e),t)}br(e){return this.append(document.createElement("br"),e)}i(e,n){return this.append(t(document.createElement("i"),e),n)}b(e,n){return this.append(t(document.createElement("b"),e),n)}a(e,n,a){let r=document.createElement("a");return r.href=n,t(r,e),this.append(r,a)}ul(e,n){let a=document.createElement("ul"),r=e&&e[Symbol.iterator]?e:[e];for(let e of r)a.appendChild(t(document.createElement("li"),e));return this.append(a,n)}}function t(t,n,a){let r=n instanceof Node?n:n instanceof e?n._node:document.createTextNode(n);return a&&a(r),t.appendChild(r),t}return function(t){return new e(t||document.createDocumentFragment())}})(),e.lorem=(()=>{const e=["ac","adipiscing","amet","ante","at","bibendum","blandit","consectetur","curabitur","cursus","dapibus","diam","dictum","dolor","donec","dui","eget","elementum","elit","enim","eros","et","eu","ex","fames","faucibus","finibus","fringilla","hendrerit","iaculis","imperdiet","in","interdum","ipsum","leo","lobortis","lorem","luctus","malesuada","mauris","metus","morbi","nec","neque","nisi","nisl","non","nulla","nunc","orci","phasellus","porttitor","posuere","primis","quisque","sapien","sem","semper","sit","sollicitudin","tempus","tincidunt","turpis","ut","vitae","viverra","vulputate"];return function(t){let n=e[Math.floor(Math.random()*e.length)];return n=n.substring(0,1).toUpperCase()+n.substring(1),n+new Array(t).fill(null).map((()=>e[Math.floor(Math.random()*e.length)])).join(" ")+"."}})(),e.main=(()=>{const t=e.api,n=e.spa,a=e.leaf;e.lorem;{document.body.textContent="";let e=document.body.appendChild(document.createElement("main")),s=document.body.appendChild(document.createElement("footer")).appendChild(document.createElement("div"));s.classList.add("signature"),a(s).t("data: ").append(document.createElement("time"),(e=>{e.textContent="...",t.watch((t=>{let n=t.updated;e.dateTime=n,e.textContent=n.toISOString().substring(0,19).replace("T"," ")}))})).br().t("website: ").append(document.createElement("time"),(e=>{let t=new Date("2021-02-24T19:42:24");e.dateTime=t,e.textContent=t.toISOString().substring(0,19).replace("T"," ")})).br().t("source: ").a("github.com","https://github.com/markusolt/corona-lage",(e=>{e.classList.add("subtle")})).br().t("author: ").a("markus","mailto:markus@blaumond.net",(e=>{e.classList.add("subtle")}));let i=location.origin+"/corona-lage";n.install((e=>{if(e.startsWith(i)){let t=e.substring(i.length);return{path:r(t,"?")[0].split("/").map((e=>decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""))).filter((e=>e.length>0)),query:Object.fromEntries(r(r(t,"?")[1],"#")[0].split("&").map((e=>r(e,"="))).map((([e,t])=>[decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""),decodeURIComponent(t).trim()||!0])).filter((([e,t])=>e.length>0)))}}return null}),(n=>{e.textContent="",a(e).append(function(e){let n="/"+e.path.join("/");if("/"===n)return a().h1("Welcome").p(a().t("Welcome to ").i("Corona Lage").t(". This is your daily update of Covid-19 incidence values across Germany. Go ahead and start ").a("here","/corona-lage/incidence").t(".")).ul([a().a("/cases","/corona-lage/cases"),a().a("/incidence","/corona-lage/incidence"),a().a("/cases-rolling-avg","/corona-lage/cases-rolling-avg")]);if("/cases"===n)return r({name:"Number of Positive Test Results",mtrc:e=>e.measures.cases,description:a().p("")});if("/cases-rolling-avg"===n)return r({name:"Cases - Rolling Average per Capita",mtrc:e=>1e5*e.measures.cases_w_0/e.reg.population,description:a().p(a().t("The average ").a("number of cases","/corona-lage/cases").t(" for the past 7 days per 100.000 people."))});if("/incidence"===n)return r({name:"Incidence",mtrc:e=>{let t=Math.pow(e.measures.cases_w_0/e.measures.cases_w_7,1/7);return e.measures.cases_w_7/(Math.pow(t,0)+Math.pow(t,1)+Math.pow(t,2)+Math.pow(t,3)+Math.pow(t,4)+Math.pow(t,5)+Math.pow(t,6))*Math.pow(t,13)*7e5/e.reg.population},description:a().p("")});return console.error("unknown resource: %o",{path:"/corona-lage/"+e.path.join("/")}),a();function r({name:e,mtrc:n,description:r,precision:s}){let i=t.then((e=>e.samples({day:0}).map((e=>({reg:e.reg,val:n(e)}))).sort(((e,t)=>t.val-e.val))));return a().h1(e).append(r).append(document.createElement("div"),(e=>{i.then((t=>{let n=t.find((e=>2===e.reg.key.length));a(e).t(n.reg.name+": ").b(n.val.toFixed(s))}))})).h3("Bundeslander").ul([],(e=>{i.then((t=>{for(let n of t)if(4===n.reg.key.length){let t=document.createElement("li");a(t).t(n.reg.name+": ").b(n.val.toFixed(s)),e.appendChild(t)}}))})).h3("Cities").ul([],(e=>{i.then((t=>{t=t.filter((e=>7===e.reg.key.length));for(let n of t.slice(0,10)){let t=document.createElement("li");a(t).t(n.reg.name+": ").b(n.val.toFixed(s)),e.appendChild(t)}let n=document.createElement("li");n.textContent="...",e.appendChild(n);for(let n of t.slice(t.length-10)){let t=document.createElement("li");a(t).t(n.reg.name+": ").b(n.val.toFixed(s)),e.appendChild(t)}}))}))}}(n)),0===e.childNodes.length&&a(e).h1("Status 404").p("There is nothing here, are you lost?").p(a().a("Go home","/corona-lage/").t("."))}))}function r(e,t){let n=(e.indexOf(t)+e.length+1)%(e.length+1);return[e.substring(0,n),e.substring(n+1)]}})();
