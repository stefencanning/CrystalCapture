function CharCust()
{
}

CharCust.prototype.Initialise = function()
{
}

CharCust.prototype.Loop = function () 
{
	charCust.Draw();
}

CharCust.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="20px Lucida Console";
	ctx.strokeStyle=rgb(0,0,255);
	ctx.fillText("skin colour", 50, 30);
	ctx.fillText("<-", 5, 30);
	ctx.fillText("->", 175, 30);
	ctx.fillText("gender", 50, 100);
	ctx.fillText("<-", 5, 100);
	ctx.fillText("->", 175, 100);
	ctx.drawImage(images.bodies[main.playerGender][main.playerBodyType][main.playerColour],canvas.width/2,canvas.height/2);
}


CharCust.prototype.onDoubleClick = function(e)
{
}

CharCust.prototype.onMouseMove = function(e)
{
}

CharCust.prototype.onMouseClick = function(e)
{
	if(e.x>5&&e.x<50&&e.y>10&&e.y<30)
	{
		main.playerColour-=1;
		if(main.playerColour<0)
		{
			main.playerColour=4;
		}
	}
	if(e.x>175&&e.x<210&&e.y>10&&e.y<30)
	{
		main.playerColour+=1;
		if(main.playerColour>4)
		{
			main.playerColour=0;
		}
	}
	if(e.x>5&&e.x<50&&e.y>70&&e.y<100)
	{
		main.playerGender-=1;
		if(main.playerGender<0)
		{
			main.playerGender=4;
		}
	}
	if(e.x>175&&e.x<210&&e.y>70&&e.y<100)
	{
		main.playerGender+=1;
		if(main.playerGender>1)
		{
			main.playerGender=0;
		}
	}
	if(e.x>canvas.width/2&&e.y>canvas.height/2)
	{
		 matchmaking= new Matchmaking();matchmaking.Initialise();main.mode=GAMESELECT;CLIENT.getGames();
	}
}

CharCust.prototype.onContextMenu = function(e)
{
}

CharCust.prototype.onKeyPress = function(e)
{
}

CharCust.prototype.onKeyUp = function(e)
{
}