document.getElementById("generate-btn").addEventListener("click", function () {
    var patchCounts = [];
    var totalPatches = 0;

    // Get patch counts from inputs
    for (var i = 0; i < inputIds.length; i++) {
        var count = parseInt(document.getElementById(inputIds[i]).value);
        patchCounts.push(count);
        totalPatches += count;
    }

    // Make sure user has entered at least one patch
    if (totalPatches === 0) {
        alert("Please enter at least one patch.");
        return;
    }

    // Generate layouts
    var layouts = generateLayouts(patchCounts);

    // Store layouts in local storage
    localStorage.setItem("layouts", JSON.stringify(layouts));

    // Redirect to results page
    window.location.href = "results.html";
});
