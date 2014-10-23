var main, CLIENT;

function Client()
{
	CLIENT = this;
	var host='149.153.102.6';
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
			CLIENT.join(document.getElementById('firstname').value) 
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


Client.prototype.connect = function(name)
{
	this.me = name;
	var messageObject = {"type":"connect","pid":name};
	var message = JSON.stringify(messageObject);
	this.ws.send(message);
}


Client.prototype.join = function(name)
{
	this.me = name;
	var messageObject = {"type":"join","pid":name};
	var message = JSON.stringify(messageObject);
	this.ws.send(message);
}

Client.prototype.newGame = function()
{
	var messageObject = {"type":"replay","pid":this.me};
	var message = JSON.stringify(messageObject);
	this.ws.send(message);
}
Client.prototype.updateWin = function()
{
	var messageObject = {"type":"won","pid":this.me};
	var message = JSON.stringify(messageObject);
	this.ws.send(message);
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
		if(msg.pid != this.me)
		{
			if(game.gameType == 0)
			{
				game.player[1].setPos(msg.data.x,msg.data.y);
				if(msg.data.moved == 1)
				{
					game.turn = true;
					game.movePlatform(msg.data.lastX,msg.data.lastY,msg.data.x,msg.data.y);
				}
			}
			else if(game.gameType == 1)
			{
				game.enemyDirection = msg.data.direction;
				game.player[1].targetX = msg.data.x;
				game.player[1].targetY = msg.data.y;
				game.player[1].setPos(msg.data.x,msg.data.y);
			}
		}
	}
	else
	{
	console.log("type: "+ msg.type);
	console.log("data: "+ msg.data);
	}

}