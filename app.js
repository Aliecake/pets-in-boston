import { generateCard } from "./card.js";

// This script was originally written by 

// In this script, we're using the Fetch API to make a request to Petfinder's API. 

// NOTE: There are lot of security concerns when dealing with APIs, especially if your application uses a paid subscription to some API or if what you're doing involves people's private data! We're not going to talk about any of that here.

// Every API is different, but when your application is making a request to an API and the API requires that that request be authorized, then the API will require client credentials. You get these client credentials by registering an account with the API provider. The API provider then gives you a key and a secret key. They're usually long hashes.
// NOTE: Please do not use these keys! Register with Petfinder to get your own keys.
const key = "lj1iAqRToK2gMHgmAwB2avnLsXcBrsuaoN3xJ6Nb5pyW99aiRR";
const secret = "A8PRsLsr7ENPtksbwcL3930PczY36dh2r8m1ah0C";

// For later - This is the organization code that we'll eventually request data about. The organization is PAWS New England.
const org = "RI77";
// And we'll be looking for info about adoptable pets
const status = "adoptable";

// For later
let token, tokenType, expires;

// FIRST, you need to use your client credentials to request an authorization token from the server.

// We'll create a function to handle this for us. Notice that we return the fetch operation, so that the promise is available outside of the function
function getOAuth(){
	// To get the auth token, you'll have to call the API using a POST request. In the body of that request, you'll send along your credentials. Check out the URL we're posting to. This example is for Petfinder, but every API has its own endpoint for getting a token. Petfinder also requires an extra property called 'grant_type' with a value of 'client_credentials'. In the header, you have to specify the 'Content-Type', which for Petfinder is 'application/x-www-form-urlencoded'
	return fetch(
		// The url of the endpoint
		"https://api.petfinder.com/v2/oauth2/token",
		// The options object
		{
			// Use post
			method: "POST",
			body:
				// The credentials
				"grant_type=client_credentials" +
				"&client_id=" +
				key +
				"&client_secret=" +
				secret,
			headers: {
				// Different APIs use different content-types
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
	)
		// When the we get the response back, it arrives in a 'stream' that we need to convert to json
		.then(response => response.json())
		// We want to be able to use this authorization token again later to make additional calls to the API. For example, we might want to add pagination to our app and use a new request for each new page. So, we'll use the variables we created up above: token, tokenType and expires.
		.then(data => {
			console.log(
				"This is the authorization token that we requested: ",
				data
			);

			// The authorization token looks like this. In an actual case, the access_token would be another long hash:

			// {
			// 	access_token: "a1b2c3d4e5",
			// 	expires_in: 3600,
			// 	token_type: "Bearer"
			// };

			// Store token data
			token = data.access_token;
			tokenType = data.token_type;
			// This is a little tricky. The token gives an 'expires_in' value, but we need a future time in milliseconds. We multiply the expires_in value by 1000 to get milliseconds. Then we add that to the current time. 
			expires = new Date().getTime() + (data.expires_in * 1000);
		})
		// We want to catch any errors returned from the server.
		.catch(error=>console.log("Something went wrong. ", error));
}
		
// SECOND, now that we have a way to get an authorization token, we need a way to request our pet data

// We'll create another function to handle this part. 
function getPets(){
	return fetch(
		// This endpoint gets a list of animals available for adoption from a particular org
		"https://api.petfinder.com/v2/animals?organization=" +
		org +
		"&status=" +
		status,
		// The options object
		{
			// We don't include a method or body on this second fetch request, but we do need to include an authorization header for the token type and the token itself and a content type header.
			headers: {
				//
				Authorization: data.token_type + " " + data.access_token,
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
	)
	// When we get the response back, we have to convert the stream to JSON
	.then(response2 => response2.json())
	.then(data2 => {
		
		// Log the pet data
		console.log("This is the actual pet data", data2);
		
		// The response has a property called 'animals'. We'll use reduce to build a long string of html. Then we'll use the DOMParser API to turn all of that into an HTML document that can be appended to the DOM
		const animals = data2.animals;
		const theString = animals.reduce( (acc, animal) => acc += generateCard(animal), '')
		
		// DOMParser has the advantage that it won't cause images to download until the nodes are inserted into the DOM. Not much help to us here, but still cool!
		const parser = new DOMParser();
		const doc = parser.parseFromString(theString, "text/html");
		// We need the body's child nodes
		const nodesArray = doc.body.children;
		
		// Finally we append the nodes, destructuring the array when we do it
		document.getElementById("gallery").append(...nodesArray);

	})
	.catch(error => console.log("something went wrong", error));
}

// We need one more function to check whether we've got a valid authorization token. If we do, we just need to call getPets(). If we don't, then we need to getOAuth() and then call getPets()

function makeCall() {

	// We're checking both that we have a token (we wouldn't have an expires value if we didn't have a token), and that the token has not expired.
	if (expires && expires > Date.now()) {
		getPets();
	} else {
		console.log('new call');
		// We can chain these two functions with then() because we returned the fetch operation from getOAuth()
		getOAuth().then(getPets());
	}
}

makeCall();