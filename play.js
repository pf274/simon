const button_info = {
    "button-top-left": {
        pitch: 1,
    },
    "button-top-right": {
        pitch: 0.8,
    },
    "button-bottom-left": {
        pitch: 1.2,
    },
    "button-bottom-right": {
        pitch: 1.5,
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

function playSound(pitch) {
    const audioContext = new AudioContext();
    const audio = new Audio("tone.mp3");
    const source = audioContext.createMediaElementSource(audio);
    
    // create a PitchShift node and connect it to the audio graph
    const pitchShift = audioContext.createScriptProcessor(2048, 1, 1);
    source.connect(pitchShift);
    pitchShift.connect(audioContext.destination);
    
    // set the pitch shift parameter
    pitchShift.onaudioprocess = function(event) {
      const inputBuffer = event.inputBuffer;
      const outputBuffer = event.outputBuffer;
      for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        const inputData = inputBuffer.getChannelData(channel);
        const outputData = outputBuffer.getChannelData(channel);
        for (let i = 0; i < inputData.length; i++) {
          outputData[i] = inputData[i] * pitch;
        }
      }
    };
}

function doSimonButton(button) {
    // sound
    debugger;
    playSound(button_info[button.className].pitch);
    
    // color
    let computedStyle = getComputedStyle(button);
    let original_color = computedStyle.backgroundColor;
    let new_color = getLighterColor(original_color);
    button.style.backgroundColor = new_color;
    setTimeout(() => {
        button.style.backgroundColor = original_color;
    }, 1000 * 0.3);
}

class Game {
    buttons;
    sequence;

    constructor() {
        // buttons
        let buttonContainer = [...document.getElementsByClassName("button-container")][0];
        this.buttons = buttonContainer.children;

        this.sequence = [];
    }

    playSequence() {
        let new_button = this.buttons[Math.floor(Math.random() * (this.buttons.length))];
        this.sequence.push(new_button);
        let remaining_sequence = [...this.sequence];
        let interval = setInterval(() => {
            let button = remaining_sequence.shift();
            doSimonButton(button);
            if (remaining_sequence.length < 1) {
                clearInterval(interval);
            }
        }, 1000 * 0.4);

    }
}

const game = new Game();


let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    game.playSequence();
})