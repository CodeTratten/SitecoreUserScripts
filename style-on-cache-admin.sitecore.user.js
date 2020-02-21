// ==UserScript==
// @name         Style on Sitecore cache admin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes width on table and sets some initial font style.
// @match        */sitecore/admin/cache.aspx
// @grant        none
// ==/UserScript==

(function() {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = 'body{font-family: arial;font-size:12px;}';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
    var table = document.getElementsByTagName('table')[0];
    table.style='';
    table.width='';
})();

