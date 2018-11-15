//Canvas
var canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

//Variables
var interval
var contador = 20
var restante

var frames = 0
var images = {
    bg1: "images/bg1.png",
    bg2: "images/bg2.png",
    logo: "images/minion_logo.png",
    banana: "images/banana.png",
    base: "images/base.png",
    minion: "images/minion1.png",
    minion2: "images/minion2.png",
    brocoli: "images/brocoli.png"
}
var audios = {
    audioJuego: "audios/marioParty.mp3",
    audioGO: "audios/gameOver.mp3"
}

var audio = new Audio()

var platanitosP1=0
var platanitosP2=0
var bananitos = []
var bananotes = []
//var bananosMalos = []
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
        ctx.font="bold 20px Arial"
        ctx.fillText("Tiempo restante: "+restante+" segundos",270,20)
    }
}

function Base(alto, base_width){
    this.x= canvas.width
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

function Platanotes(alto3){
    Base.call(this)
    this.width = 60
    this.height = 75
    this.x=canvas.width+600
    this.y = alto3
    this.image.src = images.banana

    this.draw=function(){
        this.x-=2
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function PlatanosMalos(alto4){
    Base.call(this)
    this.x=canvas.width+600
    this.y = alto2 
    this.width = 40
    this.height = 55
    this.image.src = images.brocoli

    this.draw=function(){
        this.x-=3
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function Character(src){
    Board.call(this)
    this.x = 220
    this.y = 380
    this.width = 50
    this.height = 70
    this.gravity = 3.5
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
//var bananosMalos = new PlatanosMalos()
var bases = []


//Main function
function start(){
    audio.src = audios.audioJuego
    audio.play()
    bananitos = []
    bananotes = []
    //bananosMalos = []
    var minion = new Character()
    var minion2 = new Character()
    if(!interval) interval = setInterval(update, 1000/60)
    //audio.play()
}

function update(){
    frames++
    restante = Math.floor(contador - (frames/60))
    bg1.draw()
    minion.draw()
    minion2.draw()
    minion.pisandoBase()
    minion2.pisandoBase2()
    console.log(minion.velY)
    drawBases()
    drawBananos()
    drawBananotes()
    //drawBananosMalos()
    //console.log(platanitos)
    bg1.drawPlatanitos()
    if(restante===0){
        gameOver()
    }
    console.log(frames)
}

function gameOver(){
    clearInterval(interval)
    audio.pause()
    audio.src = audios.audioGO
    audio.play()
    interval=null
    ctx.fillStyle = "white"
    ctx.font = "bold 50px Arial"
    ctx.fillText("GAME FINISHED", 200,200)
    ctx.font = "bold 20px Arial"
    ctx.fillText("Final score: " , 330,250)
    
    ctx.fillText("Jugador 1:"+platanitosP1, 310,300)
    ctx.fillText("Jugador 2:"+platanitosP2, 310,330)

    ctx.fillText("Gana: ", 310,360)
}

//Aux functions
function drawCover (){
    var img =new Image()
    var img2=new Image()
    var img3=new Image()
    var img4=new Image()
    var img5=new Image()
    img.src = images.logo
    img2.src = images.minion2
    img3.src = images.banana
    img4.src = images.base
    img5.src = images.base
    img.onload = function(){
        ctx.font= "34px Lucida"
        bg1.draw()
        ctx.fillText("Presiona 'Enter' para comenzar el juego", 140,50)
        ctx.drawImage(img, 140,150,70,90)
    }
    img2.onload = function(){
        ctx.drawImage(img2, 250,270,70,90)
    }
    img3.onload = function(){
        ctx.drawImage(img3, 400,250,40,30)
    }
    img4.onload = function(){
        ctx.drawImage(img4, 200,350,430,30)
    }
    img5.onload = function(){
        ctx.drawImage(img5, 0,235,230,30)
    }
}

//Bases
function generatingBases(alto, largo){
    if(frames%120===0){
        var alto = Math.floor((Math.random()*300+310))
        var largo = Math.floor(Math.random()*50+ base_width)
        bases.push(new Base(alto, largo))
    }
}

function drawBases(){
    generatingBases()
    for(var base of bases){
      //  bases.forEach(function(base){
            base.draw()
       // })
    }
}

//Bananas chicas
function generatingBananos(alto2){
    if(frames%150===0){
        var alto2 = Math.floor((Math.random()*100+290))
        bananitos.push(new Platanitos(alto2))
    }
}

function drawBananos(){
    generatingBananos()
    //for(var bananito of bananitos){
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
    //}
}

//Bananas grandes
function generatingBananotes(alto3){
    if(frames%290===0){
        var alto3 = Math.floor((Math.random()*100+250))
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

//Bananos malas
function generatingBananosMalos(alto4){
    if(frames%190===0){
        var alto4 = Math.floor((Math.random()*100+290))
        bananosMalos.push(new PlatanosMalos(alto4))
    }
}

function drawBananosMalos(){
    generatingBananosMalos()
    //for(var bananito of bananitos){
        bananosMalos.forEach(function(bananoMalo, index){
            bananoMalo.draw()
            if(minion.minionGetsTheBanana(bananoMalo)){
                platanitosP1-=3
                bananosMalos.splice(index,1)
            }
            if(minion2.minionGetsTheBanana(bananoMalo)){
                platanitosP2-=3
                bananosMalos.splice(index,1)
            }
        })
    //}
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

function groundedCheck2(minion2, base){
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
    addEventListener('keydown', function(e){
        switch(e.keyCode){
            case 38:
                if(!minion.jumping){
                    minion.y-=155
                    minion.jumping===true
                }
                break
            default:
                break
        }
    })

    //Down
    addEventListener('keydown', function(e){
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

    //Right
    addEventListener('keydown', function(e){
        switch(e.keyCode){
            case 39:
                minion.x+=100
                break
            default:
            break
        }
    })
    
    //Left
    addEventListener('keydown', function(e){
        switch(e.keyCode){
            case 37:
                minion.x-=100
                break
            default:
            break
        }
    })


//Minion 2
    //Jump
    addEventListener('keydown', function(e){
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
    addEventListener('keydown', function(e){
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

    //Right
    addEventListener('keydown', function(e){
        switch(e.keyCode){
            case 68:
                minion2.x+=100
                break
            default:
            break
        }
    })
    
    //Left
    addEventListener('keydown', function(e){
        switch(e.keyCode){
            case 65:
                minion2.x-=100
                break
            default:
            break
        }
    })

drawCover()