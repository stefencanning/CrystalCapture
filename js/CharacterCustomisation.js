function CharCust()
{
}

CharCust.prototype.Initialise = function()
{
	var center = canvas.width/2;
	charCust.options =[];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"skin colour",function (){ main.playerColour-=1;if(main.playerColour<0){main.playerColour=4;}},function () { main.playerColour+=1;if(main.playerColour>4){main.playerColour=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"gender",function () { main.playerGender-=1;if(main.playerGender<0){main.playerGender=1;}},function () { main.playerGender+=1;if(main.playerGender>1){main.playerGender=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"hair",function () { main.playerHair-=1;if(main.playerHair<0){main.playerHair=19;}},function () { main.playerHair+=1;if(main.playerHair>19){main.playerHair=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"clothes",function () { main.playerClothes-=1;if(main.playerClothes<0){main.playerClothes=19;}},function () { main.playerClothes+=1;if(main.playerClothes>19){main.playerClothes=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"beard",function () { main.playerBeard-=1;if(main.playerBeard<0){main.playerBeard=19;}},function () { main.playerBeard+=1;if(main.playerBeard>19){main.playerBeard=0;}},""];
	var num = charCust.options.length;
	charCust.options[charCust.options.length]=[center+100,50+((charCust.options.length-num)*50),"gun type",function () { main.playerGun-=1;if(main.playerGun<0){main.playerGun=main.guns.length-1;}},function () { main.playerGun+=1;if(main.playerGun>main.guns.length-1){main.playerGun=0;}},"gun"];
	charCust.options[charCust.options.length]=[center+100,50+((charCust.options.length-num)*50),"HP:speed",function () { if(main.playerHealthScaling<20){if(main.playerHealthScaling>=10){main.playerHealthScaling+=1;}main.playerHealthScaling=main.playerHealthScaling+1;if(main.playerSpeedScaling>10){main.playerSpeedScaling-=1;}main.playerSpeedScaling=main.playerSpeedScaling-1;}},function () {if(main.playerHealthScaling>5){if(main.playerHealthScaling>10){main.playerHealthScaling-=1;}main.playerHealthScaling=main.playerHealthScaling-1;if(main.playerSpeedScaling>=10){main.playerSpeedScaling+=1;}main.playerSpeedScaling=main.playerSpeedScaling+1;}},"HS"];
	charCust.options[charCust.options.length]=[center+100,50+((charCust.options.length-num)*50),"perk",function () { main.playerPerk-=1;if(main.playerPerk<0){main.playerPerk=main.perks.length-1;}},function () { main.playerPerk+=1;if(main.playerPerk>main.perks.length-1){main.playerPerk=0;}},"perk"];
}

CharCust.prototype.Loop = function () 
{
	charCust.Draw();
}

CharCust.prototype.Draw = function()
{
	var center = canvas.width/2;
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	ctx.fillStyle = rgb(0, 0, 0);
	ctx.font="bold 20px Courier";
	ctx.strokeStyle=rgb(0,0,255);
	var gradient=ctx.createLinearGradient(center-25,50,center+25,200);
	gradient.addColorStop("0",rgb(0, 0, 255));
	gradient.addColorStop("1.0",rgb(255,165,0));
	ctx.strokeStyle=gradient;
	ctx.fillStyle = gradient;
	
	for(var i = 0; i < charCust.options.length; i++)
	{
		var x = charCust.options[i][0]+60;
		x-=(charCust.options[i][2].length/2)*11;
		ctx.fillText(charCust.options[i][2], x+35, charCust.options[i][1]);
		ctx.fillText("<-",  charCust.options[i][0], charCust.options[i][1]);
		ctx.fillText("->", charCust.options[i][0]+170, charCust.options[i][1]);
		if(charCust.options[i][5]=="gun")
		{
			ctx.fillText(main.guns[main.playerGun], charCust.options[i][0]+100-(((main.guns[main.playerGun]).length/2)*11), charCust.options[i][1]+25);
		}
		else if(charCust.options[i][5]=="HS")
		{
			ctx.fillText((main.playerHealthScaling*10)+'%:'+(main.playerSpeedScaling*10)+'%', charCust.options[i][0]+100-((((main.playerHealthScaling*10)+'%:'+(main.playerSpeedScaling*10)+'%').length/2)*11), charCust.options[i][1]+25);
		}
		else if(charCust.options[i][5]=="perk")
		{
			ctx.fillText(main.perks[main.playerPerk], charCust.options[i][0]+100-(((main.perks[main.playerPerk]).length/2)*11), charCust.options[i][1]+25);
		}
	}
	ctx.fillText(String.fromCharCode(91),(canvas.width/2)-159,150);
	ctx.fillText(String.fromCharCode(93),(canvas.width/2)-149,150);
	if(main.playerShowHair)
	{
		ctx.fillText(String.fromCharCode(42),(canvas.width/2)-155,155);
	}
	ctx.fillText(String.fromCharCode(91),(canvas.width/2)-159,250);
	ctx.fillText(String.fromCharCode(93),(canvas.width/2)-149,250);
	if(main.playerShowBeard)
	{
		ctx.fillText(String.fromCharCode(42),(canvas.width/2)-154,255);
	}
	/*
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
	*/
	for(i = 0; i < 4;i++)
	{
		ctx.drawImage(images.bodies[main.playerGender][main.playerBodyType][main.playerColour],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
		if(main.playerShowHair)
		{
			ctx.drawImage(images.hair[main.playerGender][main.playerHair],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
		}
		if(main.playerShowBeard)
		{
			ctx.drawImage(images.beard[main.playerBeard],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
		}
		ctx.drawImage(images.clothes[main.playerGender][main.playerClothes],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
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
	for(var i = 0; i < charCust.options.length; i++)
	{
		if(e.x>charCust.options[i][0]&&e.x<charCust.options[i][0]+25&&e.y>charCust.options[i][1]-30&&e.y<charCust.options[i][1])
		{
			charCust.options[i][3]();
		}
		if(e.x>charCust.options[i][0]+170&&e.x<charCust.options[i][0]+195&&e.y>charCust.options[i][1]-30&&e.y<charCust.options[i][1])
		{
			charCust.options[i][4]();
		}
	}
	if(e.x>(canvas.width/2)-155&&e.x<(canvas.width/2)-140&&e.y>120&&e.y<152)
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
	if(e.x>(canvas.width/2)-155&&e.x<(canvas.width/2)-140&&e.y>220&&e.y<252)
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
	/*
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
			main.playerHair=19;
		}
	}
	if(e.x>175&&e.x<210&&e.y>120&&e.y<150)
	{
		main.playerHair+=1;
		if(main.playerHair>19)
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
			main.playerClothes=19;
		}
	}
	if(e.x>175&&e.x<210&&e.y>170&&e.y<200)
	{
		main.playerClothes+=1;
		if(main.playerClothes>19)
		{
			main.playerClothes=0;
		}
	}
	if(e.x>5&&e.x<50&&e.y>220&&e.y<250)
	{
		main.playerBeard-=1;
		if(main.playerBeard<0)
		{
			main.playerBeard=19;
		}
	}
	if(e.x>175&&e.x<210&&e.y>220&&e.y<250)
	{
		main.playerBeard+=1;
		if(main.playerBeard>19)
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
	*/
	//ctx.fillText(String.fromCharCode(91),145,150);
	//ctx.fillText(String.fromCharCode(93),154,150);
	//ctx.fillText(String.fromCharCode(42),150,155);canvas.width/2-16,50+(i*32)
	if(e.x>canvas.width/2-16&&e.x<canvas.width/2+16&&e.y>50&&e.y<50+128)
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