class Net {
    constructor() {
        console.log("Net constructed");
        net = this
    }

    ReqAlbums_Files() {
        console.log("requesting albums and files");
        return new Promise(promise => {
            $.ajax({
                url: "/load",
                data: {},
                type: "POST",
                success: data => {
                    var obj = JSON.parse(data)
                    promise(obj)
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    throw "error"
                },
            });
        })
    }

    ReqFilesInAlbum(album) {
        console.log("requesting files in album: " + album);
        return new Promise(promise => {
            $.ajax({
                url: "/load",
                data: {
                    album: album
                },
                type: "POST",
                success: data => {
                    var obj = JSON.parse(data)
                    promise([obj.files, album])
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    throw "error"
                },
            });
        })
    }

    addSongToPlaylist(album, song, size) {
        $.ajax({
            url: "/addToPlaylist",
            data: {
                album: album,
                song: song,
                size: size,
            },
            type: "POST",
            success: data => {
                var obj = JSON.parse(data)
                return obj
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                throw "error"
            },
        });
    }

    removeSongFromPlaylist(album, song) {
        $.ajax({
            url: "/removeFromPlaylist",
            data: {
                song: song,
                album: album
            },
            type: "POST",
            success: data => {
                var obj = JSON.parse(data)
                return obj
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                throw "error"
            },
        });
    }

    reqPlaylist() {
        console.log(`requesting playlist`);
        return new Promise(promise => {
            $.ajax({
                url: "/reqPlaylist",
                data: {},
                type: "POST",
                success: data => {
                    console.log("success");
                    var obj = JSON.parse(data)
                    promise(obj)
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    throw "error"
                },
            });
        })
    }



}
console.log("Net.js loaded");