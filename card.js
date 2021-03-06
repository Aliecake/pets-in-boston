export function generateCard({
    published, 
    name, 
    url, 
    description,
    photos 
}) {
    let date;
    if(published){
        const dateI = new Date(published);
        date = `${dateI.getMonth()}-${dateI.getDate()}-${dateI.getYear()}`
    } else {
        date = "unknown";
    }
    if(photos.length === 0){
        photos.push({full: "No_image_3x4.svg.png", small: "No_image_3x4.svg.png"});
    }
	return `
    <div class="card">
    <div class="card-image">
        <figure class="image is-4by3">
            <img src=${photos[0]["full"]} alt=${name}>
        </figure>
    </div>
    <div class="card-content">
        <div class="media">
        <div class="media-left">
            <figure class="image is-48x48">
            <img src=${photos[0]["small"]} alt=${name}>
            </figure>
        </div>
        <div class="media-content">
            <p class="title is-4">${name}</p>
            <p class="subtitle is-6"><a href=${url}  alt=${name}>Link on Petfinder</a></p>
        </div>
        </div>

        <div class="content">
        ${description}.
        
        <br>
        <time>Updated: ${date}</time>
        </div>
    </div>
    </div>
    `;

}



