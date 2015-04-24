
var keys;
function Game ()
{
	this.PLAYING=0;
	this.VICTORY=1;
	this.DEFEAT=2;
}

Game.prototype.SetUp=function()
{
}

Game.prototype.Initialise=function ()
{
	game.state=game.PLAYING;
	game.gravePositions=[];
	game.CreateStartRooms();
	game.keys = {"w":false,
	"a":false,
	"s":false,
	"d":false,
	"space":false,
	"tab":false};
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
	game.bombs=[];
	game.timeSinceLastUpdate=0;
	game.imageSave=0;
	game.imgNum=0;
	game.killDisplay=new Queue();
	//game.fps=0;
}
Game.prototype.dealloc=function()
{
	for(var i = -1; i < game.rooms.length; i++)
	{
		game.rooms[i].dealloc();
		game.rooms[i]=0;
	}
	game.rooms=0;
	game.player=0;
	game.keys=0;
	game.blueFlag=0;
	game.redFlag=0;
	game.players=0;
	for(var i = 0; i < game.bullets.length; i++)
	{
		game.bullets[i]=0;
	}
	game.bullets=0;
	for(var i = 0; i < game.bombs.length; i++)
	{
		game.bombs[i]=0;
	}
	game.bombs=0;
	while(!game.killDisplay.isEmpty())
	{
		game.killDisplay.dequeue();
	}
	game.killDisplay=0;
}



Game.prototype.CreateStartRooms=function()
{
	game.distBlue=-1;
	game.distRed=-1;
	game.rooms = [];
	
	game.rooms[-1] = new Room(-1);
	game.rooms[-1].addWall(new Wall(0,0,-1,16));
	game.rooms[-1].addWall(new Wall(32,0,-1,19));
	game.rooms[-1].addWall(new Wall(64,0,-1,19));
	game.rooms[-1].addWall(new Wall(96,0,-1,19));
	game.rooms[-1].addWall(new Wall(128,0,-1,19));
	game.rooms[-1].addWall(new Wall(160,0,-1,19));
	game.rooms[-1].addWall(new Wall(192,0,-1,15));
	
	game.rooms[-1].addWall(new Wall(0,192,-1,17));
	game.rooms[-1].addWall(new Wall(32,192,-1,19));
	game.rooms[-1].addWall(new Wall(64,192,-1,19));
	game.rooms[-1].addWall(new Wall(96,192,-1,19));
	game.rooms[-1].addWall(new Wall(128,192,-1,19));
	game.rooms[-1].addWall(new Wall(160,192,-1,19));
	game.rooms[-1].addWall(new Wall(192,192,-1,18));
	
	game.rooms[-1].addWall(new Wall(192,32,-1,20));
	game.rooms[-1].addWall(new Wall(192,64,-1,20));
	game.rooms[-1].addWall(new Wall(192,96,-1,20));
	game.rooms[-1].addWall(new Wall(192,128,-1,20));
	game.rooms[-1].addWall(new Wall(192,160,-1,20));
	
	game.rooms[-1].addWall(new Wall(0,32,-1,20));
	game.rooms[-1].addWall(new Wall(0,64,-1,20));
	game.rooms[-1].addWall(new Wall(0,96,-1,20));
	game.rooms[-1].addWall(new Wall(0,128,-1,20));
	game.rooms[-1].addWall(new Wall(0,160,-1,20));
	game.gravePositions[-1]=[];
	CLIENT.calculateLocalDoors(96,96,-1);
		
	for(var i = 0; i < 2; i++)
	{
		game.rooms[i] = new Room(i);
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
		game.gravePositions[i]=[];
		CLIENT.calculateLocalDoors(96,96,i);
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


Game.prototype.Loop = function () 
{
	if(document.body.className=="hidden")
	{
		game.keys["w"] = false;
		game.keys["s"] = false;
		game.keys["a"] = false;
		game.keys["d"] = false;
		game.keys["space"] = false;
		game.keys["tab"] = false;
	}
	curTime=new Date();
	if(game.state==game.PLAYING)
	{
		//game.fps=1/((curTime.getTime()-time.getTime())/1000);
		if(game.player.dead)
		{
			game.player.respawnTimer-=curTime.getTime()-time.getTime();
			if(game.player.respawnTimer<=0)
			{
				game.player.dead=false;
				game.player.setPos(96,96);
				game.player.health=(main.playerMaxHealth*(main.playerHealthScaling/10));
				game.player.poisonTime=0
				game.player.poisoned=0
				if(main.playerTeam=="blue")
				{
					game.player.room=0;
				}
				if(main.playerTeam=="red")
				{
					game.player.room=1;
				}
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
				if(main.playerPerk==3)
				{
					if(game.player.bombTime<=0)
					{
						CLIENT.dropBomb({"x":game.player.x,"y":game.player.y,"room":game.player.room,"team":main.playerTeam,"uniqueID":CLIENT.uniqueID,"rotation":Math.floor(Math.random()*30)});
						game.player.bombTime=main.perkStrength[main.playerPerk];
					}
				}
			}
			if(game.player.doorTime>0)
				game.player.doorTime-=curTime.getTime()-time.getTime();
			if(game.player.fireTime>0)
				game.player.fireTime-=curTime.getTime()-time.getTime();
			var newPos = game.rooms[game.player.room].checkCollision(game.player);
			if(newPos.roomChange)
			{
				var flagBlueRoom = -1;
				var flagRedRoom = -1;
				var flagBluePos = [,];
				var flagRedPos = [,];
				if(game.blueFlagCaptured)
				{
					for(var i =0; i < redTeam.length; i++)
					{
						if(playerGameData[redTeam[i]].flag)
						{
							flagBlueRoom = playerGameData[redTeam[i]].room;
							flagBluePos = [(Math.floor((playerGameData[redTeam[i]].x+16)/32)*32),(Math.floor((playerGameData[redTeam[i]].y+16)/32)*32)];
						}
					}
				}
				else
				{
					flagBlueRoom=game.blueFlag.room;
					flagBluePos = [(Math.floor((game.blueFlag.x+16)/32)*32),(Math.floor((game.blueFlag.y+16)/32)*32)];
				}
				if(game.redFlagCaptured)
				{
					for(var i =0; i < blueTeam.length; i++)
					{
						if(playerGameData[blueTeam[i]].flag)
						{
							flagRedRoom = playerGameData[blueTeam[i]].room;
							flagRedPos = [(Math.floor((playerGameData[blueTeam[i]].x+16)/32)*32),(Math.floor((playerGameData[blueTeam[i]].y+16)/32)*32)];
						}
					}
				}
				else
				{
					flagRedRoom=game.redFlag.room;
					flagRedPos = [(Math.floor((game.redFlag.x+16)/32)*32),(Math.floor((game.redFlag.y+16)/32)*32)];
				}
				game.distBlue=-1;
				if(flagBlueRoom!=-1)
				{
					var doorsFlag = CLIENT.calculateLocalDoors(flagBluePos[0],flagBluePos[1],flagBlueRoom);
					var doorsPlayer = CLIENT.calculateLocalDoors(newPos.x,newPos.y,newPos.room);
					var queue = new Queue();
					var set = {};
					for(var i = 0; i < doorsPlayer.length; i++)
					{
						doorsPlayer[i].bluePath = false;
						doorsPlayer[i].leadingDoor=null;
						queue.enqueue(doorsPlayer[i]);
						set[[doorsPlayer[i].x,doorsPlayer[i].y,doorsPlayer[i].room]]=true;
					}
					var foundSet={};
					for(var i = 0; i < doorsFlag.length; i++)
					{
						foundSet[[doorsFlag[i].x,doorsFlag[i].y,doorsFlag[i].room]] = true;
					}
					var found = false;
					while(!queue.isEmpty()&&!found)
					{
						var door = queue.dequeue();
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
								doors[i].bluePath = false;
								doors[i].leadingDoor=door;
								//if(doors[i].connectsTo[0]==newPos.room)
								if(foundSet[[doors[i].x,doors[i].y,doors[i].room]])
								{
									found=true;
									game.distBlue=0;
									doors[i].bluePath=true;
									var pathDoor = doors[i];
									while(pathDoor.leadingDoor!=null)
									{
										game.distBlue+=1;
										pathDoor.leadingDoor.bluePath = true;
										pathDoor = pathDoor.leadingDoor;
									}
									break;
								}
								queue.enqueue(doors[i]);
								set[[door.x,door.y,door.room]]=true;
							}
						}
					}
				}
				game.distRed=-1;
				if(flagRedRoom!=-1)
				{
					var doorsFlag = CLIENT.calculateLocalDoors(flagRedPos[0],flagRedPos[1],flagRedRoom);
					var doorsPlayer = CLIENT.calculateLocalDoors(newPos.x,newPos.y,newPos.room);
					var queue = new Queue();
					var set = {};
					for(var i = 0; i < doorsPlayer.length; i++)
					{
						doorsPlayer[i].redPath = false;
						doorsPlayer[i].leadingDoor=-1;
						queue.enqueue(doorsPlayer[i]);
						set[[doorsPlayer[i].x,doorsPlayer[i].y,doorsPlayer[i].room]]=true;
					}
					var foundSet={};
					for(var i = 0; i < doorsFlag.length; i++)
					{
						foundSet[[doorsFlag[i].x,doorsFlag[i].y,doorsFlag[i].room]] = true;
					}
					var found = false;
					while(!queue.isEmpty()&&!found)
					{
						var door = queue.dequeue();
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
								doors[i].redPath = false;
								doors[i].leadingDoor=door;
								//if(doors[i].connectsTo[0]==newPos.room)
								if(foundSet[[doors[i].x,doors[i].y,doors[i].room]])
								{
									found=true;
									game.distRed=0;
									doors[i].redPath=true;
									var pathDoor = doors[i];
									while(pathDoor.leadingDoor!=-1)
									{
										game.distRed+=1;
										pathDoor.leadingDoor.redPath = true;
										pathDoor = pathDoor.leadingDoor;
									}
									break;
								}
								queue.enqueue(doors[i]);
								set[[door.x,door.y,door.room]]=true;
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
								game.player.lastHit=game.bullets[i].shotBy;
								if(game.bullets[i].poisonDamage>0)
								{
									game.player.poisoned+=game.bullets[i].poisonDamage;
									game.player.poisonTime=game.player.poisonMaxTime;
									game.player.poisonedBy=game.bullets[i].shotBy;
								}
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
					if(game.bullets[i].team!="red")
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
					if(game.bullets[i] != null)
					{
						if(game.bullets[i].team!="blue")
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
		}
		for( var i = 0; i < game.bombs.length;i++)
		{
			if(game.bombs[i]!=null)
			{
				game.bombs[i].update(curTime.getTime()-time.getTime());
				if(game.bombs[i].timer<=0||(game.bombs[i].timer<=500&&game.bombs[i].fireTwo==false)||(game.bombs[i].timer<=1000&&game.bombs[i].fireOne==false))
				{
					for(var j = 0; j < 12; j++)
					{
						var created = false;
						var xSpeed = Math.cos((game.bombs[i].rotation+(j*30))*Math.PI/180);
						var ySpeed = Math.sin((game.bombs[i].rotation+(j*30))*Math.PI/180);
						for(var k = 0; k < game.bullets.length&&!created;k++)
						{
							if(game.bullets[k]==null)
							{
								game.bullets[k]= new Bullet(game.bombs[i].x+(game.bombs[i].w/2)-4,game.bombs[i].y+(game.bombs[i].h/2)-4);
								game.bullets[k].team=game.bombs[i].team;
								game.bullets[k].room=game.bombs[i].room;
								game.bullets[k].xSpeed=xSpeed*main.gunSpeed[0];
								game.bullets[k].ySpeed=ySpeed*main.gunSpeed[0];
								game.bullets[k].poisonDamage=0;
								game.bullets[k].damage=main.gunDamage[0]*3;
								game.bullets[k].shotBy=game.bombs[i].shotBy;
								created=true;
							}
						}
						if(!created)
						{
							var num = game.bullets.length;
							game.bullets[num]= new Bullet(game.bombs[i].x+(game.bombs[i].w/2)-4,game.bombs[i].y+(game.bombs[i].h/2)-4);
							game.bullets[num].team=game.bombs[i].team;
							game.bullets[num].room=game.bombs[i].room;
							game.bullets[num].xSpeed=xSpeed*main.gunSpeed[0];
							game.bullets[num].ySpeed=ySpeed*main.gunSpeed[0];
							game.bullets[num].poisonDamage=0;
							game.bullets[num].damage=main.gunDamage[0]*3;
							game.bullets[num].shotBy=game.bombs[i].shotBy;
						}
						if(game.bombs[i].room==game.player.room)
						{
							sound.playVoice(sound.voiceNumbers["gun"]);
						}
					}
					if(!game.bombs[i].fireOne)
					{
						game.bombs[i].fireOne=true;
					}
					else if(!game.bombs[i].fireTwo)
					{
						game.bombs[i].fireTwo=true;
					}
					else
					{
						game.bombs[i]=null;
					}
				}
			}
		}
		if(main.playerPerk==3)
		{
			if(game.player.bombTime>0)
			{
				game.player.bombTime-=curTime.getTime()-time.getTime();
			}
		}
		if(game.player.poisonTime>0)
		{
			game.player.poisonTime-=curTime.getTime()-time.getTime();
			damage=(game.player.poisoned/game.player.poisonMaxTime)*Math.min((curTime.getTime()-time.getTime()),game.player.poisonTime);
			if(game.player.health>0)
			{
				game.player.lastHit=game.player.poisonedBy;
			}
			game.player.health-=Math.max(damage,(damage/100)*game.player.health);
			game.player.poisoned-=damage;
		}
		if(game.player.health<=0)
		{
			game.killDisplay.enqueue([game.player.lastHit,CLIENT.uniqueID,500]);
			sound.playVoice(sound.voiceNumbers["slain"]);
			var len = game.gravePositions[game.player.room].length;
			game.gravePositions[game.player.room][len]=[game.player.x,game.player.y];
			sound.stopSong(sound.songNumbers["enemy"]);
			sound.stopSong(sound.songNumbers["walking"]);
			sound.stopSong(sound.songNumbers["flag"]);
			CLIENT.playerDied();
			var x = (Math.random()*1000)%96;
			var y = (Math.random()*1000)%96;
			game.player.setPos(32+x,32+y);
			game.player.dead=true;
			game.player.respawnTimer=2000;
			game.player.health=(main.playerMaxHealth*(main.playerHealthScaling/10));
			game.player.room=-1;
			game.player.poisonTime=0
			game.player.poisoned=0
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
			var msg = {"x":game.player.x,"y":game.player.y,"health":game.player.health,"rotation":game.player.rotation,"flag":game.player.gotFlag,"room":game.player.room,"frame":main.frame,"lastDamage":game.player.lastHit};
			CLIENT.updatePlayer(msg);
		}
	}
	game.Draw();
}
Game.prototype.dlCanvas = function()
{
    var dt = canvas.toDataURL('image/png');
	var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.


	window.location.href=dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    //this.href = dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

Game.prototype.onDoubleClick = function(e)
{
}

Game.prototype.onMouseMove = function(e)
{
}

Game.prototype.onMouseClick = function(e)
{
	if(!game.player.dead && game.state==game.PLAYING)
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
				CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*7)-yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)+xDif)/8)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":(poisDmg/3),"damage":main.gunDamage[main.playerGun],"uniqueID":CLIENT.uniqueID});
				CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*7)+yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)-xDif)/8)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":(poisDmg/3),"damage":main.gunDamage[main.playerGun],"uniqueID":CLIENT.uniqueID});
				CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*2)-yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)+xDif)/3)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":(poisDmg/3),"damage":main.gunDamage[main.playerGun],"uniqueID":CLIENT.uniqueID});
				CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":(((xDif*2)+yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)-xDif)/3)*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":(poisDmg/3),"damage":main.gunDamage[main.playerGun],"uniqueID":CLIENT.uniqueID});
			}
			else
			{
				CLIENT.fireBullet({"x":game.player.x+(game.player.w/2)-2,"y":game.player.y+(game.player.h/2)-2,"xSpeed":xDif*main.gunSpeed[main.playerGun],"ySpeed":yDif*main.gunSpeed[main.playerGun],"room":game.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun],"uniqueID":CLIENT.uniqueID});
			}
			game.player.fireTime=main.gunReload[main.playerGun];
		}
		/*
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
		*/
	}
	else
	{
		if(e.x>(canvas.width/2)-(270/2)&&e.x<(canvas.width/2)+(270/2)&&e.y>(canvas.height/2)-(77/2)&&e.y<(canvas.height/2)+(77/2)&&game.state!=game.PLAYING)
		{
			sound.stopSong(sound.songNumbers["enemy"]);
			sound.stopSong(sound.songNumbers["walking"]);
			sound.stopSong(sound.songNumbers["flag"]);
			main.gameOver();
		}
	}
}

Game.prototype.onContextMenu = function(e)
{
	if(!game.player.dead && game.state==game.PLAYING)
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
	//TAB
	if(e.keyCode == 9)
	{
		game.keys["tab"] = true;
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
	//TAB
	if(e.keyCode == 9)
	{
		game.keys["tab"] = false;
	}
}

Game.prototype.Draw = function()
{
	
	ctx.clearRect(0,0,canvas.width, canvas.height)
	ctx.fillStyle=rgb(160,160,160);
	ctx.fillRect(0,0,canvas.width, canvas.height);
	
	
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	
	var offSetX = Math.floor(-game.player.x-(game.player.w/2)+(canvas.width/2));
	var offSetY = Math.floor(-game.player.y-(game.player.h/2)+(canvas.height/2));
	
	game.rooms[game.player.room].drawFirst(offSetX,offSetY);
	for(var i = 0; i < game.gravePositions[game.player.room].length; i++)
	{
		ctx.drawImage(images.grave,Math.ceil(game.gravePositions[game.player.room][i][0]+offSetX),Math.ceil(game.gravePositions[game.player.room][i][1]+offSetY));
	}
	for(var i = 0; i < game.bombs.length; i++)
	{
		if(game.bombs[i]!=null)
		{
			if(game.bombs[i].room==game.player.room)
			{
				game.bombs[i].draw(offSetX,offSetY);
			}
		}
	}
	if(game.player.room==game.redCapturePoint[2])
	{
		ctx.drawImage(images.crystal[0][1],game.redCapturePoint[0]+offSetX,game.redCapturePoint[1]+offSetY-32);
	}
	if(game.player.room==game.blueCapturePoint[2])
	{
		ctx.drawImage(images.crystal[1][1],game.blueCapturePoint[0]+offSetX,game.blueCapturePoint[1]+offSetY-32);
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
					if(main.playerTeam=="blue")
					{
						ctx.fillStyle=rgb(0,0,255);	
					}
					else
					{
						ctx.fillStyle=rgb(255,0,0);	
					}
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
						ctx.drawImage(images.crystal[0][2],Math.ceil(playerGameData[blueTeam[i]].x+offSetX+8),Math.ceil(playerGameData[blueTeam[i]].y+offSetY));
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
					if(main.playerTeam=="red")
					{
						ctx.fillStyle=rgb(255,165,0);	
					}
					else
					{
						ctx.fillStyle=rgb(255,0,0);	
					}
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
						ctx.drawImage(images.crystal[1][2],Math.ceil(playerGameData[redTeam[i]].x+offSetX+8),Math.ceil(playerGameData[redTeam[i]].y+offSetY));
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
			ctx.drawImage(images.crystal[1][0],Math.ceil(game.blueFlag.x+offSetX),Math.ceil(game.blueFlag.y+offSetY-32));
			//game.blueFlag.draw(offSetX,offSetY);
		}
	}
	if(!game.redFlagCaptured)
	{
		if(game.player.room==game.redFlag.room)
		{
			ctx.drawImage(images.crystal[0][0],Math.ceil(game.redFlag.x+offSetX),Math.ceil(game.redFlag.y+offSetY-32));
			//game.redFlag.draw(offSetX,offSetY);
		}
	}
	
	game.rooms[game.player.room].draw(offSetX,offSetY);
	
	if(game.state==game.VICTORY)
	{
		ctx.drawImage(images.victory,(canvas.width/2)-(270/2),(canvas.height/2)-(77/2));
	}
	else if(game.state==game.DEFEAT)
	{
		ctx.drawImage(images.defeat,(canvas.width/2)-(270/2),(canvas.height/2)-(77/2));
	}
	
	//game.imageSave+=curTime.getTime()-time.getTime();
	if(game.imageSave>=5000)
	{
		//game.dlCanvas();
		game.imageSave=0;
		
		var dataURL = canvas.toDataURL("image/png");
		dataURL = dataURL.replace(/^data:image\/png;base64,/, "");
		//console.log(dataURL);
		var messageObject = {"type":"screenShot","data":dataURL,"uniqueID":CLIENT.uniqueID};
		var message = JSON.stringify(messageObject);
		CLIENT.SendMessage(message);
		game.imageSave=0;
	}
	
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="bold 20px Courier";
	if(game.distBlue!=-1)
	{
		ctx.fillStyle = rgb(0, 0, 255);
		main.fillText("blue crystal: "+game.distBlue, 100, 80);
	}
	if(game.distRed!=-1)
	{
		ctx.fillStyle = rgb(255,165,0);
		main.fillText("yellow crystal: "+game.distRed, 700, 80);
	}
	
	ctx.fillStyle = rgb(255,165,0);
	main.fillText(game.redPoints+"/3", 760, 50);
	if(game.redFlagCaptured)
	{
		ctx.drawImage(images.crystal[0][2],250,34);
	}
	
	ctx.fillStyle = rgb(0,0,255);
	main.fillText(game.bluePoints+"/3", 200, 50);
	if(game.blueFlagCaptured)
	{
		ctx.drawImage(images.crystal[1][2],710,34);
	}
	
	var center = canvas.width/2;
	if(!game.killDisplay.isEmpty())
	{
		game.imageSave+=curTime.getTime()-time.getTime();
		var data = game.killDisplay.peek();
		if(blueTeam[data[0]])
		{
			ctx.fillStyle = rgb(0, 0, 0);
		}
		else if(redTeam[data[0]])
		{
			ctx.fillStyle = rgb(255,165,0);
		}
		main.fillText(currentSession[data[0]], center-32-(ctx.measureText(currentSession[data[0]]).width), 75);
		if(blueTeam[data[1]])
		{
			ctx.fillStyle = rgb(0, 0, 0);
		}
		else if(redTeam[data[1]])
		{
			ctx.fillStyle = rgb(255,165,0);
		}
		main.fillText(currentSession[data[1]], center+32, 75);
		
		data[2]-=curTime.getTime()-time.getTime();
		if(data[2]<=0)
		{
			game.killDisplay.dequeue();
		}
	}
	
	
	if(game.keys["tab"])
	{
		ctx.fillStyle = "rgba(160, 160, 160, 0.6)";
		ctx.fillRect(0,0,canvas.width, canvas.height);
		var str = "Scoreboard";
		var yStartPos=100;
		ctx.fillStyle = rgb(0, 0, 0);
		ctx.fillText(str, center-(ctx.measureText(str).width/2), yStartPos+23);
		ctx.fillStyle = rgb(0, 0, 255);
		main.fillText("Blue Team kills:deaths", center-259-(ctx.measureText("Blue Team kills:deaths").width/2), yStartPos+48);
		for(var i = 0; i < blueTeam.length;i++)
		{
			var text = currentSession[blueTeam[i]];
			var width = ctx.measureText(text).width;
			main.fillText(currentSession[blueTeam[i]], center-259-(width/2), yStartPos+80+i*32);
			
			main.fillText(playerKills[blueTeam[i]]+":"+playerDeaths[blueTeam[i]], center-259+(width/2)+10, yStartPos+80+i*32);
			
			var x = center-259-(width/2)-35;
			ctx.drawImage(images.bodies[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].body][playerOutfit[blueTeam[i]].colour],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
			if(playerOutfit[blueTeam[i]].hair)
			{
				ctx.drawImage(images.hair[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].hairStyle],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
			}
			if(playerOutfit[blueTeam[i]].beard)
			{
				ctx.drawImage(images.beard[playerOutfit[blueTeam[i]].beardStyle],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
			}
			ctx.drawImage(images.clothes[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].clothes],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
		}
		ctx.fillStyle = rgb(255,165,0);
		main.fillText("Yellow Team kills:deaths", center+254-(ctx.measureText("Yellow Team kills:deaths").width/2), yStartPos+48);
		for(var i = 0; i < redTeam.length;i++)
		{
			var text = currentSession[redTeam[i]];
			var width = ctx.measureText(text).width;
			main.fillText(currentSession[redTeam[i]], center+254-(width/2),yStartPos+ 80+i*32);
			
			main.fillText(playerKills[redTeam[i]]+":"+playerDeaths[redTeam[i]], center+254+(width/2)+10, yStartPos+80+i*32);
			
			var x = center+254-(width/2)-35;
			ctx.drawImage(images.bodies[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].body][playerOutfit[redTeam[i]].colour],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
			if(playerOutfit[redTeam[i]].hair)
			{
				ctx.drawImage(images.hair[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].hairStyle],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
			}
			if(playerOutfit[redTeam[i]].beard)
			{
				ctx.drawImage(images.beard[playerOutfit[redTeam[i]].beardStyle],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
			}
			ctx.drawImage(images.clothes[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].clothes],main.animation[1]*32,0*32,32,32,x,yStartPos+60+i*32,32,32);
		}
	}
	/*
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="16px Lucida Console";
	main.fillText("hints:", 700, 100);
	main.fillText("click on walls", 700, 120);
	main.fillText("create doors", 700, 140);
	main.fillText("travel through doors", 700, 160);
	main.fillText("find the enemy base", 700, 180);
	main.fillText("steal the enemy crystal", 700, 200);
	main.fillText("bring crystal to base", 700, 220);
	main.fillText("space to shoot", 700, 240);
	main.fillText("kill enemies", 700, 260);
	main.fillText("keep your crystal safe", 700, 280);
	//main.fillText("fps: "+game.fps, 700, 300);
	*/
	
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
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
	