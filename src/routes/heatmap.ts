import type { Color } from "./types";

export function lerpColor(color1: Color, color2: Color, t: number) {
  const r = color1.r + t * (color2.r - color1.r);
  const g = color1.g + t * (color2.g - color1.g);
  const b = color1.b + t * (color2.b - color1.b);
  return { r: r, g: g, b: b };
}

export function floatToColor(data: number) {
    var black = {r: 0, g: 0, b: 0};
    var red = {r: 255, g: 0, b: 0};
    var yellow = {r: 255, g: 255, b: 0};
    var green = {r: 0, g: 255, b: 0};

    if (data < 0.33) {
        return lerpColor(black, red, data / 0.33);
    }
    if (data < 0.66) {
        return lerpColor(red, yellow, (data - 0.33) / 0.33);
    }
    return lerpColor(yellow, green, (data - 0.66) / 0.33);
}
