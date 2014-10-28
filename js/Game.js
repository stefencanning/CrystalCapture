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
	game.CreateStartRooms();
	game.keys = {"w":false,
	"a":false,
	"s":false,
	"d":false};
	game.player = new Player(96,96);
	if(main.playerTeam=="blue")
	{
		game.player.room=0;
	}
	if(main.playerTeam=="red")
	{
		game.player.room=1;
	}
	game.blueFlagCapture=false;
	game.redFlagCapture=false;
	game.blueFlag=new Flag(128,128,"blue");
	game.blueFlag.room=0;
	game.redFlag=new Flag(160,128,"red");
	game.redFlag.room=1;
	game.players=[];
}

Game.prototype.CreateStartRooms=function()
{
	game.rooms = [];
	for(var i = 0; i < 2; i++)
	{
		game.rooms[i] = new Room();
		game.rooms[i].addWall(new Wall(0,0));
		game.rooms[i].addWall(new Wall(32,0));
		game.rooms[i].addWall(new Wall(64,0));
		game.rooms[i].addWall(new Wall(96,0));
		game.rooms[i].addWall(new Wall(128,0));
		game.rooms[i].addWall(new Wall(160,0));
		game.rooms[i].addWall(new Wall(192,0));
		
		game.rooms[i].addWall(new Wall(0,192));
		game.rooms[i].addWall(new Wall(32,192));
		game.rooms[i].addWall(new Wall(64,192));
		game.rooms[i].addWall(new Wall(96,192));
		game.rooms[i].addWall(new Wall(128,192));
		game.rooms[i].addWall(new Wall(160,192));
		game.rooms[i].addWall(new Wall(192,192));
		
		game.rooms[i].addWall(new Wall(192,32));
		game.rooms[i].addWall(new Wall(192,64));
		game.rooms[i].addWall(new Wall(192,96));
		game.rooms[i].addWall(new Wall(192,128));
		game.rooms[i].addWall(new Wall(192,160));
		
		game.rooms[i].addWall(new Wall(0,32));
		game.rooms[i].addWall(new Wall(0,64));
		game.rooms[i].addWall(new Wall(0,96));
		game.rooms[i].addWall(new Wall(0,128));
		game.rooms[i].addWall(new Wall(0,160));
	}
}

Game.prototype.initCanvas=function ()
{
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
	if(newPos.roomChange)
	{
		game.player.room = newPos.room;
	}
	game.player.x = newPos.x;
	game.player.y = newPos.y;
	if(main.playerTeam == "blue")
	{
		var flag = game.redFlag;
		if(game.player.room==flag.room)
		{
			if(game.player.x+game.player.w>flag.x
			&&game.player.x<flag.x+flag.w
			&&game.player.y+game.player.h>flag.y
			&&game.player.y<flag.y+flag.h)
			if(!game.redFlagCaptured)
			{
				CLIENT.grabFlag();
			}
		}
	}
	if(main.playerTeam == "red")
	{
		var flag = game.blueFlag;
		if(game.player.room==flag.room)
		{
			if(game.player.x+game.player.w>flag.x
			&&game.player.x<flag.x+flag.w
			&&game.player.y+game.player.h>flag.y
			&&game.player.y<flag.y+flag.h)
			if(!game.blueFlagCaptured)
			{
				CLIENT.grabFlag();
			}
		}
	}
	var msg = {"x":game.player.x,"y":game.player.y,"health":game.player.health,"rotation":game.player.rotation,"flag":game.player.gotFlag,"room":game.player.room};
	CLIENT.updatePlayer(msg);
	game.Draw();
}

Game.prototype.onDoubleClick = function(e)
{
}

Game.prototype.onMouseClick = function(e)
{
	var offSetX = -game.player.x+(canvas.width/2);
	var offSetY = -game.player.y+(canvas.height/2);
	var inGamePos=[];
	inGamePos["x"]=e.x-offSetX;
	inGamePos["y"]=e.y-offSetY;
	inGamePos.x/=32;
	inGamePos.x=Math.floor(inGamePos.x);
	inGamePos.y/=32;
	inGamePos.y=Math.floor(inGamePos.y);
	CLIENT.createDoor(inGamePos.x,inGamePos.y,game.player.room);
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
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
	
	var offSetX = -game.player.x+(canvas.width/2);
	var offSetY = -game.player.y+(canvas.height/2);
	
	for(var i = 0; i < blueTeam.length;i++)
	{
		if(blueTeam[i]!=CLIENT.uniqueID)
		{
			if(playerGameData[blueTeam[i]]!=0)
			{
				if(playerGameData[blueTeam[i]].room==game.player.room)
				{
					ctx.fillStyle=rgb(0,0,0);
					ctx.fillRect(playerGameData[blueTeam[i]].x-1+offSetX,playerGameData[blueTeam[i]].y-11+offSetY,game.player.w+2,7);
					ctx.fillStyle=rgb(0,0,255);	
					ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y-10+offSetY,game.player.w*(playerGameData[blueTeam[i]].health/100),5);
					ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,game.player.w,game.player.h);
					if(playerGameData[blueTeam[i]].flag==1)
					{
						ctx.fillStyle=rgb(255,0,0);
						ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,game.player.w,10);	
						ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,5,game.player.h);	
					}
				}
			}
		}
	}
	
	for(var i = 0; i < redTeam.length;i++)
	{
		if(redTeam[i]!=CLIENT.uniqueID)
		{
			if(playerGameData[redTeam[i]]!=0)
			{
				if(playerGameData[redTeam[i]].room==game.player.room)
				{
					ctx.fillStyle=rgb(0,0,0);
					ctx.fillRect(playerGameData[redTeam[i]].x-1+offSetX,playerGameData[redTeam[i]].y-11+offSetY,game.player.w+2,7);
					ctx.fillStyle = rgb(255, 0, 0);
					ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y-10+offSetY,game.player.w*(playerGameData[redTeam[i]].health/100),5);
					ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,game.player.w,game.player.h);
					if(playerGameData[redTeam[i]].flag==1)
					{
						ctx.fillStyle=rgb(0,0,255);
						ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,game.player.w,10);	
						ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,5,game.player.h);	
					}
				}
			}
		}
	}
	
	game.player.draw(offSetX,offSetY);
	game.rooms[game.player.room].draw(offSetX,offSetY);
	/*for(var i = 0; i < game.rooms.length;i++)
	{
		game.rooms[i].draw();
	}*/
	if(!game.blueFlagCaptured)
	{
		if(game.player.room==game.blueFlag.room)
		{
			game.blueFlag.draw(offSetX,offSetY);
		}
	}
	if(!game.redFlagCaptured)
	{
		if(game.player.room==game.redFlag.room)
		{
			game.redFlag.draw(offSetX,offSetY);
		}
	}
		//ctx.drawImage(dancerImg[game.waitingImage],40,40);
		//ctx.fillStyle = rgb(0, 0, 0);
		//ctx.font="20px Georgia";
		//ctx.fillText("Waiting for opponent", 20, 20);
	
}
	