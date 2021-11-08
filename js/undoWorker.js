var undoStack = new Uint8ClampedArray();
var undoIndex = -1;

onmessage = function (e) { parseInput(e.data) }

function parseInput(data) {
    if (typeof data === "string") {
        switch (data) {
            case ("undo"):
                break;
            case ("redo"):
                break;
        }
    } else {

    }
}