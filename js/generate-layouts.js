function drawPattern(pattern) {
  const svgns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgns, "svg");

  let width = 0;
  let height = 0;
  for (const patch of pattern.patches) {
    const rect = document.createElementNS(svgns, "rect");
    let x = patch.x * 10 + 1;
    let y = patch.y * 10 + 1;
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    let w = patch.w * 10;
    let h = patch.h * 10;
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", "white");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "1.5");
    svg.appendChild(rect);

    const label = document.createElementNS(svgns, "text");
    label.setAttribute("x", x + 6);
    label.setAttribute("y", y + 15);
    label.setAttribute("fill", "black");
    label.setAttribute("font-size", "12px");
    label.textContent = patch.w + "x" + patch.h;
    svg.appendChild(label);

    height = Math.max(height, y + h + 1);
    width = Math.max(width, x + w + 1);
  }
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  return svg;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function randomPattern(patches, maxWidth, maxHeight) {
  shuffleArray(patches);
  pattern = { patches: [], width: 0, height: 0 };
  let x = 0;
  for (p of patches) {
    let w = parseInt(p[0]);
    let h = parseInt(p[1]);
    pattern.patches.push({x:x, y:0, w:w, h:h});
    x += w;
    pattern.height = Math.max(pattern.height,h);
  }
  pattern.width = x;
  return pattern;
  let rowWidths = [0];
  let colHeights = [0];
  pattern_tmp = { patches: [], width: 0, height: 0 };
  for (const p in patches) {
    width_tmp = pattern_tmp.width;
    height_tmp = pattern_tmp.height;
    for (let x = 0; x < colHeights.length; x++) {
      let y = colHeights[x];
      for (let i = 1; i < p[0]; i++) {
        y = Math.max(y, colHeights[x + i]);
      }
    }
    for (let y = 0; y < rowWidths.length; y++) {

    }
  }
  return pattern;
}

function generateAndDraw(patchCounts) {
  let patches = [];
  let maxWidth = 0;
  let maxHeight = 0;
  for (const patchSize in patchCounts) {
    const patchCount = patchCounts[patchSize];
    const dims = patchSize.split("x");
    maxWidth += patchCount * dims[0];
    maxHeight += patchCount * dims[1];
    for (let i = 0; i < patchCount; i++) {
      patches.push(dims);
    }
  }
  let pattern = randomPattern(patches, maxWidth, maxHeight);
  maxWidth = pattern.width;
  maxHeight = pattern.height;
  return drawPattern(pattern);
}