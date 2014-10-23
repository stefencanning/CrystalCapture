var game;
//var img;
function Main()
{
	game= new Game();	
	game.initCanvas();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//img = [new Image(),new Image()];
	//img[0].src = 'img/dancer1.png';
	//img[1].src = 'img/dancer2.png';
	game.Initialise();
	game.gameLoop();
}