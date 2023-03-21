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
    audioObjects;
    player_sequence;
    username;

    constructor() {
        // buttons
        let buttonContainer = [...document.getElementsByClassName("button-container")][0];
        this.buttons = buttonContainer.children;
        // colors
        for (const button of this.buttons) {
            let computedStyle = getComputedStyle(button);
            let original_color = computedStyle.backgroundColor;
            let lighter_color = getLighterColor(original_color);
            button_info[button.className].original_color = original_color;
            button_info[button.className].lighter_color = lighter_color;
        }
        // sounds
        this.audioObjects = {};
        for (const tone of ["c", "d", "a", "f"]) {
            let audioObject = new Audio(`tones/${tone}.wav`);
            this.audioObjects[`tones/${tone}.wav`] = audioObject;
        }
        let audioObject = new Audio("lose.wav");
        this.audioObjects["lose.wav"] = audioObject;
        // sequence
        this.sequence = [];
        this.player_sequence = [];

        // username
        const nameElement = [...document.getElementsByClassName("player-name")][0];
        nameElement.textContent = this.getPlayerName();
    }

    getPlayerName() {
        return localStorage.getItem('username') ?? 'Anonymous';
    }
    playSequence() {
        this.state = "sequence";
        let new_button = this.buttons[Math.floor(Math.random() * (this.buttons.length))];
        this.sequence.push(new_button);
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

    updateScore(new_score) {
        this.score = new_score;
        let scoreDisplay = [...document.getElementsByClassName("score")][0];
        scoreDisplay.innerHTML = new_score;
    }

    playSound(sound) {
        const audio = this.audioObjects[sound];
        // play the sound
        audio.volume = 0.4;
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    doSimonButton(button) {
        // sound
        this.playSound(`tones/${button_info[button.className].tone}.wav`);
        
        // color
        let original_color = button_info[button.className].original_color;
        let lighter_color = button_info[button.className].lighter_color;
        button.style.backgroundColor = lighter_color;
        setTimeout(() => {
            button.style.backgroundColor = original_color;
        }, 1000 * 0.3);
    }

    async sendButtonInput(button) {
        if (this.state === "player") {
            this.doSimonButton(button);
            let button_name = button.className;
            console.log(button_name);
            this.player_sequence.push(button);
            let verified = this.verifyPlayerSequence();
            if (verified) {
                if (this.player_sequence.length >= this.sequence.length) {
                    this.state = "success";
                    this.updateScore(this.sequence.length);
                    setTimeout( () => {
                        this.playSequence();
                    }, 1000);
                }
            } else {
                // lost game!
                this.state = "lost";
                // save score
                let name = this.getPlayerName();
                let score = this.score;
                console.log(`Name: ${name}, Score: ${score}`);
                const new_high = await fetch("/api/score", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        score: score,
                    })
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                });
                debugger;
                console.log(`New High Score? ${new_high ? "Yes!" : "No."}: ${JSON.stringify(new_high)}`);
                if (new_high) $("#scoreToast").toast("show");
                // do animation
                setTimeout(() => {
                    this.playSound("lose.wav");
                    let lose_animation = setInterval(() => {
                        for (const button of this.buttons) {
                            let colors = [button_info[button.className].original_color, button_info[button.className].lighter_color];
                            button.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                        }
                    }, 1000 * 0.05);
                    setTimeout(() => {
                        clearInterval(lose_animation);
                        for (const button of this.buttons) {
                            button.style.backgroundColor = button_info[button.className].original_color;
                        }
                    }, 1000 * 0.8);
                }, 1000 * 0.5);
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
        this.updateScore(0);
        setTimeout(() => {
            this.playSequence();
        }, 1000 * 0.5);
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

let closeToast = document.getElementById("closeToast");
closeToast.addEventListener("click", (event) => {
    $("#scoreToast").toast("hide");
})