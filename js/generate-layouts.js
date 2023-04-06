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
  for (const block of pattern.blocks) {
    const rect = document.createElementNS(svgns, "rect");
    let x = block.x * 10;
    let y = block.y * 10;
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    let w = block.w * 10;
    let h = block.h * 10;
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
    label.textContent = block.w + "x" + block.h;
    svg.appendChild(label);

    height = Math.max(height, y + h);
    width = Math.max(width, x + w);
  }
  svg.setAttribute("viewBox", "-1 -1 " + (width + 2) + " " + (height + 2));
  svg.setAttribute("width","100%");
  const div = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.innerText = pattern.width + "x" + pattern.height;
  div.appendChild(h2);
  div.appendChild(svg);

  return div;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function costFunction(width, height) {
  return width * width + height * height;
}

function randomPattern(blocks, maxWidth, maxHeight) {
  shuffleArray(blocks);
  let pattern = { blocks: [], width: 0, height: 0 };
  let stepSize = 4;

  /// Single row
  // let x = 0;
  // for (const p of blocks) {
  //   pattern.blocks.push({x:x, y:0, w:p.w, h:p.h});
  //   x += p.w;
  //   pattern.height = Math.max(pattern.height,p.h);
  // }
  // pattern.width = x;
  // return pattern;

  /// Real thing
  let rowWidths = [0];
  let colHeights = [0];
  let TRban = {};
  let TLban = {};
  let BRban = {};
  let BLban = {};
  for (const b of blocks) {
    let p = b;
    if (Math.random() < 0.5) {
      p = {w:b.h, h:b.w};
    }
    let min_cost = costFunction(maxWidth, maxHeight);
    let X = Math.max.apply(Math, rowWidths);
    let Y = Math.max.apply(Math, colHeights);
    for (let x = 0; x < colHeights.length; x += stepSize) {
      let y = colHeights[x];
      for (let i = 1; i < p.w; i++) {
        y = Math.max(y, colHeights[x + i]);
      }
      if (!TRban[(x + p.w - 1) + "," + (y)] && !TLban[x + "," + y] && !BRban[(x + p.w - 1) + "," + (y + p.h - 1)] && !BLban[(x) + "," + (y + p.h - 1)]) {
        let w_tmp = Math.max(pattern.width, x + p.w);
        let h_tmp = Math.max(pattern.height, y + p.h);
        let cost = costFunction(w_tmp, h_tmp);
        if (cost < min_cost) {
          min_cost = cost;
          X = x;
          Y = y;
        }
      }
    }
    for (let y = 0; y < rowWidths.length; y += stepSize) {
      let x = rowWidths[y];
      for (let i = 1; i < p.h; i++) {
        x = Math.max(x, rowWidths[y + i]);
      }
      if (!TRban[(x + p.w - 1) + "," + (y)] && !TLban[x + "," + y] && !BRban[(x + p.w - 1) + "," + (y + p.h - 1)] && !BLban[(x) + "," + (y + p.h - 1)]) {
        let w_tmp = Math.max(pattern.width, x + p.w);
        let h_tmp = Math.max(pattern.height, y + p.h);
        let cost = costFunction(w_tmp, h_tmp);
        if (cost < min_cost) {
          min_cost = cost;
          X = x;
          Y = y;
        }
      }
    }
    {
      TRban[(X - 1) + ',' + (Y + p.h)] = true;
      TLban[(X + p.w) + ',' + (Y + p.h)] = true;
      BRban[(X - 1) + ',' + (Y - 1)] = true;
      BLban[(X + p.w) + ',' + (Y - 1)] = true;
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
    pattern.blocks.push({ x: X, y: Y, w: p.w, h: p.h });
    pattern.width = Math.max(pattern.width, X + p.w);
    pattern.height = Math.max(pattern.height, Y + p.h);
  }
  return pattern;
}

function* patternGenerator() {
  // Get block counts from local storage
  var blockCounts = JSON.parse(localStorage.getItem("blockCounts"));

  let blocks = [];
  let maxWidth = 0;
  let maxHeight = 0;
  for (const blockSize in blockCounts) {
    const blockCount = blockCounts[blockSize];
    const dims = blockSize.split("x");
    const w = parseInt(dims[0]);
    const h = parseInt(dims[1]);
    maxWidth += blockCount * w;
    maxHeight += blockCount * h;
    for (let i = 0; i < blockCount; i++) {
      blocks.push({ w: w, h: h });
    }
  }

  const minimumTime = 1500;
  const maximumTime = 5000;
  let results = [];
  let minCost = costFunction(maxWidth, maxHeight);
  let startTime = new Date().getTime();
  while (true) {
    let pattern = randomPattern(blocks, maxWidth, maxHeight);
    const currentTime = new Date().getTime();
    const elapsed = currentTime - startTime;
    let cost = costFunction(pattern.width, pattern.height);
    if (cost <= minCost
      //  && Math.max(pattern.width, pattern.height) < 2 * Math.min(pattern.width, pattern.height)
       ) {
      if (cost < minCost) {
        if (elapsed < minimumTime) {
          results = [];
        }
        minCost = cost;
      }
      results.push(pattern);
    }
    if (elapsed >= minimumTime && results.length > 0) {
      let result = results.pop();
      console.log("New pattern " + result.width + "x" + result.height);
      yield result;
    } else if (elapsed > maximumTime) {
      console.log("Resetting target size and timer");
      startTime = currentTime; // reset timer
      minCost = costFunction(maxWidth, maxHeight);  // reset target size
    } else if (results.length == 0) {
      // if (elapsed >= minimumTime) {
      //   console.log(elapsed + " "  + minCost);
      //   // yield { width: 40, height: 40, blocks: [{ x: 0, y: 0, w: 40, h: 40 }] };
      // }
      // console.log("No results");
    } else if (elapsed >= minimumTime) {
      console.log("past the limit, but trying again anyway for some reason");
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