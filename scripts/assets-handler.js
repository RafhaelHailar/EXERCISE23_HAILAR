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
    }
}

export class ImageAnimated {
    constructor(image_name,canvas_position,canvas_width,canvas_height,flipped) {
        let image_target = IMAGES[image_name];

        let image_source = new Image();
        image_source.src = image_target.image;

        image_source.onload = () => {
            this.image = image_source;
        }

        console.log(flipped)

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
        this.speed = image_target.speed;
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