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
			print ('message received %s' %data)
			
			#converts the unicode data that arrives into a dict
			data = ast.literal_eval(data)
			
			type = data['type']

		except :
			print ("Unexpected error:" +  sys.exc_info()[0])
			type = 'error'
			print('except')
					

		if type == "connect":
			self.addToConnectionList(socket, data)
		elif type == "join":
			#add to connection list
			self.addToGame(data)
		elif type == "updateState":
			self.updateState(data)
		elif type == "grabFlag":
			self.grabFlag(data['uniqueID'],data['team'])
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
		else:
			msg = 'Error reading game request. Please make sure message type is either join, updateState, or...'
			message={'type':'error', "data":msg}
			print ('Error reading game request.')
			
	def grabFlag(self,uniqueID,team):
		playerSession[uniqueID].grabFlag(uniqueID,team)
	
	def getWaitingGames(self,uniqueID):
		sessionList = list()
		for game in session:
			if(game.gameState == Session.WAITING_FOR_PLAYERS):
				sessionList.append({"hostID":game.hostID,"hostName":game.hostName,"count":game.getNumPlayers()})
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
		success = s.addPlayer(uniqueID)
		if(success):
			self.sendMessage(uniqueID,"joinedGame",uniqueID)
			playerSession[uniqueID] = s
			self.joinedGame(uniqueID)
		
	def addToGame(self,data):
		return 0
	
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
		except KeyError:
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