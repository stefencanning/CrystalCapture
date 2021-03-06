//var redCaptureImg,blueCaptureImg,redStandingCrystal,blueStandingCrystal,redCrystalBase,blueCrystalBase,redGrabbedCrystal,blueGrabbedCrystal;
//var bodyType,gender,bodies;

function Images()
{
	
}

Images.prototype.Initialise = function()
{
	images.imagesToLoad=[];
	images.currentIndex=0;
	images.border = document.createElement('div'); 
	images.border.id="progress";
	images.border.style.textAlign="center";
	images.border.style.marginLeft="auto";
	images.border.style.marginRight="auto";
	images.bar = document.createElement('div'); 
	images.bar.id="bar";
	images.bar.style.width=("0%");
	images.bar.style.textAlign="center";
	images.border.appendChild(images.bar);
	document.getElementById('div').appendChild(images.border);
	images.BodyImages();
	images.HairImages();
	images.ClothesImages();
	images.CrystalImages();
	images.BeardImages();
	images.WallsImages();
}

Images.prototype.WallsImages = function()
{
	images.walls=[];
	for(var i = 0; i < 21; i++)
	{
		images.walls[i]=new Image();
		images.imagesToLoad[images.imagesToLoad.length]=[images.walls[i],"img/walls/"+i+".png"];
		/*
		images.walls[i].src="img/walls/"+i+".png";
		while(!images.walls[i].complete){images.walls[i].src="img/walls/"+i+".png";}
		images.currentCount+=1;
		images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';*/
	}
	images.wall=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.wall,"img/walls/wall.png"];
	images.wallCrack=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.wallCrack,"img/walls/wall2.png"];
	images.floor=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.floor,"img/walls/floor.png"];
	images.floorLava=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.floorLava,"img/walls/floorLava.png"];
	/*
	images.walls[15].src="img/walls/wall.png";
	while(!images.walls[15].complete){images.walls[15].src="img/walls/wall.png";}
	images.currentCount+=1;
	images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
	*/
	
	
	images.doors=[];
	images.doors[0]=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.doors[0],"img/walls/doorTop.png"];
	/*
	images.doors[0].src="img/walls/doorTop2.png";
	while(!images.doors[0].complete){images.doors[0].src="img/walls/doorTop2.png";}
	images.currentCount+=1;
	images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
	*/
	
	
	images.doors[1]=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.doors[1],"img/walls/doorSide.png"];
	/*
	images.doors[1].src="img/walls/doorSide.png";
	while(!images.doors[1].complete){images.doors[1].src="img/walls/doorSide.png";}
	images.currentCount+=1;
	images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
	*/
	
	
	images.doors[2]=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.doors[2],"img/walls/doorTop5.png"];
	images.grave=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.grave,"img/walls/gravestone.png"];
	/*
	images.doors[2].src="img/walls/doorTop4.png";
	while(!images.doors[2].complete){images.doors[2].src="img/walls/doorTop4.png";}
	images.currentCount+=1;
	images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
	*/
	images.bombBlue=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.bombBlue,"img/walls/bluebomb.png"];
	
	images.bombYellow=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.bombYellow,"img/walls/yellowbomb.png"];
	
	images.bombRed=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.bombRed,"img/walls/redbomb.png"];
	
	images.skull=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.skull,"img/perks/skull.png"];
	
	images.bombPerk=[new Image(),new Image()];
	images.imagesToLoad[images.imagesToLoad.length]=[images.bombPerk[0],"img/perks/bomb perk off.png"];
	images.imagesToLoad[images.imagesToLoad.length]=[images.bombPerk[1],"img/perks/bomb perk.png"];
	images.flagPerk=[new Image(),new Image()];
	images.imagesToLoad[images.imagesToLoad.length]=[images.flagPerk[0],"img/perks/flag sprint perk off.png"];
	images.imagesToLoad[images.imagesToLoad.length]=[images.flagPerk[1],"img/perks/flag sprint perk.png"];
	images.healthPerk=[new Image(),new Image()];
	images.imagesToLoad[images.imagesToLoad.length]=[images.healthPerk[0],"img/perks/health regen perk off.png"];
	images.imagesToLoad[images.imagesToLoad.length]=[images.healthPerk[1],"img/perks/health regen perk.png"];
	images.poisonPerk=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.poisonPerk,"img/perks/poison bullet perk.png"];
}

Images.prototype.BodyImages = function()
{
	images.bodies=[];
	strGen="$male - ";
	for(i=0;i<2;i++)
	{
		images.bodies[i]=[];
		strRace="human - ";
		for(j=0;j<1;j++)
		{
			images.bodies[i][j]=[];
			for(k=0;k<5;k++)
			{
				strCol="";
				if(k==0)
				{
					strCol="white";
				}
				else if(k==1)
				{
					strCol="pale";
				}
				else if(k==2)
				{
					strCol="tanned";
				}
				else if(k==3)
				{
					strCol="dark";
				}
				else if(k==4)
				{
					strCol="black";
				}
				images.bodies[i][j][k]=new Image();
				images.imagesToLoad[images.imagesToLoad.length]=[images.bodies[i][j][k],"img/body/"+strGen+strRace+strCol+".png"];
				/*
				images.bodies[i][j][k].src="img/body/"+strGen+strRace+strCol+".png";
				while(!images.bodies[i][j][k].complete){images.bodies[i][j][k].src="img/body/"+strGen+strRace+strCol+".png";}
				images.currentCount+=1;
				images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
				*/
			}
			strRace="elf - "; 
		}
		strGen="$female - ";
	}
}

Images.prototype.CrystalImages = function()
{
	images.victory=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.victory,"img/crystal/victory.png"];
	images.defeat=new Image();
	images.imagesToLoad[images.imagesToLoad.length]=[images.defeat,"img/crystal/defeat.png"];
	
	images.crystal = [];
	
	strColour="yellow";
	for(i=0;i<2;i++)
	{
		images.crystal[i]=[];
		for(k=0;k<3;k++)
		{
			strType="";
			if(k==0)
			{
				strType="Crystal";
			}
			else if(k==1)
			{
				strType="CrystalBase";
			}
			else if(k==2)
			{
				strType="GrabbedCrystal";
			}
			images.crystal[i][k]=new Image();
			images.imagesToLoad[images.imagesToLoad.length]=[images.crystal[i][k],"img/crystal/"+strColour+strType+".png"];
			/*
			images.crystal[i][k].src="img/crystal/"+strColour+strType+".png";
			while(!images.crystal[i][k].complete){images.crystal[i][k].src="img/body/"+strColour+strType+".png";}
			images.currentCount+=1;
			images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
			*/
		}
		strColour="blue";
	}
}

Images.prototype.HairImages = function()
{
	images.hair=[];
	strGen="male ";
	for(i=0;i<2;i++)
	{
		images.hair[i]=[];
		for(k=0;k<20;k++)
		{
			images.hair[i][k]=new Image();
			images.imagesToLoad[images.imagesToLoad.length]=[images.hair[i][k],"img/hair/$hair "+strGen+"("+(k+1)+").png"];
			/*
			images.hair[i][k].src="img/hair/$hair "+strGen+"("+(k+1)+").png";
			while(!images.hair[i][k].complete){images.hair[i][k].src="img/hair/$hair "+strGen+"("+(k+1)+").png";}
			images.currentCount+=1;
			images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
			*/
		}
		strGen="female ";
	}
}

Images.prototype.BeardImages = function()
{
	images.beard=[];
	for(k=0;k<20;k++)
	{
		images.beard[k]=new Image();
		images.imagesToLoad[images.imagesToLoad.length]=[images.beard[k],"img/beard/$beard ("+(k+1)+").png"];
		/*
		images.beard[k].src="img/beard/$beard ("+(k+1)+").png";
		while(!images.beard[k].complete){images.beard[k].src="img/beard/$beard ("+(k+1)+").png";}
		images.currentCount+=1;
		images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
		*/
	}
}

Images.prototype.ClothesImages = function()
{
	images.clothes=[];
	strGen="male ";
	for(i=0;i<2;i++)
	{
		images.clothes[i]=[];
		for(k=0;k<20;k++)
		{
			images.clothes[i][k]=new Image();
			images.imagesToLoad[images.imagesToLoad.length]=[images.clothes[i][k],"img/clothes/$clothes "+strGen+"("+(k+1)+").png"];
			/*
			images.clothes[i][k].src="img/clothes/$clothes "+strGen+"("+(k+1)+").png";
			while(!images.clothes[i][k].complete){images.clothes[i][k].src="img/clothes/$clothes "+strGen+"("+(k+1)+").png";}
			images.currentCount+=1;
			images.bar.style.width=((images.currentCount/images.totalCount)*100)+'%';
			*/
		}
		strGen="female ";
	}
}

Images.prototype.loadImages = function()
{
	images.bar.style.width=(((sound.currentIndex+images.currentIndex)/(sound.soundsToLoad.length+images.imagesToLoad.length))*100)+'%';
	if (images.imagesToLoad.length == 0 || images.imagesToLoad.length <= images.currentIndex)
	{
		images.bar.style.backgroundColor="green";
		document.getElementById('div').removeChild(images.border);
		if(images.Ready)
		{
			main = new Main();
			document.getElementById('div').appendChild(document.createElement('br'));
			sound.playSong(sound.songNumbers["menu"]);
		}
		else
		{
			images.Ready=true;
			p1Button = document.createElement('input');
			p1Button.type="button";
			p1Button.id="button";
			p1Button.value="Submit";
			document.getElementById('div').appendChild(document.createElement('br'));
			p1Button.addEventListener('click', function()
			{ 
				if(document.getElementById('firstname').value!="")
				{
					this.style.background+='#00FF00';
					CLIENT.connect(document.getElementById('firstname').value);
					main = new Main();
					//ajaxGet("http://54.77.161.217:8000/getUsers");
					sound.playSong(sound.songNumbers["menu"]);
					//sound.playSong(sound.songNumbers["enemy"]);
					elem = document.getElementById('label');
					elem.innerHTML = "Your Name: " + document.getElementById('firstname').value+".";
					setCookie("name",CLIENT.me,365);
					elem.parentNode.removeChild(document.getElementById('firstname'));
					elem.parentNode.removeChild(document.getElementById('button'));
					//document.getElementById('button').value="sags";
				}
			}, false);
			document.getElementById('div').appendChild(p1Button);
		}
		return false;
	}
	// your top code
	currentimage = images.imagesToLoad[images.currentIndex][0];
	currentimage.onload = function(e)
	{
		images.currentIndex+=1;
		images.loadImages();
	}
	currentimage.src=images.imagesToLoad[images.currentIndex][1];
}