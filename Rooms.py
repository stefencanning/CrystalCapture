import random
class Room:	

	def __init__(self):
		self.walls=list()
		self.color=""
		self.colorValue=0

	def createBaseRooms(self):
		self.walls.append([0,0,False,False,0,0,1])
		self.walls.append([1,0,False,True,1,1,9])
		self.walls.append([2,0,False,True,2,1,9])
		self.walls.append([3,0,False,True,3,1,9])
		self.walls.append([4,0,False,True,4,1,9])
		self.walls.append([5,0,False,True,5,1,9])
		self.walls.append([6,0,False,False,0,0,0])
		
		self.walls.append([0,6,False,False,0,0,2])
		self.walls.append([1,6,False,True,1,5,9])
		self.walls.append([2,6,False,True,2,5,9])
		self.walls.append([3,6,False,True,3,5,9])
		self.walls.append([4,6,False,True,4,5,9])
		self.walls.append([5,6,False,True,5,5,9])
		self.walls.append([6,6,False,False,0,0,3])
		
		self.walls.append([0,1,False,True,1,1,10])
		self.walls.append([0,2,False,True,1,2,10])
		self.walls.append([0,3,False,True,1,3,10])
		self.walls.append([0,4,False,True,1,4,10])
		self.walls.append([0,5,False,True,1,5,10])
		
		self.walls.append([6,1,False,True,5,1,10])
		self.walls.append([6,2,False,True,5,2,10])
		self.walls.append([6,3,False,True,5,3,10])
		self.walls.append([6,4,False,True,5,4,10])
		self.walls.append([6,5,False,True,5,5,10])
	
	def createProceduralRoom(self):
		wallBase={}
		wallBase[0]={}
		wallBase[0][0]=[True,False]
		wallList=list()
		wallList.append([0,0,True,False,0,0])
		chance=2
		placed=0
		placedLimit=20
		while(placed < placedLimit):
			for wall in wallList:
				if( placed < 500 and random.randint(0,100)!=0):
					x=wall[0]
					y=wall[1]
					bool=wall[2]
					xNew=x-1
					yNew=y
					if(wallBase.get(xNew,False) == False):
						wallBase[xNew]={}
					if(wallBase[xNew].get(yNew,False) == False):
						rand = random.randint(0,chance)
						if(rand != 0):
							wallBase[xNew][yNew]=[True,False]
							wallList.append([xNew,yNew,True,False,0,0])
							placed+=1
					
					xNew=x+1
					yNew=y
					if(wallBase.get(xNew,False) == False):
						wallBase[xNew]={}
					if(wallBase[xNew].get(yNew,False) == False):
						rand = random.randint(0,chance)
						if(rand != 0):
							wallBase[xNew][yNew]=[True,False]
							wallList.append([xNew,yNew,True,False,0,0])
							placed+=1
					
					xNew=x
					yNew=y-1
					if(wallBase.get(xNew,False) == False):
						wallBase[xNew]={}
					if(wallBase[xNew].get(yNew,False) == False):
						rand = random.randint(0,chance)
						if(rand != 0):
							wallBase[xNew][yNew]=[True,False]
							wallList.append([xNew,yNew,True,False,0,0])
							placed+=1
					
					xNew=x
					yNew=y+1
					if(wallBase.get(xNew,False) == False):
						wallBase[xNew]={}
					if(wallBase[xNew].get(yNew,False) == False):
						rand = random.randint(0,chance)
						if(rand != 0):
							wallBase[xNew][yNew]=[True,False]
							wallList.append([xNew,yNew,True,False,0,0])
							placed+=1
				
		for wall in wallList:
			x=wall[0]
			y=wall[1]
			if(wallBase.get(x-1,False) == False):
				self.walls.append([x,y,False,False,0,0,0])
				wallBase[x][y][1]=True
			elif(wallBase.get(x+1,False) == False):
				self.walls.append([x,y,False,False,0,0,0])
				wallBase[x][y][1]=True
			elif(wallBase[x-1].get(y,False) == False or wallBase[x+1].get(y,False) == False or wallBase[x].get(y-1,False) == False or wallBase[x].get(y+1,False) == False
			or wallBase[x-1].get(y-1,False) == False or wallBase[x-1].get(y+1,False) == False or wallBase[x+1].get(y-1,False) == False or wallBase[x+1].get(y+1,False) == False):
				self.walls.append([x,y,False,False,0,0,0])
				wallBase[x][y][1]=True
		
		for wall in self.walls:
			x=wall[0]
			y=wall[1]
			if(wallBase.get(x-1,False)):
				if(wallBase[x-1].get(y,False)):
					if(wallBase[x-1][y][0]):
						if(wallBase[x-1][y][1]==False):
							wall[3]=True
							wall[4]=x-1
							wall[5]=y
			if(wallBase.get(x+1,False)):
				if(wallBase[x+1].get(y,False)):
					if(wallBase[x+1][y][0]):
						if(wallBase[x+1][y][1]==False):
							wall[3]=True
							wall[4]=x+1
							wall[5]=y
			if(wallBase[x].get(y-1,False)):
				if(wallBase[x][y-1][0]):
					if(wallBase[x][y-1][1]==False):
						wall[3]=True
						wall[4]=x
						wall[5]=y-1
			if(wallBase[x].get(y+1,False)):
				if(wallBase[x][y+1][0]):
					if(wallBase[x][y+1][1]==False):
						wall[3]=True
						wall[4]=x
						wall[5]=y+1
		
		
		for wall in self.walls:
			x=wall[0]
			y=wall[1]
			up=False
			down=False
			left=False
			right=False
			if(wallBase.get(x-1,False)):
				if(wallBase[x-1].get(y,False)):
					if(wallBase[x-1][y][0]):
						if(wallBase[x-1][y][1]==True):
							left=True
			if(wallBase.get(x+1,False)):
				if(wallBase[x+1].get(y,False)):
					if(wallBase[x+1][y][0]):
						if(wallBase[x+1][y][1]==True):
							right=True
			if(wallBase[x].get(y-1,False)):
				if(wallBase[x][y-1][0]):
					if(wallBase[x][y-1][1]==True):
						up=True
			if(wallBase[x].get(y+1,False)):
				if(wallBase[x][y+1][0]):
					if(wallBase[x][y+1][1]==True):
						down=True
			if(up and down and left and right):
				wall[6]=8
			elif(up and down and left):
				wall[6]=4
			elif(up and down and right):
				wall[6]=6
			elif(up  and left and right):
				wall[6]=7
			elif(down and left and right):
				wall[6]=5
			elif(up and left):
				wall[6]=3
			elif(up and right):
				wall[6]=2
			elif(down and left):
				wall[6]=0
			elif(down and right):
				wall[6]=1
			elif(up and down):
				wall[6]=10
			elif(left and right):
				wall[6]=9
			elif(up ):
				wall[6]=14
			elif(down ):
				wall[6]=12
			elif(left ):
				wall[6]=11
			elif(right):
				wall[6]=13
	
	def createDoor(self,x,y):
		for wall in self.walls:
			if(wall[0]==x and wall[1]==y):
				if(wall[2]==False):
					if(wall[3]):
						if(self.checkIfAllowed(x,y)):
							wall[2]=True
							return {"success":True,"matX":wall[4],"matY":wall[5]}
					return {"success":False}
		return {"success":False}
	
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
		#checkLeft = self.checkIfWall(x-1,y)
		#checkRight = self.checkIfWall(x+1,y)
		#checkUp = self.checkIfWall(x,y-1)
		#checkDown = self.checkIfWall(x,y+1)
		#if((checkLeft and checkUp) or (checkUp and checkRight) or (checkRight and checkDown) or (checkDown and checkLeft)):
		#	return False
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
				if(self.walls[num][3]):
					if(self.checkIfAllowed(self.walls[num][0],self.walls[num][1])):
						self.walls[num][2]=True
						return {"success":True,"x":self.walls[num][0],"y":self.walls[num][1],"matX":self.walls[num][4],"matY":self.walls[num][5]}
				return self.addDoor(count+1)
			return self.addDoor(count+1)
		return {"success":False}