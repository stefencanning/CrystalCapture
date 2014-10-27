var main, CLIENT;

function Client()
{
	CLIENT = this;
	//var host='149.153.102.40';
	var host='192.168.0.18';
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
	else
	{
	console.log("type: "+ msg.type);
	console.log("data: "+ msg.data);
	}

}