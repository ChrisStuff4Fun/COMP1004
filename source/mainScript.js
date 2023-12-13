// JavaScript source code


// div id's:: loginBox createBox passwordBox mainMenu



function hideElements(groupName) {
    let element = document.getElementById(groupName);
    if ( element != null ) {
        //element.classList.add("hidden");
        element.style.display = 'none';
    }
};

function showElements(groupName) {
    let element = document.getElementById(groupName);
    if ( element != null ) {
        //element.classList.remove("hidden");
        element.style.display = 'block';
    }
};

function getTextInput(inputID) {

    var input = document.getElementById(inputID);
    var value = "";

    if (input != null){
        value = input.value;
    }

    return value;
}



function checkPWIn() {
    var password = getTextInput("pwInput");

    alert(password)

}



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



