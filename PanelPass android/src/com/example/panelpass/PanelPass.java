package com.example.panelpass;

import org.andengine.engine.camera.Camera;
import org.andengine.engine.handler.IUpdateHandler;
import org.andengine.engine.options.EngineOptions;
import org.andengine.engine.options.ScreenOrientation;
import org.andengine.engine.options.resolutionpolicy.RatioResolutionPolicy;
import org.andengine.entity.Entity;
import org.andengine.entity.primitive.Rectangle;
import org.andengine.entity.scene.IOnSceneTouchListener;
import org.andengine.entity.scene.Scene;
import org.andengine.entity.scene.background.Background;
import org.andengine.entity.text.Text;
import org.andengine.input.touch.TouchEvent;
import org.andengine.opengl.font.Font;
import org.andengine.opengl.font.FontFactory;
import org.andengine.opengl.texture.TextureOptions;
import org.andengine.ui.IGameInterface.OnCreateResourcesCallback;
import org.andengine.ui.IGameInterface.OnCreateSceneCallback;
import org.andengine.ui.IGameInterface.OnPopulateSceneCallback;
import org.andengine.ui.activity.LayoutGameActivity;
import org.json.JSONException;
import org.json.JSONObject;

import android.graphics.Typeface;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;


public class PanelPass extends LayoutGameActivity implements IUpdateHandler, IOnSceneTouchListener, MessageHandler {
	
	private static final int CAMERA_WIDTH = 480;
	private static final int CAMERA_HEIGHT = 800;		
	Scene m_scene;
	private boolean[][] gridMap = {{false, false, false, false, false, false, false},
								{false, false, false, false, false, false, false},
								{false, false, false, false, false, false, false},
								{false, false, false, false, false, false, false},
								{false, false, false, false, false, false, false},
								{false, false, false, false, false, false, false},
								{false, false, false, false, false, false, false}};
	
	int activePlayer = 0;
	boolean turn = true;
	// 0 -> waiting, 1 -> playing, 2 -> Lost
	int gameState = 0;
	//0 -> Panel Pass, 1 -> Puzzle Tag
	int gameType = 0;
	//0 = Horizontal, 1 = Vertical
	int enemyDirection = 0;
	//Boolean defining if player is chaser or runner
	boolean chaser = true;
	int[] lastMoved={0,0};
	int[] target = {3, 3};
	int waitingImage = 0;
	int timeToWait=0;
	String over = "";
	int timer = 0;
	Player[] player = new Player[2];
	float timePassed = 0;
	int panelDist = 65;
	Entity rectangleGroup1 = new Entity(0, 0);
	Entity rectangleGroup2 = new Entity(0, 0);
	int offset = 15;
	int size = 60;
    private Font mFont;
    // A standard edit text control. 
    private EditText mEditText;

    public Text mText;
    // A standard button
    private Button mButtonSendMsg;
    private Button mButtonRejoinMsg;
    private AndroidWebSocketClient mWebSocketClient;
    
    @Override
	protected int getLayoutID() {
		return R.layout.activity_panel_pass;
	}

	@Override
	protected int getRenderSurfaceViewID() {
		return R.id.xmllayoutexample_rendersurfaceview;
	}    
    
    
    @Override
    public void handleMessage(JSONObject message)
	{
		try
		{
			JSONObject data = new JSONObject(message.getString("data"));
			if(message.getString("type").equalsIgnoreCase("state"))
			{
				gameState = 0;
				//elem = document.getElementById('label');
				mText.setText(mText.getText() + " Wins: " + data.getInt("wins"));
			}
			else if(message.getString("type").equalsIgnoreCase("setUpGame")) 
			{
				setUp(data.getInt("first"),data.getInt("gameType"),data.getInt("map"));
				m_scene.setOnSceneTouchListener(this);
				m_scene.registerUpdateHandler(this);
				//elem = document.getElementById('label');
				mText.setText(mText.getText() + ". Your Opponent: " + data.getString("pid") + ". Wins: " + data.getInt("wins"));
			}
			else if(message.getString("type").equalsIgnoreCase("updateState"))
			{
				if(message.getString("pid") != mWebSocketClient.me)
				{
					if(gameType == 0)
					{
						player[1].setPos(data.getInt("x"),data.getInt("y"));
						if(data.getInt("moved") == 1)
						{
							turn = true;
							movePlatform(data.getInt("lastX"),data.getInt("lastY"),data.getInt("x"),data.getInt("y"));
						}
					}
					else if(gameType == 1)
					{
						enemyDirection = data.getInt("direction");
						player[1].targetX = data.getInt("x");
						player[1].targetY = data.getInt("y");
						player[1].setPos(data.getInt("x"),data.getInt("y"));
					}
				}
			}
			else
			{
			Log.d("type: ", message.getString("type"));
			Log.d("data: ", message.getString("data"));
			}
			this.runOnUiThread(new Runnable()
			{
				@Override
				public void run()
				{
					mEditText.setVisibility(View.GONE);
					mButtonSendMsg.setVisibility(View.GONE);
				}
			});
			//mText.setText(message);

		} 
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private void movePlatform(int lastX,int lastY,int currentX,int currentY)
	{
		this.gridMap[lastX][lastY] = false;
		this.gridMap[currentX][currentY] = true;
	}


	@Override
	public EngineOptions onCreateEngineOptions() {
		final Camera camera = new Camera(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
		return new EngineOptions(true, ScreenOrientation.PORTRAIT_FIXED, new RatioResolutionPolicy(CAMERA_WIDTH, CAMERA_HEIGHT), camera);
	}

	@Override
	public void onCreateResources(
			OnCreateResourcesCallback pOnCreateResourcesCallback)
			throws Exception {
		// TODO Auto-generated method stub

		this.mFont = FontFactory.create(this.getFontManager(), this.getTextureManager(), 256, 256, TextureOptions.BILINEAR, Typeface.create(Typeface.DEFAULT, Typeface.BOLD), 24);
		this.mFont.load();
		mWebSocketClient = new AndroidWebSocketClient(this);
		pOnCreateResourcesCallback.onCreateResourcesFinished();
		
	}

	@Override
	public void onCreateScene(OnCreateSceneCallback pOnCreateSceneCallback)	throws Exception 
	{
		
		this.m_scene = new Scene();
		this.m_scene.setBackground(new Background(0, 125, 58)); 						
		
		pOnCreateSceneCallback.onCreateSceneFinished(this.m_scene);
		
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onPopulateScene(Scene pScene,
			OnPopulateSceneCallback pOnPopulateSceneCallback) throws Exception {
		// TODO Auto-generated method stub
		//LoadGame();
		this.mText = new Text(5, 5, this.mFont, "", 1000, this.getVertexBufferObjectManager());
		m_scene.attachChild(this.mText);

		pOnPopulateSceneCallback.onPopulateSceneFinished();
	}
	
	@Override
	public void onUpdate(float pSecondsElapsed)
	{
		
		timePassed += pSecondsElapsed;
		if(gameState == 1)
		{
			if(gameType == 0)
			{
				m_scene.detachChild(rectangleGroup2);
				rectangleGroup2 = new Entity(0,0);
				for(int y = 0; y < this.gridMap.length;y++)
				{
					for(int x = 0; x < this.gridMap[y].length; x++)
					{
						Rectangle tempRec = new Rectangle(x*panelDist+offset, y*panelDist+offset+20, size, size, this.getVertexBufferObjectManager());
						rectangleGroup2.attachChild(tempRec);
						if(x == this.target[0] && y == this.target[1])
						{
							tempRec = new Rectangle((x*panelDist)+offset + 5,(y*panelDist)+offset + 5+20, size -10, size - 10, this.getVertexBufferObjectManager());
							tempRec.setColor(1, 0, 1);
							rectangleGroup2.attachChild(tempRec);
						}
						if(this.gridMap[x][y] == true)
						{
							tempRec = new Rectangle((x*panelDist)+offset + 10,(y*panelDist)+offset + 10+20, size - 20, size - 20, this.getVertexBufferObjectManager());
							tempRec.setColor(1, 1, 0);
							rectangleGroup2.attachChild(tempRec);
						}			
					}
				}
				if(player[0].getX() == target[0] && player[0].getY() == target[1])
				{
					gameState = 2;
					mWebSocketClient.updateWin();
					mText.setText(mText.getText()+"\n You Won!\nclick to replay");
				}
				else if(player[1].getX() == target[0] && player[1].getY() == target[1])
				{
					gameState = 3;
					mText.setText(mText.getText()+"\n You Lost!\nclick to replay");
				}
			}
			else if(gameType == 1)
			{
				m_scene.detachChild(rectangleGroup2);
				rectangleGroup2 = new Entity(0,0);
				Rectangle tempRec = new Rectangle(0, 0, size, size, this.getVertexBufferObjectManager());
				int blue = 0;
				int red = 0;
				if(enemyDirection == 0)
				{
					red = 1;
					blue = 0;
				}
				else if(enemyDirection == 1)
				{
					red = 0;
					blue = 1;
				}
				panelDist = 125;
				
				for(int y = 0; y < this.gridMap.length;y++)
				{
					for(int x = 0; x < this.gridMap[y].length; x++)
					{
						if(this.gridMap[x][y] == true)
						{							
							tempRec = new Rectangle(x*(int)panelDist/2 + 30, y*(int)panelDist/2 + 30+20, 40, 40, this.getVertexBufferObjectManager());
							tempRec.setColor(red, 0, blue);
							rectangleGroup2.attachChild(tempRec);
						}
					}
				}		
				if(timePassed > 120)
				{
					if(chaser == false)
					{
						gameState = 2;
						mWebSocketClient.updateWin();
						mText.setText(mText.getText()+"\n You Won!\nclick to replay");
						this.runOnUiThread(new Runnable()
						{
							@Override
							public void run()
							{
								mButtonRejoinMsg.setVisibility(View.VISIBLE);
							}
						});
					}
					else
					{
						gameState = 3;
						mText.setText(mText.getText()+"\n You Lost!\nclick to replay");
						this.runOnUiThread(new Runnable()
						{
							@Override
							public void run()
							{
								mButtonRejoinMsg.setVisibility(View.VISIBLE);
							}
						});
					}
				}
				player[0].update();
				if(	(player[0].targetX-40)/panelDist == player[1].targetX && (player[0].targetY-40-20)/panelDist == player[1].targetY)
				{
					if(chaser == true)
					{
						gameState = 2;
						mWebSocketClient.updateWin();
						mText.setText(mText.getText()+"\n You Won!\nclick to replay");
						this.runOnUiThread(new Runnable()
						{
							@Override
							public void run()
							{
								mButtonRejoinMsg.setVisibility(View.VISIBLE);
							}
						});
					}
					else
					{
						gameState = 3;
						mText.setText(mText.getText()+"\n You Lost!\nclick to replay");
						this.runOnUiThread(new Runnable()
						{
							@Override
							public void run()
							{
								mButtonRejoinMsg.setVisibility(View.VISIBLE);
							}
						});
					}
				}		
			}
			m_scene.detachChild(player[0].getRectangle());
			m_scene.detachChild(player[1].getRectangle());
			m_scene.detachChild(rectangleGroup1);
			if(gameState == 1)
			{
				m_scene.attachChild(rectangleGroup1);
				m_scene.attachChild(rectangleGroup2);
				m_scene.attachChild(player[0].getRectangle());
				m_scene.attachChild(player[1].getRectangle());
			}
		}
	}
	
	
	
	@Override
	public boolean onSceneTouchEvent(Scene pScene, TouchEvent pSceneTouchEvent) {
		if(gameState == 1)
		{
			float temp;
			if(gameType == 0)
			{
				temp = panelDist;
			}
			else
			{
				temp = 1;
			}
			if(pSceneTouchEvent.isActionDown())
			{
				float ypos = pSceneTouchEvent.getY() - (player[0].getY()*temp) - 40;
				float xpos = pSceneTouchEvent.getX()- (player[0].getX()*temp) - 60;
				if(Math.abs(xpos) > Math.abs(ypos))
				{
					if(xpos > 60)
					{
						RightMovement();
					}
					else if(xpos < -60)
					{
						LeftMovement();
					}
				}
				else
				{
					if(ypos > 60)
					{
						DownMovement();
					}
					else if(ypos < -60)
					{
						UpMovement();
					}
				}
			}
		}
		else if(gameState == 2 || gameState == 3)
		{
			mText.setText(mWebSocketClient.me);
			mWebSocketClient.newGame();
		}
		return false;
	}
	
	@Override
	public void reset() {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	protected void onSetContentView(){
		 super.onSetContentView();
		this.mEditText = (EditText)this.findViewById(R.id.xmllayoutexample_text);
		
		mButtonSendMsg = (Button)this.findViewById(R.id.buttonSendMsg);
		mButtonSendMsg.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				if(mEditText.getText().toString() != "")
				{
					mText.setText(mEditText.getText().toString());
					mWebSocketClient.join(mEditText.getText().toString());
				}
			}
		});
		
		mButtonRejoinMsg = (Button)this.findViewById(R.id.Buttonrejoin);
		mButtonRejoinMsg.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				mText.setText(mWebSocketClient.me);
				mWebSocketClient.newGame();
			}
		});
		mButtonRejoinMsg.setVisibility(View.INVISIBLE);
	}
	
	public void LoadGame()
	{		
		rectangleGroup1 = new Entity(0,0);
		rectangleGroup2 = new Entity(0,0);
		if(gameState == 0)
		{
			waitingImage +=1;
			waitingImage %= 8;
			//ctx.drawImage(dancerImg[game.waitingImage],50,50);
		}
		if(gameState == 1)
		{
			player[0].setColor(gameType);
			if(gameType == 0)
			{				
				panelDist = 65;
				for(int y = 0; y < this.gridMap.length;y++)
				{
					for(int x = 0; x < this.gridMap[y].length; x++)
					{
						Rectangle tempRec = new Rectangle(x*panelDist+offset, y*panelDist+offset+20, size, size, this.getVertexBufferObjectManager());
						rectangleGroup1.attachChild(tempRec);
						if(x == this.target[0] && y == this.target[1])
						{
							tempRec = new Rectangle((x*panelDist)+offset + 5,(y*panelDist)+offset + 5+20, size -10, size - 10, this.getVertexBufferObjectManager());
							tempRec.setColor(1, 0, 1);
							rectangleGroup1.attachChild(tempRec);
						}
						if(this.gridMap[x][y] == true)
						{
							tempRec = new Rectangle((x*panelDist)+offset + 10,(y*panelDist)+offset + 10+20, size - 20, size - 20, this.getVertexBufferObjectManager());
							tempRec.setColor(1, 1, 0);
							rectangleGroup2.attachChild(tempRec);
						}			
					}
				}
			}
			else if(gameType == 1)
			{
				Rectangle tempRec = new Rectangle(0, 0, 0, 0, this.getVertexBufferObjectManager());
				panelDist = 125;
				for(int i = 0; i < 4; i++)
				{
					tempRec = new Rectangle(i * panelDist + 40, 40+20, 20, 400,this.getVertexBufferObjectManager());
					tempRec.setColor(1, 0, 0);
					rectangleGroup1.attachChild(tempRec);
					tempRec = new Rectangle(40, i * panelDist + 40+20, 400, 20,this.getVertexBufferObjectManager());
					tempRec.setColor(0, 0, 1);
					rectangleGroup1.attachChild(tempRec);
				}
				
				for(int y = 0; y < this.gridMap.length;y++)
				{
					for(int x = 0; x < this.gridMap[y].length; x++)
					{
						if(this.gridMap[x][y] == true)
						{							
							tempRec = new Rectangle(x*(int)panelDist/2 + 30, y*(int)panelDist/2 + 30+20, 40, 40, this.getVertexBufferObjectManager());
							tempRec.setColor(0, 0, 0);
							rectangleGroup2.attachChild(tempRec);
						}
					}
				}
				
			}
		}
		else if(gameState == 2)
		{
			//ctx.clearRect(0, 0, canvas.width, canvas.height);
			//ctx.fillStyle = rgb(0, 0, 0);
			//ctx.font="20px Georgia";
			//ctx.fillText("You Won!", 20, 20);
			//console.log("you win");
		}
		else if(gameState == 3)
		{
			//ctx.clearRect(0, 0, canvas.width, canvas.height);
			//ctx.fillStyle = rgb(0, 0, 0);
			//ctx.font="20px Georgia";
			//ctx.fillText("You Lost!", 20, 20);
			//console.log("you lost");
		}
		m_scene.attachChild(rectangleGroup1);
		m_scene.attachChild(rectangleGroup2);
		player[0].LoadPlayer(m_scene);
		player[1].LoadPlayer(m_scene);
	}

	private void setUp(int val, int gametype, int mapNum)
	{		
		try{
			m_scene.detachChild(rectangleGroup1);
			m_scene.detachChild(rectangleGroup1);
			m_scene.detachChild(player[0].getRectangle());
			m_scene.detachChild(player[1].getRectangle());
		}
		catch(Exception e){}
		over = "";		
		//reset map
		for(int i = 0; i < gridMap.length;i++)
		{
			for(int j = 0; j < gridMap[i].length; j++)
			{
				gridMap[i][j] = false;
			}
		}
		gameType = gametype;
		player[0] = new Player(35, 35, false, this.getVertexBufferObjectManager(), m_scene);
		player[1] = new Player(425, 425, true, this.getVertexBufferObjectManager(), m_scene);
		player[0].setDist(panelDist);
		player[1].setDist(panelDist);
		if(gameType == 0)
		{
			
			if(mapNum == 0)
				Map1();
			if(mapNum == 1)
				Map2();
			if(mapNum == 2)
				Map3();
			if(val == 1)
			{
				if(mapNum == 2)
				{
					player[0].setPos(1, 1);
					player[1].setPos(5, 5);
				}
				else
				{
					player[0].setPos(0, 0);
					player[1].setPos(6, 6);
				}
				turn = true;
				chaser = true;
			}
			else
			{
				if(mapNum == 2)
				{
					player[0].setPos(5, 5);
					player[1].setPos(1, 1);;
				}
				else
				{
					player[0].setPos(6, 6);
					player[1].setPos(0, 0);;
				}
				turn = false;
				chaser = false;
			}	
		}
		else if(gametype == 1)
		{
			if(val == 1)
			{
				player[1].setDist(10000);
				player[0].setDist(0);
				player[0].setPos(40, 40+20);
				player[1].setPos(415, 415);
				player[0].targetX = 40;
				player[0].targetY = 40;
				player[1].targetX = 3;
				player[1].targetY = 3;
				turn = true;
				chaser = true;
			}
			else
			{
				player[1].setDist(10000);
				player[0].setDist(0);
				player[0].setPos(415, 415+20);
				player[1].setPos(40, 40);
				player[0].targetX = 415;
				player[0].targetY = 415 +20;
				player[1].targetX = 0;
				player[1].targetY = 0;
				turn = true;
				chaser = false;
			}
			Map4();
			//timer = new Date();
		}
			gameState = 1;
		LoadGame();
	}
	
	
	void Map1()
	{//Sets up the first map	
		this.gridMap[0][0] = true;
		this.gridMap[0][1] = true;
		this.gridMap[1][0] = true;
		
		this.gridMap[6][0] = true;
		this.gridMap[6][1] = true;
		this.gridMap[5][0] = true;
		
		this.gridMap[0][6] = true;
		this.gridMap[1][6] = true;
		this.gridMap[0][5] = true;
		
		this.gridMap[6][6] = true;
		this.gridMap[5][6] = true;
		this.gridMap[6][5] = true;
	}
	void Map2()
	{
		this.gridMap[0][0] = true;
		this.gridMap[2][0] = true;
		this.gridMap[4][0] = true;
		this.gridMap[6][0] = true;
		
		this.gridMap[0][2] = true;
		this.gridMap[6][2] = true;
		
		this.gridMap[0][4] = true;
		this.gridMap[6][4] = true;
		
		this.gridMap[0][6] = true;
		this.gridMap[2][6] = true;
		this.gridMap[4][6] = true;
		this.gridMap[6][6] = true;
	}
	void Map3()
	{
		this.gridMap[0][1] = true;
		this.gridMap[1][0] = true;
		this.gridMap[1][1] = true;
		
		this.gridMap[5][0] = true;
		this.gridMap[5][1] = true;
		this.gridMap[6][1] = true;
		
		this.gridMap[0][5] = true;
		this.gridMap[1][5] = true;
		this.gridMap[1][6] = true;
		
		this.gridMap[5][5] = true;
		this.gridMap[5][6] = true;
		this.gridMap[6][5] = true;
	}
	void Map4()
	{//Puzzle Tag Map
		this.gridMap[0][0] = true;
		this.gridMap[2][0] = true;
		this.gridMap[4][0] = true;
		this.gridMap[6][0] = true;
		
		this.gridMap[0][2] = true;
		this.gridMap[2][2] = true;
		this.gridMap[4][2] = true;
		this.gridMap[6][2] = true;
		
		this.gridMap[0][4] = true;
		this.gridMap[2][4] = true;
		this.gridMap[4][4] = true;
		this.gridMap[6][4] = true;
		
		this.gridMap[0][6] = true;
		this.gridMap[2][6] = true;
		this.gridMap[4][6] = true;
		this.gridMap[6][6] = true;
	}

	boolean MovePanelRight(int x, int y)
	{
		lastMoved[0] = x;
		lastMoved[1] = y;
		if(x+1 < this.gridMap.length)
		{		
			if(this.gridMap[x+1][y] == false)
			{
				this.gridMap[x][y] = false;
				while(x < this.gridMap.length)
				{
					if(this.gridMap[x][y] == true)
					{
						this.gridMap[x-1][y] = true;
						this.player[0].setPos(x-1,y);							
						this.turn = false;
						return true;
					}
					if(x+1 == this.gridMap.length)
					{
						this.gridMap[x][y] = true;
						this.player[0].setPos(x,y);
						this.turn = false;
						return true;
					}
					x+=1;
				}
			}
		}
		return false;	
	}
	boolean MovePanelLeft(int x, int y)
	{
		lastMoved[0] = x;
		lastMoved[1] = y;
		if(x-1 > -1)
		{		
			if(this.gridMap[x-1][y] == false)
			{
				this.gridMap[x][y] = false;
				while(x > -1)
				{
					if(this.gridMap[x][y] == true)
					{
						this.gridMap[x+1][y] = true;
						this.player[0].setPos(x+1,y);
						this.turn = false;
						return true;
					}
					if(x-1 < 0)
					{
						this.gridMap[x][y] = true;
						this.player[0].setPos(x,y);
						this.turn = false;
						return true;
					}
					x-=1;
				}
			}
		}
		return false;		
	}
	boolean MovePanelDown(int x, int y)
	{
		lastMoved[0] = x;
		lastMoved[1] = y;
		if(y+1 < this.gridMap[x].length)
		{		
			if(this.gridMap[x][y+1] == false)
			{
				this.gridMap[x][y] = false;
				while(y < this.gridMap[x].length)
				{
					if(this.gridMap[x][y] == true)
					{
						this.gridMap[x][y-1] = true;
						this.player[0].setPos(x,y-1);
						this.turn = false;
						return true;
					}
					if(y+1 == this.gridMap[x].length)
					{
						this.gridMap[x][y] = true;
						this.player[0].setPos(x,y);
						this.turn = false;
						return true;
					}
					y+=1;
				}
			}		
		}	
		return false;	
	}
	boolean MovePanelUp(int x, int y)
	{
		lastMoved[0] = x;
		lastMoved[1] = y;
		if(y-1 > -1)
		{		
			if(this.gridMap[x][y-1] == false)
			{
				this.gridMap[x][y] = false;
				while(y > -1)
				{
					if(this.gridMap[x][y] == true)
					{
						this.gridMap[x][y+1] = true;
						this.player[0].setPos(x, y+1);
						this.turn = false;
						return true;
					}
					if(y-1 < 0)
					{
						this.gridMap[x][y] = true;
						this.player[0].setPos(x,y);
						this.turn = false;
						return true;
					}
					y-=1;
				}
			}		
		}
		return false;
		
	}
	
	void UpMovement()
	{
		if(gameState == 1)
		{
			if(turn)
			{
				if(gameType == 0)
				{
					if(player[0].getX() == player[1].getX() && player[0].getY() - 1 == player[1].getY())
					{			
					}
					else if(player[0].getY() != 0)
					{
						if(gridMap[player[0].getX()][player[0].getY() - 1] == true)
						{
							player[0].setPos(player[0].getX(), player[0].getY() - 1);
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",player[0].getX());
								json.put("y",player[0].getY());
								json.put("moved",0);
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
						else
						{
							if(MovePanelUp(player[0].getX(), player[0].getY()))
							{
								turn = false;
								try
								{
									JSONObject json = new JSONObject();
									json.put("x",player[0].getX());
									json.put("y",player[0].getY());
									json.put("moved",1);
									json.put("lastX",lastMoved[0]);
									json.put("lastY",lastMoved[1]);
									mWebSocketClient.update(json);
								}
						        catch(JSONException e)
						        {
						        
						        }
							}
						}
					}
				}
				else if(gameType == 1)
				{
					if(!player[0].move)
					{
						if(player[0].getY()/panelDist - 1 >= 0)
						{
							player[0].setVel(0, -1);
							player[0].setEnd(player[0].getX(), player[0].getY() - panelDist);
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",(player[0].targetX-40)/panelDist);
								json.put("y",(player[0].targetY-40-20)/panelDist);
								json.put("direction",player[0].getDir());
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
					}
				}
			}
		}
	}
	void DownMovement()
	{
		if(gameState == 1)
		{
			if(turn)
			{
				if(gameType == 0)
				{
					if(player[0].getX() == player[1].getX() && player[0].getY() + 1 == player[1].getY())
					{		
					}
					else if(player[0].getY() != 6)
					{
						if(gridMap[player[0].getX()][player[0].getY() + 1] == true)
						{
							player[0].setPos(player[0].getX(), player[0].getY() + 1);
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",player[0].getX());
								json.put("y",player[0].getY());
								json.put("moved",0);
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
						else
						{
							if(MovePanelDown(player[0].getX(), player[0].getY()))
							{
								turn = false;
								try
								{
									JSONObject json = new JSONObject();
									json.put("x",player[0].getX());
									json.put("y",player[0].getY());
									json.put("moved",1);
									json.put("lastX",lastMoved[0]);
									json.put("lastY",lastMoved[1]);
									mWebSocketClient.update(json);
								}
						        catch(JSONException e)
						        {
						        
						        }
							}
						}
					}
				}
				else if(gameType == 1)
				{
					if(player[0].getY()/panelDist + 1 <=3)
					{
						if(!player[0].move)
						{
							player[0].setVel(0, 1);
							player[0].setEnd(player[0].getX(), player[0].getY() + panelDist);
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",(player[0].targetX-40)/panelDist);
								json.put("y",(player[0].targetY-40-20)/panelDist);
								json.put("direction",player[0].getDir());
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
					}
				}
			}
		}
	}
	void LeftMovement()
	{
		if(gameState == 1)
		{
			if(turn)
			{
				if(gameType == 0)
				{
					if(player[0].getX() -1 == player[1].getX() && player[0].getY() == player[1].getY())
					{	
					}
					else if(player[0].getX() != 0)
					{
						if(gridMap[player[0].getX() - 1][player[0].getY()] == true)
						{
							player[0].setPos(player[0].getX() - 1, player[0].getY());
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",player[0].getX());
								json.put("y",player[0].getY());
								json.put("moved",0);
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
						else
						{
							if(MovePanelLeft(player[0].getX(), player[0].getY()))
							{
								turn = false;
								try
								{
									JSONObject json = new JSONObject();
									json.put("x",player[0].getX());
									json.put("y",player[0].getY());
									json.put("moved",1);
									json.put("lastX",lastMoved[0]);
									json.put("lastY",lastMoved[1]);
									mWebSocketClient.update(json);
								}
						        catch(JSONException e)
						        {
						        
						        }
							}
						}
					}
				}
				else if(gameType == 1)
				{
					if(player[0].getX()/panelDist - 1 >= 0)
					{
						if(!player[0].move)
						{
							player[0].setVel(-1, 0);
							player[0].setEnd(player[0].getX() - panelDist, player[0].getY());
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",(player[0].targetX-40)/panelDist);
								json.put("y",(player[0].targetY-40-20)/panelDist);
								json.put("direction",player[0].getDir());
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
					}
				}
			}
		}
	}
	void RightMovement()
	{
		if(gameState == 1)
		{
			if(turn)
			{
				if(gameType == 0)
				{
					if(player[0].getX() + 1 == player[1].getX() && player[0].getY() == player[1].getY())
					{
					}
					else if(player[0].getX() != 6)
					{
						if(gridMap[player[0].getX() + 1][player[0].getY()] == true)
						{
							player[0].setPos(player[0].getX() + 1, player[0].getY());
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",player[0].getX());
								json.put("y",player[0].getY());
								json.put("moved",0);
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
						else
						{
							if(MovePanelRight(player[0].getX(), player[0].getY()))
							{
								turn = false;
								try
								{
									JSONObject json = new JSONObject();
									json.put("x",player[0].getX());
									json.put("y",player[0].getY());
									json.put("moved",1);
									json.put("lastX",lastMoved[0]);
									json.put("lastY",lastMoved[1]);
									mWebSocketClient.update(json);
								}
						        catch(JSONException e)
						        {
						        
						        }
							}
						}
					}
				}
				else if(gameType == 1)
				{
					if(player[0].getX()/panelDist + 1 <=3)
					{
						if(!player[0].move)
						{
							player[0].setVel(1, 0);
							player[0].setEnd(player[0].getX() + panelDist, player[0].getY());
							try
							{
								JSONObject json = new JSONObject();
								json.put("x",(player[0].targetX-40)/panelDist);
								json.put("y",(player[0].targetY-40-20)/panelDist);
								json.put("direction",player[0].getDir());
								mWebSocketClient.update(json);
							}
					        catch(JSONException e)
					        {
					        
					        }
						}
					}
				}
			}
		}
	}

	
}

	


