// ==UserScript==
// @name         Facebook custom background
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Custom facebook background
// @author       DauMoe
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525981/Facebook%20custom%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/525981/Facebook%20custom%20background.meta.js
// ==/UserScript==
(()=>{"use strict";function e(){return new Promise((function(e,t){var n=indexedDB.open("ImageStorageDB",1);n.onerror=function(e){t("Error opening IndexedDB")},n.onsuccess=function(t){e(t.target.result)},n.onupgradeneeded=function(e){e.target.result.createObjectStore("images",{keyPath:"id"}).createIndex("base64","base64",{unique:!1})}}))}var t="__fb-dark-mode",n="transparent",o="darken",r="#2f2f2fa6",a="#25272880",c="#2527289e",s=n,i="lighten",d="#d7d4d469",u="#ffffff99",l="#ffffff42",g=n;!function(){var f=document.createElement("div"),p=document.createElement("div"),y=document.createElement("input"),m=function(e){f.style.opacity=0,setTimeout((function(){f.style.backgroundImage="url(".concat(e,")"),f.style.opacity=1}),0)};y.type="file",y.accept="image/png, image/jpeg, image/jpg",y.style.display="none";var A={width:"50px",height:"50px","border-radius":"25px",position:"fixed",left:"16px",bottom:"16px","z-index":3,"background-image":"url(".concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEPSURBVHgB7ZjtDYIwEIYPJmAEHIENGMFR2AQ2gg10A9gANjjvQjW1Ba5WtP3RJ7nYpG/aJ+b4KAAEIpZUPdWMYejZgV0yNbhRFRCWhapioZ4GNcTBwEII8bBYQhkBf8TcP4fISEISSUgiCUkkIYkkJJGEJH4iRA/wguoKPpjvknACtEynlmsdsu/7fyJE0/Xz3fcg0xhLNkLeTwjXg8CsqhQyOrt5byFce2LUYjwuhAwe5b8V6jY2aR0yu3lvIbR7QqdxyFh5byHc7gkdnqvR/YBp9ZMZODx10NRIPyWcy0RbXHQhfTK6O3U6l0kkIQnuoRnCf4p5wf/QHeJhiO6DVU5X+cQDqgHCsKi9K3Z5AJ4wAkK8W5ViAAAAAElFTkSuQmCC",")"),"background-color":"#33afd1","background-blend-mode":"normal","background-position":"center","background-repeat":"no-repeat","background-size":"26px",cursor:"pointer"};Object.assign(f.style,{width:"100vw",height:"100vh",position:"fixed",top:0,left:0,"background-size":"cover","background-repeat":"no-repeat","background-position":"center","z-index":-1,transition:"background-image 0.5s ease-in-out, opacity 0.5s ease-in-out",opacity:0}),Object.assign(p.style,A),document.body.appendChild(f),document.body.appendChild(p),document.body.appendChild(y),y.addEventListener("change",(function(t){var n=t.target.files[0];n&&function(e,t){var n=new FileReader;n.onloadend=function(){t(n.result)},n.readAsDataURL(e)}(n,(function(t){m(t),function(t){e().then((function(e){var n=e.transaction("images","readwrite"),o=n.objectStore("images"),r={id:"backgroundImage",base64:t};o.put(r),n.oncomplete=function(){console.log("Image saved to IndexedDB")},n.onerror=function(){console.error("Error saving image to IndexedDB")}})).catch((function(e){return console.error(e)}))}(t)}))})),p.addEventListener("click",(function(){y.click()})),new Promise((function(t,n){e().then((function(e){var o=e.transaction("images","readonly").objectStore("images").get("backgroundImage");o.onsuccess=function(e){e.target.result?t(e.target.result.base64):n("No image found")},o.onerror=function(){n("Error retrieving image from IndexedDB")}})).catch((function(e){return n(e)}))})).then((function(e){m(e)})).catch((function(e){console.error(e)})),new MutationObserver((function(e){var p=location.pathname.startsWith("/photo"),y=document.documentElement.classList.contains(t),m=location.pathname.startsWith("/groups/");e.forEach((function(e){if(e.target===document.documentElement&&"class"===e.attributeName)f.style.backgroundBlendMode=y?o:i,f.style.backgroundColor=y?r:d,document.documentElement.style.setProperty("--card-background",y?a:u),document.documentElement.style.setProperty("--surface-background",m?n:l);else if("childList"===e.type&&"DIV"===e.target.tagName){var A,b,h,k=null===(A=e.addedNodes)||void 0===A?void 0:A[0];if(k)null!==(b=k.classList)&&void 0!==b&&b.contains(t)?(k.style.setProperty("--always-black",s),k.style.setProperty("--surface-background",p?"#2527282b":c),k.style.setProperty("--web-wash",n),k.style.setProperty("--card-background",p?n:a)):null!==(h=k.classList)&&void 0!==h&&h.contains("__fb-light-mode")&&(k.style.setProperty("--always-black",g),k.style.setProperty("--surface-background",p?n:l),k.style.setProperty("--web-wash",n),k.style.setProperty("--card-background",p?n:u),k.style.setProperty("--overlay-alpha-80","#f4f4f463"),k.style.setProperty("--secondary-text","#373839"),p&&(k.style.setProperty("--secondary-text","#000000"),k.style.setProperty("--shadow-1",n)))}}))})).observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0})}()})();