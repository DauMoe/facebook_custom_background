// ==UserScript==
// @name         Facebook custom background
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Change background image with Base64 conversion
// @author       DauMoe
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525981/Facebook%20custom%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/525981/Facebook%20custom%20background.meta.js
// ==/UserScript==
(()=>{"use strict";function e(){return new Promise((function(e,t){var n=indexedDB.open("ImageStorageDB",1);n.onerror=function(e){t("Error opening IndexedDB")},n.onsuccess=function(t){e(t.target.result)},n.onupgradeneeded=function(e){e.target.result.createObjectStore("images",{keyPath:"id"}).createIndex("base64","base64",{unique:!1})}}))}!function(){var t=document.createElement("div"),n=document.createElement("div"),o=document.createElement("input"),r="transparent",a="darken",c="#2f2f2fa6",i="#25272880",s="#2527289e",d=r,u="lighten",l="#d7d4d469",f="#ffffff99",g="#ffffff42",y=r,p=function(e){t.style.opacity=0,setTimeout((function(){t.style.backgroundImage="url(".concat(e,")"),t.style.opacity=1}),0)};o.type="file",o.accept="image/png, image/jpeg, image/jpg",o.style.display="none";var A={width:"50px",height:"50px","border-radius":"25px",position:"fixed",left:"16px",bottom:"16px","z-index":3,"background-image":"url(".concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEPSURBVHgB7ZjtDYIwEIYPJmAEHIENGMFR2AQ2gg10A9gANjjvQjW1Ba5WtP3RJ7nYpG/aJ+b4KAAEIpZUPdWMYejZgV0yNbhRFRCWhapioZ4GNcTBwEII8bBYQhkBf8TcP4fISEISSUgiCUkkIYkkJJGEJH4iRA/wguoKPpjvknACtEynlmsdsu/7fyJE0/Xz3fcg0xhLNkLeTwjXg8CsqhQyOrt5byFce2LUYjwuhAwe5b8V6jY2aR0yu3lvIbR7QqdxyFh5byHc7gkdnqvR/YBp9ZMZODx10NRIPyWcy0RbXHQhfTK6O3U6l0kkIQnuoRnCf4p5wf/QHeJhiO6DVU5X+cQDqgHCsKi9K3Z5AJ4wAkK8W5ViAAAAAElFTkSuQmCC",")"),"background-color":"#33afd1","background-blend-mode":"normal","background-position":"center","background-repeat":"no-repeat","background-size":"26px",cursor:"pointer"};Object.assign(t.style,{width:"100vw",height:"100vh",position:"fixed",top:0,left:0,"background-size":"cover","background-repeat":"no-repeat","background-position":"center","z-index":-1,transition:"background-image 0.5s ease-in-out, opacity 0.5s ease-in-out",opacity:0}),Object.assign(n.style,A),document.body.appendChild(t),document.body.appendChild(n),document.body.appendChild(o),o.addEventListener("change",(function(t){var n=t.target.files[0];n&&function(e,t){var n=new FileReader;n.onloadend=function(){t(n.result)},n.readAsDataURL(e)}(n,(function(t){p(t),function(t){e().then((function(e){var n=e.transaction("images","readwrite"),o=n.objectStore("images"),r={id:"backgroundImage",base64:t};o.put(r),n.oncomplete=function(){console.log("Image saved to IndexedDB")},n.onerror=function(){console.error("Error saving image to IndexedDB")}})).catch((function(e){return console.error(e)}))}(t)}))})),n.addEventListener("click",(function(){o.click()})),new Promise((function(t,n){e().then((function(e){var o=e.transaction("images","readonly").objectStore("images").get("backgroundImage");o.onsuccess=function(e){e.target.result?t(e.target.result.base64):n("No image found")},o.onerror=function(){n("Error retrieving image from IndexedDB")}})).catch((function(e){return n(e)}))})).then((function(e){p(e)})).catch((function(e){console.error(e)})),new MutationObserver((function(e){e.forEach((function(e){if(e.target===document.documentElement&&"class"===e.attributeName){var n=document.documentElement.classList.contains("__fb-dark-mode");t.style.backgroundBlendMode=n?a:u,t.style.backgroundColor=n?c:l,n?document.querySelectorAll(".__fb-dark-mode").forEach((function(e){e.style.setProperty("--always-black",d),e.style.setProperty("--surface-background",s),e.style.setProperty("--web-wash",r),e.style.setProperty("--card-background",i)})):document.querySelectorAll(".__fb-light-mode").forEach((function(e){e.style.setProperty("--always-black",y),e.style.setProperty("--surface-background",g),e.style.setProperty("--web-wash",r),e.style.setProperty("--card-background",f)})),"/photo/"===window.location.pathname&&(n?document.querySelectorAll(".__fb-dark-mode").forEach((function(e){e.style.setProperty("--card-background",r),e.style.setProperty("--surface-background","#2527282b")})):document.querySelectorAll(".__fb-light-mode").forEach((function(e){e.style.setProperty("--card-background",r),e.style.setProperty("--surface-background",r),e.style.setProperty("--overlay-alpha-80","#f4f4f47d"),e.style.setProperty("--secondary-text","#000000")})))}}))})).observe(document.documentElement,{attributes:!0})}()})();