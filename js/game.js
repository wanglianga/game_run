
/*粒子动画*/
function fire(cobj) {
    this.cobj = cobj
    this.x = 0;
    this.y = 0;
    this.x1 = 20 * Math.random() - 10;
    this.y1 = 20 * Math.random() - 10;
    this.x2 = 20 * Math.random() - 10;
    this.y2 = 20 * Math.random() - 10;
    this.speedy = -2 - Math.random() - 2;
    this.speedx = (16 * Math.random() - 8)
    this.life = 4;
    this.r = 1;
    this.color = "#fef";

}
fire.prototype = {
    draw: function () {
        var cobj = this.cobj;
        cobj.save();
        cobj.beginPath();
        cobj.fillStyle = this.color;
        cobj.translate(this.x, this.y);
        cobj.scale(this.r, this.r)
        cobj.moveTo(0, 0);
        //cobj.bezierCurveTo(this.x1,this.y1,this.x2,this.y2,0,0);
        cobj.lineTo(this.x1, this.y1);
        cobj.lineTo(this.x2, this.y2);
        cobj.fill();
        cobj.restore();
    },
    update: function () {
        this.x += this.speedx;
        this.y += this.speedy;
        this.life -= 0.2;
        this.r -= 0.06;
    }
}


function stone(cobj, x, y,color) {
    var color=color||"#fff";
    var stoneArr = [];
    for (var i = 0; i < 5; i++) {
        var obj = new fire(cobj);
        obj.x = x;
        obj.y = y;
        obj.color=color;
        stoneArr.push(obj);
    }
    console.log(stoneArr.length);
    var t = setInterval(function () {
        for (var i = 0; i < stoneArr.length; i++) {
            stoneArr[i].draw();
            stoneArr[i].update();
            if (stoneArr[i].r < 0 || stoneArr[i].life < 0) {
                stoneArr.splice(i, 1);
            }
        }
        if (stoneArr.length == 0) {
            clearInterval(t);
        }
    }, 50)
}
/*游戏角色*/
function person(canvas,cobj,runsImg,jumpImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=0;
    this.y=0;
    this.runsImg=runsImg;
   
    this.jumpImg=jumpImg;
    this.state="runsImg";
    this.status=0
    this.width=83;
    this.height=120;
    this.canvas.width=canvas.width;
    this.canvas.height=canvas.height;
    this.speedy=5;
    this.zhongli=10;
    this.endy=460;
}
person.prototype={
	draw:function(){
		this.cobj.save();
		this.cobj.translate(this.x,this.y);
		this.cobj.drawImage(this[this.state][this.status],0,0,827,1181,0,0,this.width,this.height);
		this.cobj.restore();
	},
    update:function(){
        if (this.y>this.endy) {
            this.y=this.endy;
            stone(this.cobj, this.x + this.width / 2, this.y + this.height);
        }
        else if (this.y < this.endy) {
            this.speedy += this.zhongli;
            this.y += this.speedy;
        }
    }
};
/*游戏主程序*/
function game(canvas,cobj,runsImg,jumpImg,hinderImg,liveli,end){
    this.hinderImg=hinderImg;
	this.canvas=canvas;
	this.cobj=cobj;
	this.person=new person(canvas,cobj,runsImg,jumpImg);
    this.speed=5;
    this.hinderArr=[];
    this.score=1;
    this.life=5;
    this.liveli=liveli;
    this.end=end;
}
game.prototype={
	play:function(){
		var that=this;
        that.key();
		var num=0;
        var back=0;
        var num2=0;
        var step=5000+parseInt(5*Math.random())*1000;
        var left=40;
        var t=setInterval(function(){
        	num++;
            back-=that.speed;
        	that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
        	that.person.x+=that.speed;
            if (that.person.x>that.canvas.width/3) {
                that.person.x=that.canvas.width/3
            }
            if (that.person.state=="runsImg") {
                that.person.status=num%7;
            }else if(that.person.state=="jumpImg"){
                that.person.status=0;
            }
        	that.person.draw();
            that.person.update();
            that.canvas.style.backgroundPositionX=back+"px";

            if (num2%step==0) {
                num2=0;
                step=5000+parseInt(5*Math.random())*1000;
                var hinderObj=new hinder(that.canvas,that.cobj,that.hinderImg);
                hinderObj.state=Math.floor(that.hinderImg.length*Math.random());
                that.hinderArr.push(hinderObj);
                  if(that.hinderArr.length>5){
                        that.hinderArr.shift();
                    }
            }
             num2+=50;
            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.speed;
                that.hinderArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    if(!that.hinderArr[i].flag1) {
                        that.life--;
                        if(that.life>=0){
                            that.liveli[that.life].style.display="none";
                            stone(that.cobj, that.person.x + that.person.width / 2, that.person.y + that.person.height / 2,"red")
                        }
                        if(that.life<=0){

                           clearInterval(t);
                            that.end.style.display="block";

                           //
                        }
                    }
                    that.hinderArr[i].flag1=true;
                }else if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x){
                    if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1) {
                        document.title=++that.score;
                        var scoreNew=document.createElement("div");
                        if(left<400){
                            left+=40;
                        }
                        scoreNew.style.cssText="width:30px;height:30px;position:absolute;right:"+left+"px;top:40px";
                        scoreNew.className="scoreNew";
                        document.body.appendChild(scoreNew);
                        if(that.score%3==0){
                            that.speed+=1;
                        }
                    }
                    that.hinderArr[i].flag=true;
                }
            }
        },50)
	},
    key:function(){
        var that=this;
        var flag=true;
        document.onkeydown=function(e){
          var code=e.keyCode;
          if (code==32) {
             if (!flag) {
                return;
             };
             flag=false;
             that.person.state="jumpImg";
             var initA=0;
             var speedA=5;
             var r=50;
             var initY=that.person.y;
             var t=setInterval(function(){
                 initA+=speedA;
                 if(initA>180){
                    clearInterval(t);
                    that.person.y=initY;
                    that.person.state="runsImg";
                    flag=true;
                 }
                 else{
                   var length=Math.sin(initA*Math.PI/180)*r;
                   that.person.y=initY-length;
                 }
             },50)
          }
        }
    },

}
/*障碍物*/
function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.x=canvas.width;
    this.y=540;
    this.width=56;
    this.height=60;
    this.state=0;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,564,600,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
