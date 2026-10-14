
import 'dotenv/config'
import express from "express"
import path from "node:path"

const app = express()

const API_KEY = process.env.API_KEY
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("", (req, res) => {

    res.sendFile(path.join(import.meta.dirname, "views", "index.html"))
})

async function getPeopleIds(names) {

    const namesArray = names.split(",")
    const idArray = []

    for (const name of namesArray) {

        const personArray = await queryPerson(name.trim())
        if (personArray.length > 0) {
            idArray.push(personArray[0].id)
        }
    }

    return idArray.join()
}

async function queryPerson(name) {

    const params = new URLSearchParams()
    params.set("query", name)

    const url = 'https://api.themoviedb.org/3/search/person?' + params;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    };

    const response = await fetch(url, options)
    const resJson = await response.json()

    return resJson.results
}

app.get("/genres", async (req, res) => {

    const url = 'https://api.themoviedb.org/3/genre/movie/list';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    };

    const response = await fetch(url, options)
    const resJson = await response.json()

    res.send(resJson)
})

app.get("/search", async (req, res) => {


    const params = new URLSearchParams()

    for (const key in req.query) {
        if (req.query[key]) {
            params.set(key, req.query[key])
        }
    }

    if (req.query.with_cast) {
        const peopleIdString = await getPeopleIds(req.query.with_cast)

        if (peopleIdString) { params.set("with_cast", peopleIdString) }

        else { params.delete("with_cast") }
    }

    const url = 'https://api.themoviedb.org/3/discover/movie?' + params;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    };

    const response = await fetch(url, options)
    const resJson = await response.json()

    res.send(resJson)
})



app.listen(3000, () => console.log("Movie Discovery Site running on port 3000"))