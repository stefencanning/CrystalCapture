function Wall(x,y)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.door="false";
	this.connectsTo=[];
	this.used=false;
}


Wall.prototype.draw = function(offSetX,offSetY, prev)
{
	ctx.fillStyle=rgb(0,0,0);
	ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,this.h);	
	if(this.door=="true")
	{
		ctx.fillStyle=rgb(139,69,19);
		if(prev==this.connectsTo[0])
		{
			ctx.fillStyle=rgb(212,175,55);
		}
		ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,this.h);	
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
	}
}