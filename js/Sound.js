songNames=["sound/menu.mp3","sound/flag.mp3","sound/walk.mp3","sound/battle.mp3"];

//songs: lost and forgotten-menus, carrying flag-rave, Acruta Lao Dnor-enemies in room, heroes march-walking

function Sound()
{
	
}

Sound.prototype.Initialise = function()
{
	sound.loadSongs();
}

Sound.prototype.loadSongs = function()
{
	sound.songNumbers={};
	sound.songState=[];
	sound.songs=[];
	
	sound.songs[0]=new Audio();
	sound.songs[0].src="sound/menu.mp3";
	sound.songState[0]="stopped";
	sound.songNumbers["menu"]=0;
	
	sound.songs[1]=new Audio();
	sound.songs[1].src="sound/flag.mp3";
	sound.songState[1]="stopped";
	sound.songNumbers["flag"]=1;
	
	sound.songs[2]=new Audio();
	sound.songs[2].src="sound/walk.mp3";
	sound.songState[2]="stopped";
	sound.songNumbers["walking"]=2;
	
	sound.songs[3]=new Audio();
	sound.songs[3].src="sound/battle.mp3";
	sound.songState[3]="stopped";
	sound.songNumbers["enemy"]=3;
	
	sound.songs[4]=new Audio();
	sound.songs[4].src="sound/battle.mp3";
	sound.songState[4]="stopped";
	sound.songNumbers["enemy2"]=4;
}


Sound.prototype.playSong = function(songNum)
{
	if(sound.songs[songNum]!=null)
	{
		if (typeof sound.songs[songNum].loop == 'boolean')
		{
			sound.songs[songNum].loop = true;
		}
		else
		{
			sound.songs[songNum].addEventListener('ended', function() {
				this.currentTime = 0;
				this.play();
			}, false);
		}
		if(sound.songState[songNum]=="stopped")
		{
			sound.songs[songNum].volume=0;
			sound.songs[songNum].play();
		}
		if(sound.songState[songNum]!="playing")
		{
			sound.songState[songNum]="starting";
		}
	}
}


Sound.prototype.stopSong = function(songNum)
{
	if(sound.songState[songNum]!="stopped")
	{
		sound.songState[songNum]="stopping";
	}
}


Sound.prototype.update = function(timeElapsed)
{
	for(var i = 0; i < sound.songs.length; i++)
	{
		if(sound.songState[i]=="starting")
		{
			sound.songs[i].volume=Math.min(sound.songs[i].volume+1*timeElapsed/5,1);
			if(sound.songs[i].volume>=0.8)
			{
				sound.songs[i].volume=0.8;
				sound.songState[i]="playing";
			}
		}
		if(sound.songState[i]=="stopping")
		{
			sound.songs[i].volume=Math.max(sound.songs[i].volume-1*timeElapsed/3,0);
			if(sound.songs[i].volume<=0)
			{
				sound.songs[i].pause();
				sound.songState[i]="stopped";
			}
		}
	}
}
