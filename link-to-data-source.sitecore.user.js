// ==UserScript==
// @name         Link to data source
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  In the Presentation -> Details -> component, there will be a "Go to item"-link when selecting datasource.
// @match        */sitecore/shell/applications/field%20editor.aspx?mo=mini&hdl=*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

(function($) {
    var value = $('.scContentButtons').parent().find('.scContentControl').val();
    if(value.length === 0){
        return;
    }
    $('.scContentButtons').append('<a href="/sitecore/shell/Applications/Content%20Editor.aspx?fo=' + escape(value) + '" target="_blank" class="scContentButton">Go to item</a>');
})(jQuery);

