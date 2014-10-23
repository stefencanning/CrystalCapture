function Player(x, y, en)
{
	this.x = x;
	this.y = y;
	this.width = 40;
	this.height = 40;
	this.ready = true;
	this.enemy = en;
	this.velX = 0;
	this.velY = 0;
	this.targetX = x;
	this.targetY = y;
	this.dir = 0;
	this.move = false;
}

Player.prototype.getX = function()
{//Returns the x position of the player on the grid
	return this.x;
}
Player.prototype.getY = function()
{//Returns the y position of the player on the grid
	return this.y;
}
Player.prototype.getReady = function()
{//Returns the status of the player
	return this.ready;
}

Player.prototype.setPos = function(x, y)
{//Sets the position of the player on the grid
	this.x = x;
	this.y = y;
}
Player.prototype.setReady = function(rdy)
{//Sets the players status
	this.ready = rdy;
}

//Set of methods for moving in puzzle tag
Player.prototype.setVel = function(x, y)
{
	if(this.move == false)
	{
		this.velX = x;
		this.velY = y;
		if(x > 0 || x < 0)
		{
			this.dir = 1;
		}
		else if(y > 0 || y < 0)
		{
			this.dir = 0;
		}
		this.move = true;
	}

}
Player.prototype.setEnd = function(x, y)
{
	this.targetX = x;
	this.targetY = y;
	this.move = true;
}
Player.prototype.update = function()
{
	if(this.move == true)
	{
		if(this.x == this.targetX && this.y == this.targetY)
		{		
			this.velX = 0;
			this.velY = 0;
			this.move = false;
		}
		else
		{
			this.x += this.velX*2;
			this.y += this.velY*2;
		}
	}
}

Player.prototype.getDir = function()
{
	return this.dir;
}

Player.prototype.draw = function()
{
	if(this.enemy == false)
	{
		ctx.fillStyle=rgb(0,0,255);
	}
	else
	{
		ctx.fillStyle=rgb(255,0,0);
	}
	
	ctx.fillRect((this.x*100)+30,(this.y*100)+30,this.width,this.height);	
}

Player.prototype.tagDraw = function()
{
	ctx.fillStyle = rgb(0, 255, 0);
	ctx.fillRect(this.x + 30, this.y + 30, this.width, this.height);
}