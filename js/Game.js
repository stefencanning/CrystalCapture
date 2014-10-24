var time;
var keys;
function Game ()
{
}

Game.prototype.SetUp=function()
{
}

Game.prototype.Initialise=function ()
{
	game.rooms = [];
	game.rooms[0] = new Room();
	game.rooms[0].addWall(new Wall(0,0));
	game.rooms[0].addWall(new Wall(32,0));
	game.rooms[0].addWall(new Wall(64,0));
	game.rooms[0].addWall(new Wall(96,0));
	game.rooms[0].addWall(new Wall(96,32));
	game.rooms[0].addWall(new Wall(96,64));
	game.rooms[0].addWall(new Wall(96,96));
	game.rooms[0].addWall(new Wall(128,64));
	game.rooms[0].addWall(new Wall(96,128));
	game.keys = {"w":false,
	"a":false,
	"s":false,
	"d":false};
	game.player = new Player(64,64);
	game.blueFlag=new Flag(128,128,0);
	game.redFlag=new Flag(160,128,1);
}

Game.prototype.initCanvas=function ()
{ ;
}

Game.prototype.gameLoop = function () 
{
	if(game.keys["w"])
	{
		game.player.y-=1;
	}
	if(game.keys["s"])
	{
		game.player.y+=1;
	}
	if(game.keys["a"])
	{
		game.player.x-=1;
	}
	if(game.keys["d"])
	{
		game.player.x+=1;
	}
	var newPos = game.rooms[game.player.room].checkCollision(game.player);
	game.player.x = newPos[0];
	game.player.y = newPos[1];
	var flag;
	if(game.player.team == 0)
	{
		flag = game.redFlag;
	}
	else
	{
		flag = game.blueFlag;
	}
	if(game.player.x+game.player.w>flag.x
	&&game.player.x<flag.x+flag.w
	&&game.player.y+game.player.h>flag.y
	&&game.player.y<flag.y+flag.h)
	{
		CLIENT.grabFlag();
	}
	game.Draw();
}

Game.prototype.onMouseClick = function(e)
{
}

Game.prototype.onContextMenu = function(e)
{
}

Game.prototype.onKeyPress = function(e)
{
	//W
	if (e.keyCode == 87) 
	{
		game.keys["w"] = true;
	}
	//S
	if(e.keyCode == 83) 
	{
		game.keys["s"] = true;
	}
	//A
	if (e.keyCode == 65) 
	{
		game.keys["a"] = true;
	}
	//D
	if (e.keyCode == 68)
	{
		game.keys["d"] = true;
	}
}
Game.prototype.onKeyUp = function(e)
{
	//W
	if (e.keyCode == 87) 
	{
		game.keys["w"] = false;
	}
	//S
	if(e.keyCode == 83) 
	{
		game.keys["s"] = false;
	}
	//A
	if (e.keyCode == 65) 
	{
		game.keys["a"] = false;
	}
	//D
	if (e.keyCode == 68)
	{
		game.keys["d"] = false;
	}
}

Game.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	game.player.draw();
	for(var i = 0; i < game.rooms.length;i++)
	{
		game.rooms[i].draw();
	}
	game.blueFlag.draw();
	game.redFlag.draw();
		//ctx.drawImage(dancerImg[game.waitingImage],40,40);
		//ctx.fillStyle = rgb(0, 0, 0);
		//ctx.font="20px Georgia";
		//ctx.fillText("Waiting for opponent", 20, 20);
	
}
	