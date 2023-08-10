import { Dueler } from "./dueler.js";
import { negate_type , Timer , new_loop } from "./utility.js";

let audio = new Audio();
let audio_playing = false;
let audio_speed = 1;

let timer = 0;

let rects = [];
let buttons = [];
function createButton(text,position,width,height,action) {
    let button = {
        text,
        position,
        width,
        height,
        action
    }

    buttons.push(button);
}

let curzor = {
    width : 50,
    height : 50,
    color : "black"
}


canvas.onmousemove = function(event) {
    curzor.x = event.clientX - curzor.width / 2;
    curzor.y = event.clientY - curzor.height / 2;

    for (let i = 0;i < buttons.length;i++) {
        buttons[i].width = 100;
    }
    if (buttons.some(
        function(button) {
            if (
                curzor.x + curzor.width >= button.position.x - button.width / 2 &&
                curzor.x < button.position.x - button.width / 2 + button.width &&
                curzor.y + curzor.height >= button.position.y - button.height / 2 &&
                curzor.y < button.position.y - button.height / 2 + button.height
            ) {
                button.width = 500;
                return true;
            } else return false;
        }
    )) curzor.color = "red";
    else curzor.color = "black";
}

canvas.onclick = function(event) {
    if (!audio_playing) {
        audio.src = "assets/bg-music.wav";
        audio.loop = true;
        audio_playing = true;
    }

    for (let i = 0;i < buttons.length;i++) {
        let button = buttons[i];
        if (
            curzor.x + curzor.width >= button.position.x - button.width / 2 &&
            curzor.x < button.position.x - button.width / 2 + button.width &&
            curzor.y + curzor.height >= button.position.y - button.height / 2 &&
            curzor.y < button.position.y - button.height / 2 + button.height
        ) button.action();
    }
}

window.onload = function() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    /* let width = 20;
    let height = 20;
    for (let y = 0;y < canvas.height / width;y++) {
        for (let x = 0;x < canvas.width / height;x++) {
            rects.push({
                position : {
                    x : x * width,
                    y : y * height
                },
                width,
                height,
                color : "black", /* `hsl(${Math.round(Math.random() * 255)},100%,50%)`, 
                scale : 1
            });
        }
    }
 */
    class Game {
        constructor (width,height) {
            this.width = width;
            this.height = height;
            this.player = new Dueler(
                {
                    x : 100,
                    y : this.height - 180
                },
                160,
                160,
                "red",
                2
            );
            this.enemy = new Dueler(
                {
                    x : this.width - 240,
                    y : this.height - 180
                },
                160,
                160,
                "blue",
                -2,
                true
            );
            this.enemy.attacking_time_end = 200;
            this.timers = [];
        }

        add_timer(target_time,callback) {
            this.timers.push(new Timer(target_time,callback))
        }

        update_timers() {
            new_loop(this.timers.length,i => {
                this.timers[i].update();
            })
        }

        draw(context) {
            this.enemy.draw(context);
            this.player.draw(context);
        }

        update(canvas) {
            this.update_timers();
            this.enemy.update(canvas);
            this.player.attacks.collide_to(this.enemy.attacks.get_data());
            /* this.enemy.attacks.collide_to(this.player,function() {
                alert("lose")
            }); */
            this.player.update(canvas);
        }
    }

    const game = new Game(canvas.width,canvas.height);

    function change_enemy_attack_type() {
        let player_attacks = game.player.attacks.get_data();
        if (player_attacks.length == 0) return;
        let attack = player_attacks[0];
        game.enemy.attacks.change_type(negate_type(attack.type));
    }

    function update() {
        context.clearRect(0,0,canvas.width,canvas.height);
    
        for (let button of buttons) {
            let {text,position,width,height} = button;
            context.fillStyle = "black";
            context.fillRect(position.x - width / 2,position.y - height /  2,width,height);
            let fontS = width / text.length;
            context.fillStyle = "white";
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.font = fontS + "px " +  "Courier";
            context.fillText(text,position.x,position.y);
        }
    
        for (let rect of rects) {
            let {position,width,height,color,scale} = rect;
            context.save();
            context.scale(rect.scale,rect.scale);
            context.fillStyle = color;  
            context.fillRect(position.x,position.y,width,height);
            context.restore();
            if (rect.width > 0) {
                rect.width -= 0.7;
            }
    
            if (rect.height > 0) {
                rect.height -= 0.7;
            }       
        }
    
        if (curzor.x && curzor.y) {
            context.fillStyle = curzor.color;
            context.fillRect(curzor.x,curzor.y,curzor.width,curzor.height);
        }

        game.draw(context);
        game.update(canvas);

        change_enemy_attack_type();
        game.enemy.shoot();
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    window.onkeydown = function(event) {
        if (event.key == "ArrowLeft") game.player.attacks.change_type("rock");
        else if (event.key == "ArrowUp") game.player.attacks.change_type("paper");
        else if (event.key == "ArrowRight") game.player.attacks.change_type("scissors");
        else if (event.key == " ") game.player.shoot();
    }

    createButton("Hello",{
        x : canvas.width / 2,
        y : canvas.height / 2
    },100,100,function() {
        alert("HIT")
    });
    
    createButton("ROCK",{
        x : 100,
        y : 100
    },100,100,function() {
       /*  alert("ROCK"); */
        if (!audio.paused && audio_playing) audio.pause();
        else {
            audio.play();
        }
    });
    
    createButton("PAPER",{
        x : canvas.width - 200,
        y : 100
    },100,100,function() {
        alert("PAPER")
    });
     
    createButton("SCISSOR",{
        x : canvas.width / 2,
        y : 100
    },100,100,function() {
        alert("SCISSOR")
    });
     
    createButton("In",{
        x : 100,
        y : canvas.height / 2
    },100,100,function() {
        alert("SCISSOR")
    });
     
    
    game.add_timer(1000,function() {
        if (audio_speed < 2)
            audio.playbackRate = audio_speed;
        else audio_speed += 0.3;
        game.enemy.attacking_time_end -= 10;
        game.enemy.attack_velocity += -.1;
        game.player.attack_velocity += 1;
    })
}
