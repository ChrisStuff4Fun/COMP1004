// JavaScript source code


// div id's:: loginBox createBox passwordBox mainMenu

/*
        imports
*/



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - * /




/*
        Globals / Constants
*/

const jsonTemplate = JSON.parse("{\"passwordHash\": null, \"rows\": 0, \"accounts\": []}"); 

var loggedInBool = false;
var fileLoaded   = false;

var pwRows         = 0;
var binaryDivCount = 0;

var hashedPW     = "";
var fileContents = "";
var fileName     = "";
var encKey       = "";


var JSONObj    = JSON.parse("{}");
var JSONObjOut = jsonTemplate;

    



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
    hideElements("mainMenu");
};
function setMain() {
    hideElements("loginBox");
    hideElements("createBox");
    hideElements("passwordBox");
    showElements("mainMenu");
};

function setLoggedIn() {
    hideElements("loginBox");
    hideElements("createBox");
    showElements("passwordBox");
    hideElements("mainMenu");
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
    return hash.toString();
    
}

function encryptString(stringIn) {
    var encryptStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(stringIn), encKey);
    return encryptStr.toString();
}

function decryptString(stringIn) {
    var decryptStr = CryptoJS.AES.decrypt(stringIn, encKey);
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

    if (passwordLength >= 5) {
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



function createFileForSave()
{

    masterPW = document.getElementById("masterPW").value;


    JSONObjOut.passwordHash = hashString(masterPW);
    JSONObjOut.rows = pwRows;

    for (var i = 0; i < pwRows; i++)
    {
        
        var accountRowTemplate = JSON.parse("{ \"account\": null, \"website\": null, \"username\": null, \"password\": null}")

        var webURL   = encryptString(document.getElementById("websiteName" + i.toString()).value);
        var username = encryptString(document.getElementById("username" + i.toString()).value);
        var password = encryptString(document.getElementById("password" + i.toString()).value);

        accountRowTemplate.account  = i;
        accountRowTemplate.website  = webURL;
        accountRowTemplate.username = username;
        accountRowTemplate.password = password;

        JSONObjOut.accounts.push(accountRowTemplate);

    }
    
    return JSON.stringify(JSONObjOut);
    
};


function download() // Prompts download of JSON file
{  
    const objAnchorTag = document.getElementById("downloadHREF");
    fileName = document.getElementById("vaultNameLoggedIn").value;
    var objBlob = null;
 
    if (objAnchorTag != null) {
        objBlob = new Blob([createFileForSave()], { type: 'text/plain' });

        objAnchorTag.href = URL.createObjectURL(objBlob);
        objAnchorTag.download = (fileName || "PassMaster.txt");
        objAnchorTag.click();
    } 
}


function importFile() { // Prompts upload of file 

    var fileIn = document.getElementById("fileInput").files[0];

    fileName = fileIn.name;

    var fileRead = new FileReader();
    fileRead.onload = function (e) {  

        fileContents = e.target.result;

        JSONObj = JSON.parse(fileContents);
        pwRows  = JSONObj.rows;

        fileLoaded = true;

        return true;
        }

    fileRead.readAsText(fileIn);

return;
}


function checkPWIn() {

    if (document.getElementById("fileInput").value != "") {

        var password = getTextInput("pwInput").toString();

        var fileHash = JSONObj.passwordHash;

        if (fileHash == hashString(password)) {

            loggedInBool   = true;
            PWmaster       = document.getElementById("masterPW");
            PWmaster.value = password;
            encKey         = password;

            document.getElementById("vaultNameLoggedIn").value = fileName;

            setLoggedIn();
            populateBoxes();    

            hideElements("changeText");
        }
        else {
            alert("Incorrect credentials for selected file.");
        }

    }
    else {
        alert("No file selected.")
    }
    

}

function populateBoxes() {

    for (var i = 0; i < pwRows; i++) {

        newAccountBoxBackend(i);
        var webURL   = document.getElementById("websiteName" + i.toString());
        var username = document.getElementById("username" + i.toString());
        var password = document.getElementById("password" + i.toString());

        webURL.value   = decryptString(JSONObj.accounts[i].website);
        username.value = decryptString(JSONObj.accounts[i].username);
        password.value = decryptString(JSONObj.accounts[i].password);

    }


}
function inputFieldChange() {
    showElements("changeText");
}

function setNewPW(password) {

    setLoggedIn();
    encKey = document.getElementById("confirmPWInput").value;
    document.getElementById("masterPW").value = encKey;
    document.getElementById("vaultNameLoggedIn").value = document.getElementById("vaultName").value;
    
    JSONObj = jsonTemplate; 

}

function checkPWValid() {     
    var inputValue = getTextInput("pwInput");
    button = document.getElementById("logInButton");

    if ( (inputValue != "") && ( fileLoaded ) ) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }


}



function toggleShowPw(element) {

    var elementRow = element.id.replace(/[^0-9]/g, '');

    var pwBox = document.getElementById("password" + elementRow);

    if (pwBox.type == "password") {
        element.textContent = "Hide";
        pwBox.type = "text";

    }
    else {
        element.textContent = "Show";
        pwBox.type = "password";
    }
}

function deleteField(currentElement) {

    var parentDiv = currentElement.parentElement;
    parentDiv.parentNode.removeChild(parentDiv);
    pwRows -= 1;

}


function newAccountBox() {

    var parent    = document.getElementById("passwordBox");
    var newAccBox = document.createElement("div");

    var webURL = document.createElement("input");
    webURL.type  = "text";
    webURL.id = "websiteName" + pwRows;
    webURL.placeholder = "Website Name";
    webURL.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(webURL);

    var username = document.createElement("input");
    username.type = "text";
    username.id = "username" + pwRows;
    username.placeholder = "Username";
    username.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(username);

    var password = document.createElement("input");
    password.type = "password";
    password.id = "password" + pwRows;
    password.placeholder = "Password";
    password.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(password);

    var showBox = document.createElement("button");
    showBox.id = "showButton" + pwRows;
    showBox.setAttribute("onclick", "toggleShowPw(this)")
    showBox.textContent = "Show";
    newAccBox.append(showBox);

    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("onclick", "deleteField(this)");
    deleteButton.textContent = "Delete";
    newAccBox.append(deleteButton);  


    newAccBox.id = "pwFieldDiv" + pwRows; 

    parent.appendChild(newAccBox);

    pwRows += 1;

    return newAccBox;
}

function newAccountBoxBackend(rowNum) {

    var parent = document.getElementById("passwordBox");
    var newAccBox = document.createElement("div");

    var webURL = document.createElement("input");
    webURL.type = "text";
    webURL.id = "websiteName" + rowNum;
    webURL.placeholder = "Website Name";
    webURL.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(webURL);

    var username = document.createElement("input");
    username.type = "text";
    username.id = "username" + rowNum;
    username.placeholder = "Username";
    username.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(username);

    var password = document.createElement("input");
    password.type = "password";
    password.id = "password" + rowNum;
    password.placeholder = "Password";
    password.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(password);

    var showBox = document.createElement("button");
    showBox.id = "showButton" + rowNum;
    showBox.setAttribute("onclick", "toggleShowPw(this)")
    showBox.textContent = "Show";
    newAccBox.append(showBox);

    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("onclick", "deleteField(this)");
    deleteButton.textContent = "Delete";
    newAccBox.append(deleteButton);

    newAccBox.id = "pwFieldDiv" + rowNum;

    parent.appendChild(newAccBox);

    return newAccBox;
}


function createAccountBox() {
    newAccountBox();
}

function createBinaryBackdrop() {

    var intY              = 0;
    var intDivHeight      = 20;
    var objDiv            = null;
    var objParentDiv = document.getElementById( 'binaryBackdrop' );

    if ( objParentDiv != null ) {
        for ( intY = 0; intY < (document.documentElement.clientHeight ); intY += intDivHeight ) {
            objDiv = document.createElement( 'div' );
            if ( objDiv != null ) {
                objDiv.id             = 'binaryDiv_' + binaryDivCount.toString().padStart( 4, '0' );
                objDiv.style.position = 'absolute';
                objDiv.style.top      = intY.toString() + 'px';
                objDiv.style.left     = '0px';
                objDiv.style.maxWidth = objParentDiv.offsetWidth;
                objDiv.style.height   = intDivHeight.toString() + 'px';
                objDiv.innerHTML = '';
                objParentDiv.appendChild(objDiv);

                while (objDiv.offsetWidth < objParentDiv.offsetWidth) {
                   objDiv.innerHTML += '&nbsp;' + Math.floor(Math.random() * 2).toString() + '&nbsp;';
                }
                binaryDivCount++;
                } //if-div-created
            } //for-y
        } //if

return;
}    