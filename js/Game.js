
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
	//game.fps=0;
}

Game.prototype.CreateStartRooms=function()
{
	game.rooms = [];
	for(var i = 0; i < 2; i++)
	{
		game.rooms[i] = new Room();
		game.rooms[i].addWall(new Wall(0,0,i,1));
		game.rooms[i].addWall(new Wall(32,0,i,9));
		game.rooms[i].addWall(new Wall(64,0,i,9));
		game.rooms[i].addWall(new Wall(96,0,i,9));
		game.rooms[i].addWall(new Wall(128,0,i,9));
		game.rooms[i].addWall(new Wall(160,0,i,9));
		game.rooms[i].addWall(new Wall(192,0,i,0));
		
		game.rooms[i].addWall(new Wall(0,192,i,2));
		game.rooms[i].addWall(new Wall(32,192,i,9));
		game.rooms[i].addWall(new Wall(64,192,i,9));
		game.rooms[i].addWall(new Wall(96,192,i,9));
		game.rooms[i].addWall(new Wall(128,192,i,9));
		game.rooms[i].addWall(new Wall(160,192,i,9));
		game.rooms[i].addWall(new Wall(192,192,i,3));
		
		game.rooms[i].addWall(new Wall(192,32,i,10));
		game.rooms[i].addWall(new Wall(192,64,i,10));
		game.rooms[i].addWall(new Wall(192,96,i,10));
		game.rooms[i].addWall(new Wall(192,128,i,10));
		game.rooms[i].addWall(new Wall(192,160,i,10));
		
		game.rooms[i].addWall(new Wall(0,32,i,10));
		game.rooms[i].addWall(new Wall(0,64,i,10));
		game.rooms[i].addWall(new Wall(0,96,i,10));
		game.rooms[i].addWall(new Wall(0,128,i,10));
		game.rooms[i].addWall(new Wall(0,160,i,10));
	}
	game.rooms[0].oriColor="blue";
	game.rooms[0].foundColor="blue";
	game.rooms[0].distBlue=0;
	game.rooms[1].oriColor="red";
	game.rooms[1].foundColor="red";
	game.rooms[1].distRed=0;
}

Game.prototype.initCanvas=function ()
{
}


Game.prototype.gameLoop = function () 
{
	var curTime=new Date();
	//game.fps=1/((curTime.getTime()-time.getTime())/1000);
	if(game.player.dead)
	{
		game.player.respawnTimer-=curTime.getTime()-time.getTime();
		if(game.player.respawnTimer<=0)
		{
			game.player.dead=false;
			game.player.setPos(96,96);
		}
	}
	else
	{
		if(game.keys["w"])
		{
			var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
			if(game.player.gotFlag)
			{
				dist/=2;
				if(main.playerPerk==1)
				{
					dist*=main.perkStrength[main.playerPerk];
				}
			}
			game.player.y-=(dist*((curTime.getTime()-time.getTime())/1000));
			game.player.rotation=3;
		}
		if(game.keys["s"])
		{
			var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
			if(game.player.gotFlag)
			{
				dist/=2;
				if(main.playerPerk==1)
				{
					dist*=main.perkStrength[main.playerPerk];
				}
			}
			game.player.y+=(dist*((curTime.getTime()-time.getTime())/1000));
			game.player.rotation=0;
		}
		if(game.keys["a"])
		{
			var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
			if(game.player.gotFlag)
			{
				dist/=2;
				if(main.playerPerk==1)
				{
					dist*=main.perkStrength[main.playerPerk];
				}
			}
			game.player.x-=(dist*((curTime.getTime()-time.getTime())/1000));
			game.player.rotation=1;
		}
		if(game.keys["d"])
		{
			var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
			if(game.player.gotFlag)
			{
				dist/=2;
				if(main.playerPerk==1)
				{
					dist*=main.perkStrength[main.playerPerk];
				}
			}
			game.player.x+=(dist*((curTime.getTime()-time.getTime())/1000));
			game.player.rotation=2;
		}
		if(game.keys["w"]||game.keys["s"]||game.keys["a"]||game.keys["d"])
		{
			main.frameTime+=curTime-time;
		}
		else
		{
			if(main.frame==0)
				main.frame=1;
			if(main.frame==2)
				main.frame=3;
		}
		if(game.keys["space"])
		{
			if(game.player.fireTime<=0)
			{
				var xDif = mousePos["x"]-(canvas.width/2);
				var yDif = mousePos["y"]-(canvas.height/2);
				var length = Math.sqrt((xDif*xDif)+(yDif*yDif));
				xDif/=length;
				yDif/=length;
				var poisDmg=0;
				if(main.playerPerk==2)
				{
					poisDmg=main.perkStrength[main.playerPerk];
				}
				if(main.playerGun==1)
				{
					CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*7)-yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)+xDif)/8)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
					CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*7)+yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)-xDif)/8)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
					CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*2)-yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)+xDif)/3)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
					CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*2)+yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)-xDif)/3)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
				}
				else
				{
					CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":xDif*main.gunSpeed[main.playerGun],"ySpeed":yDif*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
				}
				game.player.fireTime=main.gunReload[main.playerGun];
			}
		}
		if(game.player.doorTime>0)
			game.player.doorTime-=curTime.getTime()-time.getTime();
		if(game.player.fireTime>0)
			game.player.fireTime-=curTime.getTime()-time.getTime();
		var newPos = game.rooms[game.player.room].checkCollision(game.player);
		if(newPos.roomChange)
		{
			var queue = new Queue();
			queue.enqueue(0);
			var set = {};
			while(!queue.isEmpty())
			{
				var roomNum = queue.dequeue();
				set[roomNum]=true;
				game.rooms[roomNum].previous=-1;
				var walls = game.rooms[roomNum].walls;
				for(var i = 0; i < walls.length; i++)
				{
					if(walls[i].door=="true")
					{
						var newRoom = walls[i].connectsTo[0];
						if(!set[newRoom])
						{
							game.rooms[newRoom].distBlue=game.rooms[roomNum].distBlue+1;
							queue.enqueue(newRoom);
						}
					}
				}
			}
			queue = new Queue();
			queue.enqueue(1);
			set = {};
			while(!queue.isEmpty())
			{
				var roomNum = queue.dequeue();
				set[roomNum]=true;
				game.rooms[roomNum].previous=-1;
				var walls = game.rooms[roomNum].walls;
				for(var i = 0; i < walls.length; i++)
				{
					if(walls[i].door=="true")
					{
						var newRoom = walls[i].connectsTo[0];
						if(!set[newRoom])
						{
							game.rooms[newRoom].distRed=game.rooms[roomNum].distRed+1;
							queue.enqueue(newRoom);
						}
					}
				}
			}
			var flagCarRoom = -1;
			var flagPos = [,];
			if(main.playerTeam == "red")
			{
				if(game.redFlagCaptured)
				{
					for(var i =0; i < blueTeam.length; i++)
					{
						if(playerGameData[blueTeam[i]].flag)
						{
							flagCarRoom = playerGameData[blueTeam[i]].room;
							flagPos = [(Math.floor((playerGameData[blueTeam[i]].x+16)/32)*32),(Math.floor((playerGameData[blueTeam[i]].y+16)/32)*32)];
						}
					}
				}
				else
				{
					if(game.blueFlagCaptured)
					{
						for(var i =0; i < redTeam.length; i++)
						{
							if(playerGameData[redTeam[i]].flag)
							{
								flagCarRoom = playerGameData[redTeam[i]].room;
								flagPos = [(Math.floor((playerGameData[redTeam[i]].x+16)/32)*32),(Math.floor((playerGameData[redTeam[i]].y+16)/32)*32)];
							}
						}
					}
					else if(!game.player.gotFlag)
					{
						flagCarRoom=game.blueFlag.room;
						flagPos = [(Math.floor((game.blueFlag.x+16)/32)*32),(Math.floor((game.blueFlag.y+16)/32)*32)];
					}
				}
			}
			if(main.playerTeam == "blue")
			{
				if(game.blueFlagCaptured)
				{
					for(var i =0; i < redTeam.length; i++)
					{
						if(playerGameData[redTeam[i]].flag)
						{
							flagCarRoom = playerGameData[redTeam[i]].room;
							flagPos = [(Math.floor((playerGameData[redTeam[i]].x+16)/32)*32),(Math.floor((playerGameData[redTeam[i]].y+16)/32)*32)];
						}
					}
				}
				else
				{
					if(game.redFlagCaptured)
					{
						for(var i =0; i < blueTeam.length; i++)
						{
							if(playerGameData[blueTeam[i]].flag)
							{
								flagCarRoom = playerGameData[blueTeam[i]].room;
								flagPos = [(Math.floor((playerGameData[blueTeam[i]].x+16)/32)*32),(Math.floor((playerGameData[blueTeam[i]].y+16)/32)*32)];
							}
						}
					}
					else if(!game.player.gotFlag)
					{
						flagCarRoom=game.redFlag.room;
						flagPos = [(Math.floor((game.redFlag.x+16)/32)*32),(Math.floor((game.redFlag.y+16)/32)*32)];
					}
				}
			}
			if(flagCarRoom!=-1)
			{
				var doorsFlag = CLIENT.calculateLocalDoors(flagPos[0],flagPos[1],flagCarRoom);
				var doorsPlayer = CLIENT.calculateLocalDoors(newPos.x,newPos.y,newPos.room);
				var queue = new Queue();
				for(var i = 0; i < doorsPlayer.length; i++)
				{
					doorsPlayer[i].path = false;
					doorsPlayer[i].leadingDoor=null;
					queue.enqueue(doorsPlayer[i]);
				}
				var foundSet={};
				for(var i = 0; i < doorsFlag.length; i++)
				{
					foundSet[[doorsFlag[i].x,doorsFlag[i].y,doorsFlag[i].room]] = true;
				}
				var set = {};
				var found = false;
				while(!queue.isEmpty()&&!found)
				{
					var door = queue.dequeue();
					set[[door.x,door.y,door.room]]=true;
					//if(door.connectsTo[0]==newPos.room)
					if(foundSet[[door.x,door.y,door.room]])
					{
						found=true;
					}
					var doors = door.connectedDoors;
					for(var i = 0; i < doors.length; i++)
					{
						if(!set[[doors[i].x,doors[i].y,doors[i].room]])
						{
							doors[i].path = false;
							doors[i].leadingDoor=door;
							//if(doors[i].connectsTo[0]==newPos.room)
							if(foundSet[[doors[i].x,doors[i].y,doors[i].room]])
							{
								found=true;
								doors[i].path=true;
								var pathDoor = doors[i];
								while(pathDoor.leadingDoor!=null)
								{
									pathDoor.leadingDoor.path = true;
									pathDoor = pathDoor.leadingDoor;
								}
							}
							queue.enqueue(doors[i]);
						}
					}
				}
			}
			game.player.room = newPos.room;
		}
		if(game.player.gotFlag)
		{
			sound.stopSong(sound.songNumbers["enemy"]);
			sound.stopSong(sound.songNumbers["walking"]);
			sound.playSong(sound.songNumbers["flag"]);
		}
		else
		{
			sound.stopSong(sound.songNumbers["flag"]);
			sound.stopSong(sound.songNumbers["enemy"]);
			sound.playSong(sound.songNumbers["walking"]);
			
			if(main.playerTeam == "blue")
			{
				for(var i =0; i < redTeam.length; i++)
				{
					if(playerGameData[redTeam[i]].room == game.player.room)
					{
						sound.playSong(sound.songNumbers["enemy"]);
						sound.stopSong(sound.songNumbers["walking"]);
					}
				}
			}
			else if(main.playerTeam == "red")
			{
				for(var i =0; i < blueTeam.length; i++)
				{
					if(playerGameData[blueTeam[i]].room == game.player.room)
					{
						sound.playSong(sound.songNumbers["enemy"]);
						sound.stopSong(sound.songNumbers["walking"]);
					}
				}
			}
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
	}
	for( var i = 0; i < game.bullets.length;i++)
	{
		if(game.bullets[i] != null)
		{
			game.bullets[i].update(((curTime.getTime()-time.getTime())/1000));
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
							game.player.health-=game.bullets[i].damage;
							game.player.poisoned+=game.bullets[i].poisonDamage;
							game.player.poisonTime=game.player.poisonMaxTime;
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
	if(game.player.poisonTime>0)
	{
		game.player.poisonTime-=curTime.getTime()-time.getTime();
		damage=(game.player.poisoned/game.player.poisonMaxTime)*Math.min((curTime.getTime()-time.getTime()),game.player.poisonTime);
		game.player.health-=Math.max(damage,(damage/100)*game.player.health);
		game.player.poisoned-=damage;
	}
	if(game.player.health<=0)
	{
		sound.stopSong(sound.songNumbers["enemy"]);
		sound.stopSong(sound.songNumbers["walking"]);
		sound.stopSong(sound.songNumbers["flag"]);
		CLIENT.playerDied();
		game.player.setPos(-32,-32);
		game.player.dead=true;
		game.player.respawnTimer=1000;
		game.player.health=(main.playerMaxHealth*(main.playerHealthScaling/10));
		if(main.playerTeam=="blue")
		{
			game.player.room=0;
		}
		if(main.playerTeam=="red")
		{
			game.player.room=1;
		}
	}
	if(main.playerPerk==0)
	{
		game.player.health+=((main.playerMaxHealth*(main.playerHealthScaling/10))*(main.perkStrength[main.playerPerk]/100))*((curTime.getTime()-time.getTime())/1000);
	}
	if(game.player.health>(main.playerMaxHealth*(main.playerHealthScaling/10)))
	{
		game.player.health=(main.playerMaxHealth*(main.playerHealthScaling/10));
	}
	game.timeSinceLastUpdate+=curTime.getTime()-time.getTime();
	if(game.timeSinceLastUpdate>1000/30)
	{
		game.timeSinceLastUpdate=0;
		var msg = {"x":game.player.x,"y":game.player.y,"health":game.player.health,"rotation":game.player.rotation,"flag":game.player.gotFlag,"room":game.player.room,"frame":main.frame};
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
	if(!game.player.dead)
	{
		var offSetX = -game.player.x-(game.player.w/2)+(canvas.width/2);
		var offSetY = -game.player.y-(game.player.h/2)+(canvas.height/2);
		//var offSetX = -game.player.x+(canvas.width/2);
		//var offSetY = -game.player.y+(canvas.height/2);
		var inGamePos=[];
		inGamePos["x"]=e.x-offSetX;
		inGamePos["y"]=e.y-offSetY+16;
		inGamePos.x/=32;
		inGamePos.x=Math.floor(inGamePos.x);
		inGamePos.y/=32;
		inGamePos.y=Math.floor(inGamePos.y);
		CLIENT.createDoor(inGamePos.x,inGamePos.y,game.player.room);
	}
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
	
	/*ctx.lineWidth=10;
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
	ctx.strokeRect(24,24,canvas.width-48, canvas.height-48);*/
	
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
	
	var offSetX = Math.floor(-game.player.x-(game.player.w/2)+(canvas.width/2));
	var offSetY = Math.floor(-game.player.y-(game.player.h/2)+(canvas.height/2));
	
	game.rooms[game.player.room].drawFirst(offSetX,offSetY);
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
					ctx.fillRect(Math.ceil(playerGameData[blueTeam[i]].x-1+offSetX),Math.ceil(playerGameData[blueTeam[i]].y-11+offSetY),game.player.w+2,7);
					ctx.fillStyle=rgb(0,0,255);	
					ctx.fillRect(Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y-10+offSetY),game.player.w*(playerGameData[blueTeam[i]].health/(main.playerMaxHealth*(playerOutfit[blueTeam[i]].playerHealthScaling/10))),5);
					
					//ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,game.player.w,game.player.h);
					
					
					ctx.drawImage(images.bodies[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].body][playerOutfit[blueTeam[i]].colour],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),game.player.w,game.player.h);
					if(playerOutfit[blueTeam[i]].hair)
					{
						ctx.drawImage(images.hair[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].hairStyle],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),game.player.w,game.player.h);
					}
					if(playerOutfit[blueTeam[i]].beard)
					{
						ctx.drawImage(images.beard[playerOutfit[blueTeam[i]].beardStyle],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),game.player.w,game.player.h);
					}
					ctx.drawImage(images.clothes[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].clothes],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),game.player.w,game.player.h);
					
					
					
					if(playerGameData[blueTeam[i]].flag==1)
					{
						ctx.drawImage(images.redGrabbedCrystal,Math.ceil(playerGameData[blueTeam[i]].x+offSetX+8),Math.ceil(playerGameData[blueTeam[i]].y+offSetY));
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
					ctx.fillRect(Math.ceil(playerGameData[redTeam[i]].x-1+offSetX),Math.ceil(playerGameData[redTeam[i]].y-11+offSetY),game.player.w+2,7);
					ctx.fillStyle = rgb(255, 0, 0);
					ctx.fillRect(Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y-10+offSetY),game.player.w*(playerGameData[redTeam[i]].health/(main.playerMaxHealth*(playerOutfit[redTeam[i]].playerHealthScaling/10))),5);
					
					//ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,game.player.w,game.player.h);
					
					
					ctx.drawImage(images.bodies[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].body][playerOutfit[redTeam[i]].colour],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),game.player.w,game.player.h);
					if(playerOutfit[redTeam[i]].hair)
					{
						ctx.drawImage(images.hair[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].hairStyle],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),game.player.w,game.player.h);
					}
					if(playerOutfit[redTeam[i]].beard)
					{
						ctx.drawImage(images.beard[playerOutfit[redTeam[i]].beardStyle],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),game.player.w,game.player.h);
					}
					ctx.drawImage(images.clothes[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].clothes],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),game.player.w,game.player.h);
					
					
					if(playerGameData[redTeam[i]].flag==1)
					{
						ctx.drawImage(images.blueGrabbedCrystal,Math.ceil(playerGameData[redTeam[i]].x+offSetX+8),Math.ceil(playerGameData[redTeam[i]].y+offSetY));
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
			ctx.drawImage(images.blueStandingCrystal,Math.ceil(game.blueFlag.x+offSetX),Math.ceil(game.blueFlag.y+offSetY-32));
			//game.blueFlag.draw(offSetX,offSetY);
		}
	}
	if(!game.redFlagCaptured)
	{
		if(game.player.room==game.redFlag.room)
		{
			ctx.drawImage(images.redStandingCrystal,Math.ceil(game.redFlag.x+offSetX),Math.ceil(game.redFlag.y+offSetY-32));
			//game.redFlag.draw(offSetX,offSetY);
		}
	}
	
	game.rooms[game.player.room].draw(offSetX,offSetY);
	
	
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="20px Lucida Console";
	if(game.rooms[game.player.room].distBlue!=-1)
	{
		ctx.fillStyle = rgb(0, 0, 255);
		ctx.fillText("blue base: "+game.rooms[game.player.room].distBlue, 100, 80);
	}
	if(game.rooms[game.player.room].distRed!=-1)
	{
		ctx.fillStyle = rgb(255, 0, 0);
		ctx.fillText("red base: "+game.rooms[game.player.room].distRed, 700, 80);
	}
	
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
	
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="16px Lucida Console";
	ctx.fillText("hints:", 700, 100);
	ctx.fillText("click on walls", 700, 120);
	ctx.fillText("create doors", 700, 140);
	ctx.fillText("travel through doors", 700, 160);
	ctx.fillText("find the enemy base", 700, 180);
	ctx.fillText("steal the enemy crystal", 700, 200);
	ctx.fillText("bring crystal to base", 700, 220);
	ctx.fillText("space to shoot", 700, 240);
	ctx.fillText("kill enemies", 700, 260);
	ctx.fillText("keep your crystal safe", 700, 280);
	//ctx.fillText("fps: "+game.fps, 700, 300);
	
}









/*

	var queue = new Queue();
	var set = {};
	var walls = game.rooms[flagCarRoom].walls;
	for(var i = 0; i < walls.length; i++)
	{
		if(walls[i].door=="true")
		{
			walls[i].path = false;
			walls[i].leadingDoor=null;
			queue.enqueue(walls[i]);
		}
	}
	var found = false;
	while(!queue.isEmpty()&&!found)
	{
		var door = queue.dequeue();
		set[door]=true;
		if(door.connectsTo[0]==newPos.room)
		{
			found=true;
			door.path=true;
			var pathDoor = door;
			while(pathDoor.leadingDoor!=null)
			{
				pathDoor.path = true;
				pathDoor = pathDoor.leadingDoor;
			}
		}
		var doors = door.connectedDoors;
		for(var i = 0; i < doors.length; i++)
		{
			if(!set[doors[i]])
			{
				doors[i].path = false;
				doors[i].leadingDoor=door;
				if(doors[i].connectsTo[0]==newPos.room)
				{
					found=true;
					doors[i].path=true;
					var pathDoor = doors[i];
					while(pathDoor.leadingDoor!=null)
					{
						pathDoor.path = true;
						pathDoor = pathDoor.leadingDoor;
					}
				}
				queue.enqueue(doors[i]);
			}
		}
	}




*/
	