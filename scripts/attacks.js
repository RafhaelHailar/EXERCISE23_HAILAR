import { get_type_winner , is_collide_to , new_loop } from "./utility.js";
import { ImageAnimated } from "./assets-handler.js";

class Attack {
    constructor(type,position,width,height,velocity,flipped) {
        this.type = type;
        this.position = position;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.animated_image = new ImageAnimated(
            type + "_hand",
            this.position,
            this.width,
            this.height,
            flipped
        );
    }  

    remove() {
        let sources = [
            "assets/destroy_scissors.wav",
            "assets/destroy_rock.wav",
            "assets/destroy_paper.wav",
            "assets/enemy_destroy_rock.wav",
            "assets/enemy_destroy_scissors.wav",
            "assets/enemy_destroy_paper.wav"
        ];
        let src = sources[Math.floor(Math.random() * sources.length)];
        let audio = new Audio();
        audio.src = src;
        audio.playbackRate = 2;
        audio.play();
        this.to_remove = true;
    }

    is_to_remove() {
        return this.to_remove;
    }

    collide_to(object) {
        return is_collide_to(this,object);
    }

    draw(context) {
       /*  let color;
        switch (this.type) {
            case "paper" :
                color = "blue";
                break;
            case "scissors" :
                color = "red";
                break;
            case "rock" :
                color = "green";
                break;
            default :
                color = "black"
        }

        context.fillStyle = color;
        context.fillRect(this.position.x,this.position.y,this.width,this.height); */
        this.animated_image.draw(context);
    }

    update() {
        this.position.x += this.velocity;
    }
}


export class Attacks {
    constructor() {
        this._attacks = [];
        this.type = "paper";
    }  

    get_data() {
        return this._attacks;
    }

    change_type(type) {
        this.type = type;
    }

    add(position,width,height,velocity,flipped) {
        let attack = new Attack(
            this.type,
            position,
            width,
            height,
            velocity,
            flipped
        )

        this._attacks.push(attack);
    }

    collide_to(object,callback) {
        if (object.length != undefined) {
            new_loop(this._attacks.length,i => {

                let attack = this._attacks[i];

                new_loop(object.length,function(j) {

                    let obj = object[j];
            
                    if (!attack.collide_to(obj)) return;

                    let winner = get_type_winner(attack,obj);

                    if (winner == attack) {
                        obj.remove();
                    }
                    else if (winner == obj) {

                        attack.remove();
                    }
                                
                });
            });
        } else {
            new_loop(this._attacks.length,i => {

                let attack = this._attacks[i];

                if (attack.collide_to(object)) {
                    attack.remove();
                    callback();
                }
            });
        }
    }   

    remove(attack) {
        this.remove_attacks.push(attack);
    }

    restart_remove() {
        this.remove_attacks = [];
    }

    finalized_remove() {
        for (let i = 0;i < this.remove_attacks.length;i++) {
            let index = this._attacks.indexOf(this.remove_attacks[i]);
            this._attacks.splice(index,1);
        }
    }

    draw(context) {
        for (let i = 0;i < this._attacks.length;i++) {
            this._attacks[i].draw(context);
        }
    }

    update(canvas) {
        this.restart_remove();
        for (let i = 0;i < this._attacks.length;i++) {
            let attack = this._attacks[i];
            if (attack.x - attack.width < 0 || attack.x > canvas.width || attack.is_to_remove()) {
                this.remove(attack);
            }
            this._attacks[i].update();
        }
        this.finalized_remove();
    }
}
