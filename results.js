// Get layouts from local storage
var layouts = JSON.parse(localStorage.getItem("layouts"));

// Display layouts
var resultsContainer = document.getElementById("results-container");
for (var j = 0; j < layouts.length; j++) {
    var canvas = createCanvas(layouts[j]);
    resultsContainer.appendChild(canvas);
}
