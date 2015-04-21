from tornado import websocket, web, ioloop, httpserver
import sys
import os
import base64
import tornado
import ast #to convert unicode type to dict type
from Session import Session
import json
import random
import os.path
import os
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
		print ("from %s" %self.request.remote_ip)
		try:
			for uniqueid,socket in playerConnections.items():
				if socket == self:
					if uniqueid in playerSession.keys():
						s=playerSession[uniqueid]
						if s.gameState == Session.WAITING_FOR_PLAYERS:
							s.removePlayer(uniqueid)
							for player in s.players:
								messageHandler.getGamePlayers(player)
						else:
							success = playerSession[uniqueID].disconnectedPlayer(uniqueID)
							if(success['success']):
								for player in playerSession[uniqueID].players:
									messageHandler.sendMessage(player,"flagDropped",success)
		except:
			print("no session")


class MessageHandler:
	def __init__(self):
		pass

	def handleIncomingMsg(self, data, socket):
		try:
			
			#converts the unicode data that arrives into a dict
			data = ast.literal_eval(data)
			#if(data['type']!="updatePlayer"):
			#	print ('message received %s' %data)
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
			self.addToGame(data['uniqueID'],data['hostID'],data['outfit'])
		elif type == "leave":
			try:
				if data['uniqueID'] in playerSession.keys():
					s=playerSession[data['uniqueID']]
					if s.gameState == Session.WAITING_FOR_PLAYERS:
						s.removePlayer(data['uniqueID'])
						for player in s.players:
							messageHandler.getGamePlayers(player)
					else:
						success = playerSession[data['uniqueID']].disconnectedPlayer(data['uniqueID'])
						if(success['success']):
							for player in playerSession[data['uniqueID']].players:
								messageHandler.sendMessage(player,"flagDropped",success)
			except:
				print("session not found")
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
			self.createGame(data['uniqueID'],data['outfit'])
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
		elif type == "screenShot":
			string = data['data']
			gameHost = str(playerSession[data['uniqueID']].hostID)
			if os.path.isfile(gameHost+".txt"):
				th = open(gameHost+".txt",'a')
				th.write(string)
				th.write('\n')
				th.close()
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
		playerSession[data['uniqueID']].updatePlayer(data['uniqueID'],data['update'])
		for player in playerSession[data['uniqueID']].players:
			self.sendMessage(player,data['type'],{"name":playerName[data['uniqueID']],"uniqueID":data['uniqueID'],"update":data['update']})

	def grabFlag(self,uniqueID,team):
		success = playerSession[uniqueID].grabFlag(uniqueID,team)
		if(success):
			for player in playerSession[uniqueID].players:
				self.sendMessage(player,"flagGrabbed",{"uniqueID":uniqueID,"team":playerSession[uniqueID].playerTeam[uniqueID]})
		
	def captureFlag(self,uniqueID,team):
		success = playerSession[uniqueID].captureFlag(uniqueID,team)
		if(success):
			for player in playerSession[uniqueID].players:
				self.sendMessage(player,"flagCaptured",{"uniqueID":uniqueID,"team":playerSession[uniqueID].playerTeam[uniqueID]})
			if(playerSession[uniqueID].score[0]==3):
				for player in playerSession[uniqueID].players:
					self.sendMessage(player,"gameOver",{"team":"blue"})
				self.saveImages(uniqueID)
			if(playerSession[uniqueID].score[1]==3):
				for player in playerSession[uniqueID].players:
					self.sendMessage(player,"gameOver",{"team":"red"})
				self.saveImages(uniqueID)
	
	def saveImages(self,uniqueID):
		#b64file = open(str(playerSession[data['uniqueID']].hostID)+".txt", 'rb').read()
		gameHost = str(playerSession[uniqueID].hostID)
		file = open(gameHost+".txt", 'rb')
		imgNum=0
		for line in file:
			imgData = base64.b64decode(line)
			fname = "images/"+gameHost+str(imgNum)
			fext = '.png'
			imgFile = open(fname + fext, 'wb')
			imgFile.write(imgData)
			imgFile.close()
			imgNum+=1
		file.close()
		os.remove(gameHost+".txt")
				
	def getWaitingGames(self,uniqueID):
		sessionList = list()
		for game in session:
			if(game.gameState == Session.WAITING_FOR_PLAYERS):
				sessionList.append({"hostID":game.hostID,"hostName":playerName[game.hostID],"count":game.getNumPlayers()})
		self.sendMessage(uniqueID,"gameList",sessionList)
	
	def addToConnectionList(self, socket, message):
		socket.id = message['uniqueID']
		playerName[message['uniqueID']]=message['pid']
		playerConnections[socket.id]=socket

	def findWins(self, uniqueID):
		#try:
			#return winlist.find_one({"username":pid})["wins"]
		#except:
			#winlist.insert({'username': pid, 'wins' : 0})
		return 0
  
	def addWin(self, uniqueID):
		return 0
		#winlist.update({'username' : pid}, {'username' : pid,'wins' : (self.findWins(pid) + 1)})
	
	def createGame(self,uniqueID,outfit):
		s = Session()
		session.append(s)
		#= session[len(session)-1]
		success = s.addPlayer(uniqueID)
		if(success):
			s.playerOutfits[uniqueID]=outfit
			self.sendMessage(uniqueID,"joinedGame",uniqueID)
			playerSession[uniqueID] = s
			th = open(str(playerSession[uniqueID].hostID)+".txt",'w')
			th.write("")
			th.close()
			self.joinedGame(uniqueID)
			self.getGamePlayers(uniqueID)
		
	def addToGame(self,uniqueID,gameHostId,outfit):
		s = playerSession[gameHostId]
		success = s.addPlayer(uniqueID)
		if(success):
			s.playerOutfits[uniqueID]=outfit
			self.sendMessage(uniqueID,"joinedGame",gameHostId)
			playerSession[uniqueID] = s
			#self.joinedGame(uniqueID)
			for player in playerSession[uniqueID].players:
				self.getGamePlayers(player)
	
	def getGamePlayers(self, uniqueID):
		playerList = list()
		for player in playerSession[uniqueID].players:
			playerList.append({"name":playerName[player],"uniqueID":player,"team":playerSession[uniqueID].playerTeam[player],"outfit":playerSession[uniqueID].playerOutfits[player]})
		self.sendMessage(uniqueID,"playerList",playerList)
	
	def updateState(self, data):
		return 0
	
	def joinedGame(self, uniqueID):
		for player in playerSession[uniqueID].players:
			self.sendMessage(player,"playerJoined",{"name":playerName[uniqueID],"uniqueID":uniqueID,"team":playerSession[uniqueID].playerTeam[uniqueID],"outfit":playerSession[uniqueID].playerOutfits[uniqueID]})
	
	def sendMessage(self,uniqueID,type,data):
		try:
			msg=dict()
			msg["type"]=type;
			msg["uniqueID"]=uniqueID;
			msg["data"]=data;
			msg=json.dumps(msg)
			playerConnections[uniqueID].write_message(msg)
		except:
			success = playerSession[uniqueID].disconnectedPlayer(uniqueID)
			if(success['success']):
				for player in playerSession[uniqueID].players:
					self.sendMessage(player,"flagDropped",success)
			
	
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
	print("server starting")
	app.listen(8080)
	print("server started")
	tornado.ioloop.IOLoop.instance().start()