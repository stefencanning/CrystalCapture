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
	
	num = 0;
	sound.songs[num]=new Audio();
	sound.songs[num].src=songNames[num];
	sound.songState[num]="stopped";
	sound.songNumbers["menu"]=num;
	
	num++;
	sound.songs[num]=new Audio();
	sound.songs[num].src=songNames[num];
	sound.songState[num]="stopped";
	sound.songNumbers["flag"]=num;
	
	num++;
	sound.songs[num]=new Audio();
	sound.songs[num].src=songNames[num];
	sound.songState[num]="stopped";
	sound.songNumbers["walking"]=num;
	
	num++;
	sound.songs[num]=new Audio();
	sound.songs[num].src=songNames[num];
	sound.songState[num]="stopped";
	sound.songNumbers["enemy"]=num;
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
		sound.songState[songNum]="starting";
	}
}


Sound.prototype.stopSong = function(songNum)
{
	sound.songState[songNum]="stopping";
}


Sound.prototype.update = function(timeElapsed)
{
	for(var i = 0; i < sound.songs.length; i++)
	{
		if(sound.songState[i]=="starting")
		{
			sound.songs[i].volume=Math.min(sound.songs[i].volume+1*timeElapsed/3,1);
			if(sound.songs[i].volume>=1)
			{
				sound.songs[i].volume=1;
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
