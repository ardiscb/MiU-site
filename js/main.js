/*
Author: Courtney Ardis 
Project: Web App Part 4
Term: 1207
*/

//This javascript file is linked to addItem.html

//Wait until DOM is ready
window.addEventListener("DOMContentLoaded", function() {
	
	//'$' used by jquery and jqmobile as reserved word; changed function name to 'e' for future use
	//getElementById Function
	function e(x){
		var theElement = document.getElementById(x);
		return theElement;
	}
	//Variable defaults
	var comicGenre = ["--Choose A Genre--", "Superhero", "Horror", "Sci-fi", "Western", "Romance"],
		styleValue,
		errMsg = e('errors');

	//Select field and options populated
	function makeGenre(){
		var formTag = document.getElementsByTagName("form"), //formTag is an array of all the form tags
			selectLi = e("select"),
			makeSelect = document.createElement("select");
		makeSelect.setAttribute("id", "genre");
		for(var i=0, j=comicGenre.length; i<j; i++){
			var makeOption = document.createElement("option");
			var	optText = comicGenre[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}
	
	//Find value of the selected radio button for the storeData function
	function getSelectedRadio(){
		var radios = document.forms[0].illStyle;
		for(var i=0; i<radios.length; i++){
			if(radios[i].checked){
				styleValue = radios[i].value;
			}
		}
	}

	//Toggle how the comicForm, clearData, displayData, and addNew links display on the addItem.html page
	function toggleControls(n){
		switch(n){
			case "on":
				e('comicForm').style.display = "none";
				e('clearData').style.display = "inline";
				e('displayData').style.display = "none";
				e('addNew').style.display = "inline";				
				break;
			case "off":
				e('comicForm').style.display = "block";
				e('clearData').style.display = "inline";
				e('displayData').style.display = "inline";
				e('addNew').style.display = "none";
				e('items').style.display = "none";
				break;
			default:
				return false;
		}
	}

	//Function that stores the form fields into Local Storage with a key and value
	function storeData(key){
		//If there is no key, this is a brand new item and we need to generate a key
		if(!key){
			var id    			= Math.floor(Math.random()*100000000001);	
		}else{
			//Set the id to the existing key that we are editing so that it will save over the data
			//The key is the same key that's been passed along from the editSubmit event
			//to the validate function, and then passed here, into the storeData function
			id = key;
		}
		//Gather up all our form field values and store in an object
		//Object properties contain an array with the form label and input value
		getSelectedRadio();
		var item 				= {};
			item.comicTitle		= ["Title of Comic:", e('comicTitle').value];
			item.seriesTitle	= ["Title of Series:", e('seriesTitle').value];
			item.issueNum		= ["Issue Number:", e('issueNum').value];
			item.dateReleased	= ["Date Released:", e('dateReleased').value];
			item.publisher		= ["Publisher:", e('publisher').value];
			item.rateIssue		= ["Rate of Issue:", e('rateIssue').value];
			item.genre 			= ["Genre:", e('genre').value];
			item.illStyle		= ["Illustration Style:", styleValue];
			item.comments		= ["Comments:", e('comments').value];
		//Save data into Local Storage: Use Stringify to convert our object to a string
		localStorage.setItem(id, JSON.stringify(item));
		alert("Comic saved to index!");
	}

	//Function that displays the data that has been saved into Local Storage
	function getData(){
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in Local Storage so default data was added.");
			autoFillData();
		}
		//Write Data from Local Storage to the browser
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		e('items').style.display = "block";
		for(var i=0, j=localStorage.length; i<j; i++){
			var makeLi = document.createElement('li');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert the string from local storage value back to an object by using JSON.parse()
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			getImage(obj.genre[1], makeSubList);
			for (var n in obj){
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0] + " " + obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi);//Function call for our edit and delete buttons/links
		}
	}

	//Get the image for the right category
	function getImage(catName, makeSubList){
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "images/" + catName + ".png");
		imageLi.appendChild(newImg);
	}

	//Auto Popluate Local Storage
	function autoFillData(){
		//The actual JSON OBJECT data required for this to work is coming from our json.js file, which is loaded from our HTML page
		//Store JSON OBJECT into Local Storage
		for(var n in json){
			var id = Math.floor(Math.random()*100000000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}

	//Make Item Links
	//Create the edit and delete links for each stored item when displayed
	function makeItemLinks(key, linksLi){
		//add edit single item link
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Comic";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);

		//add line break for links
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);

		//add delete single item link
		var deleteLink = document.createElement('a');
		deleteLink.setAttribute("id", "deleteA");
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Comic";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);

		//Creates a horizontal line/separator after each item
		var hr = document.createElement('hr');
		linksLi.appendChild(hr);
	}

	//Function that allows for a single item to be edited
	function editItem(){
		//Grab the data from our item in Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//Show the form
		toggleControls("off");

		//populate the form fields with current Local Storage values
		e('comicTitle').value 	= item.comicTitle[1];
		e('seriesTitle').value 	= item.seriesTitle[1];
		e('issueNum').value 	= item.issueNum[1];
		e('dateReleased').value = item.dateReleased[1];
		e('publisher').value 	= item.publisher[1];
		e('rateIssue').value 	= item.rateIssue[1];
		e('rangeValue').value 	= item.rateIssue[1];
		e('genre').value 		= item.genre[1];
		var radios = document.forms[0].illStyle;
		for(var i=0; i<radios.length; i++){
			if(radios[i].value == "Full Color" && item.illStyle[1] == "Full Color"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Black & White" && item.illStyle[1] == "Black & White"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Combination" && item.illStyle[1] == "Combination"){
				radios[i].setAttribute("checked", "checked");
			}
		}
		e('comments').value 	= item.comments[1];

		//Remove the initial listener from the input 'save comic' button
		save.removeEventListener("click", storeData);
		//Change Submit button value to Edit button
		e('submit').value = "Edit Comic";
		var editSubmit = e('submit');
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	}

	//Function that deletes a single item from Local Storage
	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this comic?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Comic was deleted!");
			window.location.reload();
		}else{
			alert("Comic was NOT deleted!");
		}
	}

	//Function that clears all the items that have been saved in Local Storage
	function clearLocal(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			localStorage.clear();
			alert("All comics were deleted!");
			window.location.reload();
			return false;
		}
	}

	//Function that validates input fields
	function validate(t){
		//Define the elements we want to check
		var getComicTitle 	= e('comicTitle');
		var getIssueNum 	= e('issueNum');
		var getPublisher 	= e('publisher');
		var getGenre 		= e('genre');

		//Reset Error Messages
		errMsg.innerHTML = "";
		getComicTitle.style.border = "2px inset";
		getIssueNum.style.border = "2px inset";
		getPublisher.style.border = "2px inset";
		getGenre.style.border = "2px inset";

		//Get Error Messages
		var messageArray = [];
		//Comic Title Validation
		if(getComicTitle.value === ""){
			var comicTitleError = "Please enter a comic title.";
			getComicTitle.style.border = "1px solid red";
			messageArray.push(comicTitleError);
		}
		//Issue Number Validation

		if(getIssueNum.value === ""){
			var issueNumError = "Please enter an issue number.";
			getIssueNum.style.border = "1px solid red";
			messageArray.push(issueNumError);
		}
		//Publisher Validation
		if(getPublisher.value === ""){
			var publisherError = "Please enter a publisher.";
			getPublisher.style.border = "1px solid red";
			messageArray.push(publisherError);
		}
		//Genre Validation
		if(getGenre.value === "--Choose A Genre--"){
			var genreError = "Please choose a genre.";
			getGenre.style.border = "1px solid red";
			messageArray.push(genreError);
		}

		//If there were errors, display them on the screen
		if(messageArray.length >= 1){
			for(var i=0, j=messageArray.length; i < j; i++){
				var text = document.createElement('li');
				text.innerHTML = messageArray[i];
				errMsg.appendChild(text);
			}
			t.preventDefault();
			return false;
		}else{
			//If there are no erros, save our data
			storeData(this.key);
		}
	}

	//Function calls
	makeGenre();

	//Set Link and Submit Click Events
	var displayLink = e('displayData');
	displayLink.addEventListener("click", getData);
	var clearLink = e('clearData');
	clearLink.addEventListener("click", clearLocal);
	var save = e('submit');
	save.addEventListener("click", validate);

});