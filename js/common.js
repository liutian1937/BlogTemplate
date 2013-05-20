/*
	Name: Javascript Common Function
	Link: niumowang.org
	Author: ok8008@yeah.net
*/
function addClass(element,value){
	if(!element.className){
		element.className = value;
	}else{
		var oValue = element.className;
		oValue += " ";
		oValue += value;
		element.className = oValue;
	}
};
function removeClass(element,value){
	if (hasClass(element,value)){
		var reg = new RegExp('(\\s|^)' + value + '(\\s|$)');
		element.className = element.className.replace(reg, ' ');
	}
};
function hasClass(element,value){
	var reg = new RegExp('(\\s|^)' + value + '(\\s|$)');
	return element.className.match(reg);
}