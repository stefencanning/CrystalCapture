var main, CLIENT,images;

function Client()
{
	CLIENT = this;
	//var host='149.153.102.40';
	//var host='192.168.0.18';
	var host='46.7.218.244';
	var port=8080;
	this.me;


	this.ws = new WebSocket("ws://" + host + ":" + port +'/wstest');
 
    this.ws.onmessage = function(evt) {CLIENT.handleMessage(evt); };
 
    this.ws.onclose = function(evt) { console.log("Connection close"); };
 
    this.ws.onopen = function(evt) { console.log('open connection'); };

	//changes made
    p1Button = document.getElementById('button');
    p1Button.addEventListener('click', function(){ 
		if(document.getElementById('firstname').value!="")
		{
			this.style.background+='#00FF00';
			CLIENT.connect(document.getElementById('firstname').value);
			main = new Main();
			elem = document.getElementById('label');
			elem.innerHTML = "Your Name: " + document.getElementById('firstname').value+".";
			elem.parentNode.removeChild(document.getElementById('firstname'));
			elem.parentNode.removeChild(document.getElementById('button'));
		}
	}, false);
	
	images = new Images();
	images.Initialise();
	/*
	addEventListener("click", function(e)
	{
		if(that.state == "playing")
		{
			var messageObject = {"type":"updateState","pid":that.me,"data":{x:e.clientX,y:e.clientY}};
			var message = JSON.stringify(messageObject);
			that.ws.send(message);
		}
	}, false);
	*/

}


Client.prototype.addFindButton = function()
{
	var element = document.createElement("input");
	element.type = "button";
    element.value = "new game";
    element.name = "replay";
    element.id = "replay"; 
    element.onclick = function()
	{ 
    	this.style.background+='#00FF00';
    	CLIENT.newGame();
		elem = document.getElementById('label');
		elem.innerHTML = "Your Name: " + CLIENT.me+".";
		elem.parentNode.removeChild(document.getElementById('replay'));
    };
    var foo = document.getElementById("label");
    foo.appendChild(element);
}


Client.prototype.SendMessage = function(message)
{
	try
	{
		this.ws.send(message);
	}
	catch(err)
	{
	}
}



Client.prototype.connect = function(name)
{
	this.me = name;
	this.uniqueID = name+Math.random().toString();
	var messageObject = {"type":"connect","pid":name,"uniqueID":this.uniqueID};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}


Client.prototype.createDoor = function(x,y,room)
{
	var messageObject = {"type":"createDoor","uniqueID":this.uniqueID,"room":room,"x":x,"y":y};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}


Client.prototype.join = function(hostID)
{
	var messageObject = {"type":"join","uniqueID":this.uniqueID,"hostID":hostID,
						"outfit":{"gender":main.playerGender,"body":main.playerBodyType,
								"colour":main.playerColour,"hairStyle":main.playerHair,
								"clothes":main.playerClothes,"hair":main.playerShowHair,
								"beardStyle":main.playerBeard,"beard":main.playerShowBeard}};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.grabFlag = function()
{
	var messageObject = {"type":"grabFlag","uniqueID":this.uniqueID,"team":main.playerTeam};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.captureFlag = function()
{
	var messageObject = {"type":"captureFlag","uniqueID":this.uniqueID,"team":main.playerTeam};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.newGame = function()
{
	var messageObject = {"type":"replay","uniqueID":this.uniqueID};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.updateWin = function()
{
	var messageObject = {"type":"won","uniqueID":this.uniqueID};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.getGames = function()
{
	var messageObject = {"type":"getGames","uniqueID":this.uniqueID};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.createGame = function()
{
	var messageObject = {"type":"createGame","uniqueID":this.uniqueID,
						"outfit":{"gender":main.playerGender,"body":main.playerBodyType,
								"colour":main.playerColour,"hairStyle":main.playerHair,
								"clothes":main.playerClothes,"hair":main.playerShowHair,
								"beardStyle":main.playerBeard,"beard":main.playerShowBeard}};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.startGame = function()
{
	var messageObject = {"type":"startGame","uniqueID":this.uniqueID};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.updatePlayer = function(data)
{
	var messageObject = {"type":"updatePlayer","uniqueID":this.uniqueID,"update":data};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.fireBullet = function(data)
{
	var messageObject = {"type":"bulletFired","uniqueID":this.uniqueID,"data":data};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.playerDied = function()
{
	var messageObject = {"type":"playerDied","uniqueID":this.uniqueID,"x":game.player.x,"y":game.player.y,"room":game.player.room,"team":main.playerTeam};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.flagReturned = function()
{
	var messageObject = {"type":"flagReturned","uniqueID":this.uniqueID,"team":main.playerTeam};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.handleMessage = function(evt)
{
	var msg = JSON.parse(evt.data);
	
	if(msg.type == "state")
	{
		game.gameState = 0;
		elem = document.getElementById('label');
		elem.innerHTML += " Wins: " + msg.data.wins;
	}
	else if(msg.type == "setUpGame")
	{
		game.SetUp(msg.data.first,msg.data.gameType,msg.data.map);
		elem = document.getElementById('label');
		elem.innerHTML += ". Your Opponent: " + msg.data.pid + ". Wins: " + msg.data.wins;
	}
	else if(msg.type == "updateState")
	{
	}
	else if(msg.type == "gameList")
	{
		matchmaking.gameList = [];
		for(var i = 0; i < msg.data.length;i++)
		{
			matchmaking.gameList[i] = msg.data[i];
		}
	}
	else if(msg.type == "joinedGame")
	{
		matchmaking.ingame=true;
		if(msg.data==this.uniqueID)
		{
			matchmaking.hosting = true;
		}
	}
	else if(msg.type == "playerJoined")
	{
		if(msg.data.uniqueID!=this.uniqueID)
		{
			if(msg.data.team == "red")
			{
				redTeam[redTeam.length] = msg.data.uniqueID;
				currentSession[msg.data.uniqueID] = msg.data.name
				playerGameData[msg.data.uniqueID]=0;
				playerOutfit[msg.data.uniqueID]=msg.data.outfit;
			}
			else if(msg.data.team == "blue")
			{
				blueTeam[blueTeam.length] = msg.data.uniqueID;
				currentSession[msg.data.uniqueID] = msg.data.name
				playerGameData[msg.data.uniqueID]=0;
				playerOutfit[msg.data.uniqueID]=msg.data.outfit;
			}
		}
	}
	else if(msg.type == "playerList")
	{
		for(var i = 0; i < msg.data.length;i++)
		{
			if(msg.data[i].team == "red")
			{
				if(msg.data[i].uniqueID == this.uniqueID)
				{
					main.playerTeam="red";
				}
				redTeam[redTeam.length] = msg.data[i].uniqueID;
				currentSession[msg.data[i].uniqueID] = msg.data[i].name
				playerGameData[msg.data[i].uniqueID]=0;
				playerOutfit[msg.data[i].uniqueID]=msg.data[i].outfit;
			}
			else if(msg.data[i].team == "blue")
			{
				if(msg.data[i].uniqueID == this.uniqueID)
				{
					main.playerTeam="blue";
				}
				blueTeam[blueTeam.length] = msg.data[i].uniqueID;
				currentSession[msg.data[i].uniqueID] = msg.data[i].name
				playerGameData[msg.data[i].uniqueID]=0;
				playerOutfit[msg.data[i].uniqueID]=msg.data[i].outfit;
			}
		}
	}
	else if(msg.type == "gameStarted")
	{
		if(main.mode==GAMESELECT)
		{
			game= new Game();
			game.Initialise();
			main.mode=INGAME;
		}
	}
	else if(msg.type == "updatePlayer")
	{
		if(msg.data.uniqueID!=this.uniqueID)
		{
			playerGameData[msg.data.uniqueID] = msg.data.update;
		}
	}
	else if(msg.type == "bulletFired")
	{
		var created = false;
		for(var i = 0; i < game.bullets.length&&!created;i++)
		{
			if(game.bullets[i]==null)
			{
				game.bullets[i]= new Bullet(msg.data.x,msg.data.y);
				game.bullets[i].team=msg.data.team;
				game.bullets[i].room=msg.data.room;
				game.bullets[i].xSpeed=msg.data.xSpeed;
				game.bullets[i].ySpeed=msg.data.ySpeed;
				game.bullets[i].poisonDamage=msg.data.poisonDamage;
				game.bullets[i].damage=msg.data.damage;
				created=true
			}
		}
		if(!created)
		{
			var num = game.bullets.length;
			game.bullets[num]= new Bullet(msg.data.x,msg.data.y);
			game.bullets[num].team=msg.data.team;
			game.bullets[num].room=msg.data.room;
			game.bullets[num].xSpeed=msg.data.xSpeed;
			game.bullets[num].ySpeed=msg.data.ySpeed;
			game.bullets[num].poisonDamage=msg.data.poisonDamage;
			game.bullets[num].damage=msg.data.damage;
		}
	}
	else if(msg.type == "flagDropped")
	{
		if(msg.data.uniqueID==this.uniqueID)
		{
			game.player.gotFlag = 0;
		}
		else
		{
			playerGameData[msg.data.uniqueID].flag=0;
		}
		if(msg.data.team == "red")
		{
			game.blueFlagCaptured = false;
			game.blueFlag.room=msg.data.room;
			game.blueFlag.x=msg.data.x;
			game.blueFlag.y=msg.data.y;
		}
		if(msg.data.team == "blue")
		{
			game.redFlagCaptured = false;
			game.redFlag.room=msg.data.room;
			game.redFlag.x=msg.data.x;
			game.redFlag.y=msg.data.y;
		}
	}
	else if(msg.type == "flagGrabbed")
	{
		if(msg.data.uniqueID==this.uniqueID)
		{
			game.player.gotFlag = 1;
		}
		if(msg.data.team == "red")
		{
			game.blueFlagCaptured = true;
		}
		if(msg.data.team == "blue")
		{
			game.redFlagCaptured = true;
		}
	}
	else if(msg.type == "flagCaptured")
	{
		game.player.gotFlag = 0;
		if(msg.data.team == "red")
		{
			game.redPoints+=1;
			game.blueFlagCaptured = false;
			game.redFlagCaptured = false;
			game.blueFlag.x=game.blueCapturePoint[0];
			game.blueFlag.y=game.blueCapturePoint[1];
			game.blueFlag.room=game.blueCapturePoint[2];
			game.redFlag.x=game.redCapturePoint[0];
			game.redFlag.y=game.redCapturePoint[1];
			game.redFlag.room=game.redCapturePoint[2];
		}
		if(msg.data.team == "blue")
		{
			game.bluePoints+=1;
			game.blueFlagCaptured = false;
			game.redFlagCaptured = false;
			game.blueFlag.x=game.blueCapturePoint[0];
			game.blueFlag.y=game.blueCapturePoint[1];
			game.blueFlag.room=game.blueCapturePoint[2];
			game.redFlag.x=game.redCapturePoint[0];
			game.redFlag.y=game.redCapturePoint[1];
			game.redFlag.room=game.redCapturePoint[2];
		}
	}
	else if(msg.type == "flagReturned")
	{
		/*if(msg.data.uniqueID==this.uniqueID)
		{
			game.player.gotFlag = 0;
		}*/
		if(msg.data.team == "red")
		{
			game.redFlag.x=game.redCapturePoint[0];
			game.redFlag.y=game.redCapturePoint[1];
			game.redFlag.room=game.redCapturePoint[2];
		}
		if(msg.data.team == "blue")
		{
			game.blueFlag.x=game.blueCapturePoint[0];
			game.blueFlag.y=game.blueCapturePoint[1];
			game.blueFlag.room=game.blueCapturePoint[2];
		}
	}
	else if(msg.type == "doorCreated")
	{
		if(msg.data.room2 < game.rooms.length)
		{
			for(var i = 0; i < game.rooms[msg.data.room1].walls.length; i++)
			{
				if(game.rooms[msg.data.room1].walls[i].x==msg.data.door1x*32
				&&game.rooms[msg.data.room1].walls[i].y==msg.data.door1y*32)
				{
					game.rooms[msg.data.room1].walls[i].door = "true";
					//doorMat = game.rooms[msg.data.room2].checkInside(msg.data.door2x*32,msg.data.door2y*32);
					game.rooms[msg.data.room1].walls[i].connectsTo = [msg.data.room2,msg.data.mat2X*32,msg.data.mat2Y*32];
				}
			}
			for(var i = 0; i < game.rooms[msg.data.room2].walls.length; i++)
			{
				if(game.rooms[msg.data.room2].walls[i].x==msg.data.door2x*32
				&&game.rooms[msg.data.room2].walls[i].y==msg.data.door2y*32)
				{
					game.rooms[msg.data.room2].walls[i].door = "true";
					//doorMat = game.rooms[msg.data.room1].checkInside(msg.data.door1x*32,msg.data.door1y*32);
					game.rooms[msg.data.room2].walls[i].connectsTo = [msg.data.room1,msg.data.mat1X*32,msg.data.mat1Y*32];
				}
			}
		}
		else
		{
			game.rooms[msg.data.room2] = new Room();
			game.rooms[msg.data.room2].oriColor = msg.data.color;
			game.rooms[msg.data.room2].oriColorValue = msg.data.colorValue;
			game.rooms[msg.data.room2].foundColor = msg.data.color;
			game.rooms[msg.data.room2].foundColorValue = msg.data.colorValue;
			for(var i = 0; i < msg.data.newRoom.length;i++)
			{
				var wall = new Wall(msg.data.newRoom[i][0]*32,msg.data.newRoom[i][1]*32,msg.data.newRoom[i][6]);
				if(msg.data.newRoom[i][0]==msg.data.door2x&&msg.data.newRoom[i][1]==msg.data.door2y)
				{
					wall.door="true";
					//doorMat = game.rooms[msg.data.room1].checkInside(msg.data.door1x*32,msg.data.door1y*32);
					wall.connectsTo = [msg.data.room1,msg.data.mat1X*32,msg.data.mat1Y*32];
				}
				game.rooms[msg.data.room2].addWall(wall);
			}
			for(var i = 0; i < game.rooms[msg.data.room1].walls.length; i++)
			{
				if(game.rooms[msg.data.room1].walls[i].x==msg.data.door1x*32
				&&game.rooms[msg.data.room1].walls[i].y==msg.data.door1y*32)
				{
					game.rooms[msg.data.room1].walls[i].door = "true";
					//doorMat = game.rooms[msg.data.room2].checkInside(msg.data.door2x*32,msg.data.door2y*32);
					game.rooms[msg.data.room1].walls[i].connectsTo = [msg.data.room2,msg.data.mat2X*32,msg.data.mat2Y*32];
				}
			}
		}
	}
	else
	{
	console.log("type: "+ msg.type);
	console.log("data: "+ msg.data);
	console.log("msg: "+ msg);
	}

}