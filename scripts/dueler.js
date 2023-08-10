import { Attacks } from "./attacks.js";
import { ImageAnimated } from "./assets-handler.js";

export class Dueler {
    constructor(position,width,height,color,attack_velocity,flipped) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.attack_velocity = attack_velocity;
        this.attacks = new Attacks();
        this.attacking_time_current = 0;
        this.attacking_time_end = 100;
        this.attacking_allowed = false;
        this.flipped = flipped;
        this.animated_image = new ImageAnimated(
            "monkey_attack",
            this.position,
            this.width,
            this.height,
            !flipped
        );
    }

    prepare_to_shoot() {
        if (this.attacking_allowed) return;
        if (this.attacking_time_current >= this.attacking_time_end) {
            
            this.attacking_allowed = true;
            this.attacking_time_current = 0;
        } else {
           

            this.attacking_time_current++;
        }
    }

    draw(context) {
        this.attacks.draw(context);
        this.animated_image.draw(context);
    }

    shoot() {
        if (!this.attacking_allowed) return;

        this.attacks.add(
            {
                x : this.position.x + (this.attack_velocity < 0 ?  -this.width * 0.2 : this.width * 0.2),
                y : this.position.y +  this.height * 0.4 ,
            },
            this.width * 0.4,
            this.height * 0.4,
            this.attack_velocity,
            this.flipped
        )

        
        this.attacking_allowed = false;

    }

    update(canvas) {
        this.prepare_to_shoot();
        this.attacks.update(canvas);
    }
}