(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{O40h:function(t,e,a){"use strict";a.d(e,"a",function(){return i});var n=a("eVuF"),o=a.n(n);function r(t,e,a,n,r,i,s){try{var l=t[i](s),c=l.value}catch(u){return void a(u)}l.done?e(c):o.a.resolve(c).then(n,r)}function i(t){return function(){var e=this,a=arguments;return new o.a(function(n,o){var i=t.apply(e,a);function s(t){r(i,n,o,s,l,"next",t)}function l(t){r(i,n,o,s,l,"throw",t)}s(void 0)})}}},"W+IF":function(t,e,a){"use strict";a.r(e),a.d(e,"default",function(){return v});var n=a("ln6h"),o=a.n(n),r=a("O40h"),i=a("0iUn"),s=a("sLSF"),l=a("MI3g"),c=a("a7VT"),u=a("Tit0"),d=a("q1tI"),p=a.n(d),f=a("4J7I"),h=(a("YFqc"),p.a.createElement),v=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(l.a)(this,Object(c.a)(e).call(this,t))).state={data:{},scraped_accounts:[],isFetching:!0,error:null},a}return Object(u.a)(e,t),Object(s.a)(e,[{key:"componentDidMount",value:function(){this.loadProfileData()}},{key:"loadProfileData",value:function(){var t=Object(r.a)(o.a.mark(function t(){var e,a,n,r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e=window.location.search.split("login=")[1].split("&")[0],t.next=4,fetch("/api/profile_data?login="+e);case 4:return a=t.sent,t.next=7,a.json();case 7:return n=t.sent,this.setState({data:n,isFetching:!1}),t.next=11,fetch("/api/scraped_accounts");case 11:return a=t.sent,t.next=14,a.json();case 14:r=t.sent,this.setState({scraped_accounts:r,isFetching:!1}),t.next=21;break;case 18:t.prev=18,t.t0=t.catch(0),this.setState({isFetching:!1,error:t.t0});case 21:case"end":return t.stop()}},t,this,[[0,18]])}));return function(){return t.apply(this,arguments)}}()},{key:"profileChangeState",value:function(){var t=Object(r.a)(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"followAll",value:function(){var t=Object(r.a)(o.a.mark(function t(){var e;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=window.location.search.split("login=")[1].split("&")[0],t.next=3,fetch("/api/start_following?login="+e);case 3:t.sent;case 4:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t,e=this;if(this.state.isFetching)t=h("p",null,"Loading data");else if(this.state.error)t=h("p",null,"Error on loading data");else{var a=this.state.data,n=this.state.scraped_accounts;console.log(n),n=n.map(function(t,a){return h("label",{key:a},h("input",{type:"checkbox",name:"subcategories[]",onClick:e.profileChangeState,value:"1",checked:!0}),t)}),t=h("div",{className:"container"},h("h4",null,"Profile: "+a.login),h("button",{type:"button",classname:"btn btn-secondary","data-toggle":"modal","data-target":"#exampleModal"},"Manage follow list"),h("div",{classname:"modal fade",id:"exampleModal",tabindex:"-1",role:"dialog","aria-labelledby":"exampleModalLabel","aria-hidden":"true"},h("div",{classname:"modal-dialog",role:"document"},h("div",{classname:"modal-content"},h("div",{classname:"modal-header"},h("h5",{classname:"modal-title",id:"exampleModalLabel"},"Manage scraped_accounts"),h("button",{type:"button",classname:"close","data-dismiss":"modal","aria-label":"Close"},h("span",{"aria-hidden":"true"},"\xd7"))),h("div",{classname:"modal-body"},n),h("div",{classname:"modal-footer"},h("button",{type:"button",classname:"btn btn-secondary","data-dismiss":"modal"},"Close"))))),h("a",{onClick:this.followAll,className:"btn btn-secondary",role:"button"},"Start followAll()"))}return h("div",null,t,h(f.a,{title:"Profiles",nav:"Profiles"}))}}]),e}(p.a.Component)},u1GD:function(t,e,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/profile",function(){var t=a("W+IF");return{page:t.default||t}}])}},[["u1GD",1,0]]]);