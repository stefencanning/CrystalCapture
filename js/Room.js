function Room()
{
	this.walls = [];
	this.oriColor="";
	this.oriColorValue=200;
	this.foundColor="";
	this.foundColorValue=200;
	this.distBlue=-1;
	this.distRed=-1;
	this.previous=-1;
}


Room.prototype.addWall = function(wall)
{
	this.walls[this.walls.length] = wall;
}

Room.prototype.drawFirst = function(offSetX,offSetY)
{
	for(var i = 0; i < this.walls.length;i++)
	{
		this.walls[i].drawFirst(offSetX,offSetY,this.previous);
	}
}


Room.prototype.draw = function(offSetX,offSetY)
{
	for(var i = 0; i < this.walls.length;i++)
	{
		this.walls[i].draw(offSetX,offSetY,this.previous);
	}
}

Room.prototype.checkInside=function(x,y)
{
	var negX=1,posX=1,negY=1,posY=1;
	for(var i = 0; i < this.walls.length;i++)
	{
		if(this.walls[i].x<x)
		{
			negX+=1;
		}
		else if(this.walls[i].x>x)
		{
			posX+=1;
		}
		if(this.walls[i].y<y)
		{
			negY+=1;
		}
		else if(this.walls[i].y>y)
		{
			posY+=1;
		}
	}
	var xPer,yPer;
	var doorMat={};
	if(posX>negX)
	{
		xPer=posX/negX;
	}
	else
	{
		xPer=negX/posX;
	}
	if(posY>negY)
	{
		yPer=posY/negY;
	}
	else
	{
		yPer=negY/posY;
	}
	if(yPer>xPer)
	{
		if(posY>negY)
		{
			doorMat= {"x":x,"y":y+32};
		}
		else
		{
			doorMat= {"x":x,"y":y-32};
		}
	}
	else
	{
		if(posX>negX)
		{
			doorMat= {"x":x+32,"y":y};
		}
		else
		{
			doorMat= {"x":x-32,"y":y};
		}
	}
	return doorMat;
}

Room.prototype.checkRoomDist = function()
{
	for(var i = 0; i <this.walls.length;i++)
	{
		if(this.walls[i].door == "true")
		{
			if(game.rooms[this.walls[i].connectsTo[0]].distBlue != -1)
			{
				var dist = game.rooms[this.walls[i].connectsTo[0]].distBlue;
				if(dist < this.distBlue-1||this.distBlue==-1)
				{
					this.distBlue=dist+1;
					for(var j = 0; j < this.walls.length; j++)
					{
						if(this.walls[j].door == "true")
						{
							game.rooms[this.walls[j].connectsTo[0]].checkRoomDist();
						}
					}
				}
			}
			if(game.rooms[this.walls[i].connectsTo[0]].distRed != -1)
			{
				var dist = game.rooms[this.walls[i].connectsTo[0]].distRed;
				if(dist < this.distRed-1||this.distRed==-1)
				{
					this.distRed=dist+1;
					for(var j = 0; j < this.walls.length; j++)
					{
						if(this.walls[j].door == "true")
						{
							game.rooms[this.walls[j].connectsTo[0]].checkRoomDist();
						}
					}
				}
			}
			/*
			if(this.distBlue != -1)
			{
				var dist = game.rooms[this.walls[i].connectsTo[0]].distBlue;
				if(dist-1 > this.distBlue||dist==-1)
				{
					game.rooms[this.walls[i].connectsTo[0]].distBlue=this.distBlue+1;
					game.rooms[this.walls[i].connectsTo[0]].checkRoomDist();
				}
			}
			if(this.distRed != -1)
			{
				var dist = game.rooms[this.walls[i].connectsTo[0]].distRed;
				if(dist-1> this.distRed||dist==-1)
				{
					game.rooms[this.walls[i].connectsTo[0]].distRed=this.distRed+1;
					game.rooms[this.walls[i].connectsTo[0]].checkRoomDist();
				}
			}
			*/
		}
	}
}

Room.prototype.checkCollision = function(object)
{
	var x,y,w,h;
	x=object.x+4;
	y=object.y+8;
	w=object.w-8;
	h=object.h;
	xEnd=object.x;
	yEnd=object.y;
	var x2,y2,w2,h2;
	var totalOverlap=[0,0];
	var roomChange = false;
	for(var i = 0; i < this.walls.length;i++)
	{
		x2=this.walls[i].x;
		y2=this.walls[i].y;
		w2=this.walls[i].w;
		h2=this.walls[i].h;
		if(x+w>x2&&x<x2+w2&&y+h>y2&&y<y2+h2)
		{
			if(this.walls[i].door == "true")
			{
				if(object.doorTime<=0)
				{
					object.doorTime=1000;
					return {"roomChange":true,"x":this.walls[i].connectsTo[1],"y":this.walls[i].connectsTo[2],"room":this.walls[i].connectsTo[0]};
				}
			}
			var overlapX,overlapY;
			if(x<x2)
			{
				overlapX = x2-(x+w);
			}
			else
			{
				overlapX = x2+w2-x;
			}
			if(y<y2)
			{
				overlapY = y2-(y+h);
			}
			else
			{
				overlapY = y2+h2-y;
			}
			if(Math.abs(overlapY)!=Math.abs(overlapX))
			{
				if(Math.abs(overlapY)<Math.abs(overlapX))
				{
					totalOverlap[1]=overlapY;
				}
				else
				{
					totalOverlap[0]=overlapX;
				}
			}
		}
	}
	xEnd+=totalOverlap[0];
	yEnd+=totalOverlap[1];
	return {"roomChange":false,"x":xEnd,"y":yEnd,"room":-1};
}

Room.prototype.checkCollide = function(object)
{
	var x,y,w,h;
	x=object.x;
	y=object.y;
	w=object.w;
	h=object.h;
	var x2,y2,w2,h2;
	for(var i = 0; i < this.walls.length;i++)
	{
		if(((this.walls[i].x-x)*(this.walls[i].x-x))+((this.walls[i].y-y)*(this.walls[i].y-y))<(this.walls[i].w*this.walls[i].h)*(h*w))
		{
			x2=this.walls[i].x;
			y2=this.walls[i].y;
			w2=this.walls[i].w;
			h2=this.walls[i].h;
			if(x+w>x2&&x<x2+w2&&y+h>y2&&y<y2+h2)
			{
				return true;
			}
		}
	}
	return false;
}