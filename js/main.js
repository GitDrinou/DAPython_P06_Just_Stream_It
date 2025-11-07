import { defaultListItems, displayMorOrLess} from "./display_utils.js";

window.addEventListener('DOMContentLoaded', () => {

    const dialog = document.querySelector('dialog');
    const closeModalMobile = document.querySelector('.btn-close__mobile');
    const closeModalDesktop = document.querySelector('.btn-close__desktop');
    
    if (closeModalMobile) {
        closeModalMobile.addEventListener('click', () => {
            dialog.close();
        })
    }

    if (closeModalDesktop) {
        closeModalDesktop.addEventListener('click', () => {
            dialog.close();
        })
    }
    
    defaultListItems();

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

})

window.addEventListener('resize', () => {
    defaultListItems();
});