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
        for (let i in data) {
            let top = 50 + (25 * i)
            let side = $(window).width() / 2 + 5
            let r = 255
            let g = 0
            let b = data[i]
            let color = `rgb(${r},${g},${b})`

            let left = $("<div class='visualBar'>")
            left
                .css("width", data[i])
                .css("left", side)
                .css("top", top)
                .css("background", color)
                .appendTo(overlay)

            let right = $("<div class='visualBar'>")
            right
                .css("width", data[i])
                .css("right", side)
                .css("top", top)
                .css("background", color)
                .appendTo(overlay)
        }
    }
}