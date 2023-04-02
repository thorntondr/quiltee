function genAndDisplay() {
  // Generate and Display pattern
  var resultsContainer = document.getElementById("results-container");
  resultsContainer.replaceChildren(generateAndDraw());
}

function printResults() {
  const content = document.getElementById("results-container").innerHTML;
  const printWindow = window.open('', 'PrintWindow', 'height=400,width=600');
  printWindow.document.write('<html><head><title>Print Window</title>');
  printWindow.document.write('<link rel="stylesheet" type="text/css" href="style.css">');
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
