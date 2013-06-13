(function(){
	var JScroll = function(params){
		var _this = this;
		if(!(_this instanceof JScroll)) {
			return new JScroll(params);
		};
		_this.params = params || {};
		_this.wrap = _this.params.wrap || document.getElementById('wrap');
		_this.touch = JTouch(_this.wrap);
		_this.eachHeight = 200;//鼠标滚轮一次的长度
		_this.init();
		window.onresize = function () {
			_this.init();
		};
	};
	JScroll.prototype={
		init : function () {
			var _this = this;
			
			_this.isAnimate = false;//判断是否有动画
			_this.tapActive = false; //单击事件是否激活
			_this.handleHash = {}; //事件绑定的哈希表
			_this.disTop = (_this.disTop &&  _this.disTop != 0)?_this.disTop:0; //滚动的距离，变化值
			
			_this.resultTop = 0;//开始或者结束的时候的距离，只在开始结束时改变
			
			/*
				bodyHeight （窗口高度） - wrapHeight (外围容器高度)  = limitHeight (底部临界值)
			*/
			_this.bodyHeight = Math.max(document.body.offsetHeight,document.body.clientHeight);
			_this.wrapHeight = _this.wrap.scrollHeight;
			_this.limitHeight =  _this.bodyHeight-_this.wrapHeight;//限制的滚动距离
			
			_this.wrap.style.height = _this.wrap.scrollHeight +'px';
			
			if(_this.params.initFn){
				_this.params.initFn(_this); //返回该实例化对象
			}
			
			/*
				Touch事件的处理
			*/
			
			_this.touch.on('start',function(){
				_this.tapActive = true;
				_this.stop();
				if(!_this._limit()){
					_this.resultTop = _this.disTop;
				};
			}).on('tap',function(evt,data){
				var target, ret;
				if(_this.tapActive && _this.params.tapFn){
					target = evt.target || evt.srcElement;
					target = Common.getParent(target,'li');
					
					if(target && target.className != 'cateName'){
						ret = target.getElementsByTagName('a')[0].getAttribute('href');
						_this.params.tapFn(ret,target);
					};
				}
			}).on('swipe',function(evt,data){
				if(data['direction'] === 'up' || data['direction'] === 'down'){
					_this.move(data['y']);
					if(data['status'] == 'end'){
						_this.end();
					};
				}else{
					var target = evt.target || evt.srcElement;
					target = Common.getParent(target,'li');
					
					if(target && target.className != 'cateName'){
						_this.target = target;
						Common.css(target,{
							'WebkitTransform' : 'translate3d('+data['x']+'px,0,0)',
							'WebkitTransitionDuration' : '0ms',
							'WebkitTransitionTimingFunction':'linear'
						});
						if(data['status'] == 'end'){
							Common.css(target,{
							'WebkitTransform' : 'translate3d(0,0,0)',
							'WebkitTransitionDuration' : '100ms',
							'WebkitTransitionTimingFunction':'linear'
							});
							_this.target = null;
						};
					};
					
				}
			}).on('mousewheel',function(evt,data){
				var dis;
				if(!_this._limit()){
					_this.resultTop = _this.disTop;
				};
				if(data['direction'] === 'up'){
					if (_this.resultTop === 0){
						return false;
					}else if(_this.resultTop + _this.eachHeight > 0){
						dis = -_this.resultTop;
					}else {
						dis = _this.eachHeight;
					}
				}else{
					if (_this.resultTop === _this.limitHeight){
						return false;
					}else if(_this.resultTop - _this.eachHeight < _this.limitHeight){
						dis = _this.limitHeight - _this.resultTop;
					}else {
						dis = -_this.eachHeight;
					}
				};
				
				_this.run(dis,100);
			}).on('flick',function(evt,data){
				if(data['direction'] === 'up' || data['direction'] === 'down'){
					var dis,time = data['time']*5;
					if(_this.disTop < _this.limitHeight || _this.disTop > 0){
						return false;
					};
					dis = (data['direction'] === 'up')?-data['speed']*500 : data['speed']*500;
					_this.run(dis,time);
				};
			}).on('end',function(){
				_this.end();
				
				if(_this.target){
					Common.css(_this.target,{
					'WebkitTransform' : 'translate3d(0,0,0)',
					'WebkitTransitionDuration' : '100ms',
					'WebkitTransitionTimingFunction':'linear'
					});
					_this.target = null;
				}
				
			});
		},
		move : function (dis) {
			var _this = this, result = _this.resultTop + dis;
			_this.translate(result); //开始移动
			_this.disTop = result;
			_this._moveFn(); //滚动的时候，回调使用
		},
		run : function (dis,time) {
			var _this, result, t, b, c, d;
			_this = this;
			if(_this.isAnimate){
				return false;
			};
			result = _this.resultTop + dis;
			if(result >= 200){
				result = 200;
				dis = result - _this.resultTop;
			}else if(result <= _this.limitHeight - 200){
				result = _this.limitHeight - 200;
				dis = result - _this.resultTop;
			};
			
			t = 0;
			b = _this.resultTop;
			c = dis;
			d = parseInt(time/5,10);
			_this.translate(result,time); //开始移动
			function Run(){
				_this.isAnimate = true;
				_this.disTop = Math.ceil(_this._linear(t,b,c,d));
				if(t<d){
					t++;
					_this.timer = setTimeout(Run,5);
					_this._moveFn(); //滚动的时候，回调使用
				}else{
					_this.isAnimate = false;
					_this.disTop = result;
					_this.end();
				};
			};
			Run();
		},
		translate : function (dis,time) {
			var _this = this, dis = parseInt(dis,10), time;
			time = time?parseInt(time,10):0;
			if(Common.isWebkit()){
				Common.css(_this.wrap,{
					'WebkitTransform' : 'translate3d(0,'+dis+'px,0)',
					'WebkitTransitionDuration' : time+'ms',
					'WebkitTransitionTimingFunction':'linear'
				});
			}else{
				Common.css(_this.wrap,{
					'transform' : 'translate(0,'+dis+'px)',
					'transitionDuration' : time+'ms',
					'transitionTimingFunction':'linear'
				});
			}
		},
		stop : function () {
			var _this = this;
			if(_this.isAnimate){
				_this.tapActive = false;
				clearTimeout(_this.timer);
				_this.isAnimate = false;
				_this.translate(_this.disTop);
				_this.end();
			};
		},
		end : function () {
			var _this = this, time;
			if(_this._limit()){
				time = Math.min(Math.abs(_this.disTop),Math.abs(_this.limitHeight-_this.disTop));
				time = time < 300 ? time : 300;
				_this.translate(_this.resultTop,time); //到达边界，反弹效果
			}else{
				_this.resultTop = _this.disTop;
			}
			_this._endFn(); //结束的时候回调使用
		},
		_moveFn : function () {
			var _this = this;
			if(_this.params.moveFn){
				//移动过程中有回调函数
				_this.params.moveFn(_this);
			};
		},
		_endFn : function () {
			var _this = this;
			if(_this.params.endFn){
				//移动过程中有回调函数
				_this.params.endFn(_this);
			};
		},
		_limit : function () {
			var _this = this;
			if(_this.disTop < _this.limitHeight){
				_this.resultTop = _this.limitHeight;
				return true;
			}else if(_this.disTop > 0){
				_this.resultTop = 0;
				return true;
			}else {
				return false;
			}
		},
		_linear : function(t,b,c,d){
			return c*t/d + b;
		}
	};
	window.JScroll = JScroll;
})();