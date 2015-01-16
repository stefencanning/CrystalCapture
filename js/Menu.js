function Menu()
{
}

Menu.prototype.Initialise = function()
{
	menu.options =[];
	menu.options[0]=[20,5,"Matchmaking",function () { matchmaking= new Matchmaking();matchmaking.Initialise();main.mode=GAMESELECT;CLIENT.getGames();}];
	//menu.options[1]=[20,30,"Character Customisation",function () { charCust= new CharCust();charCust.Initialise();main.mode=CHARCUST;}];
	menu.options[2]=[20,55,"Quit",function () { matchmaking= new Matchmaking();matchmaking.Initialise();main.mode=GAMESELECT;}];
}

Menu.prototype.Loop = function () 
{
	menu.Draw();
}

Menu.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="20px Lucida Console";
	ctx.strokeStyle=rgb(0,0,255);
	
	for(var i = 0; i < menu.options.length;i++)
	{
		var temp = menu.options[i];
		ctx.strokeRect(temp[0],temp[1],temp[2].length*12+5,20);
		ctx.fillText(temp[2], temp[0]+2, temp[1]+18);
	}
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