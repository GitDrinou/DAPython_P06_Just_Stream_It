import {
    URL_SERVER,
    ENDPOINT_API_FILMS,
    MAX_COUNT, PARAM_SORT_BY,
    PARAM_VALUE_SORT_BY,
    DEVISE_ENUM
} from "./constants.js";
import { defaultListItems } from "./display_utils.js";

const fetchData = async (url) => {
    const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des films (page ${url}).`);
        }
    const data = await response.json()
    return data; 
}

const getListOfBestRankingFilms = async () => {
    let bestRankingFilms = [];
    const sortByImdbScoreDesc = PARAM_VALUE_SORT_BY;
    const url = new URL(`${URL_SERVER}${ENDPOINT_API_FILMS}`);
    url.searchParams.append(PARAM_SORT_BY, sortByImdbScoreDesc);

    try {
        const data = await fetchData(url);
        bestRankingFilms = [...bestRankingFilms, ...data.results];

        if (data.results.length <= MAX_COUNT) {
            const dataNextPage = await fetchData(data.next);
            bestRankingFilms = [...bestRankingFilms, ...dataNextPage.results]
        }  
    } 
    catch (error) {
        console.error("Erreur :", error);
        throw error;
    }

    return bestRankingFilms;
}

export const displayTheBestRankingFilmDetails = async () => {
    const listOfBestRankingFilms = await getListOfBestRankingFilms();
    const filmDetails = await getTheFilmDetails(listOfBestRankingFilms[0]);

    document.querySelector('.best-film-details__title').innerHTML = filmDetails.title;
    document.querySelector('.best-film-details__text').innerHTML = filmDetails.description;

    displayModalDetails(filmDetails);
}   

export const displayListOfBestRankingFilm = async () => {
    const listOfBestRankingFilms = await getListOfBestRankingFilms();
    const bestRankingList = document.getElementById('bestRankingList');

    bestRankingList.innerHTML = ''

    for (let elt = 1; elt < Math.min(7, listOfBestRankingFilms.length); elt++) {
        let filmDetails = "";
        const film = listOfBestRankingFilms[elt];
        const li = document.createElement('li');
        const bestFilmRankingImage = document.createElement('div');
        const img = document.createElement('img');
        const overlay = document.createElement('div');
        const h3 = document.createElement('h3');
        const button = document.createElement('button');
        const buttonDiv = document.createElement('div');
        const dialog = document.querySelector('dialog');
        const filmImage = film.image_url;

        filmDetails = await getTheFilmDetails(film);

        li.className = 'item-container';
        bestFilmRankingImage.className = 'best-film-ranking-image';

        img.addEventListener('error', () => {
            img.src = "./images/img_not_found.svg";
        })

        img.src = film.image_url;
        img.alt = `affiche de ${film.title}`;
        bestFilmRankingImage.appendChild(img);
        overlay.className = 'overlay';
        h3.textContent = film.title;
        button.className = 'btn-details__black';
        button.textContent = 'Détails';
        buttonDiv.appendChild(button);
        overlay.appendChild(h3);
        overlay.appendChild(buttonDiv);
        li.appendChild(bestFilmRankingImage);
        li.appendChild(overlay);
        bestRankingList.appendChild(li);

        button.addEventListener('click', () => {
            dialog.showModal();
            displayModalDetails(filmDetails);
        });
    }

    defaultListItems();

}

const getTheFilmDetails = async (item) => {
   let filmDetail = [];
    const urlFilmDetail = item.url;
    try {
        const response = await fetch(urlFilmDetail);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des détails du film (page ${url}).`);
        }
        const data = await response.json();  
        filmDetail = data;
    } 
    catch (error) {
        console.error("Erreur :", error);
        throw error;
    }

    return(filmDetail);
}

const getDeviseSymbol = (codeDevise) => {
  return DEVISE_ENUM[codeDevise];
}

const formatFilmBudget = (budget, currency) => {
    if (budget != null){
        const millions = budget / 1_000_000;
        return getDeviseSymbol(currency) + millions.toFixed(1)+"m";
    }
    return "Non fourni";
}

const displayModalDetails = (data) => { 
    
    const filmRates = data.rated.includes("Not rated") ? "" : "PG-" + data.rated + " -";
    const filmImage = data.image_url;

    document.getElementById('modalFilmImage').addEventListener('error', () => {
        document.getElementById('modalFilmImage').src = "./images/img_not_found.svg";
    })

    document.getElementById('modalFilmTitle').innerHTML = data.title;
    document.getElementById('modalFilmDate').innerHTML = data.year;
    document.getElementById('modalFilmCatageories').innerHTML = data.genres.join(', ');
    document.getElementById('modalFilmRates').innerHTML = filmRates;
    document.getElementById('modalFilmDuration').innerHTML = data.duration + " minutes";
    document.getElementById('madalFilmCountries').innerHTML = data.countries.join('/ ');
    document.getElementById('modalFilmScore').innerHTML = data.imdb_score;
    document.getElementById('modalFilmBudget').innerHTML = formatFilmBudget(data.budget, data.budget_currency);
    document.getElementById('modalFilmDirectors').innerHTML = data.directors.join(', ');
    document.getElementById('modalFilmDescription').innerHTML = data.long_description;
    document.getElementById('modalFilmActors').innerHTML = data.actors.join(', ');
    document.getElementById('modalFilmImage').src = filmImage;
}