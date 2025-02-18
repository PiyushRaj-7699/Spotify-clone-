let currentsong=new Audio();
let songs;
let currfolder;


function formatTime (seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}







async function getsongs(folder) {

    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let song = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href);
        }
    }
    return song;
}

const playmusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track);

    currentsong.src=`/${currfolder}/`+track
    if(!pause){
        currentsong.play();
          play.src="pause.svg"

    }
    
  

    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"


}

async function main() {

   
    
    //get the list of all songs
     songs = await getsongs("songs/ncs");
     playmusic(songs[0],true);
    console.log(songs);


    //show all the songs in the playlist
     let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0];
     
     for  (const song of songs) {

        let songName = song.split('/').pop().replace(/%20/g, ' ').replace(/\.\w+$/, ''); 
        console.log(songName)
        songul.innerHTML += `<li><img class="invert" src="music.svg">
                            <div class="info">
                                <div class="songname"> ${songName}.mp3</div>
                                <div class="songartist"> Arun</div>
                            </div>
                             
                            <img class="invert" src="play2.svg"  style="    width: 40px;"></li>`; 
        

     }

     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

        
     })

     //add event listner on play ,next,prev

     play.addEventListener("click",()=>{

        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="play2.svg"
        }
     })

currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration)

    document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)}:
    ${formatTime(currentsong.duration)}`

    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";

})

//add event listener on seekbar

document.querySelector(".seekbar").addEventListener("click", e => {
    const seekbar = e.target.getBoundingClientRect();
    const clickPosition = (e.offsetX / seekbar.width) * currentsong.duration;
    currentsong.currentTime = clickPosition; // Update the current time of the audio

    document.querySelector(".circle").style.left = (e.offsetX / seekbar.width) * 100 + "%";

    
});

//add evenlistner for hamburrgder
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
} )
     
// /add evenlistner for close 
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100px"; // Add 'px' unit
});

//add event listner on previos or next button
previous.addEventListener("click",()=>{
    console.log("previous clicked")
    let currentsongURL = decodeURIComponent(currentsong.src).trim();
    let index = songs.findIndex(song => decodeURIComponent(song).trim() === currentsongURL);
      console.log("Found Index:", index);
     if(index-1>=0){
    playmusic(songs[index-1]);
     }


  
})



next.addEventListener("click",()=>{
    console.log("next clicked")
    let currentsongURL = decodeURIComponent(currentsong.src).trim();
   let index = songs.findIndex(song => decodeURIComponent(song).trim() === currentsongURL);
     console.log("Found Index:", index);
     
    if(index+1>songs.length){
   playmusic(songs[index+1]);
    }
    
})

//add event listener on volume
document.querySelector(".range input").addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value);
    let volume = parseFloat(e.target.value) / 100;
    currentsong.volume = volume;
    console.log("Volume set to:", volume);
});

//load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    console.log(e)
    e.addEventListener("click", async item=>{
        console.log(item,item.currentTarget.dataset)
        songs=await getsongs(`songs/${ item.currentTarget.dataset.folder}`);
       
    })

})


document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        let cardTitle = card.querySelector("h2").textContent.trim();
        console.log(cardTitle)
        let found = false;

        for (let song of songs) {
            let songName = song.split('/').pop().replace(/%20/g, ' ').replace(/\.\w+$/, '')+'.mp3';
            console.log(songName)
            if (songName.includes(cardTitle)) {
                playmusic(songName);
                found = true;
                break;
            }
        }

        if (!found) {
            console.log("No song name found");
        }
    });
});
  

}


main();
