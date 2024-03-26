// JavaScript source code


// div id's:: loginBox createBox passwordBox mainMenu

/*
        imports
*/



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - * /




/*
        Globals / Constants
*/

var loggedInBool  = false;
var pwRows = 0;
var hashedPW = "";

const jsonTemplate =
    '{ \"passwordHash\": \"\", ' +
    '  \"rows\": 0,'             + 
    '  \"accounts\": ['          +
    '       {'                   +
    '       \"account\": 0,'     +
    '       \"website\": \"\",'  +
    '       \"usernmae\": \"\",' +
    '       \"password\": \"\"'  +
    '       }'                   +
    '    ]'                      +
    '}';



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/*
        Page States
*/
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

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */



/*
        Assisstant functions
*/
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


function hashString(stringIn) {
    var hash = CryptoJS.MD5(stringIn);
    return hash;
    
}

function encryptString(stringIn) {
    var key = "hello";
    var encryptStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(stringIn), key);
    return encryptStr.toString();
}

function decryptString(stringIn) {
    var key = "hello";
    var decryptStr = CryptoJS.AES.decrypt(CryptoJS.enc.Utf8.parse(stringIn), key);
    return decryptStr.toString(CryptoJS.enc.Utf8);

}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */



/*
        Main Functions
*/



function checkNewPWValid() { // Called in account creation - Create Page

    var newPassword = getTextInput("newPWInput");
    var confNewPassword = getTextInput("confirmPWInput");

    var passwordLength = newPassword.length;

    var pwContainsNum     = false;
    var pwLongEnough      = false;
    var containsOnlyValid = true;
    var pwMatches         = false;
    
    for (var i = 0; i < 10; i++) {
        if (newPassword.includes(i)) {
            pwContainsNum = true;
        }
    }

    for (var i = 0; i < passwordLength; i++) {
        var asciiVal = newPassword.charCodeAt(i);
        if ( (asciiVal < 48) || ((asciiVal > 57) && (asciiVal < 65)) || ((asciiVal > 90) && (asciiVal < 97)) || (asciiVal > 122) ) {
            containsOnlyValid = false;
        }
    }

    if (containsOnlyValid) {
        hideElements("invalidChars");
    }
    else {
        showElements("invalidChars");
    }

    if (pwContainsNum == false) {
        showElements("noNumber");
    }
    else {
        hideElements("noNumber");
    }

    if (passwordLength >= 10) {
        pwLongEnough = true;
        hideElements("pwTooShort");
    }
    else {
        pwLongEnough = false;
        showElements("pwTooShort");
    }

    if (newPassword != confNewPassword) {
        pwMatches = false;
        showElements("pwMismatch");
    }
    else {
        pwMatches = true;
        hideElements("pwMismatch")
    }

    createButton = document.getElementById("createAccountButton");

    if (pwLongEnough && pwContainsNum && containsOnlyValid && pwMatches){
        createButton.disabled = false;
    }
    else{
        createButton.disabled = true;
    }

}



function createFileForSave() {


};


function download() // Prompts download of JSON file
{  
    const objAnchorTag = document.getElementById("downloadHREF");
    var objBlob = null;
    var strName = 'Wibble.txt';
    var strContents = jsonTemplate;
    if (objAnchorTag != null) {
        objBlob = new Blob([strContents], { type: 'text/plain' });

        objAnchorTag.href = URL.createObjectURL(objBlob);
        objAnchorTag.download = strName;
        objAnchorTag.click();
    } 
}




function importFile() { // Prompts upload of file 

    var fileIn = document.getElementById("fileInput").files[0];

    var fileRead = new FileReader();

    fileRead.readAsText(fileIn);
    alert(fileRead.result);
    

}



function getFileHash() {
    return hashString("hi");
}



<<<<<<< HEAD
function checkPWIn() { // Checks if password inputted is correct and file for decryption has been selected


    if (document.getElementById("fileInput").value != "") {

        var password = getTextInput("pwInput");

        alert(password);

        loggedInBool = true;

        setLoggedIn();
    }
    else {
        alert("No file selected.")
    }

    importFile();
=======
function checkPWIn() {
    var password = getTextInput("pwInput").toString();

    var fileHash = getFileHash();

    var str = "hi";
    alert(str);
    var enc = encryptString(str);
    alert(enc);
    var unenc = decryptString(enc);
    alert(unenc);



    if (fileHash == hashString(password).toString()) {
        loggedInBool = true;
        setLoggedIn();
    }
    else {
        alert("Incorrect credentials for selected file.");
    }
    
>>>>>>> 0255cbde86c9f71e8aabf1f28cc40340c44e226c
}




function setNewPW() {




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



