let lastHue = Math.floor(Math.random() * 360);
const MIN_HUE_DISTANCE = 50;

export default function generateDistinctHexColor() {
  let newHue;

  do {
    newHue = Math.floor(Math.random() * 360);
  } while (Math.abs(newHue - lastHue) < MIN_HUE_DISTANCE);

  lastHue = newHue;

  const saturation = 65 + Math.random() * 20;
  const lightness = 45 + Math.random() * 15;

  return hslToHex(newHue, saturation, lightness);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) =>
        Math.round(255 * x)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
