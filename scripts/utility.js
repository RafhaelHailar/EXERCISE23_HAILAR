let types = [ "rock" , "paper" , "scissors"];


export function is_collide_to(a,b) {
    return !(
       ( a.position.x + a.width < b.position.x ) ||
       ( a.position.x > b.position.x + b.width ) ||
       ( a.position.y + a.height < b.position.y ) ||
       ( a.position.y > b.position.y + b.height) 
    );
}

export function get_type_winner(a,b) {
    let a_type = types.indexOf(a.type);
    let b_type = types.indexOf(b.type);
    let result;

    switch (a_type) {
        case 0 :
            switch (b_type) {
                case 1 :
                    result = b;
                    break;
                case 2 :
                    result = a;
            }
            break;
        case 1 :
            switch (b_type) {
                case 0 :
                    result = a;
                    break;
                case 2 :
                    result = b;
            }
            break;
        case 2 :
            switch (b_type) {
                case 1 :
                    result = a;
                    break;
                case 0 :
                    result = b;
            }
            break;
    } 

    return result;
}

export function negate_type(type) {
    let type_index = types.indexOf(type);
    
    return types[(type_index + 1) % 3];
}

export function new_loop(length,action) {
    for (let i = 0;i < length;i++) {
        action(i);
    }
}

export class Timer {
    constructor(target_time,callback) {
        this.current_time = 0;
        this.target_time = target_time;
        this.callback = callback;
    }

    update() {
        if (this.current_time >= this.target_time) {
            this.callback();
            this.current_time = 0;
        } else this.current_time++;
    }
}