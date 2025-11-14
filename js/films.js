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
    PARAM_LABEL_OTHER,
    CATEGORIES,
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

const getListOfFilms = async (paramLabel, paramValue) => {
   let listOfFilms = [];
    const url = new URL(`${URL_SERVER}${ENDPOINT_API_FILMS}`);
    url.searchParams.append(PARAM_LABEL_SORT_BY, PARAM_VALUE_SORT_BY_IMDB);
    if (paramLabel) {
        url.searchParams.append(paramLabel, paramValue);
    }

    try {
        const data = await fetchData(url);
        listOfFilms = [...listOfFilms, ...data.results];

        if (data.results.length <= MAX_COUNT && data.next) {
            const dataNextPage = await fetchData(data.next);
            listOfFilms = [...listOfFilms, ...dataNextPage.results]
        }  
    } 
    catch (error) {
        console.error("Erreur :", error);
        throw error;
    }

    return listOfFilms;
}

export const displayTheBestRankingFilmDetails = async () => {
    const listOfBestRankingFilms = await getListOfFilms();
    const filmDetails = await getFilmDetails(listOfBestRankingFilms[0]);

    document.querySelector('.best-film-details__title').innerHTML = filmDetails.title;
    document.querySelector('.best-film-details__text').innerHTML = filmDetails.description;

    displayModalDetails(filmDetails);
}   

export const displayListOfFilms = async (category) => {
    let listOfFilms = "";
    let htmlList = "";

    switch (category) {
        case "none": 
            listOfFilms = await getListOfFilms();
            htmlList = document.getElementById('bestRankingList');
            break;
        case "catégorie 1": 
            listOfFilms = await getListOfFilms(PARAM_LABEL_CATEGORY, PARAM_VALUE_CATEGORY_1);
            htmlList = document.getElementById('bestRankingCategory1List');
            document.getElementById('bestRankingCategory1Title').innerHTML = capitalize(PARAM_VALUE_CATEGORY_1);
            break;
        case "catégorie 2":
            listOfFilms = await getListOfFilms(PARAM_LABEL_CATEGORY, PARAM_VALUE_CATEGORY_2);
            htmlList = document.getElementById('bestRankingCategory2List');
            document.getElementById('bestRankingCategory2Title').innerHTML = capitalize(PARAM_VALUE_CATEGORY_2);
            break;
        case "autres":
            const otherSelected = document.getElementById('categoriesSelect').value;
            listOfFilms = await getListOfFilms(PARAM_LABEL_OTHER, otherSelected);
            htmlList = document.getElementById('bestRankingOtherList');
            break;
    }
    
    htmlList.innerHTML = '';
    let startIndex = 0; 
    let minElts = 6;

    if (category == "none") {
        startIndex = 1;
        minElts = 7
    }

    for (let elt = startIndex; elt < Math.min(minElts, listOfFilms.length); elt++) {
        let filmDetails = "";
        const film = listOfFilms[elt];
        const li = document.createElement('li');
        const divImage = document.createElement('div');
        const img = document.createElement('img');
        const overlay = document.createElement('div');
        const h3 = document.createElement('h3');
        const button = document.createElement('button');
        const buttonDiv = document.createElement('div');
        const dialog = document.querySelector('dialog');
        const filmImage = film.image_url;

        filmDetails = await getFilmDetails(film);

        li.className = 'item-container';
        divImage.className = 'best-film-ranking-image';

        img.addEventListener('error', () => {
            img.src = "./images/img_not_found.svg";
        })

        img.src = film.image_url;
        img.alt = `affiche de ${film.title}`;
        divImage.appendChild(img);
        overlay.className = 'overlay';
        h3.textContent = film.title;
        button.className = 'btn-details__black';
        button.textContent = 'Détails';
        buttonDiv.appendChild(button);
        overlay.appendChild(h3);
        overlay.appendChild(buttonDiv);
        li.appendChild(divImage);
        li.appendChild(overlay);
        htmlList.appendChild(li);

        button.addEventListener('click', () => {
            dialog.showModal();
            displayModalDetails(filmDetails);
        });
    }

    defaultListItems();
    return listOfFilms.length;

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