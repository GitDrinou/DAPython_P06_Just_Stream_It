import {
    URL_SERVER,
    ENDPOINT_API_FILMS,
    MAX_COUNT,
    PARAM_LABEL_SORT_BY,
    PARAM_VALUE_SORT_BY_IMDB
} from "../constants.js";
import { defaultListItems } from "../display_elements.js";
import { 
    fetchData,
    formatFilmBudget,
    capitalize,
    showLoader,
    hideLoader,
    delay } from '../utils.js';


export const getListOfFilms = async (paramLabel, paramValue) => {
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

export const getFilmDetails = async (item) => {
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
