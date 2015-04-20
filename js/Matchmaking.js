
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
	var center = canvas.width/2;
	if(!matchmaking.ingame)
	{
		var xPos=center-200,yPos,width=400,height=20;
		for(var i = 0; i < matchmaking.gameList.length;i++)
		{
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
		if(matchmaking.ingame)
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
	ctx.fillStyle = "rgba(160, 160, 160, 1)";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.strokeStyle=rgb(0,0,255);
	ctx.font="bold 20px Courier";
	var center = canvas.width/2;
	if(!matchmaking.ingame)
	{
		var text ="search for games   ('C' to create a lobby, 'R' to refresh game list)"; 
		main.fillText(text, center-((text.length/2)*11), 23);
		/*for(var i = 0; i < matchmaking.gameList.length;i++)
		{
			main.fillText(matchmaking.gameList[i].hostName, 20, 45+i*25);
			main.fillText(matchmaking.gameList[i].count, 30+(matchmaking.gameList[i].host.toString().length*20), 45+i*25);
		}*/
		for(var i = 0; i < matchmaking.gameList.length;i++)
		{
			var gradient=ctx.createLinearGradient(center-200,31+(i*25),center+200,31+(i*25)+20);
			gradient.addColorStop("0",rgb(0, 0, 255));
			gradient.addColorStop("1.0",rgb(255,165,0));
			ctx.strokeStyle=gradient;
			ctx.fillStyle = gradient;
			ctx.strokeRect(center-200,31+(i*25),400,20);
			main.fillText(matchmaking.gameList[i].hostName, center-199, 48+(i*25));
			main.fillText(matchmaking.gameList[i].count, center+194-((matchmaking.gameList[i].count.toString().length/2)*11), 48+(i*25));
			gradient=0;
		}
	}
	else
	{
		var str = "game lobby";
		if(matchmaking.hosting)
		{
			 str ="game lobby   ('S' to start game)";
		}
		main.fillText(str, center-((str.length/2)*11), 23);
		ctx.fillStyle = rgb(0, 0, 255);
		main.fillText("Blue Team", center-259-((("Blue Team").length/2)*11), 48);
		for(var i = 0; i < blueTeam.length;i++)
		{
			main.fillText(currentSession[blueTeam[i]], center-259-(((currentSession[blueTeam[i]]).length/2)*11), 73+i*25);
		}
		ctx.fillStyle = rgb(255,165,0);
		main.fillText("Yellow Team", center+254-((("Yellow Team").length/2)*11), 48);
		for(var i = 0; i < redTeam.length;i++)
		{
			main.fillText(currentSession[redTeam[i]], center+254-(((currentSession[redTeam[i]]).length/2)*11), 73+i*25);
		}
	}
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
}
	