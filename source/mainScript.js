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


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// checkNewPWValid - function for enabling/disabling alert elements for new acocunt creation
function checkNewPWValid() { // Called in account creation - Create Page

    var newPassword = getTextInput("newPWInput");
    var confNewPassword = getTextInput("confirmPWInput");

    var passwordLength = newPassword.length;

    var pwContainsNum     = false;
    var pwLongEnough      = false;
    var containsOnlyValid = true;
    var pwMatches         = false;
    
    for (var i = 0; i < 10; i++) {          // Check if PW contains a number 
        if (newPassword.includes(i)) {
            pwContainsNum = true;
        }
    }

    for (var i = 0; i < passwordLength; i++) {              // Check for not accepted chars - could cause issues with encryption otherwise
        var asciiVal = newPassword.charCodeAt(i);
        if ( (asciiVal < 48) || ((asciiVal > 57) && (asciiVal < 65)) || ((asciiVal > 90) && (asciiVal < 97)) || (asciiVal > 122) ) {
            containsOnlyValid = false;
        }
    }

    if (containsOnlyValid) {                  // Togggle for invalid chars alert
        hideElements("invalidChars");
    }
    else {
        showElements("invalidChars");
    }

    if (pwContainsNum == false) {              // Toggle for no number alert
        showElements("noNumber");
    }
    else {
        hideElements("noNumber");
    }
     
    if (passwordLength >= 10) {              // Check PW length (!!! if <10)
        pwLongEnough = true;
        hideElements("pwTooShort");
    }
    else {
        pwLongEnough = false;
        showElements("pwTooShort");
    }

    if (newPassword != confNewPassword) {       // Check if passwords match
        pwMatches = false;
        showElements("pwMismatch");
    }
    else {
        pwMatches = true;
        hideElements("pwMismatch")
    }

    createButton = document.getElementById("createAccountButton"); 

    if (pwLongEnough && pwContainsNum && containsOnlyValid && pwMatches){           // Enable/Disable create button if PWs follow the rules
        createButton.disabled = false;
    }
    else{
        createButton.disabled = true;
    }

}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//createFileForSave - Parses contents of all PW boxes into JSON obj
function createFileForSave()
{

    masterPW = document.getElementById("masterPW").value;


    JSONObjOut.passwordHash = hashString(masterPW);
    JSONObjOut.rows = pwRows;

    for (var i = 0; i < pwRows; i++)       // For each PW Box
    {
        
        var accountRowTemplate = JSON.parse("{ \"account\": null, \"website\": null, \"username\": null, \"password\": null}")     // Create new template OBJ

        var webURL   = encryptString(document.getElementById("websiteName" + i.toString()).value);     // Encrypt data
        var username = encryptString(document.getElementById("username" + i.toString()).value);
        var password = encryptString(document.getElementById("password" + i.toString()).value);

        accountRowTemplate.account  = i;              // Set JSON contents
        accountRowTemplate.website  = webURL;
        accountRowTemplate.username = username;
        accountRowTemplate.password = password;

        JSONObjOut.accounts.push(accountRowTemplate);     // Push to main JSON OBJ

    }
    
    return JSON.stringify(JSONObjOut);          // Return main JSON OBJ
    
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// download - called by save button to crate JSON OBJ then download to device 

function download() // Prompts download of JSON file
{  
    const objAnchorTag = document.getElementById("downloadHREF");
    fileName = document.getElementById("vaultNameLoggedIn").value;
    var objBlob = null;
 
    if (objAnchorTag != null) {                       // If HREF is found
        objBlob = new Blob([createFileForSave()], { type: 'text/plain' });       // Create new binary large obj, with contents of JSON file (above)

        objAnchorTag.href = URL.createObjectURL(objBlob); 
        objAnchorTag.download = (fileName || "PassMaster.txt");         // Set file name
        objAnchorTag.click();         // Simulate click on hidden HREF
    } 
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// importFile -  reads in file when given input to file select element

function importFile() { // Prompts upload of file 

    var fileIn = document.getElementById("fileInput").files[0];     // Gets file reference

    fileName = fileIn.name;

    var fileRead = new FileReader();        // New fileReader OBJ
    fileRead.onload = function (e) {        // ASYNC!! wait for file to load

        fileContents = e.target.result;

        JSONObj = JSON.parse(fileContents);         // Put contents into JSON obj
        pwRows  = JSONObj.rows;

        fileLoaded = true;             // set global to true - user can only continue after this is true

        return true;
        }

    fileRead.readAsText(fileIn);               // read in file, calling function above on completion

return;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// checkPWIn - checks if password hash matches the hashed input 
function checkPWIn() {

    if (document.getElementById("fileInput").value != "") {    // check if file is selected 

        var password = getTextInput("pwInput").toString();    // stringify input text for safety

        var fileHash = JSONObj.passwordHash;     // Get hash from JSON obj

        if (fileHash == hashString(password)) {     // compare hashes

            loggedInBool   = true;                    // Set vars
            PWmaster       = document.getElementById("masterPW");
            PWmaster.value = password;
            encKey         = password;

            document.getElementById("vaultNameLoggedIn").value = fileName;

            setLoggedIn();       // Call sub functions
            populateBoxes();    

            hideElements("changeText");
        }
        else {
            alert("Incorrect credentials for selected file.");   // if hashes dont match, alert
        }

    }
    else {
        alert("No file selected.")  // if file select vaule is null, alert
    }
    

}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//populateBoxes - function to create password boxes for JSON obj contents
function populateBoxes() {

    for (var i = 0; i < pwRows; i++) {      // for every row in obj...

        newAccountBoxBackend(i);       // create new account box
        var webURL   = document.getElementById("websiteName" + i.toString());      // get induvidual objs
        var username = document.getElementById("username" + i.toString());
        var password = document.getElementById("password" + i.toString());

        webURL.value   = decryptString(JSONObj.accounts[i].website);     // set values
        username.value = decryptString(JSONObj.accounts[i].username);
        password.value = decryptString(JSONObj.accounts[i].password);

    }


}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// inputFieldChange - pop up reminder to save before leaving 
function inputFieldChange() {
    showElements("changeText");
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// setNewPW - called when checkNewPW works 
function setNewPW(password) {

    setLoggedIn();     // set page state
    encKey = document.getElementById("confirmPWInput").value;        // set values of logged in page
    document.getElementById("masterPW").value = encKey;
    document.getElementById("vaultNameLoggedIn").value = document.getElementById("vaultName").value;
    
    JSONObj = jsonTemplate; // creates new JSON obj for new vault

}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// checkPWValid - checks if log in button should be enabled 
function checkPWValid() {      
    var inputValue = getTextInput("pwInput");
    button = document.getElementById("logInButton");

    if ( (inputValue != "") && ( fileLoaded ) ) {     // if file has loaded and password field is not empty, show log in button
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }


}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// toggleShowPw - function for show/hide button
function toggleShowPw(element) {

    var elementRow = element.id.replace(/[^0-9]/g, '');      // regex for extracting the number out of the element name

    var pwBox = document.getElementById("password" + elementRow);     // get input field elements

    if (pwBox.type == "password") {           // toggle visibility 
        element.textContent = "Hide";
        pwBox.type = "text";

    }
    else {
        element.textContent = "Show";
        pwBox.type = "password";
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// deleteField - deletes password row
function deleteField(currentElement) {

    var parentDiv = currentElement.parentElement;    // remove from parent div
    parentDiv.parentNode.removeChild(parentDiv);
    pwRows -= 1;          // decrement password rows global

}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */





/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// newAccountBox - function for dynamic pw box creation
function newAccountBox() {

    var parent    = document.getElementById("passwordBox");    // get parent div
    var newAccBox = document.createElement("div");

    var webURL = document.createElement("input");        // create URL input
    webURL.type  = "text";
    webURL.id = "websiteName" + pwRows;
    webURL.placeholder = "Website Name";
    webURL.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(webURL);

    var username = document.createElement("input");   // create Username input
    username.type = "text";
    username.id = "username" + pwRows;
    username.placeholder = "Username";
    username.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(username);

    var password = document.createElement("input");     // create password input
    password.type = "password";
    password.id = "password" + pwRows;
    password.placeholder = "Password";
    password.setAttribute("onkeyup", "inputFieldChange()");
    newAccBox.append(password);

    var showBox = document.createElement("button");    // create show/hide button
    showBox.id = "showButton" + pwRows;
    showBox.setAttribute("onclick", "toggleShowPw(this)")
    showBox.textContent = "Show";
    newAccBox.append(showBox);

    var deleteButton = document.createElement("button");         // create delete button
    deleteButton.setAttribute("onclick", "deleteField(this)");
    deleteButton.textContent = "Delete";
    newAccBox.append(deleteButton);  


    newAccBox.id = "pwFieldDiv" + pwRows; // set div ID

    parent.appendChild(newAccBox);   // add div to parent

    pwRows += 1;  // increment password rows global

    return newAccBox;   // return obj
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// newAccountBoxBackend - same as above but without incrementing pw rows to prevent an infinite loop
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
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// createAccountBox - calls creation for new account box
function createAccountBox() {
    newAccountBox();
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//createBinaryBackdrop - function for creating random binary divs
function createBinaryBackdrop() {

    var intY              = 0;     // set vars
    var intDivHeight      = 20;
    var objDiv            = null;
    var objParentDiv = document.getElementById( 'binaryBackdrop' );   // get parent

    if ( objParentDiv != null ) {
        for ( intY = 0; intY < (document.documentElement.clientHeight ); intY += intDivHeight ) {       // get height of screen, repeat until screen is full without overflow
            objDiv = document.createElement( 'div' );
            if ( objDiv != null ) {
                objDiv.id             = 'binaryDiv_' + binaryDivCount.toString().padStart( 4, '0' );        // create new div and add css
                objDiv.style.position = 'absolute';
                objDiv.style.top      = intY.toString() + 'px';
                objDiv.style.left     = '0px';
                objDiv.style.maxWidth = objParentDiv.offsetWidth;
                objDiv.style.height   = intDivHeight.toString() + 'px';        
                objDiv.innerHTML = '';
                objParentDiv.appendChild(objDiv);

                while (objDiv.offsetWidth < objParentDiv.offsetWidth) {
                   objDiv.innerHTML += '&nbsp;' + Math.floor(Math.random() * 2).toString() + '&nbsp;';    // fill div with random 1s and 0s
                }
                binaryDivCount++; // increment counter
                } 
            } 
        } 
}    
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


