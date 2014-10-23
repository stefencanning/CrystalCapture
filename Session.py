class Session:	
	WAITING_FOR_PLAYERS=0;
	STARTING_GAME=1;

	def __init__(self):		
		self.gameState = Session.WAITING_FOR_PLAYERS
		self.players=[]
		self.blue=list()
		self.red=list()
		self.blueCarrier=0
		self.redCarrier=0


	def addPlayer(self, pid):
		
		result = True;
		if(self.gameState == Session.WAITING_FOR_PLAYERS):
			if(len(self.blue) == 0 and len(self.red) == 0):
				self.host = pid
			if(len(self.blue) < len(self.red)):
				print(pid)
				self.blue.append(pid)
			else:
				print(pid)
				self.red.append(pid)
		else:
			result = False;
		return result;

	def startGame(self,pid):
		if(pid == self.host):
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

	def grabFlag(self,pid,team):
		if(team==0):
			if(blueCarrier==0):
				blueCarrier=pid
				return True
		if(team==1):
			if(redCarrier==0):
				redCarrier=pid
				return True
		return False
