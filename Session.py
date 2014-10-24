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

	def grabFlag(self,uniqueID,team):
		if(team==0):
			if(blueCarrier==0):
				blueCarrier=uniqueID
				return True
		if(team==1):
			if(redCarrier==0):
				redCarrier=uniqueID
				return True
		return False
