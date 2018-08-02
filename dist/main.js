!(function(n){var r={};function e(t){if(r[t])return r[t].exports;var o=r[t]={i:t,l:!1,exports:{}};return n[t].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=n,e.c=r,e.d=function(n,r,t){e.o(n,r)||Object.defineProperty(n,r,{enumerable:!0,get:t})},e.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},e.t=function(n,r){if(1&r&&(n=e(n)),8&r)return n;if(4&r&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(e.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&r&&"string"!=typeof n)for(var o in n)e.d(t,o,function(r){return n[r]}.bind(null,o));return t},e.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(r,"a",r),r},e.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},e.p="",e(e.s=9)})([(function(n,r,e){"use strict";e.d(r,"a",(function(){return t}));class t{static get DATABASE_URL(){return"http://localhost:1337/"}static fetchRestaurants(n){const r=`${t.DATABASE_URL}restaurants`;fetch(r).then(n=>n.json()).then(r=>{n(null,r)}).catch(r=>{n(r,null)})}static fetchReviewsById(n,r){const e=`${t.DATABASE_URL}reviews/?restaurant_id=${n}`;fetch(e).then(n=>n.json()).then(n=>{r(null,n)}).catch(n=>{r(n,null)})}static fetchRestaurantById(n,r){t.fetchRestaurants((e,t)=>{if(e)r(e,null);else{const e=t.find(r=>r.id==n);e?r(null,e):r("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(n,r){t.fetchRestaurants((e,t)=>{if(e)r(e,null);else{const e=t.filter(r=>r.cuisine_type==n);r(null,e)}})}static fetchRestaurantByNeighborhood(n,r){t.fetchRestaurants((e,t)=>{if(e)r(e,null);else{const e=t.filter(r=>r.neighborhood==n);r(null,e)}})}static fetchRestaurantByCuisineAndNeighborhood(n,r,e){t.fetchRestaurants((t,o)=>{if(t)e(t,null);else{let t=o;"all"!=n&&(t=t.filter(r=>r.cuisine_type==n)),"all"!=r&&(t=t.filter(n=>n.neighborhood==r)),e(null,t)}})}static fetchNeighborhoods(n){t.fetchRestaurants((r,e)=>{if(r)n(r,null);else{const r=e.map((n,r)=>e[r].neighborhood),t=r.filter((n,e)=>r.indexOf(n)==e);n(null,t)}})}static fetchCuisines(n){t.fetchRestaurants((r,e)=>{if(r)n(r,null);else{const r=e.map((n,r)=>e[r].cuisine_type),t=r.filter((n,e)=>r.indexOf(n)==e);n(null,t)}})}static urlForRestaurant(n){return`./restaurant.html?id=${n.id}`}static imageUrlForRestaurant(n){return`/img/${n.photograph}-800w.jpg`}static imageSizesForRestaurant(){return"(max-width: 320px) 280px, (max-width: 480px) 440px, (max-width: 1200px) 440px"}static srcsetForRestaurantImage(n){return`/img/${n.photograph}-320w.jpg 320w, /img/${n.photograph}-480w.jpg 480w, \n    /img/${n.photograph}-800w.jpg 800w`}static mapMarkerForRestaurant(n,r){return new google.maps.Marker({position:n.latlng,title:n.name,url:t.urlForRestaurant(n),map:r,animation:google.maps.Animation.DROP})}static createReview(n,r=(()=>{})){const e=`${t.DATABASE_URL}reviews`;fetch(e,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json; charset=utf-8"},referrer:"no-referrer",body:JSON.stringify(n)}).then(n=>r()).catch(n=>console.log(n))}}}),(function(n,r,e){"use strict";e.d(r,"a",(function(){return o}));var t=e(0);const o=(n=(()=>{}))=>{if(!navigator.onLine)return;const r=JSON.parse(localStorage.getItem("savedReviews"));r&&r.length>0&&r.forEach(r=>t.a.createReview(r,()=>n())),localStorage.setItem("savedReviews",JSON.stringify([]))}}),(function(n,r,e){var t=e(3);"string"==typeof t&&(t=[[n.i,t,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};e(5)(t,o);t.locals&&(n.exports=t.locals)}),(function(n,r,e){(n.exports=e(4)(!1)).push([n.i,"@charset \"utf-8\";\r\n/* CSS Document */\r\n#footer {\r\n  background-color: #444;\r\n  color: #aaa;\r\n  font-size: 8pt;\r\n  letter-spacing: 1px;\r\n  position: relative;\r\n  padding: 25px;\r\n  text-align: center;\r\n  text-transform: uppercase;\r\n}\r\n\r\n.version-button {\r\n  border: none;\r\n  padding: 10px;\r\n  color: #fff;\r\n  background-color: black;\r\n  min-width: 200px;\r\n  position: fixed;\r\n  bottom: 0;\r\n  font-weight: bold;\r\n  width: 100%;\r\n  font-size: 1rem;\r\n  height: 50px;\r\n  cursor: pointer;\r\n}\r\n.navigation-skip-link {\r\n  position: absolute;\r\n  right: 0;\r\n  top: 0;\r\n  background-color: #fff;\r\n  color: #000;\r\n  padding: 10px;\r\n  right: -340px;\r\n}\r\n.navigation-skip-link:focus {\r\n  right: 0;\r\n}\r\n#breadcrumb {\r\n  padding: 10px 40px 16px;\r\n  list-style: none;\r\n  background-color: #eee;\r\n  font-size: 17px;\r\n  margin: 0;\r\n}\r\n\r\n/* Display list items side by side */\r\n#breadcrumb li {\r\n  display: inline;\r\n}\r\n\r\n/* Add a slash symbol (/) before/behind each list item */\r\n#breadcrumb li + li:before {\r\n  padding: 8px;\r\n  color: black;\r\n  content: '/\\A0';\r\n}\r\n\r\n/* Add a color to all links inside the list */\r\n#breadcrumb li a {\r\n  color: #0275d8;\r\n  text-decoration: none;\r\n}\r\n\r\n/* Add a color on mouse-over */\r\n#breadcrumb li a:hover {\r\n  color: #01447e;\r\n  text-decoration: underline;\r\n}\r\n/* ====================== Map ====================== */\r\n#map {\r\n  height: 400px;\r\n  width: 100%;\r\n  background-color: #ccc;\r\n}\r\n/* ====================== Restaurant Filtering ====================== */\r\n.filter-options {\r\n  background-color: #3397db;\r\n  align-items: center;\r\n  padding: 15px;\r\n}\r\n.filter-label {\r\n  color: #fff;\r\n  display: block;\r\n  margin: 15px 0 0px 10px;\r\n}\r\n.filter-options h2 {\r\n  color: white;\r\n  font-size: 1rem;\r\n  font-weight: normal;\r\n  line-height: 1;\r\n  margin: 0 20px;\r\n}\r\n.filter-options select {\r\n  background-color: white;\r\n  border: 1px solid #fff;\r\n  font-family: Arial, sans-serif;\r\n  font-size: 11pt;\r\n  height: 35px;\r\n  letter-spacing: 0;\r\n  margin: 10px;\r\n  padding: 0 10px;\r\n  width: 200px;\r\n}\r\n\r\n/* ====================== Restaurant Listing ====================== */\r\n#restaurants-list {\r\n  background-color: #f3f3f3;\r\n  list-style: outside none none;\r\n  margin: 0;\r\n  padding: 30px 15px 60px;\r\n  text-align: center;\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  justify-content: center;\r\n}\r\n#restaurants-list li {\r\n  background-color: #fff;\r\n  font-family: Arial, sans-serif;\r\n  margin: 15px;\r\n  min-height: 380px;\r\n  text-align: left;\r\n  border-radius: 3px;\r\n  box-shadow: 2px 2px 2px rgba(190, 190, 190, 0.4);\r\n  width: 25%;\r\n  min-width: 330px;\r\n}\r\n#restaurants-list li .restaurant-list-container {\r\n  padding: 0 25px 30px;\r\n}\r\n#restaurants-list .restaurant-img {\r\n  background-color: #ccc;\r\n  display: block;\r\n  margin: 0;\r\n  max-width: 100%;\r\n  min-height: 248px;\r\n  min-width: 100%;\r\n  border-top-right-radius: 3px;\r\n  border-top-left-radius: 3px;\r\n}\r\n#restaurants-list li h2 {\r\n  color: #f18200;\r\n  font-family: Arial, sans-serif;\r\n  font-size: 14pt;\r\n  font-weight: 200;\r\n  letter-spacing: 0;\r\n  line-height: 1.3;\r\n  margin: 20px 0 10px;\r\n  text-transform: uppercase;\r\n}\r\n#restaurants-list p {\r\n  margin: 0;\r\n  font-size: 11pt;\r\n}\r\n#restaurants-list li a,\r\n.reviews-form-submit-button {\r\n  background-color: orange;\r\n  border-bottom: 3px solid #eee;\r\n  color: #fff;\r\n  display: inline-block;\r\n  font-size: 10pt;\r\n  margin: 15px 0 0;\r\n  padding: 8px 30px 10px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  text-transform: uppercase;\r\n}\r\n\r\n/* ====================== Restaurant Details ====================== */\r\n.inside header {\r\n  position: fixed;\r\n  top: 0;\r\n  width: 100%;\r\n  z-index: 1000;\r\n}\r\n.inside #map-container {\r\n  background: blue none repeat scroll 0 0;\r\n  height: 80%;\r\n  right: 0;\r\n  position: fixed;\r\n  top: 137px;\r\n  width: 50%;\r\n}\r\n.inside #map {\r\n  background-color: #ccc;\r\n  height: 100%;\r\n  width: 100%;\r\n}\r\n#restaurant-name {\r\n  color: #f18200;\r\n  font-family: Arial, sans-serif;\r\n  font-size: 20pt;\r\n  font-weight: 200;\r\n  letter-spacing: 0;\r\n  margin: 15px 0 30px;\r\n  text-transform: uppercase;\r\n  line-height: 1.1;\r\n}\r\n#restaurant-img {\r\n  width: 90%;\r\n}\r\n#restaurant-address {\r\n  font-size: 12pt;\r\n  margin: 10px 0px;\r\n}\r\n#restaurant-cuisine {\r\n  background-color: #333;\r\n  color: #ddd;\r\n  font-size: 12pt;\r\n  font-weight: 300;\r\n  letter-spacing: 10px;\r\n  margin: 0 0 20px;\r\n  padding: 2px 0;\r\n  text-align: center;\r\n  text-transform: uppercase;\r\n  width: 90%;\r\n}\r\n#restaurant-container,\r\n#reviews-container {\r\n  border-bottom: 1px solid #d9d9d9;\r\n  border-top: 1px solid #fff;\r\n  padding: 140px 40px 30px;\r\n  width: 50%;\r\n}\r\n#reviews-container {\r\n  padding: 30px 40px 80px;\r\n}\r\n#reviews-container h2,\r\n#reviews-form h3 {\r\n  color: #f58500;\r\n  font-size: 24pt;\r\n  font-weight: 300;\r\n  letter-spacing: -1px;\r\n  padding-bottom: 1pt;\r\n}\r\n#reviews-list {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n#reviews-list li {\r\n  background-color: #fff;\r\n  display: block;\r\n  list-style-type: none;\r\n  margin: 0 0 30px;\r\n  overflow: hidden;\r\n  padding: 20px;\r\n  max-width: 550px;\r\n  position: relative;\r\n  width: 85%;\r\n  box-shadow: 2px 2px 2px rgba(190, 190, 190, 0.4);\r\n  border-radius: 3px;\r\n}\r\n#reviews-list li p {\r\n  margin: 0 0 10px;\r\n}\r\n#reviews-list .review-rating-container {\r\n  margin-bottom: 10px;\r\n}\r\n#reviews-list .review-person-icon {\r\n  padding: 10px;\r\n  color: #585858;\r\n  margin-right: 5px;\r\n  border-radius: 50%;\r\n  display: inline-block;\r\n  width: 15px;\r\n  height: 15px;\r\n  text-align: center;\r\n  background-color: #f1f1f1;\r\n}\r\n#reviews-list .review-person-name {\r\n  color: #000;\r\n  font-size: 1rem;\r\n}\r\n#reviews-list .review-date {\r\n  font-style: italic;\r\n  color: #585858;\r\n  font-size: 0.9rem;\r\n}\r\n#reviews-list .review-comment {\r\n  color: #585858;\r\n  line-height: 1.5;\r\n  font-size: 0.8rem;\r\n}\r\n#reviews-list .reviews-star {\r\n  color: gold;\r\n  margin: 0 1px;\r\n}\r\n#reviews-form-container {\r\n  padding: 20px 40px 30px;\r\n  width: 45%;\r\n}\r\n#reviews-form {\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 100%;\r\n  padding: 10px;\r\n  max-width: 500px;\r\n}\r\n.form-group {\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 100%;\r\n  margin-bottom: 10px;\r\n}\r\n.form-group label {\r\n  margin-bottom: 3px;\r\n  color: #585858;\r\n  font-size: 0.9rem;\r\n  font-weight:bold;\r\n}\r\n.review-form-input,\r\n#comments {\r\n  border-radius: 3px;\r\n  padding: 8px;\r\n  height: 25px;\r\n  font-size: 0.8rem;\r\n  border: none;\r\n  background-color: #fff;\r\n}\r\n#comments {\r\n  height: 100px;\r\n}\r\n.reviews-form-submit-button {\r\n  border-radius: 3px;\r\n  cursor: pointer;\r\n  height: 50px;\r\n}\r\n#restaurant-hours td {\r\n  color: #666;\r\n}\r\n.flash-message {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  height: 50px;\r\n  background-color: rgb(82, 216, 82);\r\n  color: #fff;\r\n  display: flex;\r\n  align-items: center;\r\n  z-index: 9999;\r\n  padding: 15px 30px;\r\n  font-size: 1.2rem;\r\n  width: 100%;\r\n}\r\n.flash-message p {\r\n  margin-left: 10px;\r\n  color: #fff;\r\n  font-size: 1rem;\r\n}\r\n\r\n@media (max-width: 1200px) {\r\n  .inside #map-container {\r\n    background: blue none repeat scroll 0 0;\r\n    position: static;\r\n    display: block;\r\n    width: 100%;\r\n    height: 500px;\r\n  }\r\n\r\n  #restaurant-container,\r\n  #reviews-container {\r\n    border-bottom: 1px solid #d9d9d9;\r\n    border-top: 1px solid #fff;\r\n    padding: 0;\r\n    width: 100%;\r\n  }\r\n\r\n  #restaurant-img {\r\n    width: 100%;\r\n  }\r\n\r\n  #restaurant-cuisine {\r\n    width: 100%;\r\n  }\r\n\r\n  #restaurant-name {\r\n    text-align: center;\r\n  }\r\n\r\n  #reviews-list {\r\n    padding: 15px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n  }\r\n\r\n  #reviews-container h2 {\r\n    text-align: center;\r\n    margin-top: 20px;\r\n  }\r\n\r\n  table#restaurant-hours {\r\n    width: 50%;\r\n    margin: 10px auto;\r\n  }\r\n\r\n  #restaurant-hours td {\r\n    color: #666;\r\n    width: 50%;\r\n    font-size: 1rem;\r\n  }\r\n\r\n  #restaurant-address {\r\n    text-align: center;\r\n    margin-bottom: 23px;\r\n  }\r\n\r\n  #reviews-form-container {\r\n    display: flex;\r\n    justify-content: center;\r\n    width: auto;\r\n  }\r\n\r\n  #reviews-form h3 {\r\n    text-align: center;\r\n  }\r\n}\r\n\r\n@media (max-width: 600px) {\r\n  table#restaurant-hours {\r\n    width: 100%;\r\n    padding: 20px;\r\n  }\r\n\r\n  \r\n  #restaurants-list li {\r\n    width: 70%;\r\n  }\r\n}\r\n\r\n@media (max-width: 450px) {\r\n  #logo {\r\n    font-size: 0.9rem;\r\n  }\r\n}\r\n",""])}),(function(n,r){n.exports=function(n){var r=[];return r.toString=function(){return this.map((function(r){var e=(function(n,r){var e=n[1]||"",t=n[3];if(!t)return e;if(r&&"function"==typeof btoa){var o=(function(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"})(t),i=t.sources.map((function(n){return"/*# sourceURL="+t.sourceRoot+n+" */"}));return[e].concat(i).concat([o]).join("\n")}return[e].join("\n")})(r,n);return r[2]?"@media "+r[2]+"{"+e+"}":e})).join("")},r.i=function(n,e){"string"==typeof n&&(n=[[null,n,""]]);for(var t={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(t[i]=!0)}for(o=0;o<n.length;o++){var a=n[o];"number"==typeof a[0]&&t[a[0]]||(e&&!a[2]?a[2]=e:e&&(a[2]="("+a[2]+") and ("+e+")"),r.push(a))}},r}}),(function(n,r,e){var t={},o=(function(n){var r;return function(){return void 0===r&&(r=n.apply(this,arguments)),r}})((function(){return window&&document&&document.all&&!window.atob})),i=(function(n){var r={};return function(n){if("function"==typeof n)return n();if(void 0===r[n]){var e=function(n){return document.querySelector(n)}.call(this,n);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(n){e=null}r[n]=e}return r[n]}})(),a=null,s=0,l=[],c=e(6);function d(n,r){for(var e=0;e<n.length;e++){var o=n[e],i=t[o.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](o.parts[a]);for(;a<o.parts.length;a++)i.parts.push(g(o.parts[a],r))}else{var s=[];for(a=0;a<o.parts.length;a++)s.push(g(o.parts[a],r));t[o.id]={id:o.id,refs:1,parts:s}}}}function u(n,r){for(var e=[],t={},o=0;o<n.length;o++){var i=n[o],a=r.base?i[0]+r.base:i[0],s={css:i[1],media:i[2],sourceMap:i[3]};t[a]?t[a].parts.push(s):e.push(t[a]={id:a,parts:[s]})}return e}function p(n,r){var e=i(n.insertInto);if(!e)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var t=l[l.length-1];if("top"===n.insertAt)t?t.nextSibling?e.insertBefore(r,t.nextSibling):e.appendChild(r):e.insertBefore(r,e.firstChild),l.push(r);else if("bottom"===n.insertAt)e.appendChild(r);else{if("object"!=typeof n.insertAt||!n.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=i(n.insertInto+" "+n.insertAt.before);e.insertBefore(r,o)}}function f(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var r=l.indexOf(n);r>=0&&l.splice(r,1)}function h(n){var r=document.createElement("style");return void 0===n.attrs.type&&(n.attrs.type="text/css"),m(r,n.attrs),p(n,r),r}function m(n,r){Object.keys(r).forEach((function(e){n.setAttribute(e,r[e])}))}function g(n,r){var e,t,o,i;if(r.transform&&n.css){if(!(i=r.transform(n.css)))return function(){};n.css=i}if(r.singleton){var l=s++;e=a||(a=h(r)),t=b.bind(null,e,l,!1),o=b.bind(null,e,l,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(e=(function(n){var r=document.createElement("link");return void 0===n.attrs.type&&(n.attrs.type="text/css"),n.attrs.rel="stylesheet",m(r,n.attrs),p(n,r),r})(r),t=function(n,r,e){var t=e.css,o=e.sourceMap,i=void 0===r.convertToAbsoluteUrls&&o;(r.convertToAbsoluteUrls||i)&&(t=c(t));o&&(t+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([t],{type:"text/css"}),s=n.href;n.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}.bind(null,e,r),o=function(){f(e),e.href&&URL.revokeObjectURL(e.href)}):(e=h(r),t=function(n,r){var e=r.css,t=r.media;t&&n.setAttribute("media",t);if(n.styleSheet)n.styleSheet.cssText=e;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(e))}}.bind(null,e),o=function(){f(e)});return t(n),function(r){if(r){if(r.css===n.css&&r.media===n.media&&r.sourceMap===n.sourceMap)return;t(n=r)}else o()}}n.exports=function(n,r){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(r=r||{}).attrs="object"==typeof r.attrs?r.attrs:{},r.singleton||"boolean"==typeof r.singleton||(r.singleton=o()),r.insertInto||(r.insertInto="head"),r.insertAt||(r.insertAt="bottom");var e=u(n,r);return d(e,r),function(n){for(var o=[],i=0;i<e.length;i++){var a=e[i];(s=t[a.id]).refs--,o.push(s)}n&&d(u(n,r),r);for(i=0;i<o.length;i++){var s;if(0===(s=o[i]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete t[s.id]}}}};var x=(function(){var n=[];return function(r,e){return n[r]=e,n.filter(Boolean).join("\n")}})();function b(n,r,e,t){var o=e?"":t.css;if(n.styleSheet)n.styleSheet.cssText=x(r,o);else{var i=document.createTextNode(o),a=n.childNodes;a[r]&&n.removeChild(a[r]),a.length?n.insertBefore(i,a[r]):n.appendChild(i)}}}),(function(n,r){n.exports=function(n){var r="undefined"!=typeof window&&window.location;if(!r)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var e=r.protocol+"//"+r.host,t=e+r.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(n,r){var o,i=r.trim().replace(/^"(.*)"$/,(function(n,r){return r})).replace(/^'(.*)'$/,(function(n,r){return r}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?n:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?e+i:t+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}}),,,(function(n,r,e){"use strict";e.r(r);var t=e(0),o=e(1);e(2);const i=(n=self.neighborhoods)=>{const r=document.getElementById("neighborhoods-select");n.forEach(n=>{const e=document.createElement("option");e.innerHTML=n,e.value=n,r.append(e)})},a=(n=self.cuisines)=>{const r=document.getElementById("cuisines-select");n.forEach(n=>{const e=document.createElement("option");e.innerHTML=n,e.value=n,r.append(e)})};window.initMap=(()=>{self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),document.querySelector,s()});const s=()=>{const n=document.getElementById("cuisines-select"),r=document.getElementById("neighborhoods-select"),e=n.selectedIndex,o=r.selectedIndex,i=n[e].value,a=r[o].value;t.a.fetchRestaurantByCuisineAndNeighborhood(i,a,(n,r)=>{n?console.error(n):(l(r),c())})},l=n=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers=[],self.markers.forEach(n=>n.setMap(null)),self.restaurants=n},c=(n=self.restaurants)=>{const r=document.getElementById("restaurants-list");n.forEach(n=>{r.append(d(n))}),u()},d=n=>{"Casa Enrique"===n.name&&(n.photograph=10);const r=document.createElement("li"),e=document.createElement("img");e.className="restaurant-img",e.srcset=t.a.srcsetForRestaurantImage(n),e.sizes=t.a.imageSizesForRestaurant(),e.src=t.a.imageUrlForRestaurant(n),e.alt=n.name,r.append(e);const o=document.createElement("div");o.className="restaurant-list-container";const i=document.createElement("h2");i.innerHTML=n.name,o.append(i);const a=document.createElement("p");a.innerHTML=n.neighborhood,o.append(a);const s=document.createElement("p");s.innerHTML=n.address,o.append(s);const l=document.createElement("a");return l.innerHTML="View Details",l.setAttribute("role","button"),l.href=t.a.urlForRestaurant(n),o.append(l),r.append(o),r},u=(n=self.restaurants)=>{n.forEach(n=>{const r=t.a.mapMarkerForRestaurant(n,self.map);google.maps.event.addListener(r,"click",()=>{window.location.href=r.url}),self.markers.push(r)})},p=n=>{const r=document.createElement("button");r.textContent="There is a new version available. Click here to refresh",r.className="version-button",r.type="button",document.getElementsByTagName("body")[0].appendChild(r),document.getElementsByClassName("version-button")[0].addEventListener("click",()=>(n=>{n.postMessage({action:"skipWaiting"}),document.getElementsByTagName("body")[0].removeChild(document.getElementsByClassName("version-button")[0])})(n))},f=n=>{n.addEventListener("statechange",()=>{"installed"!==n.state||p(n)})},h=()=>Object(o.a)();document.addEventListener("DOMContentLoaded",n=>{t.a.fetchNeighborhoods((n,r)=>{n?console.error(n):(self.neighborhoods=r,i())}),t.a.fetchCuisines((n,r)=>{n?console.error(n):(self.cuisines=r,a())}),navigator.serviceWorker&&(navigator.serviceWorker.register("./sw.js").then(n=>{navigator.serviceWorker.controller&&(n.waiting?p(n.waiting):(n.installing&&f(n.installing),n.addEventListener("updatefound",()=>f(n.installing))))}).catch(n=>console.log(n)),navigator.serviceWorker.addEventListener("controllerchange",()=>{window.location.reload()})),document.querySelector("#neighborhoods-select").addEventListener("change",s),document.querySelector("#cuisines-select").addEventListener("change",s),window.addEventListener("online",h),Object(o.a)()})})]);