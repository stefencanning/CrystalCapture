//var redCaptureImg,blueCaptureImg,redStandingCrystal,blueStandingCrystal,redCrystalBase,blueCrystalBase,redGrabbedCrystal,blueGrabbedCrystal;
//var bodyType,gender,bodies;

function Images()
{
	
}

Images.prototype.Initialise = function()
{
	images.BodyImages();
	images.CrystalImages();
	
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
				images.bodies[i][j][k].src="img/"+strGen+strRace+strCol+".png";
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
	images.redStandingCrystal.src = 'img/redCrystal.png';
	images.blueStandingCrystal=new Image();
	images.blueStandingCrystal.src = 'img/blueCrystal.png';
	images.redCrystalBase=new Image();
	images.redCrystalBase.src = 'img/redCrystalBase.png';
	images.blueCrystalBase=new Image();
	images.blueCrystalBase.src = 'img/blueCrystalBase.png';
	images.redGrabbedCrystal=new Image();
	images.redGrabbedCrystal.src = 'img/redGrabbedCrystal.png';
	images.blueGrabbedCrystal=new Image();
	images.blueGrabbedCrystal.src = 'img/blueGrabbedCrystal.png';
	
	
	images.redCaptureImg[0].src = 'img/redCaptureBot.png';
	images.redCaptureImg[1].src = 'img/redCaptureMid.png';
	images.redCaptureImg[2].src = 'img/redCaptureTop.png';
	
	images.blueCaptureImg[0].src = 'img/blueCaptureBot.png';
	images.blueCaptureImg[1].src = 'img/blueCaptureMid.png';
	images.blueCaptureImg[2].src = 'img/blueCaptureTop.png';
}
