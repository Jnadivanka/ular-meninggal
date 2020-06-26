const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

const rockImg = new Image();
rockImg.src = "img/rock.png";

const enemyImg = new Image();
enemyImg.src = "img/enemy.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the rock
let rock = [];

for (let index = 0; index < 10; index++) {
    let posisi = {
        x : Math.floor(Math.random()*17+1) * box,
        y : Math.floor(Math.random()*15+3) * box
    }
    rock[index] = posisi ;
}
console.log(rock);
// create an enemy 
let enemy = [];
for (let index = 0; index < 2; index++) {
    let posisielang = {
        x : Math.floor(Math.random()*17+1) * box,
        y : Math.floor(Math.random()*15+3) * box
    }
    enemy[index] = posisielang ;
    console.log(enemy);
}

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener("keydown",direction);

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// refresh page

function refresh(){
    alert("MENINGGAAAAALLL");
    location.reload(true);
}
// draw everything to the canvas

function draw(){
    
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "gold" : "gold";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
 
    
    ctx.drawImage(foodImg, food.x, food.y);
    for (let index = 0; index < rock.length; index++) {
        ctx.drawImage(rockImg, rock[index]["x"], rock[index]["y"]);
    }

    for (let index = 0; index < enemy.length; index++) {
        ctx.drawImage(enemyImg, enemy[index]["x"], enemy[index]["y"]);        
    }
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        for (let index = 0; index < enemy.length; index++) {
            let posisielang = {
                x : Math.floor(Math.random()*17+1) * box,
                y : Math.floor(Math.random()*15+3) * box
            }
            enemy[index] = posisielang ;
                 
        }
        
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }

    //fix bug nyelempet
    for (let index = 0; index < rock.length; index++) {
        if (food.x == rock[index]["x"] && food.y == rock[index]["y"]) {
            food = {
                x : Math.floor(Math.random()*17+1) * box,
                y : Math.floor(Math.random()*15+3) * box
            }
         
        }
   }
    
    // add new Head
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over hit by rock
    for (let index = 0; index < rock.length; index++) {
         if (snakeX == rock[index]["x"] && snakeY == rock[index]["y"]) {
            clearInterval(game);
            dead.play();
            setTimeout(refresh, 500);    
         }
    }
    // game over hit by enemy

    for (let index = 0; index < enemy.length; index++) {
        if(snakeX == enemy[index]["x"] && snakeY == enemy[index]["y"]){
            clearInterval(game);
            dead.play();
            setTimeout(refresh, 500);
        }
    }
    


    // game over hit by wall
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        dead.play();
        setTimeout(refresh, 500);
    }
    
    
    snake.unshift(newHead);
    
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// call draw function every 200 ms

let game = setInterval(draw,200);