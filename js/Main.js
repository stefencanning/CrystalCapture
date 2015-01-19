var game, menu, ctx, matchmaking, player, charCust;
var GAMESELECT=0,INGAME=1,MENU=2,CHARCUST=3;
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
	main.playerTeam="";
	main.playerGender=0;
	main.playerBodyType=0;
	main.playerColour=0;
	main.playerHair=0;
	main.playerClothes=0;
	main.playerShowHair=1;
	main.playerBeard=0;
	main.playerShowBeard=1;
	main.playerGun=0;
	main.gunDamage=[20,12,40];
	main.gunReload=[500,500,750];
	main.gunSpeed=[3,3,6];
	main.playerMaxHealth=100;
	main.playerHealthScaling=1;
	main.playerSpeed=1;
	main.playerSpeedScaling=1;
	main.animation=[0,1,2,1];
	main.frame = 0;
	main.frameTime=0;
	charCust= new CharCust();
	charCust.Initialise();
	main.mode=CHARCUST;
	//game= new Game();	
	/*main.mode = MENU;
	menu = new Menu();
	menu.Initialise();*/
	//matchmaking= new Matchmaking();	
	//matchmaking.Initialise();
	main.initCanvas();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	
	
	//img = [new Image(),new Image()];
	//img[0].src = 'img/dancer1.png';
	//img[1].src = 'img/dancer2.png';
	//game.Initialise();
	main.mainLoop();
}


Main.prototype.initCanvas = function()
{
	canvas = document.createElement('canvas'); 
	canvas.onContextMenu="return false";
	ctx = canvas.getContext('2d');	
	document.body.appendChild(canvas);
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
}