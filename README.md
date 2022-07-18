# JS Mini Challenge


## Setup

- Fork this repo, then run `git clone` to download your fork locally. Then `cd` into the downloaded directory and open it in your text editor with `code .`.
- Run `json-server --watch db.json --routes routes.json` to get the backend started
- Open the `index.html` file on your browser

## Endpoints

Your base URL for your API will be: http://localhost:3000

The endpoints you may need are:

- GET `/travelers/1`
- PATCH `/travelers/1`
- GET `/animalSightings`
- POST `/animalSightings`
- PATCH `/animalSightings/:id`
- DELETE `/animalSightings/:id`

Be sure to check out what data you are getting returned when you make a request to a certain route!


## Assignment

In this challenge, we're going to tie everything we learned this week together. We'll have a lot of the same deliverables, but this time, we need to add in persistence where necessary to save data! We're going to work on Raffy's Amazon trip page and give our users the ability to:

- See information about the traveler with the ID of 1 including their image, name, nickname, and number of likes when the page loads
- See all the traveler's animal sightings when the page loads
- Add a new animal sighting
- Click on the heart button to increase the number of likes for the traveler profile and still see the updated likes when I reload the page
- Click an animal sighting's like button to increase its likes
- Click an animal sighting's delete button to delete it
- Click on the animal sighting's 'Toggle Update Form' button to toggle the update form for that animal sighting
- Submit an animal sighting's form to update that animal sighting's description

__________

There's a section in this Readme file for your notes on each deliverable. As you go through the deliverables, write down some notes in this file on how you solved each problem. It'll help reinforce what you learned and give you a head start next time you see a similar problem.

## Deliverable 1: Show traveler info upon page load

When the page loads, the information about the traveler should display including their name, image, nickname, and number of likes.


**YOUR NOTES**
```
const profile_info = document.querySelector('#profile')


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
```


## Deliverable 2: Show animal sightings upon page load

When the page loads, each animal sighting of the travler should appear on the page in the `ul#animals` section. Each animal sighting should look like:

```html
<li data-id='{id here}'>
  <p>{description here}</p>
  <img src='{image url here}' alt='{species here}'/>
  <a href='video url here' target='_blank'>Here's a video about the {species here} species!</a>
  <p class='likes-display'>{number of likes here} Likes</p>
  <button class="like-button" type="button">Like</button>
  <button class="delete-button" type="button">Delete</button>
  <button class="toggle-update-form-button" type="button">Toggle Update Form</button>
  <form class="update-form" style="display: none;">
    <input type="text" value="{description here}"/>
    <input type="submit" value="Update description">
    </form>
</li>

```

**YOUR NOTES**
```
fetch('http://localhost:3000/animalSightings')
    .then(res => res.json())
    .then(function(res){
    res.forEach(el => {
        animal_sightings.innerHTML += `<li data-id='${el.id}'>
        <p>${el.description}</p>
        <img src='${el.photo}' alt='${el.species}'/>
        <a href='${el.link}' target='_blank'>Here's a video about the ${el.species} species!</a>
        <p class='likes-display'>${el.likes} Likes</p>
        <button class="like-button" type="button">Like</button>
        <button class="delete-button" type="button">Delete</button>
        <button class="toggle-update-form-button" type="button">Toggle Update Form</button>
        <form class="update-form" style="display: none;">
        <input type="text" value="${el.description}"/>
        <input type="submit" value="Update description">
            </form>
        </li>`
    })
        
    })
```




## Deliverable 3: Add a new animal sighting

When the user submits the form to add a new animal sighting post, the animal sighting should render on the page without reloading and should persist (it sohuld still be visible if the page reloads).Your animal sighting object must have a `travelerId` key with a value of `1` for the app to work properly.

**YOUR NOTES**
```

fetch('http://localhost:3000/animalSightings')
    .then(res => res.json())
    .then(function(res){
    res.forEach(el => add_animal_sighting(el))
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
    .then(console.log(res))
})
```




## Deliverable 4: Increase traveler likes

When the user clicks on the traveler's like button, the new number of likes should display on the page without reloading the page. The new number of likes should persist (if the page reloads, the new number of likes should still display).

**YOUR NOTES**
```
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
```



## Deliverable 5: Like an animal sighting

When the user clicks on an animal sighting's like button, the new number of likes for that animal should display on the page without reloading the page. The new number of likes should persist (if the page reloads, the new number of likes should still display).

**YOUR NOTES**
```

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
```



## Deliverable 6: Delete an animal sighting

When the user clicks on an animal sighting's delete button, that animal should be be removed from the page without reloading the page. The deletion should persist (if the page reloads, that animal sighting does not reappear).

**YOUR NOTES**
```
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
```


## Deliverable 7: Toggle the update form for an animal sighting

When the user clicks on an animal sighting's 'toggle update form' button, that animal sighting's form should should toggle between displaying and not displaying on the page.

**YOUR NOTES**
```
function toggle_form() {
    document.querySelectorAll('.toggle-update-form-button').forEach(button => button.addEventListener("click", function(event){
    // console.log(event.target.parentNode)
    const form = event.target.parentNode.querySelector('.update-form')
    form.style.display = form.style.display == `none` ? `block` : `none`
    }))
}

```


## Deliverable 8: Update an animal sighting's description

When the user submits an animal sighting's update form, the updated animal sighting's description should display on the page without reloading the page. The udpated description should persist (if the page refreshes, the updated description should still display).


**YOUR NOTES**
```
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

```

