import { getListOfFilms, getFilmDetails } from "./api/get_films.js";
import { showLoader, hideLoader, formatFilmBudget, capitalize, delay } from "./utils.js";
import { defaultListItems } from "./display_elements.js";
import {
    PARAM_LABEL_CATEGORY, 
    PARAM_VALUE_CATEGORY_1, 
    PARAM_VALUE_CATEGORY_2, 
    PARAM_LABEL_OTHER,
    MIN_LOADER_TIMER
} from "./constants.js";

export const displayTheBestRankingFilmDetails = async () => {
    const listOfBestRankingFilms = await getListOfFilms();
    const filmDetails = await getFilmDetails(listOfBestRankingFilms[0]);

    document.querySelector('.best-film-details__title').innerHTML = filmDetails.title;
    document.querySelector('.best-film-details__text').innerHTML = filmDetails.description;

    displayModalDetails(filmDetails);
}   

export const displayListOfFilms = async (category) => {
    showLoader();
    const startTime = Date.now();
    try {
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

            filmDetails = await getFilmDetails(film);

            li.className = 'item-container';
            divImage.className = 'best-film-ranking-image';

            img.addEventListener('error', () => {
                img.src = "./images/img_not_found.png";
                img.alt = "Image de remplacement - Affiche non disponible";
                img.crossorigin = "anonymous";
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

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MIN_LOADER_TIMER) {
            await delay(MIN_LOADER_TIMER - elapsedTime);
        }

        return listOfFilms.length;
    }
    catch (error) {
        console.error("Erreur:", error);
    }
    finally {
        hideLoader();
    }
    

}

const displayModalDetails = (data) => { 
    
    const filmRates = data.rated.includes("Not rated") ? "PG(NR) - " : data.rated + " -";
    const filmImage = data.image_url;

    document.getElementById('modalFilmImage').addEventListener('error', () => {
        document.getElementById('modalFilmImage').src = "./images/img_not_found.png";
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