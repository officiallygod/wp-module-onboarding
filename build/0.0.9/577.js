"use strict";(self.webpackChunknewfold_Onboarding=self.webpackChunknewfold_Onboarding||[]).push([[577],{5791:function(e,n,t){t.d(n,{Z:function(){return f}});var a=t(9307),r=(t(5609),t(4184)),s=t.n(r),i=t(5158),d=t(6974),o=t(2200),c=t(6989),l=t.n(c),u=e=>{let{className:n="nfd-onboarding-layout__base",children:t}=e;const r=(0,d.TH)(),c=document.querySelector(".nfd-onboard-content");return(0,a.useEffect)((()=>{null==c||c.focus({preventScroll:!0}),function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Showing new Onboarding Page";(0,i.speak)(n,"assertive")}(r,"Override"),new class{constructor(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.eventSlug=e,this.eventData=n}send(){l()({url:`${o.bQ}/events`,method:"POST",data:{slug:this.eventSlug,data:this.eventData}}).catch((e=>{console.error(e)}))}}(`${o.Db}-pageview`,{stepID:r.pathname,previousStepID:window.nfdOnboarding.previousStepID}).send(),window.nfdOnboarding.previousStepID=r.pathname}),[r.pathname]),(0,a.createElement)("div",{className:s()("nfd-onboarding-layout",n)},t)};const p=e=>{let{children:n}=e;return(0,a.createElement)("section",{className:"is-contained"},n)};var f=e=>{let{className:n="",children:t,isBgPrimary:r=!1,isCentered:i=!1,isVerticallyCentered:d=!1,isContained:o=!1,isPadded:c=!1,isFadeIn:l=!0}=e;const f=o?p:a.Fragment;return(0,a.createElement)(u,{className:s()("nfd-onboarding-layout__common",n,{"is-layout-fade-in":l},{"is-bg-primary":r},{"is-centered":i},{"is-vertically-centered":d},{"is-padded":c})},(0,a.createElement)(f,null,t))}},7577:function(e,n,t){t.r(n);var a=t(9307),r=t(5791),s=t(2200),i=t(9685),d=t(9818);n.default=()=>{const{setIsDrawerOpened:e,setDrawerActiveView:n,setIsSidebarOpened:t}=(0,d.useDispatch)(i.h);return(0,a.useEffect)((()=>{t(!1),e(!0),n(s.BP)}),[]),(0,a.createElement)(r.Z,{isCentered:!0},"What To Expect")}}}]);