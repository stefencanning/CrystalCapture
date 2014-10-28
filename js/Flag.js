function Flag(x,y,team)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.team=team;
	this.room=0;
}


Flag.prototype.draw = function(offSetX,offSetY)
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