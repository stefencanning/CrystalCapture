function Menu()
{
}

Menu.prototype.Initialise = function()
{
	menu.options =[];
	var center = canvas.width/2;
	menu.options[menu.options.length]=[center-((("Matchmaking").length/2)*11),50+(menu.options.length*50),"Matchmaking",function () { main.mode=GAMESELECT;CLIENT.getGames();}];
	menu.options[menu.options.length]=[center-((("Tutorial").length/2)*11),50+(menu.options.length*50),"Tutorial",function () { 
			main.playerTeam="blue";
			tutorial = new Tutorial();
			tutorial.Initialise();
			main.mode=TUTORIAL;
			sound.stopSong(sound.songNumbers["menu"]);
			sound.playSong(sound.songNumbers["walking"]);
			sound.playVoice(sound.voiceNumbers["start"]);}];
	//menu.options[menu.options.length]=[20,5+(menu.options.length*25),"Character Customisation",function () { charCust= new CharCust();charCust.Initialise();main.mode=CHARCUST;}];
	menu.options[menu.options.length]=[center-((("Options").length/2)*11),50+(menu.options.length*50),"Options",function () { main.mode=OPTIONS;}];
	menu.options[menu.options.length]=[center-((("Character Customisation").length/2)*11),50+(menu.options.length*50),"Character Customisation",function () { main.mode=CHARCUST;}];
}

Menu.prototype.Loop = function ()
{
	menu.Draw();
}

Menu.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.font="bold 20px Courier";
	for(var i = 0; i < menu.options.length;i++)
	{
		var temp = menu.options[i];
		var gradient=ctx.createLinearGradient(temp[0],temp[1],temp[0]+temp[2].length*12+5,temp[1]+20);
		gradient.addColorStop("0",rgb(0, 0, 255));
		gradient.addColorStop("1.0",rgb(255,165,0));
		ctx.strokeStyle=gradient;
		ctx.fillStyle = gradient;
		ctx.strokeRect(temp[0],temp[1],temp[2].length*12+5,20);
		ctx.fillText(temp[2], temp[0]+2, temp[1]+18);
		gradient=0;
	}
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
	/*ctx.strokeRect(20,5,"Matchmaking".length*12+5,20);
	ctx.fillText("Matchmaking", 22, 23);
	
	ctx.font="20px Lucida Console";
	ctx.strokeRect(20,30,"Character Customisation".length*12+5,20);
	ctx.fillText("Character Customisation", 22, 48);
	
	ctx.font="20px Lucida Console";
	ctx.strokeRect(20,55,"Quit".length*12+5,20);
	ctx.fillText("Quit", 22, 73);*/
}


Menu.prototype.onDoubleClick = function(e)
{
}

Menu.prototype.onMouseMove = function(e)
{
}

Menu.prototype.onMouseClick = function(e)
{

	for(var i = 0; i < menu.options.length;i++)
	{
		var temp = menu.options[i];
		if(e.x>temp[0]&&e.x<temp[0]+(temp[2].length*12+5)&&e.y>temp[1]&&e.y<temp[1]+20)
		{
			temp[3]();
		}
	}
	/*
	var x,y,w,h;
	x=20;
	y=5;
	w="Matchmaking".length*12;
	h=20;
	if(e.clientX>x&&e.clientX<x+w&&e.clientY-30>y&&e.clientY-30<y+h)
	{
		main.mode =  GAMESELECT;
	}
	
	x=20;
	y=30;
	w="Character Customisation".length*10;
	h=20;
	if(e.clientX>x&&e.clientX<x+w&&e.clientY>y&&e.clientY<y+h)
	{
		main.mode = CHARCUST;
	}*/
}

Menu.prototype.onContextMenu = function(e)
{
}

Menu.prototype.onKeyPress = function(e)
{
}

Menu.prototype.onKeyUp = function(e)
{
}