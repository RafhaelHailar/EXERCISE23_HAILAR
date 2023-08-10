class DisplayText {
    constructor() {

    }
}

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