!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function a(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{sTBm:function(t,n,i){"use strict";i.r(n),i.d(n,"NewRoutingModule",function(){return x});var r,c=i("tyNb"),o=i("OCoP"),s=i("fXoL"),b=((r=function(){function t(){e(this,t)}return a(t,[{key:"ngOnInit",value:function(){}}]),t}()).\u0275fac=function(e){return new(e||r)},r.\u0275cmp=s.Cb({type:r,selectors:[["app-new-page"]],decls:10,vars:0,consts:[[1,"container"],[1,"row"],[1,"col","s12","m6"],["routerLink","match"],["routerLink","tournament"]],template:function(e,t){1&e&&(s.Lb(0,"div",0),s.Lb(1,"div",1),s.Lb(2,"div",2),s.Lb(3,"a",3),s.Lb(4,"h1"),s.kc(5,"Single match"),s.Kb(),s.Kb(),s.Kb(),s.Lb(6,"div",2),s.Lb(7,"a",4),s.Lb(8,"h1"),s.kc(9,"Tournament"),s.Kb(),s.Kb(),s.Kb(),s.Kb(),s.Kb())},directives:[c.e],styles:[""]}),r),l=i("mrSG"),m=i("3Pt+"),u=i("AytR"),f=i("qfBg"),h=i("wZ2L"),d=i("VfKn"),g=i("sYmb"),p=i("7JkF"),v=i("ofXK");function w(e,t){1&e&&(s.Lb(0,"h2",35),s.kc(1),s.Vb(2,"translate"),s.Kb()),2&e&&(s.wb(1),s.lc(s.Wb(2,1,"CREATE_MATCH.TITLE")))}function C(e,t){if(1&e){var a=s.Mb();s.Lb(0,"div",36),s.Lb(1,"a",37),s.Sb("click",function(){s.gc(a);var e=t.$implicit;return s.Ub(2).getPlatform(e.name,e.category,e.api_id,e.ico)}),s.Jb(2,"i"),s.Lb(3,"p"),s.kc(4),s.Kb(),s.Kb(),s.Kb()}if(2&e){var n=t.$implicit;s.wb(1),s.Xb("value",n.category),s.wb(1),s.zb("",n.ico," db-ico"),s.wb(2),s.lc(n.name)}}function k(e,t){if(1&e&&(s.Lb(0,"div",32),s.Lb(1,"div",16),s.jc(2,w,3,3,"h2",33),s.jc(3,C,5,5,"div",34),s.Kb(),s.Kb()),2&e){var a=s.Ub();s.wb(2),s.Xb("ngIf",!a.platformName),s.wb(1),s.Xb("ngForOf",a.platforms)}}function L(e,t){if(1&e){var a=s.Mb();s.Lb(0,"div",38),s.Sb("click",function(){s.gc(a);var e=t.$implicit;return s.Ub().selectGame(e.id,e.name,e.background_image)}),s.Jb(1,"img",39),s.Lb(2,"p"),s.kc(3),s.Kb(),s.Kb()}if(2&e){var n=t.$implicit;s.wb(1),s.Xb("src",n.background_image,s.hc),s.wb(2),s.lc(n.name)}}function y(e,t){1&e&&(s.Lb(0,"div",40),s.Jb(1,"br"),s.Lb(2,"h2"),s.kc(3),s.Vb(4,"translate"),s.Kb(),s.Jb(5,"br"),s.Lb(6,"h4",41),s.kc(7),s.Vb(8,"translate"),s.Kb(),s.Kb()),2&e&&(s.wb(3),s.lc(s.Wb(4,2,"CREATE_MATCH.PLATFORMS_EMPTY")),s.wb(4),s.lc(s.Wb(8,4,"CREATE_MATCH.ADD_PLATFORMS")))}function K(e,t){if(1&e&&(s.Lb(0,"div",48),s.Lb(1,"h4",49),s.kc(2),s.Vb(3,"translate"),s.Kb(),s.Kb()),2&e){var a=s.Ub(2);s.wb(2),s.nc("",s.Wb(3,2,"CREATE_MATCH.SEARCHING")," ",a.gameSearch,"")}}function I(e,t){if(1&e){var a=s.Mb();s.Lb(0,"div",42),s.Lb(1,"div",16),s.Lb(2,"div",43),s.Lb(3,"input",44,45),s.Sb("keyup",function(){s.gc(a);var e=s.fc(4);return s.Ub().searchGame(e.value)}),s.Kb(),s.Jb(5,"br"),s.Lb(6,"label",46),s.kc(7),s.Vb(8,"translate"),s.Kb(),s.Kb(),s.jc(9,K,4,4,"div",47),s.Kb(),s.Kb()}if(2&e){var n=s.Ub();s.wb(7),s.lc(s.Wb(8,2,"CREATE_MATCH.SEARCH_GAME")),s.wb(2),s.Xb("ngIf",n.gameSearch)}}function T(e,t){if(1&e){var a=s.Mb();s.Lb(0,"li",54),s.Sb("click",function(){s.gc(a);var e=t.$implicit;return s.Ub(2).addUser(e)}),s.Jb(1,"img",55),s.Lb(2,"h6"),s.kc(3),s.Kb(),s.Kb()}if(2&e){var n=t.$implicit,i=s.Ub(2);s.wb(1),s.bc("src","",i.url,"/upload/users/",n._id,"/",n.img,"",s.hc),s.wb(2),s.lc(n.username)}}function E(e,t){if(1&e){var a=s.Mb();s.Lb(0,"div",50),s.Lb(1,"div",48),s.Lb(2,"input",51,45),s.Sb("keyup",function(){s.gc(a);var e=s.fc(3);return s.Ub().searchUser(e)}),s.Vb(4,"translate"),s.Kb(),s.Lb(5,"ul",52),s.jc(6,T,4,4,"li",53),s.Kb(),s.Kb(),s.Kb()}if(2&e){var n=s.Ub();s.wb(2),s.Yb("placeholder",s.Wb(4,2,"CREATE_MATCH.SEARCH_USER")),s.wb(4),s.Xb("ngForOf",n.users)}}function _(e,t){if(1&e&&(s.Lb(0,"li",35),s.kc(1),s.Kb()),2&e){var a=t.$implicit;s.wb(1),s.lc(a)}}var M,S,A,P=[{path:"",component:o.a,children:[{path:"",component:b},{path:"match",component:(S=function(){function t(a,n,i,r,c,o,s){var b=this;e(this,t),this.fb=a,this.userService=n,this.gamesService=i,this.matchService=r,this.router=c,this.transleService=o,this.socket=s,this.matchDate="",this.users=[],this.invitedUsers=[],this.invitedUsers_=[],this.platforms=null,this.platformName=null,this.emptyPlatforms=!1,this.url=u.a.base_url,this.gameName="",this.gameId=0,this.actualPage=0,this.keyPressed=0,this.gameSearch=null,this.match=this.fb.group({name:["Casual Match",[m.o.required,m.o.max(20)]],date:[""],game_name:[this.gameName,[m.o.required]],game_id:[this.gameId,[m.o.required]],platform:[""],img:[""],users:[this.invitedUsers]}),this.loadInfo=function(){return Object(l.a)(b,void 0,void 0,regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.userService.userInfo().subscribe(function(e){t.user=e},function(e){return console.log(e)});case 2:this.user=e.sent;case 3:case"end":return e.stop()}},e,this)}))},this.loadPlatforms=function(){return Object(l.a)(b,void 0,void 0,regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.userService.userPlatforms().subscribe(function(e){t.platforms=e,0==t.platforms.length&&(t.emptyPlatforms=!0)},function(e){return console.log(e)});case 1:case"end":return e.stop()}},e,this)}))},this.searchGame=function(e){return Object(l.a)(b,void 0,void 0,regeneratorRuntime.mark(function t(){var a=this;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:this.keyPressed++,setTimeout(function(){a.keyPressed--,0==a.keyPressed&&(a.gameSearch=e,a.gamesService.searchGamesByPlatform(e,a.platformId).subscribe(function(e){openGamesModal(),a.games=e.results,a.gamesService.resizeImages(a.games),a.gameSearch=null},function(e){return console.log(e)}))},1500);case 1:case"end":return t.stop()}},t,this)}))},customInitFunctions(),this.loadInfo(),this.loadPlatforms()}return a(t,[{key:"createMatch",value:function(){var e=this;this.matchDate&&this.matchHour?(this.matchDate.setHours(this.matchHour[0]),this.matchDate.setMinutes(this.matchHour[1]),this.match.value.date=this.matchDate.getTime(),this.match.value.platform=this.platformId,this.match.value.game_name=this.gameName,this.match.value.game_id=this.gameId,this.match.value.img=this.gameImg,this.matchService.createMatch(this.match.value).subscribe(function(t){e.socket.emit("match_created",t.matchDB),e.transleService.get("CREATE_MATCH.MATCH_CREATED").subscribe(function(t){toastMessage(t,"green"),e.router.navigateByUrl("/profile/matches")})},function(e){return console.log(e)})):this.transleService.get("CREATE_MATCH.DATE_ERROR").subscribe(function(e){toastMessage(e,"red accent-4")})}},{key:"onDateChange",value:function(e){this.matchDate=new Date(e.firedBy.date),new Date,this.matchHour&&(this.matchDate.setHours(this.matchHour[0]),this.matchDate.setMinutes(this.matchHour[1]),resetScroll())}},{key:"onTimeChange",value:function(e){this.matchHour=e.target.value.split(":"),resetScroll()}},{key:"ngOnInit",value:function(){customInitFunctions()}},{key:"loadGames",value:function(){var e=this;this.gamesService.getGamesByPlatform(this.platformId,"1").subscribe(function(t){e.games=t},function(e){return console.log(e)})}},{key:"getPlatform",value:function(e,t,a,n){switch(this.platformName=e,this.platformCategory=t,this.platformId=a,this.platformIco=n,this.platformCategory){case"PlayStation":this.platformCategoryIco="icon-playstation";break;case"Xbox":this.platformCategoryIco="icon-xbox";break;case"Nintendo":this.platformCategoryIco="icon-nintendo";case"Mobile":this.platformCategoryIco="icon-smartphone large";break;case"PC":this.platformCategoryIco="icon-pc large"}this.platformsLoaded=this.platforms,this.platforms=null,this.emptyPlatforms=!1,dateInit(event)}},{key:"backToSelect",value:function(){openGamesModal(),this.platforms=this.platformsLoaded,this.platformId=null,this.platformName=null,document.getElementById("formulario").hidden=!0,document.getElementById("gameSelector").hidden=!1}},{key:"selectGame",value:function(e,t,a){this.gameName=t,this.gameId=e,this.gameImg=a,document.getElementById("formulario").hidden=!1,this.games=[],document.getElementById("gameSelector").hidden=!0,closeModal()}},{key:"searchUser",value:function(e){var t=this;this.keyPressed++,setTimeout(function(){if(t.keyPressed--,0==t.keyPressed){if(""==e.value)return void(t.users=[]);t.userService.searchPartners(e.value).subscribe(function(e){t.users=[];for(var a=0;a<e.length;a++){var n=e[a];n._id==t.user.uid||t.invitedUsers.includes(n._id)||t.users.push(n)}})}},1e3)}},{key:"addUser",value:function(e){this.invitedUsers.push(e._id),this.invitedUsers_.push(e.username),this.users=[]}}]),t}(),S.\u0275fac=function(e){return new(e||S)(s.Ib(m.c),s.Ib(f.a),s.Ib(h.a),s.Ib(d.a),s.Ib(c.b),s.Ib(g.d),s.Ib(p.a))},S.\u0275cmp=s.Cb({type:S,selectors:[["app-create-match"]],decls:64,vars:40,consts:[["class"," center-align col s12 animated fadeIn",4,"ngIf"],["id","modal1",1,"modal","open"],[1,"modal-content"],[1,"row","games"],["class","col s12 m4",3,"click",4,"ngFor","ngForOf"],["class","",4,"ngIf"],["class","container animated fadeIn","id","gameSelector",4,"ngIf"],["class","row container",4,"ngIf"],["id","formulario","hidden","",1,"row","mainCenter","container","animated","fadeIn","fast"],[1,"col","s12",3,"formGroup","ngSubmit"],[1,"row","marginTop"],[1,"col","m4","s12"],["id","platform"],[1,"input-field","col","s12","m8"],["id","first_name","type","text","formControlName","name",1,"validate","white-text"],["for","first_name"],[1,"row"],[1,"col","s12","m6"],[1,"white-text","center"],["class","deep-purple-text text-lighten-1",4,"ngFor","ngForOf"],[1,"input-field","col","s12","m6"],["type","text","formControlName","date",1,"datepicker","white-text",3,"change"],["type","hidden","formControlName","game_name","disabled","",3,"value"],["type","hidden","formControlName","game_id","disabled","",3,"value"],["type","hidden","formControlName","platform","disabled","",3,"value"],[1,"input-field","col","s12","m6","offset-m6"],["type","time","data-tooltip","Please press the clock",1,"white-text","tooltipped",3,"change"],["data-error","wrong","data-success","right",1,"helper-text","white-text"],[1,"row","white-text","center-align"],[1,"row","right"],["type","submit","name","action",1,"btn","waves-effect","deep-purple","accent-4"],[1,"material-icons","right"],[1,"center-align","col","s12","animated","fadeIn"],["class","deep-purple-text text-lighten-1",4,"ngIf"],["class","col s12 m4 l4 xl4 center-align black-text",4,"ngFor","ngForOf"],[1,"deep-purple-text","text-lighten-1"],[1,"col","s12","m4","l4","xl4","center-align","black-text"],[3,"value","click"],[1,"col","s12","m4",3,"click"],["alt","game.name","width","100%","height","200",1,"game",3,"src"],[1,""],["routerLink","/profile/platforms",1,"teal-text","text-accent-4"],["id","gameSelector",1,"container","animated","fadeIn"],[1,"input-field","col","s12"],["id","search","type","text","autofocus","",1,"validate",3,"keyup"],["search",""],["for","search"],["class","col s12",4,"ngIf"],[1,"col","s12"],[1,"center-align","loading_icon"],[1,"row","container"],["id","search_user","type","text",3,"placeholder","keyup"],["id","foundedUsers"],[3,"click",4,"ngFor","ngForOf"],[3,"click"],["alt","","width","100%","height","100px",1,"center-align",3,"src"]],template:function(e,t){1&e&&(s.Lb(0,"div"),s.jc(1,k,4,2,"div",0),s.Lb(2,"div",1),s.Lb(3,"div",2),s.Lb(4,"h4"),s.kc(5),s.Vb(6,"translate"),s.Kb(),s.Lb(7,"div",3),s.jc(8,L,4,2,"div",4),s.Kb(),s.Kb(),s.Kb(),s.jc(9,y,9,6,"div",5),s.jc(10,I,10,4,"div",6),s.jc(11,E,7,4,"div",7),s.Lb(12,"div",8),s.Lb(13,"form",9),s.Sb("ngSubmit",function(){return t.createMatch()}),s.Lb(14,"div",10),s.Lb(15,"div",11),s.Jb(16,"i",12),s.Kb(),s.Lb(17,"div",13),s.Jb(18,"input",14),s.Lb(19,"label",15),s.kc(20),s.Vb(21,"translate"),s.Kb(),s.Kb(),s.Kb(),s.Lb(22,"div",16),s.Lb(23,"div",17),s.Lb(24,"h6",18),s.kc(25),s.Vb(26,"translate"),s.Kb(),s.Lb(27,"ul"),s.jc(28,_,2,1,"li",19),s.Kb(),s.Kb(),s.Lb(29,"div",20),s.Lb(30,"input",21),s.Sb("change",function(e){return t.onDateChange(e)}),s.Kb(),s.Lb(31,"label"),s.kc(32),s.Vb(33,"translate"),s.Kb(),s.Kb(),s.Jb(34,"input",22),s.Jb(35,"input",23),s.Jb(36,"input",24),s.Lb(37,"div",25),s.Lb(38,"input",26),s.Sb("change",function(e){return t.onTimeChange(e)}),s.Kb(),s.Lb(39,"label"),s.kc(40),s.Vb(41,"translate"),s.Kb(),s.Lb(42,"span",27),s.kc(43),s.Vb(44,"translate"),s.Kb(),s.Kb(),s.Kb(),s.Lb(45,"div",28),s.Lb(46,"div",11),s.Lb(47,"h5"),s.kc(48),s.Kb(),s.Kb(),s.Lb(49,"div",11),s.Lb(50,"h5"),s.kc(51),s.Kb(),s.Kb(),s.Lb(52,"div",11),s.Lb(53,"h5"),s.kc(54),s.Kb(),s.Kb(),s.Kb(),s.Lb(55,"div",29),s.Lb(56,"button",30),s.kc(57),s.Vb(58,"translate"),s.Lb(59,"i",31),s.kc(60),s.Vb(61,"translate"),s.Kb(),s.Kb(),s.Kb(),s.Kb(),s.Jb(62,"br"),s.Kb(),s.Jb(63,"br"),s.Kb()),2&e&&(s.wb(1),s.Xb("ngIf",!t.emptyPlatforms),s.wb(4),s.lc(s.Wb(6,24,"CREATE_MATCH.SEARCH_RESULTS")),s.wb(3),s.Xb("ngForOf",t.games),s.wb(1),s.Xb("ngIf",t.emptyPlatforms),s.wb(1),s.Xb("ngIf",t.platformName),s.wb(1),s.Xb("ngIf",t.gameId),s.wb(2),s.Xb("formGroup",t.match),s.wb(3),s.zb("",t.platformCategoryIco," large white-text"),s.wb(4),s.lc(s.Wb(21,26,"CREATE_MATCH.MATCH_NAME")),s.wb(5),s.lc(s.Wb(26,28,"CREATE_MATCH.INVITEDS")),s.wb(3),s.Xb("ngForOf",t.invitedUsers_),s.wb(4),s.lc(s.Wb(33,30,"CREATE_MATCH.DATE")),s.wb(2),s.Xb("value",t.gameName),s.wb(1),s.Xb("value",t.gameId),s.wb(1),s.Xb("value",t.platformId),s.wb(4),s.lc(s.Wb(41,32,"CREATE_MATCH.TIME")),s.wb(3),s.lc(s.Wb(44,34,"CREATE_MATCH.CLOCK_MESSAGE")),s.wb(5),s.lc(t.user.name),s.wb(3),s.lc(t.platformName),s.wb(3),s.lc(t.gameName),s.wb(3),s.mc("",s.Wb(58,36,"CREATE_MATCH.SUBMIT")," "),s.wb(3),s.lc(s.Wb(61,38,"CREATE_MATCH.CREATE_MATCH")))},directives:[v.j,v.i,m.q,m.i,m.f,m.a,m.h,m.e,c.c],pipes:[g.c],styles:["#platform[_ngcontent-%COMP%]{padding:40px}.marginTop[_ngcontent-%COMP%]{margin-top:40px}label[_ngcontent-%COMP%]{font-size:1.5em;z-index:-1;font-family:Cyberverse}a[_ngcontent-%COMP%]{cursor:pointer}.col[_ngcontent-%COMP%]{padding:22px}.db-ico[_ngcontent-%COMP%]{color:#000;font-size:20em;transition:.5s}.db-ico[_ngcontent-%COMP%]:hover{color:#fff;transition:.5s}h4[_ngcontent-%COMP%]{color:grey}.modal[_ngcontent-%COMP%]{background-color:#000;width:85%}.platform[_ngcontent-%COMP%]{display:flex;justify-content:space-around;padding:10px}"]}),S)},{path:"tournament",component:(M=function(){function t(){e(this,t)}return a(t,[{key:"ngOnInit",value:function(){}}]),t}(),M.\u0275fac=function(e){return new(e||M)},M.\u0275cmp=s.Cb({type:M,selectors:[["app-tournament"]],decls:2,vars:0,template:function(e,t){1&e&&(s.Lb(0,"p"),s.kc(1,"tournament works!"),s.Kb())},styles:[""]}),M)}]}],x=((A=function t(){e(this,t)}).\u0275mod=s.Gb({type:A}),A.\u0275inj=s.Fb({factory:function(e){return new(e||A)},imports:[[c.f.forChild(P)],c.f]}),A)}}])}();