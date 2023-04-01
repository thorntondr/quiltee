function drawPattern(pattern) {
  const svgns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgns, "svg");
  const rect = document.createElementNS(svgns, "rect");
  rect.setAttribute("fill", "gray");
  rect.setAttribute("width", "100%");
  rect.setAttribute("height", "100%");
  svg.appendChild(rect);

  let width = 0;
  let height = 0;
  for (const patch of pattern.patches) {
    const rect = document.createElementNS(svgns, "rect");
    let x = patch.x * 10;
    let y = patch.y * 10;
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

    height = Math.max(height, y + h);
    width = Math.max(width, x + w);
  }
  svg.setAttribute("viewBox", "-1 -1 " + (width + 2) + " " + (height + 2));

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
  let pattern = { patches: [], width: 0, height: 0 };

  /// Single row
  // let x = 0;
  // for (const p of patches) {
  //   pattern.patches.push({x:x, y:0, w:p.w, h:p.h});
  //   x += p.w;
  //   pattern.height = Math.max(pattern.height,p.h);
  // }
  // pattern.width = x;
  // return pattern;

  /// Real thing
  let rowWidths = [0];
  let colHeights = [0];
  for (const p of patches) {
    let min_area = maxWidth * maxHeight;
    let X = Math.max.apply(Math, rowWidths);
    let Y = Math.max.apply(Math, colHeights);
    for (let x = 0; x < colHeights.length; x++) {
      let y = colHeights[x];
      for (let i = 1; i < p.w; i++) {
        y = Math.max(y, colHeights[x + i]);
      }
      let w_tmp = Math.max(pattern.width, x + p.w);
      let h_tmp = Math.max(pattern.height, y + p.h);
      // if (Math.max(w_tmp, h_tmp) <= 1.6 * Math.min(w_tmp, h_tmp))
      {
        let area = w_tmp * h_tmp;
        if (area < min_area) {
          min_area = area;
          X = x;
          Y = y;
        }
      }
    }
    for (let y = 0; y < rowWidths.length; y++) {
      let x = rowWidths[y];
      for (let i = 1; i < p.h; i++) {
        x = Math.max(x, rowWidths[y + i]);
      }
      let w_tmp = Math.max(pattern.width, x + p.w);
      let h_tmp = Math.max(pattern.height, y + p.h);
      // if (Math.max(w_tmp, h_tmp) <= 1.6 * Math.min(w_tmp, h_tmp))
      {
        let area = w_tmp * h_tmp;
        if (area < min_area) {
          min_area = area;
          X = x;
          Y = y;
        }
      }
    }
    for (let i = 0; i < p.w; i++) {
      if ((X + i) >= colHeights.length) {
        colHeights.push(0);
      }
      colHeights[X + i] = Math.max(colHeights[X + i], Y + p.h);
    }
    for (let i = 0; i < p.h; i++) {
      if ((Y + i) >= rowWidths.length) {
        rowWidths.push(0);
      }
      rowWidths[Y + i] = Math.max(rowWidths[Y + i], X + p.w);
    }
    pattern.patches.push({ x: X, y: Y, w: p.w, h: p.h });
    pattern.width = Math.max(pattern.width, X + p.w);
    pattern.height = Math.max(pattern.height, Y + p.h);
  }
  return pattern;
}

function* patternGenerator() {
  // Get patch counts from local storage
  var patchCounts = JSON.parse(localStorage.getItem("patchCounts"));

  let patches = [];
  let maxWidth = 0;
  let maxHeight = 0;
  for (const patchSize in patchCounts) {
    const patchCount = patchCounts[patchSize];
    const dims = patchSize.split("x");
    const w = parseInt(dims[0]);
    const h = parseInt(dims[1]);
    maxWidth += patchCount * w;
    maxHeight += patchCount * h;
    for (let i = 0; i < patchCount; i++) {
      patches.push({ w: w, h: h });
    }
  }

  const minimumTime = 1000;
  const maximumTime = 5000;
  let results = [];
  let bestArea = maxWidth * maxHeight;
  let startTime = new Date().getTime();
  while (true) {
    let pattern = randomPattern(patches, maxWidth, maxHeight);
    let area = pattern.width * pattern.height;
    if (area <= bestArea && Math.max(pattern.width, pattern.height) < 2 * Math.min(pattern.width, pattern.height)) {
      if (area < bestArea) {
        results = [];
        bestArea = area;
      }
      results.push(pattern);
    }
    const currentTime = new Date().getTime();
    const elapsed = currentTime - startTime;
    if (elapsed >= minimumTime && results.length > 0) {
      let result = results.pop();
      console.log("New pattern "+result.width+"x"+result.height);
      yield result;
    } else if (elapsed > maximumTime) {
      console.log("Resetting target size and timer");
      startTime = currentTime; // reset timer
      bestArea = maxWidth * maxHeight;  // reset target size
    } else if (results.length == 0) {
      console.log("No results");
    } else if (elapsed >= minimumTime) {
      console.log("past the limit, but trying again anyway");
    }
  }
}

var patterns = null;

function generateAndDraw() {
  if (patterns === null) {
    patterns = patternGenerator();
  }
  let pattern = patterns.next().value;
  return drawPattern(pattern);
}