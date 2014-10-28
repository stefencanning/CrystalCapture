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
					checkLeft = self.checkDoor(x-1,y)
					checkRight = self.checkDoor(x+1,y)
					checkUp = self.checkDoor(x,y-1)
					checkDown = self.checkDoor(x,y+1)
					if((checkLeft and checkUp) or (checkUp and checkRight) or (checkRight and checkDown) or (checkDown and checkLeft)):
						return False
					wall[2]=True
					return True
		return False
	
	def checkDoor(self,x,y):
		for wall in self.walls:
			if(wall[0]==x and wall[1]==y):
				return True
		return False
	
	def addDoor(self):
		num = random.randint(0,len(self.walls)-1)
		if(self.walls[num][2]==False):
			checkLeft = self.checkDoor(self.walls[num][0]-1,self.walls[num][1])
			checkRight = self.checkDoor(self.walls[num][0]+1,self.walls[num][1])
			checkUp = self.checkDoor(self.walls[num][0],self.walls[num][1]-1)
			checkDown = self.checkDoor(self.walls[num][0],self.walls[num][1]+1)
			if((checkLeft and checkUp) or (checkUp and checkRight) or (checkRight and checkDown) or (checkDown and checkLeft)):
				return self.addDoor()
			self.walls[num][2]=True
			return {"x":self.walls[num][0],"y":self.walls[num][1]}
		return self.addDoor()