"use strict";(self.webpackChunkclient2=self.webpackChunkclient2||[]).push([[700],{5700:(e,t,a)=>{a.r(t),a.d(t,{default:()=>h});var r=a(2982),c=a(4942),n=a(885),s=a(7294),l=a(9711),o=a(2228),u=a(5622),i=a(3213);function m(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function f(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?m(Object(a),!0).forEach((function(t){(0,c.Z)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):m(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}const h=function(){var e=(0,o.o)(),t=e.closeChat,a=e.addUnreadChatCount,c=e.clearUnreadChatCount,m=(0,u.i)((function(e){var t=e.currentUser;return[t.username,t.avatar,t.token,e.chat.isChatOpen]})),h=(0,n.Z)(m,4),p=h[0],d=h[1],g=h[2],v=h[3],b=(0,s.useRef)(null),E=(0,s.useRef)(null),O=(0,s.useRef)(null),y=(0,s.useState)({fieldValue:"",chatMessages:[]}),N=(0,n.Z)(y,2),w=N[0],C=N[1];return(0,s.useEffect)((function(){b.current&&v&&(b.current.focus(),c())}),[v]),(0,s.useEffect)((function(){return O.current=(0,i.io)("http://localhost:8000"),O.current.on("chatFromServer",(function(e){C((function(t){return f(f({},t),{},{chatMessages:[].concat((0,r.Z)(t.chatMessages),[e])})}))})),function(){var e;null===(e=O.current)||void 0===e||e.disconnect()}}),[]),(0,s.useEffect)((function(){E.current&&(v&&(E.current.scrollTop=E.current.scrollHeight),!v&&w.chatMessages.length&&a())}),[w.chatMessages]),s.createElement("div",{id:"chat-wrapper",className:"chat-wrapper shadow border-top border-left border-right "+(v?"chat-wrapper--is-visible":"")},s.createElement("div",{className:"chat-title-bar bg-primary"},"Chat",s.createElement("span",{onClick:t,className:"chat-title-bar-close"},s.createElement("i",{className:"fas fa-times-circle"}))),s.createElement("div",{id:"chat",className:"chat-log",ref:E},w.chatMessages.map((function(e,t){return e.username==p?s.createElement("div",{key:t,className:"chat-self"},s.createElement("div",{className:"chat-message"},s.createElement("div",{className:"chat-message-inner"},e.message)),s.createElement("img",{className:"chat-avatar avatar-tiny",src:e.avatar})):s.createElement("div",{className:"chat-other"},s.createElement(l.rU,{to:"/profile/".concat(e.username)},s.createElement("img",{className:"avatar-tiny",src:e.avatar})),s.createElement("div",{className:"chat-message"},s.createElement("div",{className:"chat-message-inner"},s.createElement(l.rU,{to:"/profile/".concat(e.username)},s.createElement("strong",null,e.username,": "))," ",e.message)))}))),s.createElement("form",{onSubmit:function(e){e.preventDefault(),console.log(O.current),O.current&&(O.current.emit("chatFromBrowser",{message:w.fieldValue,token:g}),C((function(e){return f(f({},e),{},{chatMessages:[].concat((0,r.Z)(e.chatMessages),[{message:w.fieldValue,username:p,avatar:d}]),fieldValue:""})})))},id:"chatForm",className:"chat-form border-top"},s.createElement("input",{type:"text",className:"chat-field",id:"chatField",placeholder:"Type a message…",autoComplete:"off",ref:b,value:w.fieldValue,onChange:function(e){C(f(f({},w),{},{fieldValue:e.target.value}))}})))}}}]);