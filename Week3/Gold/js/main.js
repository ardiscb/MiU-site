$('#home').on('pageinit', function(){
	//code needed for home page goes here

});	
		
$('#addItem').on('pageinit', function(){

		var myForm = $('#comicForm');
		    myForm.validate({
			invalidHandler: function(form, validator) {
			},
			submitHandler: function() {
		var data = myForm.serializeArray();
			storeData(this.key);
		}
	});
	
	//any other code needed for addItem page goes here

	//getElementById Function
	var e = function(x){
		var theElement = document.getElementById(x);
		return theElement;
	};

	//Variable defaults
	 var //comicGenre = ["--Choose A Genre--", "Superhero", "Horror", "Sci-Fi", "Western", "Romance"],
		styleValue,
		errMsg = e('errors');
	
	//Find value of the selected radio button for the storeData function
	var getSelectedRadio = function(){
		var radios = document.forms[0].illStyle;
		for(var i=0; i<radios.length; i++){
			if(radios[i].checked){
				styleValue = radios[i].value;
			}
		}
	};

	//Auto Popluate Local Storage
	var autofillData = function (){
		//The actual JSON OBJECT data required for this to work is coming from our json.js file, which is loaded from our HTML page
		//Store JSON OBJECT into Local Storage
		for(var n in json){
			var id = Math.floor(Math.random()*100000000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	};

	//Get the image for the right category
	var getImage = function(catName, makeSubList){
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "images/" + catName + ".png");
		imageLi.appendChild(newImg);
	};

	var getData = function(){
		// toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in Local Storage so default data was added.");
			autofillData();
		}
		//Write Data from Local Storage to the browser
		var makeDiv = e('data');
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
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
	};

	var storeData = function(key){
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
	}; 

	//Make Item Links
	//Create the edit and delete links for each stored item when displayed
	var makeItemLinks = function(key, linksLi){
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
	};

	var	editItem = function (){
		//Grab the data from our item in Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//populate the form fields with current Local Storage values
		e('comicTitle').value 	= item.comicTitle[1];
		e('seriesTitle').value 	= item.seriesTitle[1];
		e('issueNum').value 	= item.issueNum[1];
		e('dateReleased').value = item.dateReleased[1];
		e('publisher').value 	= item.publisher[1];
		e('rateIssue').value 	= item.rateIssue[1];
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
		//Change Submit button value to Edit button
		e('submit').value = "Edit Comic";
		var editSubmit = e('submit');
		// //Save the key value established in this function as a property of the editSubmit event
		// //so we can use that value when we save the data we edited
		editSubmit.addEventListener("click", storeData);
		editSubmit.key = this.key;
	};

	var	deleteItem = function (){
		var ask = confirm("Are you sure you want to delete this comic?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Comic was deleted!");
			window.location.reload();
		}else{
			alert("Comic was NOT deleted!");
		}		
	};
						
	var clearLocal = function(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			localStorage.clear();
			alert("All comics were deleted!");
			window.location.reload();
			return false;
		}
	};

	//Function calls
	// makeGenre();

	//Set Link and Submit Click Events
	var displayLink = e('displayData');
	displayLink.addEventListener("click", getData);
	var clearLink = e('clearData');
	clearLink.addEventListener("click", clearLocal);
	var save = e('submit');
	save.addEventListener("click", storeData);

});

$('#superhero').on('pageinit', function(){
	//code needed for home page goes here

});

$('#western').on('pageinit', function(){
	//code needed for home page goes here

});

$('#horror').on('pageinit', function(){
	//code needed for home page goes here

});

$('#romance').on('pageinit', function(){
	//code needed for home page goes here

});

$('#scifi').on('pageinit', function(){
	//code needed for home page goes here

});

$('#covers').on('pageinit', function(){
	//code needed for home page goes here

});

$('#about').on('pageinit', function(){
	//code needed for home page goes here

});

$('#construction').on('pageinit', function(){
	//code needed for home page goes here

});

$('#dataDisplay').on('pageinit', function(){
	//code needed for home page goes here

});

$('#home').on('pageinit', function(){
	//code needed for home page goes here

});
