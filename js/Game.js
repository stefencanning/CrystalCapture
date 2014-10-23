var ctx, time;

function Game ()
{
	//Set a blank map of booleans
	this.gridMap = [[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false]];
	//Set up two blank players
	//this.player = [new Player(0, 0, false), new Player(6, 6, true)];
	this.activePlayer = 0;
	this.turn = true;
	// 0 -> waiting, 1 -> playing, 2 -> Lost
	this.gameState = 0;
	//0 -> Panel Pass, 1 -> Puzzle Tag
	this.gameType = 0;
	//0 = Horizontal, 1 = Vertical
	this.enemyDirection = 0;
	//Boolean defining if player is chaser or runner
	this.chaser = true;
	this.lastMoved=[,];
	this.waitingImage = 0;
	this.timeToWait=0;
	this.over = "";
}

Game.prototype.SetUp=function(val, gametype, mapNum)
{
	game.over = "";
	game.gridMap = [[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false],
					[false, false, false, false, false, false, false]];
	game.gameType = gametype
	if(gametype == 0)
	{
		if(mapNum == 0)
			game.Map1();
		if(mapNum == 1)
			game.Map2();
		if(mapNum == 2)
			game.Map3();
		if(val)
		{
			if(mapNum == 2)
			{
				game.player = [new Player(1, 1, false), new Player(5, 5, true)];
			}
			else
			{
				game.player = [new Player(0, 0, false), new Player(6, 6, true)];
			}
			game.turn = true;
			game.chaser = true;
		}
		else
		{
			if(mapNum == 2)
			{
				game.player = [new Player(5, 5, false), new Player(1, 1, true)];
			}
			else
			{
				game.player = [new Player(6, 6, false), new Player(0, 0, true)];
			}
			game.turn = false;
			game.chaser = false;
		}
		game.target = [3,3];	
	}
	else if(gametype == 1)
	{
		time = new Date().getTime() / 1000;
		if(val)
		{
			game.player = [new Player(0, 0, false), new Player(600, 600, true)];
			game.player[1].targetX = 3;
			game.player[1].targetY = 3;
			game.turn = true;
			game.chaser = true;
		}
		else
		{
			game.player = [new Player(600, 600, false), new Player(0, 0, true)];
			game.player[0].targetX = 600;
			game.player[0].targetY = 600;
			game.turn = true;
			game.chaser = false;
		}
		game.Map4()
	}
		//this.Map1();
		//this.target = [3,3];
		game.gameState = 1;
}

Game.prototype.Initialise=function ()
{//Starts up the game
	/*
	if(this.player[0].getReady() == true && this.player[1].getReady() == true)
	{
		this.Map1();
		this.target = [3,3];
		
		
	}*/
	
}

Game.prototype.movePlatform=function(lastX,lastY,currentX,currentY)
{
	this.gridMap[lastX][lastY] = false;
	this.gridMap[currentX][currentY] = true;
}

Game.prototype.initCanvas=function ()
{ 

	canvas = document.createElement('canvas'); 
	ctx = canvas.getContext('2d');	
	document.body.appendChild(canvas);
	//set canvas to size of the screen.
	canvas.width = 900; 
	canvas.height = 800;
	canvas.ondragstart = function() { return false };
	canvas.addEventListener("keydown", onKeyPress, true);
	canvas.addEventListener("mousedown", onMouseClick,true);
	document.body.addEventListener('touchmove', function (ev) { ev.preventDefault();});
	document.body.addEventListener('ondblclick', function (ev) { ev.preventDefault();});
	canvas.setAttribute('tabindex','0'); 
	canvas.focus();
}

Game.prototype.gameLoop = function () 
{
	if(game.gameState == 1)
	{
		if(game.over == "won" && !game.player[0].move)
		{
			game.waitingImage = 0;
			game.gameState = 2;
			CLIENT.updateWin();
			CLIENT.addFindButton();
		}
		if(game.over == "lost" && !game.player[0].move)
		{
			game.waitingImage = 0;
			game.gameState = 3;
			CLIENT.addFindButton();
		}
		if(game.gameType == 0)
		{
			if(game.player[0].getX() == game.target[0] && game.player[0].getY() == game.target[1])
			{
				game.over = "won"
			}
			else if(game.player[1].getX() == game.target[0] && game.player[1].getY() == game.target[1])
			{
				game.over = "lost"
			}
		}
		else if(game.gameType == 1)
		{
			game.player[0].update();
			var now = new Date().getTime() / 1000
			if( now-time >120)
			{
				if(game.chaser == true)
				{
					game.over = "lost"
				}
				else
				{
					game.over = "won"
				}
			}
			if((game.player[0].targetX/200) == game.player[1].targetX && (game.player[0].targetY/200) == game.player[1].targetY)
			{
				if(game.chaser == true)
				{
					game.over = "won"
				}
				else
				{
					game.over = "lost"
				}
			}
		}
	}
	game.Draw();
	window.requestAnimFrame(game.gameLoop);
}

function onMouseClick(e)
{
	if(e.pageX > 740 + 33 + this.offsetLeft&& e.pageX < 740 + 33+34+ this.offsetLeft && e.pageY > 150+ this.offsetTop && e.pageY < 150 + 34 + this.offsetTop)
	{
		game.UpMovement();
	}
	if(e.pageX > 740 + 33+ this.offsetLeft && e.pageX < 740 + 33+34 + this.offsetLeft&& e.pageY > 150 + 66 + this.offsetTop && e.pageY < 150 + 66 + 34 + this.offsetTop)
	{
		game.DownMovement();
	}
	if(e.pageX > 740 + this.offsetLeft&& e.pageX < 740 + 34 + this.offsetLeft&& e.pageY > 150 + 33 + this.offsetTop && e.pageY < 150 + 33 + 34 + this.offsetTop)
	{
		game.LeftMovement();
	}
	if(e.pageX > 740 + 66 + this.offsetLeft && e.pageX < 740 + 66 + 34 + this.offsetLeft&& e.pageY > 150 + 33 + this.offsetTop && e.pageY < 150 + 33 + 34 + this.offsetTop)
	{
		game.RightMovement();
	}
}

function onKeyPress(e)
{
	//W
	if (e.keyCode == 87) 
	{
		game.UpMovement();
	}
	//S
	if(e.keyCode == 83) 
	{
		game.DownMovement();
	}
	//A
	if (e.keyCode == 65) 
	{
		game.LeftMovement();
	}
	//D
	if (e.keyCode == 68)
	{
		game.RightMovement();
	}
}
Game.prototype.UpMovement = function()
{
	if(game.gameState == 1)
	{
		if(game.turn)
		{
			if(game.gameType == 0)
			{
				if(game.player[0].getX() == game.player[1].getX() && game.player[0].getY() - 1 == game.player[1].getY())
				{			
				}
				else if(game.player[0].getY() != 0)
				{
					if(game.gridMap[game.player[0].getX()][game.player[0].getY() - 1] == true)
					{
						game.player[0].setPos(game.player[0].getX(), game.player[0].getY() - 1);
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:0}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
					else
					{
						if(game.MovePanelUp(game.player[0].getX(), game.player[0].getY()))
						{
							game.turn = false;
							var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:1,lastX:game.lastMoved[0],lastY:game.lastMoved[1]}};
							var message = JSON.stringify(messageObject);
							CLIENT.ws.send(message);
						}
					}
				}
			}
			else if(game.gameType == 1)
			{
				if(!game.player[0].move)
				{
					if(game.player[0].getY()/100 - 1 > 0)
					{
						game.player[0].setVel(0, -1);
						game.player[0].setEnd(game.player[0].getX(), game.player[0].getY() - 200);
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:(game.player[0].targetX/200),y:(game.player[0].targetY/200),direction:game.player[0].dir}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
				}
			}
		}
	}
}

Game.prototype.DownMovement = function()
{
	if(game.gameState == 1)
	{
		if(game.turn)
		{
			if(game.gameType == 0)
			{
				if(game.player[0].getX() == game.player[1].getX() && game.player[0].getY() + 1 == game.player[1].getY())
				{		
				}
				else if(game.player[0].getY() != 6)
				{
					if(game.gridMap[game.player[0].getX()][game.player[0].getY() + 1] == true)
					{
						game.player[0].setPos(game.player[0].getX(), game.player[0].getY() + 1);
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:0}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
					else
					{
						if(game.MovePanelDown(game.player[0].getX(), game.player[0].getY()))
						{
							game.turn = false;
							var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:1,lastX:game.lastMoved[0],lastY:game.lastMoved[1]}};
							var message = JSON.stringify(messageObject);
							CLIENT.ws.send(message);
						}
					}
				}
			}
			else if(game.gameType == 1)
			{
				if(game.player[0].getY()/100 + 1 < 7)
				{
					if(!game.player[0].move)
					{
						game.player[0].setVel(0, 1);
						game.player[0].setEnd(game.player[0].getX(), game.player[0].getY() + 200);
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:(game.player[0].targetX/200),y:(game.player[0].targetY/200),direction:game.player[0].dir}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
				}
			}
		}
	}
}

Game.prototype.LeftMovement = function()
{
	if(game.gameState == 1)
	{
		if(game.turn)
		{
			if(game.gameType == 0)
			{
				if(game.player[0].getX() -1 == game.player[1].getX() && game.player[0].getY() == game.player[1].getY())
				{	
				}
				else if(game.player[0].getX() != 0)
				{
					if(game.gridMap[game.player[0].getX() - 1][game.player[0].getY()] == true)
					{
						game.player[0].setPos(game.player[0].getX() - 1, game.player[0].getY());
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:0}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
					else
					{
						if(game.MovePanelLeft(game.player[0].getX(), game.player[0].getY()))
						{
							game.turn = false;
							var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:1,lastX:game.lastMoved[0],lastY:game.lastMoved[1]}};
							var message = JSON.stringify(messageObject);
							CLIENT.ws.send(message);
						}
					}
				}
			}
			else if(game.gameType == 1)
			{
				if(game.player[0].getX()/100 - 1 > 0)
				{
					if(!game.player[0].move)
					{
						game.player[0].setVel(-1, 0);
						game.player[0].setEnd(game.player[0].getX() - 200, game.player[0].getY());
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:(game.player[0].targetX/200),y:(game.player[0].targetY/200),direction:game.player[0].dir}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
				}
			}
		}
	}
}

Game.prototype.RightMovement = function()
{
	if(game.gameState == 1)
	{
		if(game.turn)
		{
			if(game.gameType == 0)
			{
				if(game.player[0].getX() + 1 == game.player[1].getX() && game.player[0].getY() == game.player[1].getY())
				{
				}
				else if(game.player[0].getX() != 6)
				{
					if(game.gridMap[game.player[0].getX() + 1][game.player[0].getY()] == true)
					{
						game.player[0].setPos(game.player[0].getX() + 1, game.player[0].getY());
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:0}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
					else
					{
						if(game.MovePanelRight(game.player[0].getX(), game.player[0].getY()))
						{
							game.turn = false;
							var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:game.player[0].getX(),y:game.player[0].getY(),moved:1,lastX:game.lastMoved[0],lastY:game.lastMoved[1]}};
							var message = JSON.stringify(messageObject);
							CLIENT.ws.send(message);
						}
					}
				}
			}
			else if(game.gameType == 1)
			{
				if(game.player[0].getX()/100 + 1 < 7)
				{
					if(!game.player[0].move)
					{
						game.player[0].setVel(1, 0);
						game.player[0].setEnd(game.player[0].getX() + 200, game.player[0].getY());
						var messageObject = {"type":"updateState","pid":CLIENT.me,"data":{x:(game.player[0].targetX/200),y:(game.player[0].targetY/200),direction:game.player[0].dir}};
						var message = JSON.stringify(messageObject);
						CLIENT.ws.send(message);
					}
				}
			}
		}
	}
}

Game.prototype.Map1 = function()
{//Sets up the first map	
	this.gridMap[0][0] = true;
	this.gridMap[0][1] = true;
	this.gridMap[1][0] = true;
	
	this.gridMap[6][0] = true;
	this.gridMap[6][1] = true;
	this.gridMap[5][0] = true;
	
	this.gridMap[0][6] = true;
	this.gridMap[1][6] = true;
	this.gridMap[0][5] = true;
	
	this.gridMap[6][6] = true;
	this.gridMap[5][6] = true;
	this.gridMap[6][5] = true;
}

Game.prototype.Map2 = function()
{
	this.gridMap[0][0] = true;
	this.gridMap[2][0] = true;
	this.gridMap[4][0] = true;
	this.gridMap[6][0] = true;
	
	this.gridMap[0][2] = true;
	this.gridMap[6][2] = true;
	
	this.gridMap[0][4] = true;
	this.gridMap[6][4] = true;
	
	this.gridMap[0][6] = true;
	this.gridMap[2][6] = true;
	this.gridMap[4][6] = true;
	this.gridMap[6][6] = true;
}

Game.prototype.Map3 = function()
{
	this.gridMap[0][1] = true;
	this.gridMap[1][0] = true;
	this.gridMap[1][1] = true;
	
	this.gridMap[5][0] = true;
	this.gridMap[5][1] = true;
	this.gridMap[6][1] = true;
	
	this.gridMap[0][5] = true;
	this.gridMap[1][5] = true;
	this.gridMap[1][6] = true;
	
	this.gridMap[5][5] = true;
	this.gridMap[5][6] = true;
	this.gridMap[6][5] = true;
}
Game.prototype.Map4 = function()
{//Puzzle Tag Map
	this.gridMap[0][0] = true;
	this.gridMap[2][0] = true;
	this.gridMap[4][0] = true;
	this.gridMap[6][0] = true;
	
	this.gridMap[0][2] = true;
	this.gridMap[2][2] = true;
	this.gridMap[4][2] = true;
	this.gridMap[6][2] = true;
	
	this.gridMap[0][4] = true;
	this.gridMap[2][4] = true;
	this.gridMap[4][4] = true;
	this.gridMap[6][4] = true;
	
	this.gridMap[0][6] = true;
	this.gridMap[2][6] = true;
	this.gridMap[4][6] = true;
	this.gridMap[6][6] = true;
}
//Set of methods for moving panels in a direction. Panel will keep moving until it hits a wall or another panel.
Game.prototype.MovePanelRight = function(x, y)
{
	this.lastMoved = [x,y];
	if(x+1 < this.gridMap.length)
	{		
		if(this.gridMap[x+1][y] == false)
		{
			this.gridMap[x][y] = false;
			while(x < this.gridMap.length)
			{
				if(this.gridMap[x][y] == true)
				{
					this.gridMap[x-1][y] = true;
					this.player[0].setPos(x-1,y);							
					this.turn = false;
					return true;
				}
				if(x+1 == this.gridMap.length)
				{
					this.gridMap[x][y] = true;
					this.player[0].setPos(x,y);
					this.turn = false;
					return true;
				}
				x+=1;
			}
		}
	}
	return false;
	
}

Game.prototype.MovePanelLeft = function(x, y)
{
	this.lastMoved = [x,y];
	if(x-1 > -1)
	{		
		if(this.gridMap[x-1][y] == false)
		{
			this.gridMap[x][y] = false;
			while(x > -1)
			{
				if(this.gridMap[x][y] == true)
				{
					this.gridMap[x+1][y] = true;
					this.player[0].setPos(x+1,y);
					this.turn = false;
					return true;
				}
				if(x-1 < 0)
				{
					this.gridMap[x][y] = true;
					this.player[0].setPos(x,y);
					this.turn = false;
					return true;
				}
				x-=1;
			}
		}
	}
	return false;
	
}

Game.prototype.MovePanelDown = function(x, y)
{
	this.lastMoved = [x,y];
	if(y+1 < this.gridMap[x].length)
	{		
		if(this.gridMap[x][y+1] == false)
		{
			this.gridMap[x][y] = false;
			while(y < this.gridMap[x].length)
			{
				if(this.gridMap[x][y] == true)
				{
					this.gridMap[x][y-1] = true;
					this.player[0].setPos(x,y-1);
					this.turn = false;
					return true;
				}
				if(y+1 == this.gridMap[x].length)
				{
					this.gridMap[x][y] = true;
					this.player[0].setPos(x,y);
					this.turn = false;
					return true;
				}
				y+=1;
			}
		}		
	}	
	return false;	
}

Game.prototype.MovePanelUp = function(x, y)
{
	this.lastMoved = [x,y];
	if(y-1 > -1)
	{		
		if(this.gridMap[x][y-1] == false)
		{
			this.gridMap[x][y] = false;
			while(y > -1)
			{
				if(this.gridMap[x][y] == true)
				{
					this.gridMap[x][y+1] = true;
					this.player[0].setPos(x, y+1);
					this.turn = false;
					return true;
				}
				if(y-1 < 0)
				{
					this.gridMap[x][y] = true;
					this.player[0].setPos(x,y);
					this.turn = false;
					return true;
				}
				y-=1;
			}
		}		
	}
	return false;
	
}

Game.prototype.Draw = function()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	if(game.gameState == 0)
	{	
		game.timeToWait += 1;
		game.timeToWait %= 5;
		if(game.timeToWait == 0)
		{
			game.waitingImage +=1;
			game.waitingImage %= 8;
		}
		ctx.drawImage(dancerImg[game.waitingImage],40,40);
		ctx.fillStyle = rgb(0, 0, 0);
		ctx.font="20px Georgia";
		ctx.fillText("Waiting for opponent", 20, 20);
	}
	if(game.gameState == 1)
	{
		if(game.turn)
			ctx.drawImage(turnImg[0],740,40);
		else
			ctx.drawImage(turnImg[1],740,40);
		ctx.drawImage(gamepadImg,740,150);
		if(game.gameType == 0)
		{
			{
				for(x = 0; x < 2; x++)
					game.player[x].draw();
			}
			for(y = 0; y < game.gridMap.length;y++)
			{
				for(x = 0; x < game.gridMap[y].length; x++)
				{
					ctx.fillStyle=rgb(0,255,0);
					ctx.fillRect((x*100)+5,(y*100)+5,90,90);
					if(x == game.target[0] && y == game.target[1])
					{
						ctx.fillStyle=rgb(255,0,255);
						ctx.fillRect((x*100)+10,(y*100)+10,80,80);
					}
					if(game.gridMap[x][y] == true)
					{
						ctx.fillStyle=rgb(255,255,0);
						ctx.fillRect((x*100)+20,(y*100)+20,60,60);
					}			
				}
			}
			for(x = 0; x < 2; x++)
			{
				game.player[x].draw();
			}
		}
		else if(game.gameType == 1)
		{
			ctx.fillStyle = rgb(255, 0, 0);
			ctx.fillRect(40, 40, 20, 600);
			ctx.fillRect(240, 40, 20, 600);
			ctx.fillRect(440, 40, 20, 600);
			ctx.fillRect(640, 40, 20, 600);
			ctx.fillStyle = rgb(0, 0, 255);
			ctx.fillRect(40, 40, 600, 20);
			ctx.fillRect(40, 240, 600, 20);
			ctx.fillRect(40, 440, 600, 20);
			ctx.fillRect(40, 640, 600, 20);
			if(game.enemyDirection == 0)
			{
				ctx.fillStyle = rgb(255, 0, 0);
			}
			else if(game.enemyDirection == 1)
			{
				ctx.fillStyle = rgb(0, 0, 255);
			}
			for(y = 0; y < game.gridMap.length;y++)
			{
				for(x = 0; x < game.gridMap[y].length; x++)
				{
					if(game.gridMap[x][y] == true)
					{
						ctx.beginPath();
						ctx.arc((x*100)+50,(y*100)+50,40,25,0,2*Math.PI);
						ctx.lineWidth = 5;
						ctx.stroke();						
						ctx.fill();
					}
				}
			}
			game.player[0].tagDraw();
			//this.player[1].tagDraw();
		}
	}
	else if(game.gameState == 2)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.timeToWait += 1;
		game.timeToWait %= 10;
		if(game.timeToWait == 0)
		{
			game.waitingImage +=1;
			game.waitingImage %= 2;
		}
		ctx.drawImage(dancerCelebrateImg[game.waitingImage],40,40);
		ctx.fillStyle = rgb(0, 0, 0);
		ctx.font="20px Georgia";
		ctx.fillText("You Won!", 20, 20);
	}
	else if(game.gameState == 3)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.timeToWait += 1;
		game.timeToWait %= 10;
		if(game.timeToWait == 0)
		{
			game.waitingImage +=1;
			game.waitingImage %= 2;
		}
		ctx.drawImage(dancerCryingImg[game.waitingImage],40,40);
		ctx.fillStyle = rgb(0, 0, 0);
		ctx.font="20px Georgia";
		ctx.fillText("You Lost!", 20, 20);
	}
}
	