var game, dancerImg, dancerCelebrateImg, dancerCryingImg, turnImg, gamepadImg;

function Main()
{
	game= new Game();	
	game.initCanvas();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	dancerImg = [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
	dancerCelebrateImg = [new Image(),new Image()];
	dancerCryingImg = [new Image(),new Image()];
	turnImg = [new Image(),new Image()];
	gamepadImg = new Image();
	dancerImg[0].src = 'img/dancer1.png';
	dancerImg[1].src = 'img/dancer2.png';
	dancerImg[2].src = 'img/dancer3.png';
	dancerImg[3].src = 'img/dancer4.png';
	dancerImg[4].src = 'img/dancer5.png';
	dancerImg[5].src = 'img/dancer4.png';
	dancerImg[6].src = 'img/dancer3.png';
	dancerImg[7].src = 'img/dancer2.png';
	dancerCelebrateImg[0].src = 'img/dancercel1.png';
	dancerCelebrateImg[1].src = 'img/dancercel2.png';
	dancerCryingImg[0].src = 'img/dancercry1.png';
	dancerCryingImg[1].src = 'img/dancercry2.png';
	turnImg[0].src = 'img/yourturn.png';
	turnImg[1].src = 'img/enemyturn.png';
	gamepadImg.src = 'img/gamepad.png';
	game.Initialise();
	game.gameLoop();
}