/*
    Looking at this code is terrible, I am well aware of that.
*/

// Make this thing function in Electron as well as normal browsers
var inElectron = false;
if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
    inElectron = true;
    const { ipcRenderer } = require('electron');
    var ipc = ipcRenderer;
} else {
    // Nothing really browser-exclusive, but this is still here for the option
}

// Catch and pass Electron stuff

// Send message to main.js
function ipcSend(msg) {
    if (inElectron) {
        ipc.send(msg);
    } else {
        alert("Electron App not found");
    }
}

// Declarations
const html = document.getElementsByTagName('html')[0];

const paletteOffset = {
    x: document.getElementById("block").getBoundingClientRect().left,
    y: document.getElementById("block").getBoundingClientRect().top
};

// Canvas declarations
const c = document.getElementById('main');
const ctx = c.getContext('2d', {
    antialias: false,
    depth: false
});

const b = document.getElementById('brushPrint');
const bCtx = b.getContext('2d', {
    antialias: false,
    depth: false
});

// Automatically give every menu ul a fixed mouseOver solution, idk man it was easy
const menuOptions = document.getElementById("menu").getElementsByTagName("ul");

for (var i = 0; i < menuOptions.length; i++) {
    // If not in electron, visually remove the windowTab option
    if (menuOptions[i].id == "windowTab" && !inElectron) {
        menuOptions[i].style.position = "absolute";
        menuOptions[i].style.display = "none";
    } else {
        menuOptions[i].addEventListener("mouseover", function () { menuHandler(this, true) });
        menuOptions[i].addEventListener("mouseout", function () { menuHandler(this, false) });
        for (var j = 0; j < menuOptions[i].getElementsByTagName("li").length; j++) {
            menuOptions[i].getElementsByTagName("li")[j].addEventListener(
                "click",
                function () {
                    menuButtonHandler(
                        this.parentElement.id,
                        this.innerText.toLowerCase().replace(" ", "")
                    )
                }
            );
        }
    }
}

// Handle mouseover/blurs and adjust width of ul option
function menuHandler(x, focus) {
    if (focus && !input['mouse']) {
        x.style.width = "100vw";
        x.style.opacity = "1.0";
    } else {
        x.style.opacity = "0.3";
        x.style.width = "100%";
    }
}

// Handle ul button clicks based on text
function menuButtonHandler(parentId, x) {
    let category = parentId.replace("Tab", "");
    if (category == "help") {
        if (x == "welcome") {
            alert("Welcome to Brash Art Studio!")
        } else if (x == "about") {
            window.open("https://ottcs.netlify.app/brash.html");
        } else if (x == "ottcs") {
            window.open("https://ottcs.netlify.app/");
        } else if (x == "workflow") {
            alert("General workflow information:\nThe slider inputs in the panel can be right-clicked to manually input values\nIcons on the left bar can be hovered over to show different options and tools");
        } else {
            alert("Sorry, " + x + " hasn't been implemented yet");
        }
    } else if (category == "window") {
        if (x == "minimize") {
            ipcSend("min");
        } else if (x == "maximize") {
            ipcSend("max");
        } else if (x == "close") {
            ipcSend("close");
        } else {
            alert("Sorry, " + x + " hasn't been implemented yet");
        }
    } else if (category == "file") {
        if (x == "new") {
            freshCanvas(prompt("Canvas width", 1080), prompt("Canvas height", 1080));
        } else if (x == "open") {
            let open = document.createElement('input');
            open.setAttribute('type', 'file');
            open.addEventListener('change', function (event) {
                let fileUpload = new Image();
                fileUpload.setAttribute('src', URL.createObjectURL(event.target.files[0]));
                fileUpload.onload = function () {
                    freshCanvas(this.width, this.height);
                    ctx.drawImage(fileUpload, 0, 0);
                }
            });
            open.click();
        } else if (x == "save") {
            let downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', 'file.png');
            c.toBlob(function (blob) {
                let url = URL.createObjectURL(blob);
                downloadLink.setAttribute('href', url);
                downloadLink.click();
            });
        } else {
            alert("Sorry, " + x + " hasn't been implemented yet");
        }
    } else if (category == "brush") {
        if (x == "standardpen") {
            brush.round = true;
            brush.eraser = false;
        } else if (x == "pixelpen") {
            brush.round = false;
            brush.eraser = false;
        } else {
            alert("Sorry, " + x + " hasn't been implemented yet");
        }
    } else if (category == "eraser") {
        if (x == "squareeraser") {
            brush.round = false;
            brush.eraser = true;
        } else if (x == "rounderaser") {
            brush.round = true;
            brush.eraser = true;
        } else {
            alert("Sorry, " + x + " hasn't been implemented yet");
        }
    } else {
        alert("Sorry, " + x + " hasn't been implemented yet");
    }
    // Close parent menuTab
    menuHandler(document.getElementById(parentId, false));
}

// More declarations, big main element stuff
const swatch = document.getElementById("swatch");
const block = document.getElementById("block");
const blockSelect = document.getElementById("blockSelect");

// Declaring widely used variables
var prefs = { scrollDirection: -1, aa: false };
var state = { cX: 0, cY: 0, cW: 0, cH: 0, cZ: 1.0, curTarget: "", drawing: false };
var brush = { round: false, eraser: false, size: 1, h: 0.0, s: 0.0, b: 0.0, a: 1.0 };
var prev = { x: 0, y: 0 };

var undoStack = [];
var undoIndex = -1;

// Input collection is really nifty and works nice
var input = {};
input['mouse'] = false;
input['rightClick'] = false;
input['a'] = false;
input['b'] = false;
input['c'] = false;
input['d'] = false;
input['e'] = false;
input['f'] = false;
input['g'] = false;
input['h'] = false;
input['i'] = false;
input['j'] = false;
input['k'] = false;
input['l'] = false;
input['m'] = false;
input['n'] = false;
input['o'] = false;
input['p'] = false;
input['q'] = false;
input['r'] = false;
input['s'] = false;
input['t'] = false;
input['u'] = false;
input['v'] = false;
input['w'] = false;
input['x'] = false;
input['y'] = false;
input['z'] = false;
input['0'] = false;
input['1'] = false;
input['2'] = false;
input['3'] = false;
input['4'] = false;
input['5'] = false;
input['6'] = false;
input['7'] = false;
input['8'] = false;
input['9'] = false;
input['shift'] = false;
input['control'] = false;
input['alt'] = false;
input[' '] = false;

function undoMake() {
    undoIndex++;
    undoStack[undoIndex] = ctx.getImageData(0, 0, state.cW, state.cH);
    if (undoIndex + 1 < undoStack.length) {
        undoStack.splice(undoIndex + 1);
    }
}

function undoPop() {
    if (undoIndex > 0) {
        undoIndex--;
        ctx.putImageData(undoStack[undoIndex], 0, 0);
    }
}

function redoPop() {
    if (undoIndex + 1 < undoStack.length) {
        undoIndex++;
        ctx.putImageData(undoStack[undoIndex], 0, 0);
    }
}

function cursor(x) {
    html.style.cursor = x;
}

// "Setters" for major elements
function setCanvasPos() {
    c.style.width = (state.cW * state.cZ) + "px";
    c.style.height = (state.cH * state.cZ) + "px";
    c.style.left = state.cX + 'px';
    c.style.top = state.cY + 'px';
    c.style.backgroundSize = 16.0 * state.cZ + 'px';
}

function setSwatch() {
    let rgb = hsbToRgb([brush.h, brush.s, brush.b]);
    swatch.style.backgroundColor = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + brush.a + ")";
}

function setBlockColor() {
    block.style.backgroundColor = "hsl(" + brush.h + ", 100%, 50%)";
}

function setBlockSelectPos() {
    blockSelect.style.left = brush.s * 2.55 + "px";
    blockSelect.style.top = 255 - (brush.b * 2.55) + "px";
}

function setSelectPos(id, val) {
    document.getElementById(id + "Select").style.left = val + "px";
}

// "Targeting" for adjusting values to align with actual element positions, then running Setters
function targetBlock(x, y) {
    brush.s = clamp(x - paletteOffset.x, 0, 255) / 2.55;
    brush.b = (255 - clamp(y - paletteOffset.y, 0, 255)) / 2.55;
    setBlockSelectPos();
    setSwatch();
}

function targetSlider(x) {
    let a = clamp(x - paletteOffset.x, 0, 255);
    if (state.curTarget === "hue") {
        brush.h = a / 255 * 360 % 360;
    } else if (state.curTarget === "alpha") {
        brush.a = clamp((255 - a) / 255, 0, 1);
    } else if (state.curTarget === "size") {
        brush.size = Math.max(1, a);
    }
    setSelectPos(state.curTarget, a);
    setBlockColor();
    setSwatch();
}

// CANVAS FUNCTIONS

// Custom line algorithm, basically using mix() to take a bunch of "mixed" values from the two coordinates to make a line
function line(x1, y1, x2, y2) {
    let inc = 0.5 / (Math.abs(x2 - x1) + Math.abs(y2 - y1) + 1);
    for (var i = 0; i <= 1.0; i += inc) {
        drawPx(mix(x1, x2, i), mix(y1, y2, i));
    }
}

// DrawPx() just copies the pre-rendered brush print, centered at the provided x,y
function drawPx(x, y) {
    ctx.drawImage(b, Math.round(x - 0.5 * brush.size), Math.round(y - 0.5 * brush.size));
}

// Dropper gets the HSB value of the x,y pixel, then sets all the proper things
function dropper(x, y) {
    let data = ctx.getImageData(x, y, 1, 1).data;
    let hsb = rgbToHsb(data);
    brush.h = hsb[0];
    brush.s = hsb[1];
    brush.b = hsb[2];
    setSelectPos("hue", clamp(brush.h / 360 * 255, 0, 255));
    setBlockColor();
    setBlockSelectPos();
    setSwatch();
}

// Resets all state values to defaults and passed parameters and clears/centers canvas
function freshCanvas(w, h) {
    undoStack = [];
    undoIndex = -1;
    state = { cX: (window.innerWidth - w) * 0.5, cY: (window.innerHeight - h) * 0.5, cW: w, cH: h, cZ: 1.0, curTarget: "" };
    c.height = state.cH;
    c.width = state.cW;
    setCanvasPos();
    undoMake();
}

// Pre-renders brush print for copying to canvas when drawing
function establishBrush() {
    let rgb = hsbToRgb([brush.h, brush.s, brush.b]);
    b.width = b.height = brush.size;
    ctx.globalAlpha = brush.a;
    bCtx.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

    if (brush.eraser) {
        ctx.globalCompositeOperation = "destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
    }
    bCtx.clearRect(0, 0, b.width, b.height);
    if (!brush.round) {
        // Pixel brush
        bCtx.fillRect(0, 0, brush.size, brush.size);
    } else if (brush.round) {
        // Pen Brush
        brush.size *= 0.5;
        bCtx.beginPath();
        bCtx.arc(brush.size, brush.size, brush.size, 0, 6.1416);
        bCtx.fill();
        bCtx.closePath();
        brush.size *= 2;
    }
}

function promptCurrent() {
    if (state.curTarget == "hue") {
        let h = clamp(parseInt(prompt("Hue (0-360)"), 10), 0, 360);
        if (typeof h === 'number') {
            brush.h = h;
            setSelectPos("hue", clamp(brush.h / 360 * 255, 0, 255));
        }
    } else if (state.curTarget == "size") {
        let s = clamp(parseInt(prompt("Brush Size (1-255)"), 10), 1, 255);
        if (typeof s === 'number') {
            brush.s = s;
            setSelectPos("size", brush.size);
        }
    } else if (state.curTarget == "alpha") {
        let a = clamp(parseInt(prompt("Brush Opacity (0-255)"), 10) / 255.0, 0.0, 1.0);
        if (typeof a === 'number') {
            brush.a = a;
            setSelectPos("alpha", (1.0 - brush.a) * 255.0);
        }
    }
    setBlockColor();
    setSwatch();
}

/*
    THE SECTION BELOW IS RESERVED FOR DOCUMENT EVENTS
    NO PARTICULAR REASON OTHER THAT IT IS EASIER TO
    FIND THINGS WHEN THEY ARE ORGANIZED SO HERE IS
    WHERE THEY ARE GOING
*/

// Fixed with user-select and -webkit-user-selection in main.css
// window.addEventListener("selectstart", function (event) {
//     event.preventDefault();
// });

// Prevent right-click menu from showing up
document.oncontextmenu = function (e) {
    e.preventDefault();
}

// Scroll Wheel
document.onwheel = function (e) {
    let target = {
        x: (e.x - state.cX) / state.cZ,
        y: (e.y - state.cY) / state.cZ
    };

    state.cZ += e.deltaY * prefs.scrollDirection * 0.001 * state.cZ;

    target.x = target.x * state.cZ - e.x;
    target.y = target.y * state.cZ - e.y;

    state.cX = -target.x;
    state.cY = -target.y;

    setCanvasPos();
}

// Mouse down
document.onmousedown = function (e) {
    if (e.button == 2) {
        input['rightClick'] = true;
    } else {
        input['mouse'] = true;
    }

    let el = e.target;
    if (el.classList.contains('allowDraw')) {
        state.curTarget = "scene";
        if (input['rightClick']) {
            // Right click on drawable region = dropper
            dropper((e.x - state.cX) / state.cZ, (e.y - state.cY) / state.cZ);
        } else if (input['shift'] || input['alt'] || input['control'] || input[' ']) {
            // Modifier key pressed, do not draw
        } else {
            // No modifier keys, draw
            establishBrush();
            drawPx((e.x - state.cX) / state.cZ, (e.y - state.cY) / state.cZ);
            state.drawing = true;
        }
    } else if (el.id == "block" || el.id == "blockSelect") {
        state.curTarget = "block";
        targetBlock(e.x, e.y);
    } else if (el.classList.contains("slider") || el.classList.contains("select")) {
        state.curTarget = el.id.replace("Select", "");
        if (input['rightClick']) {
            deselect();
            promptCurrent();
        } else {
            targetSlider(e.x);
        }
    } else {
        state.curTarget = el.id;
    }
}

// Mouse move
document.onmousemove = function (e) {
    if (state.drawing) {
        line((prev.x - state.cX) / state.cZ, (prev.y - state.cY) / state.cZ, (e.x - state.cX) / state.cZ, (e.y - state.cY) / state.cZ);
    } else if (!input['mouse']) {

    } else if (state.curTarget == "scene") {

        if (input['shift'] || input['alt'] || input['control'] || input[' ']) {

            if (input[' ']) { // Pan canvas
                state.cX += e.x - prev.x;
                state.cY += e.y - prev.y;
                setCanvasPos();
            }

        }

    } else {
        let el = state.curTarget;
        if (el == "block") {
            targetBlock(e.x, e.y);
        } else if (el == "hue" || el == "alpha" || el == "size") {
            targetSlider(e.x);
        }
    }
    prev.x = e.x;
    prev.y = e.y;
}

// Mouse down
document.onmouseup = function (e) {
    if (e.button == 2) {
        input['rightClick'] = false;
    } else {
        input['mouse'] = false;
        if (state.drawing) {
            undoMake();
            state.drawing = false;
        }
        state.curTarget = "";
    }
}

function deselect() {
    input['rightClick'] = false;
    input['mouse'] = false;
    state.curTarget = "";
}

// Key down
document.onkeydown = function (e) {
    input[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() == "s") {
        window.open(canvas.toDataURL('image/png'));
    }
}

// Key press
document.onkeypress = function (e) {
    input[e.key.toLowerCase()] = true;
    if (input['shift']) {
        // Shift modified shortcuts

    } else if (input['control']) {
        // Control modified shortcuts
        if (input['z']) {
            undoPop();
        } else if (input['y']) {
            redoPop();
        }

    } else if (input['alt']) {
        // Alt modified shortcuts

    } else {
        // Default shortcuts
        if (input['e'] || input['q']) {
            // Q & E to adjust brush size
            brush.size += input['e'] - input['q'];
            brush.size = clamp(brush.size, 1, 256);
        }
    }

}

// Key up
document.onkeyup = function (e) {
    input[e.key.toLowerCase()] = false;
    if (e.key = " ") {
        cursor("default");
    }
}

freshCanvas(256, 256);
setSwatch();
setBlockColor();
setBlockSelectPos();
setSelectPos("hue", brush.h);
setSelectPos("size", brush.size);
setSelectPos("alpha", brush.a);