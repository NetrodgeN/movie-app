const url = 'https://api.themoviedb.org/3/trending/all/day?api_key=3fd2be6f0c70a2a598f084ddfb75487c';
const cards =document.querySelector('.cards');
const searchForm = document.querySelector('.search__form');
const searchBar = document.querySelector('.search__input');
const picUrl = 'https://image.tmdb.org/t/p/w500';

let genreDictionary = {
    28: "Action",
    12: "Adventure",
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10762: "Kids",
    10402: "Music",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
}

function ratingColor(rating) {
    if (rating >= 8) {
        return "rating-hight"
    }
    if (rating === 0) {
        return "rating-unknown"
    }
    if (rating <= 6) {
        return "rating-low"
    }
    return "rating-medium"
}

function genresCollector(genres) {
    let genreValues = ""

    Object.entries(genres).forEach(entry => {
        const [key, value] = entry;
        genreValues += (genreDictionary[value] + ", ")
    });
    return genreValues.slice(0, genreValues.length - 2);
}



async function getData(adress) {
    const res = await  fetch(adress);
    if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
    }
    const movies = await res.json();

    function showMovies(result){
        if(result.length > 0) {
            cards.innerHTML = ''
            result.forEach((card) => {
                const cardParts = document.createElement('div');
                let title = !card.title ? card.name : card.title;
                let imageShow = card.poster_path ? picUrl + card.poster_path : 'assets/noimage.jpg';
                cardParts.classList.add('card');
                cardParts.innerHTML =`
                <div class='card__top'>
                    <img src="${imageShow}" alt="cover" class="card__top-image">
                    <div class="card__top-rating ${ratingColor(card.vote_average)}">${card.vote_average}</div>
                </div> 
                <div class="card__bottom">
                    <div class="card__bottom-title">${title}</div>
                    <span class="card__bottom-genres">${genresCollector(card.genre_ids)}</span>
                </div>
                <div class="card__description-container">
                    <div class="card__description">
                        <span class="card__description-title">Description</span>
                       <span class="card__description-title">${card.overview}</span>
                    </div>
                </div>
                `
                cards.appendChild(cardParts)
            })
        } else {
            cards.innerHTML = ` <h3>No results. Try another keyword </h3>`
        }
    }
    showMovies(movies.results);
}

getData(url)


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBar.removeAttribute('autocomplete');
    let userInput = searchBar.value;
    if (userInput) {
        let searchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=6f12b59c82353a790a38bebb2808ae9a&query=' + userInput
        getData(searchUrl)
    } else {getData(url)}
})