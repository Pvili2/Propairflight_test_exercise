class GlasscockpitTesting {
    constructor(strTestDivId) {
        this.root = document.getElementById(strTestDivId);
        this.root.classList.add("glasscockpit-testing-frame");
        this._generate_tree();
        this.mapSimVarsToSliders = new Map();
    }


    setSimVarValue(strSimVarNameWithPrefix, strSimVarUnit, value, multiple = 1) {
        const strMapkey = this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, 0);
        const hdlSlider = this.mapSimVarsToSliders.get(strMapkey);

        if (hdlSlider === undefined) {
            throw new Error("Invalid argument! Did you use the correct simvar name with prefix and indexing? Used: \"" + strMapkey + "\" (case in-sensitive!)");
        }

        // Ha van multiple, akkor osztunk vele hogy a megfelelő értéket állítsuk be
        const adjustedValue = multiple ? value / multiple : value;

        // Érték korlátozása a slider min-max értékei közé
        const boundedValue = Math.min(Math.max(adjustedValue, hdlSlider.min), hdlSlider.max);

        // Slider és a hozzá tartozó output érték beállítása
        hdlSlider.value = boundedValue;
        hdlSlider.nextElementSibling.value = boundedValue;

        // Slider input eseményének kiváltása hogy más kapcsolódó elemek is frissüljenek
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        hdlSlider.dispatchEvent(event);
    }
    _generate_tree() {
        this.table = document.createElement("table");
        this.root.appendChild(this.table);



        let tr = null;
        let td = null;

        tr = this._create_tr();
        td = this._create_td(tr);

        td.innerHTML = "teszt";
        td.style.backgroundColor = "orange";
        this._create_move(td);
        // this.originalScreenOpacity = 
    }

    _create_move(parent) {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.right = "-30px";
        div.style.top = "0px";

        parent.appendChild(div)
        div.innerHTML = `
            <svg id="drag_debugger" xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30">
                <path d="M480-107.692 337.692-250l28.539-28.539L460-184.77V-460H185l93.769 93.538L250-337.692 107.692-480l142.077-142.077 28.539 28.539L184.77-500H460v-275.23l-93.769 93.769L337.692-710 480-852.308 622.308-710l-28.539 28.539L500-775.23V-500h275l-93.769-93.538L710-622.308 852.308-480 710-337.692l-28.539-28.539L775.23-460H500v275l93.538-93.769L622.308-250 480-107.692Z"></path>
            </svg>`
        const svg = {
            element: div.children[0],
            top: 8,
            left: SIZE_WIDTH + 30
        }

        this.root.style.left = `${svg.left}px`;
        this.root.style.top = `${svg.top}px`;


        const dragOffset = {
            X: 0,
            Y: 0
        }

        const dragListener = (event) => {
            svg.top = event.clientY - dragOffset.Y;
            if (svg.top < 0) {
                svg.top = 0;
            }
            svg.left = event.clientX - dragOffset.X;
            if (svg.left < 0) {
                svg.left = 0;
            }
            this.root.style.left = `${svg.left}px`;
            this.root.style.top = `${svg.top}px`;
        }



        svg.element.addEventListener('mousedown', (event) => {
            dragOffset.X = event.pageX - this.table.getBoundingClientRect().x;
            dragOffset.Y = event.pageY - this.table.getBoundingClientRect().y;
            window.addEventListener('mousemove', dragListener);
        })

        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', dragListener)
        })
    }

    _create_tr() {
        const tr = document.createElement("tr");
        this.table.appendChild(tr);
        return tr;
    }


    _create_td(hdlTr) {
        const td = document.createElement("td");
        hdlTr.appendChild(td);
        return td;
    }


    _generate_ids_for_hideable_block(nNumOfSimVarIndices, strId) {
        let arr_strHideableIds = [];

        if (nNumOfSimVarIndices === 0) {
            arr_strHideableIds.push("test-hideable-" + strId);
        }
        else {
            for (let i = 0; i < nNumOfSimVarIndices; ++i) {
                arr_strHideableIds.push("test-hideable-" + strId + "-" + i);
            }
        }

        return arr_strHideableIds;
    }


    _create_index_selector_dropdown(hdlTr, nNumOfSimVarIndices, arr_strHideableIds) {
        let hdlTdSelect = this._create_td(hdlTr);
        let hdlSelect = document.createElement("select");
        // hdlSelect.id = "mySelect";
        hdlTdSelect.appendChild(hdlSelect);
        for (let i = 0; i < nNumOfSimVarIndices; ++i) {
            let hdlOption = document.createElement("option");
            hdlOption.value = arr_strHideableIds[i];
            hdlOption.text = i + 1; // engine indexing starts from 1 in the sim
            hdlSelect.appendChild(hdlOption);
        }

        if (nNumOfSimVarIndices === 0) {
            hdlSelect.style.display = "none";
        }

        return hdlSelect;
    }


    _create_hideable_block_item(hdlTd, nIndex, arr_strHideableIds, fValMin, fValMax, fValStart, fStep) {
        let hdlHideableBlockItem = document.createElement("div");
        hdlHideableBlockItem.style.display = nIndex === 0 ? "block" : "none";
        hdlTd.appendChild(hdlHideableBlockItem);

        let hdlSlider = document.createElement("input");
        hdlSlider.id = arr_strHideableIds[nIndex];
        hdlSlider.type = "range";
        hdlSlider.min = fValMin;
        hdlSlider.max = fValMax;
        hdlSlider.autocomplete = "off";
        hdlSlider.step = fStep || "any";
        hdlSlider.value = fValStart;
        // hdlSlider.class = "slider";
        hdlSlider.oninput = function () { this.nextElementSibling.value = this.value };
        hdlHideableBlockItem.appendChild(hdlSlider);

        let hdlOutput = document.createElement("output");
        // hdlOutput.innerHTML = fValStart;
        hdlOutput.textContent = hdlSlider.value;
        hdlHideableBlockItem.appendChild(hdlOutput);

        return hdlHideableBlockItem;
    }

    _create_hideable_block(hdlTr, nNumOfSimVarIndices, arr_strHideableIds, fValMin, fValMax, fValStart, fStep) {
        // creating a slider for simvars wihout index
        if (nNumOfSimVarIndices === 0) {
            nNumOfSimVarIndices = 1;
        }

        let hdlTd = this._create_td(hdlTr);

        let arr_hdlHideableBlock = [];
        for (let i = 0; i < nNumOfSimVarIndices; ++i) {
            const hdlHideableBlockItem = this._create_hideable_block_item(hdlTd, i, arr_strHideableIds, fValMin, fValMax, fValStart, fStep);
            arr_hdlHideableBlock.push(hdlHideableBlockItem);
        }

        return arr_hdlHideableBlock;
    }


    _connect_index_selector_to_hideable_block(hdlSelect, nNumOfSimVarIndices, arr_strHideableIds, arr_hdlHideableBlock) {
        hdlSelect.onchange = function () {
            for (let i = 0; i < nNumOfSimVarIndices; ++i) {
                if (arr_strHideableIds[i] === this.value) {
                    arr_hdlHideableBlock[i].style.display = "block";
                }
                else {
                    arr_hdlHideableBlock[i].style.display = "none";

                }
            }
        };
    }

    /**
     * @param {int} nIndex1Based - In the simulators, indexing simvars starts from 1. 
                                   Passing a 0 argument means the method won't create
                                   the ":idx" part.
     */
    _convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, nIndex1Based) {
        return strSimVarNameWithPrefix.toLowerCase() + (nIndex1Based > 0 ? (":" + nIndex1Based.toString()) : "") + "," + strSimVarUnit.toLowerCase();
    }


    _map_simvars_to_sliders(strSimVarNameWithPrefix, strSimVarUnit, nNumOfSimVarIndices, arr_hdlHideableBlock) {
        if (nNumOfSimVarIndices > 0) {
            for (let i = 0; i < nNumOfSimVarIndices; ++i) {
                const hdlSlider = arr_hdlHideableBlock[i].firstChild;
                this.mapSimVarsToSliders.set(this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, i + 1), hdlSlider);
            }
        }
        else {
            const hdlSlider = arr_hdlHideableBlock[0].firstChild;
            this.mapSimVarsToSliders.set(this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, 0), hdlSlider);
        }
    }


    /**
     * @param {string} strSimVarNameWithPrefix - Example: "A:GENERAL ENG RPM". 
                                                 Note that there is no ":idx" at the end!
     * @param {string} strSimVarUnit - Example: "Rpm". 
     * @param {int} nNumOfSimVarIndices - If this simvar is indexable, put the number of indices, otherwise put 0.
     * @param {string} strId - A unique name used for generating IDs Example: "rpm".
     * @param {float} fValMin - Minimum value.
     * @param {float} fValMax - Maximum value.
     * @param {float} fStep - Stepping value.
     * @param {float} fValStart - Starting value.
     */
    addSimVar(strSimVarNameWithPrefix, strSimVarUnit, nNumOfSimVarIndices, strId, fValMin, fValMax, fStep, fValStart) {
        let hdlTr = this._create_tr();

        // name

        let hdlTdName = this._create_td(hdlTr);
        hdlTdName.textContent = strSimVarNameWithPrefix + ":";

        // creating the IDs for the hideable elements

        const arr_strHideableIds = this._generate_ids_for_hideable_block(nNumOfSimVarIndices, strId);

        // creating the index selecting dropdown menu

        const hdlSelect = this._create_index_selector_dropdown(hdlTr, nNumOfSimVarIndices, arr_strHideableIds);

        // creating the slider and output

        const arr_hdlHideableBlock = this._create_hideable_block(hdlTr, nNumOfSimVarIndices, arr_strHideableIds, fValMin, fValMax, fValStart, fStep);

        // connecting dropdown options to slider visiblity

        this._connect_index_selector_to_hideable_block(hdlSelect, nNumOfSimVarIndices, arr_strHideableIds, arr_hdlHideableBlock);

        // mapping simvars to sliders

        this._map_simvars_to_sliders(strSimVarNameWithPrefix, strSimVarUnit, nNumOfSimVarIndices, arr_hdlHideableBlock);
    }


    getSimVarValue(strSimVarNameWithPrefix, strSimVarUnit, multiple) {
        const strMapkey = this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, 0); // 0 because it is already called with an index if it has
        const hdlSlider = this.mapSimVarsToSliders.get(strMapkey);

        if (hdlSlider === undefined) {
            throw new Error("Invalid argument! Did you use the correct simvar name with prefix and indexing? Used: \"" + strMapkey + "\" (case in-sensitive!)");
        }

        return hdlSlider.value * multiple;
    }


    /**
     * @param {string} strImgId - ID of the img tag.
     * @param {string} strPathToImages - Relative path to the images. They are typically in a directory but not necessarily.
     *                                   The name of the images must be the same, 
     *                                   except for an indexing postfix, which starts from 1.
     *                                   For example:
     *                                   "imgfolder/imgname-1.png"
     *                                   "imgfolder/imgname-2.png"
     *                                   "imgfolder/imgname-3.png"
     *                                   The argument must be in the following format:
     *                                   "imgfolder/imgname-?.extension" Note the question mark, 
     *                                   which must be the only difference between the file names.
     * @param {int} nNumOfImages - Number of images
     * @param {float} fOpacity - Opacity when the page loads
     */
    attachTestDisplay(strImgId, strPathToImages, nNumOfImages, fOpacity) {
        let hdlImage = document.getElementById(strImgId);
        hdlImage.classList.add("glasscockpit-testing-image");
        const arr_strImgPathParts = strPathToImages.split("?");
        hdlImage.src = arr_strImgPathParts[0] + "1" + arr_strImgPathParts[1];
        hdlImage.style.opacity = fOpacity;

        let hdlTr = this._create_tr();

        let hdlTdName = this._create_td(hdlTr);
        hdlTdName.textContent = "Original display:";

        let arr_nIds = [];
        for (let i = 1; i <= nNumOfImages; ++i) {
            arr_nIds.push(i);
        }

        const hdlSelect = this._create_index_selector_dropdown(hdlTr, nNumOfImages, arr_nIds);

        hdlSelect.onchange = function () {
            hdlImage.src = arr_strImgPathParts[0] + this.value + arr_strImgPathParts[1];
        };

        // only one slider for all of the images
        let hdlTdSliderBlock = this._create_td(hdlTr);
        const hdlSliderBlockItem = this._create_hideable_block_item(hdlTdSliderBlock, 0, ["test-display"], 0.0, 1.0, fOpacity);

        // using the output element, since the slider already has an attached lambda
        hdlSliderBlockItem.firstChild.oninput = function () {
            this.nextElementSibling.value = this.value
            hdlImage.style.opacity = this.value;
        };
    }
}


let glasscockpitTesting = new GlasscockpitTesting("glasscockpit-testing");
let glasscockpitTesting2 = new GlasscockpitTesting("glasscockpit-testing2");

// strUnit is unused, it is only there for compatibility with P3D
// Example: VarGet("A:Indicated Altitude", "feet");
function VarGet(strSimVarNameWithPrefix, strSimVarUnit, multiple) {
    return glasscockpitTesting.getSimVarValue(strSimVarNameWithPrefix, strSimVarUnit, multiple);
}

function VarSet(strSimVarNameWithPrefix, strSimVarUnit, value, multiple = 1) {
    glasscockpitTesting.setSimVarValue(strSimVarNameWithPrefix, strSimVarUnit, value, multiple);
}

class GlasscockpitTesting2 {
    constructor(strTestDivId) {
        this.root = document.getElementById(strTestDivId);
        this.root.classList.add("glasscockpit-testing-frame2");
        this._generate_tree();
        this.mapSimVarsToSliders = new Map();
    }


    setSimVarValue(strSimVarNameWithPrefix, strSimVarUnit, value, multiple = 1) {
        const strMapkey = this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, 0);
        const hdlSlider = this.mapSimVarsToSliders.get(strMapkey);

        if (hdlSlider === undefined) {
            throw new Error("Invalid argument! Did you use the correct simvar name with prefix and indexing? Used: \"" + strMapkey + "\" (case in-sensitive!)");
        }

        // Ha van multiple, akkor osztunk vele hogy a megfelelő értéket állítsuk be
        const adjustedValue = multiple ? value / multiple : value;

        // Érték korlátozása a slider min-max értékei közé
        const boundedValue = Math.min(Math.max(adjustedValue, hdlSlider.min), hdlSlider.max);

        // Slider és a hozzá tartozó output érték beállítása
        hdlSlider.value = boundedValue;
        hdlSlider.nextElementSibling.value = boundedValue;

        // Slider input eseményének kiváltása hogy más kapcsolódó elemek is frissüljenek
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        hdlSlider.dispatchEvent(event);
    }
    _generate_tree() {
        this.table = document.createElement("table");
        this.root.appendChild(this.table);



        let tr = null;
        let td = null;

        tr = this._create_tr();
        td = this._create_td(tr);

        td.innerHTML = "teszt2";
        td.style.backgroundColor = "orange";
        this._create_move(td);
        // this.originalScreenOpacity = 
    }

    _create_move(parent) {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.right = "-30px";
        div.style.top = "0px";

        parent.appendChild(div)
        div.innerHTML = `
            <svg id="drag_debugger" xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30">
                <path d="M480-107.692 337.692-250l28.539-28.539L460-184.77V-460H185l93.769 93.538L250-337.692 107.692-480l142.077-142.077 28.539 28.539L184.77-500H460v-275.23l-93.769 93.769L337.692-710 480-852.308 622.308-710l-28.539 28.539L500-775.23V-500h275l-93.769-93.538L710-622.308 852.308-480 710-337.692l-28.539-28.539L775.23-460H500v275l93.538-93.769L622.308-250 480-107.692Z"></path>
            </svg>`
        const svg = {
            element: div.children[0],
            top: 8,
            left: SIZE_WIDTH + 30
        }

        this.root.style.left = `${svg.left}px`;
        this.root.style.top = `${svg.top}px`;


        const dragOffset = {
            X: 0,
            Y: 0
        }

        const dragListener = (event) => {
            svg.top = event.clientY - dragOffset.Y;
            if (svg.top < 0) {
                svg.top = 0;
            }
            svg.left = event.clientX - dragOffset.X;
            if (svg.left < 0) {
                svg.left = 0;
            }
            this.root.style.left = `${svg.left}px`;
            this.root.style.top = `${svg.top}px`;
        }



        svg.element.addEventListener('mousedown', (event) => {
            dragOffset.X = event.pageX - this.table.getBoundingClientRect().x;
            dragOffset.Y = event.pageY - this.table.getBoundingClientRect().y;
            window.addEventListener('mousemove', dragListener);
        })

        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', dragListener)
        })
    }

    _create_tr() {
        const tr = document.createElement("tr");
        this.table.appendChild(tr);
        return tr;
    }


    _create_td(hdlTr) {
        const td = document.createElement("td");
        hdlTr.appendChild(td);
        return td;
    }


    _generate_ids_for_hideable_block(nNumOfSimVarIndices, strId) {
        let arr_strHideableIds = [];

        if (nNumOfSimVarIndices === 0) {
            arr_strHideableIds.push("test-hideable-" + strId);
        }
        else {
            for (let i = 0; i < nNumOfSimVarIndices; ++i) {
                arr_strHideableIds.push("test-hideable-" + strId + "-" + i);
            }
        }

        return arr_strHideableIds;
    }


    _create_index_selector_dropdown(hdlTr, nNumOfSimVarIndices, arr_strHideableIds) {
        let hdlTdSelect = this._create_td(hdlTr);
        let hdlSelect = document.createElement("select");
        // hdlSelect.id = "mySelect";
        hdlTdSelect.appendChild(hdlSelect);
        for (let i = 0; i < nNumOfSimVarIndices; ++i) {
            let hdlOption = document.createElement("option");
            hdlOption.value = arr_strHideableIds[i];
            hdlOption.text = i + 1; // engine indexing starts from 1 in the sim
            hdlSelect.appendChild(hdlOption);
        }

        if (nNumOfSimVarIndices === 0) {
            hdlSelect.style.display = "none";
        }

        return hdlSelect;
    }


    _create_hideable_block_item(hdlTd, nIndex, arr_strHideableIds, fValMin, fValMax, fValStart, fStep) {
        let hdlHideableBlockItem = document.createElement("div");
        hdlHideableBlockItem.style.display = nIndex === 0 ? "block" : "none";
        hdlTd.appendChild(hdlHideableBlockItem);

        let hdlSlider = document.createElement("input");
        hdlSlider.id = arr_strHideableIds[nIndex];
        hdlSlider.type = "range";
        hdlSlider.min = fValMin;
        hdlSlider.max = fValMax;
        hdlSlider.autocomplete = "off";
        hdlSlider.step = fStep || "any";
        hdlSlider.value = fValStart;
        // hdlSlider.class = "slider";
        hdlSlider.oninput = function () { this.nextElementSibling.value = this.value };
        hdlHideableBlockItem.appendChild(hdlSlider);

        let hdlOutput = document.createElement("output");
        // hdlOutput.innerHTML = fValStart;
        hdlOutput.textContent = hdlSlider.value;
        hdlHideableBlockItem.appendChild(hdlOutput);

        return hdlHideableBlockItem;
    }

    _create_hideable_block(hdlTr, nNumOfSimVarIndices, arr_strHideableIds, fValMin, fValMax, fValStart, fStep) {
        // creating a slider for simvars wihout index
        if (nNumOfSimVarIndices === 0) {
            nNumOfSimVarIndices = 1;
        }

        let hdlTd = this._create_td(hdlTr);

        let arr_hdlHideableBlock = [];
        for (let i = 0; i < nNumOfSimVarIndices; ++i) {
            const hdlHideableBlockItem = this._create_hideable_block_item(hdlTd, i, arr_strHideableIds, fValMin, fValMax, fValStart, fStep);
            arr_hdlHideableBlock.push(hdlHideableBlockItem);
        }

        return arr_hdlHideableBlock;
    }


    _connect_index_selector_to_hideable_block(hdlSelect, nNumOfSimVarIndices, arr_strHideableIds, arr_hdlHideableBlock) {
        hdlSelect.onchange = function () {
            for (let i = 0; i < nNumOfSimVarIndices; ++i) {
                if (arr_strHideableIds[i] === this.value) {
                    arr_hdlHideableBlock[i].style.display = "block";
                }
                else {
                    arr_hdlHideableBlock[i].style.display = "none";

                }
            }
        };
    }

    /**
     * @param {int} nIndex1Based - In the simulators, indexing simvars starts from 1. 
                                   Passing a 0 argument means the method won't create
                                   the ":idx" part.
     */
    _convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, nIndex1Based) {
        return strSimVarNameWithPrefix.toLowerCase() + (nIndex1Based > 0 ? (":" + nIndex1Based.toString()) : "") + "," + strSimVarUnit.toLowerCase();
    }


    _map_simvars_to_sliders(strSimVarNameWithPrefix, strSimVarUnit, nNumOfSimVarIndices, arr_hdlHideableBlock) {
        if (nNumOfSimVarIndices > 0) {
            for (let i = 0; i < nNumOfSimVarIndices; ++i) {
                const hdlSlider = arr_hdlHideableBlock[i].firstChild;
                this.mapSimVarsToSliders.set(this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, i + 1), hdlSlider);
            }
        }
        else {
            const hdlSlider = arr_hdlHideableBlock[0].firstChild;
            this.mapSimVarsToSliders.set(this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, 0), hdlSlider);
        }
    }


    /**
     * @param {string} strSimVarNameWithPrefix - Example: "A:GENERAL ENG RPM". 
                                                 Note that there is no ":idx" at the end!
     * @param {string} strSimVarUnit - Example: "Rpm". 
     * @param {int} nNumOfSimVarIndices - If this simvar is indexable, put the number of indices, otherwise put 0.
     * @param {string} strId - A unique name used for generating IDs Example: "rpm".
     * @param {float} fValMin - Minimum value.
     * @param {float} fValMax - Maximum value.
     * @param {float} fStep - Stepping value.
     * @param {float} fValStart - Starting value.
     */
    addSimVar(strSimVarNameWithPrefix, strSimVarUnit, nNumOfSimVarIndices, strId, fValMin, fValMax, fStep, fValStart) {
        let hdlTr = this._create_tr();

        // name

        let hdlTdName = this._create_td(hdlTr);
        hdlTdName.textContent = strSimVarNameWithPrefix + ":";

        // creating the IDs for the hideable elements

        const arr_strHideableIds = this._generate_ids_for_hideable_block(nNumOfSimVarIndices, strId);

        // creating the index selecting dropdown menu

        const hdlSelect = this._create_index_selector_dropdown(hdlTr, nNumOfSimVarIndices, arr_strHideableIds);

        // creating the slider and output

        const arr_hdlHideableBlock = this._create_hideable_block(hdlTr, nNumOfSimVarIndices, arr_strHideableIds, fValMin, fValMax, fValStart, fStep);

        // connecting dropdown options to slider visiblity

        this._connect_index_selector_to_hideable_block(hdlSelect, nNumOfSimVarIndices, arr_strHideableIds, arr_hdlHideableBlock);

        // mapping simvars to sliders

        this._map_simvars_to_sliders(strSimVarNameWithPrefix, strSimVarUnit, nNumOfSimVarIndices, arr_hdlHideableBlock);
    }


    getSimVarValue(strSimVarNameWithPrefix, strSimVarUnit, multiple) {
        const strMapkey = this._convert_simvar_to_mapkey(strSimVarNameWithPrefix, strSimVarUnit, 0); // 0 because it is already called with an index if it has
        const hdlSlider = this.mapSimVarsToSliders.get(strMapkey);

        if (hdlSlider === undefined) {
            throw new Error("Invalid argument! Did you use the correct simvar name with prefix and indexing? Used: \"" + strMapkey + "\" (case in-sensitive!)");
        }

        return hdlSlider.value * multiple;
    }


    /**
     * @param {string} strImgId - ID of the img tag.
     * @param {string} strPathToImages - Relative path to the images. They are typically in a directory but not necessarily.
     *                                   The name of the images must be the same, 
     *                                   except for an indexing postfix, which starts from 1.
     *                                   For example:
     *                                   "imgfolder/imgname-1.png"
     *                                   "imgfolder/imgname-2.png"
     *                                   "imgfolder/imgname-3.png"
     *                                   The argument must be in the following format:
     *                                   "imgfolder/imgname-?.extension" Note the question mark, 
     *                                   which must be the only difference between the file names.
     * @param {int} nNumOfImages - Number of images
     * @param {float} fOpacity - Opacity when the page loads
     */
    attachTestDisplay(strImgId, strPathToImages, nNumOfImages, fOpacity) {
        let hdlImage = document.getElementById(strImgId);
        hdlImage.classList.add("glasscockpit-testing-image");
        const arr_strImgPathParts = strPathToImages.split("?");
        hdlImage.src = arr_strImgPathParts[0] + "1" + arr_strImgPathParts[1];
        hdlImage.style.opacity = fOpacity;

        let hdlTr = this._create_tr();

        let hdlTdName = this._create_td(hdlTr);
        hdlTdName.textContent = "Original display:";

        let arr_nIds = [];
        for (let i = 1; i <= nNumOfImages; ++i) {
            arr_nIds.push(i);
        }

        const hdlSelect = this._create_index_selector_dropdown(hdlTr, nNumOfImages, arr_nIds);

        hdlSelect.onchange = function () {
            hdlImage.src = arr_strImgPathParts[0] + this.value + arr_strImgPathParts[1];
        };

        // only one slider for all of the images
        let hdlTdSliderBlock = this._create_td(hdlTr);
        const hdlSliderBlockItem = this._create_hideable_block_item(hdlTdSliderBlock, 0, ["test-display"], 0.0, 1.0, fOpacity);

        // using the output element, since the slider already has an attached lambda
        hdlSliderBlockItem.firstChild.oninput = function () {
            this.nextElementSibling.value = this.value
            hdlImage.style.opacity = this.value;
        };
    }
}