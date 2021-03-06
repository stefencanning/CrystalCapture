
function Bullet(x, y)
{
	this.x = x;
	this.y = y;
	this.w = 8;
	this.h = 8;
	this.team="";
	this.room=0;
	this.xSpeed=0;
	this.ySpeed=0;
	this.damage=0;
	this.poisonDamage=0;
	this.shotBy="";
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

Bullet.prototype.update = function(time)
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
	this.x+=this.xSpeed*time;
	this.y+=this.ySpeed*time;
}

Bullet.prototype.getDir = function()
{
	return this.dir;
}

Bullet.prototype.draw = function(offSetX,offSetY)
{
	if(main.playerTeam==this.team)
	{
		if(this.team=="blue")
		{
			ctx.fillStyle=rgb(0,0,255);
		}
		if(this.team=="red")
		{
			ctx.fillStyle=rgb(255,165,0);
		}
	}
	else
	{
		ctx.fillStyle=rgb(255,0,0);
	}
	ctx.fillRect(Math.ceil(this.x+offSetX),Math.ceil(this.y+offSetY),this.w,this.h);
}
