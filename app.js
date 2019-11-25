import { generateCard } from './card.js';

// Every API is different, but for authorized tasks, all of them require client credentials, which you often get by registering an account with the API provider. The API provider then gives you a key and a secret key. They're usually long hashes.
const key = "lj1iAqRToK2gMHgmAwB2avnLsXcBrsuaoN3xJ6Nb5pyW99aiRR";
const secret = "A8PRsLsr7ENPtksbwcL3930PczY36dh2r8m1ah0C";

// This is the organization code that we'll eventually request data about- PAWS New England. 
const org = "RI77";
// And we'll be looking for info about adoptable pets
const status = 'adoptable';

// FIRST, you need to request an authorization token from the server.

// To get that token, you'll have to call the API using a POST request. In the body of that request, you'll send along your credentials. Check out the URL we're posting to. This example is for Petfinder, but every API has its own endpoint for getting a token. Petfinder also requires an extra property called 'grant_type' with a value of 'client_credentials'. In the header, you have to specify the 'Content-Type', which for Petfinder is 'application/x-www-form-urlencoded'
fetch(
    // The endpoint
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
            // Different APIs can use different content-types
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
)
    // Parse the response as json
	.then(response => response.json())
	.then(data => {
		console.log("This is the authorization token that we requested: ", data);

		// You get back an authorization token that looks like this. In an actual case, the token would be another long hash:

		// {
		// 	access_token: "a1b2c3d4e5",
		// 	expires_in: 3600,
		// 	token_type: "Bearer"
		// };

		// SECOND, now that you have that token, you can chain a second fetch request
		return fetch(
            // This endpoint gets a list of animals available for adoption from a particular org
			"https://api.petfinder.com/v2/animals?organization=" +
				org +
				"&status=" +
                status,
            // The options object
			{
                // We don't include a method or body on this second fetch request
                // But we do need to include and authorization header for the token type and the token itself and a content type header.
				headers: {
                    // 
					Authorization: data.token_type + " " + data.access_token,
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}
		);
	})
	.then(function(response2) {
		// Return the API response as JSON
		return response2.json();
	})
	.then(function(data2) {
		// Log the pet data
        console.log("This is the actual pet data", data2);
        let columns = 4;
        const colArr = [1,2,3,4].map(col => {
            let section = `<div class="column is-one-quarter-desktop is-half-tablet">`
            for(let i = 0; i < data2.length / columns; i++){
                section += generateCard(data2[i]);
            }
            section += `</div>`;
            console.log(section)
            // DOMParser won't cause images to download until the nodes are inserted into the DOM
            const parser = new DOMParser();
            const doc = parser.parseFromString(section, 'text/html');
            const body = doc.body;
            console.log(body);
            document.getElementById('gallery').append(body);
        })
    })
	.catch(error => console.log("something went wrong", error));
