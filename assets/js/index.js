// Local Variables
var current = document.querySelector('cityTarget');
var forecast = document.querySelector('cityInfo');
var history = document.querySelector('citiesHistory');
var button = document.querySelector('searchButton');

var weatherConditions = [];
var dataStore = JSON.parse(localStorage.getItem('cities')) || [];

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