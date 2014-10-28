from Rooms import Room
class Session:	
	WAITING_FOR_PLAYERS=0;
	STARTING_GAME=1;

	def __init__(self):		
		self.gameState = Session.WAITING_FOR_PLAYERS
		self.players=list()
		self.blue=list()
		self.red=list()
		self.blueCarrier=0
		self.redCarrier=0
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
			self.rooms[1] = Room()
			self.rooms[1].createBaseRooms()
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
			num = len(self.rooms)
			self.rooms[num] = Room()
			self.rooms[num].createBaseRooms()
			connectData = self.rooms[num].addDoor();
			return {"success":True,"room1":data['room'],"door1x":data['x'],"door1y":data['y'],"room2":num,"door2x":connectData['x'],"door2y":connectData['y'],"newRoom":self.rooms[num].walls}
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
