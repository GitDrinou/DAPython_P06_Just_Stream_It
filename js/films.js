import { URL_SERVER, ENDPOINT_API_FILMS, MAX_COUNT, PARAM_SORT_BY, PARAM_VALUE_SORT_BY } from "./constants.js";

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
    
    document.querySelector('.best-film-details__title').innerHTML = filmDetails.title;
    document.querySelector('.best-film-details__text').innerHTML = filmDetails.description;

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