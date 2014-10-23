class Session:	
	WAITING_FOR_PLAYERS=0;
	STARTING_GAME=1;

	def __init__(self):		
		self.gameState = Session.WAITING_FOR_PLAYERS
		self.blue=list()
		self.red=list()

	def addPlayer(self, pid):
		
		result = True;
		if(len(self.blue) == 0 && len(self.blue) == 0)
			self.host = pid
		if(len(self.blue) < len(self.red)):
			print(pid)
			self.blue.append(pid)
		else
			print(pid)
			self.red.append(pid)
		return result;

	def startGame(self,pid):
		if(pid == self.host)
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

