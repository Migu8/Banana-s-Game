//Canvas
var canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

//Variables
var interval
var frames = 0
var images = {
    bg1: "./images/bg1.png",
    bg2: "images/bg2.png",
    logo: "images/minion_logo.png",
    banana: "images/banana.png",
    gaspa: "images/gasparin.png",
    base: "images/base.PNG",
    power: "images/powerJump.png",
    minion: "./images/minion1.png",
    minion2: "./images/minion2.png"
}
var audios = {
    audioJuego: "./audios/flauta.mp3",
    audioGO: "./audios/gameOver.mp3"
}

var audio = new Audio()


var platanitos=0
var bases = [
    {
        //Aquí va la primer base
    }
]
var bananitos = []
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
        ctx.fillText("Platanitos: "+platanitos, 630,20)
    }

    this.drawScore = function(){
        ctx.font = "bold 24px Avenir"
        ctx.fillText("Score: "+ Math.floor(frames/60), 20,20)
    }

    this.drawPowerUps = function(){

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
        this.x-=0.6
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
        this.x-=2
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function PowerUps(){

}

function Character(src){
    Board.call(this)
    this.x = 150
    this.y = 80
    this.width = 50
    this.height = 70
    this.gravity = 3
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
        }else if(frames<500){
            this.y === this.y
        }else this.y +=this.gravity
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

    this.willDie = function(canvas){
        return (this.y > canvas.height-(this.height*2))
    }

    this.minionGetsTheBanana = function(item){
        return (this.x < item.x + item.width)&&
        (this.x + this.width > item.x)&&
        (this.y < item.y +item.height)&&
        (this.y + this.height >item.y)
    }
}

//Instancias
var bg1 = new Board()
//Si el usuario presiona jugar para 2, crea la siguiente instancia
//de lo contrario, sólo crea la a minion
var minion2 = new Character(images.minion2)

var minion = new Character(images.logo)
var bananitos = new Platanitos()
var bases = []


//Main function
function start(){
    audio.src = audios.audioJuego
    audio.play()
    bananitos = []
    frames =0
    var minion = new Character()
    if(!interval) interval = setInterval(update, 1000/60)
    //audio.play()
}

function update(){
    frames++
    //audioJuego.play()
    ctx.clearRect(0,0,canvas.width, canvas.height)
    bg1.draw()
    minion.draw()
    minion2.draw()
    minion.pisandoBase()
    drawBases()
    drawBananos()
    console.log(platanitos)
    bg1.drawPlatanitos()
    bg1.drawScore()
    minionDies()
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

function generatingBases(){
    if(frames%80===0){
        var alto = Math.floor((Math.random()*70+300))
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

//Bananas
function generatingBananos(){
    if(frames%250===0){
        var alto2 = Math.floor((Math.random()*70+250))
        bananitos.push(new Platanitos(alto2))
    }
}

function drawBananos(){
    generatingBananos()
    for(var bananito of bananitos){
        bananitos.forEach(function(bananito, index){
            bananito.draw()
            if(minion.minionGetsTheBanana(bananito)){
                platanitos++
                bananitos.splice(index,1)
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


drawCover()