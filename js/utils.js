import {
    MIN_WIDTH_DESKTOP,
    MIN_WIDTH_TABLET,
    MAX_TABLET,
    MAX_COUNT,
    MAX_MOBILE, 
    DEVISE_ENUM
} from './constants.js';

export const screenItems = () => {
    let maxItems;

    if (window.matchMedia(MIN_WIDTH_DESKTOP).matches) {
        maxItems = MAX_COUNT;
    } else if (window.matchMedia(MIN_WIDTH_TABLET).matches) {
        maxItems = MAX_TABLET;
    } else {
        maxItems = MAX_MOBILE;
    }
    return maxItems;
}

export const fetchData = async (url) => {
    const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des films (page ${url}).`);
        }
    const data = await response.json()
    return data; 
}

export const formatFilmBudget = (budget, currency) => {
    let amount = 0;
    if (budget != null){
        if (budget < 1000000){
            amount = budget;
        } else {
            amount = (budget / 1_000_000).toFixed(1)+"m";
        }
        
        return getDeviseSymbol(currency) + amount;
    }
    return "Non fourni";
}

const getDeviseSymbol = (codeDevise) => {
  return DEVISE_ENUM[codeDevise];
}

export const capitalize = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const showLoader = () => {
    document.getElementById('loader').style.display = 'flex';
};

export const hideLoader = () => {
    document.getElementById('loader').style.display = 'none';
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));