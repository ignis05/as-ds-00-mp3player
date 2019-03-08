class Music {
    constructor() {
        this.playing = false
        this.songName = null
        this.songListPos = null
        music = this

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.audioElement = document.getElementById("audio");
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        document.addEventListener("click",this.clicks)
    }

    play() {
        if (!music.playing) {
            $("#audio").trigger("play");
            music.playing = true
            $("#play_button").attr("src", "/static/img/pause.png")
        }
    }
    pause() {
        if (music.playing) {
            $("#audio").trigger("pause");
            music.playing = false
            $("#play_button").attr("src", "/static/img/play.png")
        }
    }
    loadFile(file, albumName) {
        if (music.playing) $("#audio").trigger("stop");
        music.playing = false
        $("#play_button").attr("src", "/static/img/play.png")

        console.log("loading: " + file);
        $("#audio").html(`<source src="/static/mp3/${albumName}/${file}" id="audio_src" type="audio/mp3" />`)
        $("#audio").trigger('load');
    }
    getData() {
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray.toString();
    }
    clicks = () =>{
        console.log("xd");
        this.audioContext.resume()
        document.removeEventListener("click",this.clicks)
    }
}