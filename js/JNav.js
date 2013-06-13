/*
	Name: Javascript Common Function
	Link: niumowang.org
	Author: ok8008@yeah.net
*/
(function(){
	var Nav = function (obj) {
		var _this = this;
		_this.items = obj.getElementsByTagName('ul');//获取子元素ul的数组
		_this.wrapHeight = obj.scrollHeight;
		_this.titleHeight = 50;
		_this.init();
	}
	Nav.prototype = {
		init:function(){
			var _this = this,i = 0, x, y, width, fixed;
			_this.current = 0;//当前滚动到第几个
			_this.length = _this.items.length;//数组长度
			_this.topLimit = []; //建立limit数组
			_this.topY = []; //建立pageY数组
			_this.navObj = [];//缓存导航对象
			_this.cloneObj = [];//缓存导航备份对象
			
			if(document.getElementById('appendItem')){
				fixed = document.getElementById('appendItem');
				fixed.innerHTML = '';
			}else{
				fixed = document.createElement('ul');
				fixed.className = 'item';
				fixed.id = 'appendItem';
				document.body.appendChild(fixed);
			};
			width = _this.items[0].offsetWidth;
			x = _this._pageX(_this.items[_this.length-1].getElementsByTagName('li')[0]);
			Common.css(fixed,{
					'position' : 'fixed',
					'top' : '0px',
					'left': x+'px',
					'width' : width+'px'
			});
			
			for(i; i<_this.length; i += 1){
				y = _this._pageY(_this.items[i]);
				_this.topLimit.push(0);
				_this.topY.push(y);//将每个标题距离顶部的距离加入数组
				if(i > 0){
					_this.topLimit[i-1] = y-_this.titleHeight;
					if(i === _this.length -1){
						_this.topLimit[i] = _this.wrapHeight-_this.titleHeight;
					}
				};
				_this.navObj[i] = _this.items[i].getElementsByTagName('li')[0];
				_this.cloneObj[i] = _this.items[i].getElementsByTagName('li')[0].cloneNode(true);
				_this.cloneObj[i].style.display = 'none';
				fixed.appendChild(_this.cloneObj[i]);
			};
			
			_this.cloneObj[0].style.display = 'block';
			
			console.log(_this.topLimit);//打印limit数组
			
		},
		scroll:function(disTop){
			//处理滚动条的方法
			var _this = this, prev, distance, i = 0;
			if(disTop <= 0){
				_this._changeState(0,'show','top');
				_this._hideFixed();
				return false;
			}
			_this.current = _this._getCurrent(disTop);
			if(_this.current < 0){
				_this.current = 0;
			}else if(_this.current > _this.length){
				_this.current = _this.length;
			};
			
			for(i;i<_this.length;i++){
				if(i > _this.current){
					Common.css(_this.navObj[i],{
						'display' : 'block',
						'top' : '0px',
						'bottom' : 'auto'
					});
				};
			}
			
			if(disTop > _this.topY[_this.current] && disTop < _this.topLimit[_this.current]){
				_this._changeState(_this.current,'hide');				
			}else{
				_this._changeState(_this.current,'show','bottom');
			};
			
		},
		_changeState : function (index,state,position) {
			var _this = this, limit = _this.topLimit[index] - _this.topY[index] , obj = _this.navObj[index], i = 0;
			(state === 'show')?_this._hideFixed(index):_this._hideFixed(index,true);//当需要显示固定的标题的时候，隐藏所以fixed
			state = (state === 'show')?'block':'none';
				
			(position === 'top')?
				Common.css(obj,{
						'display' : state,
						'top' : '0px',
						'bottom' : 'auto'
				}):
				Common.css(obj,{
						'display' : state,
						'top' : 'auto',
						'bottom' : '0px'
				});
		},
		_hideFixed : function(index,showOne){
			var _this = this, i = 0;
			for(i;i<_this.length;i++){
				(i === index && showOne)?
				_this.cloneObj[i].style.display = 'block':
				_this.cloneObj[i].style.display = 'none';
			}
		},
		_getCurrent : function (dis){
			var _this = this, newArray;
			newArray = _this.topY.slice();
			newArray.push(dis);
			newArray.sort(function(a,b){return a-b});
			return newArray.indexOf(dis)-1;
		},
		_pageX:function(elem){
			//获取距离左侧的距离
			return elem.offsetParent?(elem.offsetLeft+this._pageX(elem.offsetParent)):elem.offsetLeft;
		},
		_pageY:function(elem){
			//获取距离顶部的距离
			return elem.offsetParent?(elem.offsetTop+this._pageY(elem.offsetParent)):elem.offsetTop;
		}
	};
	window.JNav = Nav;
})();