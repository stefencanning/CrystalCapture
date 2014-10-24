var game,main, ctx, matchmaking;
var GAMESELECT=0,INGAME=1;

//var img;
function Main()
{
	main=this;
	main.mode = GAMESELECT;
	game= new Game();	
	matchmaking= new Matchmaking();	
	matchmaking.Initialise();
	main.initCanvas();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//img = [new Image(),new Image()];
	//img[0].src = 'img/dancer1.png';
	//img[1].src = 'img/dancer2.png';
	game.Initialise();
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
	document.body.addEventListener('touchmove', function (ev) { ev.preventDefault();});
	document.body.addEventListener('ondblclick', function (ev) { ev.preventDefault();});
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
	window.requestAnimFrame(main.mainLoop);
}



function onMouseClick(e)
{
	if(main.mode == GAMESELECT)
	{
		matchmaking.onMouseClick(e);
	}
	else if(main.mode == INGAME)
	{
		game.onMouseClick(e);
	}
}

function onContextMenu(e)
{
	if(main.mode == GAMESELECT)
	{
		matchmaking.onContextMenu(e);
	}
	else if(main.mode == INGAME)
	{
		game.onContextMenu(e);
	}
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
}