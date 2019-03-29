'use strict';

const apiKey = 'NpspacEhTIGRcKXSqPCjaWJytHkTyzN3Q2TGCGDZ';
const searchURL = 'https://api.nps.gov/api/v1/parks';

function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=
    ${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson){
    for(let i=0; i < responseJson.data.length; i++){
        $('#js-search-results').append(
        `<li>
            <h2>${responseJson.data[i].fullName} in ${responseJson.data[i].states}</h2>
            <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
            <p>${responseJson.data[i].description}</p>
        </li>`)

        //The below code was removed from li because it did not work in every case. There needs to be a function to check for wether or not the 
        //park has a physical address as some do not

        // <p>Address: ${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, 
        // ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>

    }
}

function getParks(searchState, resultLimit=10){
    const params = {
        "stateCode": searchState,
        "limit": resultLimit - 1,
        "fields": "addresses",
        "api_key": apiKey,

    }

    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            alert(`something went wrong: ${err.message}`)
        })
}

function watchForm(){
    $('form').on('submit', function(event){
        event.preventDefault();
        const searchState = $('#searchState').val().toString();
        const resultLimit = $('#searchLimit').val();
        console.log(searchState);
        console.log(resultLimit);
        $('#js-search-results').empty();
        getParks(searchState, resultLimit);
    })
}

$(watchForm);
