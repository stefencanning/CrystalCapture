
function Bomb(x, y)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.team="";
	this.room=0;
	this.shotBy="";
	this.timer=4000;
	this.fireOne=false;
	this.fireTwo=false;
	this.rotation=0;
	this.timeToScale=500;
	this.scale = 0;
}

Bomb.prototype.getX = function()
{
	return this.x;
}
Bomb.prototype.getY = function()
{
	return this.y;
}

Bomb.prototype.setPos = function(x, y)
{
	this.x = x;
	this.y = y;
}

Bomb.prototype.update = function(time)
{
	this.timer -= time;
	this.timeToScale-= time;
	if(this.timeToScale<=0)
	{
		this.timeToScale=500;
		if(this.scale==2)
		{
			this.scale=0;
		}
		else
		{
			this.scale=2;
		}
	}
}

Bomb.prototype.getDir = function()
{
	return this.dir;
}

Bomb.prototype.draw = function(offSetX,offSetY)
{
	if(main.playerTeam==this.team)
	{
		if(this.team=="blue")
		{
			ctx.drawImage(images.bombBlue,Math.ceil(this.x-this.scale+offSetX),Math.ceil(this.y-this.scale+offSetY),this.w+(this.scale*2),this.h+(this.scale*2));
		}
		if(this.team=="red")
		{
			ctx.drawImage(images.bombYellow,Math.ceil(this.x-this.scale+offSetX),Math.ceil(this.y-this.scale+offSetY),this.w+(this.scale*2),this.h+(this.scale*2));
		}
	}
	else
	{
		ctx.drawImage(images.bombRed,Math.ceil(this.x-this.scale+offSetX),Math.ceil(this.y-this.scale+offSetY),this.w+(this.scale*2),this.h+(this.scale*2));
	}
}
