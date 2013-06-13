/*
	Name: Javascript Common Function
	Link: niumowang.org
	Author: ok8008@yeah.net
*/
var Common = {
	getId : function (id) {
		return document.getElementById(id) || id;
	},
	hasClass : function (element,value) {
		var reg = new RegExp('(\\s|^)' + value + '(\\s|$)');
		return element.className.match(reg);
	},
	removeClass : function (element,value) {
		if (Common.hasClass(element,value)){
			var reg = new RegExp('(\\s*)' + className + '(\\s*)');
			element.className = element.className.replace(reg, ' ');
		}
	},
	removeAllClass : function (name) {
		var i = 0, len, list = Public.getId('itemWrap').getElementsByTagName('li');
		len = list.length;
		for (i; i<len; i += 1) {
			Public.removeClass(list[i],name);
		};
	},
	addClass : function (element,value) {
		if(!element.className){
			element.className = value;
		}else{
			var oValue = element.className;
			oValue += " ";
			oValue += value;
			element.className = oValue;
		}
	},
	isWebkit : function(){
		return (navigator.userAgent.toLowerCase().indexOf('webkit') > 0)?true:false;
	},
	css : function(obj,val){
		for(var attr in val){
			obj.style[attr] = val[attr];
		}
	},
	getParent : function(target,tag){
		if(target.tagName.toLowerCase() === tag){
			return target;
		}else if(target.getElementsByTagName(tag).length > 0){
			return false;
		}else {
			return Common.getParent(target.parentNode,tag);
		}
	}
};