var game,menu, ctx, matchmaking,player;
var GAMESELECT=0,INGAME=1,MENU=2,CHARCUST=3;
var currentSession=[];
var redTeam = [];
var blueTeam = [];
var playerGameData = [];

//var img;
function Main()
{
	main=this;
	main.playerTeam="";
	main.mode = MENU;
	//game= new Game();	
	menu = new Menu();
	menu.Initialise();
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
	ctx = canvas.getContext('2d');	
	document.body.appendChild(canvas);
	//set canvas to size of the screen.
	canvas.width = 960; 
	canvas.height = 540;
	canvas.ondragstart = function() { return false };
	canvas.addEventListener("keydown", onKeyPress, true);
	canvas.addEventListener("keyup", onKeyUp, true);
	canvas.addEventListener("oncontextmenu", onContextMenu, true);
	canvas.addEventListener("mousedown", onMouseClick,true);
	canvas.addEventListener("ondblclick", onDoubleClick,true);
	document.body.addEventListener('touchmove', function (ev) { ev.preventDefault();});
	//document.body.addEventListener('ondblclick', function (ev) { ev.preventDefault();});
	document.body.addEventListener('oncontextmenu', function (ev) { ev.preventDefault();});
	canvas.setAttribute('tabindex','0'); 
	canvas.focus()
}


Main.prototype.mainLoop = function ()
{
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
	window.requestAnimFrame(main.mainLoop);
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
		matchmaking.onDoubleClick(clickPos);
	}
	else if(main.mode == INGAME)
	{
		game.onMouseClick(clickPos);
	}
	else if(main.mode == MENU)
	{
		menu.onMouseClick(clickPos);
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