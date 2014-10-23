function Player(x, y)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.room = 0;
	this.team=0;
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
	ctx.fillRect(this.x,this.y,this.w,this.h);	
}
