(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{O40h:function(t,e,n){"use strict";n.d(e,"a",function(){return i});var a=n("eVuF"),r=n.n(a);function o(t,e,n,a,o,i,s){try{var l=t[i](s),c=l.value}catch(u){return void n(u)}l.done?e(c):r.a.resolve(c).then(a,o)}function i(t){return function(){var e=this,n=arguments;return new r.a(function(a,r){var i=t.apply(e,n);function s(t){o(i,a,r,s,l,"next",t)}function l(t){o(i,a,r,s,l,"throw",t)}s(void 0)})}}},"W+IF":function(t,e,n){"use strict";n.r(e),n.d(e,"default",function(){return m});var a=n("d04V"),r=n.n(a),o=n("ln6h"),i=n.n(o),s=n("O40h"),l=n("0iUn"),c=n("sLSF"),u=n("MI3g"),d=n("a7VT"),p=n("Tit0"),f=n("q1tI"),h=n.n(f),v=n("4J7I"),b=(n("YFqc"),h.a.createElement),m=function(t){function e(t){var n;return Object(l.a)(this,e),(n=Object(u.a)(this,Object(d.a)(e).call(this,t))).state={data:{},scraped_accounts:[],isFetching:!0,error:null},n}return Object(p.a)(e,t),Object(c.a)(e,[{key:"componentDidMount",value:function(){this.loadProfileData()}},{key:"loadProfileData",value:function(){var t=Object(s.a)(i.a.mark(function t(){var e,n,a,r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e=window.location.search.split("login=")[1].split("&")[0],t.next=4,fetch("/api/profile_data?login="+e);case 4:return n=t.sent,t.next=7,n.json();case 7:return a=t.sent,this.setState({data:a,isFetching:!1}),t.next=11,fetch("/api/scraped_accounts");case 11:return n=t.sent,t.next=14,n.json();case 14:r=t.sent,this.setState({scraped_accounts:r,isFetching:!1}),t.next=21;break;case 18:t.prev=18,t.t0=t.catch(0),this.setState({isFetching:!1,error:t.t0});case 21:case"end":return t.stop()}},t,this,[[0,18]])}));return function(){return t.apply(this,arguments)}}()},{key:"submitForm",value:function(){var t=Object(s.a)(i.a.mark(function t(){var e,n;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=window.location.search.split("login=")[1].split("&")[0],n=r()(document.querySelectorAll('input[name="subcategories[]"]')).filter(function(t){return t.checked}).map(function(t){return t.value}).join("|"),t.next=4,fetch("/api/manage_followers_list?login="+e+"&arr="+n);case 4:t.sent;case 5:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"followAll",value:function(){var t=Object(s.a)(i.a.mark(function t(){var e;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=window.location.search.split("login=")[1].split("&")[0],t.next=3,fetch("/api/start_following?login="+e);case 3:t.sent;case 4:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"openModal",value:function(){var t=Object(s.a)(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"closeModal",value:function(){var t=Object(s.a)(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t;if(this.state.isFetching)t=b("p",null,"Loading data");else if(this.state.error)t=b("p",null,"Error on loading data");else{var e=this.state.data,n=this.state.scraped_accounts;console.log(n),n=0===n.length?"no scraped_accounts":n.map(function(t,e){return b("label",{key:e},b("input",{type:"checkbox",name:"subcategories[]",value:t.from,defaultChecked:!0})," "+t.from)}),t=b("div",{className:"container"},b("h4",null,"Profile: "+e.login),b("button",{type:"button",class:"btn btn-secondary","data-toggle":"modal","data-target":"#exampleModal"},"Manage follow list"),b("br",null),b("br",null),b("div",{class:"modal fade",id:"exampleModal",tabindex:"-1",role:"dialog","aria-labelledby":"exampleModalLabel","aria-hidden":"true"},b("div",{class:"modal-dialog",role:"document"},b("div",{class:"modal-content"},b("div",{class:"modal-header"},b("h5",{class:"modal-title",id:"exampleModalLabel"},"Manage follow list"),b("button",{type:"button",class:"close","data-dismiss":"modal","aria-label":"Close"},b("span",{"aria-hidden":"true"},"\xd7"))),b("div",{class:"modal-body"},n),b("div",{class:"modal-footer"},b("button",{type:"button",onClick:this.submitForm,class:"btn btn-primary"},"Save changes"),b("button",{type:"button",class:"btn btn-secondary","data-dismiss":"modal"},"Close"))))),b("button",{onClick:this.followAll,className:"btn btn-secondary",role:"button"},"Start followAll()"))}return b("div",null,t,b(v.a,{title:"Profiles",nav:"Profiles"}))}}]),e}(h.a.Component)},u1GD:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/profile",function(){var t=n("W+IF");return{page:t.default||t}}])}},[["u1GD",1,0]]]);