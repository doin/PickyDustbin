_package("pickydustbin1.page");

_import("caf.ui.Page");
_import("caf.mui.ScrollView");

/**
 * 主页面类
 */
_class("HomePage", Page, function(){
	this._init = function(){
		_super._init.call(this);
        this._scrollview = null; 
	};
	this.create = function(parent){
		var obj = this.createTplElement(parent, this._tpl);
		this.init(obj);
		return obj;
	};
	this.reset = function(params){
    	_super.reset.apply(this, arguments);
		runtime.log("[HomePage::reset]页面重置");
		this.start();
	};
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
		//------------------重置测试参数
		/*for(var i=1; i<=countLevel; i++){
			window.localStorage.setItem("bestScore" + i, 5);
		}*/
		//window.localStorage.setItem("bestScore4", 0);
		//window.localStorage.setItem("bestScore5", 0);
		///------------------------------------------------------------
		this._scrollview = new ScrollView();
    	this._scrollview.bind($E("list-scroller"), {
        	"parent": this,
        	"id"    : "scroll1"
    	});
    	this.addListener(this._scrollview, "scrollEnd", this._scrollview, "onDefaultScrollEnd");

    	//demo code
    	this.addListener(this._scrollview, "scrollEnd", null, function(){
      		document.querySelector(".scroller").style.top;
      		//console.log(this);
    	})
    	//加载进度
    	$("#loader img").load(function() {
    		//console.log("sum = ", $(this));
    		imgSum++;
    		if(imgSum >= 15){
    			$("#loader").fadeOut();
				_this.setimg("res/images/laji_green_1.png");
				_this.setimg("res/images/laji_green_2.png");
				_this.setimg("res/images/green1.png");
				_this.setimg("res/images/green2.png");
				_this.setimg("res/images/green3.png");
				_this.setimg("res/images/green4.png");
    			_this.setimg("res/images/green5.png");
    			_this.setimg("res/images/green6.png");
				_this.setimg("res/images/green7.png");
				_this.setimg("res/images/green8.png");
				_this.setimg("res/images/laji_red_1.png");
				_this.setimg("res/images/laji_red_2.png");
				_this.setimg("res/images/red1.png");
    			_this.setimg("res/images/red2.png");
    			_this.setimg("res/images/red3.png");
				_this.setimg("res/images/red4.png");
				_this.setimg("res/images/red5.png");
				_this.setimg("res/images/red6.png");
				_this.setimg("res/images/laji_yellow_1.png");
				_this.setimg("res/images/laji_yellow_2.png");
				_this.setimg("res/images/yellow1.png");
				_this.setimg("res/images/yellow2.png");
    			_this.setimg("res/images/yellow3.png");
    			_this.setimg("res/images/yellow4.png");
				_this.setimg("res/images/yellow5.png");
				_this.setimg("res/images/laji_blue_1.png");
				_this.setimg("res/images/laji_blue_2.png");
				_this.setimg("res/images/blue1.png");
				_this.setimg("res/images/blue2.png");
				_this.setimg("res/images/blue3.png");
    			_this.setimg("res/images/blue4.png");
    			_this.setimg("res/images/blue5.png");
				_this.setimg("res/images/blue6.png");
				_this.setimg("res/images/blue7.png");
				_this.setimg("res/images/blue8.png");
				_this.setimg("res/images/blue9.png");
				_this.setimg("res/images/blue10.png");
				_this.setimg("res/images/blue11.png");
    			_this.setimg("res/images/blue12.png");
    			_this.setimg("res/images/blue1.png");
				_this.setimg("res/images/back1.jpg");
				_this.setimg("res/images/back2.jpg");
				_this.setimg("res/images/back3.jpg");
				_this.setimg("res/images/back4.jpg");
				_this.setimg("res/images/back5.jpg");
    		}
    	}).error(function(){
       		//alert("404错误,图片文件不存在");
      		//console.log("404错误,图片文件不存在");
      	}); 
    };
	this.setimg = function(url) {
		var img = new Image();
		$(img).load(function() {
			$(this).hide();
		})
		.error(function() {
			//console.log("img error", url);
		})
		.attr("src", url);
		//console.log(url);
	}
	this.dispose = function(){
		_super.dispose.apply(this);
		
		this._scrollview.dispose();
        this._scrollview = null;
	};
	this.do_level1 = function(act, sender){
		//当前关数
		window.localStorage.setItem("curPass", 1);
		//console.log("test");
		
		this._app.navPage('test');
	};
	this.do_level2 = function(act, sender){
		//当前关数
		var _pass = parseInt(window.localStorage.getItem("pass"));
		if(_pass >= 2){
			window.localStorage.setItem("curPass", 2);
			//console.log("level2");
		
			this._app.navPage('test');
		}
	};
	this.do_level3 = function(act, sender){
		//当前关数
		var _pass = parseInt(window.localStorage.getItem("pass"));
		if(_pass >= 3){
			window.localStorage.setItem("curPass", 3);
			//console.log("level3");
		
			this._app.navPage('test');
		}
	};
	this.do_level4 = function(act, sender){
		//当前关数
		var _pass = parseInt(window.localStorage.getItem("pass"));
		if(_pass >= 4){
			window.localStorage.setItem("curPass", 4);
			//console.log("level4");
		
			this._app.navPage('test');
		}
	};
	this.do_level5 = function(act, sender){
		//当前关数
		var _pass = parseInt(window.localStorage.getItem("pass"));
		if(_pass >= 5){
			window.localStorage.setItem("curPass", 5);
			//console.log("level5");
		
			this._app.navPage('test');
		}
	};
	var _this = this;
	var imgSum = 0;
	//------------------------------------------------------------
	var enableLevel = 5; //2关可用
	var countLevel = 5; //总关数
	var passNum = 5;	//通关最 高次数
	var lajiHelp = false;
	this.start = function() {
		//入场动画
		$('.coupon').css('left', -480);
		for(var i=1; i<=countLevel; i++){
			$('.coupon').eq(i-1).delay(300*(i-1)).animate({left: 0}, 300, "easeOutCirc");
			var url = 'url(res/images/suo' + i +'.png) no-repeat';
			$(".coupon .figure").eq(i-1).css("background", url);
		}
		//解锁的关数   pass
		//console.log("pass", parseInt(window.localStorage.getItem("pass")));
		window.localStorage.setItem("pass", 1);
		//6关，最高分  bestScore1 
		for(var i=1; i<=countLevel; i++){
			//初始化参数
			if(window.localStorage.getItem("bestScore" + i) == null) {
				window.localStorage.setItem("bestScore" + i, 0);
				//console.log("aaa",$('.coupon .price').eq(i-1));
			}
			else {
				//设置最高分文本
				//$('.coupon .valid').eq(i-1).text("最高连击：" + window.localStorage.getItem("bestScore" + i) + "次");
				$('.coupon .valid').eq(i-1).text("最高连击：" + window.localStorage.getItem("bestScore" + i));
				//设置PASS   一共解锁了几关
				if(parseInt(window.localStorage.getItem("bestScore" + i)) >= passNum && i<enableLevel){
					var _pass = parseInt(window.localStorage.getItem("pass")) + 1;
					window.localStorage.setItem("pass", _pass);
					//console.log("aaa", _pass)
				} 
			}
			//设置是否已经解锁
			if(i <= parseInt(window.localStorage.getItem("pass"))){
				//console.log($('.coupon .price').eq(i-1));
					//$('.coupon .price').eq(i-1).text("解锁");
					//console.log("aaa", i);
					var url = 'url(res/images/small' + i +'.png) no-repeat';
					$(".coupon .figure").eq(i-1).css("background", url);
			}
		}
		
		$("#helpBtn").unbind("click").click(function() {
   			if(lajiHelp){
   				//$("#home .laji_help").fadeOut();
   				$("#about_panle").css({"top":0, "opacity":1});
   				
   				$("#about_panle").animate({top: -50, opacity:0}, 300, "easeOutCirc",function(){$("#about_panle").css("display","none")});
   				lajiHelp = false;
   			}
   			else {
   				//$("#home .laji_help").fadeIn();
   				$("#about_panle").css({"top":50, "opacity":0,"display":"block"});
   				$("#about_panle").animate({top: 0, opacity:1}, 300, "easeOutCirc");
   				lajiHelp = true;
   			}
   		});
		$("#about_panle").unbind("click").click(function() {
   			$("#about_panle").css({"top":0, "opacity":1});
   				$("#about_panle").animate({top: -50, opacity:0}, 300, "easeOutCirc", function(){$("#about_panle").css("display","none")});
   				lajiHelp = false;
   		});
		
	}
});