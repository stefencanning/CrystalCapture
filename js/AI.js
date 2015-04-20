function AI(x, y)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.health = (main.playerMaxHealth*(main.playerHealthScaling/10));
	this.room = 0;
	this.rotation=0;
	this.gotFlag=0;
	this.doorTime=0;
	this.fireTime=0;
	this.dead=false;
	this.respawnTimer=0;
	this.poisoned=0;
	this.poisonTime=0;
	this.poisonMaxTime=5000;
	this.target=[32,32];
}

AI.prototype.getX = function()
{//Returns the x position of the player on the grid
	return this.x;
}
AI.prototype.getY = function()
{//Returns the y position of the player on the grid
	return this.y;
}

AI.prototype.setPos = function(x, y)
{//Sets the position of the player on the grid
	this.x = x;
	this.y = y;
}

AI.prototype.update = function()
{
	if(this.fireTime>0)
	{
		this.fireTime-=curTime.getTime()-time.getTime();
	}
	if(this.doorTime>0)
	{
		this.doorTime-=curTime.getTime()-time.getTime();
	}
	if(this.room==tutorial.player.room)
	{
		if(!this.dead && tutorial.state==tutorial.PLAYING)
		{
			if(this.fireTime<=0)
			{
				var xDif = (tutorial.player.x+16)-(this.x+16);
				var yDif = (tutorial.player.y+16)-(this.y+16);
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
					tutorial.fireBullet({"x":this.x+(this.w/2)-2,"y":this.y+(this.h/2)-2,"xSpeed":(((xDif*7)-yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)+xDif)/8)*main.gunSpeed[main.playerGun],"room":this.room,"team":"red","poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]*0.75});
					tutorial.fireBullet({"x":this.x+(this.w/2)-2,"y":this.y+(this.h/2)-2,"xSpeed":(((xDif*7)+yDif)/8)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*7)-xDif)/8)*main.gunSpeed[main.playerGun],"room":this.room,"team":"red","poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]*0.75});
					tutorial.fireBullet({"x":this.x+(this.w/2)-2,"y":this.y+(this.h/2)-2,"xSpeed":(((xDif*2)-yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)+xDif)/3)*main.gunSpeed[main.playerGun],"room":this.room,"team":"red","poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]*0.75});
					tutorial.fireBullet({"x":this.x+(this.w/2)-2,"y":this.y+(this.h/2)-2,"xSpeed":(((xDif*2)+yDif)/3)*main.gunSpeed[main.playerGun],"ySpeed":(((yDif*2)-xDif)/3)*main.gunSpeed[main.playerGun],"room":this.room,"team":"red","poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]*0.75});
				}
				else
				{
					tutorial.fireBullet({"x":this.x+(this.w/2)-2,"y":this.y+(this.h/2)-2,"xSpeed":xDif*main.gunSpeed[main.playerGun],"ySpeed":yDif*main.gunSpeed[main.playerGun],"room":this.room,"team":"red","poisonDamage":poisDmg,"damage":main.gunDamage[main.playerGun]*0.75});
				}
				this.fireTime=main.gunReload[main.playerGun]*1.5;
			}
		}
	}
	else
	{
		var dirX = this.target[0]-this.x;
		var dirY = this.target[1]-this.y;
		var len = Math.sqrt((dirX*dirX)+(dirY*dirY));
		dirX/=len;
		dirY/=len;
		var dist = (main.playerSpeed*(main.playerSpeedScaling/10));
		if(this.gotFlag)
		{
			dist/=2;
			if(main.playerPerk==1)
			{
				dist*=main.perkStrength[main.playerPerk];
			}
		}
		this.x+=dirX*(dist*((curTime.getTime()-time.getTime())/1000));
		this.y+=dirY*(dist*((curTime.getTime()-time.getTime())/1000));
		
		var newPos = tutorial.rooms[this.room].checkCollision(this);
		
		if(newPos.roomChange)
		{
			this.room = newPos.room;
			var doorsPlayer = tutorial.calculateLocalDoors(newPos.x,newPos.y,newPos.room);
			this.recalculateRoute(doorsPlayer);
		}
		this.x=newPos.x;
		this.y=newPos.y;
		
		if(len<16)
		{
			var doorsPlayer = tutorial.calculateLocalDoors(32*Math.floor(this.x/32),32*Math.floor(this.y/32),this.room);
			this.recalculateRoute(doorsPlayer);
		}
		
		
		var flag = tutorial.blueFlag;
		if(this.room==flag.room)
		{
			if(this.x+this.w>flag.x
			&&this.x<flag.x+flag.w
			&&this.y+this.h>flag.y
			&&this.y<flag.y+flag.h)
			if(!tutorial.blueFlagCaptured)
			{
				this.gotFlag = 1;
				sound.playVoice(sound.voiceNumbers["bStolen"]);
				tutorial.blueFlagCaptured = true;
			}
		}
		var flag = tutorial.redFlag;
		if(this.room==flag.room)
		{
			if(this.x+this.w>flag.x
			&&this.x<flag.x+flag.w
			&&this.y+this.h>flag.y
			&&this.y<flag.y+flag.h)
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
		if(this.room==tutorial.redCapturePoint[2])
		{
			if(this.gotFlag==1)
			{
				if(this.x+this.w>tutorial.redCapturePoint[0]
				&&this.x<tutorial.redCapturePoint[0]+this.w
				&&this.y+this.h>tutorial.redCapturePoint[1]
				&&this.y<tutorial.redCapturePoint[1]+this.h)
				{
					if(!tutorial.redFlagCaptured)
					{
						if(tutorial.redFlag.x==tutorial.redCapturePoint[0]&&tutorial.redFlag.y==tutorial.redCapturePoint[1]&&tutorial.redFlag.room==tutorial.redCapturePoint[2])
						{
							this.gotFlag = 0;
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
							if(tutorial.redPoints==3)
							{
								sound.playVoice(sound.voiceNumbers["defeated"]);
								tutorial.state=game.DEFEAT;
							}
						}
					}
				}
			}
		}
	}
	if(this.health<=0)
	{
		tutorial.hints[9][1]=1;
		var len = tutorial.gravePositions[this.room].length;
		tutorial.gravePositions[this.room][len]=[this.x-6,this.y-6];
		if(this.gotFlag==1)
		{
			this.gotFlag = 0;
			sound.playVoice(sound.voiceNumbers["bDropped"]);
			tutorial.blueFlagCaptured = false;
			tutorial.blueFlag.room=this.room;
			tutorial.blueFlag.x=this.x;
			tutorial.blueFlag.y=this.y;
		}
		var x = (Math.random()*1000)%96;
		var y = (Math.random()*1000)%96;
		this.setPos(32+x,32+y);
		this.dead=true;
		this.respawnTimer=2000;
		this.health=(main.playerMaxHealth*(main.playerHealthScaling/10));
		this.room=-1;
	}
}

AI.prototype.recalculateRoute = function(doors)
{
	if(this.gotFlag)
	{
		var flag;
		if(tutorial.redFlagCaptured)
		{
			flag =[tutorial.player.x,tutorial.player.y,tutorial.player.room];
		}
		else
		{
			flag =[tutorial.redFlag.x,tutorial.redFlag.y,tutorial.redFlag.room];
		}
		if(this.room == flag[2])
		{
			this.target = [flag[0],flag[1]];
		}
		else
		{
			if(doors.length==1)
			{
				this.target = [doors[0].x,doors[0].y];
			}
			else
			{
				for(var i = 0; i < doors.length; i++)
				{
					if(doors[i].connectsTo[0]==flag[2])
					{
						this.target = [doors[i].x,doors[i].y];
					}
				}
			}
		}
	}
	else
	{
		if(this.room == tutorial.blueFlag.room)
		{
			this.target = [tutorial.blueFlag.x,tutorial.blueFlag.y];
		}
		else
		{
			if(doors.length==1)
			{
				this.target = [doors[0].x,doors[0].y];
			}
			else
			{
				for(var i = 0; i < doors.length; i++)
				{
					if(doors[i].connectsTo[0]==tutorial.blueFlag.room)
					{
						this.target = [doors[i].x,doors[i].y];
					}
				}
			}
		}
	}
}

AI.prototype.getDir = function()
{
	return this.dir;
}

AI.prototype.draw = function(offSetX,offSetY)
{
	ctx.fillStyle=rgb(0,0,0);
	ctx.fillRect(Math.ceil(this.x-1+offSetX),Math.ceil(this.y-11+offSetY),this.w+2,7);
	ctx.fillStyle=rgb(255,0,0);
	ctx.fillRect(Math.ceil(this.x+offSetX),Math.ceil(this.y-10+offSetY),this.w*(this.health/(main.playerMaxHealth*(main.playerHealthScaling/10))),5);
	ctx.fillStyle=rgb(0,0,0);
	//ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,this.h);
	//ctx.drawImage(images.bodies[main.playerGender][main.playerBodyType][main.playerColour],0,this.rotation*32,32,32,this.x+offSetX,this.y+offSetY,this.w,this.h);
	ctx.drawImage(images.bodies[main.playerGender][main.playerBodyType][main.playerColour],main.animation[main.frame]*32,this.rotation*32,32,32,Math.ceil(this.x+offSetX),Math.ceil(this.y+offSetY),this.w,this.h);
	if(main.playerShowHair)
	{
		ctx.drawImage(images.hair[main.playerGender][main.playerHair],main.animation[main.frame]*32,this.rotation*32,32,32,Math.ceil(this.x+offSetX),Math.ceil(this.y+offSetY),this.w,this.h);
	}
	if(main.playerShowBeard)
	{
		ctx.drawImage(images.beard[main.playerBeard],main.animation[main.frame]*32,this.rotation*32,32,32,Math.ceil(this.x+offSetX),Math.ceil(this.y+offSetY),this.w,this.h);
	}
	ctx.drawImage(images.clothes[main.playerGender][main.playerClothes],main.animation[main.frame]*32,this.rotation*32,32,32,Math.ceil(this.x+offSetX),Math.ceil(this.y+offSetY),this.w,this.h);
	
	ctx.fillStyle=rgb(255,0,0);
	/*ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,5);
	ctx.fillRect(this.x+offSetX,this.y+offSetY,5,this.h);
	ctx.fillRect(this.x+offSetX+this.w-5,this.y+offSetY,5,this.h);
	ctx.fillRect(this.x+offSetX,this.y+offSetY+this.h-5,this.w,5);*/
	if(this.gotFlag==1)
	{
		ctx.drawImage(images.crystal[1][2],Math.ceil(this.x+offSetX+8),Math.ceil(this.y+offSetY));
	}
}
