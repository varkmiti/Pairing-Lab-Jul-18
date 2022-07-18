const profile_info = document.querySelector('#profile')

const animal_sightings = document.querySelector('ul#animals')

let last_id = 0

fetch('http://localhost:3000/travelers')
    .then(res => res.json())
    .then(function(res) { 
        // console.log(res[0])
        profile_info.children[0].src = res[0].photo
        profile_info.children[0].alt = res[0].name
        profile_info.children[1].textContent = res[0].name
        profile_info.children[2].textContent = res[0].nickname
        profile_info.children[3].textContent = `${res[0].likes} Likes`

    })

function add_animal_sighting(el){
    animal_sightings.innerHTML += `<li data-id='${el.id}'>
        <p>${el.description}</p>
        <img src='${el.photo}' alt='${el.species}'/>
        <a href='${el.link}' target='_blank'>Here's a video about the ${el.species} species!</a>
        <p class='likes-display'>${el.likes} Likes</p>
        <button class="like-button" type="button">Like</button>
        <button class="delete-button" type="button">Delete</button>
        <button class="toggle-update-form-button" type="button">Toggle Update Form</button>
        <form class="update-form" style="display: none;">
        <input type="text" value="${el.description}" name="description"/>
        <input type="submit" value="Update description">
            </form>
        </li>`
        last_id = el.id
}

fetch('http://localhost:3000/animalSightings')
    .then(res => res.json())
    .then(function(res){
    res.forEach(el => add_animal_sighting(el)) 
    process_likes()
    delete_sighting()
    toggle_form()
    process_form_update()
    })

document.querySelector('#new-animal-sighting-form').addEventListener("submit", function(event) {
    event.preventDefault()
    const animal_sighting = {
        id: ++last_id,
        travelerId: 1,
        species: event.target.species.value,
        photo: event.target.photo.value,
        link: event.target.video.value,
        description: event.target.description.value,
        likes: 0
    }
    add_animal_sighting(animal_sighting)
    fetch('http://localhost:3000/animalSightings', {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(animal_sighting)
    })
    .then(res => res.json())
    .then(res => console.log(res))
})

document.querySelector('.like-button').addEventListener("click", function(event){
    const like_count = document.querySelector('.likes')
    let new_likes = parseInt(like_count.textContent.split(" ")[0]) + 1
    like_count.textContent = `${new_likes} Likes`
    fetch('http://localhost:3000/travelers/1', {
        method: 'PATCH',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            likes: new_likes
        })
    })
    .then(res => res.json())
    .then(res => console.log(res))
})

function process_likes() {
    document.querySelectorAll('.like-button').forEach(button => button.addEventListener("click", function(event){
    // console.log(event.target.parentNode)
    const sightingId = event.target.parentNode.dataset.id
    const like_count = event.target.parentNode.querySelector('.likes-display')
    let new_likes = parseInt(like_count.textContent.split(" ")[0]) + 1
    like_count.textContent = `${new_likes} Likes`
    fetch(`http://localhost:3000/animalSightings/${sightingId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            likes: new_likes
        })
    })
    .then(res => res.json())
    .then(res => console.log(res))
}))
}

function delete_sighting() {
    document.querySelectorAll('.delete-button').forEach(button => button.addEventListener("click", function(event){
    // console.log(event.target.parentNode)
    const sightingId = event.target.parentNode.dataset.id
        fetch(`http://localhost:3000/animalSightings/${sightingId}`, {
        method: 'DELETE'
        })
    .then(res => res.json())
    .then(res => console.log(res))
    event.target.parentNode.remove()

}))
}

function toggle_form() {
    document.querySelectorAll('.toggle-update-form-button').forEach(button => button.addEventListener("click", function(event){
    // console.log(event.target.parentNode)
    const form = event.target.parentNode.querySelector('.update-form')
    form.style.display = form.style.display == `none` ? `block` : `none`
    }))
}

function process_form_update() {
    document.querySelectorAll('.update-form').forEach(form => form.addEventListener("submit", function(event){
    event.preventDefault()
    // console.log(event.target.parentNode)
    const sightingId = event.target.parentNode.dataset.id
    fetch(`http://localhost:3000/animalSightings/${sightingId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            description: form.description.value
        })
    })
    .then(res => res.json())
    .then(res => console.log(res))
    form.parentNode.children[0].textContent = form.description.value
}))
}


