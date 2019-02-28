var http = require("http");
var fs = require("fs");
var qs = require("querystring")

var serverDatabase = {
    playlist: []
}

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            console.log(`requested adres: ${decodeURI(req.url)}`.white)
            var fileEXTEN = req.url.split(".")[req.url.split(".").length - 1]
            if (req.url == "/") {
                fs.readFile(`static/index.html`, function (error, data) {
                    if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/html;;charset=utf-8' });
                        res.write(data);
                        res.end();
                        console.log("send index");
                    }
                })
            }
            else {
                fs.readFile(`.${decodeURI(req.url)}`, function (error, data) {
                    if (error) {
                        console.log(`cant find file ${decodeURI(req.url)}`.red);
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>Error 404 - file doesnt exist<h1>");
                        res.end();
                    }
                    else {
                        switch (fileEXTEN) {
                            case "css":
                                res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' });
                                break;
                            case "html":
                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                                break;
                            case "js":
                                res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });
                                break;
                            case "png":
                                res.writeHead(200, { 'Content-Type': 'image/png' });
                                break;
                            case "jpg":
                                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                                break;
                            case "mp3":
                                res.writeHead(200, { "Content-type": "audio/mpeg" });
                                break
                            default:
                                res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
                        }
                        res.write(data);
                        res.end();
                        console.log(`send file: ${decodeURI(req.url)}`.green)
                    }
                });
            }
            break;
        case "POST":
            if (req.url == "/load") {
                load(req, res)
            }
            else if (req.url == "/addToPlaylist") {
                addToPlaylist(req, res)
            }
            else if (req.url == "/reqPlaylist") {
                reqPlaylist(req, res)
            }
            else if (req.url == "/removeFromPlaylist") {
                deleteFromPlaylist(req, res)
            }
            else {
                console.log("ajax error");
                //servResponse(req, res)
            }
            break;
        default: break;
    }

})

function load(req, res) {
    var allData = "";

    req.on("data", function (data) {
        console.log("data: " + data)
        allData += data;
    })

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        console.log(finish)
        var response = {
            albums: [],
            files: []
        }
        if (finish.album) {
            console.log(finish.album);
            fs.readdir(__dirname + "/static/mp3/" + finish.album, function (err, files) {
                if (err) {
                    return console.log(err);
                }
                //
                files.forEach(function (fileName) {
                    if (fileName.split(".")[fileName.split(".").length - 1] == "mp3") {
                        console.log(fileName);
                        const stats = fs.statSync(__dirname + "/static/mp3/" + finish.album + "/" + fileName)
                        const fileSizeInBytes = stats.size
                        const fileSizeInMegabytes = fileSizeInBytes / 1000000.0
                        response.files.push(
                            {
                                name: fileName,
                                size: fileSizeInMegabytes
                            }
                        )
                    }
                });
                res.end(JSON.stringify(response, null, 4));
            });
        }
        else {
            fs.readdir(__dirname + "/static/mp3", function (err, files) {
                if (err) {
                    return console.log(err);
                }
                //
                files.forEach(function (fileName) {
                    //console.log(fileName);
                    response.albums.push(
                        {
                            name: fileName
                        }
                    )
                });
                fs.readdir(__dirname + "/static/mp3/" + response.albums[0].name, function (err, files) {
                    if (err) {
                        return console.log(err);
                    }
                    files.forEach(function (fileName) {
                        if (fileName.split(".")[fileName.split(".").length - 1] == "mp3") {
                            //console.log(fileName);
                            var stats = fs.statSync(__dirname + "/static/mp3/" + response.albums[0].name + "/" + fileName)
                            var fileSizeInBytes = stats.size
                            var fileSizeInMegabytes = fileSizeInBytes / 1000000
                            response.files.push(
                                {
                                    name: fileName,
                                    size: fileSizeInMegabytes
                                }
                            )
                        }
                    });
                    res.end(JSON.stringify(response, null, 4));
                });
            });
        }
    })

}

function addToPlaylist(req, res) {
    var allData = "";
    req.on("data", function (data) {
        console.log("data: " + data)
        allData += data;
    })

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        console.log(finish)

        serverDatabase.playlist.push(finish)

        var response = serverDatabase.playlist
        //res.writeHead(200, { 'Content-Type': 'text/plain;;charset=utf-8' });
        res.end(JSON.stringify(response));
    })

}

function deleteFromPlaylist(req, res) {
    var allData = "";
    req.on("data", function (data) {
        console.log("data: " + data)
        allData += data;
    })

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        console.log("finish:");
        console.log(finish.album)
        console.log(finish.song)
        console.log("filter:");
        //serverDatabase.playlist = serverDatabase.playlist.filter(entry => { entry.album != finish.album || entry.song != finish.song })
        serverDatabase.playlist = serverDatabase.playlist.filter(entry => entry.album != finish.album || entry.song != finish.song)

        var response = serverDatabase.playlist
        //res.writeHead(200, { 'Content-Type': 'text/plain;;charset=utf-8' });
        res.end(JSON.stringify(response));
    })
}

function reqPlaylist(req, res) {
    res.end(JSON.stringify(serverDatabase.playlist));
}

// function servResponse(req, res) {
//     var allData = "";
//     req.on("data", function (data) {
//         console.log("data: " + data)
//         allData += data;
//     })

//     req.on("end", function (data) {
//         var finish = qs.parse(allData)
//         console.log(finish)


//         //res.writeHead(200, { 'Content-Type': 'text/plain;;charset=utf-8' });
//         res.end(JSON.stringify(finish));
//     })

// }

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
