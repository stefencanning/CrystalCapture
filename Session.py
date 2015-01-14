from Rooms import Room
import random
class Session:	
	WAITING_FOR_PLAYERS=0;
	STARTING_GAME=1;

	def __init__(self):		
		self.gameState = Session.WAITING_FOR_PLAYERS
		self.players=list()
		self.playerOutfits={}
		self.blue=list()
		self.red=list()
		self.blueCarrier=0
		self.blueData={}
		self.redCarrier=0
		self.redData={}
		self.hostID = 0
		self.playerTeam={}
		self.rooms={}


	def addPlayer(self, uniqueID):
		result = True;
		if(self.gameState == Session.WAITING_FOR_PLAYERS):
			if(len(self.blue) == 0 and len(self.red) == 0):
				self.hostID = uniqueID
			if(len(self.blue) < len(self.red)):
				self.blue.append(uniqueID)
				self.players.append(uniqueID)
				self.playerTeam[uniqueID]="blue"
			else:
				self.red.append(uniqueID)
				self.players.append(uniqueID)
				self.playerTeam[uniqueID]="red"
		else:
			result = False;
		return result;

	def startGame(self,uniqueID):
		if(uniqueID == self.hostID):
			self.gameState = Session.STARTING_GAME
			self.rooms[0] = Room()
			self.rooms[0].createBaseRooms()
			self.rooms[0].color="blue"
			self.rooms[0].colorValue=200
			self.rooms[1] = Room()
			self.rooms[1].createBaseRooms()
			self.rooms[1].color="red"
			self.rooms[1].colorValue=200
			return True
		return False

	def getNumPlayers(self):
		return len(self.blue)+len(self.red)

	def getState(self):
		return self.gameState

	def setState(self,gameState):
		self.gameState = gameState

	def getStateAsString(self, state):
		pass
	
	
	def createDoor(self,data):
		success = self.rooms[data['room']].createDoor(data['x'],data['y'])
		if(success):
			if(len(self.rooms) > 15):
				num = random.randint(0,3)
				print("rand num for room was: %s" %num)
				if(num == 0):
					connectData={"success":False}
					roomCheckCounter = 0
					while(connectData['success']==False and roomCheckCounter<20):
						num = random.randint(10,len(self.rooms)-1)
						connectData = self.rooms[num].addDoor(0);
						roomCheckCounter+=1
					if(connectData['success']==True):
						print("room to connect was: %s" %num)
						return {"success":True,"room1":data['room'],"door1x":data['x'],"door1y":data['y'],"room2":num,"door2x":connectData['x'],"door2y":connectData['y']}#,"newRoom":self.rooms[num].walls
			num = len(self.rooms)
			self.rooms[num] = Room()
			self.rooms[num].createProceduralRoom()
			self.rooms[num].color = self.rooms[data['room']].color
			self.rooms[num].colorValue = max(0,self.rooms[data['room']].colorValue-5)
			connectData = self.rooms[num].addDoor(0);
			if(connectData['success']==True):
				print("room to connect was: %s" %num)
				return {"success":True,"room1":data['room'],"door1x":data['x'],"door1y":data['y'],"room2":num,"door2x":connectData['x'],"door2y":connectData['y'],"newRoom":self.rooms[num].walls,"color":self.rooms[num].color,"colorValue":self.rooms[num].colorValue}
			else:
				self.rooms = {key: value for key, value in self.rooms.items() if value != self.rooms[num]}
				while(connectData['success']==False):
					num = random.randint(0,len(self.rooms)-1)
					connectData = self.rooms[num].addDoor(0);
				print("room to connect was: %s" %num)
				return {"success":True,"room1":data['room'],"door1x":data['x'],"door1y":data['y'],"room2":num,"door2x":connectData['x'],"door2y":connectData['y']}#,"newRoom":self.rooms[num].walls
		return {"success":False}

	def grabFlag(self,uniqueID,team):
		if(team=="blue"):
			if(self.blueCarrier==0):
				self.blueCarrier=uniqueID
				return True
		if(team=="red"):
			if(self.redCarrier==0):
				self.redCarrier=uniqueID
				return True
		return False
	
	def captureFlag(self,uniqueID,team):
		if(team=="blue"):
			if(self.blueCarrier==uniqueID):
				if(self.redCarrier==0):
					self.blueCarrier=0
					self.redCarrier=0
					return True
		if(team=="red"):
			if(self.redCarrier==uniqueID):
				if(self.blueCarrier==0):
					self.blueCarrier=0
					self.redCarrier=0
					return True
		return False
		
	
	def playerDied(self,uniqueID,team):
		if(team=="blue"):
			if(self.blueCarrier==uniqueID):
				self.blueCarrier=0
				return True
		if(team=="red"):
			if(self.redCarrier==uniqueID):
				self.redCarrier=0
				return True
		return False
	
	def updatePlayer(self,uniqueID,data):
		if(uniqueID==self.blueCarrier):
			self.blueData[0]=data['x']
			self.blueData[1]=data['y']
			self.blueData[2]=data['room']
		if(uniqueID==self.redCarrier):
			self.redData[0]=data['x']
			self.redData[1]=data['y']
			self.redData[2]=data['room']
	
	def disconnectedPlayer(self,uniqueID):
		if(self.blueCarrier==uniqueID):
			self.blueCarrier=0
			return {"success":True,"x":self.blueData[0],"y":self.blueData[1],"room":self.blueData[2],"team":"blue","uniqueID":uniqueID}
		if(self.redCarrier==uniqueID):
			self.redCarrier=0
			return {"success":True,"x":self.redData[0],"y":self.redData[1],"room":self.redData[2],"team":"red","uniqueID":uniqueID}
		return {"success":False}
