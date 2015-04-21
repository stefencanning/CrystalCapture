var main, CLIENT, images, sound;




function Client()
{
	
	console.log("creating client");
	CLIENT = this;
	console.log("assigned client");
	//var host='149.153.102.40';
	//var host='192.168.0.18';
	//var host='46.7.218.244';
	var host ='52.17.16.13';
	var port=8080;
	//this.me;
	
	CLIENT.connectToServer(host,port);

	
			
	
	
	
	/*
	var connection = new ActiveXObject("ADODB.Connection") ;

	var connectionstring="Data Source=<server>;User ID=azureuser;Password=<password>;Provider=SQLOLEDB";//Initial Catalog=<catalog>;

	connection.Open(connectionstring);
	var rs = new ActiveXObject("ADODB.Recordset");

	rs.Open("SELECT * FROM table", connection);
	rs.MoveFirst
	while(!rs.eof)
	{
	   document.write(rs.fields(1));
	   rs.movenext;
	}

	rs.close;
	connection.close;
	*/
	
	
	//changes made
	
	images = new Images();
	images.Initialise();
	
	sound = new Sound();
	sound.Initialise();
	sound.loadSounds();
	
	
	var textBox = document.getElementById('firstname');
	
	textBox.addEventListener("keypress", function(event) 
	{
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == 13)
		{
			if(document.getElementById('firstname').value!="")
			{
				if(images.Ready)
				{
					CLIENT.connect(document.getElementById('firstname').value);
					main = new Main();
					//ajaxGet("http://54.77.161.217:8000/getUsers");
					sound.playSong(sound.songNumbers["menu"]);
					//sound.playSong(sound.songNumbers["enemy"]);
					elem = document.getElementById('label');
					elem.innerHTML = "Your Name: " + document.getElementById('firstname').value+".";
					elem.parentNode.removeChild(document.getElementById('firstname'));
					elem.parentNode.removeChild(document.getElementById('button'));
					//document.getElementById('button').value="sags";
				}
				else
				{
					CLIENT.connect(document.getElementById('firstname').value);
					images.Ready=true;
					elem = document.getElementById('label');
					elem.innerHTML = "Your Name: " + document.getElementById('firstname').value+".";
					elem.parentNode.removeChild(document.getElementById('firstname'));
				}
			}
		}
	});
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
	(function()
	{
		var hidden = "hidden";

		// Standards:
		if (hidden in document)
			document.addEventListener("visibilitychange", onchange);
		else if ((hidden = "mozHidden") in document)
			document.addEventListener("mozvisibilitychange", onchange);
		else if ((hidden = "webkitHidden") in document)
			document.addEventListener("webkitvisibilitychange", onchange);
		else if ((hidden = "msHidden") in document)
			document.addEventListener("msvisibilitychange", onchange);
		// IE 9 and lower:
		if ("onfocusin" in document)
			document.onfocusin = document.onfocusout = onchange;
		// All others:
		window.onpageshow = window.onpagehide= window.onfocus = window.onblur = onchange;

		function onchange (evt)
		{
			var v = "visible", h = "hidden",
				evtMap = {
					focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
				};

			evt = evt || window.event;
			if (evt.type in evtMap)
				document.body.className = evtMap[evt.type];
			else
				document.body.className = this[hidden] ? "hidden" : "visible";
		}

		// set the initial state (but only if browser supports the Page Visibility API)
		if( document[hidden] !== undefined )
			onchange({type: document[hidden] ? "blur" : "focus"});
	})();
}
Client.prototype.connectToServer = function(host, port)
{
	console.log("connecting to server");
	CLIENT.ws = new WebSocket("ws://" + host + ":" + port +'/wstest');
 
    CLIENT.ws.onmessage = function(evt) {CLIENT.handleMessage(evt); };
 
    CLIENT.ws.onclose = function(evt) { console.log("Connection close"); CLIENT.connectToServer(host,port); };
 
    CLIENT.ws.onopen = function(evt) { console.log('open connection');};
}



function ajaxGet(theURL)
{
	$.ajax({url: theURL,
			success: function(data){console.log(data);}
			});	
}

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
	xmlHttp.onload = function()
	{
		if(this.status == 200 &&
		this.responseXML != null &&
		this.responseXML.getElementById('test').textContent)
		{
			console.log(this.responseXML);
			//processData(this.responseXML.getElementById('test').textContent);
		}
		else
		{
		}
	};
    xmlHttp.open( "GET", theUrl);
    xmlHttp.send();
    //return xmlHttp.responseText;
}

function httpPost(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    postForm(form,path);
}

function postForm(form,path) {
    var xmlhttp = null,
        data = '';

    for (var i = 0; i < form.elements.length; i++) {
        data += '&' + encodeURIComponent(form.elements[i].name) + '=' + encodeURIComponent(form.elements[i].value);
    }

    data = data.substr(1); //Get rid of the first character.

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystate = function() { alert(msg); }

    xmlhttp.open("POST",path,true);
    xmlhttp.send(data); //Send your data in the send method.
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
	this.id=Math.random();
	this.uniqueID = name+this.id.toString();
	var messageObject = {"type":"connect","pid":name,"uniqueID":this.uniqueID};
	var message = JSON.stringify(messageObject);
	//httpPost("http://54.77.161.217:8000/addUser",{"id":this.id*10000,"name":this.me},"post");
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
								"beardStyle":main.playerBeard,"beard":main.playerShowBeard,"playerHealthScaling":main.playerHealthScaling}};
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
								"beardStyle":main.playerBeard,"beard":main.playerShowBeard,"playerHealthScaling":main.playerHealthScaling}};
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

Client.prototype.calculateLocalDoors = function(x,y,room)
{
	var queue = new Queue();
	var set = {};
	var wallSet = {};
	var isWall = {};
	var walls = game.rooms[room].walls;
	for(var i = 0; i < walls.length; i++)
	{
		wallSet[[walls[i].x,walls[i].y]]=walls[i];
		isWall[[walls[i].x,walls[i].y]]=true;
	}
	queue.enqueue([x,y]);
	var returnValue = [];
	while(!queue.isEmpty())
	{
		var point = queue.dequeue();
		set[point]=true;
		var left=true,right=true,up=true,down=true;
		if(isWall[[point[0]-32,point[1]]])
		{
			left=false;
			if(wallSet[[point[0]-32,point[1]]].door=="true"&&!set[[point[0]-32,point[1]]])
			{
				set[[point[0]-32,point[1]]]=true;
				returnValue[returnValue.length] = wallSet[[point[0]-32,point[1]]];
			}
		}
		if(isWall[[point[0]+32,point[1]]])
		{
			right=false;
			if(wallSet[[point[0]+32,point[1]]].door=="true"&&!set[[point[0]+32,point[1]]])
			{
				set[[point[0]+32,point[1]]]=true;
				returnValue[returnValue.length] = wallSet[[point[0]+32,point[1]]];
			}
		}
		if(isWall[[point[0],point[1]-32]])
		{
			down=false;
			if(wallSet[[point[0],point[1]-32]].door=="true"&&!set[[point[0],point[1]-32]])
			{
				set[[point[0],point[1]-32]]=true;
				returnValue[returnValue.length] = wallSet[[point[0],point[1]-32]];
			}
		}
		if(isWall[[point[0],point[1]+32]])
		{
			up=false;
			if(wallSet[[point[0],point[1]+32]].door=="true"&&!set[[point[0],point[1]+32]])
			{
				set[[point[0],point[1]+32]]=true;
				returnValue[returnValue.length] = wallSet[[point[0],point[1]+32]];
			}
		}
		if(left&&!set[[point[0]-32,point[1]]])
		{
			queue.enqueue([point[0]-32,point[1]]);
		}
		if(right&&!set[[point[0]+32,point[1]]])
		{
			queue.enqueue([point[0]+32,point[1]]);
		}
		if(up&&!set[[point[0],point[1]+32]])
		{
			queue.enqueue([point[0],point[1]+32]);
		}
		if(down&&!set[[point[0],point[1]-32]])
		{
			queue.enqueue([point[0],point[1]-32]);
		}
		if(!game.rooms[room].floorSet[point])
		{
			game.rooms[room].floorSet[point]=true;
			game.rooms[room].floor[game.rooms[room].floor.length]=point;
		}
	}
	return returnValue;
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
		for(var i = 0; i < redTeam.length; i++)
		{
			currentSession[redTeam[i]] = 0;
			playerGameData[redTeam[i]]=0;
			playerOutfit[redTeam[i]]=0;
			redTeam[i] = 0;
		}
		for(var i = 0; i < blueTeam.length; i++)
		{
			currentSession[blueTeam[i]] = 0;
			playerGameData[blueTeam[i]]=0;
			playerOutfit[blueTeam[i]]=0;
			blueTeam[i] = 0;
		}
		
		currentSession=0;
		playerGameData=0;
		playerOutfit=0;
		redTeam = 0;
		blueTeam = 0;
		
		currentSession=[];
		redTeam = [];
		blueTeam = [];
		playerGameData = [];
		playerOutfit = [];
		
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
			game = new Game();
			game.Initialise();
			sound.stopSong(sound.songNumbers["menu"]);
			sound.playSong(sound.songNumbers["walking"]);
			main.mode=INGAME;
			sound.playVoice(sound.voiceNumbers["start"]);
		}
	}
	else if(msg.type == "gameOver")
	{
		if(main.mode==INGAME)
		{
			if(msg.data.team==main.playerTeam)
			{
				sound.playVoice(sound.voiceNumbers["victorious"]);
				game.state=game.VICTORY;
			}
			else
			{
				sound.playVoice(sound.voiceNumbers["defeated"]);
				game.state=game.DEFEAT;
			}
		}
	}
	else if(msg.type == "updatePlayer")
	{
		if(msg.data.uniqueID!=this.uniqueID)
		{
			if(playerGameData[msg.data.uniqueID].room!=-1&&msg.data.update.room==-1)
			{
				var len = game.gravePositions[playerGameData[msg.data.uniqueID].room].length;
				game.gravePositions[playerGameData[msg.data.uniqueID].room][len]=[playerGameData[msg.data.uniqueID].x,playerGameData[msg.data.uniqueID].y];
			}
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
		if(msg.data.room==game.player.room)
		{
			sound.playVoice(sound.voiceNumbers["gun"]);
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
			sound.playVoice(sound.voiceNumbers["bDropped"]);
			game.blueFlagCaptured = false;
			game.blueFlag.room=msg.data.room;
			game.blueFlag.x=msg.data.x;
			game.blueFlag.y=msg.data.y;
		}
		if(msg.data.team == "blue")
		{
			sound.playVoice(sound.voiceNumbers["yDropped"]);
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
			sound.playVoice(sound.voiceNumbers["bStolen"]);
			game.blueFlagCaptured = true;
		}
		if(msg.data.team == "blue")
		{
			sound.playVoice(sound.voiceNumbers["yStolen"]);
			game.redFlagCaptured = true;
		}
	}
	else if(msg.type == "flagCaptured")
	{
		game.player.gotFlag = 0;
		if(msg.data.team == "red")
		{
			sound.playVoice(sound.voiceNumbers["bCaptured"]);
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
			sound.playVoice(sound.voiceNumbers["yCaptured"]);
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
			sound.playVoice(sound.voiceNumbers["yReturned"]);
			game.redFlag.x=game.redCapturePoint[0];
			game.redFlag.y=game.redCapturePoint[1];
			game.redFlag.room=game.redCapturePoint[2];
		}
		if(msg.data.team == "blue")
		{
			sound.playVoice(sound.voiceNumbers["bReturned"]);
			game.blueFlag.x=game.blueCapturePoint[0];
			game.blueFlag.y=game.blueCapturePoint[1];
			game.blueFlag.room=game.blueCapturePoint[2];
		}
	}
	else if(msg.type == "doorCreated")
	{
		var door1,door2;
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
					door1=game.rooms[msg.data.room1].walls[i];
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
					door2=game.rooms[msg.data.room2].walls[i];
				}
			}
		}
		else
		{
			game.rooms[msg.data.room2] = new Room(msg.data.room2);
			game.rooms[msg.data.room2].oriColor = msg.data.color;
			game.rooms[msg.data.room2].oriColorValue = msg.data.colorValue;
			game.rooms[msg.data.room2].foundColor = msg.data.color;
			game.rooms[msg.data.room2].foundColorValue = msg.data.colorValue;
			game.gravePositions[msg.data.room2]=[];
			for(var i = 0; i < msg.data.newRoom.length;i++)
			{
				var wall = new Wall(msg.data.newRoom[i][0]*32,msg.data.newRoom[i][1]*32,msg.data.room2,msg.data.newRoom[i][6]);
				if(msg.data.newRoom[i][0]==msg.data.door2x&&msg.data.newRoom[i][1]==msg.data.door2y)
				{
					wall.door="true";
					//doorMat = game.rooms[msg.data.room1].checkInside(msg.data.door1x*32,msg.data.door1y*32);
					wall.connectsTo = [msg.data.room1,msg.data.mat1X*32,msg.data.mat1Y*32];
					door2=wall;
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
					door1=game.rooms[msg.data.room1].walls[i];
				}
			}
		}
		door1.pair=door2;
		door2.pair=door1;
		CLIENT.connectingDoors(msg.data.room1);
		CLIENT.connectingDoors(msg.data.room2);
		/*
		var doors1 = CLIENT.calculateLocalDoors(msg.data.mat2X*32,msg.data.mat2Y*32,msg.data.room2);
		var doors2 = CLIENT.calculateLocalDoors(msg.data.mat1X*32,msg.data.mat1Y*32,msg.data.room1);
		for(var i = 0; i < doors1.length; i++)
		{
			if(doors1[i]!=door1)
			{
				door1.connectedDoors[door1.connectedDoors.length]=doors1[i];
				door1.connectedDoorsSet[[doors1[i].x,doors1[i].y,doors1[i].room]]=true;
			}
			if(doors1[i]!=door2&&doors1[i]!=door1)
			{
				if(!doors1[i].pair.connectedDoorsSet[[door2.x,door2.y,door2.room]])
				{
					doors1[i].pair.connectedDoors[doors1[i].pair.connectedDoors.length]=door2;
					doors1[i].pair.connectedDoorsSet[[door2.x,door2.y,door2.room]]=true;
				}
			}
		}
		for(var i = 0; i < doors2.length; i++)
		{
			if(doors2[i]!=door2)
			{
				door2.connectedDoors[door2.connectedDoors.length]=doors2[i];
				door2.connectedDoorsSet[[doors2[i].x,doors2[i].y,doors2[i].room]]=true;
			}
			if(doors2[i]!=door1&&doors2[i]!=door2)
			{
				if(!doors2[i].pair.connectedDoorsSet[[door1.x,door1.y,door1.room]])
				{
					doors2[i].pair.connectedDoors[doors2[i].pair.connectedDoors.length]=door1;
					doors2[i].pair.connectedDoorsSet[[door1.x,door1.y,door1.room]]=true;
				}
			}
		}
		*/
	}
	else
	{
	console.log("type: "+ msg.type);
	console.log("data: "+ msg.data);
	console.log("msg: "+ msg);
	}

}

Client.prototype.connectingDoors = function(room)
{
	for(var wallNum =0; wallNum < game.rooms[room].walls.length; wallNum++)
	{
		if(game.rooms[room].walls[wallNum].door == "true")
		{
			var door = game.rooms[room].walls[wallNum];
			var pair = door.pair;
			var doors = CLIENT.calculateLocalDoors(pair.connectsTo[1],pair.connectsTo[2],pair.connectsTo[0]);
			for(var i = 0; i < doors.length; i++)
			{
				if(doors[i]!=pair)
				{
					if(!pair.connectedDoorsSet[[doors[i].x,doors[i].y,doors[i].room]])
					{
						pair.connectedDoors[pair.connectedDoors.length]=doors[i];
						pair.connectedDoorsSet[[doors[i].x,doors[i].y,doors[i].room]]=true;
					}
				}
			}
		}
	}
}