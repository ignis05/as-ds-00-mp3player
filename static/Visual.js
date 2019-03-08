class Visual {

    constructor() {
        visual = this
        this.render()
    }

    render() {
        requestAnimationFrame(this.render.bind(this)); // bind(this) przekazuje this do metody render
        $("#overlay").html(music.getData()) // wyświetlenie danych audio w div-ie
    }

}