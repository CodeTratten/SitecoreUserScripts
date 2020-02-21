// ==UserScript==
// @name         Sort Sitecore cache admin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        */sitecore/admin/cache.aspx
// @match        */ui/c.aspx
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

(function($) {
    'use strict';

    window.SortBySecondColumnTextAscending = function(zA, zB)
    {
        var ValA_Text = $(zA).find("td:eq(1)").text().toLowerCase();
        var ValB_Text = $(zB).find("td:eq(1)").text().toLowerCase();

        if(ValA_Text > ValB_Text){
            return 1;}
        else if (ValA_Text < ValB_Text){
            return -1;}
        else{
            return 0;}
    }

    var jTableToSort = $("table table");
    var jRowsToSort = jTableToSort.find ("tr:gt(0)");
    jRowsToSort.sort(SortBySecondColumnTextAscending).appendTo(jTableToSort);


})(jQuery);

