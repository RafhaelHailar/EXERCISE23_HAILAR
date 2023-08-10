import { Dueler } from "./dueler.js";
import { negate_type , Timer , new_loop } from "./utility.js";
import { ImageAnimated , on_active_images } from "./assets-handler.js";

let audio = new Audio();
let audio_playing = false;
let audio_speed = 1;

let timer = 0;

let rects = [];
let buttons = [];

let curzor = {
    width : 50,
    height : 50,
    color : "black",
    image : new Image()
}
curzor.image.src = "./assets/banana_free.png";


canvas.onmousemove = function(event) {
    curzor.x = event.clientX - curzor.width / 2;
    curzor.y = event.clientY - curzor.height / 2;
/* 
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
    else curzor.color = "black"; */
}

window.onload = function() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    let width = 20;
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
                color :`hsl(${Math.round(Math.random() * 255)},100%,50%)`,
            });
        }
    }

    class Game {
        constructor (width,height) {
            this.width = width;
            this.height = height;
            this.playing = false;
            this.background = new ImageAnimated(
                "background_forest",
                {x : 0 , y : 0},
                this.width,this.height
            );
            this.player = new Dueler(
                {
                    x : this.width * 0.05,
                    y : this.height * 0.6
                },
                160,
                160,
                "red",
                2
            );
            this.enemy = new Dueler(
                {
                    x : this.width * 0.85 ,
                    y : this.height * 0.6
                },
                160,
                160,
                "blue",
                -2,
                true
            );
            this.enemy.attacking_time_end = 100;
            this.timers = [];

            this.display_types = {};
            this.display_types["paper"] = {
                x : 100,
                y : 100,
                width : 100,
                height : 100,
                active : true
            }
            
            let display_paper = new Image();
            display_paper.src = "./assets/display_paper.png";
            let display_rock = new Image();
            display_rock.src = "./assets/display_rock.png";
            let display_scissors = new Image();
            display_scissors.src = "./assets/display_scissors.png";
            this.display_types["paper"].image =display_paper;

            this.display_types["rock"] = {
                x : 100,
                y : 200,
                width : 100,
                height : 100
            }

            this.display_types["rock"].image =display_rock;

            this.display_types["scissors"] = {
                x : 200,
                y : 150,
                width : 100,
                height : 100
            }

            this.display_types["scissors"].image =display_scissors;
    
        }

        get_active_display() {
            let active = null;
            for (let type in this.display_types) {
                let target = this.display_types[type];
                if (target.active) {
                    active = target;
                    break;
                }
            }
            return active;
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
            if (!this.playing) return;

            this.background.draw(context);

            for (let type in this.display_types) {
                let {image,x,y,width,height} = this.display_types[type];
                if (this.player.attacks.type == type) {
                    let prev_active = this.get_active_display();
                    prev_active.active = false;
                    this.display_types[type].active = true;
                }
                on_active_images("display_" + type,this.display_types[type]);
                if (image)
                    context.drawImage(image,x,y,width,height);
            }

            this.enemy.draw(context);
            this.player.draw(context);

        }

        update(canvas) {
            if (!this.playing) return;

            change_enemy_attack_type();
            this.enemy.shoot();

            this.update_timers();
            this.enemy.update(canvas);
            this.player.attacks.collide_to(this.enemy.attacks.get_data());
            this.enemy.attacks.collide_to(this.player,function() {
                alert("lose")
            });
            this.player.attacks.collide_to(this.enemy,function() {
                alert("you win")
            })
            this.player.update(canvas);
        }

        start() {
            this.playing = true;

            this.add_timer(1000,function() {
                if (audio_speed < 2)
                    audio.playbackRate = audio_speed;
                else audio_speed += 0.3;
                if (game.enemy.attacking_time_end > 50)
                    game.enemy.attacking_time_end -= 10;
                if (game.player.attacking_time_end > 50)
                    game.player.attacking_time_end -= 10;
                if (game.enemy.attack_velocity > -3)
                    game.enemy.attack_velocity += -.1;
                if (game.player.attack_velocity < 3)
                    game.player.attack_velocity += .1;
            });

            audio.play();
        }
    }

    const game = new Game(canvas.width,canvas.height);
    
    

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

        game.start();
    }

    canvas.onmousedown = function() {
        curzor.active = true;

        on_active_images("banana_curzor",curzor);
    }

    canvas.onmouseup = function() {
        curzor.active = false;

        on_active_images("banana_curzor",curzor);
    }

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
        
  /*       if (rects) {
            for (let rect of rects) {
                let {position,width,height,color} = rect;
                if (game.playing) {
                    if (rect.width > 0) {
                        rect.width -= 0.7;
                    }
            
                    if (rect.height > 0) {
                        rect.height -= 0.7;
                    }   
                }    
                context.fillStyle = color;  
                context.fillRect(position.x,position.y,width,height);
            }
            if (rects.every(rect => {
                return rect.width <= 0 && rect.height <= 0;
            })) rects = null; 
        }*/


        game.draw(context);
        game.update(canvas);

        if (curzor.x && curzor.y) {
            if (curzor.image)
                context.drawImage(curzor.image,curzor.x,curzor.y,curzor.width,curzor.height);
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
    

    window.onkeydown = function(event) {
        if (event.key == "ArrowLeft") game.player.attacks.change_type("rock");
        else if (event.key == "ArrowUp") game.player.attacks.change_type("paper");
        else if (event.key == "ArrowRight") game.player.attacks.change_type("scissors");
        else if (event.key == " ") game.player.shoot();
    }   
    


}
