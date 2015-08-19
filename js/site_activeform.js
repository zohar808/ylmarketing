<!--
var digits = "0123456789";
var numbers = digits + ".";
var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
var hebrewLetters = "ףךץןםאבגדהוזחטיכלמנסעפצקרשת";
var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var whitespace = " \t\n\r";
var decimalPointDelimiter = ".";
var punctuation = ", .'qw\\\"~:`!@#$%^&*()-_=+?{}[] ";
var phoneNumberDelimiters = "()- ";
var validUSPhoneChars = digits + phoneNumberDelimiters;
var validWorldPhoneChars = digits + phoneNumberDelimiters + "+";
var varchar = hebrewLetters + lowercaseLetters + uppercaseLetters + digits + punctuation + whitespace

// COLLECTION VARS
function collectionRecord(isCollectionOn) { 
   this.isCollectionOn = isCollectionOn;
}
var collectionArr = new Array;
var collectionGoingOverAllFieldsFlag = false;


function checkActiveForm(oForm){
	//var actionFormInfo = "";
	var formOKFlag = true;
	var allInputs = oForm.getElementsByTagName("INPUT");
	var allSelects = oForm.getElementsByTagName("SELECT");
	var alltextarea = oForm.getElementsByTagName("TEXTAREA");
	//if (eval(window.document.all.activeforminfo)!=null){
		//*******************************
		//* GO OVER INPUTS
		//*******************************
		for (i=0; i < allInputs.length; i++) {
			if(eval("allInputs[i].activeform")!=null){
				if (allInputs[i].activeform == "true") {
					var fieldValue = "";

					if (allInputs[i].type.toUpperCase() == "RADIO") {
						var oRadio = allInputs[i];
						result = verifyRadio(allInputs,oRadio,allInputs[i].required);
						if (result != "error"){
							//actionFormInfo += result;
							allInputs[i].className = "";
						}else{
							allInputs[i].className = "inputError";
							formOKFlag = false;
						}
					}
					
					if (allInputs[i].type.toUpperCase() == "HIDDEN" || allInputs[i].type.toUpperCase() == "TEXT") {
						fieldValue = stripInitialWhitespace(allInputs[i].value);
						result = "";
				
						var collectionName = "none";
						if (eval("allInputs[i].collection")!=null)
							collectionName = allInputs[i].collection;

						result = activeFormCreateInfoLine(
							allInputs[i].name,
							allInputs[i].required,
							fieldValue,
							allInputs[i].minsize,
							allInputs[i].maxsize,
							allInputs[i].inputtype,
							collectionName
						);
						
						if (result != "error"){
							//actionFormInfo += result;
							allInputs[i].className = "";
						}else{
							allInputs[i].className = "inputError";
							formOKFlag = false;
							if (allInputs[i].type.toUpperCase() == "HIDDEN"){
								alert("ERROR in -"+allInputs[i].name);
							}
						}
					}
				}
			}
		}
		//********************************/
		//* GO OVER SELECTS
		//********************************/
		for (i=0; i < allSelects.length; i++) {
			if(eval("allSelects[i].activeform")!=null){
				if (allSelects[i].activeform == "true") {
					var fieldValue = "";
					fieldValue = stripInitialWhitespace(allSelects[i][allSelects[i].selectedIndex].value);
					var result = "";
						
					var collectionName = "none";
					if (eval("allSelects[i].collection")!=null)
						collectionName = allSelects[i].collection;

					result = activeFormCreateInfoLine(
						allSelects[i].name,
						allSelects[i].required,
						fieldValue,
						allSelects[i].minsize,
						allSelects[i].maxsize,
						allSelects[i].inputtype,
						collectionName
					);
						
					if (result != "error"){
						//actionFormInfo += result;
						allSelects[i].className = "";
					}else{
						allSelects[i].className = "inputError";
						formOKFlag = false;
					}
				}
			}
		}	
		//********************************/
		//* GO OVER TEXTAREAS
		//********************************/
		for (i=0; i < alltextarea.length; i++) {
			if(eval("alltextarea[i].activeform")!=null){
				if (alltextarea[i].activeform == "true") {
					var fieldValue = "";
					
					if (alltextarea[i].type.toUpperCase() == "TEXTAREA") {
						fieldValue = stripInitialWhitespace(alltextarea[i].value);
						var result = "";
				
						var collectionName = "none";
						if (eval("alltextarea[i].collection")!=null)
							collectionName = alltextarea[i].collection;

						result = activeFormCreateInfoLine(
							alltextarea[i].name,
							alltextarea[i].required,
							fieldValue,
							alltextarea[i].minsize,
							alltextarea[i].maxsize,
							alltextarea[i].inputtype,
							collectionName
						);
						
						if (result != "error"){
							//actionFormInfo += result;
							alltextarea[i].className = "";
						}else{
							alltextarea[i].className = "inputError";
							formOKFlag = false;
						}
					}
				}
			}
		}				
		
		//window.document.all.activeforminfo.value = actionFormInfo;
		
		// MAKES SURE THAT IF COLLECTIONS EXIST ALL FIELDS FROM THE BEGGINING WILL BE CHECKED
		if (collectionGoingOverAllFieldsFlag == true){
			collectionGoingOverAllFieldsFlag = false; 
			return checkActiveForm(oForm);
		}else{
			collectionArr = new Array; // Clears the collection Arrayu for the next time theuser presses Submit
			if (formOKFlag == false){
				alert(" Some fields where not filled correctly ! ");
			}
			return formOKFlag;
		}
	//}else{
	//	alert('ERROR - There is no input field named-activeforminfo type-hidden ');
	//	return false;
	//}
}

function verifyRadio(collection,oRadio,required){
	var sResault;
	if(required == "true") {
		var sResault="error";
		if (oRadio.checked == "true"){//CHECKS THE SELECTED RADIO
			sResault = "ok";
		}else{ // CHECKS THE OTHER RADIOS
			for (l=0; l < collection.length; l++) {
				if(eval("collection[l].activeform")!=null){
				if (collection[l].activeform == "true") {
				if (collection[l].type.toUpperCase() == "RADIO") {
					if (collection[l].name == oRadio.name){
						if (collection[l].checked == true){
							sResault = "ok";
						}
					}
				}
				}
				}
			}
		}
	}else{
		sResault = "ok";
	}
	return sResault;
}

//*****************************************************//
//****  CREATE NEW INFO LINE AND CHECK VALITITY  ******//
//*****************************************************//
function activeFormCreateInfoLine(name,required,fieldValue,minsize,maxsize,inputtype,collectionName){
	var fieldCheckFlag = false;
	var tmpInfo = "";
						
	// CHECKS IF THE INPUT IS PART OF A COOLECTION AND
	// IF IT IS CHECKS IF ITS ON AND PERFORMS ANOTHER CHECK
	if (collectionName != "none"){
		if (eval("collectionArr[collectionName]")!=null){
			if (collectionArr[collectionName].isCollectionOn == "on"){
				required = 'true';
			}
		}else{
			if (fieldValue != "" && fieldValue != "none"){
				collectionArr[collectionName] = 
					new collectionRecord("on"); 
				collectionGoingOverAllFieldsFlag = true;
			}
		}
	}

	if (required == 'true'){
		if(fieldValue != "")   
			fieldCheckFlag = true;
	}else{
		fieldCheckFlag = true;
	}
						
	if (fieldCheckFlag == true){
		fieldCheckFlag = (fieldValue.length >= minsize)&&(fieldValue.length <= maxsize);
		if ((required != 'true')&&(fieldValue == "")){
			fieldCheckFlag = true;
		}					
	}
						
	if (fieldCheckFlag == true){
		switch(inputtype){
			case "phonenumbers":
				fieldCheckFlag = IsValidChars(fieldValue,validWorldPhoneChars);
			break;
			case "digits":
				fieldCheckFlag = IsValidChars(fieldValue,digits);
			break;
			case "numbers":
				fieldCheckFlag = IsValidChars(fieldValue,numbers);
			break;
			case "email":
				fieldCheckFlag = isValidEmail(fieldValue);
			break;
			case "lowercaseenglish":
				allInputs[i].value = fieldValue.toLowerCase();
				fieldCheckFlag = IsValidChars(fieldValue,lowercaseLetters);
			break;
			case "varchar":
				fieldCheckFlag = IsValidChars(fieldValue,varchar);
			case "all":
				fieldCheckFlag = true;
			break;
		}
	}
	
	if (fieldCheckFlag == true){
		tmpInfo += "|";
		tmpInfo += "name="+name+"&";
		tmpInfo += "minsize="+minsize+"&";
		tmpInfo += "maxsize="+maxsize+"&";
		tmpInfo += "required="+required+"&";
		tmpInfo += "inputtype="+inputtype+"&";
	}else{
		tmpInfo = "error";	
	}

	return tmpInfo;
}


document.write('<style type="text/css">\
				.inputError	{\
					border-style:solid;\
					border-color:#CD3C3C;\
					border-width:2px;\
					background-color:#F0D9D9;\
					}\
				</style>');

///////////////////////////////////////
/////// VALIDATION FUNCTIONS //////////
///////////////////////////////////////


function isValidEmail(str) {
   return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
}

function IsValidChars(sText,ValidChars){
   var IsNumber=true;
   var Char;

   for (j = 0; j < sText.length && IsNumber == true; j++) { 
      Char = sText.charAt(j); 
      if (ValidChars.indexOf(Char) == -1){
         IsNumber = false;
      }
   }
   return IsNumber;
}


function stripAllWhitespace (s){   
	return stripCharsInBag (s, whitespace)
}

function stripInitialWhitespace (s){
	var i = 0;
    while ((i < s.length)&&(s.charAt(i) == " "))
       i++;
    return s.substring(i, s.length);
}


// Removes all characters which appear in string bag from string s.
function stripCharsInBag (s, bag){
	var i;
    var returnString = "";

    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }

    return returnString;
}

// Removes all characters which do NOT appear in string bag 
// from string s.
function stripCharsNotInBag (s, bag){
	var i;
    var returnString = "";

    // Search through string's characters one by one.
    // If character is in bag, append to returnString.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) != -1) returnString += c;
    }

    return returnString;
}

-->