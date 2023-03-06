const button_info = {
    "button-top-left": {
        tone: "c",
    },
    "button-top-right": {
        tone: "d",
    },
    "button-bottom-left": {
        tone: "f",
    },
    "button-bottom-right": {
        tone: "a",
    },
}

function getLighterColor(color) {
    
    // get rgb values
    let formatted_color = color.replaceAll("rgb(", "").replaceAll(")","");
    let [red, green, blue] = formatted_color.split(", ").map((value) => parseInt(value));

    // make rgb values lighter
    red = red + (250 - red) / 2;
    green = green + (250 - green) / 2;
    blue = blue + (250 - blue) / 2;

    // convert back to hex
    let lighter_color = `rgb(${red}, ${green}, ${blue})`;

    // return it
    return lighter_color;
}

class Game {
    buttons;
    sequence;
    state;
    toneObjects;
    player_sequence;

    constructor() {
        // buttons
        let buttonContainer = [...document.getElementsByClassName("button-container")][0];
        this.buttons = buttonContainer.children;
        // sounds
        this.toneObjects = {};
        for (const tone of ["c", "d", "a", "f"]) {
            let audioObject = new Audio(`tones/${tone}.wav`);
            this.toneObjects[tone] = audioObject;
        }
        // sequence
        this.sequence = [];
        this.player_sequence = [];
    }

    playSequence() {
        this.state = "play";
        let new_button = this.buttons[Math.floor(Math.random() * (this.buttons.length))];
        this.sequence.push(new_button);
        this.score = this.sequence.length;
        let remaining_sequence = [...this.sequence];
        let interval = setInterval(() => {
            let button = remaining_sequence.shift();
            this.doSimonButton(button);
            if (remaining_sequence.length < 1) {
                clearInterval(interval);
                this.player_sequence = [];
                this.state = "player";
            }
        }, 1000 * 0.4);

    }

    playSound(tone) {
        const audio = this.toneObjects[tone];
        // play the sound
        audio.volume = 0.4;
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    doSimonButton(button) {
        // sound
        this.playSound(button_info[button.className].tone);
        
        // color
        let computedStyle = getComputedStyle(button);
        let original_color = computedStyle.backgroundColor;
        let new_color = getLighterColor(original_color);
        button.style.backgroundColor = new_color;
        setTimeout(() => {
            button.style.backgroundColor = original_color;
        }, 1000 * 0.3);
    }

    sendButtonInput(button) {
        if (this.state === "player") {
            this.doSimonButton(button);
            let button_name = button.className;
            console.log(button_name);
            this.player_sequence.push(button);
            let verified = this.verifyPlayerSequence();
            if (verified) {
                if (this.player_sequence.length >= this.sequence.length) {
                    this.state = "new sequence"
                    setTimeout( () => {
                        this.playSequence();
                    }, 1000);
                }
            } else {
                // lost game!
                this.restartGame();
            }
        }
    }

    verifyPlayerSequence() {
        for (let i = 0; i < this.player_sequence.length; i++) {
            if (this.player_sequence[i].className != this.sequence[i].className) {
                return false;
            }
        }
        return true;
    }

    restartGame() {
        this.player_sequence = [];
        this.sequence = [];
        setTimeout(() => {
            this.playSequence();
        }, 1000 * 2);
    }
}

const game = new Game();


let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    game.restartGame();
})

let buttonContainer = [...document.getElementsByClassName("button-container")][0];
let buttons = buttonContainer.children;

for (const button of buttons) {
    button.addEventListener("click", (event) => {
        game.sendButtonInput(event.currentTarget);
    })
}