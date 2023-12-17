// JavaScript source code


// div id's:: loginBox createBox passwordBox mainMenu


var loggedInBool  = false;
var pwRows        = 0;



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

function setLoggedIn() {
    hideElements("loginBox");
    hideElements("createBox");
    showElements("passwordBox");
    hideElements("mainMenu")
};


function hideElements(groupName) {
    var element = document.getElementById(groupName);
    if ( element != null ) {
        element.style.display = 'none';
    }
};

function showElements(groupName) {
    var element = document.getElementById(groupName);
    if ( element != null ) {
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



function checkNewPWValid() {

    var newPassword = getTextInput("newPWInput");

    var passwordLength = newPassword.length;

    var pwContainsNum   = false;
    var pwLongEnough    = false;
    var containsInvalid = false;

    for (var i = 0; i < 10; i++) {
        if (newPassword.includes(i)) {
            pwContainsNum = true;
        }
    }


    for (var i = 0; i < passwordLength; i++) {
        var asciiVal = newPassword.charCodeAt(i);
        if ( (asciiVal < 48) || ((asciiVal > 57) && (asciiVal < 65)) || ((asciiVal > 90) && (asciiVal < 97)) || (asciiVal > 122) ) {
            containsInvalid = true;
        }
    }



    if (containsInvalid) {
        showElements("invalidChars");
    }
    else {
        hideElements("invalidChars");
    }


    if (pwContainsNum == false) {
        showElements("noNumber");
    }
    else {
        hideElements("noNumber");
    }

    if (passwordLength >= 10) {
        pwLongEnough = false;
        hideElements("pwTooShort");
    }
    else {
        pwLongEnough = true;
        showElements("pwTooShort");
    }




    

    createButton = document.getElementById("createAccountButton");

    if ( pwContainsNum && pwLongEnough && (containsInvalid == false)) { 
        createButton.disabled = false;
    }
    else {s
        createButton.disabled = true;
    }



}

function checkPWIn() {
    var password = getTextInput("pwInput");

    alert(password)

    loggedInBool = true;

    setLoggedIn()

}

function setNewPW() {
    setLoggedIn()
}

function checkPWValid() {
    var inputValue = getTextInput("pwInput");
    button = document.getElementById("logInButton");

    if (inputValue != "") {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}



function deleteField(currentElement) {

    var parentDiv = currentElement.parentElement;
    parentDiv.parentNode.removeChild(parentDiv);

}


function newAccountBox() {

    var parent    = document.getElementById("passwordBox");
    var newAccBox = document.createElement("div");


    var webURL = document.createElement("input");
    webURL.type  = "text";
    webURL.id = "websiteName" + pwRows;
    webURL.placeholder = "Website Name";
    newAccBox.append(webURL);

    var username = document.createElement("input");
    username.type = "text";
    username.id = "username" + pwRows;
    username.placeholder = "Username";
    newAccBox.append(username);

    var password = document.createElement("input");
    password.type = "text";
    password.id = "password" + pwRows;
    password.placeholder = "Password";
    newAccBox.append(password);

    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("onclick", "deleteField(this)");
    deleteButton.textContent = "Delete";
    newAccBox.append(deleteButton);  


    newAccBox.id = "pwFieldDiv" + pwRows; 

    parent.appendChild(newAccBox);

    pwRows += 1;

    return newAccBox;
}



function createAccountBox() {
    newAccountBox()
}



