import random
class Room:	

	def __init__(self):
		self.walls=list()

	def createBaseRooms(self):
		self.walls.append([0,0,False])
		self.walls.append([1,0,False])
		self.walls.append([2,0,False])
		self.walls.append([3,0,False])
		self.walls.append([4,0,False])
		self.walls.append([5,0,False])
		self.walls.append([6,0,False])
		
		self.walls.append([0,6,False])
		self.walls.append([1,6,False])
		self.walls.append([2,6,False])
		self.walls.append([3,6,False])
		self.walls.append([4,6,False])
		self.walls.append([5,6,False])
		self.walls.append([6,6,False])
		
		self.walls.append([0,1,False])
		self.walls.append([0,2,False])
		self.walls.append([0,3,False])
		self.walls.append([0,4,False])
		self.walls.append([0,5,False])
		
		self.walls.append([6,1,False])
		self.walls.append([6,2,False])
		self.walls.append([6,3,False])
		self.walls.append([6,4,False])
		self.walls.append([6,5,False])
	
	def createDoor(self,x,y):
		for wall in self.walls:
			if(wall[0]==x and wall[1]==y):
				if(wall[2]==False):
					if(self.checkIfAllowed(x,y)):
						wall[2]=True
						return True
					return False
		return False
	
	def checkIfWall(self,x,y):
		for wall in self.walls:
			if(wall[0]==x and wall[1]==y):
				return True
		return False
		
		
	def checkIfDoor(self,x,y):
		for wall in self.walls:
			if(wall[0]==x and wall[1]==y and wall[2]==True):
				return True
		return False
		
	def checkIfAllowed(self,x,y):
		checkLeft = self.checkIfWall(x-1,y)
		checkRight = self.checkIfWall(x+1,y)
		checkUp = self.checkIfWall(x,y-1)
		checkDown = self.checkIfWall(x,y+1)
		if((checkLeft and checkUp) or (checkUp and checkRight) or (checkRight and checkDown) or (checkDown and checkLeft)):
			return False
		checkLeft = self.checkIfDoor(x-1,y)
		checkRight = self.checkIfDoor(x+1,y)
		checkUp = self.checkIfDoor(x,y-1)
		checkDown = self.checkIfDoor(x,y+1)
		checkLeftDown = self.checkIfDoor(x-1,y+1)
		checkRightDown = self.checkIfDoor(x+1,y+1)
		checkLeftUp = self.checkIfDoor(x-1,y-1)
		checkRightUp = self.checkIfDoor(x+1,y-1)
		if(checkLeft or checkUp or checkRight  or checkDown or checkLeftDown or checkRightDown or checkLeftUp or checkRightUp):
			return False
		return True
	
	def addDoor(self,count):
		if(count<20):
			num = random.randint(0,len(self.walls)-1)
			if(self.walls[num][2]==False):
				if(self.checkIfAllowed(self.walls[num][0],self.walls[num][1])):
					self.walls[num][2]=True
					return {"success":True,"x":self.walls[num][0],"y":self.walls[num][1]}
				return self.addDoor(count+1)
			return self.addDoor(count+1)
		return {"success":False}