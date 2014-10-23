function Wall(x,y)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
}


Wall.prototype.draw = function()
{
	ctx.fillStyle=rgb(0,0,0);
	ctx.fillRect(this.x,this.y,this.w,this.h);	
}