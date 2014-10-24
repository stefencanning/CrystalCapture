
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
	matchmaking.redTeam = [];
	matchmaking.blueTeam = [];
}


Matchmaking.prototype.Loop = function () 
{
	matchmaking.Draw();
}

Matchmaking.prototype.onMouseClick = function(e)
{
}

Matchmaking.prototype.onContextMenu = function(e)
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
}
Matchmaking.prototype.onKeyUp = function(e)
{
}

Matchmaking.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="20px Georgia";
	if(!matchmaking.ingame)
	{
		ctx.fillText("search for games", 20, 20);
		for(var i = 0; i < matchmaking.gameList.length;i++)
		{
			ctx.fillText(matchmaking.gameList[i].host, 20, 45+i*25);
			ctx.fillText(matchmaking.gameList[i].count, 30+(matchmaking.gameList[i].host.toString().length*20), 45+i*25);
		}
	}
	else
	{
		ctx.fillText("game lobby", 20, 20);
		for(var i = 0; i < matchmaking.redTeam.length;i++)
		{
			ctx.fillText(matchmaking.redTeam[i], 20, 45+i*25);
		}
	}
}
	