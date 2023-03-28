function generateLayout(patchCounts) {
    const svgns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgns, "svg");
  
    let y = 1;
    let width = 0;
    for (const patchSize in patchCounts) {
      const patchCount = patchCounts[patchSize];
      for (let i = 0; i < patchCount; i++) {
        const rect = document.createElementNS(svgns, "rect");
        rect.setAttribute("x", 1);
        rect.setAttribute("y", y);
        let dims = patchSize.split("x");
        let w = parseInt(dims[0]) * 10;
        let h = parseInt(dims[1]) * 10;
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("fill", "white");
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "1.5");
        svg.appendChild(rect);
  
        const label = document.createElementNS(svgns, "text");
        label.setAttribute("x", 6);
        label.setAttribute("y", y + 15);
        label.setAttribute("fill", "black");
        label.setAttribute("font-size", "12px");
        label.textContent = patchSize;
        svg.appendChild(label);
  
        y += h;
        width = Math.max(width, w);
      }
    }
    svg.setAttribute("height", y+11);
  
    return svg;
  }
  