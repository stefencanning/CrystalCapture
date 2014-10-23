function Flag(x,y,team)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.team=team;
}


Flag.prototype.draw = function()
{
	if(this.team==0)
	{
		ctx.fillStyle=rgb(0,0,255);
	}
	else
	{
		ctx.fillStyle=rgb(255,0,0);
	}
	ctx.fillRect(this.x,this.y,this.w,this.h);	
}