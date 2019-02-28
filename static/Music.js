class Music {
    constructor() {
        this.playing = false
        this.songName = null
        this.songListPos = null
        music = this
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
}