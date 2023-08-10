import { Timer } from "./utility.js";

const IMAGES = {
    rock_hand : {
        image : "./assets/rock_hand.png",
        frames : 3,
        width : 4770 / 3,
        height : 1590,
        speed : 20
    },
    paper_hand : {
        image : "./assets/paper_hand.png",
        frames : 4,
        width : 6360 / 4,
        height : 1590,
        speed : 20
    },
    scissors_hand : {
        image : "./assets/scissors_hand.png",
        frames : 3,
        width : 4770 / 3,
        height : 1590,
        speed : 20
    },
    monkey_body : {
        image : "./assets/monkey_body.png",
        frames : 3,
        width : 4800 / 3,
        height : 1600,
        speed : 20
    },
    monkey_attack : {
        image : "./assets/monkey_attack.png",
        frames : 3,
        width : 4800 / 3,
        height : 1600,
        speed : 20
    },
    background_forest : {
        image : "./assets/animated_forest_background.png",
        frames : 2,
        width : 3000 / 2,
        height : 750,
        speed : 60
    },
    banana_curzor : ["./assets/banana_free.png","./assets/banana_skinned.png"],
    display_paper : ["./assets/display_paper.png","./assets/display_paper_active.png"],
    display_rock : ["./assets/display_rock.png","./assets/display_rock_active.png"],
    display_scissors : ["./assets/display_scissors.png","./assets/display_scissors_active.png"]
}

let SOUND_EFFECTS = [
    "assets/destroy_scissors.wav",
    "assets/destroy_rock.wav",
    "assets/destroy_paper.wav",
    "assets/enemy_destroy_rock.wav",
    "assets/enemy_destroy_scissors.wav",
    "assets/enemy_destroy_paper.wav"
];


export function on_active_images(image_name,target) {
    let images = IMAGES[image_name];
    let image = new Image();
    if (target.active) {
        image.src = images[1];
    } else image.src = images[0];
    target.image = image;
}

export function get_random_sound_sources() {
    return SOUND_EFFECTS[Math.floor(Math.random() * SOUND_EFFECTS.length)];
}

export class ImageAnimated {
    constructor(image_name,canvas_position,canvas_width,canvas_height,flipped,speed) {
        let image_target = IMAGES[image_name];
        this.image_name = image_name;

        let image_source = new Image();
        image_source.src = image_target.image;

        image_source.onload = () => {
            this.image = image_source;
        }

        this.sprite_position = {x : 0,y : 0};
        this.sprite_width = image_target.width;
        this.sprite_height = image_target.height;
        this.canvas_position = canvas_position;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;

        this.sprite_position_current = {
            x : 0,
            y : 0
        }

        this.flipped = flipped;

        this.frames = image_target.frames;
        this.speed = speed || image_target.speed;
        this.update_sprite_position_timer = new Timer(this.speed,() => {
            if (this.sprite_position.x == this.frames - 1) this.sprite_position.x = 0;
            else this.sprite_position.x++;
        })
    }

    draw(context) {
        if (!this.image) return;
        context.save();
        context.scale(this.flipped ? -1 : 1,1);
        context.drawImage(
            this.image,
            this.sprite_position.x * this.sprite_width,
            this.sprite_position.y * this.sprite_height,
            this.sprite_width,
            this.sprite_height,
            this.flipped ? -this.canvas_width - this.canvas_position.x : this.canvas_position.x,
            this.canvas_position.y,
            this.canvas_width,
            this.canvas_height
        );
        context.restore();
        this.update_sprite_position_timer.update();
    }
}