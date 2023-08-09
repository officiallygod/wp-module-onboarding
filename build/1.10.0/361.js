"use strict";(globalThis.webpackChunknewfold_Onboarding=globalThis.webpackChunknewfold_Onboarding||[]).push([[361],{4401:(e,t,a)=>{a.d(t,{V:()=>l});var n=a(9307),o=a(5634),r=a(4316),i=a(950);const l=e=>{let{title:t,subtitle:a,error:l}=e;return(0,n.createElement)(o.Z,{className:"step-error-state",isVerticallyCentered:!0},(0,n.createElement)(r.Z,{title:t,subtitle:a}),(0,n.createElement)("div",{className:"step-error-state__logo"}),(0,n.createElement)("h3",{className:"step-error-state__error"},l),(0,n.createElement)(i.Z,null))}},9291:(e,t,a)=>{a.d(t,{L:()=>i,Y:()=>n.Z});var n=a(35),o=a(9307),r=a(682);const i=()=>(0,o.createElement)("div",{className:"image-upload-loader--loading-box"},(0,o.createElement)(r.Z,{type:"load",className:"image-upload-loader--loading-box__loader"}))},3124:(e,t,a)=>{a.d(t,{U:()=>S});var n=a(9307),o=a(9818),r=a(4333),i=a(5736),l=a(9291),s=a(6831),u=a(7625),d=a(2200),c=a(4401);var m=a(9250),h=a(4310),g=a(5609),p=a(4184),w=a.n(p),b=a(7533),_=a(8395),v=a(7207),f=a(8297),E=a(6342);const y=e=>{let{buttonText:t=(0,i.__)("Exit to WordPress","wp-module-onboarding"),showButtonIcon:a=!0,showButton:r=!0,buttonVariant:l="secondary",buttonClassName:u=!1,isModalOpen:c=!1,modalTitle:p=(0,i.__)("Exit without finishing?","wp-module-onboarding"),modalText:y=!1,modalPrimaryCloseButtonText:S=(0,i.__)("Continue","wp-module-onboarding"),modalOnClose:N=!1,modalExitButtonText:C=(0,i.__)("Exit","wp-module-onboarding")}=e;const[D,T]=(0,n.useState)(c),k=()=>{"function"==typeof N&&N(),T(!1)},x=(0,m.TH)(),{currentData:P,brandName:V,socialData:O,currentStep:B}=(0,o.useSelect)((e=>({currentData:e(s.h).getCurrentOnboardingData(),brandName:e(s.h).getNewfoldBrandName(),socialData:e(s.h).getOnboardingSocialData(),currentStep:e(s.h).getCurrentStep()})),[x.pathname]),{setOnboardingSocialData:Z}=(0,o.useDispatch)(s.h);async function G(e){if(P){if(P.hasExited=(new Date).getTime(),null!=e&&e.includes("basic-info")){const e=await async function(){const e=await(0,_.Gw)(),t=await(0,_.I2)(O);return null!==(null==t?void 0:t.error)?null==e?void 0:e.body:null==t?void 0:t.body}();e&&Z(e)}(0,b.kB)(P)}(0,f.tH)(new f.Z_(E._C,B.title)),await v.v.dispatchEvents(E.En);const t="ecommerce"===window.nfdOnboarding.currentFlow?d.br:d.hF;window.location.replace(t)}return y||(y=(0,i.sprintf)(
/* translators: %s: Brand */
(0,i.__)("You can restart onboarding from your %s Settings page.","wp-module-onboarding"),V)),(0,n.createElement)(n.Fragment,null,r&&(0,n.createElement)(g.Button,{icon:!!a&&h.Z,variant:l,onClick:()=>T(!0),className:w()("nfd-onboarding-etw__trigger",u)},t),D&&(0,n.createElement)(g.Modal,{title:p,onRequestClose:()=>k()},(0,n.createElement)("p",null,y),(0,n.createElement)(g.ButtonGroup,{className:"nfd-onboarding-etw__buttons"},(0,n.createElement)(g.Button,{variant:"secondary",onClick:()=>k()},S),(0,n.createElement)(g.Button,{variant:"primary",onClick:()=>G(x.pathname)},C))))},S=e=>{let{children:t,navigationStateCallback:a=!1}=e;const m=(0,r.useViewportMatch)("medium"),{storedThemeStatus:h,brandName:g}=(0,o.useSelect)((e=>({storedThemeStatus:e(s.h).getThemeStatus(),brandName:e(s.h).getNewfoldBrandName()})),[]),p=(e=>({loader:{title:(0,i.sprintf)(
/* translators: %s: Brand */
(0,i.__)("Preparing your %s design studio","wp-module-onboarding"),e),subtitle:(0,i.__)("Hang tight while we show you some of the best WordPress has to offer!","wp-module-onboarding")},errorState:{title:(0,i.sprintf)(
/* translators: %s: Brand */
(0,i.__)("Preparing your %s design studio","wp-module-onboarding"),e),subtitle:(0,i.__)("Hang tight while we show you some of the best WordPress has to offer!","wp-module-onboarding"),error:(0,i.__)("Uh-oh, something went wrong. Please contact support.","wp-module-onboarding")}}))(g),{updateThemeStatus:w,setIsDrawerOpened:b,setIsDrawerSuppressed:_,setIsHeaderNavigationEnabled:v}=(0,o.useDispatch)(s.h),f=async()=>{const e=await(0,u.YL)(d.DY);return null!=e&&e.error?d.vv:e.body.status},E=()=>{switch(h){case d.Rq:case d.GV:return(()=>{if("function"==typeof a)return a();m&&b(!0),_(!1),v(!0)})();default:b(!1),_(!0),v(!1)}};(0,n.useEffect)((()=>{E(),h===d.a0&&(async()=>{const e=await f();switch(e){case d.Zh:setTimeout((async()=>{if(await f()!==d.GV)return w(d.vv);window.location.reload()}),d.YU);break;case d.GV:window.location.reload();break;default:w(e)}})()}),[h]);const S=async()=>(w(d.Zh),(await(0,u.N9)(d.DY,!0,!1)).error?w(d.Rq):window.location.reload());return(0,n.createElement)(n.Fragment,null,(()=>{switch(h){case d.vv:return(0,n.createElement)(y,{showButton:!1,isModalOpen:!0,modalTitle:(0,i.__)("It looks like you may have an existing website","wp-module-onboarding"),modalText:(0,i.__)("Going through this setup will change your active theme, WordPress settings, add content – would you like to continue?","wp-module-onboarding"),modalOnClose:S,modalExitButtonText:(0,i.__)("Exit to WordPress","wp-module-onboarding")});case d.Rq:return(0,n.createElement)(c.V,{title:p.errorState.title,subtitle:p.errorState.subtitle,error:p.errorState.error});case d.GV:return t;default:return(0,n.createElement)(l.Y,{title:p.loader.title,subtitle:p.loader.subtitle})}})())}},361:(e,t,a)=>{a.r(t),a.d(t,{default:()=>w});var n=a(9307),o=a(9250),r=a(9818),i=a(6138),l=a(6831),s=a(5634),u=a(2200),d=a(4316),c=a(3124),m=a(6332),h=a(8297),g=a(5736);var p=a(6342);const w=()=>{var e;const t=(0,o.TH)(),[a,w]=(0,n.useState)(),[b,_]=(0,n.useState)([]),[v,f]=(0,n.useState)(0),{currentStep:E,currentData:y,themeStatus:S,themeVariations:N}=(0,r.useSelect)((e=>({currentStep:e(l.h).getStepFromPath(t.pathname),currentData:e(l.h).getCurrentOnboardingData(),themeStatus:e(l.h).getThemeStatus(),themeVariations:e(l.h).getStepPreviewData()})),[]),{setDrawerActiveView:C,setSidebarActiveView:D,setCurrentOnboardingData:T,updateThemeStatus:k}=(0,r.useDispatch)(l.h);(0,n.useEffect)((()=>{D(u.Jq),C(u.Yl)}),[]),(0,n.useEffect)((()=>{S===u.GV&&async function(){const e=await(0,i.C)(E.patternId);if(null!=e&&e.error)return k(u.a0);w(function(e){const t=[];return e.forEach((e=>{t.push(e.content),b.push(e.slug)})),_(b),t}(null==e?void 0:e.body)),""!==(null==y?void 0:y.data.sitePages.homepage)?f(null==b?void 0:b.indexOf(null==y?void 0:y.data.sitePages.homepage)):(y.data.sitePages={...y.data.sitePages,homepage:b[0]},T(y))}()}),[S]);const x={heading:(0,g.__)("There’s no place like a great home page","wp-module-onboarding"),subheading:(0,g.__)("Pick a starter layout you can refine and remix with your content","wp-module-onboarding")};return(0,n.createElement)(c.U,null,(0,n.createElement)(m.V3,null,(0,n.createElement)(s.Z,null,(0,n.createElement)("div",{className:"homepage_preview"},(0,n.createElement)(d.Z,{title:x.heading,subtitle:x.subheading}),(0,n.createElement)("div",{className:"homepage_preview__list"},(0,n.createElement)(m.r9,{watch:a,count:null===(e=N[null==E?void 0:E.patternId])||void 0===e?void 0:e.previewCount,callback:function(){return null==a?void 0:a.map(((e,t)=>e?(0,n.createElement)(m.H,{key:t,className:"homepage_preview__list__item",selected:t===v,blockGrammer:e,viewportWidth:1200,styling:"custom",overlay:!1,onClick:()=>function(e){f(e);const t=b[e];y.data.sitePages={...y.data.sitePages,homepage:t},T(y),(0,h.tH)(new h.Z_(p.El,t))}(t)}):null))},className:"homepage_preview__list__item",viewportWidth:1200}))))))}}}]);