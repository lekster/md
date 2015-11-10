/*
 * SmartMenus.org "common.js"
 * Depends on: jQuery
 * Copyright 2013, Vasil Dinkov, http://www.smartmenus.org
 */

$(function() {

	// SmartMenus init
	// =================================

	// Main menu
	$('#main-menu').smartmenus({
			markCurrentItem: true,
			subMenusSubOffsetX: 1,
			subMenusSubOffsetY: -8
		})
		// do not highlight the home (SmartMenus) item
		.find('> li:first > a').removeClass('current');
	// make sure Blog item is highlighted for all blog entries
	if (/\/blog\//.test(window.location.href))
		$('#main-menu > li > a[href*="/blog/"]').addClass('current');

	// add menu show hide button on sub pages
	/*if (!$('body.home')[0] && $('#main-menu')[0]) {
		var $menuButton = $('<a href="#" class="gray-button"></a>').click(function(e) {
			var $this = $(this),
				$menu = $('#main-menu');
			if (!$this.parent().hasClass('expand')) {
				$menu.addClass('hidden');
				$this.parent().addClass('expand');
			} else {
				$menu.removeClass('hidden');
				$this.parent().removeClass('expand');
			}
			return false;
		}).prependTo($('#header > .inner')).wrap('<p id="menu-button"></p>').click();
	}*/

	// Docs menu
	var $docsMenu = $('#docs-menu');
	$docsMenu.smartmenus({
		collapsibleShowFunction: function($ul, complete) { $ul.slideDown(200, complete); },
		collapsibleHideFunction: function($ul, complete) { $ul.slideUp(200, complete); },
		hideOnClick: false
	});
	// reset menu on main menu item select
	$docsMenu.bind('select.smapi', function(e, item) {
		if ($(item).parent().parent()[0] === this && (!$(item).parent().dataSM('sub') || !$(item).parent().dataSM('sub').is(':visible')))
			$(this).smartmenus('menuHideAll');
	});

	// share buttons
	// =================================
	$('#share').mouseenter(function() {
		var $this = $(this);
		if (!$this.data('init')) {
			$this.html('<div id="fb-root"></div><div style="margin-right:15px;" class="fb-share-button" data-href="http://www.smartmenus.org" data-send="false" data-type="button_count" data-width="90" data-show-faces="false" data-colorscheme="dark"></div><a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.smartmenus.org" data-text="Responsive and accessible jQuery website menu plugin by @vadikom" data-count="horizontal" data-related="vadikom"></a><div class="g-plusone" data-size="medium" data-href="http://www.smartmenus.org"></div>');
			(function(d, s, id) {
			  var js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return;
			  js = d.createElement(s); js.id = id;
			  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=141156142734726";
			  fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
			(function() {
			  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			  po.src = 'https://apis.google.com/js/plusone.js';
			  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
			})();
			!function(e,t,n){
			var r,i=e.getElementsByTagName(t)[0];
			r=e.createElement(t);
			r.id=n;
			r.src="//platform.twitter.com/widgets.js"
			i.parentNode.insertBefore(r,i)
			}(document,"script","twitter-wjs");

			$this.data('init', true);
		}
	});

	// newsletter email field
	// =================================
	var $email_input = $('#id_email'),
		$subscribeButton = $('<span id="subscribe-button" aria-hidden="true" data-icon="1"></span>').click(function() { if (!$(this).hasClass('disabled')) $('#newsletter').submit(); });
	$email_input.after($subscribeButton)
		.bind('keyup change', function() {
			if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test($email_input.val())) {
				$subscribeButton.attr('title', 'Subscribe').removeClass('disabled');
			} else {
				$subscribeButton.attr('title', 'Enter a valid email first').addClass('disabled');
			}
		}).keyup();

	// link contact emails
	// =================================
	$('span.contact-link').each(function() {
		var $this = $(this);
		$this.wrap('<a href="mailto:' + ($this.data('address') == 'smartmenus' ? 'smartmenus@smartmenus.org' : $this.data('address') == 'hello' ? 'hello@vadikom.com' : '#') + '"></a>');
	});

	// init SHJS (syntax highlighter)
	// =================================
	window.sh_highlightDocument();

	// smooth scroll on Docs page
	// =================================
	$('body.docs a').smoothScroll();

	// Google Analytics - track downloads and external links
	// =================================
	if (typeof pageTracker != 'undefined') {
		$('a').each(function() {
			var href = this.href;
			if (!href)
				return;

			var trackFileTypes = ['zip', 'gz', 'bz2', 'rar', 'pdf'],
				fileExt = href.substring(href.lastIndexOf('.') + 1),
				hrefNoProtocol = href.replace(/https?:\/\//, ''),
				domain = hrefNoProtocol.substring(0, hrefNoProtocol.indexOf('/'));

			// track downloads
			if ($.inArray(fileExt, trackFileTypes) > -1) {
				$(this).click(function() {
					pageTracker._trackEvent('Downloads', fileExt.toUpperCase() + ' files', href);
				});
			// track extrenal links
			} else if (/^http/.test(href) && domain != document.domain) {
				$(this).click(function() {
					pageTracker._trackEvent('Extrenal Links', domain, href);
				});
			}
		});
	}

	// promo
	// =================================
	var $promo = $('#promo');
	if (document.cookie.indexOf("nopromo") < 0 && $promo.length) {
		$('<a class="close" title="Close" href="#"><span aria-hidden="true" data-icon="x"></span></a>').click(function() {
			$promo.animate({ opacity: 0 }, 500).slideUp(500);
			var expire = new Date();
			expire.setTime(expire.getTime() + (90 * 24 * 60 * 60 * 1000));
			document.cookie = "nopromo=true; expires=" + expire.toGMTString() + "; path=/";
			return false;
		}).prependTo($promo.children('p'));
		$promo.on('click', 'a', function() { $promo.find('a.close').click(); }).slideDown(500).animate({ opacity: 1 }, 500);
	}

	// toggle between login/register panels
	// =================================
	var $registerLoginPanels = $('#register-panel, #login-panel');
	if ($registerLoginPanels.length == 2) {
		// hide inactive panel
		$registerLoginPanels.each(function() {
			var $this = $(this);
			$this[$this.hasClass('active') ? 'show' : 'hide']();
		});
		function toggleRegisterLoginPanels() {
			$registerLoginPanels.toggleClass('active').slideToggle(250);
			return false;
		}
		$registerLoginPanels.eq(0).append('<p><a href="#">Already have an account and want to login?</a></p>').find('a').eq(-1).click(toggleRegisterLoginPanels);
		$registerLoginPanels.eq(1).append('<p><a href="#">Need a new account?</a></p>').find('a').eq(-1).click(toggleRegisterLoginPanels);
	}

	// toggle expired purchases
	// =================================
	var $expiredWrapper = $('#expired-wrapper');
	if ($expiredWrapper.length) {
		$expiredWrapper
			// insert a toggle link
			.before('<p><a href="#">Show expired purchases</a></p>')
			.prev().children('a').click(function() {
				var $this = $(this);
				if (!$expiredWrapper.is(':visible')) {
					$expiredWrapper.stop(true).slideDown(250);
					$this.text($this.text().replace(/^Show/, 'Hide'));
				} else {
					$expiredWrapper.stop(true).slideUp(250);
					$this.text($this.text().replace(/^Hide/, 'Show'));
				}
				return false;
			});
	}

	// bbPress formatting toolbar
	// =================================
	// Insert a clickable icon list before the textbox
	(function() {
		function InsertText(msgfield, open, close) {
			// IE support
			if (document.selection && document.selection.createRange)
			{
				msgfield.focus();
				sel = document.selection.createRange();
				sel.text = open + sel.text + close;
				msgfield.focus();
			}

			// Moz support
			else if (msgfield.selectionStart || msgfield.selectionStart == '0')
			{
				var startPos = msgfield.selectionStart;
				var endPos = msgfield.selectionEnd;

				msgfield.value = msgfield.value.substring(0, startPos) + open + msgfield.value.substring(startPos, endPos) + close + msgfield.value.substring(endPos, msgfield.value.length);
				msgfield.selectionStart = msgfield.selectionEnd = endPos + open.length + close.length;
				msgfield.focus();
			}

			// Fallback support for other browsers
			else
			{
				msgfield.value += open + close;
				msgfield.focus();
			}

			return;
		}
		var $textarea = $('textarea.bbp-the-content'),
			$formatButtons = $('<div id="format-buttons">\
				<div id="format-buttons-inner">\
					<span class="add-smilies" onclick="$(this).siblings(\'.smilies\').slideToggle(250);return false;"><img src="/wp-content/plugins/tango-smilies/tango/face-smile.png"><span class="arrow"></span></span>\
					<span data-startstr="<strong>" data-endstr="</strong>" style="font-weight:bold;">B</span>\
					<span data-startstr="<em>" data-endstr="</em>" style="font-style:italic;">I</span>\
					<span data-startstr="" data-endstr=" http://">http://</span>\
					<span data-startstr="<img src=\'" data-endstr="\' /&gt;">Img</span>\
					<span data-startstr="<pre>" data-endstr="</pre>">Code</span>\
					<span data-startstr="<blockquote>" data-endstr="</blockquote>">Quote</span>\
					<span id="protected-data-button" title="Insert sensitive data that only you and forum admins can see." data-startstr="[protected]" data-endstr="[/protected]">Protected data</span>\
					<div class="smilies">\
						<span data-startstr=":)" title=":)" data-endstr=""><span></span></span>\
						<span data-startstr=";)" title=";)" data-endstr=""><span></span></span>\
						<span data-startstr=":D" title=":D" data-endstr=""><span></span></span>\
						<span data-startstr=":lol:" title=":lol:" data-endstr=""><span></span></span>\
						<span data-startstr=":(" title=":(" data-endstr=""><span></span></span>\
						<span data-startstr=":cry:" title=":cry:" data-endstr=""><span></span></span>\
						<span data-startstr="8)" title="8)" data-endstr=""><span></span></span>\
						<span data-startstr=":o" title=":o" data-endstr=""><span></span></span>\
						<span data-startstr=":P" title=":P" data-endstr=""><span></span></span>\
						<span data-startstr=":?" title=":?" data-endstr=""><span></span></span>\
						<span data-startstr=":\\" title=":\\" data-endstr=""><span></span></span>\
						<span data-startstr=":|" title=":|" data-endstr=""><span></span></span>\
						<span data-startstr=":oops:" title=":oops:" data-endstr=""><span></span></span>\
						<span data-startstr=":x" title=":x" data-endstr=""><span></span></span>\
						<span data-startstr=":evil:" title=":evil:" data-endstr=""><span></span></span>\
						<span data-startstr=":!:" title=":!:" data-endstr=""><span></span></span>\
						<span data-startstr=":?:" title=":?:" data-endstr=""><span></span></span>\
						<span data-startstr=":idea:" title=":idea:" data-endstr=""><span></span></span>\
						<span data-startstr=":love:" title=":love:" data-endstr=""><span></span></span>\
					</div>\
				</div>\
			</div>');
		$formatButtons.find('span').click(function() {
			InsertText($textarea[0], $(this).attr('data-startstr').replace(/'/g, '"'), $(this).attr('data-endstr').replace(/'/g, '"'));
		});
		$textarea.before($formatButtons);
	})();

});


/*!
 * Smooth Scroll - v1.4.10 - 2013-02-20
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2013 Karl Swedberg
 * Licensed MIT (/blob/master/LICENSE-MIT)
 */
(function(l){function t(l){return l.replace(/(:|\.)/g,"\\$1")}var e="1.4.10",o={exclude:[],excludeWithin:[],offset:0,direction:"top",scrollElement:null,scrollTarget:null,beforeScroll:function(){},afterScroll:function(){},easing:"swing",speed:400,autoCoefficent:2},r=function(t){var e=[],o=!1,r=t.dir&&"left"==t.dir?"scrollLeft":"scrollTop";return this.each(function(){if(this!=document&&this!=window){var t=l(this);t[r]()>0?e.push(this):(t[r](1),o=t[r]()>0,o&&e.push(this),t[r](0))}}),e.length||this.each(function(){"BODY"===this.nodeName&&(e=[this])}),"first"===t.el&&e.length>1&&(e=[e[0]]),e};l.fn.extend({scrollable:function(l){var t=r.call(this,{dir:l});return this.pushStack(t)},firstScrollable:function(l){var t=r.call(this,{el:"first",dir:l});return this.pushStack(t)},smoothScroll:function(e){e=e||{};var o=l.extend({},l.fn.smoothScroll.defaults,e),r=l.smoothScroll.filterPath(location.pathname);return this.unbind("click.smoothscroll").bind("click.smoothscroll",function(e){var n=this,s=l(this),c=o.exclude,i=o.excludeWithin,a=0,f=0,h=!0,u={},d=location.hostname===n.hostname||!n.hostname,m=o.scrollTarget||(l.smoothScroll.filterPath(n.pathname)||r)===r,p=t(n.hash);if(o.scrollTarget||d&&m&&p){for(;h&&c.length>a;)s.is(t(c[a++]))&&(h=!1);for(;h&&i.length>f;)s.closest(i[f++]).length&&(h=!1)}else h=!1;h&&(e.preventDefault(),l.extend(u,o,{scrollTarget:o.scrollTarget||p,link:n}),l.smoothScroll(u))}),this}}),l.smoothScroll=function(t,e){var o,r,n,s,c=0,i="offset",a="scrollTop",f={},h={};"number"==typeof t?(o=l.fn.smoothScroll.defaults,n=t):(o=l.extend({},l.fn.smoothScroll.defaults,t||{}),o.scrollElement&&(i="position","static"==o.scrollElement.css("position")&&o.scrollElement.css("position","relative"))),o=l.extend({link:null},o),a="left"==o.direction?"scrollLeft":a,o.scrollElement?(r=o.scrollElement,c=r[a]()):r=l("html, body").firstScrollable(),o.beforeScroll.call(r,o),n="number"==typeof t?t:e||l(o.scrollTarget)[i]()&&l(o.scrollTarget)[i]()[o.direction]||0,f[a]=n+c+o.offset,s=o.speed,"auto"===s&&(s=f[a]||r.scrollTop(),s/=o.autoCoefficent),h={duration:s,easing:o.easing,complete:function(){o.afterScroll.call(o.link,o)}},o.step&&(h.step=o.step),r.length?r.stop().animate(f,h):o.afterScroll.call(o.link,o)},l.smoothScroll.version=e,l.smoothScroll.filterPath=function(l){return l.replace(/^\//,"").replace(/(index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")},l.fn.smoothScroll.defaults=o})(jQuery);


/* Copyright (C) 2007, 2008 gnombat@users.sourceforge.net */
/* License: http://shjs.sourceforge.net/doc/gplv3.html */

if(!this.sh_languages){this.sh_languages={}}var sh_requests={};function sh_isEmailAddress(a){if(/^mailto:/.test(a)){return false}return a.indexOf("@")!==-1}function sh_setHref(b,c,d){var a=d.substring(b[c-2].pos,b[c-1].pos);if(a.length>=2&&a.charAt(0)==="<"&&a.charAt(a.length-1)===">"){a=a.substr(1,a.length-2)}if(sh_isEmailAddress(a)){a="mailto:"+a}b[c-2].node.href=a}function sh_konquerorExec(b){var a=[""];a.index=b.length;a.input=b;return a}function sh_highlightString(B,o){if(/Konqueror/.test(navigator.userAgent)){if(!o.konquered){for(var F=0;F<o.length;F++){for(var H=0;H<o[F].length;H++){var G=o[F][H][0];if(G.source==="$"){G.exec=sh_konquerorExec}}}o.konquered=true}}var N=document.createElement("a");var q=document.createElement("span");var A=[];var j=0;var n=[];var C=0;var k=null;var x=function(i,a){var p=i.length;if(p===0){return}if(!a){var Q=n.length;if(Q!==0){var r=n[Q-1];if(!r[3]){a=r[1]}}}if(k!==a){if(k){A[j++]={pos:C};if(k==="sh_url"){sh_setHref(A,j,B)}}if(a){var P;if(a==="sh_url"){P=N.cloneNode(false)}else{P=q.cloneNode(false)}P.className=a;A[j++]={node:P,pos:C}}}C+=p;k=a};var t=/\r\n|\r|\n/g;t.lastIndex=0;var d=B.length;while(C<d){var v=C;var l;var w;var h=t.exec(B);if(h===null){l=d;w=d}else{l=h.index;w=t.lastIndex}var g=B.substring(v,l);var M=[];for(;;){var I=C-v;var D;var y=n.length;if(y===0){D=0}else{D=n[y-1][2]}var O=o[D];var z=O.length;var m=M[D];if(!m){m=M[D]=[]}var E=null;var u=-1;for(var K=0;K<z;K++){var f;if(K<m.length&&(m[K]===null||I<=m[K].index)){f=m[K]}else{var c=O[K][0];c.lastIndex=I;f=c.exec(g);m[K]=f}if(f!==null&&(E===null||f.index<E.index)){E=f;u=K;if(f.index===I){break}}}if(E===null){x(g.substring(I),null);break}else{if(E.index>I){x(g.substring(I,E.index),null)}var e=O[u];var J=e[1];var b;if(J instanceof Array){for(var L=0;L<J.length;L++){b=E[L+1];x(b,J[L])}}else{b=E[0];x(b,J)}switch(e[2]){case -1:break;case -2:n.pop();break;case -3:n.length=0;break;default:n.push(e);break}}}if(k){A[j++]={pos:C};if(k==="sh_url"){sh_setHref(A,j,B)}k=null}C=w}return A}function sh_getClasses(d){var a=[];var b=d.className;if(b&&b.length>0){var e=b.split(" ");for(var c=0;c<e.length;c++){if(e[c].length>0){a.push(e[c])}}}return a}function sh_addClass(c,a){var d=sh_getClasses(c);for(var b=0;b<d.length;b++){if(a.toLowerCase()===d[b].toLowerCase()){return}}d.push(a);c.className=d.join(" ")}function sh_extractTagsFromNodeList(c,a){var f=c.length;for(var d=0;d<f;d++){var e=c.item(d);switch(e.nodeType){case 1:if(e.nodeName.toLowerCase()==="br"){var b;if(/MSIE/.test(navigator.userAgent)){b="\r"}else{b="\n"}a.text.push(b);a.pos++}else{a.tags.push({node:e.cloneNode(false),pos:a.pos});sh_extractTagsFromNodeList(e.childNodes,a);a.tags.push({pos:a.pos})}break;case 3:case 4:a.text.push(e.data);a.pos+=e.length;break}}}function sh_extractTags(c,b){var a={};a.text=[];a.tags=b;a.pos=0;sh_extractTagsFromNodeList(c.childNodes,a);return a.text.join("")}function sh_mergeTags(d,f){var a=d.length;if(a===0){return f}var c=f.length;if(c===0){return d}var i=[];var e=0;var b=0;while(e<a&&b<c){var h=d[e];var g=f[b];if(h.pos<=g.pos){i.push(h);e++}else{i.push(g);if(f[b+1].pos<=h.pos){b++;i.push(f[b]);b++}else{i.push({pos:h.pos});f[b]={node:g.node.cloneNode(false),pos:h.pos}}}}while(e<a){i.push(d[e]);e++}while(b<c){i.push(f[b]);b++}return i}function sh_insertTags(k,h){var g=document;var l=document.createDocumentFragment();var e=0;var d=k.length;var b=0;var j=h.length;var c=l;while(b<j||e<d){var i;var a;if(e<d){i=k[e];a=i.pos}else{a=j}if(a<=b){if(i.node){var f=i.node;c.appendChild(f);c=f}else{c=c.parentNode}e++}else{c.appendChild(g.createTextNode(h.substring(b,a)));b=a}}return l}function sh_highlightElement(d,g){sh_addClass(d,"sh_sourceCode");var c=[];var e=sh_extractTags(d,c);var f=sh_highlightString(e,g);var b=sh_mergeTags(c,f);var a=sh_insertTags(b,e);while(d.hasChildNodes()){d.removeChild(d.firstChild)}d.appendChild(a)}function sh_getXMLHttpRequest(){if(window.ActiveXObject){return new ActiveXObject("Msxml2.XMLHTTP")}else{if(window.XMLHttpRequest){return new XMLHttpRequest()}}throw"No XMLHttpRequest implementation available"}function sh_load(language,element,prefix,suffix){if(language in sh_requests){sh_requests[language].push(element);return}sh_requests[language]=[element];var request=sh_getXMLHttpRequest();var url=prefix+"sh_"+language+suffix;request.open("GET",url,true);request.onreadystatechange=function(){if(request.readyState===4){try{if(!request.status||request.status===200){eval(request.responseText);var elements=sh_requests[language];for(var i=0;i<elements.length;i++){sh_highlightElement(elements[i],sh_languages[language])}}else{throw"HTTP error: status "+request.status}}finally{request=null}}};request.send(null)}function sh_highlightDocument(g,k){var b=document.getElementsByTagName("pre");for(var e=0;e<b.length;e++){var f=b.item(e);var a=sh_getClasses(f);for(var c=0;c<a.length;c++){var h=a[c].toLowerCase();if(h==="sh_sourcecode"){continue}if(h.substr(0,3)==="sh_"){var d=h.substring(3);if(d in sh_languages){sh_highlightElement(f,sh_languages[d])}else{if(typeof(g)==="string"&&typeof(k)==="string"){sh_load(d,f,g,k)}else{throw'Found <pre> element with class="'+h+'", but no such language exists'}}break}}}};


// JavaScript syntax module
if(!this.sh_languages){this.sh_languages={}}sh_languages.javascript=[[[/\/\/\//g,"sh_comment",1],[/\/\//g,"sh_comment",7],[/\/\*\*/g,"sh_comment",8],[/\/\*/g,"sh_comment",9],[/\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g,"sh_keyword",-1],[/(\+\+|--|\)|\])(\s*)(\/=?(?![*\/]))/g,["sh_symbol","sh_normal","sh_symbol"],-1],[/(0x[A-Fa-f0-9]+|(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?)(\s*)(\/(?![*\/]))/g,["sh_number","sh_normal","sh_symbol"],-1],[/([A-Za-z$_][A-Za-z0-9$_]*\s*)(\/=?(?![*\/]))/g,["sh_normal","sh_symbol"],-1],[/\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])*\/[gim]*/g,"sh_regexp",-1],[/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g,"sh_number",-1],[/"/g,"sh_string",10],[/'/g,"sh_string",11],[/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g,"sh_symbol",-1],[/\{|\}/g,"sh_cbracket",-1],[/\b(?:Math|Infinity|NaN|undefined|arguments)\b/g,"sh_predef_var",-1],[/\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g,"sh_predef_func",-1],[/\b(?:applicationCache|closed|Components|content|controllers|crypto|defaultStatus|dialogArguments|directories|document|frameElement|frames|fullScreen|globalStorage|history|innerHeight|innerWidth|length|location|locationbar|menubar|name|navigator|opener|outerHeight|outerWidth|pageXOffset|pageYOffset|parent|personalbar|pkcs11|returnValue|screen|availTop|availLeft|availHeight|availWidth|colorDepth|height|left|pixelDepth|top|width|screenX|screenY|scrollbars|scrollMaxX|scrollMaxY|scrollX|scrollY|self|sessionStorage|sidebar|status|statusbar|toolbar|top|window)\b/g,"sh_predef_var",-1],[/\b(?:alert|addEventListener|atob|back|blur|btoa|captureEvents|clearInterval|clearTimeout|close|confirm|dump|escape|find|focus|forward|getAttention|getComputedStyle|getSelection|home|moveBy|moveTo|open|openDialog|postMessage|print|prompt|releaseEvents|removeEventListener|resizeBy|resizeTo|scroll|scrollBy|scrollByLines|scrollByPages|scrollTo|setInterval|setTimeout|showModalDialog|sizeToContent|stop|unescape|updateCommands|onabort|onbeforeunload|onblur|onchange|onclick|onclose|oncontextmenu|ondragdrop|onerror|onfocus|onkeydown|onkeypress|onkeyup|onload|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onpaint|onreset|onresize|onscroll|onselect|onsubmit|onunload)\b/g,"sh_predef_func",-1],[/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g,"sh_function",-1]],[[/$/g,null,-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\?>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/-->/g,"sh_comment",-2],[/<!--/g,"sh_comment",5]],[[/(?:\/)?>/g,"sh_keyword",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/$/g,null,-2]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/"/g,"sh_string",-2],[/\\./g,"sh_specialchar",-1]],[[/'/g,"sh_string",-2],[/\\./g,"sh_specialchar",-1]]];


// CSS syntax module
if(!this.sh_languages){this.sh_languages={}}sh_languages.css=[[[/\/\/\//g,"sh_comment",1],[/\/\//g,"sh_comment",7],[/\/\*\*/g,"sh_comment",8],[/\/\*/g,"sh_comment",9],[/(?:\.|#)[A-Za-z0-9_]+/g,"sh_selector",-1],[/\{/g,"sh_cbracket",10,1],[/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g,"sh_symbol",-1]],[[/$/g,null,-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\?>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/-->/g,"sh_comment",-2],[/<!--/g,"sh_comment",5]],[[/(?:\/)?>/g,"sh_keyword",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",3]],[[/$/g,null,-2]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",2,1],[/<!DOCTYPE/g,"sh_preproc",4,1],[/<!--/g,"sh_comment",5],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",6,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",6,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\}/g,"sh_cbracket",-2],[/\/\/\//g,"sh_comment",1],[/\/\//g,"sh_comment",7],[/\/\*\*/g,"sh_comment",8],[/\/\*/g,"sh_comment",9],[/[A-Za-z0-9_-]+[ \t]*:/g,"sh_property",-1],[/[.%A-Za-z0-9_-]+/g,"sh_value",-1],[/#(?:[A-Za-z0-9_]+)/g,"sh_string",-1]]];


// PHP syntax module
if(!this.sh_languages){this.sh_languages={}}sh_languages.php=[[[/\b(?:include|include_once|require|require_once)\b/g,"sh_preproc",-1],[/\/\//g,"sh_comment",1],[/#/g,"sh_comment",1],[/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g,"sh_number",-1],[/"/g,"sh_string",2],[/'/g,"sh_string",3],[/\b(?:and|or|xor|__FILE__|exception|php_user_filter|__LINE__|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|each|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|for|foreach|function|global|if|isset|list|new|old_function|print|return|static|switch|unset|use|var|while|__FUNCTION__|__CLASS__|__METHOD__)\b/g,"sh_keyword",-1],[/\/\/\//g,"sh_comment",4],[/\/\//g,"sh_comment",1],[/\/\*\*/g,"sh_comment",9],[/\/\*/g,"sh_comment",10],[/(?:\$[#]?|@|%)[A-Za-z0-9_]+/g,"sh_variable",-1],[/<\?php|~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g,"sh_symbol",-1],[/\{|\}/g,"sh_cbracket",-1],[/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g,"sh_function",-1]],[[/$/g,null,-2]],[[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/\\(?:\\|')/g,null,-1],[/'/g,"sh_string",-2]],[[/$/g,null,-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",5,1],[/<!DOCTYPE/g,"sh_preproc",6,1],[/<!--/g,"sh_comment",7],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",8,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",8,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\?>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]],[[/>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]],[[/-->/g,"sh_comment",-2],[/<!--/g,"sh_comment",7]],[[/(?:\/)?>/g,"sh_keyword",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/<\?xml/g,"sh_preproc",5,1],[/<!DOCTYPE/g,"sh_preproc",6,1],[/<!--/g,"sh_comment",7],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",8,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",8,1],[/@[A-Za-z]+/g,"sh_type",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]],[[/\*\//g,"sh_comment",-2],[/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g,"sh_url",-1],[/(?:TODO|FIXME|BUG)(?:[:]?)/g,"sh_todo",-1]]];


// HTML syntax module
if(!this.sh_languages){this.sh_languages={}}sh_languages.html=[[[/<\?xml/g,"sh_preproc",1,1],[/<!DOCTYPE/g,"sh_preproc",3,1],[/<!--/g,"sh_comment",4],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g,"sh_keyword",5,1],[/&(?:[A-Za-z0-9]+);/g,"sh_preproc",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g,"sh_keyword",-1],[/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g,"sh_keyword",5,1]],[[/\?>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]],[[/\\(?:\\|")/g,null,-1],[/"/g,"sh_string",-2]],[[/>/g,"sh_preproc",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]],[[/-->/g,"sh_comment",-2],[/<!--/g,"sh_comment",4]],[[/(?:\/)?>/g,"sh_keyword",-2],[/([^=" \t>]+)([ \t]*)(=?)/g,["sh_type","sh_normal","sh_symbol"],-1],[/"/g,"sh_string",2]]];


/*! SmartMenus jQuery Plugin - v0.9.4 - December 1, 2013
 * http://www.smartmenus.org/
 * Copyright 2013 Vasil Dinkov, Vadikom Web Ltd. http://vadikom.com; Licensed MIT */(function(t){function s(s){if(h||s)h&&s&&(t(document).unbind(".smartmenus_mouse"),h=!1);else{var e=!0,o=null;t(document).bind({"mousemove.smartmenus_mouse":function(s){var a={x:s.pageX,y:s.pageY,timeStamp:(new Date).getTime()};if(o){var r=Math.abs(o.x-a.x),h=Math.abs(o.y-a.y);if((r>0||h>0)&&2>=r&&2>=h&&300>=a.timeStamp-o.timeStamp&&(n=!0,e)){var u=t(s.target);u.is("a")||(u=u.parentsUntil("a").parent()),u.is("a")&&t.each(i,function(){return t.contains(this.$root[0],u[0])?(this.itemEnter({currentTarget:u[0]}),!1):void 0}),e=!1}}o=a},"touchstart.smartmenus_mouse pointerover.smartmenus_mouse MSPointerOver.smartmenus_mouse":function(t){/^(4|mouse)$/.test(t.originalEvent.pointerType)||(n=!1)}}),h=!0}}var i=[],e=!!window.createPopup,o=e&&!document.defaultView,a=e&&!document.querySelector,r=e&&document.documentElement.currentStyle.minWidth===void 0,n=!1,h=!1;t.SmartMenus=function(s,i){this.$root=t(s),this.opts=i,this.rootId="",this.$subArrow=null,this.subMenus=[],this.activatedItems=[],this.visibleSubMenus=[],this.showTimeout=0,this.hideTimeout=0,this.scrollTimeout=0,this.clickActivated=!1,this.zIndexInc=0,this.$firstLink=null,this.$firstSub=null,this.disabled=!1,this.$disableOverlay=null,this.init()},t.extend(t.SmartMenus,{hideAll:function(){t.each(i,function(){this.menuHideAll()})},destroy:function(){for(;i.length;)i[0].destroy();s(!0)},prototype:{init:function(e){var o=this;if(!e){i.push(this),this.rootId=((new Date).getTime()+Math.random()+"").replace(/\D/g,""),this.$root.hasClass("sm-rtl")&&(this.opts.rightToLeftSubMenus=!0),this.$root.data("smartmenus",this).attr("data-smartmenus-id",this.rootId).dataSM("level",1).bind({"mouseover.smartmenus focusin.smartmenus":t.proxy(this.rootOver,this),"mouseout.smartmenus focusout.smartmenus":t.proxy(this.rootOut,this)}).delegate("a",{"mouseenter.smartmenus":t.proxy(this.itemEnter,this),"mouseleave.smartmenus":t.proxy(this.itemLeave,this),"mousedown.smartmenus":t.proxy(this.itemDown,this),"focus.smartmenus":t.proxy(this.itemFocus,this),"blur.smartmenus":t.proxy(this.itemBlur,this),"click.smartmenus":t.proxy(this.itemClick,this),"touchend.smartmenus":t.proxy(this.itemTouchEnd,this)});var a=".smartmenus"+this.rootId;this.opts.hideOnClick&&t(document).bind("touchstart"+a,t.proxy(this.docTouchStart,this)).bind("touchmove"+a,t.proxy(this.docTouchMove,this)).bind("touchend"+a,t.proxy(this.docTouchEnd,this)).bind("click"+a,t.proxy(this.docClick,this)),t(window).bind("resize"+a+" orientationchange"+a,t.proxy(this.winResize,this)),this.opts.subIndicators&&(this.$subArrow=t("<span/>").addClass("sub-arrow"),this.opts.subIndicatorsText&&this.$subArrow.html(this.opts.subIndicatorsText)),s()}if(this.$firstSub=this.$root.find("ul").each(function(){o.menuInit(t(this))}).eq(0),this.$firstLink=this.$root.find("a").eq(0),this.opts.markCurrentItem){var r=/(index|default)\.[^#\?\/]*/i,n=/#.*/,h=window.location.href.replace(r,""),u=h.replace(n,"");this.$root.find("a").each(function(){var s=this.href.replace(r,""),i=t(this);(s==h||s==u)&&(i.addClass("current"),o.opts.markCurrentTree&&i.parents("li").each(function(){var s=t(this);s.dataSM("sub")&&s.children("a").addClass("current")}))})}},destroy:function(){this.menuHideAll(),this.$root.removeData("smartmenus").removeAttr("data-smartmenus-id").removeDataSM("level").unbind(".smartmenus").undelegate(".smartmenus");var s=".smartmenus"+this.rootId;t(document).unbind(s),t(window).unbind(s),this.opts.subIndicators&&(this.$subArrow=null);var e=this;t.each(this.subMenus,function(){this.hasClass("mega-menu")&&this.find("ul").removeDataSM("in-mega"),this.dataSM("shown-before")&&(a&&this.children().css({styleFloat:"",width:""}),(e.opts.subMenusMinWidth||e.opts.subMenusMaxWidth)&&(r?this.css({width:"",overflowX:"",overflowY:""}).children().children("a").css("white-space",""):this.css({width:"",minWidth:"",maxWidth:""}).removeClass("sm-nowrap")),this.dataSM("scroll-arrows")&&this.dataSM("scroll-arrows").remove(),this.css({zIndex:"",top:"",left:"",marginLeft:"",marginTop:"",display:""})),e.opts.subIndicators&&this.dataSM("parent-a").removeClass("has-submenu").children("span.sub-arrow").remove(),this.removeDataSM("shown-before").removeDataSM("ie-shim").removeDataSM("scroll-arrows").removeDataSM("parent-a").removeDataSM("level").removeDataSM("beforefirstshowfired").parent().removeDataSM("sub")}),this.opts.markCurrentItem&&this.$root.find("a.current").removeClass("current"),this.$root=null,this.$firstLink=null,this.$firstSub=null,this.$disableOverlay&&(this.$disableOverlay.remove(),this.$disableOverlay=null),i.splice(t.inArray(this,i),1)},disable:function(s){if(!this.disabled){if(this.menuHideAll(),!s&&!this.opts.isPopup&&this.$root.is(":visible")){var i=this.$root.offset();this.$disableOverlay=t('<div class="sm-jquery-disable-overlay"/>').css({position:"absolute",top:i.top,left:i.left,width:this.$root.outerWidth(),height:this.$root.outerHeight(),zIndex:this.getStartZIndex()+1,opacity:0}).appendTo(document.body)}this.disabled=!0}},docClick:function(s){(this.visibleSubMenus.length&&!t.contains(this.$root[0],s.target)||t(s.target).is("a"))&&this.menuHideAll()},docTouchEnd:function(){if(this.lastTouch){if(!(!this.visibleSubMenus.length||void 0!==this.lastTouch.x2&&this.lastTouch.x1!=this.lastTouch.x2||void 0!==this.lastTouch.y2&&this.lastTouch.y1!=this.lastTouch.y2||this.lastTouch.target&&t.contains(this.$root[0],this.lastTouch.target))){this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0);var s=this;this.hideTimeout=setTimeout(function(){s.menuHideAll()},350)}this.lastTouch=null}},docTouchMove:function(t){if(this.lastTouch){var s=t.originalEvent.touches[0];this.lastTouch.x2=s.pageX,this.lastTouch.y2=s.pageY}},docTouchStart:function(t){var s=t.originalEvent.touches[0];this.lastTouch={x1:s.pageX,y1:s.pageY,target:s.target}},enable:function(){this.disabled&&(this.$disableOverlay&&(this.$disableOverlay.remove(),this.$disableOverlay=null),this.disabled=!1)},getHeight:function(t){return this.getOffset(t,!0)},getOffset:function(t,s){var i;"none"==t.css("display")&&(i={position:t[0].style.position,visibility:t[0].style.visibility},t.css({position:"absolute",visibility:"hidden"}).show());var e=t[0].ownerDocument.defaultView,o=e&&e.getComputedStyle&&e.getComputedStyle(t[0],null),a=o&&parseFloat(o[s?"height":"width"]);return a?a+=parseFloat(o[s?"paddingTop":"paddingLeft"])+parseFloat(o[s?"paddingBottom":"paddingRight"])+parseInt(o[s?"borderTopWidth":"borderLeftWidth"])+parseInt(o[s?"borderBottomWidth":"borderRightWidth"]):a=s?t[0].offsetHeight:t[0].offsetWidth,i&&t.hide().css(i),a},getWidth:function(t){return this.getOffset(t)},getStartZIndex:function(){var t=parseInt(this.$root.css("z-index"));return isNaN(t)?1:t},handleEvents:function(){return!this.disabled&&this.isCSSOn()},handleItemEvents:function(t){return this.handleEvents()&&!this.isLinkInMegaMenu(t)},isCollapsible:function(){return"static"==this.$firstSub.css("position")},isCSSOn:function(){return"block"==this.$firstLink.css("display")},isFixed:function(){return"fixed"==this.$root.css("position")},isLinkInMegaMenu:function(t){return!t.parent().parent().dataSM("level")},isTouchMode:function(){return!n||this.isCollapsible()},itemActivate:function(s){var i=s.parent(),e=i.parent(),o=e.dataSM("level");if(o>1&&(!this.activatedItems[o-2]||this.activatedItems[o-2][0]!=e.dataSM("parent-a")[0])){var a=this;t(e.parentsUntil("[data-smartmenus-id]","ul").get().reverse()).add(e).each(function(){a.itemActivate(t(this).dataSM("parent-a"))})}if(this.visibleSubMenus.length>o)for(var r=this.visibleSubMenus.length-1,n=this.activatedItems[o-1]&&this.activatedItems[o-1][0]==s[0]?o:o-1;r>n;r--)this.menuHide(this.visibleSubMenus[r]);if(this.activatedItems[o-1]=s,this.visibleSubMenus[o-1]=e,this.$root.triggerHandler("activate.smapi",s[0])!==!1){var h=i.dataSM("sub");h&&(this.isTouchMode()||!this.opts.showOnClick||this.clickActivated)&&this.menuShow(h)}},itemBlur:function(s){var i=t(s.currentTarget);this.handleItemEvents(i)&&this.$root.triggerHandler("blur.smapi",i[0])},itemClick:function(s){var i=t(s.currentTarget);if(this.handleItemEvents(i)){if(i.removeDataSM("mousedown"),this.$root.triggerHandler("click.smapi",i[0])===!1)return!1;var e=i.parent().dataSM("sub");if(this.isTouchMode()){if(i.dataSM("href")&&i.attr("href",i.dataSM("href")).removeDataSM("href"),e&&(!e.dataSM("shown-before")||!e.is(":visible"))&&(this.itemActivate(i),e.is(":visible")))return!1}else if(this.opts.showOnClick&&1==i.parent().parent().dataSM("level")&&e)return this.clickActivated=!0,this.menuShow(e),!1;return i.hasClass("disabled")?!1:this.$root.triggerHandler("select.smapi",i[0])===!1?!1:void 0}},itemDown:function(s){var i=t(s.currentTarget);this.handleItemEvents(i)&&i.dataSM("mousedown",!0)},itemEnter:function(s){var i=t(s.currentTarget);if(this.handleItemEvents(i)){if(!this.isTouchMode()){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=0);var e=this;this.showTimeout=setTimeout(function(){e.itemActivate(i)},this.opts.showOnClick&&1==i.parent().parent().dataSM("level")?1:this.opts.showTimeout)}this.$root.triggerHandler("mouseenter.smapi",i[0])}},itemFocus:function(s){var i=t(s.currentTarget);this.handleItemEvents(i)&&(this.isTouchMode()&&i.dataSM("mousedown")||this.activatedItems.length&&this.activatedItems[this.activatedItems.length-1][0]==i[0]||this.itemActivate(i),this.$root.triggerHandler("focus.smapi",i[0]))},itemLeave:function(s){var i=t(s.currentTarget);this.handleItemEvents(i)&&(this.isTouchMode()||(i[0].blur&&i[0].blur(),this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=0)),i.removeDataSM("mousedown"),this.$root.triggerHandler("mouseleave.smapi",i[0]))},itemTouchEnd:function(s){var i=t(s.currentTarget);if(this.handleItemEvents(i)){var e=i.parent().dataSM("sub");"#"===i.attr("href").charAt(0)||!e||e.dataSM("shown-before")&&e.is(":visible")||(i.dataSM("href",i.attr("href")),i.attr("href","#"))}},menuFixLayout:function(t){t.dataSM("shown-before")||(t.hide().dataSM("shown-before",!0),a&&t.children().css({styleFloat:"left",width:"100%"}))},menuHide:function(t){if(this.$root.triggerHandler("beforehide.smapi",t[0])!==!1&&(t.stop(!0,!0),t.is(":visible"))){var s=function(){o?t.parent().css("z-index",""):t.css("z-index","")};this.isCollapsible()?this.opts.collapsibleHideFunction?this.opts.collapsibleHideFunction.call(this,t,s):t.hide(this.opts.collapsibleHideDuration,s):this.opts.hideFunction?this.opts.hideFunction.call(this,t,s):t.hide(this.opts.hideDuration,s),t.dataSM("ie-shim")&&t.dataSM("ie-shim").remove(),t.dataSM("scroll")&&t.unbind(".smartmenus_scroll").removeDataSM("scroll").dataSM("scroll-arrows").hide(),t.dataSM("parent-a").removeClass("highlighted");var i=t.dataSM("level");this.activatedItems.splice(i-1,1),this.visibleSubMenus.splice(i-1,1),this.$root.triggerHandler("hide.smapi",t[0])}},menuHideAll:function(){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=0);for(var t=this.visibleSubMenus.length-1;t>0;t--)this.menuHide(this.visibleSubMenus[t]);this.opts.isPopup&&(this.$root.stop(!0,!0),this.$root.is(":visible")&&(this.opts.hideFunction?this.opts.hideFunction.call(this,this.$root):this.$root.hide(this.opts.hideDuration),this.$root.dataSM("ie-shim")&&this.$root.dataSM("ie-shim").remove())),this.activatedItems=[],this.visibleSubMenus=[],this.clickActivated=!1,this.zIndexInc=0},menuIframeShim:function(s){e&&this.opts.overlapControlsInIE&&!s.dataSM("ie-shim")&&s.dataSM("ie-shim",t("<iframe/>").attr({src:"javascript:0",tabindex:-9}).css({position:"absolute",top:"auto",left:"0",opacity:0,border:"0"}))},menuInit:function(t){if(!t.dataSM("in-mega")){this.subMenus.push(t),t.hasClass("mega-menu")&&t.find("ul").dataSM("in-mega",!0);for(var s=2,i=t[0];(i=i.parentNode.parentNode)!=this.$root[0];)s++;t.dataSM("parent-a",t.prevAll("a")).dataSM("level",s).parent().dataSM("sub",t),this.opts.subIndicators&&t.dataSM("parent-a").addClass("has-submenu")[this.opts.subIndicatorsPos](this.$subArrow.clone())}},menuPosition:function(s){var i,e,o=s.dataSM("parent-a"),a=s.parent().parent(),r=s.dataSM("level"),h=this.getWidth(s),u=this.getHeight(s),l=o.offset(),d=l.left,c=l.top,m=this.getWidth(o),p=this.getHeight(o),f=t(window),v=f.scrollLeft(),b=f.scrollTop(),M=f.width(),S=f.height(),w=a.hasClass("sm")&&!a.hasClass("sm-vertical"),g=2==r?this.opts.mainMenuSubOffsetX:this.opts.subMenusSubOffsetX,T=2==r?this.opts.mainMenuSubOffsetY:this.opts.subMenusSubOffsetY;if(w?(i=this.opts.rightToLeftSubMenus?m-h-g:g,e=this.opts.bottomToTopSubMenus?-u-g:p+T):(i=this.opts.rightToLeftSubMenus?g-h:m-g,e=this.opts.bottomToTopSubMenus?p-T-u:T),this.opts.keepInViewport&&!this.isCollapsible()){this.isFixed()&&(d-=v,c-=b,v=b=0);var $=d+i,I=c+e;if(this.opts.rightToLeftSubMenus&&v>$?i=w?v-$+i:m-g:!this.opts.rightToLeftSubMenus&&$+h>v+M&&(i=w?v+M-h-$+i:g-h),w||(S>u&&I+u>b+S?e+=b+S-u-I:(u>=S||b>I)&&(e+=b-I)),n&&(w&&(I+u>b+S+.49||b>I)||!w&&u>S+.49)){var y=this;s.dataSM("scroll-arrows")||s.dataSM("scroll-arrows",t([t('<span class="scroll-up"><span class="scroll-up-arrow"></span></span>')[0],t('<span class="scroll-down"><span class="scroll-down-arrow"></span></span>')[0]]).bind({mouseenter:function(){y.menuScroll(s,t(this).hasClass("scroll-up"))},mouseleave:function(t){y.menuScrollStop(s),y.menuScrollOut(s,t)},"mousewheel DOMMouseScroll":function(t){t.preventDefault()}}).insertAfter(s));var x=b-(c+p);s.dataSM("scroll",{vportY:x,subH:u,winH:S,step:1}).bind({"mouseover.smartmenus_scroll":function(t){y.menuScrollOver(s,t)},"mouseout.smartmenus_scroll":function(t){y.menuScrollOut(s,t)},"mousewheel.smartmenus_scroll DOMMouseScroll.smartmenus_scroll":function(t){y.menuScrollMousewheel(s,t)}}).dataSM("scroll-arrows").css({top:"auto",left:"0",marginLeft:i+(parseInt(s.css("border-left-width"))||0),width:this.getWidth(s)-(parseInt(s.css("border-left-width"))||0)-(parseInt(s.css("border-right-width"))||0),zIndex:this.getStartZIndex()+this.zIndexInc}).eq(0).css("margin-top",x).end().eq(1).css("margin-top",x+S-this.getHeight(s.dataSM("scroll-arrows").eq(1))).end().eq(w&&this.opts.bottomToTopSubMenus?0:1).show()}}s.css({top:"auto",left:"0",marginLeft:i,marginTop:e-p}),this.menuIframeShim(s),s.dataSM("ie-shim")&&s.dataSM("ie-shim").css({zIndex:s.css("z-index"),width:h,height:u,marginLeft:i,marginTop:e-p})},menuScroll:function(t,s,i){var e=parseFloat(t.css("margin-top")),o=t.dataSM("scroll"),a=o.vportY+(s?0:o.winH-o.subH),r=i||!this.opts.scrollAccelerate?this.opts.scrollStep:Math.floor(t.dataSM("scroll").step);if(t.add(t.dataSM("ie-shim")).css("margin-top",Math.abs(a-e)>r?e+(s?r:-r):a),e=parseFloat(t.css("margin-top")),(s&&e+o.subH>o.vportY+o.winH||!s&&o.vportY>e)&&t.dataSM("scroll-arrows").eq(s?1:0).show(),!i&&this.opts.scrollAccelerate&&t.dataSM("scroll").step<this.opts.scrollStep&&(t.dataSM("scroll").step+=.5),1>Math.abs(e-a))t.dataSM("scroll-arrows").eq(s?0:1).hide(),t.dataSM("scroll").step=1;else if(!i){var n=this;this.scrollTimeout=setTimeout(function(){n.menuScroll(t,s)},this.opts.scrollInterval)}},menuScrollMousewheel:function(s,i){for(var e=t(i.target).closest("ul");e.dataSM("in-mega");)e=e.parent().closest("ul");if(e[0]==s[0]){var o=(i.originalEvent.wheelDelta||-i.originalEvent.detail)>0;s.dataSM("scroll-arrows").eq(o?0:1).is(":visible")&&this.menuScroll(s,o,!0)}i.preventDefault()},menuScrollOut:function(s,i){for(var e=/^scroll-(up|down)/,o=t(i.relatedTarget).closest("ul");o.dataSM("in-mega");)o=o.parent().closest("ul");e.test((i.relatedTarget||"").className)||(s[0]==i.relatedTarget||t.contains(s[0],i.relatedTarget))&&o[0]==s[0]||s.dataSM("scroll-arrows").css("visibility","hidden")},menuScrollOver:function(s,i){for(var e=/^scroll-(up|down)/,o=t(i.target).closest("ul");o.dataSM("in-mega");)o=o.parent().closest("ul");e.test(i.target.className)||o[0]!=s[0]||s.dataSM("scroll-arrows").css("visibility","visible")},menuScrollStop:function(t){this.scrollTimeout&&(clearTimeout(this.scrollTimeout),this.scrollTimeout=0,t.dataSM("scroll").step=1)},menuShow:function(t){if((t.dataSM("beforefirstshowfired")||(t.dataSM("beforefirstshowfired",!0),this.$root.triggerHandler("beforefirstshow.smapi",t[0])!==!1))&&this.$root.triggerHandler("beforeshow.smapi",t[0])!==!1&&(this.menuFixLayout(t),t.stop(!0,!0),!t.is(":visible"))){var s=this.getStartZIndex()+ ++this.zIndexInc;if(o?t.parent().css("z-index",s):t.css("z-index",s),(this.opts.keepHighlighted||this.isCollapsible())&&t.dataSM("parent-a").addClass("highlighted"),this.opts.subMenusMinWidth||this.opts.subMenusMaxWidth)if(a){if(t.children().css("styleFloat","none"),r?t.width(this.opts.subMenusMinWidth?this.opts.subMenusMinWidth:1).children().children("a").css("white-space","nowrap"):(t.css({width:"auto",minWidth:"",maxWidth:""}).addClass("sm-nowrap"),this.opts.subMenusMinWidth&&t.css("min-width",this.opts.subMenusMinWidth)),this.opts.subMenusMaxWidth){var i=t.width();if(r){var e=t.css({width:this.opts.subMenusMaxWidth,overflowX:"hidden",overflowY:"hidden"}).width();i>e?t.css({width:e,overflowX:"visible",overflowY:"visible"}).children().children("a").css("white-space",""):t.css({width:i,overflowX:"visible",overflowY:"visible"})}else t.css("max-width",this.opts.subMenusMaxWidth),i>t.width()?t.removeClass("sm-nowrap").css("width",this.opts.subMenusMaxWidth):t.width(i)}else t.width(t.width());t.children().css("styleFloat","left")}else if(t.css({width:"auto",minWidth:"",maxWidth:""}).addClass("sm-nowrap"),this.opts.subMenusMinWidth&&t.css("min-width",this.opts.subMenusMinWidth),this.opts.subMenusMaxWidth){var i=this.getWidth(t);t.css("max-width",this.opts.subMenusMaxWidth),i>this.getWidth(t)&&t.removeClass("sm-nowrap").css("width",this.opts.subMenusMaxWidth)}this.menuPosition(t),t.dataSM("ie-shim")&&t.dataSM("ie-shim").insertBefore(t);var n=function(){t.css("overflow","")};this.isCollapsible()?this.opts.collapsibleShowFunction?this.opts.collapsibleShowFunction.call(this,t,n):t.show(this.opts.collapsibleShowDuration,n):this.opts.showFunction?this.opts.showFunction.call(this,t,n):t.show(this.opts.showDuration,n),this.visibleSubMenus[t.dataSM("level")-1]=t,this.$root.triggerHandler("show.smapi",t[0])}},popupHide:function(t){this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0);var s=this;this.hideTimeout=setTimeout(function(){s.menuHideAll()},t?1:this.opts.hideTimeout)},popupShow:function(t,s){return this.opts.isPopup?(this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0),this.menuFixLayout(this.$root),this.$root.stop(!0,!0),this.$root.is(":visible")||(this.$root.css({left:t,top:s}),this.menuIframeShim(this.$root),this.$root.dataSM("ie-shim")&&this.$root.dataSM("ie-shim").css({zIndex:this.$root.css("z-index"),width:this.getWidth(this.$root),height:this.getHeight(this.$root),left:t,top:s}).insertBefore(this.$root),this.opts.showFunction?this.opts.showFunction.call(this,this.$root):this.$root.show(this.opts.showDuration),this.visibleSubMenus[0]=this.$root),void 0):(alert('SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.'),void 0)},refresh:function(){this.menuHideAll(),this.$root.find("ul").each(function(){var s=t(this);s.dataSM("scroll-arrows")&&s.dataSM("scroll-arrows").remove()}).removeDataSM("in-mega").removeDataSM("shown-before").removeDataSM("ie-shim").removeDataSM("scroll-arrows").removeDataSM("parent-a").removeDataSM("level").removeDataSM("beforefirstshowfired"),this.$root.find("a.has-submenu").removeClass("has-submenu").parent().removeDataSM("sub"),this.opts.subIndicators&&this.$root.find("span.sub-arrow").remove(),this.opts.markCurrentItem&&this.$root.find("a.current").removeClass("current"),this.subMenus=[],this.init(!0)},rootOut:function(t){if(this.handleEvents()&&!this.isTouchMode()&&t.target!=this.$root[0]&&(this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0),!this.opts.showOnClick||!this.opts.hideOnClick)){var s=this;this.hideTimeout=setTimeout(function(){s.menuHideAll()},this.opts.hideTimeout)}},rootOver:function(t){this.handleEvents()&&!this.isTouchMode()&&t.target!=this.$root[0]&&this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0)},winResize:function(t){if(this.handleEvents())this.isCollapsible()||"onorientationchange"in window&&"orientationchange"!=t.type||(this.activatedItems.length&&this.activatedItems[this.activatedItems.length-1][0].blur(),this.menuHideAll());else if(this.$disableOverlay){var s=this.$root.offset();this.$disableOverlay.css({top:s.top,left:s.left,width:this.$root.outerWidth(),height:this.$root.outerHeight()})}}}}),t.fn.dataSM=function(t,s){return s?this.data(t+"_smartmenus",s):this.data(t+"_smartmenus")},t.fn.removeDataSM=function(t){return this.removeData(t+"_smartmenus")},t.fn.smartmenus=function(s){if("string"==typeof s){var i=arguments,e=s;return Array.prototype.shift.call(i),this.each(function(){var s=t(this).data("smartmenus");s&&s[e]&&s[e].apply(s,i)})}var o=t.extend({},t.fn.smartmenus.defaults,s);return this.each(function(){new t.SmartMenus(this,o)})},t.fn.smartmenus.defaults={isPopup:!1,mainMenuSubOffsetX:0,mainMenuSubOffsetY:0,subMenusSubOffsetX:0,subMenusSubOffsetY:0,subMenusMinWidth:"10em",subMenusMaxWidth:"20em",subIndicators:!0,subIndicatorsPos:"prepend",subIndicatorsText:"+",scrollStep:30,scrollInterval:30,scrollAccelerate:!0,showTimeout:250,hideTimeout:500,showDuration:0,showFunction:null,hideDuration:0,hideFunction:function(t,s){t.fadeOut(200,s)},collapsibleShowDuration:0,collapsibleShowFunction:function(t,s){t.slideDown(200,s)},collapsibleHideDuration:0,collapsibleHideFunction:function(t,s){t.slideUp(200,s)},showOnClick:!1,hideOnClick:!0,keepInViewport:!0,keepHighlighted:!0,markCurrentItem:!1,markCurrentTree:!0,rightToLeftSubMenus:!1,bottomToTopSubMenus:!1,overlapControlsInIE:!0}})(jQuery);


/*! SmartMenus jQuery Plugin Keyboard Addon - v0.1.0 - December 1, 2013
 * http://www.smartmenus.org/
 * Copyright 2013 Vasil Dinkov, Vadikom Web Ltd. http://vadikom.com; Licensed MIT */(function(t){function s(t){return t.find("> li > a:not(.disabled)").eq(0)}function e(t){return t.find("> li > a:not(.disabled)").eq(-1)}function i(t,e){var i=t.nextAll("li").children("a:not(.disabled)").eq(0);return e||i.length?i:s(t.parent())}function o(t,s){var i=t.prevAll("li").children("a:not(.disabled)").eq(0);return s||i.length?i:e(t.parent())}t.fn.focusSM=function(){return this.length&&this[0].focus&&this[0].focus(),this},t.extend(t.SmartMenus.Keyboard={},{docKeydown:function(a){var n=a.keyCode;if(/(27|37|38|39|40)/.test(n)){var r=t(this),h=r.data("smartmenus"),u=t(a.target);if(h&&u.is("a")){var l=u.parent(),d=l.parent(),c=d.dataSM("level");if(c){switch(h.opts.rightToLeftSubMenus&&(37==n?n=39:39==n&&(n=37)),n){case 27:if(h.visibleSubMenus[c])h.menuHide(h.visibleSubMenus[c]);else if(1==c)if(h.opts.isPopup&&h.menuHideAll(),h.opts.keyboardEscapeFocus)try{h.opts.keyboardEscapeFocus.focusSM()}catch(a){}else{var m=r.find("a, input, select, button, textarea").eq(-1),p=t("a, input, select, button, textarea"),f=p.index(m[0])+1;p.eq(f).focusSM()}else d.dataSM("parent-a").focusSM(),h.menuHide(h.visibleSubMenus[c-1]);break;case 37:if(h.isCollapsible())break;c>2||2==c&&r.hasClass("sm-vertical")?h.activatedItems[c-2].focusSM():r.hasClass("sm-vertical")||o(h.activatedItems[0].parent()).focusSM();break;case 38:if(h.isCollapsible()){var v;c>1&&(v=s(d)).length&&u[0]==v[0]?h.activatedItems[c-2].focusSM():o(l).focusSM()}else 1==c&&!r.hasClass("sm-vertical")&&h.visibleSubMenus[c]&&h.opts.bottomToTopSubMenus?e(h.visibleSubMenus[c]).focusSM():(c>1||r.hasClass("sm-vertical"))&&o(l).focusSM();break;case 39:if(h.isCollapsible())break;1!=c&&h.visibleSubMenus[c]||r.hasClass("sm-vertical")?h.visibleSubMenus[c]&&!h.visibleSubMenus[c].hasClass("mega-menu")&&s(h.visibleSubMenus[c]).focusSM():i(h.activatedItems[0].parent()).focusSM();break;case 40:if(h.isCollapsible()){var b,M;if(h.visibleSubMenus[c]&&!h.visibleSubMenus[c].hasClass("mega-menu")&&(b=s(h.visibleSubMenus[c])).length)b.focusSM();else if(c>1&&(M=e(d)).length&&u[0]==M[0]){for(var S=h.activatedItems[c-2].parent(),w=null;S.is("li")&&!(w=i(S,!0)).length;)S=S.parent().parent();w.focusSM()}else i(l).focusSM()}else 1!=c||r.hasClass("sm-vertical")||!h.visibleSubMenus[c]||h.opts.bottomToTopSubMenus?(c>1||r.hasClass("sm-vertical"))&&i(l).focusSM():s(h.visibleSubMenus[c]).focusSM()}a.stopPropagation(),a.preventDefault()}}}}}),t(document).delegate("ul.sm","keydown.smartmenus",t.SmartMenus.Keyboard.docKeydown),t.extend(t.SmartMenus.prototype,{keyboardSetEscapeFocus:function(t){this.opts.keyboardEscapeFocus=t},keyboardSetHotkey:function(e,i){var o=this;t(document).bind("keydown.smartmenus"+this.rootId,function(a){if(e==a.keyCode){var n=!0;i&&("string"==typeof i&&(i=[i]),t.each(["ctrlKey","shiftKey","altKey","metaKey"],function(s,e){return t.inArray(e,i)>=0&&!a[e]||0>t.inArray(e,i)&&a[e]?(n=!1,!1):void 0})),n&&(s(o.$root).focusSM(),a.stopPropagation(),a.preventDefault())}})}})})(jQuery);