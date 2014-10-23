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
session = list()
session.append(Session())

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
			self.grabFlag(data['pid'],data['team'])
		elif type == "replay":
			for games in session:
				for item in games.player:
					if(item == data['pid']):
						session.remove(games)
			self.addToGame(data)
		elif type == "won":
			self.addWin(data['pid'])
		else:
			msg = 'Error reading game request. Please make sure message type is either join, updateState, or...'
			message={'type':'error', "data":msg}
			print ('Error reading game request.')
			
	def grabFlag(self,pid,team):
		playerSession[pid].grabFlag(pid,team)
	
	def addToConnectionList(self, socket, message):
		socket.id= message['pid']
		playerConnections[socket.id]=socket
		print(str(socket.id) + " joined")
		print(str(socket) + " joined")

	def findWins(self, pid):
		#try:
			#return winlist.find_one({"username":pid})["wins"]
		#except:
			#winlist.insert({'username': pid, 'wins' : 0})
		return 0
  
	def addWin(self, pid):
		return 0
		#winlist.update({'username' : pid}, {'username' : pid,'wins' : (self.findWins(pid) + 1)})
	
	def addToGame(self,data):
		if(len(session) ==0):
			session.append(Session())
		success = session[len(session)-1].addPlayer(data['pid'])
						
		if(success):
			playerSession[data['pid']] = session[len(session)-1]
			self.sendMessage(data['pid'], "state", {"state":str(session[len(session)-1].getState()),"wins":self.findWins(data['pid'])}  )
			if(session[len(session)-1].getState()==1):
				enemy[data['pid']] = session[len(session)-1].player[0]
				enemy[session[len(session)-1].player[0]] = data['pid']
				mode = random.randint(0,1)
				playerOne = random.randint(0,1)
				map = random.randint(0,1)
				self.sendToOtherPlayer(data['pid'],"setUpGame",{"type":"setUpGame","first":playerOne,"pid":data['pid'],"gameType":mode,"map":map,"wins":self.findWins(data['pid'])})
				self.sendMessage(data['pid'],"setUpGame",{"type":"setUpGame","first":((playerOne+1)%2),"pid":enemy[data['pid']],"gameType":mode,"map":map,"wins":self.findWins(enemy[data['pid']])})
		else:
			session.append(Session())
			success = session[len(session)-1].addPlayer(data['pid'])
			if(success):
				playerSession[data['pid']] = session[len(session)-1]
				self.sendMessage(data['pid'], "state", {"state":str(session[len(session)-1].getState()),"wins":self.findWins(data['pid'])}  )
				if(session[len(session)-1].getState()==1):
					enemy[data['pid']] = session[len(session)-1].player[0]
					print(enemy[data['pid']])
					enemy[session[len(session)-1].player[0]] = data['pid']
					print(enemy[session[len(session)-1].player[0]])
					mode = random.randint(0,1)
					playerOne = random.randint(0,1)
					map = random.randint(0,1)
					self.sendToOtherPlayer(data['pid'],"setUpGame",{"type":"setUpGame","first":playerOne,"pid":data['pid'],"gameType":mode,"map":map})
					self.sendMessage(data['pid'],"setUpGame",{"type":"setUpGame","first":((playerOne+1)%2),"pid":enemy[data['pid']],"gameType":mode,"map":map})
	
	def updateState(self, data):
		self.sendToOtherPlayer(data['pid'],"updateState",data['data'])
	
	
	def sendToOtherPlayer(self,my_pid,type,data):
		try:
			msg=dict()
			msg["type"]=type;
			msg["pid"]=my_pid;
			msg["data"]=data;
			msg=json.dumps(msg)
			playerConnections[enemy[my_pid]].write_message(msg)
		except KeyError:
			print("Player " + str(pid) + " isn't connected")
		#for game in session:
		#	for item in game.player:
		#		if my_pid != item:
		#			print(item)
		#			playerConnections[item].write_message(data)
		
	#add in types 
	def sendMessage(self,pid,type,data):
		try:
			msg=dict()
			msg["type"]=type;
			msg["pid"]=pid;
			msg["data"]=data;
			msg=json.dumps(msg)
			playerConnections[pid].write_message(msg)
		except KeyError:
			print("Player " + str(pid) + " isn't connected")
	
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