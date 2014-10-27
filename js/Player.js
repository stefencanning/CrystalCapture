function Player(x, y)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.health = 100;
	this.room = 0;
	this.rotation=0;
	this.gotFlag=0;
}

Player.prototype.getX = function()
{//Returns the x position of the player on the grid
	return this.x;
}
Player.prototype.getY = function()
{//Returns the y position of the player on the grid
	return this.y;
}

Player.prototype.setPos = function(x, y)
{//Sets the position of the player on the grid
	this.x = x;
	this.y = y;
}

Player.prototype.update = function()
{
}

Player.prototype.getDir = function()
{
	return this.dir;
}

Player.prototype.draw = function()
{
	ctx.fillStyle=rgb(0,0,0);
	ctx.fillRect(this.x-1,this.y-11,this.w+2,7);
	ctx.fillStyle=rgb(0,255,0);	
	ctx.fillRect(this.x,this.y-10,this.w*(this.health/100),5);
	ctx.fillStyle=rgb(0,0,0);	
	ctx.fillRect(this.x,this.y,this.w,this.h);
	if(this.gotFlag==1)
	{
		if(main.playerTeam=="blue")
		{
			ctx.fillStyle=rgb(255,0,0);
		}
		if(main.playerTeam=="red")
		{
			ctx.fillStyle=rgb(0,0,255);
		}
		ctx.fillRect(this.x,this.y,this.w,5);	
		ctx.fillRect(this.x,this.y,2,this.h);	
	}
}
