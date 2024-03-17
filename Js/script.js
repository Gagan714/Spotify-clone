let currentSong=new Audio();
let songs;
let currentplaylist;
function formatTime(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    seconds = Math.floor(seconds);
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Add leading zero if seconds/minutes is less than 10
    var minutesString = (minutes < 10) ? "0" + minutes : minutes;
    var secondsString = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

    return minutesString + ":" + secondsString;
}
async function getsongs(folder) {
    currentplaylist=folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let s=element.href.split(`/${folder}/`)[1]
            s=s.replaceAll("%20"," ")
            songs.push(s)
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="Images/music.svg" alt="" class="invert">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Sky</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
            <img src="Images/play.svg" alt="" class="invert">
        </div>
        </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",elements=>{
            playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())
        })
    })
}
const playMusic=(track,pause=false)=>{
//let audio=new Audio("/songs/"+track);
currentSong.src=`/${currentplaylist}/`+track;
if(!pause){
currentSong.play();
play.src="Images/pause.svg"
}
document.querySelector(".songinfo").innerHTML=decodeURI(track)
document.querySelector(".songtime").innerHTML="00:00/00:00"
}
async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors=div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs")) {
        let folder=e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardcontainer.innerHTML = cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
            <div class="spotify-button">
                <div class="play-icon"></div>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt=""
                class="rounded">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`
        }
    }
}
async function main() {
   await getsongs(`songs/3-Idiots`)
    playMusic(songs[0],true)
    await displayAlbums()
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="Images/music.svg" alt="" class="invert">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Sky</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
            <img src="Images/play.svg" alt="" class="invert">
        </div>
        </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",elements=>{
            playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())
        })
    })
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="Images/pause.svg"
        }else{
            currentSong.pause()
            play.src="Images/play2.svg"
        }
    })
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%"
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%"
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-100%";
    })
    previous.addEventListener("click",()=>{
        let G=currentSong.src.split("/").slice(-1)[0]
        G=G.replaceAll("%20"," ")
        let index=songs.indexOf(G)
        if((index-1)>=0){
            playMusic(songs[index-1])
        }else{
            playMusic(songs[songs.length-1])
        }
    })
    next.addEventListener("click",()=>{
        let G=currentSong.src.split("/").slice(-1)[0]
        G=G.replaceAll("%20"," ")
        let index=songs.indexOf(G)
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }else{
            playMusic(songs[0]);
        }
    })
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

main()