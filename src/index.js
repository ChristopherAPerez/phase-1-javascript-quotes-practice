//Initialize////////////////////////////////////
function initialize(){
    getQuotes()
}

initialize();

//Get Quotes////////////////////////////////////////////////////////
function getQuotes(){
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(response => response.json())
    .then(quotesData => quotesData.forEach(quotes => renderQuotes(quotes)))
}

//Render Quotes////////////////////////////////////////////////////////
function renderQuotes(quotes){
    
    let numLikes = 0
    //console.log(quotes)

    let li = document.createElement('li')
    li.className = `quote-card`
    li.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quotes.quote}</p>
        <footer class="blockquote-footer">${quotes.author}</footer>
        <br>
        <button class='btn-success' id='btn-likes-${quotes.id}'>Likes: ${numLikes}</button>
        <button class='btn-danger' id='${quotes.id}'>Delete</button>
      </blockquote>
    `
    document.querySelector('#quote-list').appendChild(li)

    //Delete Button////////////////////////////////////////////////////////////////
    removeQuote(quotes.id, li)

    //Like Button////////////////////////////////////////////////////////////////
    likeButton(quotes.id, numLikes)

}

//Form-Submit////////////////////////////////////////////////////////
let form = document.querySelector('#new-quote-form')
form.addEventListener('submit', addNewQuote)

//Add New Quotes//////////////////////////////////////////////////
function addNewQuote(e){
    e.preventDefault()
    let newQuote = e.target.quote.value
    let newAuthor = e.target.author.value

    postQuote(newQuote, newAuthor);

    form.reset();
}

//POST////////////////////////////////////////////////////////////////
function postQuote(newQuote, newAuthor){
    fetch(`http://localhost:3000/quotes?_embed=likes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accept: "application/json"
        },
        body: JSON.stringify({
            "quote": newQuote,
            "author": newAuthor
        })
    })
    .then(res => res.json())
    .then(function(data){
        let li = document.createElement('li')
        li.className = "quote-card"
        li.innerHTML = `
        <blockquote class="blockquote">
        <p class="mb-0">${data.quote}</p>
        <footer class="blockquote-footer">${data.author}</footer>
        <br>
        <button class='btn-success' id='btn-likes-${data.id}'>Likes: 0</button>
        <button class='btn-danger' id='${data.id}'>Delete</button>
        </blockquote>
        `
        document.querySelector('#quote-list').appendChild(li)

        removeQuote(data.id, li)
    })
}

//Delete Button////////////////////////////////////////////////////////////////
function removeQuote(id, li){
    let btn = document.getElementById(`${id}`)
    btn.addEventListener('click', function(){
        li.remove()
        deleteQuote(id)
    })
}


//Delete Quote////////////////////////////////////////////////////////////////
function deleteQuote(id){
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            accept: "application/json"
        }
    })
    .then(res => res.json())
    .then(deleteData => console.log(deleteData))
}

//Like Button////////////////////////////////////////////////////////////////
function likeButton(id, numlikes){
    let btn = document.getElementById(`btn-likes-${id}`)
    btn.addEventListener('click', function(){
        likeQuote(id)
    })
}

//Like Quote////////////////////////////////////////////////////////////////
function likeQuote(id){
    fetch(`http://localhost:3000/likes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accept: "application/json"
        },
        body: JSON.stringify({
            "quote": id
        })
    })
    .then(res => res.json())
    .then(likeData => console.log(likeData))
}