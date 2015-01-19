
function Bullet(x, y)
{
	this.x = x;
	this.y = y;
	this.w = 4;
	this.h = 4;
	this.team="";
	this.room=0;
	this.dir=0;
	this.xSpeed=0;
	this.ySpeed=0;
}

Bullet.prototype.getX = function()
{
	return this.x;
}
Bullet.prototype.getY = function()
{
	return this.y;
}

Bullet.prototype.setPos = function(x, y)
{
	this.x = x;
	this.y = y;
}

Bullet.prototype.update = function()
{
	/*
	if(this.dir==BulletDirections["left"])
	{
		this.x-=3;
	}
	if(this.dir==BulletDirections["up"])
	{
		this.y-=3;
	}
	if(this.dir==BulletDirections["right"])
	{
		this.x+=3;
	}
	if(this.dir==BulletDirections["down"])
	{
		this.y+=3;
	}
	*/
	this.x+=this.xSpeed;
	this.y+=this.ySpeed;
}

Bullet.prototype.getDir = function()
{
	return this.dir;
}

Bullet.prototype.draw = function(offSetX,offSetY)
{
	if(this.team=="blue")
	{
		ctx.fillStyle=rgb(0,0,255);
	}
	if(this.team=="red")
	{
		ctx.fillStyle=rgb(255,0,0);
	}
	ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,this.h);
}
