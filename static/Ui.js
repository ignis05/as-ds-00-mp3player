class Ui {
    constructor() {
        console.log("Ui constructed");
        ui = this
        this.createControls()
        this.currentAlbum = null;
        this.renderAlbums();
        this.currnetSongs = [];
        this.playingSongs = [];
        this.playingAlbum = null;
        this.playingFromPlaylist = false;
        this.playlist = null;
        this.activeOverlay = false;
        this.bindListeners()
    }

    renderFiles(files, albumName) {
        console.log("displaying album: " + albumName);
        $("#main").html("")
        var table = $("<table id='songList'>")
        table.appendTo($("#main"))
        ui.currnetSongs.length = 0
        for (let i in files) {
            ui.currnetSongs.push(files[i].name)

            let tr = $("<tr>")
            tr.appendTo(table)
            //#region td's
            let a = $("<td>")
            a.text(albumName)
            a.appendTo(tr)

            let x = $("<td>")
            x.text(files[i].name)
            x.appendTo(tr)

            let b = $("<td>")
            b.text(`${files[i].size.toFixed(2)}MB`)
            b.appendTo(tr)
            //#endregion

            let z = $("<td class='tableButton'>")
            z.on("click", function () {
                if (music.songName == albumName + files[i].name) { //already playing this song - works as play/pause
                    ui.playPauseClick()
                }
                else { //loads song
                    ui.clearColor()
                    $(this).parent().addClass("active")
                    ui.displaySong(albumName, files[i].name)
                    music.loadFile(files[i].name, albumName)
                    music.songName = albumName + files[i].name  //for checking on album switch
                    music.songListPos = parseInt(i)
                    ui.playingSongs.length = 0
                    ui.currnetSongs.forEach(song => {
                        ui.playingSongs.push(song)
                    });
                    ui.playingAlbum = ui.currentAlbum
                    ui.playingFromPlaylist = false;
                }
            })
            z.appendTo(tr)

            let c = $("<img class='tableButtonImg'>")
            c.appendTo(z)


            let aa = $("<td class='tableButton2'>")
            aa.appendTo(tr)
            aa.on("click", async function () {
                console.log(`adding to playlist song: ${files[i].name} (album: ${albumName})`);
                net.addSongToPlaylist(albumName, files[i].name, files[i].size)
            })

            let d = $("<img class='btPlus' src='/static/img/plus.png'>")
            d.appendTo(aa)
        }
        ui.setButtonsOnTable()
        if (ui.playingAlbum == ui.currentAlbum) { //checks if alrady playing song from this album - restores active status of <tr>
            console.log("already playing song from this album");
            $($("#songList").children()[music.songListPos]).addClass("active")
            ui.setButtonsOnTable()
        }
    }

    async renderAlbums() {
        var obj = await net.ReqAlbums_Files()
        ui.currentAlbum = obj.albums[0].name
        for (let i in obj.albums) {
            var x = $("<button>")
            x.html(`<img class='albumCover' src='/static/mp3/${obj.albums[i].name}/cover.jpg'>`)
            x.addClass("album")
            $("#albums").append(x)
            x.on("click", async function () {
                var data = await net.ReqFilesInAlbum(obj.albums[i].name)
                ui.currentAlbum = obj.albums[i].name
                ui.renderFiles(data[0], data[1])
            })
        }
        this.renderFiles(obj.files, obj.albums[0].name)
    }

    createControls() {
        var prev = $("<img src='/static/img/next.png' class='next_button' style='transform:rotate(180deg)'>")
        prev.on("click", () => {
            ui.changeSong("prev")
        })
        prev.appendTo($("#controls"))

        var play = $("<img src='/static/img/play.png' id='play_button'>")
        play.on("click", () => {
            ui.playPauseClick()
        })
        play.appendTo($("#controls"))

        var next = $("<img src='/static/img/next.png' class='next_button'>")
        next.on("click", () => {
            ui.changeSong("next")
        })
        next.appendTo($("#controls"))

        var display = $("<div id='display'>")
        display.text("")
        display.appendTo($("#controls"))

        $("#controls").click(e => {
            if (e.altKey) {
                if ($("#audio").css("display") == "none") $("#audio").css("display", "block")
                else $("#audio").css("display", "none")
            }
        })
        var display = $("<div id='time'>")
        display.text("")
        display.appendTo($("#controls"))

        var bar = $("<div id='timeBar'>")
        bar.appendTo($("#controls"))

        var bar2 = $("<div id='timebarProgress'>")
        bar2.appendTo(bar)

        $("#btPlaylist").click(() => { ui.renderPlaylist() })

        var overlay = $("<div id='overlay'>")
        overlay.css("display","none")
        $(document.body).append(overlay)

        document.addEventListener("keydown", e => {
            if (e.code == "Space") {
                if (ui.activeOverlay) {
                    overlay.css("display","none")
                    ui.activeOverlay = false
                }
                else {
                    overlay.css("display","block")
                    ui.activeOverlay = true
                }
            }
        })
    }

    async renderPlaylist() {
        console.log("rendering custom playlist");
        var playlist = await net.reqPlaylist()
        this.playlist = playlist
        console.log("received file:");
        if (playlist.length == 0) {
            console.log("empty file");
            return
        }
        else {
            ui.currentAlbum = "specialPlaylist2137XDDRaNDomIDHERe"
            console.log("displaying album: " + ui.currentAlbum);
            $("#main").html("")
            var table = $("<table id='songList'>")
            table.appendTo($("#main"))
            ui.currnetSongs.length = 0
            for (let i in playlist) {
                ui.currnetSongs.push(playlist[i].song)

                let tr = $("<tr>")
                tr.appendTo(table)
                //#region td's
                let a = $("<td>")
                a.text(playlist[i].album)
                a.appendTo(tr)

                let x = $("<td>")
                x.text(playlist[i].song)
                x.appendTo(tr)

                let b = $("<td>")
                b.text(`${parseFloat(playlist[i].size).toFixed(2)}MB`)
                b.appendTo(tr)
                //#endregion

                let z = $("<td class='tableButton'>")
                z.on("click", function () {
                    if (music.songName == playlist[i].album + playlist[i].song) { //already playing this song - works as play/pause
                        ui.playPauseClick()
                    }
                    else { //loads song
                        ui.clearColor()
                        $(this).parent().addClass("active")
                        ui.displaySong(playlist[i].album, playlist[i].song)
                        music.loadFile(playlist[i].song, playlist[i].album)
                        music.songName = playlist[i].album + playlist[i].song  //for checking on album switch
                        music.songListPos = parseInt(i)
                        ui.playingSongs.length = 0
                        ui.currnetSongs.forEach(song => {
                            ui.playingSongs.push(song)
                        });
                        ui.playingAlbum = ui.currentAlbum
                        ui.playingFromPlaylist = true
                    }
                })
                z.appendTo(tr)

                let c = $("<img class='tableButtonImg'>")
                c.appendTo(z)

                let aa = $("<td class='tableButton2'>")
                aa.appendTo(tr)
                aa.on("click", async function () {
                    console.log(`removing from playlist song: ${playlist[i].song} (album: ${playlist[i].album})`);
                    net.removeSongFromPlaylist(playlist[i].album, playlist[i].song)
                    ui.renderPlaylist()
                })

                let d = $("<img class='btPlus' src='/static/img/minus.png'>")
                d.appendTo(aa)
            }
            ui.setButtonsOnTable()
            if (ui.playingAlbum == ui.currentAlbum) { //checks if alrady playing song from this album - restores active status of <tr>
                console.log("already playing song from this album");
                $($("#songList").children()[music.songListPos]).addClass("active")
                ui.setButtonsOnTable()
            }
        }
    }

    playPauseClick() {
        if (!document.getElementById("audio_src")) return //does nothing if no music loaded
        if (!music.playing) {
            music.play()
        }
        else {
            music.pause()
        }
        ui.setButtonsOnTable()
    }

    displaySong(album, song) {
        if (!song) song = ""
        $("#display").text(album + " / " + song)
    }

    clearColor() {
        $("#songList").children().removeClass("active")
    }

    changeSong(arg) {
        if (!document.getElementById("audio_src")) return //does nothing if no music loaded
        if (arg != "next" && arg != "prev") {
            console.error("ui.changeSong() - wrong arg")
            return -1
        }
        if (ui.playingAlbum != ui.currentAlbum) { //if in diffrent album

            var songList = ui.playingSongs
            if (ui.playingFromPlaylist) songList = ui.playlist
            var toPlay;
            if (arg == "next") {
                console.log("next");
                if (music.songListPos == (songList.length - 1)) {
                    toPlay = 0
                }
                else {
                    toPlay = music.songListPos + 1
                }
            }
            else {
                console.log("prev");
                if (music.songListPos == 0) {
                    toPlay = songList.length - 1
                }
                else {
                    toPlay = music.songListPos - 1
                }
            }
            if (!ui.playingFromPlaylist) {
                ui.displaySong(ui.playingAlbum, songList[toPlay])
                music.loadFile(songList[toPlay], ui.playingAlbum)
                music.songName = ui.playingAlbum + songList[toPlay]  //for checking on album switch
                music.songListPos = parseInt(toPlay)
            }
            else {
                ui.displaySong(songList[toPlay].album, songList[toPlay].song)
                music.loadFile(songList[toPlay].song, songList[toPlay].album)
                music.songName = songList[toPlay].album + songList[toPlay].song  //for checking on album switch
                music.songListPos = parseInt(toPlay)
            }
            return
        }

        var songList = $("#songList").children()
        var toPlay;

        if (arg == "next") {
            console.log("next");
            if (music.songListPos == (songList.length - 1)) {
                toPlay = 0
            }
            else {
                toPlay = music.songListPos + 1
            }
        }
        else {
            console.log("prev");
            if (music.songListPos == 0) {
                toPlay = songList.length - 1
            }
            else {
                toPlay = music.songListPos - 1
            }
        }
        console.log("now playing: " + music.songListPos);
        console.log("to play: " + toPlay);

        $(songList[toPlay]).find(".tableButton").click() //triggers click on button in table
    }

    setButtonsOnTable() {
        $(".tableButtonImg").attr("src", "/static/img/play.png")
        for (let x of $("#songList").children()) {
            if ($(x).is(".active")) {
                let imageOnButton = $(x).children(".tableButton").children()[0]
                if (music.playing) {
                    $(imageOnButton).attr("src", "/static/img/pause.png")
                }
                else {
                    $(imageOnButton).attr("src", "/static/img/play.png")
                }
            }
        }
    }

    rawTimetoDisplayTime(rawTime) {
        if (!rawTime || rawTime == Infinity || rawTime == NaN) return "00:00"
        rawTime = Math.round(rawTime)
        var min = Math.floor(rawTime / 60).toString()
        var sec = (rawTime - (min * 60)).toString()
        if (sec.length < 2) {
            sec = sec.split("")
            sec.unshift("0")
            sec = sec.join("")
        }
        if (min.length < 2) {
            min = min.split("")
            min.unshift("0")
            min = min.join("")
        }
        var displayTime = `${min}:${sec}`
        return displayTime
    }

    bindListeners() {
        $("#audio").on("loadeddata", function () {
            console.log("loaded")
            music.play()
            ui.setButtonsOnTable()
            $("#timebarProgress")
                .css("height", "100%")
                .css("width", "0%")
                .css("background", "cyan")
                .css("z-index", "10")
            $("#audio").on("timeupdate", function () {
                $("#time").text(`${ui.rawTimetoDisplayTime($("#audio").prop("currentTime"))} / ${ui.rawTimetoDisplayTime($("#audio").prop("duration"))}`)
                $("#timebarProgress").css("width", parseFloat($("#audio").prop("currentTime")) * 100 / parseFloat($("#audio").prop("duration")) + "%")
            })
        })

        $("#audio").on("ended", function () {
            console.log("ended")
            ui.changeSong("next")
            $("#audio").off("timeupdate")
        })
    }

}
console.log("Ui.js loaded");