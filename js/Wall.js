function Wall(x,y,room,imgNum)
{
	this.room = room;
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.door="false";
	this.connectsTo=[];
	this.connectedDoors=[];
	this.connectedDoorsSet={};
	this.used=false;
	this.imgNum=imgNum;
	this.leadingDoor=null;
	this.path=false;
	this.pair=null;
}

Wall.prototype.dealloc = function()
{
	this.room=0;
	this.connectsTo=0;
	this.connectedDoors=0;
	this.connectedDoorsSet=0;
	this.imgNum=0;
	this.leadingDoor=0;
	this.path=0;
}


Wall.prototype.drawFirst = function(offSetX,offSetY)
{
	if(this.door=="true")
	{
		//ctx.drawImage(images.doors[1],this.x+offSetX,this.y+offSetY+16);
		ctx.drawImage(images.doors[2],this.x+offSetX,this.y+offSetY);
	}
	else
	{
		if(this.room==-1)
		{
			ctx.drawImage(images.wallCrack,this.x+offSetX,this.y+offSetY+16);
		}
		else
		{
			ctx.drawImage(images.wall,this.x+offSetX,this.y+offSetY+16);
		}
	}
}


Wall.prototype.draw = function(offSetX,offSetY)
{
	ctx.fillStyle=rgb(0,0,0);
	//ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,this.h);	
	//ctx.drawImage(images.walls[15],this.x+offSetX,this.y+offSetY);
	if(this.door=="true")
	{
		ctx.fillStyle=rgb(139,69,19);
		//ctx.drawImage(images.doors[0],this.x+offSetX,this.y+offSetY-16);
		//ctx.drawImage(images.doors[2],this.x+offSetX,this.y+offSetY);
		if(this.bluePath)
		{
			ctx.drawImage(images.crystal[1][2],this.x+offSetX,this.y+offSetY-16);
		}
		if(this.redPath)
		{
			ctx.drawImage(images.crystal[0][2],this.x+offSetX+16,this.y+offSetY-16);
		}
	}
	else
	{
		ctx.drawImage(images.walls[this.imgNum],this.x+offSetX,this.y+offSetY-16);
	}
}



		/*
		if(this.used)
		{
			
			if(game.rooms[this.connectsTo[0]].oriColor=="red")
			{
				ctx.fillStyle=rgb(255,255-game.rooms[this.connectsTo[0]].oriColorValue,255-game.rooms[this.connectsTo[0]].oriColorValue);
			}
			if(game.rooms[this.connectsTo[0]].oriColor=="blue")
			{
				ctx.fillStyle=rgb(255-game.rooms[this.connectsTo[0]].oriColorValue,255-game.rooms[this.connectsTo[0]].oriColorValue,255);
			}
			ctx.fillRect(this.x+offSetX+7,this.y+offSetY+7,this.w-14,this.h-14);
			
			if(game.rooms[this.connectsTo[0]].foundColor=="red")
			{
				ctx.fillStyle=rgb(255,255-game.rooms[this.connectsTo[0]].foundColorValue,255-game.rooms[this.connectsTo[0]].foundColorValue);
			}
			if(game.rooms[this.connectsTo[0]].foundColor=="blue")
			{
				ctx.fillStyle=rgb(255-game.rooms[this.connectsTo[0]].foundColorValue,255-game.rooms[this.connectsTo[0]].foundColorValue,255);
			}
			ctx.fillRect(this.x+offSetX+12,this.y+offSetY+12,this.w-24,this.h-24);	
		}*/