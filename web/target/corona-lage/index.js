"use strict";const e={csv:function*(e){let t=function*(e){let t=/(?<val>[^",\n]*("[^"]*"[^",\n]*)*)(?<del>,|\n+|$)/g,n=[];for(let r of e.matchAll(t)){let{val:e,del:t}=r.groups;if(n.push(e.trim().replace(/"/,"").replace(/"([^"]*)"?/g,((e,t)=>'""'===e?'"':t))),","!==t){if(""===t&&1===n.length&&""===n[0])return;yield n,n=[]}}}(e),n=t.next().value;for(let e of t)yield Object.fromEntries(n.map(((t,n)=>[t,e[n]])))}};e.day=(()=>{class e{constructor(e){this._val=e}add(t){return new e(this._val+t)}since(e){return this._val-e._val}iso(){return new Date(864e5*this._val).toISOString().substr(0,10)}week_day(){return new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(new Date(864e5*this._val))}}return function(t){return new e(Date.parse(t)/864e5)}})(),e.hay=(()=>{class e{constructor(){this._everything=new Set,this._map=new Map}insert(e,n){this._everything.add(n);for(let r of t(e))for(let e=0;e<r.length;e++){let t=r.substr(0,e+1);this._map.has(t)||this._map.set(t,new Set),this._map.get(t).add(n)}}find_sets(e){let n=t(e);return 0===n.length?[this._everything]:n.map((e=>this._map.get(e)||new Set))}find(e){return function(e){if(0===e.length)return[];let t=(e=e.filter(((e,t,n)=>n.indexOf(e)===t)).sort(((e,t)=>e.size-t.size))).slice(1);return Array.from(e[0]).filter((e=>t.every((t=>t.has(e)))))}(this.find_sets(e))}}function t(e){return e.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss").split(/[^a-z0-9]+/g).filter(((e,t,n)=>e.length>2&&n.indexOf(e)===t))}return function(){return new e}})(),e.api=(()=>{const t=e.csv,n=e.day,r=e.hay;let a=null,o=null;class i{constructor(){}async update(){let e=(await s("/corona-lage/api/updated?r="+Math.floor(1e5*Math.random()))).trim();if(a===e)return!1;let t=u("/corona-lage/api/regions/regions.csv?v="+e.replace(/[^0-9]/g,"")),i=u("/corona-lage/api/cases/sum.csv?v="+e.replace(/[^0-9]/g,"")),l=await t,c=await i,p=new Map,d=r();for(let e of l){let{key:t,name:n,population:r,words:a}=e,o={key:t,name:n,population:Number(r)};p.set(t,o),d.insert(t,o),d.insert(n,o),d.insert(a,o)}for(let e of p.values())e.key.length>4&&d.insert(p.get(e.key.substring(0,4)).name,e);let h=n(e.substring(0,10)),m=new Array(500).fill(0).map(((e,t)=>{let n=h.add(-t);return{iso:n.iso(),rel:t,week_day:n.week_day()}})),f=[];for(let e of c){let t=m[h.since(n(e.date))],r=p.get(e.region),a=Number(e.cases),o=Number(e.cases_week_0),i=Number(e.cases_week_7),l=Math.pow(o/i,1/7),s=i/(Math.pow(l,0)+Math.pow(l,1)+Math.pow(l,2)+Math.pow(l,3)+Math.pow(l,4)+Math.pow(l,5)+Math.pow(l,6))*Math.pow(l,13)*7e5/r.population,u=s*(l-1),c=1e3*(Number(e.deaths_week_0)+Number(e.deaths_week_7))/(o+i),d={reg:r,date:t,cases:a,incidence_rollingsum:1e5*o/r.population,incidence:s,r:l,change:u,mortality:c};f.push(d)}return f.sort(((e,t)=>e.reg.key.localeCompare(t.reg.key)||Math.sign(e.date.rel-t.date.rel))),a=e,o={updated:e,asof:h,regions_map:p,regions_haystack:d,cases_table:f},!0}data(){return o}}let l=(new i).update().then((e=>!!e||new Promise((()=>{}))));async function s(e){let t=await fetch(e);return t.ok?t.text():(console.error("Failed to load %o: %o",e,t),"")}async function u(e){return t(await s(e))}return async function(){return await l,new i}})(),e.spa=(()=>{let e=()=>!1,t=()=>{};function n(){t(e(window.location.href))}return window.addEventListener("click",(n=>{let r,a;!1===n.altKey&&!1===n.ctrlKey&&!1===n.metaKey&&!1===n.shiftKey&&Boolean(r=function(e){for(;e&&"A"!==e.tagName;)e=e.parentElement;return e}(n.target))&&Boolean(a=e(r.href))&&(n.preventDefault(),r.href!==window.location.href&&history.pushState(null,"",r.href),window.scrollTo(0,0),t(a))})),window.addEventListener("popstate",n),{install:function(r,a){e=r,t=a,n()},refresh:n}})(),e.leaf=(()=>{class e{constructor(e){this._node=e}append(e,n){return t(this._node,e,n),this}h1(e,n){return this.append(t(document.createElement("h1"),e),n)}p(e,n){return this.append(t(document.createElement("p"),e),n)}t(e,t){return this.append(document.createTextNode(e),t)}i(e,n){return this.append(t(document.createElement("i"),e),n)}b(e,n){return this.append(t(document.createElement("b"),e),n)}a(e,n,r){let a=document.createElement("a");return a.href=n,t(a,e),this.append(a,r)}ul(e,n){let r=document.createElement("ul"),a=e&&e[Symbol.iterator]?e:[e];for(let e of a)r.appendChild(t(document.createElement("li"),e));return this.append(r,n)}}function t(t,n,r){let a=n instanceof Node?n:n instanceof e?n._node:document.createTextNode(n);return r&&r(a),t.appendChild(a),t}return function(t){return new e(t||document.createDocumentFragment())}})(),e.lorem=(()=>{const e=["ac","adipiscing","amet","ante","at","bibendum","blandit","consectetur","curabitur","cursus","dapibus","diam","dictum","dolor","donec","dui","eget","elementum","elit","enim","eros","et","eu","ex","fames","faucibus","finibus","fringilla","hendrerit","iaculis","imperdiet","in","interdum","ipsum","leo","lobortis","lorem","luctus","malesuada","mauris","metus","morbi","nec","neque","nisi","nisl","non","nulla","nunc","orci","phasellus","porttitor","posuere","primis","quisque","sapien","sem","semper","sit","sollicitudin","tempus","tincidunt","turpis","ut","vitae","viverra","vulputate"];return function(t){let n=e[Math.floor(Math.random()*e.length)];return n=n.substring(0,1).toUpperCase()+n.substring(1),n+new Array(t).fill(null).map((()=>e[Math.floor(Math.random()*e.length)])).join(" ")+"."}})(),e.main=(()=>{const t=e.api,n=e.spa,r=e.leaf,a=e.lorem;sessionStorage.href&&(history.replaceState(null,"",sessionStorage.href),sessionStorage.href=""),t().then((e=>{window.api=e}));{document.body.textContent="";let e=document.body.appendChild(document.createElement("main"));document.body.appendChild(document.createElement("footer")).textContent="markus";let t=location.origin+"/corona-lage";n.install((e=>{if(e.startsWith(t)){let n=e.substring(t.length);return{path:i(n,"?")[0].split("/").map((e=>decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""))).filter((e=>e.length>0)),query:Object.fromEntries(i(i(n,"?")[1],"#")[0].split("&").map((e=>i(e,"="))).map((([e,t])=>[decodeURIComponent(e).toLowerCase().replace(/^[^a-z]+|[^a-z0-9_\-]+|[^a-z0-9]+$/g,""),decodeURIComponent(t).trim()||!0])).filter((([e,t])=>e.length>0)))}}return null}),(t=>{e.textContent="",r(e).append(o(t)),0===e.childNodes.length&&r(e).h1("Status 404").p("There is nothing here, are you lost?").p(r().a("Go home","/corona-lage/").t("."))}))}function o(e){return 0===e.path.length?r().h1("home").a("/foo","/corona-lage/foo").a("/bar","/corona-lage/bar").append(o({path:["foo"]})):"foo"!==e.path[0]?r().h1(JSON.stringify(e,null,4),(e=>{e.style.whiteSpace="pre"})).p(r().t("Welcome to ").i("Corona Lage").t(". This is your daily update of Covid-19 incidence values across Germany. Go ahead and visit a ").a("random page","/corona-lage/"+a(l(0,4)).toLowerCase().replace(/[^a-z ]+/g,"").replace(/ /g,"/")).t(".")).append(o({path:[],query:{}})).ul(new Array(l(3,12)).fill(null).map((()=>a(l(5,20))))).p(a(l(30,70))):(console.error("unknown resource: %o",{path:"/corona-lage/"+e.path.join("/")}),r())}function i(e,t){let n=(e.indexOf(t)+e.length+1)%(e.length+1);return[e.substring(0,n),e.substring(n+1)]}function l(e,t){return e+Math.floor(Math.random()*(t-e+1))}})();
