document.addEventListener("DOMContentLoaded", function(event) {
    var thumbnailElement =document.getElementById("smart");

    thumbnailElement.addEventListener("click", function() {
        if (thumbnailElement.className == "") {
            thumbnailElement.className = "smart";
        }
        else {thumbnailElement.className = "";}
        });

        
});