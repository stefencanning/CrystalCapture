function Options()
{
}

Options.prototype.Initialise = function()
{
	options.down=0;
	options.options =[];
	var center = canvas.width/2;
	options.barX = center-100;
	options.width = 200;
	options.options[options.options.length]=[center-((("Master Volume").length/2)*12),50+(options.options.length*50),"Master Volume",function (val) {sound.MasterVolume=val;},function () {return sound.MasterVolume;}];
	options.options[options.options.length]=[center-((("Music Volume").length/2)*12),50+(options.options.length*50),"Music Volume",function (val) { sound.MVolume=val;},function () {return sound.MVolume;}];
	options.options[options.options.length]=[center-((("Voice-Over Volume").length/2)*12),50+(options.options.length*50),"Voice-Over Volume",function (val) { sound.VOVolume=val;},function () {return sound.VOVolume;}];
	
	options.back = function (val) { main.mode=MENU;};
}

Options.prototype.Loop = function ()
{
	if(document.body.className=="hidden")
	{
		options.down=0;	
	}
	if(options.down)
	{
		for(var i = 0; i < options.options.length;i++)
		{
			var temp = options.options[i];
			if(mousePos.x>options.barX-5&&mousePos.x<options.barX+options.width+5&&mousePos.y>temp[1]+30&&mousePos.y<temp[1]+30+10)
			{
				var val = mousePos.x-options.barX;
				val = val/options.width;
				temp[3](Math.max(0,Math.min(val,1)));
			}
		}
	}
	options.Draw();
}

Options.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = "rgba(160, 160, 160, 0.6)";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.font="bold 20px Courier";
	for(var i = 0; i < options.options.length;i++)
	{
		var temp = options.options[i];
		var gradient=ctx.createLinearGradient(temp[0],temp[1],temp[0]+temp[2].length*12+5,temp[1]+20);
		gradient.addColorStop("0",rgb(0, 0, 255));
		gradient.addColorStop("1.0",rgb(255,165,0));
		ctx.strokeStyle=gradient;
		ctx.fillStyle = gradient;
		ctx.fillText(temp[2], temp[0]+2, temp[1]+18);
		
		var gradient=ctx.createLinearGradient(options.barX,temp[1]+25,options.barX+options.width,temp[1]+45);
		gradient.addColorStop("0",rgb(0, 0, 255));
		gradient.addColorStop("1.0",rgb(255,165,0));
		ctx.strokeStyle=gradient;
		ctx.fillStyle = gradient;
		ctx.strokeRect(options.barX-10,temp[1]+25,options.width+20,20);
		ctx.fillRect(options.barX,temp[1]+33,options.width,4);
		
		var x = temp[4]();
		x = options.barX + (options.width*x);
		ctx.fillRect(x-5,temp[1]+30,10,10);
		
		gradient=0;
	}
	
	
	var center = canvas.width/2;
	var gradient=ctx.createLinearGradient(center-((("Back").length/2)*12),50+(options.options.length*50),center-((("Back").length/2)*12)+("Back").length*12+5,50+(options.options.length*50)+20);
	gradient.addColorStop("0",rgb(0, 0, 255));
	gradient.addColorStop("1.0",rgb(255,165,0));
	ctx.strokeStyle=gradient;
	ctx.fillStyle = gradient;
	ctx.strokeRect(center-((("Back").length/2)*12),60+(options.options.length*50),("Back").length*12+5,20);
	ctx.fillText("Back", center-((("Back").length/2)*12)+2, 60+(options.options.length*50)+18);
	gradient=0;
	
	
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
}

Options.prototype.Overlay = function()
{
	ctx.font="bold 20px Courier";
	for(var i = 0; i < options.options.length;i++)
	{
		var temp = options.options[i];
		var gradient=ctx.createLinearGradient(temp[0],temp[1],temp[0]+temp[2].length*12+5,temp[1]+20);
		gradient.addColorStop("0",rgb(0, 0, 255));
		gradient.addColorStop("1.0",rgb(255,165,0));
		ctx.strokeStyle=gradient;
		ctx.fillStyle = gradient;
		ctx.fillText(temp[2], temp[0]+2, temp[1]+18);
		
		var gradient=ctx.createLinearGradient(options.barX,temp[1]+25,options.barX+options.width,temp[1]+45);
		gradient.addColorStop("0",rgb(0, 0, 255));
		gradient.addColorStop("1.0",rgb(255,165,0));
		ctx.strokeStyle=gradient;
		ctx.fillStyle = gradient;
		ctx.strokeRect(options.barX-10,temp[1]+25,options.width+20,20);
		ctx.fillRect(options.barX,temp[1]+33,options.width,4);
		
		var x = temp[4]();
		x = options.barX + (options.width*x);
		ctx.fillRect(x-5,temp[1]+30,10,10);
		
		gradient=0;
	}
	
	var center = canvas.width/2;
	var gradient=ctx.createLinearGradient(center-((("Back").length/2)*12),50+(options.options.length*50),center-((("Back").length/2)*12)+("Back").length*12+5,50+(options.options.length*50)+20);
	gradient.addColorStop("0",rgb(0, 0, 255));
	gradient.addColorStop("1.0",rgb(255,165,0));
	ctx.strokeStyle=gradient;
	ctx.fillStyle = gradient;
	ctx.strokeRect(center-((("Back").length/2)*12),60+(options.options.length*50),("Back").length*12+5,20);
	ctx.fillText("Back", center-((("Back").length/2)*12)+2, 60+(options.options.length*50)+18);
	gradient=0;
}

Options.prototype.onDoubleClick = function(e)
{
}

Options.prototype.onMouseMove = function(e)
{
}

Options.prototype.onMouseClick = function(e)
{
	options.down=0;
	
	var center = canvas.width/2;
	if(e.x>center-((("Back").length/2)*12)&&e.x<center-((("Back").length/2)*12)+("Back").length*12+5&&e.y>60+(options.options.length*50)&&e.y<60+(options.options.length*50)+20)
	{
		options.back();
	}
}

Options.prototype.onMouseDown = function(e)
{
	options.down=1;
}

Options.prototype.onContextMenu = function(e)
{
}

Options.prototype.onKeyPress = function(e)
{
}

Options.prototype.onKeyUp = function(e)
{
}