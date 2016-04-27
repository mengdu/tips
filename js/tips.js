/**
*  tips.js
*  小贴士
*  @author lanyue
*  @time 2016-04-19
***/
;(function(window){
	function tipsfn(options){
		//默认配置
		var defaultOption={
			type:"default",					//默认类型
			autohidden:true,				//自动隐藏
			showtime:'3000',				//信息显示时间
			position:'bottom-center',		//显示位置top-left top-center top-right bottom-left bottom-center bottom-right center-center
			css:{
				'z-index':1000
			}
		}
		function toFirstUpper(str){
			return str.replace(/\b(\w)|\s(\w)/g,function(m){
	    		return m.toUpperCase(m);
	    	});
		}
		var css=function(key,value){
	    	if(typeof key == 'undefined'){
	    		return this.style;
	    	}
	    	if(typeof key == "string" && typeof value == "undefined"){
	    		//console.log("获取一个css属性");
	    		return this.style[tokey(key)];
	    		//return getComputedStyle(this).getPropertyValue([tokey(key)]);//存在延迟问题，造成信息漏掉
	    	}
	    	if(typeof key == "object" && typeof value == "undefined"){
	    		//console.log("设置多个css属性");
	    		for(var k in key){
	    			this.style[tokey(k)]=key[k];
	    		}
	    		return;
	    	}
	    	//console.log("设置一个css属性");
	    	this.style[tokey(key)]=value;
	    	//获取键
	    	function tokey(key){
	    		var k=key.toLowerCase().split('-');
		    	var kstr=k[0];
		    	for(var i=1;i<k.length;i++){
		    		kstr+=""+toFirstUpper(k[i]);
		    	}
		    	return kstr;
	    	}
	    	return ;
	    }
	    var on=function(target,eventstr,callback){
			//console.log(typeof target);
			if(typeof target !== "object"){
				return;
			}
			if(document.all){
				target.attachEvent("on"+eventstr,callback);
			}else{
				target.addEventListener(eventstr,callback,false);
			}
		}
		var tips=function(options){
			var that=this;
			this.options={};//存配置
			if(options){
				for (var k in defaultOption) {
					if(typeof options[k] == "undefined"){
						//未定义时取默认值
						this.options[k]=defaultOption[k];
					}else{
						if(k=="css"){
							this.options[k]=merge(defaultOption[k],options[k]);
						}else{
							this.options[k]=options[k];
						}
					}
				}

			}else{
				this.options=defaultOption;
			}
			//console.log(this.options);
			//合并两个json对象
			function merge(json1,json2){
				for(var key in json2){
					if(typeof json2[key] == "object"){
						json1[key]=merge(json1[key],json2[key]);
					}else{
						json1[key]=json2[key];
					}

				}
				return json1;
			}
			_init(this.options);
			//初始化标签
			function _init(options){
				//top-left top-center top-right bottom-left bottom-center bottom-right
				that.tips_box=document.createElement("div");
				that.tips_box.setAttribute("class","tips-box");
				that.tips_box.setAttribute("id","tips-"+Math.random());
				that.tips_box.css=css;
				if(that.options['position'] != "center-center"){
					//如果是center-center css不设置在tips_box
					that.tips_box.css(that.options['css']);
				}

				//console.log(that.options);
				that.tips_box.css({
					'position':'fixed',
					'right':0,
					'left':0,
					'opacity':0
				});
				that.tips_bg=document.createElement("div");
				that.tips_bg.setAttribute("id","tips-bg tips-"+options['type']);
				that.tips_box.appendChild(that.tips_bg);
				that.tips_bg.css=css;
				switch(that.options['position']){
					case 'top-left':
						that.tips_box.css({left:0,right:"",bottom:"",top:"0"});
						break;
					case 'top-center':
						that.tips_box.css({left:0,right:0,bottom:"",top:"0"});
						break;
					case 'top-right':
						that.tips_box.css({left:"",right:0,bottom:"",top:"0"});
						break;
					case 'bottom-left':
						that.tips_box.css({left:"0",right:"",bottom:"0",top:""});
						break;
					case 'bottom-center':
						that.tips_box.css({left:0,right:0,bottom:"0",top:""});
						break;
					case 'bottom-right':
						that.tips_box.css({left:"",right:0,bottom:"0",top:""});
						break;
					case 'center-center':
						that.tips_box.css({
							width:"100%",height:"100%",position:"fixed",top:0,left:0
						});
						that.tips_box.css("z-index",that.options['css']['z-index']);//层级和tips_bg一起设置
						that.tips_bg.css(that.options['css']);
						that.tips_box.setAttribute("class","tips-box align-items-center justify-content-center");
						break;
				}


				that.tips_icon=document.createElement("span");
				that.tips_icon.setAttribute("class","tips-icon");
				that.tips_bg.appendChild(that.tips_icon);

				that.tips_centent=document.createElement("span");
				that.tips_centent.setAttribute("class","tips-centent");
				that.tips_bg.appendChild(that.tips_centent);

				that.tips_close=document.createElement("span");
				that.tips_close.setAttribute("class","tips-close");
				that.tips_close.innerText="×";
				that.tips_bg.appendChild(that.tips_close);

				document.body.appendChild(that.tips_box);
			}
			on(this.tips_box,'webkitTransitionEnd',function(e){
				//console.log("webkitTransitionEnd");
				transitionend();
			});
			on(this.tips_box,'mozTransitionEnd',function(e){
				//console.log("mozTransitionEnd");
				transitionend();
			});
			on(this.tips_box,'oTransitionEnd',function(e){
				//console.log("oTransitionEnd");
				transitionend();
			});
			//监听动画结束
			on(this.tips_box,'transitionend',function(e){
				transitionend();
			});
			function transitionend(){
				//通过判断opacity来判断是否隐藏
				if(that.data.length > 0 && that.tips_box.css('opacity')=='0'){
					//console.log(that.data.length,"隐藏");
					//隐藏完则显示下一条信息
					that.isshow=false;
					that.show();
				}else if(that.data.length == 0 && that.tips_box.css('opacity')=='0'){
					var position=that['options']['position'].toLowerCase().split('-');
					if(position[0] == "center"){
						//如果对于center-center类型的需要结束时隐藏
						that.tips_box.css({
							//'display':"none"//display会原来的弹性盒子改变排版
							'visibility':"hidden"
						});
					}
					//列队信息显示完后，把状态设置为false
					that.isshow=false;
				}
			}
			on(this.tips_close,'click',function(event){
				//console.log(event);
				var position=that['options']['position'].toLowerCase().split('-');
				var margin=parseInt(that.tips_box.css('margin-top'))+parseInt(that.tips_box.css('margin-bottom'));
				if(!margin){
					margin=0;
				}
				//console.log("margin:",margin);
				if(position[0] == "top"){
					that.tips_box.css({
						'opacity':0,
						'top':-(that.tips_box.offsetHeight+margin)+"px"
					});
				}else if(position[0] == "bottom"){
					//隐藏
					that.tips_box.css({
						'opacity':0,
						'bottom':-(that.tips_box.offsetHeight+margin)+"px"
					});
				}else if(position[0] == "center"){
					that.tips_box.css({
						'opacity':0
					});
				}
				return false;
			});
		}
		tips.fn=tips.prototype;
		tips.fn.data=[];
		tips.fn.isshow=false;
		tips.fn.setTimeout=null;
		tips.fn.send=function(data,type){
			if(typeof type == "undefined"){
				type=this.options['type'];//取默认显示类型
			}
			//信息列队
			this.data.unshift({data:data||"null",type:type});
			//console.log(this.data);
			this.show();
		}
		tips.fn.show=function(){
			var that=this;//传递this变量
			if(this.isshow==true){
				//console.log("正在显示",this.data.length);
				//如果正在显示则等待
				return;
			}
			//console.log(this.data);
			//设置状态
			this.isshow=true;
			var data=this.data.pop();
			//console.log('显示',data);
			this.tips_centent.innerHTML=data['data'];
			this.tips_bg.setAttribute("class","tips-bg tips-"+data['type']);
			var position=this['options']['position'].toLowerCase().split('-');
			if(position[0] == "top"){
				this.tips_box.css({
					'top':0,
					'opacity':1
				});
			}else if(position[0] == "bottom"){
				this.tips_box.css({
					'bottom':0,
					'opacity':1
				});
			}else if(position[0] == "center"){
				this.tips_box.css({
					'opacity':1,
				 	'visibility':"visible"
				});
			}
			if(this.options['autohidden']){
				that.setTimeout=clearTimeout(that.setTimeout);//防止触发多次
				that.setTimeout=setTimeout(function(){
					//console.log("开始隐藏",that.data.length);
					_hidden();
				},that.options['showtime']);
			}
			function _hidden(){
				var margin=parseInt(that.tips_box.css('margin-top'))+parseInt(that.tips_box.css('margin-bottom'));
				if(!margin){
					margin=0;
				}
				if(position[0] == "top"){
					that.tips_box.css({
						'opacity':0,
						'top':-(that.tips_box.offsetHeight+margin)+"px"
					});
				}else if(position[0] == "bottom"){
					that.tips_box.css({
						'opacity':0,
						'bottom':-(that.tips_box.offsetHeight+margin)+"px"
					});
				}else if(position[0] == "center"){
					that.tips_box.css({
						'opacity':0,

					});
				}

			}
		}

		return new tips(options);
	}




	if(typeof define === "function"){
    	// 如果define已被定义，模块化代码(CMD规范适用)
		define(function(){
			return tipsfn;
		});
    }else{
			window.tips=tipsfn;
    }
})(window);
