/************************** EVENTS JS MINI CHALLENGE WITH JSON SERVER ******************************/
const animalsUl = document.querySelector('ul#animals')
const form = document.querySelector('form#new-animal-sighting-form')
const pLikes = document.querySelector('div#profile p.likes')
const likeBtn = document.querySelector('button.like-button')

function renderOneSighting(sighting) {
    const li = document.createElement('li')
    li.dataset.id = sighting.id
    li.dataset.travelerId = sighting.travelerId

    li.innerHTML = `
            <h3>${sighting.species}</h3>
            <img src='${sighting.photo}'/>
            <a href='${sighting.link}'>Click for video</a>
            <p>${sighting.description}</p>
            `
    animalsUl.append(li)
}


fetch('http://localhost:3000/travelers/1')
    .then(res => res.json())
    .then(trvlrObj => {
        const img = document.querySelector('div#profile img')
        img.src = trvlrObj.photo
        img.alt = trvlrObj.name

        const h2 = document.querySelector('div#profile h2')
        h2.textContent = trvlrObj.name

        const em = document.querySelector('div#profile em')
        em.textContent = trvlrObj.nickname
        pLikes.textContent = `${trvlrObj.likes} Likes`
    })


fetch('http://localhost:3000/animalSightings')
    .then(res => res.json())
    .then(animalSightingsArr => {

        animalSightingsArr.forEach(sighting => renderOneSighting(sighting))
    })


form.addEventListener('submit', event => {
    event.preventDefault()
    // using the name attribute
    // const species = event.target.species.value
    // const video = event.target.video.value
    // const photo = event.target.photo.value
    // const description = event.target.description.value

    // console.dir(event.target)
    // using the index
    const species = event.target[0].value
    const video = event.target[1].value
    const photo = event.target[2].value
    const description = event.target[3].value
    form.reset()

    fetch('http://localhost:3000/animalSightings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            travelerId: 1,
            species: species,
            photo: photo,
            link: video,
            description: description
        })
    })
        .then(res => res.json())
        .then(sighting => renderOneSighting(sighting))
})


likeBtn.addEventListener('click', () => {
    const currLikes = parseInt(pLikes.textContent)
    const newLikes = currLikes + 1
    pLikes.textContent = `${newLikes} Likes`
    console.log(newLikes)

    fetch('http://localhost:3000/travelers/1', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ likes: newLikes })
    })
        .then(res => res.json())
        .then(updatedTrvlr => {
            console.log(updatedTrvlr)
        })
})