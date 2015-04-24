function CharCust()
{
}

CharCust.prototype.Initialise = function()
{
	
	
	var col = getCookie("skin colour");
	if(col!="")
	{
		main.playerColour=col;
	}
	var gender = getCookie("gender");
	if(gender!="")
	{
		main.playerGender=gender;
	}
	var hair = getCookie("hair");
	if(hair!="")
	{
		main.playerHair=hair;
	}
	var clothes = getCookie("clothes");
	if(clothes!="")
	{
		main.playerClothes=clothes;
	}
	var beard = getCookie("beard");
	if(beard!="")
	{
		main.playerBeard=beard;
	}
	var gun = getCookie("gun type");
	if(gun!="")
	{
		main.playerGun=gun;
	}
	var HPscaling = getCookie("HP");
	if(HPscaling!="")
	{
		main.playerHealthScaling=HPscaling;
	}
	var Speedscaling = getCookie("speed");
	if(Speedscaling!="")
	{
		main.playerSpeedScaling=Speedscaling;
	}
	var perk = getCookie("perk");
	if(perk!="")
	{
		main.playerPerk=perk;
	}
	var showHair = getCookie("showHair");
	if(showHair!="")
	{
		main.playerShowHair=showHair;
	}
	var showBeard = getCookie("showBeard");
	if(showBeard!="")
	{
		main.playerShowBeard=showBeard;
	}
	
	
	
	
	var center = canvas.width/2;
	charCust.options =[];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"skin colour",function (){ main.playerColour-=1;if(main.playerColour<0){main.playerColour=4;}},function () { main.playerColour+=1;if(main.playerColour>4){main.playerColour=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"gender",function () { main.playerGender-=1;if(main.playerGender<0){main.playerGender=1;}},function () { main.playerGender+=1;if(main.playerGender>1){main.playerGender=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"hair",function () { main.playerHair-=1;if(main.playerHair<0){main.playerHair=19;}},function () { main.playerHair+=1;if(main.playerHair>19){main.playerHair=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"clothes",function () { main.playerClothes-=1;if(main.playerClothes<0){main.playerClothes=19;}},function () { main.playerClothes+=1;if(main.playerClothes>19){main.playerClothes=0;}},""];
	charCust.options[charCust.options.length]=[center-295,50+(charCust.options.length*50),"beard",function () { main.playerBeard-=1;if(main.playerBeard<0){main.playerBeard=19;}},function () { main.playerBeard+=1;if(main.playerBeard>19){main.playerBeard=0;}},""];
	var num = charCust.options.length;
	charCust.options[charCust.options.length]=[center+100,50+((charCust.options.length-num)*50),"gun type",function () { main.playerGun-=1;if(main.playerGun<0){main.playerGun=main.guns.length-1;}},function () { main.playerGun+=1;if(main.playerGun>main.guns.length-1){main.playerGun=0;}},"gun"];
	charCust.options[charCust.options.length]=[center+100,50+((charCust.options.length-num)*50),"HP:speed",
	function () 
	{ 
		if(main.playerHealthScaling<20)
		{
			if(main.playerHealthScaling>=10)
			{
				main.playerHealthScaling+=1;
			}
			main.playerHealthScaling=main.playerHealthScaling+1;
			if(main.playerSpeedScaling>10)
			{
				main.playerSpeedScaling-=1;
			}
			main.playerSpeedScaling=main.playerSpeedScaling-1;
		}
	},function () {if(main.playerHealthScaling>5){if(main.playerHealthScaling>10){main.playerHealthScaling-=1;}main.playerHealthScaling=main.playerHealthScaling-1;if(main.playerSpeedScaling>=10){main.playerSpeedScaling+=1;}main.playerSpeedScaling=main.playerSpeedScaling+1;}},"HS"];
	charCust.options[charCust.options.length]=[center+100,50+((charCust.options.length-num)*50),"perk",function () { main.playerPerk-=1;if(main.playerPerk<0){main.playerPerk=main.perks.length-1;}},function () { main.playerPerk+=1;if(main.playerPerk>main.perks.length-1){main.playerPerk=0;}},"perk"];
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

CharCust.prototype.Loop = function () 
{
	charCust.Draw();
}

CharCust.prototype.Draw = function()
{
	var center = canvas.width/2;
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = "rgba(160, 160, 160, 1)";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	
	
	//ctx.drawImage(dancerImg[game.waitingImage],40,40);
	
	
	ctx.font="bold 20px Courier";
	
	
	var gradient=ctx.createLinearGradient(center-25,50,center+25,200);
	gradient.addColorStop("0",rgb(0, 0, 255));
	gradient.addColorStop("1.0",rgb(255,165,0));
	ctx.strokeStyle=gradient;
	ctx.fillStyle = gradient;
	
	for(var i = 0; i < charCust.options.length; i++)
	{
		var x = charCust.options[i][0]+60;
		x-=(charCust.options[i][2].length/2)*11;
		main.fillText(charCust.options[i][2], x+35, charCust.options[i][1]);
		main.fillText("<-",  charCust.options[i][0], charCust.options[i][1]);
		main.fillText("->", charCust.options[i][0]+170, charCust.options[i][1]);
		if(charCust.options[i][5]=="gun")
		{
			main.fillText(main.guns[main.playerGun], charCust.options[i][0]+100-(((main.guns[main.playerGun]).length/2)*11), charCust.options[i][1]+25);
		}
		else if(charCust.options[i][5]=="HS")
		{
			main.fillText((main.playerHealthScaling*10)+'%:'+(main.playerSpeedScaling*10)+'%', charCust.options[i][0]+100-((((main.playerHealthScaling*10)+'%:'+(main.playerSpeedScaling*10)+'%').length/2)*11), charCust.options[i][1]+25);
		}
		else if(charCust.options[i][5]=="perk")
		{
			main.fillText(main.perks[main.playerPerk], charCust.options[i][0]+100-(((main.perks[main.playerPerk]).length/2)*11), charCust.options[i][1]+25);
		}
	}
	main.fillText("[",(canvas.width/2)-159,150);
	main.fillText("]",(canvas.width/2)-149,150);
	if(main.playerShowHair==1)
	{
		main.fillText("*",(canvas.width/2)-154,155);
	}
	main.fillText("[",(canvas.width/2)-159,250);
	main.fillText("]",(canvas.width/2)-149,250);
	if(main.playerShowBeard==1)
	{
		main.fillText("*",(canvas.width/2)-154,255);
	}
	
	for(i = 0; i < 4;i++)
	{
		ctx.drawImage(images.bodies[main.playerGender][main.playerBodyType][main.playerColour],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
		if(main.playerShowHair==1)
		{
			ctx.drawImage(images.hair[main.playerGender][main.playerHair],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
		}
		if(main.playerShowBeard==1)
		{
			ctx.drawImage(images.beard[main.playerBeard],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
		}
		ctx.drawImage(images.clothes[main.playerGender][main.playerClothes],main.animation[main.frame]*32,i*32,32,32,canvas.width/2-16,50+(i*32),32,32);
	}
	var x = canvas.width/2 - (("create").length/2*12);
	ctx.strokeRect(x,50+(4*32),("create").length*12+5,20);
	main.fillText("create", x+2, 50+(4*32)+18);
	gradient=0;
	
	
	ctx.lineWidth=2;
	ctx.strokeStyle=rgb(0,0,0);
	ctx.strokeRect(0,0,canvas.width, canvas.height);
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
	var x = canvas.width/2 - (("create").length/2*12);
	ctx.strokeRect(x,50+(4*32),("create").length*12+5,20);
	if(e.x>canvas.width/2 - (("create").length/2*12)&&e.x<canvas.width/2 + (("create").length/2*12)+5&&e.y>50&&e.y<50+158)
	{
		//matchmaking= new Matchmaking();matchmaking.Initialise();main.mode=GAMESELECT;CLIENT.getGames();
		setCookie("skin colour",main.playerColour,365);
		setCookie("gender",main.playerGender,365);
		setCookie("hair",main.playerHair,365);
		setCookie("clothes",main.playerClothes,365);
		setCookie("beard",main.playerBeard,365);
		setCookie("gun type",main.playerGun,365);
		setCookie("HP",main.playerHealthScaling,365);
		setCookie("speed",main.playerSpeedScaling,365);
		setCookie("perk",main.playerPerk,365);
		setCookie("showHair",main.playerShowHair,365);
		setCookie("showBeard",main.playerShowBeard,365);
		main.mode = MENU;
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