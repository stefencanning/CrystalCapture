//var redCaptureImg,blueCaptureImg,redStandingCrystal,blueStandingCrystal,redCrystalBase,blueCrystalBase,redGrabbedCrystal,blueGrabbedCrystal;
//var bodyType,gender,bodies;

function Images()
{
	
}

Images.prototype.Initialise = function()
{
	images.BodyImages();
	images.HairImages();
	images.ClothesImages();
	images.CrystalImages();
	images.BeardImages();
}

Images.prototype.BodyImages = function()
{
	images.bodies=[[],[]];
	images.bodies[0][0]=[new Image(),new Image(),new Image(),new Image(),new Image()];
	images.bodies[0][1]=[new Image(),new Image(),new Image(),new Image(),new Image()];
	images.bodies[1][0]=[new Image(),new Image(),new Image(),new Image(),new Image()];
	images.bodies[1][1]=[new Image(),new Image(),new Image(),new Image(),new Image()];
	strGen="$male - ";
	for(i=0;i<2;i++)
	{
		strRace="human - ";
		for(j=0;j<1;j++)
		{
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
				images.bodies[i][j][k].src="img/body/"+strGen+strRace+strCol+".png";
			}
			strRace="elf - "; 
		}
		strGen="$female - ";
	}
}

Images.prototype.CrystalImages = function()
{
	images.redCaptureImg = [new Image(),new Image(),new Image()];
	images.blueCaptureImg = [new Image(),new Image(),new Image()];
	images.redStandingCrystal=new Image();
	images.redStandingCrystal.src = 'img/crystal/redCrystal.png';
	images.blueStandingCrystal=new Image();
	images.blueStandingCrystal.src = 'img/crystal/blueCrystal.png';
	images.redCrystalBase=new Image();
	images.redCrystalBase.src = 'img/crystal/redCrystalBase.png';
	images.blueCrystalBase=new Image();
	images.blueCrystalBase.src = 'img/crystal/blueCrystalBase.png';
	images.redGrabbedCrystal=new Image();
	images.redGrabbedCrystal.src = 'img/crystal/redGrabbedCrystal.png';
	images.blueGrabbedCrystal=new Image();
	images.blueGrabbedCrystal.src = 'img/crystal/blueGrabbedCrystal.png';
	
	
	images.redCaptureImg[0].src = 'img/crystal/redCaptureBot.png';
	images.redCaptureImg[1].src = 'img/crystal/redCaptureMid.png';
	images.redCaptureImg[2].src = 'img/crystal/redCaptureTop.png';
	
	images.blueCaptureImg[0].src = 'img/crystal/blueCaptureBot.png';
	images.blueCaptureImg[1].src = 'img/crystal/blueCaptureMid.png';
	images.blueCaptureImg[2].src = 'img/crystal/blueCaptureTop.png';
}

Images.prototype.HairImages = function()
{
	images.hair=[[]];
	strGen="male ";
	for(i=0;i<2;i++)
	{
		images.hair[i]=[];
		for(k=0;k<20;k++)
		{
			images.hair[i][k]=new Image();
			images.hair[i][k].src="img/hair/$hair "+strGen+"("+(k+1)+").png";
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
		images.beard[k].src="img/beard/$beard ("+(k+1)+").png";
	}
}

Images.prototype.ClothesImages = function()
{
	images.clothes=[[]];
	strGen="male ";
	for(i=0;i<2;i++)
	{
		images.clothes[i]=[];
		for(k=0;k<20;k++)
		{
			images.clothes[i][k]=new Image();
			images.clothes[i][k].src="img/clothes/$clothes "+strGen+"("+(k+1)+").png";
		}
		strGen="female ";
	}
}