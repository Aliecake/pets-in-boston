export function generateCard(info) {
    date = new Date(info["published"])
	return `
    <div class="card">
    <div class="card-image">
        <figure class="image is-4by3">
            <img src=${info["photos"][0]["full"]} alt=${info["name"]}>
        </figure>
    </div>
    <div class="card-content">
        <div class="media">
        <div class="media-left">
            <figure class="image is-48x48">
            <img src=${info["photos"][1]["small"]} alt=${info["name"]}>
            </figure>
        </div>
        <div class="media-content">
            <p class="title is-4">${info["name"]}</p>
            <p class="subtitle is-6"><a href=${info["url"]}  alt=${info["name"]}>Link on Petfinder</a></p>
        </div>
        </div>

        <div class="content">
        ${info["description"]}.
        
        <br>
        <time datetime=${date.getYear()-date.getMonth()-date.getDate()}>Updated: ${date.getMonth()-date.getDate()-date.getYear()}</time>
        </div>
    </div>
    </div>
    `;

}



