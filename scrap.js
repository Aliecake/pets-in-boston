// Check to see if a token exists and that it has not yet expired
// We're using localStorage here, so we need to see if there's an 'expires' value in localStorage and we need to see whether it's still valid by checking whether its date has passed.
if (localStorage.getItem("expires") && localStorage.getItem("expires") < Date.now()) {
    getTokenValues();
} else {
    setTokenValues();
}

function setTokenValues(){
    token = localStorage.setItem(data.access_token);
    tokenType = localStorage.setItem(data.token_type);
    expires = localStorage.setItem(new Date().getTime() + (data.expires_in * 1000));
}

function getTokenValues(){
    currentToken = localStorage.getItem('token');
    currentTokenType = localStorage.getItem('tokenType');
    expires = localStorage.getItem('expires');
}
