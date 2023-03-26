document.addEventListener("DOMContentLoaded", function () {
    var inputElements = document.getElementsByTagName("input");
    document.getElementById("generate-button").addEventListener("click", function () {
        var patchCounts = {};
        var totalPatches = 0;

        // Get patch counts from inputs
        for (var i = 0; i < inputElements.length; i++) {
            var inputElement = inputElements[i];
            var id = inputElement.id;
            var count = parseInt(inputElement.value);
            if (count > 0) {
                patchCounts[id] = count;
                totalPatches += count;
            }
        }

        // Make sure user has entered at least one patch
        if (totalPatches === 0) {
            alert("Please enter at least one patch.");
            return;
        }

        // Store patch sizes and counts in local storage
        localStorage.setItem("patchCounts", JSON.stringify(patchCounts));

        // Redirect to results page
        window.location.href = "results.html";
    });
});
