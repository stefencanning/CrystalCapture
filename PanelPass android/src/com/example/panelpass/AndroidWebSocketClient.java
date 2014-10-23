package com.example.panelpass;


import java.net.URI;
import java.util.Arrays;
import java.util.List;

import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.codebutler.android_websockets.WebSocketClient;

public class AndroidWebSocketClient {
	
	private final String TAG = "AndroidWebSocketClient";
	private WebSocketClient mClient;
	
	
	private MessageHandler callBack;
	String me;
	
	public AndroidWebSocketClient(MessageHandler a) {
		callBack = a;
		
		List<BasicNameValuePair> extraHeaders = Arrays.asList(
			    new BasicNameValuePair("Cookie", "session=abcd")
		);
		
		
		mClient = new WebSocketClient(URI.create("ws://149.153.102.6:8080/wstest"), new WebSocketClient.Listener() {
		    @Override
		    public void onConnect() {
		       Log.d(TAG, "Connected!");
		    }

		    @Override
		    public void onMessage(String message) {
		        Log.d(TAG, String.format("Got string message! %s", message));
		        try{
		        JSONObject json = new JSONObject(message);
		        Log.d(TAG, String.format("type: %s", json.getString("type")));
		        Log.d(TAG, String.format("data: %s", json.getString("data")));
		        callBack.handleMessage(json);
		        }
		        catch(JSONException e)
		        {
		        
		        }
		    }

		    
		    @Override
		    public void onMessage(byte[] data) {
		        //Log.d(TAG, String.format("Got binary message! %s", toHexString(data));
		    }

		    @Override
		    public void onDisconnect(int code, String reason) {
		        Log.d(TAG, String.format("Disconnected! Code: %d Reason: %s", code, reason));
		    }

		    @Override
		    public void onError(Exception error) {
		        Log.e(TAG, "Error!", error);
		    }
		}, extraHeaders);

		mClient.connect();
		
		
	}

	
	
	void update(JSONObject data)
	{
		try 
		{ 
			JSONObject json = new JSONObject();
			json.put("type", "updateState");
			json.put("pid", me);
			json.put("data", data);
			mClient.send(json.toString());
		}
		catch(JSONException e)
		{
			//	Log.e(TAG, "JSONException!", e.toString());
		}
	}
	
	
	
	
	
	void join(String name)
	{
		me = name;
		try 
		{ 
			JSONObject json = new JSONObject();
			json.put("type", "join");
			json.put("pid", me);
			mClient.send(json.toString());
		}
		catch(JSONException e)
		{
			//	Log.e(TAG, "JSONException!", e.toString());
		}
	}
	
	void newGame()
	{
		try 
		{ 
			JSONObject json = new JSONObject();
			json.put("type", "replay");
			json.put("pid", me);
			mClient.send(json.toString());
		}
		catch(JSONException e)
		{
			//	Log.e(TAG, "JSONException!", e.toString());
		}
	}
	
	void updateWin()
	{
		try 
		{ 
			JSONObject json = new JSONObject();
			json.put("type", "won");
			json.put("pid", me);
			mClient.send(json.toString());
		}
		catch(JSONException e)
		{
			//	Log.e(TAG, "JSONException!", e.toString());
		}
	}
	
	void sendMessage(String name) 
	{
		try 
		{ 
			JSONObject json  = new JSONObject();
			json.put("type", "join");
			json.put("pid", name);
			mClient.send(json.toString());
		}
		catch(JSONException e)
		{
			//	Log.e(TAG, "JSONException!", e.toString());
		}
	}
		
}
