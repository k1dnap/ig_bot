(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{O40h:function(t,e,a){"use strict";a.d(e,"a",function(){return i});var n=a("eVuF"),r=a.n(n);function o(t,e,a,n,o,i,s){try{var c=t[i](s),l=c.value}catch(u){return void a(u)}c.done?e(l):r.a.resolve(l).then(n,o)}function i(t){return function(){var e=this,a=arguments;return new r.a(function(n,r){var i=t.apply(e,a);function s(t){o(i,n,r,s,c,"next",t)}function c(t){o(i,n,r,s,c,"throw",t)}s(void 0)})}}},"W+IF":function(t,e,a){"use strict";a.r(e),a.d(e,"default",function(){return v});var n=a("ln6h"),r=a.n(n),o=a("O40h"),i=a("0iUn"),s=a("sLSF"),c=a("MI3g"),l=a("a7VT"),u=a("Tit0"),d=a("q1tI"),p=a.n(d),f=a("4J7I"),h=(a("YFqc"),p.a.createElement),v=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(c.a)(this,Object(l.a)(e).call(this,t))).state={data:{},scraped_accounts:[],isFetching:!0,error:null},a}return Object(u.a)(e,t),Object(s.a)(e,[{key:"componentDidMount",value:function(){this.loadProfileData()}},{key:"loadProfileData",value:function(){var t=Object(o.a)(r.a.mark(function t(){var e,a,n,o;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e=window.location.search.split("login=")[1].split("&")[0],t.next=4,fetch("/api/profile_data?login="+e);case 4:return a=t.sent,t.next=7,a.json();case 7:return n=t.sent,this.setState({data:n,isFetching:!1}),t.next=11,fetch("/api/scraped_accounts");case 11:return a=t.sent,t.next=14,a.json();case 14:o=t.sent,this.setState({scraped_accounts:o,isFetching:!1}),t.next=21;break;case 18:t.prev=18,t.t0=t.catch(0),this.setState({isFetching:!1,error:t.t0});case 21:case"end":return t.stop()}},t,this,[[0,18]])}));return function(){return t.apply(this,arguments)}}()},{key:"profileChangeState",value:function(){var t=Object(o.a)(r.a.mark(function t(){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"followAll",value:function(){var t=Object(o.a)(r.a.mark(function t(){var e;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=window.location.search.split("login=")[1].split("&")[0],t.next=3,fetch("/api/start_following?login="+e);case 3:t.sent;case 4:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"openModal",value:function(){var t=Object(o.a)(r.a.mark(function t(){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"closeModal",value:function(){var t=Object(o.a)(r.a.mark(function t(){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t;if(this.state.isFetching)t=h("p",null,"Loading data");else if(this.state.error)t=h("p",null,"Error on loading data");else{var e=this.state.data,a=this.state.scraped_accounts;console.log(a),a=0===a.length?"no scraped_accounts":a.map(function(t,e){return h("label",{key:e},h("input",{type:"checkbox",name:"subcategories[]",value:"1",checked:!0}),t.from)}),t=h("div",{className:"container"},h("h4",null,"Profile: "+e.login),h("button",{type:"button",class:"btn btn-secondary","data-toggle":"modal","data-target":"#exampleModal"},"Manage follow list"),h("div",{class:"modal fade",id:"exampleModal",tabindex:"-1",role:"dialog","aria-labelledby":"exampleModalLabel","aria-hidden":"true"},h("div",{class:"modal-dialog",role:"document"},h("div",{class:"modal-content"},h("div",{class:"modal-header"},h("h5",{class:"modal-title",id:"exampleModalLabel"},"Modal title"),h("button",{type:"button",class:"close","data-dismiss":"modal","aria-label":"Close"},h("span",{"aria-hidden":"true"},"\xd7"))),h("div",{class:"modal-body"},a),h("div",{class:"modal-footer"},h("button",{type:"button",class:"btn btn-secondary","data-dismiss":"modal"},"Close"))))),h("a",{onClick:this.followAll,className:"btn btn-secondary",role:"button"},"Start followAll()"))}return h("div",null,t,"<script>console.log('123123123123') <\/script>",h(f.a,{title:"Profiles",nav:"Profiles"}))}}]),e}(p.a.Component)},u1GD:function(t,e,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/profile",function(){var t=a("W+IF");return{page:t.default||t}}])}},[["u1GD",1,0]]]);