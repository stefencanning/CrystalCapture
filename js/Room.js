function Room()
{
	this.walls = [];
}


Room.prototype.addWall = function(wall)
{
	this.walls[this.walls.length] = wall;
}


Room.prototype.draw = function()
{
	for(var i = 0; i < this.walls.length;i++)
	{
		this.walls[i].draw();
	}
}



Room.prototype.checkCollision = function(object)
{
	var x,y,w,h;
	x=object.x;
	y=object.y;
	w=object.w;
	h=object.h;
	var x2,y2,w2,h2;
	var totalOverlap=[0,0];
	for(var i = 0; i < this.walls.length;i++)
	{
		x2=this.walls[i].x;
		y2=this.walls[i].y;
		w2=this.walls[i].w;
		h2=this.walls[i].h;
		if(x+w>x2&&x<x2+w2&&y+h>y2&&y<y2+h2)
		{
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
	x+=totalOverlap[0];
	y+=totalOverlap[1];
	return [x,y];
}