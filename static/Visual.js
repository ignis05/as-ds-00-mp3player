class Visual {

    constructor() {
        visual = this
        this.render()
    }

    render() {
        requestAnimationFrame(this.render.bind(this)); // bind(this) przekazuje this do metody render
        var data = music.getData()
        data = data.split(",")
        // console.log(data);
        var overlay = $("#overlay")
        $(".visualBar").remove()
        for (let i in data) {
            data[i] = ~~data[i]
        }
        let sum = data.reduce((summ, a) => summ + a)
        // console.log(sum);
        let r = 255
        let g = 255
        let b = 0
        let color = `rgb(${r},${g},${b})`
        let hist = $("<div class='historyBar'>")
        hist
            .css("height", sum / 50)
            .css("background", color)
            .css("left", $(window).width() - 20)
            .appendTo(overlay)

        Object.values(document.getElementsByClassName("historyBar")).forEach(bar => {
            let offset = bar.style.left.slice(0, -2)
            offset = offset - 20
            if (offset > 0) {
                bar.style.left = offset + "px"
            }
            else {
                bar.remove()
            }
        })
        for (let i in data) {
            let top = 20 + (25 * i)
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