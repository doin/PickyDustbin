_package("pickydustbin1.page");

_import("caf.ui.Page");

_class("Test", Page, function(){
	this._init = function(){
		_super._init.call(this);
	};
	this.create = function(parent){
		var obj = this.createTplElement(parent, "test.xml");
		this.init(obj);
		return obj;
	};
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
            //--------------------------------------------------------------------------
		if(logBool)
			//console.log("---> 变量调用测试通过", this);
		//this.initLayout();
		//this.initEvent();
		$("#aaa")[0].addEventListener("touchstart", this.touchStart, false);
		// 注册接收 touchstart 事件
		//$("#aaa")[0].addEventListener("touchmove", this.touchMove, false); // 注册接收 touchmove 事件
        $("#aaa")[0].addEventListener("touchend", this.touchEnd, false);
		// 注册接收 touchend 事件
		//---------------------------------------------------------------------------
        
	};
	this.dispose = function(){
        _super.dispose.apply(this);
	};
    this.reset = function(params) {
    	_super.reset.apply(this, arguments);
		runtime.log("[HomePage::reset]页面重置");

		var _curPass = window.localStorage.getItem("curPass");
		bestScore = window.localStorage.getItem("bestScore" + _curPass);
		console.log(_curPass, bestScore);
		//$('#top2').text("最高连击: " + bestScore + "次");
		
		score = 0;
		$('#game_bestScore').text(score);
		$('#game_score').text(bestScore);
		
		this.initLayout();
		this.initEvent();
		this.initLevel();
		this.setNadu();
        
        CloudAPI.Utility.toast("test")
        window.fx_handleEvent = function(type){
            switch(type){
                case "back":
                //处理返回事件
                CloudAPI.Utility.toast("处理返回事件")
                break;
            }
        };
        window.cap_success = function(result){
            //成功回调
             CloudAPI.Utility.toast("成功回调");
        };
        window.cap_error = function(errorCode){
            //错误回调
           CloudAPI.Utility.toast("错误回调")
        };
             
        var info = {
            "systemFramework"  : "framework_name",
            "version"          : "1.2.3",
            "handleHardwareKey": "fx_handleEvent"
          };
        var applicationManager = JsCloudAPI.init("com.aliyun.cloudapp.api.application.ApplicationManager");
        applicationManager.setApplicationFrameworkCapability(info, "cap_success", "cap_error");
	};
    this.touchStart = function(e) {
		var touch = e.touches[0];
		var x = touch.clientX;
		var y = touch.clientY;
		startMouseX = x;
		startMouseY = y;
		//$("#aaa").text("start");
		$("#aaa").text("start" + touch.clientX + " " + touch.clientY + " " + x + " " + y + " \n" + touch.screenX + " " + touch.screenX);
	}
	this.touchEnd = function(e) {
		var touch = e.changedTouches[0];
		var x = touch.pageX;
		var y = touch.pageY;
		if(clickBool) {
			endMouseX = x;
			endMouseY = y;
			$("#aaa").text("end " + x + " " + y);
			//$('#text').text("mousex:"+endMouseX+'   mouseY:'+endMouseY);
			//判断手势是否可用
			if(startMouseY - endMouseY > 20) {
				rotateTimer = setInterval(function(){
					$("#ball img").rotate(ballRotate);
					ballRotate += 30;
				}, 50);
				
				_this.startGame();
				var _x = startMouseX-endMouseX;
				var _y = startMouseY-endMouseY;
				var _x1 = (ballStartTop-bigY)*_x/_y; //算出球放大后的X坐标 平衡量
		
				var _l = parseInt($('#ball').css('left')) - _x1;
				//if(logBool)console.log("坐标", _x,_y,_x1);
				$('#ball').animate({top: bigY, left: _l, width: bigW, height:bigW}, 500, "easeOutSine", function(){
				//_this.initLayout();
				});
				$('#ball img').animate({width: bigW, height:bigW}, 500, "easeOutSine",  function() {
				//_this.initLayout();
					buzou = 2;  //开始缩小
					$('#target_top').css('display', 'block');
					if(curLevel == 3 || curLevel == 4) {
						$('#target_top1').css('display', 'block');
					}
					if(curLevel == 5) {
						$('#target_top1').css('display', 'block');
						$('#target_top2').css('display', 'block');
					}
					var _x2 = parseInt($('#ball').css('left')) + windSpeed * 50; //算出球缩小后的X坐标 平衡量  1秒移动60*风速
					timeID = setInterval(_this.move, parseInt(FPS));
					$('#ball').animate({top: smallY, left: _x2, width: smailW, height:smailW}, 500, "easeInSine", function(){
					//
					});
					$('#ball img').animate({width: smailW, height:smailW}, 500, "easeInSine", function() {
					//if(curIn){
						clearInterval(timeID);
						var _t = parseInt($('#ball').css('top'));
						var _t1 = parseInt($('#ball').css('top')) - 10;
						//if(logBool)console.log(_t1,_t, "aa");
						$('#ball').css('top', _t1);
						
						//掉地上的动画
						clearInterval(rotateTimer);
						//$('#ball img').rotateAnimation(0);
						$('#ball').animate({top: _t}, 200, "easeInOutBounce", function(){
							setTimeout(function(){
								_this.moveEnd();
							}, 500);
						});
					//}
					});
				});
				}
			}
	}
	this.dispose = function() {
		_super.dispose.apply(this);
		console.log("dispose");
	};
	this.do_home = function(act, sender) {
		this._app.navPage('home');
	};
	//--------------------------------------------游戏程序开始------------------------------------------------------------
	var logBool = true;
	//是否打印输入信息
	var _this = this;
	//
	var stageW = 480;
	//舞台宽
	var stageH = 729 - 74;
	//舞台高
	var targetTop = 390;
	var targetTop1 = 180;
	var targetTop2 = 180;
	//---检测目标坐标TOP	碰撞检测区块
	var targetLeft = 180;
	//---检测目标坐标Left	碰撞检测区块
	var targetLeft1 = 180;
	var targetLeft2 = 180;
	var targetW = 115;
	var targetW1 = 180;
	var targetW2 = 180;
	//---检测目标宽			碰撞检测区块
	var targetH = 35;
	//---检测目标高 			碰撞检测区块
	var FPS = 7;
	//帧频

	var ballStartTop = 560;
	//起使位置
	var ballStartLeft = 200;
	var ballTop = ballStartTop;
	var ballLeft = ballStartLeft;
	var ballStartW = 72;

	var bestScore = 0;
	//最高得分			变化参数
	var score = 0;
	//当前得分			变化参数

	var timeID;
	//定时器
	var ratation = 0;
	//角度
	var windSpeed = 4;
	//风向移动速度
	var speed = 5;
	//Y移动速度
	var clickBool = true;
	//点击事件开关
	var left_right_move = 10;
	//左右移动值

	var bigY = 190;
	//放大的距离 动画
	var bigW = 50;
	//放大的宽度
	var smallY = 480;
	//缩小的距离 动画
	var smailW = 30;
	//缩小的大小

	var lajiArr = [];
	var lajitxtArr = ["厨房垃圾","有害垃圾","其它垃圾","可回收垃圾"];
	var curLevel;

	this.knowBar = function(_laji, _lajitong, _txt) {
		$("#laji img").attr('src', 'res/images/' + _laji + '.png');
		$("#lajitong img").attr('src', 'res/images/' + _lajitong + '_1.png');
		$("#txt").text(_txt);
		$('#jiandou').text(score + " 连击");
		console.log("score 2", score);
		$("#know").css({"display":"block", "opacity":0, "top":350});
		$("#know").animate({top: 300, opacity: 1}, 250);
		setTimeout(function(){
			$("#know").animate({top: 250, opacity: 0}, 300, function() {
				$("#know").css({"display":"none"});
			});
		},1000);
	}
	var _t;
	//配置TOP
	var _w;
	//配置宽
	var lArr;
	//垃圾筒两个配置坐标的数组  左边LEFT
	var wArr;
	var tArr;
	var targetlArr;
	var targettArr;
	var targetwArr;
	
	//目标两个配置坐标的数组
	//初始化关数布局
	this.initLevel = function() {
		lajiArr[0] = ["laji_green", "green1", "green2", "green3", "green4", "green5", "green6", "green7", "green8"];
		lajiArr[1] = ["laji_red", "red1", "red2", "red3", "red4", "red5", "red6"];
		lajiArr[2] = ["laji_yellow", "yellow1", "yellow2", "yellow3", "yellow4", "yellow5"];
		lajiArr[3] = ["laji_blue", "blue1", "blue2", "blue3", "blue4", "blue5", "blue6", "blue7", "blue8", "blue9", "blue10", "blue11", "blue12"];
		curLevel = parseInt(window.localStorage.getItem("curPass"));
		var _curPass = window.localStorage.getItem("curPass");
		//$("#target_bottom").css('display','none');
		//$('#ball img').attr('src', 'res/images/back1.jpg')
		$("#yinying1").css("display","none");
		$("#yinying2").css("display","none");
		$("#yinying3").css("display","none");
		
		switch(_curPass) {
			case '1':
				$("#yinying1").css({"display":"block", "top":496, "left":150});
				leftYes = 35;
				//分成五个区块     左边进   (1 leftNo 2 leftYes 3 -leftYes 4 leftNo 5)
				leftNo = 20;
				//左边没进
				bigY = 230;
				//放大的距离 动画
				bigW = 55;
				//放大的宽度
				smallY = 480;
				//缩小的距离 动画
				smailW = 30;
				//背景图片
				$("#game").css("background", 'url(res/images/back1.jpg) no-repeat');
				//--------------垃圾筒位置
				top1 = 400;
				left1 = 190;
				w1 = 103;

				//--------------目标方块和目标位置
				targetTop = 415;
				//---检测目标坐标TOP	碰撞检测区块
				targetLeft = 187;
				//---检测目标坐标Left	碰撞检测区块
				targetW = 108;
				//---检测目标宽			碰撞检测区块
				targetH = 20;
				//---检测目标高 			碰撞检测区块\
				//-----------------------------------------------------------------------------------------
				this.radLaji();
				break;
			case '2':
				$("#yinying2").css({"display":"block", "top":430, "left":175});
				leftYes = 20;
				//分成五个区块     左边进   (1 leftNo 2 leftYes 3 -leftYes 4 leftNo 5)
				leftNo = 10;
				//左边没进
				bigY = 180;
				//放大的距离 动画
				bigW = 45;
				//放大的宽度
				smallY = 420;
				//缩小的距离 动画
				smailW = 25;
				//背景图片
				$("#game").css("background", 'url(res/images/back2.jpg) no-repeat');
				//--------------垃圾筒位置
				top1 = 350;
				left1 = 190;
				w1 = 80;

				//--------------目标方块和目标位置
				targetTop = 365;
				//---检测目标坐标TOP	碰撞检测区块
				targetLeft = 187;
				//---检测目标坐标Left	碰撞检测区块
				targetW = 86;
				//---检测目标宽			碰撞检测区块
				targetH = 20;
				//---检测目标高 			碰撞检测区块\
				//-----------------------------------------------------------------------------------------
				this.radLaji();
				break;
			case '3':
				$("#yinying1").css({"display":"block", "top":432, "left":220});
				$("#yinying2").css({"display":"block", "top":408, "left":88});
				leftYes = 30;
				//分成五个区块     左边进   (1 leftNo 2 leftYes 3 -leftYes 4 leftNo 5)
				leftNo = 15;
				//左边没进
				bigY = 180;
				//放大的距离 动画
				bigW = 45;
				//放大的宽度
				smallY = 408;
				//缩小的距离 动画
				smailW = 20;
				//背景图片
				$("#game").css("background", 'url(res/images/back3.jpg) no-repeat');
				//--------------垃圾筒位置
				tArr = [333, 333];
				wArr = [80, 103];
				lArr = [100, 250];
				targetlArr = [100, 250]
				//--------------目标方块和目标位置
				//targetTop = 360;
				targettArr = [340, 348];
				//---检测目标坐标TOP	碰撞检测区块
				//targetW = 103;
				targetwArr = [80, 103];
				//---检测目标宽			碰撞检测区块
				targetH = 20;
				//---检测目标高 			碰撞检测区块
				//-----------------------------------------------------------------------------------------
				this.radLaji();
				break;
			case '4':
				$("#yinying1").css({"display":"block", "top":435, "left":85});
				$("#yinying2").css({"display":"block", "top":415, "left":250});
				leftYes = 30;
				//分成五个区块     左边进   (1 leftNo 2 leftYes 3 -leftYes 4 leftNo 5)
				leftNo = 15;
				//左边没进
				bigY = 180;
				//放大的距离 动画
				bigW = 45;
				//放大的宽度
				smallY = 408;
				//缩小的距离 动画
				smailW = 20;
				//背景图片
				$("#game").css("background", 'url(res/images/back4.jpg) no-repeat');
				//--------------垃圾筒位置
				tArr = [333, 333];
				wArr = [80, 103];
				lArr = [270, 120];
				targetlArr = [270, 120]
				//--------------目标方块和目标位置
				//targetTop = 360;
				targettArr = [348, 348];
				//---检测目标坐标TOP	碰撞检测区块
				//targetW = 103;
				targetwArr = [80, 103];
				//---检测目标宽			碰撞检测区块
				targetH = 20;
				//---检测目标高 			碰撞检测区块
				//-----------------------------------------------------------------------------------------
				this.radLaji();
				break;
			case '5':
				$("#yinying1").css({"display":"block", "top":400, "left":60});
				$("#yinying2").css({"display":"block", "top":327, "left":210});
				$("#yinying3").css({"display":"block", "top":335, "left":318});
				leftYes = 35;
				//分成五个区块     左边进   (1 leftNo 2 leftYes 3 -leftYes 4 leftNo 5)
				leftNo = 20;
				//左边没进
				bigY = 100;
				//放大的距离 动画
				bigW = 40;
				//放大的宽度
				smallY = 330;
				//缩小的距离 动画
				smailW = 20;
				//背景图片
				$("#game").css("background", 'url(res/images/back5.jpg) no-repeat');
				//--------------垃圾筒位置
				tArr = [300, 250, 260];
				wArr = [103, 80, 80];
				lArr = [100, 220, 330];
				targetlArr = [100, 220, 330];
				//--------------目标方块和目标位置
				targettArr = [315, 265, 275];
				//---检测目标坐标TOP	碰撞检测区块
				targetwArr = [103, 80, 80];
				targetH = 20;
				//---检测目标高 			碰撞检测区块
				//-----------------------------------------------------------------------------------------
				this.radLaji();
				break;
		}

		$('#tooltip_best').css('top', targetTop - 230);
		$('#tooltip_lock').css('top', 75);
		
		$("#game").css("display", 'none');
		$("#game").fadeIn("slow");
	}
	//初始化界面布局
	this.initLayout = function() {
		$('#target').css('top', targetTop);
		$('#target').css('left', targetLeft);
		$('#target_bottom1').css("display", "none");
		$('#target_bottom2').css("display", "none");
		$('#target_top1').css("display", "none");
		$('#target_top2').css("display", "none");
		$('#target1').css("display", "none");
		$('#target2').css("display", "none");

		$('#ball').css('top', ballStartTop);
		$('#ball').css('left', ballStartLeft);
		$('#ball').css('width', '75px');
		$('#ball').css('height', '75px');
		$('#ball img').css('width', '75px');
		$('#ball img').css('height', '75px');

		$('#game').css('background', 'url(res/images/back1.jpg) no-repeat');
		//$('#fist').css("display", "none");

		windSpeed = this.getRadWind();
		if(logBool)
			console.log("---> 布局完成");
	}
	//var startMouseX = ballStartTop + 73 - ballStartW/2;
	//var startMouseY = ballStartLeft - ballStartW/2;;
	var startMouseX = 660;
	var startMouseY = 705;
	//var startMouseX = 230;
	//var startMouseY = 660;
	var endMouseX
	var endMouseY;
	//初化如事件
	var rotateTimer;//旋转角度定时器
	var ballRotate = 0;//垃圾角度
	this.initEvent = function() {
		$('#shoot').click(function(event) {
		//if(logBool)console.log(event.clientX, event.clientY, event.pageX, event.pageY);
		if(clickBool) {
			endMouseX = event.clientX;
			endMouseY = event.clientY;
			//$('#text').text("mousex:"+endMouseX+'   mouseY:'+endMouseY);
			//判断手势是否可用
			if(startMouseY - endMouseY > 10) {
				rotateTimer = setInterval(function(){
					$("#ball img").rotate(ballRotate);
					ballRotate += 30;
				}, 50);
				
				_this.startGame();
				var _x = startMouseX-endMouseX;
				var _y = startMouseY-endMouseY;
				var _x1 = (ballStartTop-bigY)*_x/_y; //算出球放大后的X坐标 平衡量
		
				var _l = parseInt($('#ball').css('left')) - _x1;
				//if(logBool)console.log("坐标", _x,_y,_x1);
				$('#ball').animate({top: bigY, left: _l, width: bigW, height:bigW}, 500, "easeOutSine", function(){
				//_this.initLayout();
				});
				$('#ball img').animate({width: bigW, height:bigW}, 500, "easeOutSine",  function() {
				//_this.initLayout();
					buzou = 2;  //开始缩小
					$('#target_top').css('display', 'block');
					if(curLevel == 3 || curLevel == 4) {
						$('#target_top1').css('display', 'block');
					}
					if(curLevel == 5) {
						$('#target_top1').css('display', 'block');
						$('#target_top2').css('display', 'block');
					}
					var _x2 = parseInt($('#ball').css('left')) + windSpeed * 50; //算出球缩小后的X坐标 平衡量  1秒移动60*风速
					timeID = setInterval(_this.move, parseInt(FPS));
					$('#ball').animate({top: smallY, left: _x2, width: smailW, height:smailW}, 500, "easeInSine", function(){
					//
					});
					$('#ball img').animate({width: smailW, height:smailW}, 500, "easeInSine", function() {
					//if(curIn){
						clearInterval(timeID);
						var _t = parseInt($('#ball').css('top'));
						var _t1 = parseInt($('#ball').css('top')) - 10;
						//if(logBool)console.log(_t1,_t, "aa");
						$('#ball').css('top', _t1);
						
						//掉地上的动画
						clearInterval(rotateTimer);
						//$('#ball img').rotateAnimation(0);
						$('#ball').animate({top: _t}, 200, "easeInOutBounce", function(){
							setTimeout(function(){
								_this.moveEnd();
							},500);
						});
					//}
					});
				});
				}
			}
		});
		//$("#target_top").unbind("click").click(function() {
	}
	var tempTimer;
	this.downlaji = function(_t) {
		$('#ball img').rotate(45);
		$('#ball').animate({top: _t}, 200, "easeInOutBounce", function(){
			setTimeout(function(){
				_this.moveEnd();
			},500);
		});
	}
	//
	var lajiHelp = false;
	var buzou = 1;
	//动画步骤标示
	var curIn = false  //当前是否进了
	var isConter = false //是否是中间的
	this.move = function() {
		//向下缩小移动
		var _top_new = parseInt($('#ball').css('left'));
		var _left_new = parseInt($('#ball').css('top'));
		var _width_new = parseInt($('#ball').css('width'));
		//if(logBool)console.log(_top_new, _left_new, _width_new);

		if(_this.hitTest((parseInt(_top_new) + parseInt(_width_new) / 2), parseInt(_left_new) + parseInt(_width_new) / 2)) {
			curIn = true;
			$('#ball').stop();
			$('#ball img').stop();
			//进了
			score = parseInt(score) + 1;
			//console.log("score 1", score);
			if(bestScore < 5 && score >= 5){
				setTimeout(function() {$('#tooltip_lock').fadeIn(500);
				});
				setTimeout(function() {$('#tooltip_lock').fadeOut(1000);
				}, 5000);	
			}
			if(score > bestScore) {
				//刷新最新分了
				bestScore = score;
				var curPass = window.localStorage.getItem("curPass");
				window.localStorage.setItem("bestScore" + curPass, bestScore);
				//破纪录动画
					$('#game_score').text(bestScore);
					$('#game_score').css("font-size", 50);
					//setTimeout(function(){$('#game_score').css("font-size", 35);}, 300)
				setTimeout(function() {$('#tooltip_best').fadeIn(300);
				}, 300);
				setTimeout(function() {$('#tooltip_best').fadeOut(300);
				}, 800);
			}
			clearInterval(timeID);
			if(logBool)
				//console.log("进了", isConter);
			if(isConter) {
				$('#ball').animate({
					top : smallY
				}, 200, function() {
					_this.knowBar(lajiArr[lajitong][_laji], lajiArr[lajitong][0], lajitxtArr[lajitong]);
					_this.moveEnd();
				});
			}
			return;
		} else {
			//没进
			//$('#tooltip').text("真遗憾！");
			//if(logBool)console.log("没进");
			curIn = false;

			//score = 0;
		}
	}
	//随机函数
	this.rad = function(_minNum, _maxNum) {
		var _rad = Math.floor(Math.random() * ( _maxNum - _minNum + 1) + _minNum);
		return _rad;
	}
	//获取随机风向值
	this.getRadWind = function() {
		var _minNum = -4;
		var _maxNum = 4;
		var _wind = Math.random() * ( _maxNum - _minNum + 1) + _minNum;
		if(_wind < 0) {
			$('#wind').text("风向 <<<" + String(_wind).substr(1, 4));
		} else {
			$('#wind').text("风向 >>>" + String(_wind).substr(0, 3));
		}
		return _wind;
		//return 0.1;
		//windSpeed = Math.random() * (_maxNum - _minNum + 1) + _minNum;
	}
	//点击小球 开始计算移动
	this.startGame = function() {
		if(logBool)
			//console.log("startGame");
		clickBool = false;
		buzou = 1;
		curIn = false;
		isConter = false;
		$('#target_top').css('display', 'none');
		$('#target_top1').css('display', 'none');
		$('#target_top2').css('display', 'none');
	}
	//垃圾筒，打到边时的动画效果
	this.lajitongAnimate = function() {
		$("#target_bottom img").rotate({angle:0, animateTo:5, duration:50, callback:function(){
			$("#target_bottom img").rotate({angle:5, animateTo:-5, duration:100, callback:function(){
				$("#target_bottom img").rotate({angle:-5, animateTo:0, duration:50, callback:function(){
					$("#target_bottom img").rotate(0);
				}});
			}});
		}});
		$("#target_top img").rotate({angle:0, animateTo:5, duration:50, callback:function(){
			$("#target_top img").rotate({angle:5, animateTo:-5, duration:100, callback:function(){
				$("#target_top img").rotate({angle:-5, animateTo:0, duration:50, callback:function(){
					$("#target_top img").rotate(0);
				}});
			}});
		}});
	}
	//进球检测
	var leftNo = 20   //左没进区间   分成五个区
	var leftYes = 35 //左进区间
	this.hitTest = function(_y, _x) {
		//if(logBool)console.log(" ",_x, "   ", _y);
		//if(logBool)console.log(targetTop, targetH + targetTop,  targetLeft, targetW + targetLeft );
		//检测是否在矩形框内
		if(_x > targetTop && _x < targetH + targetTop && _y > targetLeft && _y < targetW + targetLeft) {
			//$("#target_bottom img").rotate({angle:0, animateTo:10});
			//中间进去，垃圾筒不动
			//if(!(_y > targetLeft + leftYes && _y < targetW + targetLeft - leftYes)) {
				this.lajitongAnimate();
			//}
			//左边没进动画
			if(logBool)
				//console.log(_y, targetLeft + 5, targetLeft + 15, targetW + targetLeft - 15, targetW + targetLeft - 5);
			if(_y < targetLeft + leftNo) {
				$('#ball').stop();
				$('#ball img').stop();
				
				if(logBool)
					console.log("左边没进动画");
				clearInterval(timeID);
				var _t =  parseInt($('#ball').css('top')) - 50;
				var _l =  parseInt($('#ball').css('left')) - 30;
				//掉地上的动画
				$('#ball').animate({top : _t,left : _l}, 200, "easeOutCirc", function() {
					_l =  parseInt($('#ball').css('left')) - 10;
					$('#ball').animate({
						top : smallY,
						left : _l
					}, 300, "easeOutBounce", function() {
						$('#ball img').rotate(45);
						clearInterval(rotateTimer);
						setTimeout(function() {
							_this.moveEnd();
						}, 500);
					});
				});
				return false;
			}
			//左边进了动画
			if(_y >= targetLeft + leftNo && _y <= targetLeft + leftYes) {
				if(logBool)
					console.log("左边进了动画");
					//console.log(lajiArr[lajitong][_laji], lajiArr[lajitong][0], lajitxtArr[lajitong])
				//clearInterval(timeID);
				var _t =  parseInt($('#ball').css('top')) - 50;
				var _l = parseInt($('#ball').css('left')) + 15;
				$('#ball').animate({
					top : _t,
					left : _l
				}, 200, "easeOutCirc", function() {
					$('#ball').animate({
						top : smallY
					}, 200, function() {
						_this.knowBar(lajiArr[lajitong][_laji], lajiArr[lajitong][0], lajitxtArr[lajitong]);
						_this.moveEnd();
					});
				});
				return true;
			}
			//中间进了动画
			if(_y > targetLeft + leftYes && _y < targetW + targetLeft - leftYes) {
				if(logBool)
					console.log("中间进了动画");
					//console.log(lajiArr[lajitong][_laji], lajiArr[lajitong][0], lajitxtArr[lajitong])
					/*setTimeout(function(){
						_this.knowBar(lajiArr[lajitong][_laji], lajiArr[lajitong][0], lajitxtArr[lajitong])
						}, 400);*/
				//_this.moveEnd();
				isConter = true;
				return true;
			}
			//右边进了动画
			if(_y >= targetW + targetLeft - leftYes && _y <= targetW + targetLeft - leftNo) {
				if(logBool)
					console.log("右边进了动画");
					//console.log(lajiArr[lajitong][_laji], lajiArr[lajitong][0], lajitxtArr[lajitong])
				var _t =  parseInt($('#ball').css('top')) - 50;
				var _l =  parseInt($('#ball').css('left')) - 15;

				$('#ball').animate({
					top : _t,
					left : _l
				}, 200, "easeOutCirc", function() {
					$('#ball').animate({
						top : smallY
					}, 200, function() {
						_this.knowBar(lajiArr[lajitong][_laji], lajiArr[lajitong][0], lajitxtArr[lajitong]);
						_this.moveEnd();
					});
				});
				return true;
			}
			//右边没进动画
			if(_y > targetW + targetLeft - leftNo) {
				$('#ball').stop();
				$('#ball img').stop();
				if(logBool)
					console.log("右边没进动画");
				clearInterval(timeID);
				var _t =  parseInt($('#ball').css('top')) - 50;
				var _l = parseInt($('#ball').css('left')) + 30;
				//掉地上的动画
				$('#ball').animate({
					top : _t,
					left : _l
				}, 200, "easeOutCirc", function() {
					_l = parseInt($('#ball').css('left')) + 10;
					$('#ball').animate({
						top : smallY,
						left : _l
					}, 300, "easeOutBounce", function() {
						$('#ball img').rotate(45);
						clearInterval(rotateTimer);
						setTimeout(function() {
							_this.moveEnd();
						}, 500);
					});
				});
				return false;
			}
		} else {
			//0909
			if(_x > targetTop1 && _x < targetH + targetTop1 && _y > targetLeft1 && _y < targetW1 + targetLeft1 && (curLevel == 3 || curLevel == 4 || curLevel == 5)) {
				clearInterval(timeID);
				$('#ball').stop();
				$('#ball img').stop();

				$('#fist').css({
					'top' : targetTop1 + 50,
					'left' : targetLeft1 + 15,
					'display' : 'block'
				});
				$('#fist').animate({
					top : targetTop1 - 40
				}, 100, function() {$('#fist').fadeOut(200)
				});
				$('#ball').animate({
					top : -20,
					left : 500,
					width : 20,
					height : 20
				}, 500, "easeInSine", function() {
					//_this.initLayout();
				});
				$('#ball img').animate({
					width : 20,
					height : 20
				}, 500, "easeInSine", function() {
					_this.moveEnd();
				});
				if(logBool)
					console.log("进错垃圾桶，打回去44");
				//_this.moveEnd();
				return false;
			}
			if(_x > targetTop2 && _x < targetH + targetTop2 && _y > targetLeft2 && _y < targetW2 + targetLeft2 && curLevel == 5) {
				clearInterval(timeID);
				$('#ball').stop();
				$('#ball img').stop();

				$('#fist').css({
					'top' : targetTop2 + 50,
					'left' : targetLeft2 + 15,
					'display' : 'block'
				});
				$('#fist').animate({
					top : targetTop2 - 40
				}, 100, function() {$('#fist').fadeOut(200)
				});
				$('#ball').animate({
					top : -20,
					left : 500,
					width : 10,
					height : 10
				}, 500, "easeOutCirc", function() {
					//_this.initLayout();
				});
				$('#ball img').animate({
					width : 10,
					height : 10
				}, 1000, "easeOutCirc", function() {
					_this.moveEnd();
				});
				if(logBool)
					console.log("进错垃圾桶，打回去55");
				_this.moveEnd();
				return false;
			}
			return false;
		}
	}
	this.moveEnd = function() {
		console.log("---------------------------------->");
		$('#ball').css('top', ballStartTop);
		$('#ball').css('left', ballStartLeft);
		$('#ball').css('width', '72px');
		$('#ball').css('height', '72px');
		$('#ball img').css('width', '72px');
		$('#ball img').css('height', '72px');
		windSpeed = this.getRadWind();
		clickBool = true;

		clearInterval(timeID);
		clearInterval(rotateTimer);
		if(logBool)
			console.log(curIn);
		if(!curIn) {score = 0};
		$('#game_score').text(bestScore);
		$('#game_bestScore').text(score);
		$('#ball img').rotate(0);
		this.radLaji();
	}
	var lajitong;
	var lajitong1;
	var lajitong2;
	var lajitong3;
	var _laji;
	var left1;
	var left2;
	var left3;
	var top1;
	var top2;
	var top3;
	var w1;
	var w2;
	var w3;
	//随机配对垃圾筒
	this.radLaji = function() {
		lajitong = this.rad(0, 3);
		_laji = this.rad(1, (lajiArr[lajitong].length - 1));
		$('#ball img').attr('src', 'res/images/' + lajiArr[lajitong][_laji] + '.png');
		/*$("#target_bottom img").fadeOut(50,function(){
			$("#target_bottom img").attr('src', 'res/images/' + lajiArr[lajitong][0] + '_1.png');
			$("#target_bottom img").fadeIn(50);
		});
		$("#target_top").fadeOut(function(){
			$("#target_top img").attr('src', 'res/images/' + lajiArr[lajitong][0] + '_2.png');
			$("#target_top img").fadeIn(50);
		});*/
		$("#target_bottom img").attr('src', 'res/images/' + lajiArr[lajitong][0] + '_1.png');
		$("#target_top img").attr('src', 'res/images/' + lajiArr[lajitong][0] + '_2.png')

		if(curLevel == 3 || curLevel == 4) {
			var _r = this.rad(0, 1);
			left1 = lArr[_r]; 
			left1 == lArr[0] ? left2 = lArr[1] : left2 = lArr[0];
			top1 = tArr[_r]; 
			top2 == tArr[0] ? top2 = tArr[1] : top2 = tArr[0];
			w1 = wArr[_r]; 
			w1 == wArr[0] ? w2 = wArr[1] : w2 = wArr[0];
			targetLeft = targetlArr[_r]; 
			targetLeft == targetlArr[0] ? targetLeft1 = targetlArr[1] : targetLeft1 = targetlArr[0];
			targetTop = targettArr[_r]; 
			targetTop == targettArr[0] ? targetTop1 = targettArr[1] : targetTop1 = targettArr[0];
			targetW = targetwArr[_r]; 
			targetW == targetwArr[0] ? targetW1 = targetwArr[1] : targetW1 = targetwArr[0];

			$("#target_bottom1").css({
				"top" : top2,
				'left' : left2,
				'width' : w2
			});
			$("#target_bottom1 img").css({
				'width' : w2
			});

			$("#target_top1").css({
				"top" : top2,
				'left' : left2,
				'width' : w2
			});
			$("#target_top1 img").css({
				'width' : w2
			});

			$("#target1").css({
				"top" : targetTop1,
				'left' : targetLeft1,
				'width' : targetW1,
				'height' : targetH
			});
			var _arr = [];
			if(lajitong == 0) {
				_arr = [1, 2, 3];
			}
			if(lajitong == 1) {
				_arr = [0, 2, 3];
			}
			if(lajitong == 2) {
				_arr = [0, 1, 3];
			}
			if(lajitong == 3) {
				_arr = [0, 2, 1];
			}
			lajitong1 = _arr[this.rad(0, 2)];
			//console.log("----->", lajiArr[lajitong1][0], lajiArr[lajitong][0]);
			$("#target_bottom1 img").attr('src', 'res/images/' + lajiArr[lajitong1][0] + '_1.png');
			$("#target_top1 img").attr('src', 'res/images/' + lajiArr[lajitong1][0] + '_2.png')
			
			$('#target_bottom1').css("display", "block");
			$('#target_top1').css("display", "block");
			$('#target1').css("display", "block");
		}
		if(curLevel == 5) {
			var _r = this.rad(0, 2);
			left1 = lArr[_r];
			top1 = tArr[_r]; 
			w1 = wArr[_r]; 
			targetLeft = targetlArr[_r]; 
			targetTop = targettArr[_r]; 
			targetW = targetwArr[_r]; 
			
			if(left1 == lArr[0]) {
				left2 = lArr[1];
				left3 = lArr[2];
				top2 = tArr[1];
				top3 = tArr[2];
				w2 = wArr[1];
				w3 = wArr[2];
				targetLeft1 = targetlArr[1];
				targetLeft2 = targetlArr[2];
				targetW1 = targetwArr[1];
				targetW2 = targetwArr[2];
				targetTop1 = targettArr[1];
				targetTop2 = targettArr[2];
			} else if(left1 == lArr[1]) {
				left2 = lArr[2];
				left3 = lArr[0];
				top2 = tArr[2];
				top3 = tArr[0];
				w2 = wArr[2];
				w3 = wArr[0];
				targetLeft1 = targetlArr[2];
				targetLeft2 = targetlArr[0];
				targetW1 = targetwArr[2];
				targetW2 = targetwArr[0];
				targetTop1 = targettArr[2];
				targetTop2 = targettArr[0];
			} else {
				left2 = lArr[0];
				left3 = lArr[1];
				top2 = tArr[0];
				top3 = tArr[1];
				w2 = wArr[0];
				w3 = wArr[1];
				targetLeft1 = targetlArr[0];
				targetLeft2 = targetlArr[1];
				targetW1 = targetwArr[0];
				targetW2 = targetwArr[1];
				targetTop1 = targettArr[0];
				targetTop2 = targettArr[1];
			}

			$("#target_bottom1").css({
				"top" : top2,
				'left' : left2,
				'width' : w2
			});
			$("#target_bottom1 img").css({
				'width' : w2
			});

			$("#target_top1").css({
				"top" : top2,
				'left' : left2,
				'width' : w2
			});
			$("#target_top1 img").css({
				'width' : w2
			});

			$("#target1").css({
				"top" : targetTop1,
				'left' : targetLeft1,
				'width' : targetW1,
				'height' : targetH
			});

			$("#target_bottom2").css({
				"top" : top3,
				'left' : left3,
				'width' : w3
			});
			$("#target_bottom2 img").css({
				'width' : w3
			});

			$("#target_top2").css({
				"top" : top3,
				'left' : left3,
				'width' : w3
			});
			$("#target_top2 img").css({
				'width' : w3
			});

			$("#target2").css({
				"top" : targetTop2,
				'left' : targetLeft2,
				'width' : targetW2,
				'height' : targetH
			});

			if(lajitong == 0) {
				lajitong1 = 1;
				lajitong2 = 3;
			}
			if(lajitong == 1) {
				lajitong1 = 2;
				lajitong2 = 0;
			}
			if(lajitong == 2) {
				lajitong1 = 3;
				lajitong2 = 1;
			}
			if(lajitong == 3) {
				lajitong1 = 2;
				lajitong2 = 1;
			}
			//console.log("----->", lajiArr[lajitong1][0], lajiArr[lajitong][0]);
			$("#target_bottom1 img").attr('src', 'res/images/' + lajiArr[lajitong1][0] + '_1.png');
			$("#target_top1 img").attr('src', 'res/images/' + lajiArr[lajitong1][0] + '_2.png')
			$("#target_bottom2 img").attr('src', 'res/images/' + lajiArr[lajitong2][0] + '_1.png');
			$("#target_top2 img").attr('src', 'res/images/' + lajiArr[lajitong2][0] + '_2.png')
			
			$('#target_bottom1').css("display", "block");
			$('#target_top1').css("display", "block");
			$('#target1').css("display", "block");

			$('#target_bottom2').css("display", "block");
			$('#target_top2').css("display", "block");
			$('#target2').css("display", "block");
		}

		$("#target_bottom").css({
			"top" : top1,
			'left' : left1,
			'width' : w1
		});
		$("#target_bottom img").css({
			'width' : w1
		});
		$("#target_top").css({
			"top" : top1,
			'left' : left1,
			'width' : w1
		});
		$("#target_top img").css({
			'width' : w1
		});
		$("#target").css({
			"top" : targetTop,
			'left' : targetLeft,
			'width' : targetW,
			'height' : targetH
		});
		$('#target_bottom').css("display", "none");
		$('#target_top').css("display", "none");
		$('#target_bottom').fadeIn();
		$('#target_top').fadeIn();
	}
	this.setNadu = function() {
		for(var i = 0; i < 5; i++) {
			$("#game_nandu div").eq(i).css("background", 'url(res/images/xinxin.png) no-repeat');
		};
		for(var i = 0; i < curLevel; i++) {
			$("#game_nandu div").eq(i).css("background", 'url(res/images/xinxin_liang.png) no-repeat');
		};
	}
	//var targetX	= this._app.getElementById('content');
	//var targetX = jQuery("#target");
	//console.log(targetX);
});
