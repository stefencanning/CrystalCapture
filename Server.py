from tornado import websocket, web, ioloop, httpserver
import tornado
import ast #to convert unicode type to dict type
from Session import Session
import json
import random
#from pymongo import Connection

#connection = Connection('localhost',27017)
#db = connection['panelpass']
#winlist = db['users']

#list of WebSocket playerConnections
playerConnections={}
playerSession={}
playerSocket={}
playerName={}
session = list()
#session.append(Session())

class WSHandler(tornado.websocket.WebSocketHandler):
	def check_origin(self, origin):
		return True
		
	def open(self):
		print ("WebSocket opened")
		print ("from %s" %self.request.remote_ip)
		  
	def on_message(self, message):
		messageHandler.handleIncomingMsg(message,self)
		
 
	def on_close(self):
	    print ("WebSocket closed")

class MessageHandler:
	def __init__(self):
		pass

	def handleIncomingMsg(self, data, socket):
		try:
			
			#converts the unicode data that arrives into a dict
			data = ast.literal_eval(data)
			if(data['type']!="updatePlayer"):
				print ('message received %s' %data)
			#	a=0
			#else:
			
			type = data['type']

		except :
			print ('error data: %s' %data)
			print ("Unexpected error:" +  sys.exc_info()[0])
			type = 'error'
			print('except')
					

		if type == "connect":
			self.addToConnectionList(socket, data)
		elif type == "join":
			self.addToGame(data['uniqueID'],data['hostID'])
		elif type == "startGame":
			started = playerSession[data['uniqueID']].startGame(data['uniqueID'])
			if(started):
				for player in playerSession[data['uniqueID']].players:
					self.sendMessage(player,"gameStarted",0)
		elif type == "updateState":
			self.updateState(data)
		elif type == "grabFlag":
			self.grabFlag(data['uniqueID'],data['team'])
		elif type == "captureFlag":
			self.captureFlag(data['uniqueID'],data['team'])
		elif type == "replay":
			for games in session:
				for item in games.player:
					if(item == data['uniqueID']):
						session.remove(games)
			self.addToGame(data)
		elif type == "won":
			self.addWin(data['uniqueID'])
		elif type == "getGames":
			self.getWaitingGames(data['uniqueID'])
		elif type == "createGame":
			self.createGame(data['uniqueID'])
		elif type == "updatePlayer":
			self.updatePlayerData(data)
		elif type == "createDoor":
			self.createDoor(data)
		elif type == "bulletFired":
			self.fireBullet(data)
		elif type == "playerDied":
			self.playerDied(data)
		elif type == "flagReturned":
			self.flagReturned(data)
		else:
			msg = 'Error reading game request. Please make sure message type is either join, updateState, or...'
			message={'type':'error', "data":msg}
			print ('Error reading game request.')

			
			
			
			
			
	def createDoor(self,data):
		roomData = playerSession[data['uniqueID']].createDoor(data)
		if(roomData['success']):
			for player in playerSession[data['uniqueID']].players:
				self.sendMessage(player,"doorCreated",roomData)
			
	def fireBullet(self,data):
		for player in playerSession[data['uniqueID']].players:
			self.sendMessage(player,"bulletFired",data['data'])
			
	def flagReturned(self,data):
		for player in playerSession[data['uniqueID']].players:
			self.sendMessage(player,"flagReturned",data)
		
	def playerDied(self,data):
		success = playerSession[data['uniqueID']].playerDied(data['uniqueID'],data['team'])
		if(success):
			for player in playerSession[data['uniqueID']].players:
				self.sendMessage(player,"flagDropped",data)
				
	def updatePlayerData(self,data):
		for player in playerSession[data['uniqueID']].players:
			self.sendMessage(player,data['type'],{"name":playerName[data['uniqueID']],"uniqueID":data['uniqueID'],"update":data['update']})

	def grabFlag(self,uniqueID,team):
		success = playerSession[uniqueID].grabFlag(uniqueID,team)
		print(success)
		if(success):
			for player in playerSession[uniqueID].players:
				self.sendMessage(player,"flagGrabbed",{"uniqueID":uniqueID,"team":playerSession[uniqueID].playerTeam[uniqueID]})
		
	def captureFlag(self,uniqueID,team):
		success = playerSession[uniqueID].captureFlag(uniqueID,team)
		print(success)
		if(success):
			for player in playerSession[uniqueID].players:
				self.sendMessage(player,"flagCaptured",{"uniqueID":uniqueID,"team":playerSession[uniqueID].playerTeam[uniqueID]})
				
	def getWaitingGames(self,uniqueID):
		sessionList = list()
		print(len(session))
		for game in session:
			print(game.gameState)
			print(game.hostID)
			print(game.getNumPlayers())
			if(game.gameState == Session.WAITING_FOR_PLAYERS):
				sessionList.append({"hostID":game.hostID,"hostName":playerName[game.hostID],"count":game.getNumPlayers()})
				print(game.hostID)
		self.sendMessage(uniqueID,"gameList",sessionList)
	
	def addToConnectionList(self, socket, message):
		socket.id = message['uniqueID']
		playerName[message['uniqueID']]=message['pid']
		playerConnections[socket.id]=socket
		print(str(socket.id) + " joined")
		print(str(socket) + " joined")

	def findWins(self, uniqueID):
		#try:
			#return winlist.find_one({"username":pid})["wins"]
		#except:
			#winlist.insert({'username': pid, 'wins' : 0})
		return 0
  
	def addWin(self, uniqueID):
		return 0
		#winlist.update({'username' : pid}, {'username' : pid,'wins' : (self.findWins(pid) + 1)})
	
	def createGame(self,uniqueID):
		s = Session()
		session.append(s)
		#= session[len(session)-1]
		success = s.addPlayer(uniqueID)
		print(success)
		if(success):
			self.sendMessage(uniqueID,"joinedGame",uniqueID)
			playerSession[uniqueID] = s
			self.joinedGame(uniqueID)
			self.getGamePlayers(uniqueID)
		
	def addToGame(self,uniqueID,gameHostId):
		s = playerSession[gameHostId]
		success = s.addPlayer(uniqueID)
		if(success):
			self.sendMessage(uniqueID,"joinedGame",gameHostId)
			playerSession[uniqueID] = s
			self.joinedGame(uniqueID)
			self.getGamePlayers(uniqueID)
	
	def getGamePlayers(self, uniqueID):
		playerList = list()
		for player in playerSession[uniqueID].players:
			playerList.append({"name":playerName[player],"uniqueID":player,"team":playerSession[uniqueID].playerTeam[player]})
			print(playerName[player])
			print(player)
			print(playerSession[uniqueID].playerTeam[player])
		self.sendMessage(uniqueID,"playerList",playerList)
	
	def updateState(self, data):
		return 0
	
	def joinedGame(self, uniqueID):
		for player in playerSession[uniqueID].players:
			self.sendMessage(player,"playerJoined",{"name":playerName[uniqueID],"uniqueID":uniqueID,"team":playerSession[uniqueID].playerTeam[uniqueID]})
	
	def sendMessage(self,uniqueID,type,data):
		try:
			msg=dict()
			msg["type"]=type;
			msg["uniqueID"]=uniqueID;
			msg["data"]=data;
			msg=json.dumps(msg)
			playerConnections[uniqueID].write_message(msg)
		except:
			print("Player " + str(uniqueID) + " isn't connected")
	
	def sendToAll(self, message):
		try:
			for item in session.player:
				msg=dict()
				msg["type"]="message";
				msg["data"]="it works!";
				msg=json.dumps(msg)
				playerConnections[item].write_message(msg)
		except:
			print("error")
#needs to be after the class def
messageHandler = MessageHandler();
 

app= tornado.web.Application([
	#map the handler to the URI named "wstest"
	(r'/wstest', WSHandler),
])
 
if __name__ == '__main__':
	app.listen(8080)
	tornado.ioloop.IOLoop.instance().start()