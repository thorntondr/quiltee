document.addEventListener("DOMContentLoaded", function () {
    var inputElements = document.getElementsByTagName("input");
    document.getElementById("generate-button").addEventListener("click", function () {
        var blockCounts = {};
        var totalblocks = 0;

        // Get block counts from inputs
        for (var i = 0; i < inputElements.length; i++) {
            var inputElement = inputElements[i];
            var id = inputElement.id;
            var count = parseInt(inputElement.value);
            if (count > 0) {
                blockCounts[id] = count;
                totalblocks += count;
            }
        }

        // Make sure user has entered at least one block
        if (totalblocks === 0) {
            alert("Please enter at least one block.");
            return;
        }

        // Store block sizes and counts in local storage
        localStorage.setItem("blockCounts", JSON.stringify(blockCounts));

        // Redirect to results page
        window.location.href = "results.html";
    });
});
