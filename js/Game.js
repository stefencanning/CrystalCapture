
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
	game.blueFlag=new Flag(96,96,"blue");
	game.blueFlag.room=0;
	game.redFlag=new Flag(96,96,"red");
	game.redFlag.room=1;
	game.redCapturePoint = [96,96,1];
	game.blueCapturePoint = [96,96,0];
	game.redPoints=0;
	game.bluePoints=0;
	game.players=[];
	game.bullets=[];
	game.timeSinceLastUpdate=0;
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
	game.rooms[0].oriColor="blue";
	game.rooms[0].foundColor="blue";
	game.rooms[1].oriColor="red";
	game.rooms[1].foundColor="red";
}

Game.prototype.initCanvas=function ()
{
}

Game.prototype.gameLoop = function () 
{
	var curTime=new Date();
	if(game.keys["w"])
	{
		game.player.y-=1;
		game.player.rotation=3;
	}
	if(game.keys["s"])
	{
		game.player.y+=1;
		game.player.rotation=0;
	}
	if(game.keys["a"])
	{
		game.player.x-=1;
		game.player.rotation=1;
	}
	if(game.keys["d"])
	{
		game.player.x+=1;
		game.player.rotation=2;
	}
	if(game.keys["space"])
	{
		if(game.player.fireTime<=0)
		{
			var dir;
			var xDif = mousePos["x"]-(canvas.width/2);
			var yDif = mousePos["y"]-(canvas.height/2);
			if(Math.abs(xDif)<Math.abs(yDif))
			{
				if(yDif<0)
				{
					dir = BulletDirections["up"];
				}
				else
				{
					dir = BulletDirections["down"];
				}
			}
			else
			{
				if(xDif<0)
				{
					dir = BulletDirections["left"];
				}
				else
				{
					dir = BulletDirections["right"];
				}
			}
			CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"direction":dir,"room":game.player.room,"team":main.playerTeam});
			game.player.fireTime=0.5;
		}
	}
	if(game.player.doorTime>0)
		game.player.doorTime-=curTime.getTime()-time.getTime();
	if(game.player.fireTime>0)
		game.player.fireTime-=curTime.getTime()-time.getTime();
	var newPos = game.rooms[game.player.room].checkCollision(game.player);
	if(newPos.roomChange)
	{
		if(game.rooms[game.player.room].foundColorValue-5>game.rooms[newPos.room].foundColorValue)
		{
			game.rooms[newPos.room].foundColor = game.rooms[game.player.room].foundColor;
			game.rooms[newPos.room].foundColorValue = game.rooms[game.player.room].foundColorValue-5;
		}
		else if(game.rooms[newPos.room].foundColorValue-5>game.rooms[game.player.room].foundColorValue)
		{
			game.rooms[game.player.room].foundColor = game.rooms[newPos.room].foundColor;
			game.rooms[game.player.room].foundColorValue = game.rooms[newPos.room].foundColorValue-5;
		}
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
		var flag = game.blueFlag;
		if(game.player.room==flag.room)
		{
			if(game.player.x+game.player.w>flag.x
			&&game.player.x<flag.x+flag.w
			&&game.player.y+game.player.h>flag.y
			&&game.player.y<flag.y+flag.h)
			{
				if(!game.blueFlagCaptured)
				{
					if(flag.x!=game.blueCapturePoint[0]||flag.y!=game.blueCapturePoint[1]||flag.room!=game.blueCapturePoint[2])
					{
						CLIENT.flagReturned();
					}
				}
			}
		}
		if(game.player.room==game.blueCapturePoint[2])
		{
			if(game.player.gotFlag==1)
			{
				if(game.player.x+game.player.w>game.blueCapturePoint[0]
				&&game.player.x<game.blueCapturePoint[0]+game.player.w
				&&game.player.y+game.player.h>game.blueCapturePoint[1]
				&&game.player.y<game.blueCapturePoint[1]+game.player.h)
				{
					if(!game.blueFlagCaptured)
					{
						if(game.blueFlag.x==game.blueCapturePoint[0]&&game.blueFlag.y==game.blueCapturePoint[1]&&game.blueFlag.room==game.blueCapturePoint[2])
						{
							CLIENT.captureFlag();
						}
					}
				}
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
		var flag = game.redFlag;
		if(game.player.room==flag.room)
		{
			if(game.player.x+game.player.w>flag.x
			&&game.player.x<flag.x+flag.w
			&&game.player.y+game.player.h>flag.y
			&&game.player.y<flag.y+flag.h)
			{
				if(!game.redFlagCaptured)
				{
					if(flag.x!=game.redCapturePoint[0]||flag.y!=game.redCapturePoint[1]||flag.room!=game.redCapturePoint[2])
					{
						CLIENT.flagReturned();
					}
				}
			}
		}
		if(game.player.room==game.redCapturePoint[2])
		{
			if(game.player.gotFlag==1)
			{
				if(game.player.x+game.player.w>game.redCapturePoint[0]
				&&game.player.x<game.redCapturePoint[0]+game.player.w
				&&game.player.y+game.player.h>game.redCapturePoint[1]
				&&game.player.y<game.redCapturePoint[1]+game.player.h)
				{
					if(!game.redFlagCaptured)
					{
						if(game.redFlag.x==game.redCapturePoint[0]&&game.redFlag.y==game.redCapturePoint[1]&&game.redFlag.room==game.redCapturePoint[2])
						{
							CLIENT.captureFlag();
						}
					}
				}
			}
		}
	}
	for( var i = 0; i < game.bullets.length;i++)
	{
		if(game.bullets[i] != null)
		{
			game.bullets[i].update();
			if(game.bullets[i].room == game.player.room)
			{
				if(game.bullets[i] != null)
				{
					if(game.bullets[i].team!=main.playerTeam)
					{
						if(game.player.x+game.player.w>game.bullets[i].x
						&&game.player.x<game.bullets[i].x+game.bullets[i].w
						&&game.player.y+game.player.h>game.bullets[i].y
						&&game.player.y<game.bullets[i].y+game.bullets[i].h)
						{
							game.player.health-=20;
							game.bullets[i] = null;
						}
					}
				}
			}
			if(game.bullets[i] != null)
			{
				if(game.rooms[game.bullets[i].room].checkCollide(game.bullets[i]))
				{
					game.bullets[i] = null;
				}
			}
			if(game.bullets[i] != null)
			{
				if(game.bullets[i].team=="blue")
				{
					for(var j = 0; j < redTeam.length;j++)
					{
						if(playerGameData[redTeam[j]]!=0&&game.bullets[i] != null)
						{
							if(playerGameData[redTeam[j]].room==game.bullets[i].room)
							{
								if(playerGameData[redTeam[j]].x+game.player.w>game.bullets[i].x
								&&playerGameData[redTeam[j]].x<game.bullets[i].x+game.bullets[i].w
								&&playerGameData[redTeam[j]].y+game.player.h>game.bullets[i].y
								&&playerGameData[redTeam[j]].y<game.bullets[i].y+game.bullets[i].h)
								{
									game.bullets[i] = null;
								}
							}
						}
					}
				}
				else
				{
					for(var j = 0; j < blueTeam.length;j++)
					{
						if(playerGameData[blueTeam[j]]!=0&&game.bullets[i] != null)
						{
							if(playerGameData[blueTeam[j]].room==game.bullets[i].room)
							{
								if(playerGameData[blueTeam[j]].x+game.player.w>game.bullets[i].x
								&&playerGameData[blueTeam[j]].x<game.bullets[i].x+game.bullets[i].w
								&&playerGameData[blueTeam[j]].y+game.player.h>game.bullets[i].y
								&&playerGameData[blueTeam[j]].y<game.bullets[i].y+game.bullets[i].h)
								{
									game.bullets[i] = null;
								}
							}
						}
					}
				}
			}
		}
	}
	if(game.player.health<=0)
	{
		CLIENT.playerDied();
		game.player.setPos(96,96);
		game.player.health=100;
		if(main.playerTeam=="blue")
		{
			game.player.room=0;
		}
		if(main.playerTeam=="red")
		{
			game.player.room=1;
		}
	}
	game.timeSinceLastUpdate+=curTime.getTime()-time.getTime();
	if(game.timeSinceLastUpdate>1/30)
	{
		var msg = {"x":game.player.x,"y":game.player.y,"health":game.player.health,"rotation":game.player.rotation,"flag":game.player.gotFlag,"room":game.player.room};
		CLIENT.updatePlayer(msg);
	}
	game.Draw();
}

Game.prototype.onDoubleClick = function(e)
{
}

Game.prototype.onMouseMove = function(e)
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
	//SPACE
	if (e.keyCode == 32) 
	{
		game.keys["space"] = true;
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
	//SPACE
	if (e.keyCode == 32) 
	{
		game.keys["space"] = false;
	}
}

Game.prototype.Draw = function()
{
	
	ctx.clearRect(0,0,canvas.width, canvas.height)
	
	ctx.lineWidth=10;
	if(game.rooms[game.player.room].oriColor=="red")
	{
		ctx.strokeStyle=rgb(255,255-game.rooms[game.player.room].oriColorValue,255-game.rooms[game.player.room].oriColorValue);
	}
	if(game.rooms[game.player.room].oriColor=="blue")
	{
		ctx.strokeStyle=rgb(255-game.rooms[game.player.room].oriColorValue,255-game.rooms[game.player.room].oriColorValue,255);
	}
	ctx.strokeRect(6,6,canvas.width-12, canvas.height-12);
	
	if(game.rooms[game.player.room].foundColor=="red")
	{
		ctx.strokeStyle=rgb(255,255-game.rooms[game.player.room].foundColorValue,255-game.rooms[game.player.room].foundColorValue);
	}
	if(game.rooms[game.player.room].foundColor=="blue")
	{
		ctx.strokeStyle=rgb(255-game.rooms[game.player.room].foundColorValue,255-game.rooms[game.player.room].foundColorValue,255);
	}
	ctx.strokeRect(18,18,canvas.width-36, canvas.height-36);
	
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(2,2,canvas.width-4, canvas.height-4);
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(12,12,canvas.width-24, canvas.height-24);
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(24,24,canvas.width-48, canvas.height-48);
	
	var offSetX = -game.player.x+(canvas.width/2);
	var offSetY = -game.player.y+(canvas.height/2);
	
	game.rooms[game.player.room].draw(offSetX,offSetY);
	if(game.player.room==game.redCapturePoint[2])
	{
		ctx.drawImage(images.redCrystalBase,game.redCapturePoint[0]+offSetX,game.redCapturePoint[1]+offSetY-32);
	}
	if(game.player.room==game.blueCapturePoint[2])
	{
		ctx.drawImage(images.blueCrystalBase,game.blueCapturePoint[0]+offSetX,game.blueCapturePoint[1]+offSetY-32);
	}
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
						ctx.drawImage(images.redGrabbedCrystal,playerGameData[blueTeam[i]].x+offSetX+8,playerGameData[blueTeam[i]].y+offSetY);
						/*ctx.fillStyle=rgb(255,0,0);
						ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,game.player.w,10);	
						ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,5,game.player.h);	*/
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
						ctx.drawImage(images.blueGrabbedCrystal,playerGameData[redTeam[i]].x+offSetX+8,playerGameData[redTeam[i]].y+offSetY);
						/*ctx.fillStyle=rgb(0,0,255);
						ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,game.player.w,10);	
						ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,5,game.player.h);	*/
					}
				}
			}
		}
	}
	
	game.player.draw(offSetX,offSetY);
	for( var i = 0; i < game.bullets.length;i++)
	{
		if(game.bullets[i] != null)
		{
			if(game.bullets[i].room == game.player.room)
			{
				game.bullets[i].draw(offSetX,offSetY);
			}
		}
	}
	/*for(var i = 0; i < game.rooms.length;i++)
	{
		game.rooms[i].draw();
	}*/
	if(!game.blueFlagCaptured)
	{
		if(game.player.room==game.blueFlag.room)
		{
			ctx.drawImage(images.blueStandingCrystal,game.blueFlag.x+offSetX,game.blueFlag.y+offSetY-32);
			//game.blueFlag.draw(offSetX,offSetY);
		}
	}
	if(!game.redFlagCaptured)
	{
		if(game.player.room==game.redFlag.room)
		{
			ctx.drawImage(images.redStandingCrystal,game.redFlag.x+offSetX,game.redFlag.y+offSetY-32);
			//game.redFlag.draw(offSetX,offSetY);
		}
	}
	
	
	
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="20px Lucida Console";
	
	ctx.fillStyle = rgb(255, 0, 0);
	ctx.fillText(game.redPoints, 760, 50);
	if(game.redFlagCaptured)
	{
		ctx.drawImage(images.redGrabbedCrystal,250,34);
	}
	
	ctx.fillStyle = rgb(0, 0, 255);
	ctx.fillText(game.bluePoints, 200, 50);
	if(game.blueFlagCaptured)
	{
		ctx.drawImage(images.blueGrabbedCrystal,710,34);
	}
	
}
	