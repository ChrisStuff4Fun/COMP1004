// JavaScript source code


var showBool = false;

function hidePW() {
    let element = document.getElementById("passwords");
    element.classList.add("hidden");
};

function showPW() {
    let element = document.getElementById("passwords");
    element.classList.remove("hidden");
};


function checkClick() {
    if (showBool == false) {
        showBool = true;
        showPW();
    }
    else {
        showBool = false;
        hidePW();
    }
};