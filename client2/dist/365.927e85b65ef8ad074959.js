"use strict";(self.webpackChunkclient2=self.webpackChunkclient2||[]).push([[365],{365:(e,t,a)=>{a.r(t),a.d(t,{default:()=>b});var n=a(5861),r=a(885),c=a(7757),l=a.n(c),s=a(7294),o=a(6974),u=a(4745),i=a(9574),m=a(9711),d=a(7913),f=a(5622),p=a(2228);const v=function(e){var t=e.post,a=(0,o.s0)(),c=(0,f.i)((function(e){var t=e.currentUser;return[t.isLoggedIn,t.username,t.token]})),i=(0,r.Z)(c,3),v=i[0],E=i[1],h=i[2],b=(0,p.o)().addFlashMessage,Z=function(){var e=(0,n.Z)(l().mark((function e(n){var c,s,o;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Do you really want to delete this post?")){e.next=14;break}if(c=(0,u.fR)(t._id,h),s=(0,r.Z)(c,2),o=s[0],s[1],e.prev=3,!o){e.next=9;break}return e.next=7,o();case 7:"Success"==e.sent&&(b("Post deleted successfully"),a("/profile/".concat(E)));case 9:e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),console.log("there was a problem.",e.t0);case 14:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(t){return e.apply(this,arguments)}}(),k=new Date((null==t?void 0:t.createdDate)||""),w="".concat(k.getMonth()+1,"/").concat(k.getDate(),"/").concat(k.getFullYear()," ");return s.createElement(s.Fragment,null,s.createElement("div",{className:"d-flex justify-content-between"},s.createElement("h2",null,null==t?void 0:t.title),!!v&&E==t.author.username&&s.createElement("span",{className:"pt-2"},s.createElement(m.rU,{to:"/post/".concat(t._id,"/edit"),"data-tip":"Edit","data-for":"edit",className:"text-primary mr-2"},s.createElement("i",{className:"fas fa-edit"})),s.createElement(d.Z,{id:"edit",className:"custom-tooltip"})," ",s.createElement("a",{"data-tip":"Delete","data-for":"delete",className:"delete-post-button text-danger",onClick:Z},s.createElement("i",{className:"fas fa-trash"})),s.createElement(d.Z,{id:"delete",className:"custom-tooltip"}))),s.createElement("p",{className:"text-muted small mb-4"},s.createElement(m.rU,{to:"/profile/".concat(t.author.username)},s.createElement("img",{className:"avatar-tiny",src:null==t?void 0:t.author.avatar})),"Posted by"," ",s.createElement(m.rU,{to:"/profile/".concat(t.author.username)},null==t?void 0:t.author.username)," ","on ",w),s.createElement("div",{className:"body-content"},s.createElement("p",null,null==t?void 0:t.body)))};var E=a(1061),h=a(3986);const b=function(){var e=(0,s.useState)(!0),t=(0,r.Z)(e,2),a=t[0],c=t[1],m=(0,s.useState)(),d=(0,r.Z)(m,2),f=d[0],p=d[1],b=(0,o.UO)().id;return(0,s.useEffect)((function(){var e=(0,u.JF)(b||""),t=(0,r.Z)(e,2),a=t[0],s=t[1],o=function(){var e=(0,n.Z)(l().mark((function e(){var t;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,!a){e.next=7;break}return e.next=4,a();case 4:t=e.sent,p(t),c(!1);case 7:e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),c(!1),console.log("There was a problem");case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}();return o(),function(){null==s||s.cancel()}}),[b]),a||f?a||!f?s.createElement(i.Z,{title:"..."},s.createElement(E.Z,null)):s.createElement(i.Z,{title:f.title},s.createElement(v,{post:f})):s.createElement(i.Z,{title:"NotFound"},"test",s.createElement(h.Z,null))}}}]);