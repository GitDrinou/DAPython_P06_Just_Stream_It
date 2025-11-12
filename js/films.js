import {
    URL_SERVER,
    ENDPOINT_API_FILMS,
    MAX_COUNT, PARAM_SORT_BY,
    PARAM_VALUE_SORT_BY,
    DEVISE_ENUM
} from "./constants.js";

const getListOfBestRankingFilms = async () => {
    let bestRankingFilms = [];
    const sortByImdbScoreDesc = PARAM_VALUE_SORT_BY;
    let nextUrl = `${URL_SERVER}${ENDPOINT_API_FILMS}`;
    let url = new URL(nextUrl);
    url.searchParams.append(PARAM_SORT_BY, sortByImdbScoreDesc);

    while (url && bestRankingFilms.length <= MAX_COUNT) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des films (page ${url}).`);
            }

            const data = await response.json();  
            bestRankingFilms = [...bestRankingFilms, ...data.results];
            nextUrl = data.next;
        } 
        catch (error) {
            console.error("Erreur :", error);
            throw error;
        }
    }
    
    return bestRankingFilms;
}

export const displayTheBestRankingFilmDetails = async () => {
    const listOfBestRankingFilms = await getListOfBestRankingFilms();
    const filmDetails = await getTheFilmDetails(listOfBestRankingFilms[0]);

    const filmRates = filmDetails.rated.includes("Not rated") ? "" : "PG-" + filmDetails.rated + " -";
    const filmImage = filmDetails.image_url;

    document.getElementById('modalFilmImage').addEventListener('error', () => {
        document.getElementById('modalFilmImage').src = "./images/img_not_found.svg";
    })

    document.querySelector('.best-film-details__title').innerHTML = filmDetails.title;
    document.querySelector('.best-film-details__text').innerHTML = filmDetails.description;
    document.getElementById('modalFilmTitle').innerHTML = filmDetails.title;
    document.getElementById('modalFilmDate').innerHTML = filmDetails.year;
    document.getElementById('modalFilmCatageories').innerHTML = filmDetails.genres.join(', ');
    document.getElementById('modalFilmRates').innerHTML = filmRates;
    document.getElementById('modalFilmDuration').innerHTML = filmDetails.duration + " minutes";
    document.getElementById('madalFilmCountries').innerHTML = filmDetails.countries.join('/ ');
    document.getElementById('modalFilmScore').innerHTML = filmDetails.imdb_score;
    document.getElementById('modalFilmBudget').innerHTML = formatFilmBudget(filmDetails.budget, filmDetails.budget_currency);
    document.getElementById('modalFilmDirectors').innerHTML = filmDetails.directors.join(', ');
    document.getElementById('modalFilmDescription').innerHTML = filmDetails.long_description;
    document.getElementById('modalFilmActors').innerHTML = filmDetails.actors.join(', ');
    document.getElementById('modalFilmImage').src = filmImage;
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