$(function(){
	var canvas=document.querySelector("canvas");
	var cobj=canvas.getContext("2d");
	
	$(window).resize(function(){
		canvas.width=document.documentElement.clientWidth;
		canvas.height=document.documentElement.clientHeight;
	})
	$(window).resize();
	var runsImg=$(".walk");
	var jumpImg=$(".jump");  
    var hinderImg=$(".hinderImg");
	var liveli=$(".liveli");
	var end=document.querySelector(".end");
	var gameobj=new game(canvas,cobj,runsImg,jumpImg,hinderImg,liveli,end);
	$(".start").click(function(){
		$(".live").css("display","block");
		gameobj.play();
		$(this).css("display","none");
	});
	if(liveli.length==0){
		$(".end").css("display","block");
	}
	$(".endbtn").click(function(){
		location.reload();
		$(".end").css("display","none");

	});

	// cobj.drawImage(runsImg[0],0,0,308,300,40,330,308,300);
	// cobj.beginPath();
	// cobj.moveTo(0,100);
	// cobj.bezierCurveTo(100,200,200,200,300,100);
	// cobj.stroke();
	// cobj.closePath();
	// cobj.fill();
})