ase"unbuffered_seek":Ee=We,de.flush(),w.seek(Ee.milliseconds);break;case"timeupdate":te=(Ee=We).current_time;break;case"readystatechange":oe=(Ee=We).ready_state;break;case"pause_transmuxer":w.pause();break;case"resume_transmuxer":w.resume()}}})}},117:function(p,v,f){var S;f.r(v),(function(E){E.ERROR="error",E.LOADING_COMPLETE="loading_complete",E.RECOVERED_EARLY_EOF="recovered_early_eof",E.MEDIA_INFO="media_info",E.METADATA_ARRIVED="metadata_arrived",E.SCRIPTDATA_ARRIVED="scriptdata_arrived",E.TIMED_ID3_METADATA_ARRIVED="timed_id3_metadata_arrived",E.PGS_SUBTITLE_ARRIVED="pgs_subtitle_arrived",E.SYNCHRONOUS_KLV_METADATA_ARRIVED="synchronous_klv_metadata_arrived",E.ASYNCHRONOUS_KLV_METADATA_ARRIVED="asynchronous_klv_metadata_arrived",E.SMPTE2038_METADATA_ARRIVED="smpte2038_metadata_arrived",E.SEI_ARRIVED="sei_arrived",E.SCTE35_METADATA_ARRIVED="scte35_metadata_arrived",E.PES_PRIVATE_DATA_DESCRIPTOR="pes_private_data_descriptor",E.PES_PRIVATE_DATA_ARRIVED="pes_private_data_arrived",E.STATISTICS_INFO="statistics_info",E.DESTROYING="destroying"})(S||(S={})),v.default=S}},o={};function c(p){var v=o[p];if(v!==void 0)return v.exports;var f=o[p]={exports:{}};return s[p].call(f.exports,f,f.exports,c),f.exports}return c.m=s,c.n=function(p){var v=p&&p.__esModule?function(){return p.default}:function(){return p};return c.d(v,{a:v}),v},c.d=function(p,v){if(Array.isArray(v))for(var f=0;f<v.length;){var S=v[f++],E=v[f++];c.o(p,S)?E===0&&f++:E===0?Object.defineProperty(p,S,{enumerable:!0,value:v[f++]}):Object.defineProperty(p,S,{enumerable:!0,get:E})}else for(var S in v)c.o(v,S)&&!c.o(p,S)&&Object.defineProperty(p,S,{enumerable:!0,get:v[S]})},c.g=(function(){if(typeof globalThis=="object")return globalThis;try{return this||new Function("return this")()}catch{if(typeof window=="object")return window}})(),c.o=function(p,v){return Object.prototype.hasOwnProperty.call(p,v)},c.r=function(p){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(p,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(p,"__esModule",{value:!0})},c(976)})()})})(wS)),wS.exports}var JH=QH();const Yc=xM(JH);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ZH=g=>g.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),e9=g=>g.replace(/^([A-Z])|[\s-_]+(\w)/g,(i,s,o)=>o?o.toUpperCase():s.toLowerCase()),EM=g=>{const i=e9(g);return i.charAt(0).toUpperCase()+i.slice(1)},MP=(...g)=>g.filter((i,s,o)=>!!i&&i.trim()!==""&&o.indexOf(i)===s).join(" ").trim(),t9=g=>{for(const i in g)if(i.startsWith("aria-")||i==="role"||i==="title")return!0};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var n9={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i9=Pt.forwardRef(({color:g="currentColor",size:i=24,strokeWidth:s=2,absoluteStrokeWidth:o,className:c="",children:p,iconNode:v,...f},S)=>Pt.createElement("svg",{ref:S,...n9,width:i,height:i,stroke:g,strokeWidth:o?Number(s)*24/Number(i):s,className:MP("lucide",c),...!p&&!t9(f)&&{"aria-hidden":"true"},...f},[...v.map(([E,A])=>Pt.createElement(E,A)),...Array.isArray(p)?p:[p]]));/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gm=(g,i)=>{const s=Pt.forwardRef(({className:o,...c},p)=>Pt.createElement(i9,{ref:p,iconNode:i,className:MP(`lucide-${ZH(EM(g))}`,`lucide-${g}`,o),...c}));return s.displayName=EM(g),s};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r9=[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]],s9=Gm("hash",r9);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a9=[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]],o9=Gm("maximize",a9);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l9=[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3",key:"hohbtr"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3",key:"5jw1f3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3",key:"198tvr"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3",key:"ph8mxp"}]],u9=Gm("minimize",l9);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c9=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],f9=Gm("music",c9);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h9=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478",key:"1fwjs5"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134",key:"ehdyv1"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134",key:"1q22gi"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478",key:"r2q7qm"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],d9=Gm("radio",h9);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p9=[["path",{d:"m17 2-5 5-5-5",key:"16satq"}],["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",key:"1e6viu"}]],OP=Gm("tv",p9),AM="ht_tv_stream_health_v1";class m9{constructor(){this.healthMap=new Map,this.loadFromStorage()}loadFromStorage(){try{const i=localStorage.getItem(AM);if(i){const s=JSON.parse(i);Object.keys(s).forEach(o=>{this.healthMap.set(o,s[o])})}}catch{}}saveToStorage(){try{const i={};this.healthMap.forEach((s,o)=>{i[o]=s}),localStorage.setItem(AM,JSON.stringify(i))}catch{}}isTokenExpired(i){if(!i)return!1;try{const o=new URL(i).searchParams,c=Math.floor(Date.now()/1e3),p=["exp","expires","token_exp","e","expiry","expired","t_exp"];for(const v of p){const f=o.get(v);if(f){const S=parseInt(f,10);if(!isNaN(S)&&S>1577836800&&S<2208988800&&S<c)return!0}}}catch{const s=i.match(/(?:exp|expires|expiry|e)=(\d{10})/i);if(s&&s[1]&&parseInt(s[1],10)<Math.floor(Date.now()/1e3))return!0}return!1}recordSuccess(i,s){if(!i)return;const o=this.healthMap.get(i)||{url:i,successCount:0,failCount:0,lastTested:Date.now(),isBlacklisted:!1,averageLatencyMs:s};o.successCount+=1,o.lastTested=Date.now(),o.isBlacklisted=!1,o.averageLatencyMs=Math.round(o.averageLatencyMs*.7+s*.3),this.healthMap.set(i,o),this.saveToStorage()}recordFailure(i,s){if(!i)return;const o=this.healthMap.get(i)||{url:i,successCount:0,failCount:0,lastTested:Date.now(),isBlacklisted:!1,averageLatencyMs:9999};o.failCount+=1,o.lastTested=Date.now(),(s===401||s===403||s===404||s===410||o.failCount>=3)&&(o.isBlacklisted=!0),this.healthMap.set(i,o),this.saveToStorage()}prioritizeUrls(i){if(!i||i.length===0)return[];const s=i.filter(c=>!this.isTokenExpired(c));return[...s.length>0?s:i].sort((c,p)=>{const v=this.healthMap.get(c),f=this.healthMap.get(p);if(v!=null&&v.isBlacklisted&&!(f!=null&&f.isBlacklisted))return 1;if(!(v!=null&&v.isBlacklisted)&&(f!=null&&f.isBlacklisted))return-1;const S=((v==null?void 0:v.successCount)||0)*100-((v==null?void 0:v.failCount)||0)*50-((v==null?void 0:v.averageLatencyMs)||1500)/10;return((f==null?void 0:f.successCount)||0)*100-((f==null?void 0:f.failCount)||0)*50-((f==null?void 0:f.averageLatencyMs)||1500)/10-S})}getRecord(i){return this.healthMap.get(i)}}const Xx=new m9,g9=3,v9=12e3,y9=14e3,_9=18e3;function PP(g){if(!g||!g.buffered||g.buffered.length===0)return{bufferAhead:0,bufferBehind:0,rangesCount:0};const i=g.currentTime,s=g.buffered,o=s.length;for(let v=0;v<o;v++){const f=s.start(v),S=s.end(v);if(f<=i&&i<=S)return{bufferAhead:Math.max(0,S-i),bufferBehind:Math.max(0,i-f),rangesCount:o}}if(i<s.start(0))return{bufferAhead:Math.max(0,s.end(0)-s.start(0)),bufferBehind:0,rangesCount:o};const c=s.end(o-1),p=s.start(o-1);return i>=c?{bufferAhead:0,bufferBehind:Math.max(0,i-p),rangesCount:o}:{bufferAhead:0,bufferBehind:0,rangesCount:o}}function Wx(g){return PP(g).bufferAhead}function Xa(g){if(!g)return;g.controls=!1;const i=g.play();i&&typeof i.catch=="function"&&i.catch(s=>{console.warn("[HT TV] video.play() bị chặn (Autoplay Policy), tự động bật muted = true để phát hình ảnh:",s);try{g.muted=!0;const o=g.play();o&&typeof o.catch=="function"&&o.catch(c=>{console.warn("[HT TV] Phát muted thất bại:",c)})}catch{}})}function Mm(g){if(!g)return!1;const i=(g.group||"").toLowerCase(),s=(g.cleanName||g.name||"").toLowerCase();return i==="sự kiện tv360"||i==="sự kiện"||i.includes("sự kiện")||i.includes("su kien")||/tv360\+/i.test(s)||s.includes("tv360")&&s.includes("+")}const T9=({channel:g,url:i,isLive:s=!0,onPlaybackSuccess:o,onToggleDrawer:c,onError:p,onAutoNextChannel:v})=>{const f=Pt.useMemo(()=>{if(g)return g;if(i){const Ze=i.toLowerCase(),mt=Ze.includes(".mpd")?"dash":Ze.includes(".m3u8")?"hls":"ts";return{id:"direct-url",name:"Live Stream",cleanName:"Live Stream",logo:"",group:"Live",url:i,backupUrls:[],format:mt}}return null},[g,i]),S=Pt.useRef(null),E