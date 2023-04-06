function selectResult(result) {
  // Generate and Display pattern
  let patternContainer = document.getElementById("pattern-container");
  patternContainer.replaceChildren(result.cloneNode(true));
}

function printResults() {
  const content = document.getElementById("pattern-container").innerHTML;
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

function addNewPattern() {
  // Generate and Display pattern
  let resultsContainer = document.getElementById("results-container");
  let outerDiv = document.createElement("div");
  outerDiv.classList.add("result");
  let result = generateAndDraw();
  outerDiv.addEventListener("click", () => {selectResult(result);});
  outerDiv.appendChild(result);
  resultsContainer.appendChild(outerDiv);
  return result;
}

document.addEventListener("DOMContentLoaded", function () {
  result = addNewPattern();
  selectResult(result);
  document.getElementById('generate-button').addEventListener("click", addNewPattern);
  document.getElementById('print-button').addEventListener("click", printResults);
});
