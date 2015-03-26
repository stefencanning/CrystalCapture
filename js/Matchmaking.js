
function Matchmaking ()
{
}

Matchmaking.prototype.SetUp=function()
{
}

Matchmaking.prototype.Initialise=function ()
{
	matchmaking.gameList = [];
	matchmaking.hosting = false;
	matchmaking.ingame = false;
}


Matchmaking.prototype.Loop = function () 
{
	matchmaking.Draw();
}

Matchmaking.prototype.onDoubleClick = function(e)
{
	if(!matchmaking.ingame)
	{
		var xPos=20,yPos,width,height=20;
		for(var i = 0; i < matchmaking.gameList.length;i++)
		{
			width=10+(matchmaking.gameList[i].hostName.toString().length*12+5)+(matchmaking.gameList[i].count.toString().length*12+5)
			yPos=30+i*25;
			if(e.x>=xPos&&e.x<=xPos+width&&e.y>=yPos&&e.y<=yPos+height)
			{
				CLIENT.join(matchmaking.gameList[i].hostID);
				break;
			}
		}
	}
}

Matchmaking.prototype.onMouseClick = function(e)
{
}

Matchmaking.prototype.onContextMenu = function(e)
{
}

Matchmaking.prototype.onMouseMove = function(e)
{
}

Matchmaking.prototype.onKeyPress = function(e)
{
	//R
	if (e.keyCode == 82) 
	{
		if(!matchmaking.hosting && !matchmaking.ingame)
		{
			CLIENT.getGames();
		}
	}
	//C
	if (e.keyCode == 67) 
	{
		if(!matchmaking.hosting && !matchmaking.ingame)
		{
			CLIENT.createGame();
		}
	}
	//S
	if (e.keyCode == 83) 
	{
		if(matchmaking.hosting && matchmaking.ingame)
		{
			CLIENT.startGame();
		}
	}
}
Matchmaking.prototype.onKeyUp = function(e)
{
}

Matchmaking.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.strokeStyle=rgb(0,0,255);
	ctx.font="20px Lucida Console";
	if(!matchmaking.ingame)
	{
		ctx.fillText("search for games   ('C' to create a lobby, 'R' to refresh game list)", 20, 23);
		/*for(var i = 0; i < matchmaking.gameList.length;i++)
		{
			ctx.fillText(matchmaking.gameList[i].hostName, 20, 45+i*25);
			ctx.fillText(matchmaking.gameList[i].count, 30+(matchmaking.gameList[i].host.toString().length*20), 45+i*25);
		}*/
		for(var i = 0; i < matchmaking.gameList.length;i++)
		{
			ctx.strokeRect(20,30+(i*25),10+(matchmaking.gameList[i].hostName.toString().length*12+5)+(matchmaking.gameList[i].count.toString().length*12+5),20);
			ctx.fillText(matchmaking.gameList[i].hostName, 22, 48+(i*25));
			ctx.fillText(matchmaking.gameList[i].count, 30+(matchmaking.gameList[i].hostName.toString().length*12+5), 48+(i*25));
		}
	}
	else
	{
		var str = "game lobby";
		if(matchmaking.hosting)
		{
			 str ="game lobby   ('S' to start game)";
		}
		ctx.fillText(str, 20, 23);
		ctx.fillStyle = rgb(0, 0, 255);
		ctx.fillText("Blue Team", 20, 48);
		for(var i = 0; i < blueTeam.length;i++)
		{
			ctx.fillText(currentSession[blueTeam[i]], 22, 73+i*25);
		}
		ctx.fillStyle = rgb(255, 0, 0);
		ctx.fillText("Red Team", 460, 48);
		for(var i = 0; i < redTeam.length;i++)
		{
			ctx.fillText(currentSession[redTeam[i]], 462, 73+i*25);
		}
	}
}
	