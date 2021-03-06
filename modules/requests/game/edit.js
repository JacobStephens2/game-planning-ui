import { cookieMethods } from "/modules/exports/cookieMethods.js";
import { apiHostname } from '/modules/exports/apiHostname.js';
import { handleErrors } from '/modules/exports/handleErrors.js';
import { updateUIError } from '/modules/exports/updateUIError.js';

if (cookieMethods.getCookie('loggedIn') == 'true') {
} else {
  window.location = '/login';
}

// Read data on page load
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get('id');

const updateUISuccess = function (data) {
  const parsedData = JSON.parse(data);
  document.querySelector('input#title').value = parsedData.title;
  document.querySelector('h1').innerText = parsedData.title;
  document.querySelector('title').innerText = parsedData.title;
  document.querySelector('#deleteLink').href = "/game/delete?id=" + parsedData.id;
}

let readEndpoint = apiHostname + '/game/read?id=' + id;

var requestOptions = {
  method: 'GET',
  credentials: 'include',
  redirect: 'follow'
};

fetch(readEndpoint, requestOptions, updateUIError)
  .then(response => handleErrors(response))
  .then((data) => updateUISuccess(data))
  .catch(error => console.log('error', error));

// Update on Update button click
document.querySelector('input[type="submit"][value="Update"]').addEventListener('click', function (event) {
  event.preventDefault()
  let updateEndpoint = apiHostname + '/game/update?id=' + id;

  const updateWithResponse = function (data) {
    window.location = '/games/read';
  }

  var formdata = new FormData();
  formdata.append("game[id]", id);
  formdata.append("game[title]", document.querySelector('input#title').value);

  var requestOptions = {
    method: 'POST',
    credentials: 'include',
    body: formdata,
    redirect: 'follow'
  };

  fetch(updateEndpoint, requestOptions)
    .then(response => handleErrors(response))
    .then((data) => updateWithResponse(data))
    .catch((error) => updateUIError(error));

});