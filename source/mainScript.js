// JavaScript source code


// div id's:: loginBox createBox passwordBox mainMenu



function hideElements(groupName) {
    let element = document.getElementById(groupName);
    element.classList.add("hidden");
};

function showElements(groupName) {
    let element = document.getElementById(groupName);
    element.classList.remove("hidden");
};

function setLogin() {
    showElements("loginBox");
    hideElements("createBox");
    hideElements("passwordBox");
    hideElements("mainMenu")
};

function setCreate() {
    hideElements("loginBox");
    showElements("createBox");
    hideElements("passwordBox");
    hideElements("mainMenu")
};


function setMain() {
    hideElements("loginBox");
    hideElements("createBox");
    hideElements("passwordBox");
    showElements("mainMenu") 
};



