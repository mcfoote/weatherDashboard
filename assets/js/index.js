// Local Variables
var current = document.querySelector('cityTarget');
var forecast = document.querySelector('cityInfo');
var history = document.querySelector('citiesHistory');
var button = document.querySelector('searchButton');

var weatherConditions = [];
var dataStore = JSON.parse(localStorage.getItem('cities')) || [];

var clearElement = function(element) {

    element.innerHTML = '';

};

var cityLoad = function() {

    clearElement(history);

    if(dataStore) {

        var ulElement = document.createElement('ul');
        ulElement.classListadd('w-100');
        ulElement.classListadd('list-unstyled');

        for(let i = 0; i < dataStore.length; i++) {

            var liElement = document.createElement('li');
            liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+dataStore[i]+"'>" + dataStore[i] + "</button>";
            ulElement.appendChild(liElement);

        }

        history.appendChild(ulElement);

    }

};

var citySave = function(city){

    var flag = false
    if(dataStore){

        for(var i = 0; i < dataStore.length; i++){

            if(dataStore[i] === city){

                flag = true;
                
            }

        }

        if(flag){

            displayAlertMessage("The City: "+city+" already exists")

        }
    }

    if(!flag){

        dataStore.push(city);
        localStorage.setItem("cities",JSON.stringify(dataStore));

    }
    
    cityLoad();

}

var search = function(event) {

    event.preventDefault();

    var inputElement = document.querySelector('citySearch');
    var inputText = inputElement.value.trim();

    if(inputElement.value === '') {
        //modal goes here
        return;
    }

    callFetchAPI(inputText); //TODO define function

};

button.addEventListener('click', search)