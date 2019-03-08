class Visual {

    constructor() {
        visual = this
        this.render()
    }

    render() {
        requestAnimationFrame(this.render.bind(this)); // bind(this) przekazuje this do metody render
        var data = music.getData()
        data = data.split(",")
        var overlay = $("#overlay")
        $(".visualBar").remove()
        for(let i in data){
            let x = $("<div class='visualBar'>")
            x.css("width", data[i])
            x.css("left", "50%")
            x.appendTo(overlay)
        }
    }

}