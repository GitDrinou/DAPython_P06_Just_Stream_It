import {
    URL_SERVER,
    ENDPOINT_API_FILMS,
    MAX_COUNT,
    PARAM_LABEL_SORT_BY,
    PARAM_VALUE_SORT_BY_IMDB,
    DEVISE_ENUM,
    PARAM_LABEL_CATEGORY,
    PARAM_VALUE_CATEGORY_1,
    PARAM_VALUE_CATEGORY_2,
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
    const sortByImdbScoreDesc = PARAM_VALUE_SORT_BY_IMDB;
    const url = new URL(`${URL_SERVER}${ENDPOINT_API_FILMS}`);
    url.searchParams.append(PARAM_LABEL_SORT_BY, sortByImdbScoreDesc);

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

const getListOfBestRankingCategory1Films = async () => {
    let bestRankingCategory1Films = [];
    const url = new URL(`${URL_SERVER}${ENDPOINT_API_FILMS}`);
    url.searchParams.append(PARAM_LABEL_SORT_BY, PARAM_VALUE_SORT_BY_IMDB);
    url.searchParams.append(PARAM_LABEL_CATEGORY, PARAM_VALUE_CATEGORY_1);

    try {
        const data = await fetchData(url);
        bestRankingCategory1Films = [...bestRankingCategory1Films, ...data.results];

        if (data.results.length <= MAX_COUNT) {
            const dataNextPage = await fetchData(data.next);
            bestRankingCategory1Films = [...bestRankingCategory1Films, ...dataNextPage.results]
        }  
    } 
    catch (error) {
        console.error("Erreur :", error);
        throw error;
    }

    return bestRankingCategory1Films;
}

const getListOfBestRankingCategory2Films = async () => {
    let bestRankingCategory2Films = [];
    const url = new URL(`${URL_SERVER}${ENDPOINT_API_FILMS}`);
    url.searchParams.append(PARAM_LABEL_SORT_BY, PARAM_VALUE_SORT_BY_IMDB);
    url.searchParams.append(PARAM_LABEL_CATEGORY, PARAM_VALUE_CATEGORY_2);

    try {
        const data = await fetchData(url);
        bestRankingCategory2Films = [...bestRankingCategory2Films, ...data.results];

        if (data.results.length <= MAX_COUNT) {
            const dataNextPage = await fetchData(data.next);
            bestRankingCategory2Films = [...bestRankingCategory2Films, ...dataNextPage.results]
        }  
    } 
    catch (error) {
        console.error("Erreur :", error);
        throw error;
    }
    return bestRankingCategory2Films;
}

export const displayTheBestRankingFilmDetails = async () => {
    const listOfBestRankingFilms = await getListOfBestRankingFilms();
    const filmDetails = await getFilmDetails(listOfBestRankingFilms[0]);

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

        filmDetails = await getFilmDetails(film);

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

export const displayListOfBestRankingCategory1Film = async () => {
    const listOfBestRankingCategory1Films = await getListOfBestRankingCategory1Films();
    const bestRankingCategory1List = document.getElementById('bestRankingCategory1List');

    document.getElementById('bestRankingCategory1Title').innerHTML = capitalize(PARAM_VALUE_CATEGORY_1);

    bestRankingCategory1List.innerHTML = ''

    for (let elt = 1; elt < Math.min(7, listOfBestRankingCategory1Films.length); elt++) {
        let filmDetails = "";
        const film = listOfBestRankingCategory1Films[elt];
        const li = document.createElement('li');
        const bestFilmRankingCategory1Image = document.createElement('div');
        const img = document.createElement('img');
        const overlay = document.createElement('div');
        const h3 = document.createElement('h3');
        const button = document.createElement('button');
        const buttonDiv = document.createElement('div');
        const dialog = document.querySelector('dialog');
        const filmImage = film.image_url;

        filmDetails = await getFilmDetails(film);

        li.className = 'item-container';
        bestFilmRankingCategory1Image.className = 'best-film-ranking-image';

        img.addEventListener('error', () => {
            img.src = "./images/img_not_found.svg";
        })

        img.src = film.image_url;
        img.alt = `affiche de ${film.title}`;
        bestFilmRankingCategory1Image.appendChild(img);
        overlay.className = 'overlay';
        h3.textContent = film.title;
        button.className = 'btn-details__black';
        button.textContent = 'Détails';
        buttonDiv.appendChild(button);
        overlay.appendChild(h3);
        overlay.appendChild(buttonDiv);
        li.appendChild(bestFilmRankingCategory1Image);
        li.appendChild(overlay);
        bestRankingCategory1List.appendChild(li);

        button.addEventListener('click', () => {
            dialog.showModal();
            displayModalDetails(filmDetails);
        });
    }

    defaultListItems();
}

export const displayListOfBestRankingCategory2Film = async () => {
    const listOfBestRankingCategory2Films = await getListOfBestRankingCategory2Films();
    const bestRankingCategory2List = document.getElementById('bestRankingCategory2List');

    document.getElementById('bestRankingCategory2Title').innerHTML = capitalize(PARAM_VALUE_CATEGORY_2);

    bestRankingCategory2List.innerHTML = ''

    for (let elt = 1; elt < Math.min(7, listOfBestRankingCategory2Films.length); elt++) {
        let filmDetails = "";
        const film = listOfBestRankingCategory2Films[elt];
        const li = document.createElement('li');
        const bestFilmRankingCategory2Image = document.createElement('div');
        const img = document.createElement('img');
        const overlay = document.createElement('div');
        const h3 = document.createElement('h3');
        const button = document.createElement('button');
        const buttonDiv = document.createElement('div');
        const dialog = document.querySelector('dialog');
        const filmImage = film.image_url;

        filmDetails = await getFilmDetails(film);

        li.className = 'item-container';
        bestFilmRankingCategory2Image.className = 'best-film-ranking-image';

        img.addEventListener('error', () => {
            img.src = "./images/img_not_found.svg";
        })

        img.src = film.image_url;
        img.alt = `affiche de ${film.title}`;
        bestFilmRankingCategory2Image.appendChild(img);
        overlay.className = 'overlay';
        h3.textContent = film.title;
        button.className = 'btn-details__black';
        button.textContent = 'Détails';
        buttonDiv.appendChild(button);
        overlay.appendChild(h3);
        overlay.appendChild(buttonDiv);
        li.appendChild(bestFilmRankingCategory2Image);
        li.appendChild(overlay);
        bestRankingCategory2List.appendChild(li);

        button.addEventListener('click', () => {
            dialog.showModal();
            displayModalDetails(filmDetails);
        });
    }

    defaultListItems();
}

const getFilmDetails = async (item) => {
   let filmDetail = [];
    const urlFilmDetail = item.url;
    try {
        filmDetail = await fetchData(urlFilmDetail);
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

const capitalize = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}