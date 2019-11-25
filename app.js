// Every API is different, but for authorized tasks, all of them require client credentials, which you often get by registering an account with the API provider. The API provider then gives you a key and a secret key. They're usually long hashes.
const key = "12345";
const secret = "abcde";

// This is the organization that we'll eventually request data about
const org = "blahblah"

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
		console.log(data);

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
                // But we do need to include headers
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
		console.log("pets", data2);
	})
	.catch(error => console.log("something went wrong", error));
