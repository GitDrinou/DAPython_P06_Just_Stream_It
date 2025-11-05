import { defaultListItems, displayMorOrLess } from "./display_utils.js";
import { MAX_COUNT, MAX_MOBILE, MAX_TABLET } from "./constants.js";

window.addEventListener('DOMContentLoaded', () => {
    defaultListItems(MAX_COUNT, MAX_TABLET, MAX_MOBILE);

    document.getElementById('ranking_picture').addEventListener('click', () => {
       displayMorOrLess("ranking_picture", "bestRankingList", MAX_COUNT); 
    })
})

window.addEventListener('resize', () => {
    defaultListItems();
});