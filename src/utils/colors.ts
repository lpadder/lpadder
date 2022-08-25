/**
 * Most of this code was translated from C# to JS.
 * Source from <https://github.com/mat1jaczyyy/apollo-studio/blob/master/Apollo/Structures/Color.cs>.
 */
import { DEFAULT_RGB_UI_PAD } from "./palettes";


/** Converts an RGB color value to HSV. */
const rgbToHsv = ([r, g, b]: number[]) => {
  r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);

  let hue = 0;
  if (max !== min) {
    const diff = max - min;

    if (max === r) {
      hue = (g - b) / diff;
    }
    else if (max === g) {
      hue = (b - r) / diff + 2.0;
    }
    else if (max === b) {
      hue = (r - g) / diff + 4.0;
    }
    if (hue < 0) hue += 6.0;
  }

  let saturation = 0;
  if (max !== 0) saturation = 1 - (min / max);

  return [hue * 60, saturation, max];
};

export const getUIColor = (rgb: number[]) => {
  let [h, s, val] = rgbToHsv(rgb);
  s = Math.pow(s, 1.8);
  val = Math.pow(val, 1 / 4.5);

  let fr, fg, fb;

  h /= 60;

  const hi = Math.floor(h) % 6;
  const f = h - Math.floor(h);
  val *= 255;

  const v = val;
  const p = val * (1 - s);
  const q = val * (1 - f * s);
  const t = val * (1 - (1 - f) * s);

  if (hi === 0)      [fr, fg, fb] = [v, t, p];
  else if (hi === 1) [fr, fg, fb] = [q, v, p];
  else if (hi === 2) [fr, fg, fb] = [p, v, t];
  else if (hi === 3) [fr, fg, fb] = [p, q, v];
  else if (hi === 4) [fr, fg, fb] = [t, p, v];
  else              [fr, fg, fb] = [v, p, q];

  const max = Math.max(fr, fg, fb) / 255;
  const bg = {
    R: DEFAULT_RGB_UI_PAD[0],
    G: DEFAULT_RGB_UI_PAD[1],
    B: DEFAULT_RGB_UI_PAD[2]
  };

  const new_color = [
    Math.round((fr * max + bg.R * (1 - max))),
    Math.round((fg * max + bg.G * (1 - max))),
    Math.round((fb * max + bg.B * (1 - max)))
  ];

  return new_color;
};
