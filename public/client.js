
const POSTER_PATH = "https://image.tmdb.org/t/p/w500"

let movieData = {}
let params = {}

const moviesDiv = document.getElementById("moviesDiv")
const searchForm = document.getElementById("searchForm")
const genreSelection = document.getElementById("genre")
const loadMoreButton = document.getElementById("loadMore")
const background = document.getElementById("background")
searchForm.addEventListener("submit", beginSearch)
loadMoreButton.addEventListener("click", loadMore)
let page = 1

const genres = {}
const genresArray = await fetchGenres()
for (const genre of genresArray.genres) {

    genres[genre.id] = genre.name

    const genreOption = document.createElement("option")
    genreOption.value = genre.id
    genreOption.textContent = genre.name
    genreOption.className = "genreOptions"
    genreSelection.append(genreOption)
}

async function fetchGenres() {
    const response = await fetch("/genres");
    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }
    const data = await response.json();
    return data;
}

async function fetchMovies() {

    console.log(params)

    const response = await fetch("/search?" + params);
    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }
    return await response.json();
}

async function beginSearch(event) {

    event?.preventDefault()
    page = 1
    params = new URLSearchParams(new FormData(searchForm))

    params.set("page", page)

    loadMoreButton.style.display = "inline"

    movieData = await fetchMovies()

    if (page >= movieData.total_pages) {
        console.log("Last Page Reached")
        loadMoreButton.style.display = "none"
    }

    moviesDiv.replaceChildren()
    for (const movie of movieData.results) {

        if (!movie.poster_path) continue

        const movieDiv = createMovieDiv(movie)
        moviesDiv.append(movieDiv)
    }

    buildBackground()
}

function buildBackground() {

    background.replaceChildren()

    const posters = movieData.results.filter(movie => movie.poster_path)
    if (posters.length === 0) return

    for (let i = 0; i < 300; i++) {

        const backgroundImage = document.createElement("img")
        backgroundImage.src = POSTER_PATH + posters[i % posters.length].poster_path
        backgroundImage.className = "backgroundImage"
        background.append(backgroundImage)
    }
}

async function loadMore(event) {

    event.preventDefault()

    page++
    params.set("page", page)

    if (page >= movieData.total_pages) {
        console.log("Last Page Reached")
        loadMoreButton.style.display = "none"
    }

    movieData = await fetchMovies()

    for (const movie of movieData.results) {

        if (!movie.poster_path) continue

        const movieDiv = createMovieDiv(movie)
        moviesDiv.append(movieDiv)
    }
}


function createMovieDiv(movie) {

    const movieElement = document.createElement("div")
    movieElement.className = "movieElement"

    const titleElement = document.createElement("h2")
    titleElement.textContent = movie.title
    titleElement.className = "title"

    const overviewElement = document.createElement("p")
    overviewElement.textContent = movie.overview
    overviewElement.className = "overview"

    const releaseDateElement = document.createElement("p")
    releaseDateElement.textContent = "Release date: " + movie.release_date
    releaseDateElement.className = "releaseDate"

    const posterElement = document.createElement("img")
    posterElement.src = POSTER_PATH + movie.poster_path
    posterElement.className = "poster"

    const genresh2Element = document.createElement("h3")
    genresh2Element.textContent = "Genres:"
    genresh2Element.className = "genresh3"

    const genresElement = document.createElement("ul")
    for (const ids of movie.genre_ids) {

        const genre = document.createElement("li")
        genre.textContent = genres[ids]
        genresElement.append(genre)
    }
    genresElement.className = "genres"

    if (posterElement) movieElement.append(posterElement)
    movieElement.append(titleElement)
    movieElement.append(releaseDateElement)
    movieElement.append(genresh2Element)
    movieElement.append(genresElement)
    movieElement.append(overviewElement)


    return movieElement
}

beginSearch()