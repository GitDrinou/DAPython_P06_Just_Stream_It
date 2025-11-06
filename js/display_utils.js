import { 
    MAX_COUNT, MAX_MOBILE,
    MAX_TABLET,
    LABEL_SEE_LESS,
    LABEL_SEE_MORE,
    MIN_WIDTH_DESKTOP,
    MIN_WIDTH_TABLET } from "./constants.js";

export function defaultListItems() {
    const rankingList = document.querySelectorAll('.best-ranking__list');
    let maxItems = screenItems();

    rankingList.forEach(list => {
        const items = list.querySelectorAll('li');

        displayedItems(items, maxItems);
    })
}

export function displayMorOrLess(buttonId, listId) {
    const labelButton = document.getElementById(buttonId).innerHTML;
    const pictureList = document.getElementById(listId);
    const items = pictureList.querySelectorAll('li');
    
    if (labelButton == LABEL_SEE_MORE) {
        items.forEach(item => {
            if (item.style.display == 'none') {
                item.style.display = 'block';
            }
        }) 
        document.getElementById(buttonId).innerHTML = LABEL_SEE_LESS;
    } else {
        let maxItems = screenItems();
        displayedItems(items, maxItems);
        document.getElementById(buttonId).innerHTML = LABEL_SEE_MORE;
    }

}

function screenItems() {
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

function displayedItems(items, maxItems) {
    items.forEach((item, index) => {
        if (index < maxItems) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
