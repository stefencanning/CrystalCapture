
var keys;
function Tutorial()
{
	this.PLAYING=0;
	this.VICTORY=1;
	this.DEFEAT=2;
}

Tutorial.prototype.SetUp=function()
{
}

Tutorial.prototype.Initialise=function ()
{
	tutorial.state=tutorial.PLAYING;
	tutorial.gravePositions=[];
	tutorial.CreateStartRooms();
	tutorial.keys = {"w":false,
	"a":false,
	"s":false,
	"d":false};
	tutorial.player = new Player(96,96);
	if(main.playerTeam=="blue")
	{
		tutorial.player.room=0;
	}
	if(main.playerTeam=="red")
	{
		tutorial.player.room=1;
	}
	tutorial.blueFlagCapture=false;
	tutorial.redFlagCapture=false;
	tutorial.blueFlag=new Flag(96,96,"blue");
	tutorial.blueFlag.room=0;
	tutorial.redFlag=new Flag(96,96,"red");
	tutorial.redFlag.room=1;
	tutorial.redCapturePoint = [96,96,1];
	tutorial.blueCapturePoint = [96,96,0];
	tutorial.redPoints=0;
	tutorial.bluePoints=0;
	tutorial.players=[];
	tutorial.bullets=[];
	//tutorial.fps=0;
}
Tutorial.prototype.dealloc=function()
{
	for(var i = -1; i < tutorial.rooms.length; i++)
	{
		tutorial.rooms[i].dealloc();
		tutorial.rooms[i]=0;
	}
	tutorial.rooms=0;
	tutorial.player=0;
	tutorial.keys=0;
	tutorial.blueFlag=0;
	tutorial.redFlag=0;
	tutorial.players=0;
	tutorial.bullets=0;
}



Tutorial.prototype.CreateStartRooms=function()
{
	tutorial.distBlue=-1;
	tutorial.distRed=-1;
	tutorial.rooms = [];
	
	tutorial.rooms[-1] = new Room(-1);
	tutorial.rooms[-1].addWall(new Wall(0,0,-1,16));
	tutorial.rooms[-1].addWall(new Wall(32,0,-1,19));
	tutorial.rooms[-1].addWall(new Wall(64,0,-1,19));
	tutorial.rooms[-1].addWall(new Wall(96,0,-1,19));
	tutorial.rooms[-1].addWall(new Wall(128,0,-1,19));
	tutorial.rooms[-1].addWall(new Wall(160,0,-1,19));
	tutorial.rooms[-1].addWall(new Wall(192,0,-1,15));
	
	tutorial.rooms[-1].addWall(new Wall(0,192,-1,17));
	tutorial.rooms[-1].addWall(new Wall(32,192,-1,19));
	tutorial.rooms[-1].addWall(new Wall(64,192,-1,19));
	tutorial.rooms[-1].addWall(new Wall(96,192,-1,19));
	tutorial.rooms[-1].addWall(new Wall(128,192,-1,19));
	tutorial.rooms[-1].addWall(new Wall(160,192,-1,19));
	tutorial.rooms[-1].addWall(new Wall(192,192,-1,18));
	
	tutorial.rooms[-1].addWall(new Wall(192,32,-1,20));
	tutorial.rooms[-1].addWall(new Wall(192,64,-1,20));
	tutorial.rooms[-1].addWall(new Wall(192,96,-1,20));
	tutorial.rooms[-1].addWall(new Wall(192,128,-1,20));
	tutorial.rooms[-1].addWall(new Wall(192,160,-1,20));
	
	tutorial.rooms[-1].addWall(new Wall(0,32,-1,20));
	tutorial.rooms[-1].addWall(new Wall(0,64,-1,20));
	tutorial.rooms[-1].addWall(new Wall(0,96,-1,20));
	tutorial.rooms[-1].addWall(new Wall(0,128,-1,20));
	tutorial.rooms[-1].addWall(new Wall(0,160,-1,20));
	tutorial.gravePositions[-1]=[];
	CLIENT.calculateLocalDoors(96,96,-1);
		
	for(var i = 0; i < 2; i++)
	{
		tutorial.rooms[i] = new Room(i);
		tutorial.rooms[i].addWall(new Wall(0,0,i,1));
		tutorial.rooms[i].addWall(new Wall(32,0,i,9));
		tutorial.rooms[i].addWall(new Wall(64,0,i,9));
		tutorial.rooms[i].addWall(new Wall(96,0,i,9));
		tutorial.rooms[i].addWall(new Wall(128,0,i,9));
		tutorial.rooms[i].addWall(new Wall(160,0,i,9));
		tutorial.rooms[i].addWall(new Wall(192,0,i,0));
		
		tutorial.rooms[i].addWall(new Wall(0,192,i,2));
		tutorial.rooms[i].addWall(new Wall(32,192,i,9));
		tutorial.rooms[i].addWall(new Wall(64,192,i,9));
		tutorial.rooms[i].addWall(new Wall(96,192,i,9));
		tutorial.rooms[i].addWall(new Wall(128,192,i,9));
		tutorial.rooms[i].addWall(new Wall(160,192,i,9));
		tutorial.rooms[i].addWall(new Wall(192,192,i,3));
		
		tutorial.rooms[i].addWall(new Wall(192,32,i,10));
		tutorial.rooms[i].addWall(new Wall(192,64,i,10));
		tutorial.rooms[i].addWall(new Wall(192,96,i,10));
		tutorial.rooms[i].addWall(new Wall(192,128,i,10));
		tutorial.rooms[i].addWall(new Wall(192,160,i,10));
		
		tutorial.rooms[i].addWall(new Wall(0,32,i,10));
		tutorial.rooms[i].addWall(new Wall(0,64,i,10));
		tutorial.rooms[i].addWall(new Wall(0,96,i,10));
		tutorial.rooms[i].addWall(new Wall(0,128,i,10));
		tutorial.rooms[i].addWall(new Wall(0,160,i,10));
		tutorial.gravePositions[i]=[];
		CLIENT.calculateLocalDoors(96,96,i);
	}
	tutorial.rooms[0].oriColor="blue";
	tutorial.rooms[0].foundColor="blue";
	tutorial.rooms[0].distBlue=0;
	tutorial.rooms[1].oriColor="red";
	tutorial.rooms[1].foundColor="red";
	tutorial.rooms[1].distRed=0;
}

Tutorial.prototype.initCanvas=function ()
{
}


Tutorial.prototype.gameLoop = function () 
{
	var curTime=new Date();
	if(tutorial.state==tutorial.PLAYING)
	{
		//tutorial.fps=1/((curTime.getTime()-time.getTime())/1000);
		if(tutorial.player.dead)
		{
			tutorial.player.respawnTimer-=curTime.getTime()-time.getTime();
			if(tutorial.player.respawnTimer<=0)
			{
				tutorial.player.dead=false;
				tutorial.player.setPos(96,96);
				if(main.playerTeam=="blue")
				{
					tutorial.player.room=0;
				}
				if(main.playerTeam=="red")
				{
					tutorial.player.room=1;
				}
			}
		}
		else
		{
			if(tutorial.keys["w"])
			{
				var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
				if(tutorial.player.gotFlag)
				{
					dist/=2;
					if(main.playerPerk==1)
					{
						dist*=main.perkStrength[main.playerPerk];
					}
				}
				tutorial.player.y-=(dist*((curTime.getTime()-time.getTime())/1000));
				tutorial.player.rotation=3;
			}
			if(tutorial.keys["s"])
			{
				var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
				if(tutorial.player.gotFlag)
				{
					dist/=2;
					if(main.playerPerk==1)
					{
						dist*=main.perkStrength[main.playerPerk];
					}
				}
				tutorial.player.y+=(dist*((curTime.getTime()-time.getTime())/1000));
				tutorial.player.rotation=0;
			}
			if(tutorial.keys["a"])
			{
				var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
				if(tutorial.player.gotFlag)
				{
					dist/=2;
					if(main.playerPerk==1)
					{
						dist*=main.perkStrength[main.playerPerk];
					}
				}
				tutorial.player.x-=(dist*((curTime.getTime()-time.getTime())/1000));
				tutorial.player.rotation=1;
			}
			if(tutorial.keys["d"])
			{
				var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
				if(tutorial.player.gotFlag)
				{
					dist/=2;
					if(main.playerPerk==1)
					{
						dist*=main.perkStrength[main.playerPerk];
					}
				}
				tutorial.player.x+=(dist*((curTime.getTime()-time.getTime())/1000));
				tutorial.player.rotation=2;
			}
			if(tutorial.keys["w"]||tutorial.keys["s"]||tutorial.keys["a"]||tutorial.keys["d"])
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
			if(tutorial.keys["space"])
			{
				if(tutorial.player.fireTime<=0)
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
						tutorial.fireBullet({"x":tutorial.player.x+(tutorial.player.w/2)-2,"y":tutorial.player.y+(tutorial.player.h/2)-2,"xSpeed":(((xDif*7)-yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)+xDif)/8)*main.gunSpeed[main.playerGun],"room":tutorial.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
						tutorial.fireBullet({"x":tutorial.player.x+(tutorial.player.w/2)-2,"y":tutorial.player.y+(tutorial.player.h/2)-2,"xSpeed":(((xDif*7)+yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)-xDif)/8)*main.gunSpeed[main.playerGun],"room":tutorial.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
						tutorial.fireBullet({"x":tutorial.player.x+(tutorial.player.w/2)-2,"y":tutorial.player.y+(tutorial.player.h/2)-2,"xSpeed":(((xDif*2)-yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)+xDif)/3)*main.gunSpeed[main.playerGun],"room":tutorial.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
						tutorial.fireBullet({"x":tutorial.player.x+(tutorial.player.w/2)-2,"y":tutorial.player.y+(tutorial.player.h/2)-2,"xSpeed":(((xDif*2)+yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)-xDif)/3)*main.gunSpeed[main.playerGun],"room":tutorial.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
					}
					else
					{
						tutorial.fireBullet({"x":tutorial.player.x+(tutorial.player.w/2)-2,"y":tutorial.player.y+(tutorial.player.h/2)-2,"xSpeed":xDif*main.gunSpeed[main.playerGun],"ySpeed":yDif*main.gunSpeed[main.playerGun],"room":tutorial.player.room,"team":main.playerTeam,"poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]});
					}
					tutorial.player.fireTime=main.gunReload[main.playerGun];
				}
			}
			if(tutorial.player.doorTime>0)
				tutorial.player.doorTime-=curTime.getTime()-time.getTime();
			if(tutorial.player.fireTime>0)
				tutorial.player.fireTime-=curTime.getTime()-time.getTime();
			var newPos = tutorial.rooms[tutorial.player.room].checkCollision(tutorial.player);
			if(newPos.roomChange)
			{
				var flagBlueRoom = -1;
				var flagRedRoom = -1;
				var flagBluePos = [,];
				var flagRedPos = [,];
				if(tutorial.blueFlagCaptured)
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
					flagBlueRoom=tutorial.blueFlag.room;
					flagBluePos = [(Math.floor((tutorial.blueFlag.x+16)/32)*32),(Math.floor((tutorial.blueFlag.y+16)/32)*32)];
				}
				if(tutorial.redFlagCaptured)
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
					flagRedRoom=tutorial.redFlag.room;
					flagRedPos = [(Math.floor((tutorial.redFlag.x+16)/32)*32),(Math.floor((tutorial.redFlag.y+16)/32)*32)];
				}
				tutorial.distBlue=-1;
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
									tutorial.distBlue=0;
									doors[i].bluePath=true;
									var pathDoor = doors[i];
									while(pathDoor.leadingDoor!=null)
									{
										tutorial.distBlue+=1;
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
				tutorial.distRed=-1;
				if(flagRedRoom!=-1)
				{
					var doorsFlag = CLIENT.calculateLocalDoors(flagRedPos[0],flagRedPos[1],flagRedRoom);
					var doorsPlayer = CLIENT.calculateLocalDoors(newPos.x,newPos.y,newPos.room);
					var queue = new Queue();
					var set = {};
					for(var i = 0; i < doorsPlayer.length; i++)
					{
						doorsPlayer[i].redPath = false;
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
								doors[i].redPath = false;
								doors[i].leadingDoor=door;
								//if(doors[i].connectsTo[0]==newPos.room)
								if(foundSet[[doors[i].x,doors[i].y,doors[i].room]])
								{
									found=true;
									tutorial.distRed=0;
									doors[i].redPath=true;
									var pathDoor = doors[i];
									while(pathDoor.leadingDoor!=null)
									{
										tutorial.distRed+=1;
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
				tutorial.player.room = newPos.room;
			}
			if(tutorial.player.gotFlag)
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
						if(playerGameData[redTeam[i]].room == tutorial.player.room)
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
						if(playerGameData[blueTeam[i]].room == tutorial.player.room)
						{
							sound.playSong(sound.songNumbers["enemy"]);
							sound.stopSong(sound.songNumbers["walking"]);
						}
					}
				}
			}
			
			tutorial.player.x = newPos.x;
			tutorial.player.y = newPos.y;
			if(main.playerTeam == "blue")
			{
				var flag = tutorial.redFlag;
				if(tutorial.player.room==flag.room)
				{
					if(tutorial.player.x+tutorial.player.w>flag.x
					&&tutorial.player.x<flag.x+flag.w
					&&tutorial.player.y+tutorial.player.h>flag.y
					&&tutorial.player.y<flag.y+flag.h)
					if(!tutorial.redFlagCaptured)
					{
						tutorial.player.gotFlag = 1;
						sound.playVoice(sound.voiceNumbers["yStolen"]);
						tutorial.redFlagCaptured = true;
					}
				}
				var flag = tutorial.blueFlag;
				if(tutorial.player.room==flag.room)
				{
					if(tutorial.player.x+tutorial.player.w>flag.x
					&&tutorial.player.x<flag.x+flag.w
					&&tutorial.player.y+tutorial.player.h>flag.y
					&&tutorial.player.y<flag.y+flag.h)
					{
						if(!tutorial.blueFlagCaptured)
						{
							if(flag.x!=tutorial.blueCapturePoint[0]||flag.y!=tutorial.blueCapturePoint[1]||flag.room!=tutorial.blueCapturePoint[2])
							{
								sound.playVoice(sound.voiceNumbers["bReturned"]);
								tutorial.blueFlag.x=tutorial.blueCapturePoint[0];
								tutorial.blueFlag.y=tutorial.blueCapturePoint[1];
								tutorial.blueFlag.room=tutorial.blueCapturePoint[2];
							}
						}
					}
				}
				if(tutorial.player.room==tutorial.blueCapturePoint[2])
				{
					if(tutorial.player.gotFlag==1)
					{
						if(tutorial.player.x+tutorial.player.w>tutorial.blueCapturePoint[0]
						&&tutorial.player.x<tutorial.blueCapturePoint[0]+tutorial.player.w
						&&tutorial.player.y+tutorial.player.h>tutorial.blueCapturePoint[1]
						&&tutorial.player.y<tutorial.blueCapturePoint[1]+tutorial.player.h)
						{
							if(!tutorial.blueFlagCaptured)
							{
								if(tutorial.blueFlag.x==tutorial.blueCapturePoint[0]&&tutorial.blueFlag.y==tutorial.blueCapturePoint[1]&&tutorial.blueFlag.room==tutorial.blueCapturePoint[2])
								{
									tutorial.player.gotFlag = 0;
									sound.playVoice(sound.voiceNumbers["yCaptured"]);
									tutorial.bluePoints+=1;
									tutorial.blueFlagCaptured = false;
									tutorial.redFlagCaptured = false;
									tutorial.blueFlag.x=tutorial.blueCapturePoint[0];
									tutorial.blueFlag.y=tutorial.blueCapturePoint[1];
									tutorial.blueFlag.room=tutorial.blueCapturePoint[2];
									tutorial.redFlag.x=tutorial.redCapturePoint[0];
									tutorial.redFlag.y=tutorial.redCapturePoint[1];
									tutorial.redFlag.room=tutorial.redCapturePoint[2];
								}
							}
						}
					}
				}
			}
			if(main.playerTeam == "red")
			{
				var flag = tutorial.blueFlag;
				if(tutorial.player.room==flag.room)
				{
					if(tutorial.player.x+tutorial.player.w>flag.x
					&&tutorial.player.x<flag.x+flag.w
					&&tutorial.player.y+tutorial.player.h>flag.y
					&&tutorial.player.y<flag.y+flag.h)
					if(!tutorial.blueFlagCaptured)
					{
						tutorial.player.gotFlag = 1;
						sound.playVoice(sound.voiceNumbers["bStolen"]);
						tutorial.blueFlagCaptured = true;
					}
				}
				var flag = tutorial.redFlag;
				if(tutorial.player.room==flag.room)
				{
					if(tutorial.player.x+tutorial.player.w>flag.x
					&&tutorial.player.x<flag.x+flag.w
					&&tutorial.player.y+tutorial.player.h>flag.y
					&&tutorial.player.y<flag.y+flag.h)
					{
						if(!tutorial.redFlagCaptured)
						{
							if(flag.x!=tutorial.redCapturePoint[0]||flag.y!=tutorial.redCapturePoint[1]||flag.room!=tutorial.redCapturePoint[2])
							{
								sound.playVoice(sound.voiceNumbers["yReturned"]);
								tutorial.redFlag.x=tutorial.redCapturePoint[0];
								tutorial.redFlag.y=tutorial.redCapturePoint[1];
								tutorial.redFlag.room=tutorial.redCapturePoint[2];
							}
						}
					}
				}
				if(tutorial.player.room==tutorial.redCapturePoint[2])
				{
					if(tutorial.player.gotFlag==1)
					{
						if(tutorial.player.x+tutorial.player.w>tutorial.redCapturePoint[0]
						&&tutorial.player.x<tutorial.redCapturePoint[0]+tutorial.player.w
						&&tutorial.player.y+tutorial.player.h>tutorial.redCapturePoint[1]
						&&tutorial.player.y<tutorial.redCapturePoint[1]+tutorial.player.h)
						{
							if(!tutorial.redFlagCaptured)
							{
								if(tutorial.redFlag.x==tutorial.redCapturePoint[0]&&tutorial.redFlag.y==tutorial.redCapturePoint[1]&&tutorial.redFlag.room==tutorial.redCapturePoint[2])
								{
									tutorial.player.gotFlag = 0;
									sound.playVoice(sound.voiceNumbers["bCaptured"]);
									tutorial.redPoints+=1;
									tutorial.blueFlagCaptured = false;
									tutorial.redFlagCaptured = false;
									tutorial.blueFlag.x=tutorial.blueCapturePoint[0];
									tutorial.blueFlag.y=tutorial.blueCapturePoint[1];
									tutorial.blueFlag.room=tutorial.blueCapturePoint[2];
									tutorial.redFlag.x=tutorial.redCapturePoint[0];
									tutorial.redFlag.y=tutorial.redCapturePoint[1];
									tutorial.redFlag.room=tutorial.redCapturePoint[2];
								}
							}
						}
					}
				}
			}
		}
		for( var i = 0; i < tutorial.bullets.length;i++)
		{
			if(tutorial.bullets[i] != null)
			{
				tutorial.bullets[i].update(((curTime.getTime()-time.getTime())/1000));
				if(tutorial.bullets[i].room == tutorial.player.room)
				{
					if(tutorial.bullets[i] != null)
					{
						if(tutorial.bullets[i].team!=main.playerTeam)
						{
							if(tutorial.player.x+tutorial.player.w>tutorial.bullets[i].x
							&&tutorial.player.x<tutorial.bullets[i].x+tutorial.bullets[i].w
							&&tutorial.player.y+tutorial.player.h>tutorial.bullets[i].y
							&&tutorial.player.y<tutorial.bullets[i].y+tutorial.bullets[i].h)
							{
								tutorial.player.health-=tutorial.bullets[i].damage;
								tutorial.player.poisoned+=tutorial.bullets[i].poisonDamage;
								tutorial.player.poisonTime=tutorial.player.poisonMaxTime;
								tutorial.bullets[i] = null;
							}
						}
					}
				}
				if(tutorial.bullets[i] != null)
				{
					if(tutorial.rooms[tutorial.bullets[i].room].checkCollide(tutorial.bullets[i]))
					{
						tutorial.bullets[i] = null;
					}
				}
				if(tutorial.bullets[i] != null)
				{
					if(tutorial.bullets[i].team=="blue")
					{
						for(var j = 0; j < redTeam.length;j++)
						{
							if(playerGameData[redTeam[j]]!=0&&tutorial.bullets[i] != null)
							{
								if(playerGameData[redTeam[j]].room==tutorial.bullets[i].room)
								{
									if(playerGameData[redTeam[j]].x+tutorial.player.w>tutorial.bullets[i].x
									&&playerGameData[redTeam[j]].x<tutorial.bullets[i].x+tutorial.bullets[i].w
									&&playerGameData[redTeam[j]].y+tutorial.player.h>tutorial.bullets[i].y
									&&playerGameData[redTeam[j]].y<tutorial.bullets[i].y+tutorial.bullets[i].h)
									{
										tutorial.bullets[i] = null;
									}
								}
							}
						}
					}
					else
					{
						for(var j = 0; j < blueTeam.length;j++)
						{
							if(playerGameData[blueTeam[j]]!=0&&tutorial.bullets[i] != null)
							{
								if(playerGameData[blueTeam[j]].room==tutorial.bullets[i].room)
								{
									if(playerGameData[blueTeam[j]].x+tutorial.player.w>tutorial.bullets[i].x
									&&playerGameData[blueTeam[j]].x<tutorial.bullets[i].x+tutorial.bullets[i].w
									&&playerGameData[blueTeam[j]].y+tutorial.player.h>tutorial.bullets[i].y
									&&playerGameData[blueTeam[j]].y<tutorial.bullets[i].y+tutorial.bullets[i].h)
									{
										tutorial.bullets[i] = null;
									}
								}
							}
						}
					}
				}
			}
		}
		if(tutorial.player.poisonTime>0)
		{
			tutorial.player.poisonTime-=curTime.getTime()-time.getTime();
			damage=(tutorial.player.poisoned/tutorial.player.poisonMaxTime)*Math.min((curTime.getTime()-time.getTime()),tutorial.player.poisonTime);
			tutorial.player.health-=Math.max(damage,(damage/100)*tutorial.player.health);
			tutorial.player.poisoned-=damage;
		}
		if(tutorial.player.health<=0)
		{
			sound.playVoice(sound.voiceNumbers["slain"]);
			var len = tutorial.gravePositions[tutorial.player.room].length;
			tutorial.gravePositions[tutorial.player.room][len]=[tutorial.player.x-6,tutorial.player.y-6];
			sound.stopSong(sound.songNumbers["enemy"]);
			sound.stopSong(sound.songNumbers["walking"]);
			sound.stopSong(sound.songNumbers["flag"]);
			if(tutorial.player.gotFlag==1)
			{
				tutorial.player.gotFlag = 0;
				if(main.playerTeam == "red")
				{
					sound.playVoice(sound.voiceNumbers["bDropped"]);
					tutorial.blueFlagCaptured = false;
					tutorial.blueFlag.room=tutorial.player.room;
					tutorial.blueFlag.x=tutorial.player.x;
					tutorial.blueFlag.y=tutorial.player.y;
				}
				if(main.playerTeam == "blue")
				{
					sound.playVoice(sound.voiceNumbers["yDropped"]);
					tutorial.redFlagCaptured = false;
					tutorial.redFlag.room=tutorial.player.room;
					tutorial.redFlag.x=tutorial.player.x;
					tutorial.redFlag.y=tutorial.player.y;
				}
			}
			var x = Math.random()%96;
			var y = Math.random()%96;
			tutorial.player.setPos(32+x,32+y);
			tutorial.player.dead=true;
			tutorial.player.respawnTimer=2000;
			tutorial.player.health=(main.playerMaxHealth*(main.playerHealthScaling/10));
			tutorial.player.room=-1;
		}
		if(main.playerPerk==0)
		{
			tutorial.player.health+=((main.playerMaxHealth*(main.playerHealthScaling/10))*(main.perkStrength[main.playerPerk]/100))*((curTime.getTime()-time.getTime())/1000);
		}
		if(tutorial.player.health>(main.playerMaxHealth*(main.playerHealthScaling/10)))
		{
			tutorial.player.health=(main.playerMaxHealth*(main.playerHealthScaling/10));
		}
	}
	tutorial.Draw();
}

Tutorial.prototype.onDoubleClick = function(e)
{
}

Tutorial.prototype.onMouseMove = function(e)
{
}

Tutorial.prototype.onMouseClick = function(e)
{
	if(!tutorial.player.dead && tutorial.state==tutorial.PLAYING)
	{
		var offSetX = -tutorial.player.x-(tutorial.player.w/2)+(canvas.width/2);
		var offSetY = -tutorial.player.y-(tutorial.player.h/2)+(canvas.height/2);
		//var offSetX = -tutorial.player.x+(canvas.width/2);
		//var offSetY = -tutorial.player.y+(canvas.height/2);
		var inGamePos=[];
		inGamePos["x"]=e.x-offSetX;
		inGamePos["y"]=e.y-offSetY+16;
		inGamePos.x/=32;
		inGamePos.x=Math.floor(inGamePos.x);
		inGamePos.y/=32;
		inGamePos.y=Math.floor(inGamePos.y);
		CLIENT.createDoor(inGamePos.x,inGamePos.y,tutorial.player.room);
	}
	else
	{
		if(e.x>(canvas.width/2)-(270/2)&&e.x<(canvas.width/2)+(270/2)&&e.y>(canvas.height/2)-(77/2)&&e.y<(canvas.height/2)+(77/2)&&tutorial.state!=tutorial.PLAYING)
		{
			main.gameOver();
		}
	}
}

Tutorial.prototype.onContextMenu = function(e)
{
}

Tutorial.prototype.onKeyPress = function(e)
{
	//W
	if (e.keyCode == 87) 
	{
		tutorial.keys["w"] = true;
	}
	//S
	if(e.keyCode == 83) 
	{
		tutorial.keys["s"] = true;
	}
	//A
	if (e.keyCode == 65) 
	{
		tutorial.keys["a"] = true;
	}
	//D
	if (e.keyCode == 68)
	{
		tutorial.keys["d"] = true;
	}
	//SPACE
	if (e.keyCode == 32) 
	{
		tutorial.keys["space"] = true;
	}
}
Tutorial.prototype.onKeyUp = function(e)
{
	//W
	if (e.keyCode == 87) 
	{
		tutorial.keys["w"] = false;
	}
	//S
	if(e.keyCode == 83) 
	{
		tutorial.keys["s"] = false;
	}
	//A
	if (e.keyCode == 65) 
	{
		tutorial.keys["a"] = false;
	}
	//D
	if (e.keyCode == 68)
	{
		tutorial.keys["d"] = false;
	}
	//SPACE
	if (e.keyCode == 32) 
	{
		tutorial.keys["space"] = false;
	}
}

Tutorial.prototype.Draw = function()
{
	
	ctx.clearRect(0,0,canvas.width, canvas.height)
	
	
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
	
	var offSetX = Math.floor(-tutorial.player.x-(tutorial.player.w/2)+(canvas.width/2));
	var offSetY = Math.floor(-tutorial.player.y-(tutorial.player.h/2)+(canvas.height/2));
	
	tutorial.rooms[tutorial.player.room].drawFirst(offSetX,offSetY);
	for(var i = 0; i < tutorial.gravePositions[tutorial.player.room].length; i++)
	{
		ctx.drawImage(images.grave,tutorial.gravePositions[tutorial.player.room][i][0]+offSetX,tutorial.gravePositions[tutorial.player.room][i][1]+offSetY);
	}
	if(tutorial.player.room==tutorial.redCapturePoint[2])
	{
		ctx.drawImage(images.crystal[0][1],tutorial.redCapturePoint[0]+offSetX,tutorial.redCapturePoint[1]+offSetY-32);
	}
	if(tutorial.player.room==tutorial.blueCapturePoint[2])
	{
		ctx.drawImage(images.crystal[1][1],tutorial.blueCapturePoint[0]+offSetX,tutorial.blueCapturePoint[1]+offSetY-32);
	}
	for(var i = 0; i < blueTeam.length;i++)
	{
		if(blueTeam[i]!=CLIENT.uniqueID)
		{
			if(playerGameData[blueTeam[i]]!=0)
			{
				if(playerGameData[blueTeam[i]].room==tutorial.player.room)
				{
					
					ctx.fillStyle=rgb(0,0,0);
					ctx.fillRect(Math.ceil(playerGameData[blueTeam[i]].x-1+offSetX),Math.ceil(playerGameData[blueTeam[i]].y-11+offSetY),tutorial.player.w+2,7);
					if(main.playerTeam=="blue")
					{
						ctx.fillStyle=rgb(0,0,255);	
					}
					else
					{
						ctx.fillStyle=rgb(255,0,0);	
					}
					ctx.fillRect(Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y-10+offSetY),tutorial.player.w*(playerGameData[blueTeam[i]].health/(main.playerMaxHealth*(playerOutfit[blueTeam[i]].playerHealthScaling/10))),5);
					
					//ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,tutorial.player.w,tutorial.player.h);
					
					
					ctx.drawImage(images.bodies[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].body][playerOutfit[blueTeam[i]].colour],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					if(playerOutfit[blueTeam[i]].hair)
					{
						ctx.drawImage(images.hair[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].hairStyle],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					}
					if(playerOutfit[blueTeam[i]].beard)
					{
						ctx.drawImage(images.beard[playerOutfit[blueTeam[i]].beardStyle],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					}
					ctx.drawImage(images.clothes[playerOutfit[blueTeam[i]].gender][playerOutfit[blueTeam[i]].clothes],main.animation[playerGameData[blueTeam[i]].frame]*32,playerGameData[blueTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[blueTeam[i]].x+offSetX),Math.ceil(playerGameData[blueTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					
					
					
					if(playerGameData[blueTeam[i]].flag==1)
					{
						ctx.drawImage(images.crystal[0][2],Math.ceil(playerGameData[blueTeam[i]].x+offSetX+8),Math.ceil(playerGameData[blueTeam[i]].y+offSetY));
						/*ctx.fillStyle=rgb(255,0,0);
						ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,tutorial.player.w,10);	
						ctx.fillRect(playerGameData[blueTeam[i]].x+offSetX,playerGameData[blueTeam[i]].y+offSetY,5,tutorial.player.h);	*/
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
				if(playerGameData[redTeam[i]].room==tutorial.player.room)
				{
					ctx.fillStyle=rgb(0,0,0);
					ctx.fillRect(Math.ceil(playerGameData[redTeam[i]].x-1+offSetX),Math.ceil(playerGameData[redTeam[i]].y-11+offSetY),tutorial.player.w+2,7);
					if(main.playerTeam=="red")
					{
						ctx.fillStyle=rgb(204,204,0);	
					}
					else
					{
						ctx.fillStyle=rgb(255,0,0);	
					}
					ctx.fillRect(Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y-10+offSetY),tutorial.player.w*(playerGameData[redTeam[i]].health/(main.playerMaxHealth*(playerOutfit[redTeam[i]].playerHealthScaling/10))),5);
					
					//ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,tutorial.player.w,tutorial.player.h);
					
					
					ctx.drawImage(images.bodies[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].body][playerOutfit[redTeam[i]].colour],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					if(playerOutfit[redTeam[i]].hair)
					{
						ctx.drawImage(images.hair[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].hairStyle],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					}
					if(playerOutfit[redTeam[i]].beard)
					{
						ctx.drawImage(images.beard[playerOutfit[redTeam[i]].beardStyle],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					}
					ctx.drawImage(images.clothes[playerOutfit[redTeam[i]].gender][playerOutfit[redTeam[i]].clothes],main.animation[playerGameData[redTeam[i]].frame]*32,playerGameData[redTeam[i]].rotation*32,32,32,Math.ceil(playerGameData[redTeam[i]].x+offSetX),Math.ceil(playerGameData[redTeam[i]].y+offSetY),tutorial.player.w,tutorial.player.h);
					
					
					if(playerGameData[redTeam[i]].flag==1)
					{
						ctx.drawImage(images.crystal[1][2],Math.ceil(playerGameData[redTeam[i]].x+offSetX+8),Math.ceil(playerGameData[redTeam[i]].y+offSetY));
						/*ctx.fillStyle=rgb(0,0,255);
						ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,tutorial.player.w,10);	
						ctx.fillRect(playerGameData[redTeam[i]].x+offSetX,playerGameData[redTeam[i]].y+offSetY,5,tutorial.player.h);	*/
					}
				}
			}
		}
	}
	
	tutorial.player.draw(offSetX,offSetY);
	for( var i = 0; i < tutorial.bullets.length;i++)
	{
		if(tutorial.bullets[i] != null)
		{
			if(tutorial.bullets[i].room == tutorial.player.room)
			{
				tutorial.bullets[i].draw(offSetX,offSetY);
			}
		}
	}
	/*for(var i = 0; i < tutorial.rooms.length;i++)
	{
		tutorial.rooms[i].draw();
	}*/
	if(!tutorial.blueFlagCaptured)
	{
		if(tutorial.player.room==tutorial.blueFlag.room)
		{
			ctx.drawImage(images.crystal[1][0],Math.ceil(tutorial.blueFlag.x+offSetX),Math.ceil(tutorial.blueFlag.y+offSetY-32));
			//tutorial.blueFlag.draw(offSetX,offSetY);
		}
	}
	if(!tutorial.redFlagCaptured)
	{
		if(tutorial.player.room==tutorial.redFlag.room)
		{
			ctx.drawImage(images.crystal[0][0],Math.ceil(tutorial.redFlag.x+offSetX),Math.ceil(tutorial.redFlag.y+offSetY-32));
			//tutorial.redFlag.draw(offSetX,offSetY);
		}
	}
	
	tutorial.rooms[tutorial.player.room].draw(offSetX,offSetY);
	
	
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="20px Lucida Console";
	if(tutorial.distBlue!=-1)
	{
		ctx.fillStyle = rgb(0, 0, 255);
		ctx.fillText("blue crystal: "+tutorial.distBlue, 100, 80);
	}
	if(tutorial.distRed!=-1)
	{
		ctx.fillStyle = rgb(204, 204, 0);
		ctx.fillText("yellow crystal: "+tutorial.distRed, 700, 80);
	}
	
	ctx.fillStyle = rgb(204,204,0);
	ctx.fillText(tutorial.redPoints+"/3", 760, 50);
	if(tutorial.redFlagCaptured)
	{
		ctx.drawImage(images.crystal[0][2],250,34);
	}
	
	ctx.fillStyle = rgb(0,0,255);
	ctx.fillText(tutorial.bluePoints+"/3", 200, 50);
	if(tutorial.blueFlagCaptured)
	{
		ctx.drawImage(images.crystal[1][2],710,34);
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
	//ctx.fillText("fps: "+tutorial.fps, 700, 300);
	if(tutorial.state==tutorial.VICTORY)
	{
		ctx.drawImage(images.victory,(canvas.width/2)-(270/2),(canvas.height/2)-(77/2));
	}
	else if(tutorial.state==tutorial.DEFEAT)
	{
		ctx.drawImage(images.defeat,(canvas.width/2)-(270/2),(canvas.height/2)-(77/2));
	}
	
}



Tutorial.prototype.fireBullet = function(data)
{
	var created = false;
	for(var i = 0; i < tutorial.bullets.length&&!created;i++)
	{
		if(tutorial.bullets[i]==null)
		{
			tutorial.bullets[i]= new Bullet(data.x,data.y);
			tutorial.bullets[i].team=data.team;
			tutorial.bullets[i].room=data.room;
			tutorial.bullets[i].xSpeed=data.xSpeed;
			tutorial.bullets[i].ySpeed=data.ySpeed;
			tutorial.bullets[i].poisonDamage=data.poisonDamage;
			tutorial.bullets[i].damage=data.damage;
			created=true
		}
	}
	if(!created)
	{
		var num = tutorial.bullets.length;
		tutorial.bullets[num]= new Bullet(data.x,data.y);
		tutorial.bullets[num].team=data.team;
		tutorial.bullets[num].room=data.room;
		tutorial.bullets[num].xSpeed=data.xSpeed;
		tutorial.bullets[num].ySpeed=data.ySpeed;
		tutorial.bullets[num].poisonDamage=data.poisonDamage;
		tutorial.bullets[num].damage=data.damage;
	}
}







/*

	var queue = new Queue();
	var set = {};
	var walls = tutorial.rooms[flagCarRoom].walls;
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
	