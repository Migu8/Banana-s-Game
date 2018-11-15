//Canvas
var canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

//Variables
var interval
var contador = 60

var frames = 0
var images = {
    bg1: "./images/bg1.png",
    bg2: "images/bg2.png",
    logo: "images/minion_logo.png",
    banana: "images/banana.png",
    base: "images/base.PNG",
    minion: "./images/minion1.png",
    minion2: "./images/minion2.png"
}
var audios = {
    audioJuego: "./audios/flauta.mp3",
    audioGO: "./audios/gameOver.mp3"
}

var audio = new Audio()


var platanitosP1=0
var platanitosP2=0
var bases = [
    {
        //Aquí va la primer base
    }
]
var bananitos = []
var bananotes = []
var base_height = 20
var base_width = 300

//Clases
function Board(){
    this.x=0
    this.y=0
    this.width = canvas.width
    this.height = canvas.height
    this.image = new Image()
    this.image.src = images.bg1
    
    this.draw = function(){
        this.x--
        if(this.x < -this.width) this.x=0
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x+this.width, this.y, this.width, this.height)
    }

    this.drawPlatanitos = function(){
        ctx.fillStyle="white"
        ctx.font="bold 25px Arial"
        ctx.fillText("Jugador 1: "+platanitosP1, 30,20)
        ctx.font="bold 25px Arial"
        ctx.fillText("Jugador 2: "+platanitosP2, 630,20)
        ctx.font="bold 25px Arial"
        ctx.fillText("Tiempo restante: "+contador,310,20)
    }
}

function Base(alto, base_width){
    this.x=canvas.width
    this.y = alto
    this.width = base_width
    this.height = 25
    this.image = new Image()
    this.image.src = images.base
    
    this.draw=function(){
        this.x--
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function Platanitos(alto2){
    Base.call(this)
    this.x=canvas.width+600
    this.y = alto2 
    this.width = 30
    this.height = 35
    this.image.src = images.banana

    this.draw=function(){
        this.x--
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function Platanotes(alto2){
    Base.call(this)
    this.x=canvas.width+600
    this.y = alto2 
    this.width = 60
    this.height = 75
    this.image.src = images.banana

    this.draw=function(){
        this.x--
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function Character(src){
    Board.call(this)
    this.x = 150
    this.y = 80
    this.width = 50
    this.height = 70
    this.gravity = 2
    this.grounded = false
    this.jumping = false
    this.velX=0
    this.velY=0
    this.image.src = src

    this.draw = function(){
        this.boundaries()
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    //Para que no se salga del canvas por la parte de arriba
    this.boundaries = function(){
        if(this.y <10){
            this.y =10
        }else if(this.y>(canvas.height-130)){
            this.y = (canvas.height-130)
        }else this.y+=this.gravity

        //Para que regrese al canvas
        if(this.x<canvas.x-100){
            this.x = 50
        }
    }

    this.pisandoBase= function(){
        this.grounded
        for(var i=0; i<bases.length; i++){
            var direction = groundedCheck(minion, bases[i])
            if(direction === true){
                this.velX=0
            }else if(direction=="plantado"){
                this.jumping=false
                this.grounded=true
            }else if(direction =="saltando"){
                this.velY=-3
                this.jumping=true
            }
        }
        if(this.grounded){
            this.velY=0
        }
    }

    this.pisandoBase2= function(){
        this.grounded
        for(var i=0; i<bases.length; i++){
            var direction = groundedCheck2(minion2, bases[i])
            if(direction === true){
                this.velX=0
            }else if(direction=="plantado"){
                this.jumping=false
                this.grounded=true
            }else if(direction =="saltando"){
                this.velY=-3
                this.jumping=true
            }
        }
        if(this.grounded){
            this.velY=0
        }
    }

    /*
    this.willDie = function(canvas){
        return (this.y > canvas.height-(this.height*2))
    }*/

    this.minionGetsTheBanana = function(item){
        return (this.x < item.x + item.width)&&
        (this.x + this.width > item.x)&&
        (this.y < item.y +item.height)&&
        (this.y + this.height >item.y)
    }
}

//Instancias
var bg1 = new Board()
var minion2 = new Character(images.minion2)

var minion = new Character(images.logo)
var bananitos = new Platanitos()
var bananotes = new Platanotes()
var bases = []


//Main function
function start(){
    audio.src = audios.audioJuego
    audio.play()
    bananitos = []
    bananotes = []
    var minion = new Character()
    var minion2 = new Character()
    if(!interval) interval = setInterval(update, 1000/60)
    //audio.play()
}

function update(){
    frames++
    contador -(frames/60)
    if(contador ===0){
        gameOver()
    }
    //audioJuego.play()
    ctx.clearRect(0,0,canvas.width, canvas.height)
    bg1.draw()
    minion.draw()
    minion2.draw()
    minion.pisandoBase()
    minion2.pisandoBase2()
    drawBases()
    drawBananos()
    drawBananotes()
    //console.log(platanitos)
    bg1.drawPlatanitos()
    //bg1.drawScore()
    //minionDies()
}

function gameOver(){
    clearInterval(interval)
    audio.pause()
    audio.src = audios.audioGO
    audio.play()
    interval=null
    ctx.fillStyle = "white"
    ctx.font = "bold 50px Arial"
    ctx.fillText("GAME OVER", 240,200)
    ctx.font = "bold 20px Arial"
    ctx.fillText("Final score: "+Math.floor(frames/60) , 320,250)
    ctx.fillText("Presiona enter para reiniciar", 260,300)
}

//Aux functions
function drawCover (){
    var img =new Image()
    img.src = images.logo
    img.onload = function(){
        bg1.draw()
        ctx.drawImage(img, 140,150,70,90)
        ctx.font= "32px Lucida"
        ctx.fillText("Presiona 'Enter' para comenzar", 210,50)
    }
}

//Bases
function firstBase(){
    this.x=0
    this.y=300
    bases.push(new Base())
}

function generatingBases(alto, largo){
    if(frames%80===0){
        var alto = Math.floor((Math.random()*470+210))
        var largo = Math.floor(Math.random()*50+ base_width)
        bases.push(new Base(alto, largo))
    }
}

function drawBases(){
    //firstBase()
    generatingBases()
    for(var base of bases){
        bases.forEach(function(base){
            base.draw()
        })
    }
}

//Bananas chicas
function generatingBananos(alto2){
    if(frames%90===0){
        var alto2 = Math.floor((Math.random()*190+90))
        bananitos.push(new Platanitos(alto2))
    }
}

function drawBananos(){
    generatingBananos()
    for(var bananito of bananitos){
        bananitos.forEach(function(bananito, index){
            bananito.draw()
            if(minion.minionGetsTheBanana(bananito)){
                platanitosP1++
                bananitos.splice(index,1)
            }
            if(minion2.minionGetsTheBanana(bananito)){
                platanitosP2++
                bananitos.splice(index,1)
            }
        })
    }
}

//Bananas grandes
function generatingBananotes(alto3){
    if(frames%290===0){
        var alto3 = Math.floor((Math.random()*150+90))
        bananotes.push(new Platanotes(alto3))
    }
}

function drawBananotes(){
    generatingBananotes()
    for(var bananote of bananotes){
        bananotes.forEach(function(bananote, index){
            bananote.draw()
            if(minion.minionGetsTheBanana(bananote)){
                platanitosP1+=5
                bananotes.splice(index,1)
            }
            if(minion2.minionGetsTheBanana(bananote)){
                platanitosP2+=5
                bananotes.splice(index,1)
            }
        })
    }
}

function groundedCheck(minion, base){
    var vecX = (minion.x + (minion.width/2) - (base.x + base_width/2))
    var vecY = (minion.y + (minion.height/2) - (base.y + base_height/2))

    var halfW = (minion.width/2)+(base_width/2)
    var halfH = (minion.height/2)+(base_height/2)

    var collisionD = null

    if(Math.abs(vecX)<halfW && Math.abs(vecY)<halfH){
        var offsetX = halfW - Math.abs(vecX)
        var offsetY = halfH - Math.abs(vecY)

        if(offsetX<offsetY){
            if(vecX>0){
                collisionD = "left"
                minion.x += offsetX
            }else{
                collisionD = "right"
                minion.x -= offsetX
            }
        }else{
            if(vecY>0){
                collisionD = "up"
                minion.y += offsetY
            }else{
                collisionD = "down"
                minion.y-= offsetY
            }
        }
    }
    return collisionD
}

function groundedCheck2(minion, base){
    var vecX = (minion2.x + (minion2.width/2) - (base.x + base_width/2))
    var vecY = (minion2.y + (minion2.height/2) - (base.y + base_height/2))

    var halfW = (minion2.width/2)+(base_width/2)
    var halfH = (minion2.height/2)+(base_height/2)

    var collisionD = null

    if(Math.abs(vecX)<halfW && Math.abs(vecY)<halfH){
        var offsetX = halfW - Math.abs(vecX)
        var offsetY = halfH - Math.abs(vecY)

        if(offsetX<offsetY){
            if(vecX>0){
                collisionD = "left"
                minion2.x += offsetX
            }else{
                collisionD = "right"
                minion2.x -= offsetX
            }
        }else{
            if(vecY>0){
                collisionD = "up"
                minion2.y += offsetY
            }else{
                collisionD = "down"
                minion2.y-= offsetY
            }
        }
    }
    return collisionD
}

function minionDies(){
    if(minion.willDie(canvas)){
        gameOver()
    }
}

//Listeners
//Start
addEventListener('keyup', function(e){
    switch(e.keyCode){
        case 13:
            if(interval>0) return
            //
            start()
            break
        default:
            break
    }
})


//Minion 1
    //Jump
    addEventListener('keyup', function(e){
        switch(e.keyCode){
            case 38:
                if(!minion.jumping){
                    minion.velY = -minion.jumpStrenth*2
                    minion.jumping=true
                }else{
                    minion.y-=155
                }
                break
            default:
                break
        }
    })

    //Down
    addEventListener('keyup', function(e){
        switch(e.keyCode){
            case 40:
                if(minion.grounded===true){
                    break
                }else{
                    minion.y+=100
                    break
                }
                default:
                break
        }
    })

    /*
    //PowerUp
    addEventListener('keyup', function(e){
        switch(e.keyCode){
            case 32:
                if(minion.x<500){
                    minion.x+=200
                } else minion.x=550
                break
            default:
                break
        }
    })
    */

//Minion 2
    //Jump
    addEventListener('keyup', function(e){
        switch(e.keyCode){
            case 87:
                if(!minion2.jumping){
                    minion2.velY = -minion2.jumpStrenth*2
                    minion2.jumping=true
                }else{
                    minion2.y-=155
                }
                break
            default:
                break
        }
    })

    //Down
    addEventListener('keyup', function(e){
        switch(e.keyCode){
            case 83:
                if(minion2.grounded===true){
                    break
                }else{
                    minion2.y+=100
                    break
                }
                default:
                break
        }
    })

    /*
    //PowerUp
    addEventListener('keyup', function(e){
        switch(e.keyCode){
            case 32:
                if(minion.x<500){
                    minion.x+=200
                } else minion.x=550
                break
            default:
                break
        }
    })
    */


drawCover()