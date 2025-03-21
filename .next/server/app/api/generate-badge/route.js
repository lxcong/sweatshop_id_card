(()=>{var e={};e.id=81,e.ids=[81],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:e=>{"use strict";e.exports=require("querystring")},12412:e=>{"use strict";e.exports=require("assert")},12909:(e,t,r)=>{"use strict";r.d(t,{N:()=>a});let a={providers:[(0,r(67008).Ay)({clientId:process.env.TWITTER_CLIENT_ID,clientSecret:process.env.TWITTER_CLIENT_SECRET,version:"2.0",authorization:{url:"https://twitter.com/i/oauth2/authorize",params:{scope:"users.read tweet.read offline.access"}}})],callbacks:{jwt:async({token:e,account:t,profile:r})=>(t&&(e.accessToken=t.access_token,e.refreshToken=t.refresh_token,e.tokenType=t.token_type),e),session:async({session:e,token:t})=>(e.accessToken=t.accessToken,e)},debug:!1,pages:{signIn:"/",signOut:"/",error:"/"}}},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33180:(e,t,r)=>{"use strict";r.d(t,{Iv:()=>c,Tn:()=>l});var a=r(88044),o=r(94612);let s=null,i=null;s=r(29021),i=r(33873);let n={avatar:{size:200,x:399,y:400,circleRadius:80},name:{x:470,y:578,fontSize:20,fontFamily:"Arial",fontWeight:"bold",color:"black",align:"center"},position:{x:470,y:658,fontSize:20,fontFamily:"Arial",fontWeight:"normal",color:"black",align:"center"}};async function l(e,t){console.log("Starting badge generation process..."),console.log("Avatar URL:",e.avatarUrl);let r=t||global.tempLayout||n,l=(0,a.createCanvas)(800,800),c=l.getContext("2d"),p=(0,a.createCanvas)(800,800),u=p.getContext("2d");try{let t,n;t=i?i.join(process.cwd(),"public/images/badge-template.png"):"/images/badge-template.png",console.log("Template path:",t);let l=!s||s.existsSync(t);console.log("Template exists check:",l);try{n=await (0,a.loadImage)(l?t:"https://raw.githubusercontent.com/lxcong/sweatshop_id_card/master/public/images/badge-template.png"),console.log("Template image loaded from:",l?"local file":"GitHub")}catch(o){console.error("Failed to load template from primary sources, creating basic template");let e=(0,a.createCanvas)(800,800),t=e.getContext("2d");t.fillStyle="#FECF33",t.fillRect(0,0,800,800),t.fillStyle="#000000",t.font="bold 36px Arial",t.textAlign="center",t.fillText("SWEATSHOP",400,150);let r=e.toBuffer("image/png");n=await (0,a.loadImage)(r)}try{if(!e.avatarUrl||"undefined"===e.avatarUrl)throw Error("Invalid avatar URL");console.log("Downloading avatar from:",e.avatarUrl);let t=await o.A.get(e.avatarUrl,{responseType:"arraybuffer",headers:{Accept:"image/jpeg, image/png, image/*","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}});console.log("Avatar downloaded successfully");let s=await (0,a.loadImage)(Buffer.from(t.data,"binary"));console.log("Avatar loaded to canvas"),u.beginPath(),u.arc(r.avatar.x,r.avatar.y,r.avatar.circleRadius,0,2*Math.PI,!0),u.closePath(),u.clip(),u.drawImage(s,r.avatar.x-r.avatar.size/2,r.avatar.y-r.avatar.size/2,r.avatar.size,r.avatar.size),console.log("Avatar drawn with circular mask")}catch(e){console.error("Error loading avatar:",e),u.fillStyle="#808080",u.beginPath(),u.arc(r.avatar.x,r.avatar.y,r.avatar.circleRadius,0,2*Math.PI,!0),u.closePath(),u.fill()}c.drawImage(p,0,0),c.drawImage(n,0,0,800,800),console.log("Template image loaded successfully")}catch(e){console.error("Error loading template:",e),c.fillStyle="#FECF33",c.fillRect(0,0,800,800)}return c.fillStyle=r.name.color,c.font=`${r.name.fontWeight} ${r.name.fontSize}px ${r.name.fontFamily}`,c.textAlign=r.name.align,c.fillText(e.name||"Unknown User",r.name.x,r.name.y),e.position&&(c.fillStyle=r.position.color,c.font=`${r.position.fontWeight} ${r.position.fontSize}px ${r.position.fontFamily}`,c.textAlign=r.position.align,c.fillText(e.position,r.position.x,r.position.y)),console.log("Badge generation completed"),l.toBuffer("image/png")}function c(e){if(!e||(console.log("Original Twitter image URL:",e),!e||"undefined"===e))return"";if(e.includes("profile_images")){let t=e.replace("_normal","");return console.log("Transformed Twitter image URL:",t),t}return console.log("URL was not modified:",e),e}},33873:e=>{"use strict";e.exports=require("path")},40485:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>x,routeModule:()=>g,serverHooks:()=>f,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>m});var a={};r.r(a),r.d(a,{POST:()=>u});var o=r(96559),s=r(48088),i=r(37719),n=r(32190),l=r(35426),c=r(33180),p=r(12909);async function u(e){try{let t=await (0,l.getServerSession)(p.N);if(!t||!t.user)return n.NextResponse.json({error:"You must be signed in to access this endpoint"},{status:401});let{position:r,layout:a}=await e.json(),{name:o,image:s}=t.user;if(!o||!s)return n.NextResponse.json({error:"User profile is incomplete"},{status:400});console.log("Generating badge for:",o,s);let i=await (0,c.Tn)({name:o,avatarUrl:(0,c.Iv)(s),position:r||"TP 志愿者"},a||global.tempLayout||void 0);return new n.NextResponse(i,{headers:{"Content-Type":"image/png","Content-Disposition":'attachment; filename="sweatshop-badge.png"'}})}catch(e){return console.error("Error generating badge:",e),n.NextResponse.json({error:"Failed to generate badge"},{status:500})}}let g=new o.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/generate-badge/route",pathname:"/api/generate-badge",filename:"route",bundlePath:"app/api/generate-badge/route"},resolvedPagePath:"/Users/lxc/Projects/aiagent/sweatshop_id_card/src/app/api/generate-badge/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:d,workUnitAsyncStorage:m,serverHooks:f}=g;function x(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:m})}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},83997:e=>{"use strict";e.exports=require("tty")},88044:e=>{"use strict";e.exports=require("canvas")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[243,580,65,612],()=>r(40485));module.exports=a})();