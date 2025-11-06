import { defaultListItems, displayMorOrLess } from "./display_utils.js";

window.addEventListener('DOMContentLoaded', () => {
    defaultListItems();

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn__more-or-less')) {
            const button = event.target;
            const targetListId = button.getAttribute('data-target');
            displayMorOrLess(button.id, targetListId)
        }
    })
})

window.addEventListener('resize', () => {
    defaultListItems();
});