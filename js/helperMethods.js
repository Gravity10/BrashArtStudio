// Useful helper methods to avoid code duplication

// Clamp method from glsl

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

// mix method from glsl

function mix(a, b, c) {
    return (1 - c) * a + c * b;
}

// Convert HSB array into an RGB array

function hsbToRgb(arr) {
    return [
        mix(255, clamp(510 - Math.min(arr[0], Math.abs(360 - arr[0])) * 255 / 60, 0, 255), arr[1] * 0.01) * arr[2] * 0.01,
        mix(255, clamp(510 - Math.abs(arr[0] - 120) * 255 / 60, 0, 255), arr[1] * 0.01) * arr[2] * 0.01,
        mix(255, clamp(510 - Math.abs(arr[0] - 240) * 255 / 60, 0, 255), arr[1] * 0.01) * arr[2] * 0.01
    ];
}

// Convert RGB array to  HSB array
/*
    This is one of the most performant versions I found for converting RGB values to HSB ones
*/

function rgbToHsb(rgb) {
    let a, max, hue;
    max = a = Math.max(rgb[0], rgb[1], rgb[2]);
    a -= Math.min(rgb[0], rgb[1], rgb[2]);

    if (a == 0) {
        return [0, 0, max / 2.55];
    } else if (rgb[0] == max) {
        hue = (rgb[1] - rgb[2]) * a;
    } else if (rgb[1] == max) {
        hue = 2.0 + (rgb[2] - rgb[0]) * a;
    } else {
        hue = 4.0 + (rgb[0] - rgb[1]) * a;
    }

    return [(hue * 60 + 360) % 360, a / max * 100, max / 2.55];
}

function intPrompt(str, low, high) {
    let r = clamp(parseInt(prompt(str + " (" + low + "-" + high + ")"), 10), low, high);
    return (typeof r === "number") ? r : null;
}