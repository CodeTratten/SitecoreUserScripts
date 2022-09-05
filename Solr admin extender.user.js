// ==UserScript==
// @name         Solr admin extender
// @namespace    http://consid.se/
// @version      0.1
// @description  Try to make solr admin better!
// @author       You
// @match        */solr/*
// @icon         https://solr.apache.org/theme/images/favicon.ico
// @grant        none
// ==/UserScript==


var watchElements=[
	{tag:"textarea", classes:[], name: "q"},
	{tag:"input", classes:[], name: "fq"},
	{tag:"input", classes:[], name: "sort"},
	{tag:"input", classes:[], name: "fl"},
	{tag:"input", classes:[], name: "facet.field"},
];
var words = [];

function documentKeyUp(e){
	hideMulti()
	var src = e.srcElement;
	if(!isWatchElement(src)){
		return;
	}

	if(!isObservedKey(e)){
		return;
	}
	var matches = getMatchingWords(src);
	if(matches.length == 0){
		return;
	}
	if(matches.length == 1){
		inserWordAndHilight(src, matches[0]);
	} else {
		inserWordAndHilight(src, matches[0]);
		showOtherMatches(src, matches);
	}
}

function documentClick(e){
	hideMulti();
}

function hideMulti(){
	var outer = document.getElementById("multimatch");
	outer.style.setProperty("visibility", "hidden");
}

function showOtherMatches(src, matches){
	var outer = document.getElementById("multimatch");
	var left = src.offsetLeft + parseInt(window.getComputedStyle(document.body, null).getPropertyValue('padding-left'));
	var top = src.offsetTop + src.clientHeight + parseInt(window.getComputedStyle(document.body, null).getPropertyValue('padding-top'));
	outer.style.setProperty("left", left + "px");
	outer.style.setProperty("top", top + "px");
	outer.style.setProperty("visibility", "visible");
	var html = "<ul style='list-style:none; padding:0;margin:0;'>";
	for(var i = 0; i < matches.length; i++){
		html += "<li style='padding: 5px;'>" + matches[i] + "</li>";
	}
	html += "</ul>";
	outer.innerHTML = html;
}

//Hadles tab to insert the suggested word.
function documentKeyDown(e){
	if(e.keyCode != 9){
		return;
	}
	var src = e.srcElement;
	if(!isWatchElement(src)){
		return;
	}
	window.getSelection()?.removeAllRanges();
	e.preventDefault();
	e.cancelBubble = true;
	src.focus();
	src.selectionStart = src.value.length;
	src.selectionEnd = src.value.length;
}

function isObservedKey(e){
	if(e.keyCode == 189) return true; //_
	if(e.keyCode == 109) return true; //-
	if(e.keyCode >= 65 && e.keyCode <= 90) return true; //a to z
	if(e.keyCode >= 48 && e.keyCode <= 57) return true; //0 to 9
	return false;
}

function inserWordAndHilight(src, newWord){
	var word = getLastWord(src);
	if(word.length == newWord.length){
		return;
	}
	var v = src.value;
	var last = v.lastIndexOf(word);
	var l = src.value.length;
	src.value = v.substring(0, l - word.length) + newWord;
	src.setSelectionRange(l, src.value.length);
}

function getMatchingWords(src){
	var word = getLastWord(src);
	var list = [];
	for(var i = 0; i < words.length; i++){
		if(!words[i].toLowerCase().startsWith(word.toLowerCase())){
			continue;
		}
		list.push(words[i]);
	}
	list.sort();
	return list;
}

function getLastWord(src){
	var v = src.value;
	if(v.length == 0){
		return "";
	}
	var arr = v.split(" ");
	if(arr.length > 0){
		return arr[arr.length - 1];
	}
	return "";
}

function isWatchElement(src){
	for(var i = 0; i < watchElements.length; i++){
		var element = watchElements[i];
		if(src.tagName != element.tag.toUpperCase()){
			continue;
		}
        if(src.name == element.name){
            return true;
        }
		for(var j = 0; j < element.classes.length; j++){
			for(var k = 0; k < src.classList.length; k++){
				if(src.classList[k] == element.classes[j]){
					return true;
				}
			}
		}
	}
	return false;
}

function getIsQueryPage(){
    return document.location.hash.indexOf("/query") > -1;
}

function getCurrentCollection(){
    return document.location.hash.split("/")[1];
}


function init(){
    window.document.addEventListener('keyup', documentKeyUp);
    window.document.addEventListener('keydown', documentKeyDown);
    window.document.addEventListener('click', documentClick);
    var ele = document.createElement("div");
    ele.setAttribute("style","text-align: left; background-color: #999; font-family:arial; color: white; border: 1px solid black; position: absolute;left: 0px; top: 0px; visibility:hidden;");
    ele.setAttribute("id","multimatch");
    document.body.appendChild(ele);
    console.log("init start");
    if(!getIsQueryPage()){
        console.log("no query page");
        return;
    }
    words = [];
    loadFields(getCurrentCollection()).then(function(list){
        words = list;
        console.log("init end");
    });
}

function loadFields(collection){
    return new Promise(function(resolve, reject){
        var url = `/solr/${collection}/admin/luke?numTerms=0&wt=json`
        loadJSON(url).then(function(data){
            var arr = [];
            for(var n in data.fields){
                arr.push(n);
            };
            resolve(arr);
        }).catch(function(err){reject(err)});
    });
}

function loadJSON(path, success, error){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr);
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send();
    });
}



(function() {
    'use strict';
    init();
})();

