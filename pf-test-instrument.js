// This is a temporary solution:
// In MSFS the BaseInstrument class exists, so we can use that as the parent (required by the SDK),
// but in the browser, it doesn't exist, so we are using an empty parent class.
// Obviously this useless indirection should be removed from the shipped solution,
// it is only for easier browser testing.
let isMsfs = (typeof (BaseInstrument) === "function");

let GlassCockpitParent = isMsfs ? BaseInstrument : class {

    // empty functions just for the super() calls 
    constructor() { }
    Init() { }
    connectedCallback() { }
    Update() { }
};

class PfTestInstrument extends GlassCockpitParent {
    #attitudeIndicatorButton;
    #statusPageButton;
    #statusContainer;
    #pitchLine;
    #attitudeCircle;
    #horizontLinesAndText;
    #backgroundDefs;
    #backgroundGroup;
    #leftFlap;
    #leftLine;
    #rightLine;
    #rightFlap;
    #leftGasSlider;
    #rightGasSlider;
    #leftGasValue;
    #rightGasValue;
    #loading;
    #loadingRightFlap;
    constructor() {
        super();

        // Not safe to call getElementById here in MSFS, only in connectedCallback()
    }

    get templateID() {
        return "PF-TEST-INSTRUMENT";
    }

    get isInteractive() {
        return true;
    }

    onInteractionEvent(args) {
        console.log("click");
    }

    Init() {
        super.Init();
    }

    connectedCallback() {
        super.connectedCallback();
        this.elemPanel = document.getElementById("panel-container");
        this.#statusContainer = document.getElementById("status-container");
        this.#attitudeIndicatorButton = document.getElementById("attutideButton");
        this.#statusPageButton = document.getElementById("statusButton");
        this.#horizontLinesAndText = document.getElementsByClassName("horizont")

        //pagination
        this.#attitudeIndicatorButton.addEventListener("click", () => {
            console.log("attitude");
            this._turnOn(this.elemPanel);
            this._turnOff(this.#statusContainer);
            this.elemPanel.children[0].innerHTML = "";
            this.attitudeInit();
        })

        this.#statusPageButton.addEventListener("click", () => {
            console.log("status");
            this._turnOn(this.#statusContainer);
            this._turnOff(this.elemPanel);
            this.#statusContainer.children[0].innerHTML = "";
            this.statusInit();
        })
        //get the static elements from html here

    }


    FlapStatusInit(svg) {
        const gap = 100;
        const rect1 = svgRectCreator(SIZE_WIDTH / 8 + gap, SIZE_HEIGHT / 2 - 70, 50, 160);
        const loading = svgRectCreator(SIZE_WIDTH / 8 + gap, SIZE_HEIGHT / 2 - 70, 50, 0);
        loading.setAttribute("fill", "white")
        loading.setAttribute("id", "loading");
        const loading2 = svgRectCreator((SIZE_WIDTH / 8) * 2 + gap, SIZE_HEIGHT / 2 - 70, 50, 0);
        loading2.setAttribute("fill", "white")
        loading2.setAttribute("id", "loading");
        this.#loading = loading;
        this.#loadingRightFlap = loading2;
        this.#leftFlap = rect1;
        const rect2 = svgRectCreator((SIZE_WIDTH / 8) * 2 + gap, SIZE_HEIGHT / 2 - 70, 50, 160);
        this.#rightFlap = rect2;
        const text1 = svgTextCreator((SIZE_WIDTH / 8) * 2 + gap - 100, SIZE_HEIGHT / 2 - 120, "FLAPS")


        let leftX = this.#leftFlap.getAttribute("x");
        let leftY = this.#leftFlap.getAttribute("y");
        const line = svgLineCreator(Number(leftX), Number(leftX) + 50, Number(leftY), Number(leftY), "red", 5);
        line.setAttribute("data-value", 0);
        let rightX = this.#rightFlap.getAttribute("x");
        let rightY = this.#rightFlap.getAttribute("y");
        const line2 = svgLineCreator(Number(rightX), Number(rightX) + 50, Number(rightY), Number(rightY), "red", 5);
        line2.setAttribute("data-value", 0);
        this.#leftLine = line;
        this.#rightLine = line2;
        text1.style.fontSize = "40px";

        //appends
        svg.appendChild(rect1);
        svg.appendChild(rect2);
        svg.appendChild(loading);
        svg.appendChild(loading2);
        svg.appendChild(text1)
        svg.appendChild(line);
        svg.appendChild(line2);
    }

    GasStatusInit(svg) {
        const gap = 100;
        const gapBetweenInstrument = 200;

        const rect3 = svgRectCreator((SIZE_WIDTH / 8) * 3 + gap + gapBetweenInstrument, SIZE_HEIGHT / 2 - 70, 50, 160);
        const rect4 = svgRectCreator((SIZE_WIDTH / 8) * 4 + gap + gapBetweenInstrument, SIZE_HEIGHT / 2 - 70, 50, 160);
        const text2 = svgTextCreator((SIZE_WIDTH / 8) * 4 + gap + gapBetweenInstrument - 100, SIZE_HEIGHT / 2 - 140, "EXHAUST")
        const text3 = svgTextCreator((SIZE_WIDTH / 8) * 4 + gap + gapBetweenInstrument - 180, SIZE_HEIGHT / 2 - 100, "GAS TEMPERATURE")

        const leftGas = svgTextCreator((SIZE_WIDTH / 8) * 3 + gap + gapBetweenInstrument, SIZE_HEIGHT / 2 + 120, "0 C˙")
        const rightGas = svgTextCreator((SIZE_WIDTH / 8) * 4 + gap + gapBetweenInstrument, SIZE_HEIGHT / 2 + 120, "0 C˙")

        text2.style.fontSize = "30px";
        text3.style.fontSize = "30px";
        leftGas.style.fontSize = "20px";
        rightGas.style.fontSize = "20px";

        this.#leftGasValue = leftGas;
        this.#rightGasValue = rightGas;
        this.#leftGasSlider = rect3;
        this.#rightGasSlider = rect4;
        svg.appendChild(leftGas);
        svg.appendChild(rightGas);
        svg.appendChild(rect3);
        svg.appendChild(rect4);
        svg.appendChild(text2);
        svg.appendChild(text3);

    }
    statusInit() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", SIZE_WIDTH);
        svg.setAttribute("height", SIZE_HEIGHT);
        svg.style.backgroundColor = "black"

        //appends
        this.FlapStatusInit(svg);
        this.GasStatusInit(svg);
        this.#statusContainer.children[0].appendChild(svg);
    }
    attitudeInit() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", SIZE_WIDTH);
        svg.setAttribute("height", SIZE_HEIGHT);

        const backgroundGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

        //lineár gradien, hogy a fele az ég legyen, fele a "föld"
        const definitions = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
        linearGradient.setAttribute("id", "half");
        linearGradient.setAttribute("x1", "0%");
        linearGradient.setAttribute("x2", "0%");
        linearGradient.setAttribute("y1", "100%")
        linearGradient.setAttribute("y2", "0%")

        //első szín
        const firstColor = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        firstColor.setAttribute("offset", "50%");
        firstColor.setAttribute("stop-color", "#663300");
        linearGradient.appendChild(firstColor);

        //második
        const secondColor = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        secondColor.setAttribute("offset", "50%");
        secondColor.setAttribute("stop-color", "#00ccff");
        linearGradient.appendChild(secondColor);

        definitions.appendChild(linearGradient);
        this.#backgroundDefs = definitions;
        svg.appendChild(definitions);
        // Vízszintes vonal létrehozása
        const line = svgLineCreator(SIZE_WIDTH / 3 + 120, SIZE_WIDTH - SIZE_WIDTH / 3 - 120, SIZE_HEIGHT / 2, SIZE_HEIGHT / 2, "yellow", 10);
        //téglalap létrehozása hogy látszódjon a háttérszín
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", SIZE_WIDTH * 4);
        rect.setAttribute("height", SIZE_HEIGHT);
        rect.setAttribute("fill", "url(#half)");
        backgroundGroup.appendChild(rect);

        svg.appendChild(backgroundGroup)
        this.#backgroundGroup = backgroundGroup;

        const centerX = SIZE_WIDTH / 2;
        const centerY = SIZE_HEIGHT / 2;
        const radius = SIZE_WIDTH * 0.37;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${centerX - radius},${centerY} A ${radius},${radius} 0 0,1 ${centerX + radius},${centerY}`;
        path.setAttribute("d", d);
        path.setAttribute("fill", "none"); // Kitöltés nélküli
        path.setAttribute("stroke", "white"); // Fekete körvonal
        path.setAttribute("stroke-width", "5");

        svg.appendChild(path);
        const angles = [150, 120, 90, 30, 60]; // negative for left side, positive for right side
        const tickLength = -30;

        angles.forEach(deg => {
            // Convert degree to radians
            const angle = (deg * Math.PI) / 180;

            // Tick start points (upper half of the circle)
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY - Math.sin(angle) * radius;

            if (deg !== 90) {
                const x2 = centerX + Math.cos(angle) * (radius - tickLength);
                const y2 = centerY - Math.sin(angle) * (radius - tickLength);
                const line = svgLineCreator(x1, x2, y1, y2, "white", 5);
                svg.appendChild(line);
            }
            else {
                const x2 = centerX + Math.cos(angle) * (radius + tickLength);
                const y2 = centerY - Math.sin(angle) * (radius + tickLength);
                const line = svgLineCreator(centerX - 20, centerX + 20, y1 + 40, y1 + 40, "yellow", 5);
                const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                triangle.setAttribute("points", `${centerX},${y1 + 5} ${centerX - 20},${y1 + 35} ${centerX + 20},${y1 + 35}`); // háromszög csúcsai
                triangle.setAttribute("fill", "yellow"); // kitöltő szín
                triangle.setAttribute("stroke-width", "2"); // körvonal vastagsága

                // Add hozzá a háromszöget az SVG-hez
                svg.appendChild(triangle);
                svg.appendChild(line);
                this.#attitudeCircle = line
            }


        });
        const totalLines = 41; // -100 to +100 in steps of 5
        const lineSpacing = (SIZE_HEIGHT - 2) / (totalLines - 1);

        for (let i = 0; i < totalLines; i++) {
            const y = i * lineSpacing;
            const value = 100 - i * 5; // Values from +100 to -100 in steps of 5

            let lineLength;
            if (value % 10 === 0) {
                // Longer lines for multiples of 10
                lineLength = SIZE_WIDTH / 6;
            } else {
                // Shorter lines for 5-degree increments
                lineLength = SIZE_WIDTH / 18;
            }

            // Draw the line
            const line = svgLineCreator(
                SIZE_WIDTH / 2 - lineLength,
                SIZE_WIDTH / 2 + lineLength,
                y,
                y,
                "white",
                value % 10 === 0 ? 5 : 3  // Thicker lines for multiples of 10
            );
            line.classList.add("horizont");
            line.setAttribute("data-value", value);
            if (value > 0 && value <= 35 || value < 0 && value >= -35) {
                line.style.display = "block"
            } else {
                line.style.display = "none";
            }
            svg.appendChild(line);

            // Add number label only for multiples of 10
            if (value % 10 === 0) {
                // Create the numerical value
                const text = svgTextCreator(SIZE_WIDTH / 2 - SIZE_WIDTH / 5, y + 5, value.toString());
                text.classList.add("horizont");
                text.setAttribute("fill", "white");
                text.setAttribute("font-size", "14px");
                text.setAttribute("data-value", value);
                if (value > 0 && value <= 35 || value < 0 && value >= -35) {
                    text.style.display = "block"
                } else {
                    text.style.display = "none";
                }
                svg.appendChild(text);
            }
        }

        svg.appendChild(line);

        this.#pitchLine = line;
        this.elemPanel.children.item(0).appendChild(svg);

        Array.from(this.#horizontLinesAndText).forEach(elem => {
            if (elem.tagName === 'line') {
                elem.setAttribute("data-original-y", elem.getAttribute("y1"));
            } else if (elem.tagName === 'text') {
                elem.setAttribute("data-original-y", elem.getAttribute("y"));
            }
        });

        document.addEventListener("keydown", (ev) => {
            switch (ev.keyCode) {
                case 87:
                    VarSet("PitchIndicator", "Degrees", VarGet("PitchIndicator", "Degrees", 1) + 1, 1);
                    break;
                case 83:
                    VarSet("PitchIndicator", "Degrees", VarGet("PitchIndicator", "Degrees", 1) - 1, 1);
                    break;
                case 65:
                    VarSet("RollIndicator", "Degrees", VarGet("RollIndicator", "Degrees", 1) - 1, 1);
                    break;
                case 68:
                    VarSet("RollIndicator", "Degrees", VarGet("RollIndicator", "Degrees", 1) + 1, 1);
                    break;
            }
        })
    }


    getPitchIndicatorValue() {
        let currentPitch = VarGet("PitchIndicator", "Degrees", 2) * 2;
        let displayPitchValue = VarGet("PitchIndicator", "Degrees", 2);
        let currentRoll = VarGet("RollIndicator", "Degrees", 1);
        let gradient = this.#backgroundDefs.children[0];
        //[blue, brown]
        let stops = [this.#backgroundDefs.children[0].children[1], this.#backgroundDefs.children[0].children[0]]
        this.#backgroundGroup.setAttribute("transform",
            `rotate(${currentRoll}, ${SIZE_WIDTH / 2}, ${SIZE_HEIGHT / 2})`
        );


        Array.from(this.#horizontLinesAndText).forEach(elem => {
            if (elem.tagName === 'line') {
                // Get the original y position (stored as a data attribute or calculated)
                let originalY = parseFloat(elem.getAttribute("data-original-y")) ||
                    parseFloat(elem.getAttribute("y1"));
                let originalValue = elem.getAttribute("data-value");
                // If we haven't stored the original position yet, store it
                if (!elem.getAttribute("data-original-y")) {
                    elem.setAttribute("data-original-y", originalY);
                }

                // Calculate new Y position directly from pitch
                let newY = originalY + currentPitch;

                // Update line position
                elem.setAttribute("y1", newY);
                elem.setAttribute("y2", newY);

                if (originalValue > 0 && displayPitchValue >= originalValue) {
                    elem.style.display = "block";
                }
                if (originalValue > 35 && displayPitchValue < originalValue) {
                    elem.style.display = "none";
                }
                if (originalValue < 0 && displayPitchValue <= originalValue) {
                    elem.style.display = "block";
                }
                if (originalValue < -35 && displayPitchValue > originalValue) {
                    elem.style.display = "none";
                }

                if (currentPitch > 0) {
                    let b = Math.floor((200 / (100 + currentPitch)) * 25)
                    stops[0].setAttribute("offset", b + ".1%")
                    stops[1].setAttribute("offset", b + "%")

                } else {
                    let b = Math.floor((200 / (100 - currentPitch)) * 25)
                    stops[0].setAttribute("offset", b + "%")
                    stops[1].setAttribute("offset", 100 - b + "%")
                }
            } else if (elem.tagName === 'text') {
                // Handle text elements similarly
                let originalY = parseFloat(elem.getAttribute("data-original-y")) ||
                    parseFloat(elem.getAttribute("y"));

                let originalValue = elem.getAttribute("data-value");
                if (originalValue > 0 && displayPitchValue >= originalValue) {
                    elem.style.display = "block";
                }
                if (originalValue > 35 && displayPitchValue < originalValue) {
                    elem.style.display = "none";
                }
                if (originalValue < 0 && displayPitchValue <= originalValue) {
                    elem.style.display = "block";
                }
                if (originalValue < -35 && displayPitchValue > originalValue) {
                    elem.style.display = "none";
                }
                if (!elem.getAttribute("data-original-y")) {
                    elem.setAttribute("data-original-y", originalY);
                }

                let newY = originalY + currentPitch;
                elem.setAttribute("y", newY);

            }
            elem.setAttribute("transform", `rotate(${currentRoll}, ${SIZE_WIDTH / 2}, ${SIZE_HEIGHT / 2})`);
        });

        this.#attitudeCircle.setAttribute("transform", `rotate(${currentRoll}, ${SIZE_WIDTH / 2}, ${SIZE_HEIGHT / 2})`);
        this.#pitchLine.setAttribute("transform", `rotate(${currentRoll}, ${SIZE_WIDTH / 2}, ${SIZE_HEIGHT / 2})`);

    }


    //param1: true if you want to display false if you want to hide
    //param2: 0 if you want to display/hide left flap, 1 if you want to display/hide right flap
    SetFlapDisplay(display, flap) {
        if (display) {
            if (flap === 0) {
                this.#loading.style.display = "block";
                this.#leftFlap.style.display = "block";
                this.#leftLine.style.display = "block";
            } else {
                this.#loadingRightFlap.style.display = "block";
                this.#rightFlap.style.display = "block";
                this.#rightLine.style.display = "block";
            }
        } else {
            if (flap === 0) {
                this.#loading.style.display = "none";
                this.#leftFlap.style.display = "none";
                this.#leftLine.style.display = "none";
            } else {
                this.#loadingRightFlap.style.display = "none";
                this.#rightFlap.style.display = "none";
                this.#rightLine.style.display = "none";
            }
        }
    }
    FlapUpdate() {
        this.#loading.addEventListener("transitionend", () => {
            this.SetFlapDisplay(false, 0)
        })

        this.#loading.addEventListener("transitionstart", () => {
            this.SetFlapDisplay(true, 0);
        })

        this.#loadingRightFlap.addEventListener("transitionend", () => {
            this.SetFlapDisplay(false, 1)
        })

        this.#loadingRightFlap.addEventListener("transitionstart", () => {
            this.SetFlapDisplay(true, 1)
        })

        let leftFlap = Number(VarGet("LeftFlap", "Degrees", 1));
        let rightFlap = Number(VarGet("RightFlap", "Degrees", 1));
        let leftValue = Number(this.#leftLine.getAttribute("data-value"));
        let rightValue = Number(this.#rightLine.getAttribute("data-value"));

        let leftFlapPercent = 0;
        let rightFlapPercent = 0;
        if (leftFlap >= 20 && leftFlap < 42) {
            leftFlapPercent = 0.20;
        }
        if (leftFlap >= 42) {
            leftFlapPercent = 0.42;
        }

        if (rightFlap >= 20 && rightFlap < 42) {
            rightFlapPercent = 0.20;
        }
        if (rightFlap >= 42) {
            rightFlapPercent = 0.42;
        }
        let leftY = this.#leftFlap.getAttribute("y");
        let leftHeight = this.#leftFlap.getAttribute("height");
        let calculatedLeft = leftHeight * leftFlapPercent;

        let rightY = this.#rightFlap.getAttribute("y");
        let rightHeight = this.#rightFlap.getAttribute("height");
        let calculatedRight = rightHeight * rightFlapPercent;
        this.#leftLine.setAttribute("y1", Number(leftY) + calculatedLeft)
        this.#leftLine.setAttribute("y2", Number(leftY) + calculatedLeft)

        if (leftFlap !== leftValue) {
            this.SetFlapDisplay(true, 0)
            if (leftFlap === 20 || leftFlap === 42) {
                console.log(this.#loading);
                this.#loading.setAttribute("height", calculatedLeft);
            }

            if (leftFlap < 20) {
                this.#loading.setAttribute("height", 0)
            }
            if (leftFlap > 20 && leftFlap < 42) {
                this.#loading.setAttribute("height", calculatedLeft)
            }
            this.#leftLine.setAttribute("data-value", leftFlap);
        }

        if (rightFlap !== rightValue) {
            this.SetFlapDisplay(true, 1)
            if (rightFlap === 20 || rightFlap === 42) {
                this.#loadingRightFlap.setAttribute("height", calculatedRight);
            }

            if (rightFlap < 20) {
                this.#loadingRightFlap.setAttribute("height", 0)
            }
            if (rightFlap > 20 && rightFlap < 42) {
                this.#loadingRightFlap.setAttribute("height", calculatedRight)
            }
            this.#rightLine.setAttribute("data-value", rightFlap);
        }
        this.#rightLine.setAttribute("y1", Number(rightY) + calculatedRight)
        this.#rightLine.setAttribute("y2", Number(rightY) + calculatedRight)
    }

    GasUpdate() {

    }
    Update() {
        super.Update();
        let electricity;
        if (isMsfs) {
            // TODO CHANGE CIRCUIT VARIABLE TO THE RIGHT ONE FOR THE CURRENT USECASE
            electricity = SimVar.GetSimVarValue(CIRCUIT, "Bool");
            if (!electricity) return this._turnOff(this.elemPanel);

        }
        else {
            electricity = VarGet(CIRCUIT, "Bool", 1);
            if (electricity == false) return this._turnOff(this.elemPanel);
        }

        if (electricity && this.elemPanel.getAttribute("state") == "off" && this.#statusContainer.getAttribute("state") == "off") {
            this._turnOn(this.elemPanel);
            this.attitudeInit();
        }

        if (electricity && this.#statusContainer.getAttribute("state") == "on") {
            this._turnOn(this.#statusContainer);
            this.FlapUpdate();
        }



        this.getPitchIndicatorValue();
        // do the updates here 
    }

    _turnOff(elemPanel) {
        elemPanel.setAttribute("state", "off");
    }

    _turnOn(elemPanel) {
        elemPanel.setAttribute("state", "on");
    }
}



if (isMsfs) {
    registerInstrument("pf-test-instrument", PfTestInstrument);
}
else {
    const glasscockpit = new PfTestInstrument();
    glasscockpit.Init();
    glasscockpit.connectedCallback();

    function loop(timestamp) {
        glasscockpit.Update();
        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
}
