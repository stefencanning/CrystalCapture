function CharCust()
{
}

CharCust.prototype.Initialise = function()
{
}

CharCust.prototype.Loop = function () 
{
	charCust.Draw();
}

CharCust.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="20px Lucida Console";
	ctx.strokeStyle=rgb(0,0,255);
	ctx.fillText("skin colour", 50, 50);
	ctx.fillText("<-", 5, 50);
	ctx.fillText("->", 175, 50);
	ctx.fillText("gender", 50, 100);
	ctx.fillText("<-", 5, 100);
	ctx.fillText("->", 175, 100);
	ctx.fillText("hair", 50, 150);
	ctx.fillText(String.fromCharCode(91),145,150);
	ctx.fillText(String.fromCharCode(93),154,150);
	if(main.playerShowHair)
	{
		ctx.fillText(String.fromCharCode(42),150,155);
	}
	ctx.fillText("<-", 5, 150);
	ctx.fillText("->", 175, 150);
	ctx.fillText("clothes", 50, 200);
	ctx.fillText("<-", 5, 200);
	ctx.fillText("->", 175, 200);
	ctx.fillText("beard", 50, 250);
	ctx.fillText(String.fromCharCode(91),145,250);
	ctx.fillText(String.fromCharCode(93),154,250);
	if(main.playerShowBeard)
	{
		ctx.fillText(String.fromCharCode(42),150,255);
	}
	ctx.fillText("<-", 5, 250);
	ctx.fillText("->", 175, 250);
	for(i = 0; i < 4;i++)
	{
		ctx.drawImage(images.bodies[main.playerGender][main.playerBodyType][main.playerColour],main.animation[main.frame]*32,i*32,32,32,canvas.width/2,canvas.height/2+(i*32),32,32);
		if(main.playerShowHair)
		{
			ctx.drawImage(images.hair[main.playerGender][main.playerHair],main.animation[main.frame]*32,i*32,32,32,canvas.width/2,canvas.height/2+(i*32),32,32);
		}
		if(main.playerShowBeard)
		{
			ctx.drawImage(images.beard[main.playerBeard],main.animation[main.frame]*32,i*32,32,32,canvas.width/2,canvas.height/2+(i*32),32,32);
		}
		ctx.drawImage(images.clothes[main.playerGender][main.playerClothes],main.animation[main.frame]*32,i*32,32,32,canvas.width/2,canvas.height/2+(i*32),32,32);
	}
}


CharCust.prototype.onDoubleClick = function(e)
{
}

CharCust.prototype.onMouseMove = function(e)
{
}

CharCust.prototype.onMouseClick = function(e)
{
	if(e.x>5&&e.x<50&&e.y>20&&e.y<50)
	{
		main.playerColour-=1;
		if(main.playerColour<0)
		{
			main.playerColour=4;
		}
	}
	if(e.x>175&&e.x<210&&e.y>20&&e.y<50)
	{
		main.playerColour+=1;
		if(main.playerColour>4)
		{
			main.playerColour=0;
		}
	}
	if(e.x>5&&e.x<50&&e.y>70&&e.y<100)
	{
		main.playerGender-=1;
		if(main.playerGender<0)
		{
			main.playerGender=1;
		}
	}
	if(e.x>175&&e.x<210&&e.y>70&&e.y<100)
	{
		main.playerGender+=1;
		if(main.playerGender>1)
		{
			main.playerGender=0;
		}
	}
	if(e.x>5&&e.x<50&&e.y>120&&e.y<150)
	{
		main.playerHair-=1;
		if(main.playerHair<0)
		{
			main.playerHair=99;
		}
	}
	if(e.x>175&&e.x<210&&e.y>120&&e.y<150)
	{
		main.playerHair+=1;
		if(main.playerHair>99)
		{
			main.playerHair=0;
		}
	}
	if(e.x>145&&e.x<160&&e.y>120&&e.y<152)
	{
		if(main.playerShowHair==0)
		{
			main.playerShowHair=1;
		}
		else
		{
			main.playerShowHair=0;
		}
	}
	if(e.x>5&&e.x<50&&e.y>170&&e.y<200)
	{
		main.playerClothes-=1;
		if(main.playerClothes<0)
		{
			main.playerClothes=99;
		}
	}
	if(e.x>175&&e.x<210&&e.y>170&&e.y<200)
	{
		main.playerClothes+=1;
		if(main.playerClothes>99)
		{
			main.playerClothes=0;
		}
	}
	if(e.x>5&&e.x<50&&e.y>220&&e.y<250)
	{
		main.playerBeard-=1;
		if(main.playerBeard<0)
		{
			main.playerBeard=99;
		}
	}
	if(e.x>175&&e.x<210&&e.y>220&&e.y<250)
	{
		main.playerBeard+=1;
		if(main.playerBeard>99)
		{
			main.playerBeard=0;
		}
	}
	if(e.x>145&&e.x<160&&e.y>220&&e.y<252)
	{
		if(main.playerShowBeard==0)
		{
			main.playerShowBeard=1;
		}
		else
		{
			main.playerShowBeard=0;
		}
	}
	ctx.fillText(String.fromCharCode(91),145,150);
	ctx.fillText(String.fromCharCode(93),154,150);
	ctx.fillText(String.fromCharCode(42),150,155);
	if(e.x>canvas.width/2&&e.y>canvas.height/2)
	{
		//matchmaking= new Matchmaking();matchmaking.Initialise();main.mode=GAMESELECT;CLIENT.getGames();
		main.mode = MENU;
		menu = new Menu();
		menu.Initialise();
	}
}

CharCust.prototype.onContextMenu = function(e)
{
}

CharCust.prototype.onKeyPress = function(e)
{
}

CharCust.prototype.onKeyUp = function(e)
{
}