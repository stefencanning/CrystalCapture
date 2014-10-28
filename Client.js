var main, CLIENT;

function Client()
{
	CLIENT = this;
	var host='149.153.102.40';
	//var host='192.168.0.18';
	var port=8080;
	this.me;


	this.ws = new WebSocket("ws://" + host + ":" + port +'/wstest');
 
    this.ws.onmessage = function(evt) {CLIENT.handleMessage(evt); };
 
    this.ws.onclose = function(evt) { console.log("Connection close"); };
 
    this.ws.onopen = function(evt) { console.log('open connection');  };

	//changes made
    p1Button = document.getElementById('button');
    p1Button.addEventListener('click', function(){ 
		if(document.getElementById('firstname').value!="")
		{
			this.style.background+='#00FF00';
			CLIENT.connect(document.getElementById('firstname').value) 
			main = new Main()
			elem = document.getElementById('label');
			elem.innerHTML = "Your Name: " + document.getElementById('firstname').value+"."
			elem.parentNode.removeChild(document.getElementById('firstname'));
			elem.parentNode.removeChild(document.getElementById('button'));
		}
	}, false);
	
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
    element.onclick = function() { 
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
	var messageObject = {"type":"join","uniqueID":this.uniqueID,"hostID":hostID};
	var message = JSON.stringify(messageObject);
	this.SendMessage(message);
}

Client.prototype.grabFlag = function()
{
	var messageObject = {"type":"grabFlag","uniqueID":this.uniqueID,"team":main.playerTeam};
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
	var messageObject = {"type":"createGame","uniqueID":this.uniqueID};
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
			}
			else if(msg.data.team == "blue")
			{
				blueTeam[blueTeam.length] = msg.data.uniqueID;
				currentSession[msg.data.uniqueID] = msg.data.name
				playerGameData[msg.data.uniqueID]=0;
			}
		}
	}
	else if(msg.type == "playerList")
	{
		for(var i = 0; i < msg.data.length;i++)
		{
			console.log("team: "+ msg.data[i].team);
			console.log("uniqueID: "+ msg.data[i].uniqueID);
			console.log("name: "+ msg.data[i].name);
			if(msg.data[i].team == "red")
			{
				if(msg.data[i].uniqueID == this.uniqueID)
				{
					main.playerTeam="red";
				}
				redTeam[redTeam.length] = msg.data[i].uniqueID;
				currentSession[msg.data[i].uniqueID] = msg.data[i].name
				playerGameData[msg.data[i].uniqueID]=0;
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
	else if(msg.type == "flagCapture")
	{
		console.log("type: "+ msg.type);
		console.log("data: "+ msg.data);
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
	else if(msg.type == "doorCreated")
	{
		game.rooms[msg.data.room2] = new Room();
		for(var i = 0; i < msg.data.newRoom.length;i++)
		{
			var wall = new Wall(msg.data.newRoom[i][0]*32,msg.data.newRoom[i][1]*32);
			if(msg.data.newRoom[i][0]==msg.data.door2x&&msg.data.newRoom[i][1]==msg.data.door2y)
			{
				wall.door="true";
				doorMat = game.rooms[msg.data.room1].checkInside(msg.data.door1x*32,msg.data.door1y*32);
				wall.connectsTo = [msg.data.room1,doorMat.x,doorMat.y];
			}
			game.rooms[msg.data.room2].addWall(wall);
		}
		for(var i = 0; i < game.rooms[msg.data.room1].walls.length; i++)
		{
			if(game.rooms[msg.data.room1].walls[i].x==msg.data.door1x*32
			&&game.rooms[msg.data.room1].walls[i].y==msg.data.door1y*32)
			{
				game.rooms[msg.data.room1].walls[i].door = "true";
				doorMat = game.rooms[msg.data.room2].checkInside(msg.data.door2x*32,msg.data.door2y*32);
				game.rooms[msg.data.room1].walls[i].connectsTo = [msg.data.room2,doorMat.x,doorMat.y];
			}
		}
	}
	else
	{
	console.log("type: "+ msg.type);
	console.log("data: "+ msg.data);
	}

}