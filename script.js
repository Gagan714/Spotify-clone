let currentSong=new Audio();
function formatTime(seconds) {
    seconds = Math.floor(seconds);
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Add leading zero if seconds/minutes is less than 10
    var minutesString = (minutes < 10) ? "0" + minutes : minutes;
    var secondsString = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

    return minutesString + ":" + secondsString;
}
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
const playMusic=(track,pause=false)=>{
//let audio=new Audio("/songs/"+track);
currentSong.src="/songs/"+track;
if(!pause){
currentSong.play();
play.src="pause.svg"
}
document.querySelector(".songinfo").innerHTML=decodeURI(track)
document.querySelector(".songtime").innerHTML="0:0/0:0"
}
async function main() {
    let songs = await getsongs()
    playMusic(songs[0],true)
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" alt="" class="invert">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Sky</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
            <img src="play.svg" alt="" class="invert">
        </div>
        </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",elements=>{
            console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
            playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())
        })
    })
    
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="pause.svg"
        }else{
            currentSong.pause()
            play.src="play.svg"
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
}

main()
