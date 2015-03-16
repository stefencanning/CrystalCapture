function Wall(x,y,imgNum)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.door="false";
	this.connectsTo=[];
	this.connectedDoors=[];
	this.used=false;
	this.imgNum=imgNum;
	this.leadingDoor=null;
	this.path=false;
}


Wall.prototype.drawFirst = function(offSetX,offSetY, prev)
{
	if(this.door=="true")
	{
		ctx.drawImage(images.doors[1],this.x+offSetX,this.y+offSetY+16);
		if(prev==this.connectsTo[0])
		{
			//ctx.drawImage(images.doors[3],this.x+offSetX,this.y+offSetY+16);
		}
	}
	else
	{
		ctx.drawImage(images.walls[15],this.x+offSetX,this.y+offSetY+16);
	}
}


Wall.prototype.draw = function(offSetX,offSetY, prev)
{
	ctx.fillStyle=rgb(0,0,0);
	//ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,this.h);	
	//ctx.drawImage(images.walls[15],this.x+offSetX,this.y+offSetY);
	if(this.door=="true")
	{
		ctx.fillStyle=rgb(139,69,19);
		ctx.drawImage(images.doors[0],this.x+offSetX,this.y+offSetY-16);
		if(prev==this.connectsTo[0])
		{
			ctx.drawImage(images.doors[2],this.x+offSetX,this.y+offSetY-16);
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