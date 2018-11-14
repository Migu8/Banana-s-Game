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
    minion: "./images/minion1.png"
}

var platanitos=0
var bases = [
    {

    }
]
var bananitos = []
var base_height = 20
var base_width =350
//var friction = 0.8
//var gravity = 0.7

//Clases
function Board(){
    this.x=0
    this.y=0
    this.width = canvas.width
    this.height = canvas.height
    this.image = new Image()
    this.image.src = images.bg1
    //this.jumping = false
    

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
}

function Base(width){
    this.x=canvas.width
    this.y = 400
    this.width = base_width
    this.height = 25
    this.image = new Image()
    this.image.src = images.base
    
    this.draw=function(){
        this.x-=0.7
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function Platanitos(){
    Base.call(this)
    this.x=canvas.width+600
    this.y = 300
    this.width = 30
    this.height = 35
    this.image.src = images.banana

    this.draw=function(){
        this.x-=2
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function Character(){
    Board.call(this)
    this.x = 350
    this.y = 50
    this.width = 50
    this.height = 70
    this.gravity = 1.7
    this.grounded = false
    this.jumping = false
    this.velX=0
    this.velY=0
    /*
    var velX = 0
    var velY = 0
    jumping: false
    jumpStrenth: 8
    */
    this.image.src = images.logo

    this.draw = function(){
        this.boundaries()
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    //Para que no se salga del canvas por la parte de arriba
    this.boundaries = function(){
        if(this.y <10){
            this.y =10
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
                this.velY=-1
                this.jumping=true
            }
        }
        if(this.grounded){
            this.velY=0
        }
    }

    this.willDie = function(canvas){
        //Si toca el canvas.height -30, muere
        //console.log(this.y)
        //console.log(item.height)
        return (this.y > canvas.height-(this.height*2))
        //return(this.y<canvas.height-100)
    }

    this.minionGetsTheBanana = function(item){
        return (this.x < item.x + item.width)&&
        (this.x + this.width > item.x)&&
        (this.y < item.y +item.height)&&
        (this.y + this.height >item.y)
        //Opción 2
        /*
        return (this.x < item.x + item.width)&&
        //(this.x + this.width > item.x)&&
        //(this.y < item.y +item.height)&&
        (this.y+(this.height/2) === item.y+(item.height/2))
        */
    }
}

//Instancias
var bg1 = new Board()
var minion = new Character()
var bases = new Base()
var bananitos = new Platanitos()

//Main function
function start(){
    bases = []
    bananitos = []
    frames =0
    var minion = new Character()
    if(!interval) interval = setInterval(update, 1000/60)
}

function update(){
    frames++
    ctx.clearRect(0,0,canvas.width, canvas.height)
    bg1.draw()
    minion.draw()
    minion.pisandoBase()
    drawBases()
    drawBananos()
    console.log(platanitos)
    //console.log(minion.jumping)
    //checkMinionGetsBanana()
    bg1.drawPlatanitos()
    bg1.drawScore()
    //groundedCheck()
    //willDie()
    minionDies()
    console.log(bases)
}

function gameOver(){
    clearInterval(interval)
    interval=null
    ctx.fillStyle = "red"
    ctx.font = "bold 50px Arial"
    ctx.fillText("GAME OVER", 50,200)
}

/*
function BananasPickedUp(){
    platanitos++
}
*/

//Aux functions
function drawCover (){
    var img =new Image()
    img.src = images.logo
    img.onload = function(){
        bg1.draw()
        ctx.drawImage(img, 140,150,70,90)
        ctx.font= "32px Lucida"
        ctx.fillText("Presiona 'S' para comenzar", 210,50)
    }
}

//Bases
function generatingBases(){
    //ctx.fillStyle="darkblue"
    //ctx.fillRect(x=0, y=canvas.height-200, width=base_width, height=base_height)
    if(frames%60===0){
        var width = Math.floor(Math.random()*100)
        //var gap = Math.floor(Math.random()*100+360)
        bases.push(new Base(width))
    }
}

function drawBases(){
    generatingBases()
    for(var base of bases){
        bases.forEach(function(base){
            base.draw()
        })
    }
}

//Bananas
function generatingBananos(){
    //ctx.fillStyle="darkblue"
    //ctx.fillRect(x=0, y=canvas.height-200, width=base_width, height=base_height)
    if(frames%250===0){
        //var gap = Math.floor(Math.random()*100+360)
        bananitos.push(new Platanitos())
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

/*
function checkMinionGetsBanana(minion){
    for (var bananito of bananitos){
        if(minion.minionGetsTheBanana(bananito)){
            //bananitos.splice(item,1)
            BananasPickedUp()
        }
    }
}
*/

//Listeners
addEventListener('keyup', function(e){
    switch(e.keyCode){
        case 83:
            if(interval>0) return
            start()
            break
        default:
            break
    }
})

addEventListener('keyup', function(e){
    switch(e.keyCode){
        case 32:
            /*
            if(!minion.jumping){
                minion.velY = -minion.jumpStrenth*2
                minion.jumping=true
            }
            */
            minion.y-=155
            break
        default:
            break
    }
})

addEventListener('keyup', function(e){
    switch(e.keyCode){
        case 40:
            if(minion.grounded===true){
                minion.y=minion.y
            }else{
                minion.y+=100
                break
            }

        default:
            break
    }
})


drawCover()