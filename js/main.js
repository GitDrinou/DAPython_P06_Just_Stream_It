import { defaultListItems, displayOtherItems, displayMorOrLess, displayModal} from "./display_utils.js";
import { fillTheCategoriesSelector } from "./categories.js";
import { displayTheBestRankingFilmDetails, displayListOfBestRankingFilm } from "./films.js";

window.addEventListener('DOMContentLoaded', () => {

    // API GET Functions to fill the HTML page
    fillTheCategoriesSelector();
    displayTheBestRankingFilmDetails();
    displayListOfBestRankingFilm();

    const dialog = document.querySelector('dialog');

    defaultListItems();
    displayOtherItems();
    displayModal(dialog);

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn__more-or-less')) {
            const button = event.target;
            const targetListId = button.getAttribute('data-target');
            displayMorOrLess(button.id, targetListId)
        }

        if (event.target.classList.contains('btn-details__red')) {
            dialog.showModal();
        }

        if (event.target.classList.contains('btn-details__black')) {
            dialog.showModal();
        }
    })
   

})

window.addEventListener('resize', () => {
    defaultListItems();
});
