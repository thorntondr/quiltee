function genAndDisplay() {
    // Get patch counts from local storage
    var patchCounts = JSON.parse(localStorage.getItem("patchCounts"));

    // Generate and Display layout
    var resultsContainer = document.getElementById("results-container");
    resultsContainer.replaceChildren(generateLayout(patchCounts));
}
document.addEventListener("DOMContentLoaded", function () {
    genAndDisplay();
    document.getElementById('generate-button').addEventListener(genAndDisplay);
});