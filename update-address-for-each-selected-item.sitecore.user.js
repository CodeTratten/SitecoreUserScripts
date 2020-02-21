// ==UserScript==
// @name         Update address for each selected item.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        */sitecore/shell/Applications/Content%20Editor.aspx*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.previousUrl = '';
    window.getSitecoreTreeNode = function(e){
        if(!e.target || e.target.className == 'scContentTreeNodeGlyph'){
            return null;
        }

        var pathNum = 0;
        switch(e.target.tagName){
            case 'IMG':
                pathNum = 3;
                break;
            case 'SPAN':
                pathNum = 2;
                break;
            case 'A':
                pathNum = 1;
                break;
        }
        if(e.path[pathNum].tagName == 'DIV' && e.path[pathNum].className == 'scContentTreeNode'){
            return e.path[pathNum];
        }
        return null;
    };

    window.getActiveDb = function(){
        var val = document.getElementById("__CurrentItem").value
        return val.split('/')[2];
    };

    window.getItemIdFromTreeNode = function(node){
        var a = node.querySelector('a');
        return a.id.split('_')[2];
    };

    window.formatGuid = function(str){
        var parts = [];
        parts.push(str.slice(0,8));
        parts.push(str.slice(8,12));
        parts.push(str.slice(12,16));
        parts.push(str.slice(16,20));
        parts.push(str.slice(20,32));
        return '{' + parts.join('-') + '}';
    };


    window.onpopstate = function(event) {
        if(document.location.search.indexOf('?sc_bw=1&sc_content=') == -1)
        {
            return;
        }
        var guid = document.location.search.replace('?sc_bw=1&sc_content=' + getActiveDb() + '&fo=', '');
        guid = guid.match(/[0-9A-Fa-f]/g).join('');
        var a = document.getElementById('Tree_Node_' + guid);
        if(!a){
            return;
        }
        a.click();
    };

    document.addEventListener('click',function(e){
        var node = getSitecoreTreeNode(e);
        if(node != null){
            console.log(e);
            var id = getItemIdFromTreeNode(node);
            var url = '/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&sc_content=' + getActiveDb() + '&fo=' + formatGuid(id);
            window.previousUrl = document.location;
            console.log('got click');
            history.pushState(null, null, url);
        }
    });

})();