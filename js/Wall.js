function Wall(x,y)
{
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.door="false";
	this.connectsTo=[];
}


Wall.prototype.draw = function(offSetX,offSetY)
{
	ctx.fillStyle=rgb(0,0,0);
	if(this.door=="true")
	{
		ctx.fillStyle=rgb(139,69,19);
	}
	ctx.fillRect(this.x+offSetX,this.y+offSetY,this.w,this.h);	
}