function genAndDisplay() {
    // Get patch counts from local storage
    var patchCounts = JSON.parse(localStorage.getItem("patchCounts"));

    // Generate and Display pattern
    var resultsContainer = document.getElementById("results-container");
    resultsContainer.replaceChildren(generateAndDraw(patchCounts));
}
function printResults() {
  const content = document.getElementById("results-container").innerHTML;
  const printWindow = window.open('', 'PrintWindow', 'height=400,width=600');
  printWindow.document.write('<html><head><title>Print Window</title>');
  printWindow.document.write('</head><body >');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
document.addEventListener("DOMContentLoaded", function () {
    genAndDisplay();
    document.getElementById('generate-button').addEventListener("click", genAndDisplay);
    document.getElementById('print-button').addEventListener("click", printResults);
});
