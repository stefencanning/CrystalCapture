var game,tutorial, menu, ctx, matchmaking, player, charCust;//,images;
var GAMESELECT=0,INGAME=1,MENU=2,CHARCUST=3,TUTORIAL=4;
var currentSession=[];
var redTeam = [];
var blueTeam = [];
var playerGameData = [];
var playerOutfit = [];
var mousePos = [];
var BulletDirections={"left":0,"up":1,"right":2,"down":3};
var time=0;

//var img;
function Main()
{
	main=this;
	main.initCanvas();
	main.playerTeam="";
	
	//player look
	main.playerGender=0;
	main.playerBodyType=0;
	main.playerColour=0;
	main.playerHair=0;
	main.playerClothes=0;
	main.playerShowHair=1;
	main.playerBeard=0;
	main.playerShowBeard=1;
	
	//weapons
	main.guns=["pistol","shotgun","sniper"];
	main.gunReload=[500,750,1000];
	main.gunSpeed=[6*60,6*60,12*60];
	main.gunDamage=[20,6.5,30];
	
	//perks
	main.perks=["HP regen","flag sprint","poison bullet"];
	main.perkStrength=[3,1.5,10];
	
	//player stats
	main.playerGun=0;
	main.playerMaxHealth=100;
	main.playerHealthScaling=10;
	main.playerSpeed=60;
	main.playerSpeedScaling=10;
	main.playerPerk=0;
	
	
	main.animation=[0,1,2,1];
	main.frame = 0;
	main.frameTime=0;
	charCust= new CharCust();
	charCust.Initialise();
	matchmaking= new Matchmaking();
	matchmaking.Initialise();
	menu = new Menu();
	menu.Initialise();
	main.mode=CHARCUST;
	//images = new Images();
	//images.Initialise();
	//game= new Game();	
	/*main.mode = MENU;
	menu = new Menu();
	menu.Initialise();*/
	//matchmaking= new Matchmaking();	
	//matchmaking.Initialise();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	
	
	//img = [new Image(),new Image()];
	//img[0].src = 'img/dancer1.png';
	//img[1].src = 'img/dancer2.png';
	//game.Initialise();
	time = new Date();
	main.mainLoop();
}


Main.prototype.initCanvas = function()
{
	canvas = document.createElement('canvas'); 
	div = document.createElement('div');
	canvas.onContextMenu="return false";
	canvas.style.marginLeft = "auto";
	canvas.style.marginRight = "auto";
	div.style.textAlign="center";
	ctx = canvas.getContext('2d');	
	document.body.appendChild(div);
	div.appendChild(canvas);
	//document.body.appendChild(canvas);
	//set canvas to size of the screen.
	canvas.width = 960; 
	canvas.height = 540;
	canvas.ondragstart = function() { return false };
	canvas.addEventListener("keydown", onKeyPress, true);
	canvas.addEventListener("keyup", onKeyUp, true);
	/*canvas.addEventListener('contextmenu', function(e) {
            alert("You've tried to open context menu"); //here you draw your own menu
            e.preventDefault();
        }, false);*/
	canvas.addEventListener("contextmenu", onContextMenu, false);
	canvas.addEventListener("click", onMouseClick,true);
	canvas.addEventListener("dblclick", onDoubleClick,true);
	canvas.addEventListener("mousemove", onMouseMove,true);
	document.body.addEventListener('touchmove', function (ev) { ev.preventDefault();});
	//document.body.addEventListener('ondblclick', function (ev) { ev.preventDefault();});
	document.body.addEventListener('oncontextmenu', function (ev) { ev.preventDefault();});
	canvas.setAttribute('tabindex','0'); 
	canvas.focus()
}

Main.prototype.gameOver = function()
{
	if(game!=0)
	{
		game.dealloc();
		game = 0;
	}
	else if(tutorial!=0)
	{
		tutorial.dealloc();
		tutorial = 0;
	}
	sound.stopSong(sound.songNumbers["walking"]);
	sound.playSong(sound.songNumbers["menu"]);
	for(var i = 0; i < matchmaking.gameList.length; i++)
	{
		matchmaking.gameList[i]=0;
	}
	matchmaking.gameList = 0;
	matchmaking.gameList = [];
	matchmaking.hosting = false;
	matchmaking.ingame = false;
	main.mode=MENU;
}


Main.prototype.mainLoop = function ()
{
	var curTime=new Date();
	if(main.frameTime>1000/6)
	{
		main.frameTime=0;
		main.frame=(main.frame+1)%4;
	}
	
	if(main.mode == GAMESELECT)
	{
		matchmaking.Loop();
	}
	else if(main.mode == INGAME)
	{
		game.gameLoop();
	}
	else if(main.mode == MENU)
	{
		menu.Loop();
	}
	else if(main.mode == CHARCUST)
	{
		main.frameTime+=curTime-time;
		charCust.Loop();
	}
	else if(main.mode == TUTORIAL)
	{
		tutorial.gameLoop();
	}
	sound.update((curTime.getTime()-time.getTime())/1000);
	time = new Date();
	window.requestAnimFrame(main.mainLoop);
}


function onMouseMove(e)
{
	mousePos["x"]=e.pageX-canvas.offsetLeft;
	mousePos["y"]=e.pageY-canvas.offsetTop;
	if(main.mode == GAMESELECT)
	{
		matchmaking.onMouseMove(mousePos);
	}
	else if(main.mode == INGAME)
	{
		game.onMouseMove(mousePos);
	}
	else if(main.mode == MENU)
	{
		menu.onMouseMove(mousePos);
	}
	else if(main.mode == TUTORIAL)
	{
		tutorial.onMouseMove(mousePos);
	}
}

function onDoubleClick(e)
{
	var clickPos=[];
	clickPos["x"]=e.pageX-canvas.offsetLeft;
	clickPos["y"]=e.pageY-canvas.offsetTop;
	if(main.mode == GAMESELECT)
	{
		matchmaking.onDoubleClick(clickPos);
	}
	else if(main.mode == INGAME)
	{
		game.onDoubleClick(clickPos);
	}
	else if(main.mode == MENU)
	{
		menu.onDoubleClick(clickPos);
	}
	else if(main.mode == TUTORIAL)
	{
		tutorial.onDoubleClick(clickPos);
	}
}

function onMouseClick(e)
{
	var clickPos=[];
	clickPos["x"]=e.pageX-canvas.offsetLeft;
	clickPos["y"]=e.pageY-canvas.offsetTop;
	if(main.mode == GAMESELECT)
	{
		matchmaking.onMouseClick(clickPos);
	}
	else if(main.mode == INGAME)
	{
		game.onMouseClick(clickPos);
	}
	else if(main.mode == MENU)
	{
		menu.onMouseClick(clickPos);
	}
	else if(main.mode == CHARCUST)
	{
		charCust.onMouseClick(clickPos);
	}
	else if(main.mode == TUTORIAL)
	{
		tutorial.onMouseClick(clickPos);
	}
}

function onContextMenu(e)
{
	e.preventDefault();
	var clickPos=[];
	clickPos["x"]=e.pageX-canvas.offsetLeft;
	clickPos["y"]=e.pageY-canvas.offsetTop;
	if(main.mode == GAMESELECT)
	{
		matchmaking.onContextMenu(clickPos);
	}
	else if(main.mode == INGAME)
	{
		game.onContextMenu(clickPos);
	}
	else if(main.mode == MENU)
	{
		menu.onContextMenu(clickPos);
	}
	else if(main.mode == TUTORIAL)
	{
		tutorial.onContextMenu(clickPos);
	}
	return false;
}

function onKeyPress(e)
{
	if(main.mode == GAMESELECT)
	{
		matchmaking.onKeyPress(e);
	}
	else if(main.mode == INGAME)
	{
		game.onKeyPress(e);
	}
	else if(main.mode == MENU)
	{
		menu.onKeyPress(e);
	}
	else if(main.mode == TUTORIAL)
	{
		tutorial.onKeyPress(e);
	}
}
function onKeyUp(e)
{
	if(main.mode == GAMESELECT)
	{
		matchmaking.onKeyUp(e);
	}
	else if(main.mode == INGAME)
	{
		game.onKeyUp(e);
	}
	else if(main.mode == MENU)
	{
		menu.onKeyUp(e);
	}
	else if(main.mode == TUTORIAL)
	{
		tutorial.onKeyUp(e);
	}
}