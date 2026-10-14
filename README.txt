Mike Collins
300428853

TMDB api

Endpoints:
https://api.themoviedb.org/3/discover/movie
https://api.themoviedb.org/3/genre/movie/list
https://api.themoviedb.org/3/search/person

The easiest way to run the page is to use the included Run.bat file.
You can also use node to run server.js and open http://localhost:3000/ in a browser to access the page.

The Movie Discovery site is for discovering movies to watch. You can filter by cast members, genres and Release dates.
The Cast field accepts multiple comma (,) separated names and multiple genres can be multi selected by shift or ctrl-clicking. All multi-selections are ANDed.