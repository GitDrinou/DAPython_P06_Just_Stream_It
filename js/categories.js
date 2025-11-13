import { URL_SERVER, ENDPOINT_API_CATEGORIES } from "./constants.js";

const getListOfCategories = async () => {
    let allCategories = [];
    let nextUrl = `${URL_SERVER}${ENDPOINT_API_CATEGORIES}`

    while (nextUrl) {
        try {
            const response = await fetch(nextUrl);
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des catégories (page ${nextUrl}).`);
            }

            const data = await response.json();  
            allCategories = [...allCategories, ...data.results];
            nextUrl = data.next;
        } 
        catch (error) {
            console.error("Erreur :", error);
            throw error;
        }
    }
    return allCategories;
}

export const fillTheCategoriesSelector = async () => {
    const categories = await getListOfCategories();
    const otherSelector = document.getElementById('categoriesSelect');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        otherSelector.appendChild(option);
    })
}