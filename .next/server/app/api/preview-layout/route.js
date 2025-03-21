(()=>{var e={};e.id=325,e.ids=[325],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},6812:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>f,routeModule:()=>p,serverHooks:()=>d,workAsyncStorage:()=>g,workUnitAsyncStorage:()=>u});var a={};r.r(a),r.d(a,{POST:()=>c});var o=r(96559),n=r(48088),i=r(37719),s=r(32190),l=r(33180);async function c(e){try{let{layout:t,previewData:r}=await e.json();global.tempLayout=t;let a=await (0,l.Tn)({name:r.name||"MICHAEL",avatarUrl:"https://i.pravatar.cc/300",position:r.position||"TP 志愿者"},t);return new s.NextResponse(a,{headers:{"Content-Type":"image/png"}})}catch(e){return console.error("Error generating layout preview:",e),s.NextResponse.json({error:"Failed to generate layout preview"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/preview-layout/route",pathname:"/api/preview-layout",filename:"route",bundlePath:"app/api/preview-layout/route"},resolvedPagePath:"/Users/lxc/Projects/aiagent/sweatshop_id_card/src/app/api/preview-layout/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:g,workUnitAsyncStorage:u,serverHooks:d}=p;function f(){return(0,i.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:u})}},9288:e=>{"use strict";e.exports=require("sharp")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},12412:e=>{"use strict";e.exports=require("assert")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33180:(e,t,r)=>{"use strict";r.d(t,{Iv:()=>g,Tn:()=>p});var a=r(88044),o=r(94612);let n=null,i=null,s=null;n=r(9288),i=r(29021),s=r(33873);try{let e={regular:s.join(process.cwd(),"public/fonts/NotoSansSC-Regular.ttf"),bold:s.join(process.cwd(),"public/fonts/NotoSansSC-Bold.ttf")};i.existsSync(e.regular)?((0,a.registerFont)(e.regular,{family:"Noto Sans SC",weight:"normal"}),console.log("已注册 Noto Sans SC Regular 字体")):console.warn("找不到 Noto Sans SC Regular 字体文件"),i.existsSync(e.bold)?((0,a.registerFont)(e.bold,{family:"Noto Sans SC",weight:"bold"}),console.log("已注册 Noto Sans SC Bold 字体")):console.warn("找不到 Noto Sans SC Bold 字体文件")}catch(e){console.error("字体处理出错:",e)}function l(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"):""}let c={avatar:{size:200,x:399,y:400,circleRadius:80},name:{x:460,y:580,fontSize:20,fontFamily:"sans-serif",fontWeight:"bold",color:"black",align:"center"},position:{x:460,y:650,fontSize:20,fontFamily:"sans-serif",fontWeight:"normal",color:"black",align:"center"}};async function p(e,t){console.log("Starting badge generation process..."),console.log("Avatar URL:",e.avatarUrl);let r=t||global.tempLayout||c,p=(0,a.createCanvas)(800,800),g=p.getContext("2d"),u=(0,a.createCanvas)(800,800),d=u.getContext("2d");try{let t,n;t=s?s.join(process.cwd(),"public/images/badge-template.png"):"/images/badge-template.png",console.log("Template path:",t);let l=!i||i.existsSync(t);console.log("Template exists check:",l);try{n=await (0,a.loadImage)(l?t:"https://raw.githubusercontent.com/lxcong/sweatshop_id_card/master/public/images/badge-template.png"),console.log("Template image loaded from:",l?"local file":"GitHub")}catch(o){console.error("Failed to load template from primary sources, creating basic template");let e=(0,a.createCanvas)(800,800),t=e.getContext("2d");t.fillStyle="#FECF33",t.fillRect(0,0,800,800),t.fillStyle="#000000",t.font="bold 36px Arial",t.textAlign="center",t.fillText("SWEATSHOP",400,150);let r=e.toBuffer("image/png");n=await (0,a.loadImage)(r)}try{if(!e.avatarUrl||"undefined"===e.avatarUrl)throw Error("Invalid avatar URL");console.log("Downloading avatar from:",e.avatarUrl);let t=await o.A.get(e.avatarUrl,{responseType:"arraybuffer",headers:{Accept:"image/jpeg, image/png, image/*","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}});console.log("Avatar downloaded successfully");let n=await (0,a.loadImage)(Buffer.from(t.data,"binary"));console.log("Avatar loaded to canvas"),d.beginPath(),d.arc(r.avatar.x,r.avatar.y,r.avatar.circleRadius,0,2*Math.PI,!0),d.closePath(),d.clip(),d.drawImage(n,r.avatar.x-r.avatar.size/2,r.avatar.y-r.avatar.size/2,r.avatar.size,r.avatar.size),console.log("Avatar drawn with circular mask")}catch(e){console.error("Error loading avatar:",e),d.fillStyle="#808080",d.beginPath(),d.arc(r.avatar.x,r.avatar.y,r.avatar.circleRadius,0,2*Math.PI,!0),d.closePath(),d.fill()}g.drawImage(u,0,0),g.drawImage(n,0,0,800,800),console.log("Template image loaded successfully")}catch(e){console.error("Error loading template:",e),g.fillStyle="#FECF33",g.fillRect(0,0,800,800)}let f=p.toBuffer("image/png");if(!n)return console.log("Badge generation completed without Sharp text rendering (client-side)"),f;try{let t=l(e.name||"Unknown User"),o=e.position?l(e.position):"";console.log("Preparing text rendering:"),console.log("- Name (escaped):",t),console.log("- Position (escaped):",o),console.log("Attempting direct image text overlay with fallback mechanisms");let i=(0,a.createCanvas)(800,800),s=i.getContext("2d");s.clearRect(0,0,800,800);try{s.font=`bold ${r.name.fontSize}px 'Noto Sans SC', sans-serif`,s.textAlign="center",s.fillStyle="black",s.fillText(e.name||"Unknown",r.name.x,r.name.y),e.position&&(s.font=`${r.position.fontSize}px 'Noto Sans SC', sans-serif`,s.fillText(e.position,r.position.x,r.position.y))}catch(t){console.log("Fallback to system fonts"),s.font=`bold ${r.name.fontSize}px Arial, sans-serif`,s.textAlign="center",s.fillStyle="black",s.fillText(e.name||"Unknown",r.name.x,r.name.y),e.position&&(s.font=`${r.position.fontSize}px Arial, sans-serif`,s.fillText(e.position,r.position.x,r.position.y))}let c=i.toBuffer("image/png"),p=await n(f).composite([{input:c,blend:"over"}]).png().toBuffer();return console.log("Badge generation completed with optimized Canvas text rendering"),p}catch(t){console.error("Error in primary text rendering method:",t);try{console.log("Attempting basic canvas text rendering");let t=(0,a.createCanvas)(800,800),o=t.getContext("2d"),n=await (0,a.loadImage)(f);o.drawImage(n,0,0),o.font=`bold ${r.name.fontSize}px sans-serif`,o.textAlign="center",o.fillStyle="black";let i=(e.name||"Unknown").split(""),s=0;for(let e of i)s+=o.measureText(e).width;let l=r.name.x-s/2;for(let e of i){let t=o.measureText(e).width;o.fillText(e,l+t/2,r.name.y),l+=t}if(e.position){o.font=`${r.position.fontSize}px sans-serif`;let t=e.position.split(""),a=0;for(let e of t)a+=o.measureText(e).width;let n=r.position.x-a/2;for(let e of t){let t=o.measureText(e).width;o.fillText(e,n+t/2,r.position.y),n+=t}}return console.log("Character-by-character text rendering completed"),t.toBuffer("image/png")}catch(e){return console.error("All text rendering methods failed:",e),f}}}function g(e){if(!e||(console.log("Original Twitter image URL:",e),!e||"undefined"===e))return"";if(e.includes("profile_images")){let t=e.replace("_normal","");return console.log("Transformed Twitter image URL:",t),t}return console.log("URL was not modified:",e),e}},33873:e=>{"use strict";e.exports=require("path")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},83997:e=>{"use strict";e.exports=require("tty")},88044:e=>{"use strict";e.exports=require("canvas")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[243,580,612],()=>r(6812));module.exports=a})();