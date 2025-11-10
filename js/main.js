import { defaultListItems, displayMorOrLess, displayModal} from "./display_utils.js";
import { fillTheCategoriesSelector } from "./categories.js";

window.addEventListener('DOMContentLoaded', () => {

    const dialog = document.querySelector('dialog');
   
    defaultListItems();
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
    })

    // API GET Functions to fill the HTML page
    fillTheCategoriesSelector();

})

window.addEventListener('resize', () => {
    defaultListItems();
});
