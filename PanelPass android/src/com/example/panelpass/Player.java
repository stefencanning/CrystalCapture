package com.example.panelpass;

import org.andengine.entity.primitive.Rectangle;
import org.andengine.entity.scene.Scene;
import org.andengine.opengl.vbo.VertexBufferObjectManager;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;

public class Player 
{
	int x;
	int y;
	int width;
	int height;
	boolean enemy;
	int velX;
	int velY;
	int targetX;
	int targetY;
	int dir;
	int panelDist;
	boolean move;
	Rectangle playerRec;
	
	public Player(int xPos, int yPos, boolean en, VertexBufferObjectManager vb, Scene s)
	{
		x = xPos;
		y = yPos;
		width = 20;
		height = 20;
		enemy = en;
		velX = 0;
		velY = 0;
		targetX = x;
		targetY = y;
		dir = 0;
		move = false;
		playerRec = new Rectangle(xPos, yPos, width, height, vb);
		playerRec.setColor(0, 0, 1);
		if(en)playerRec.setColor(1, 0, 0);
	}
	
	public Rectangle getRectangle()
	{
		return playerRec;
	}
	
	public void setColor(int num)
	{
		if(num == 0)
			playerRec.setColor(0, 0, 1);
		if(num == 1)
			playerRec.setColor(0, 1, 0);
	}
	public void LoadPlayer(Scene s)
	{
		s.attachChild(playerRec);
	}
	public void setDist(int dist)
	{
		panelDist = dist;
	}
	public int getX()
	{//Returns the x position of the player on the grid
		return x;
	}
	
	public int getY()
	{//Returns the y position of the player on the grid
		return y;
	}
	
	public void setPos(int xPos, int yPos)
	{//Sets the position of the player on the grid
		playerRec.setX(xPos * panelDist + 40);
		playerRec.setY(yPos * panelDist + 40);
		x = xPos;
		y = yPos;
	}
	
	//Set of methods for moving in puzzle tag
	public void setVel(int x, int y)
	{
		if(move == false)
		{
			velX = x;
			velY = y;
			if(x > 0 || x < 0)
			{
				dir = 1;
			}
			else if(y > 0 || y < 0)
			{
				dir = 0;
			}
		}
	}
	
	public void setEnd(int x, int y)
	{
		if(move == false)
		{
			targetX = x;
			targetY = y;
			move = true;
		}
	}
	
	public void update()
	{
		if(this.move == true)
		{
			if(this.x == this.targetX && this.y == this.targetY)
			{		
				this.velX = 0;
				this.velY = 0;
				this.move = false;
			}
			else
			{
				this.x += this.velX;
				this.y += this.velY;
			}
		}
		playerRec.setPosition(x, y);
	}

	public int getDir()
	{
		return this.dir;
	}

}
