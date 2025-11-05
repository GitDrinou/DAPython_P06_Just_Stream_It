export function defaultListItems(maxDefault, maxTablet, maxMobile) {
    const rankingList = document.querySelectorAll('.best-ranking__list');
    let maxItems;

    if (window.matchMedia('(min-width: 1024px)').matches) {
        maxItems = maxDefault;
    } else if (window.matchMedia('(min-width: 768px)').matches) {
        maxItems = maxTablet;
    } else {
        maxItems = maxMobile;
    }

    rankingList.forEach(list => {
        const items = list.querySelectorAll('li');

        items.forEach((item, index) => {
            if (index < maxItems) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
    })
}

export function displayMorOrLess(buttonId, listId, maxDefault) {
    const labelButton = document.getElementById(buttonId).innerHTML;
    const pictureList = document.getElementById(listId);
    const items = pictureList.querySelectorAll('li');
    items.forEach(item => {
        if (item.style.display == 'none') {
            item.style.display = 'block';
        }
    }) 
    document.getElementById(buttonId).innerHTML = "Voir moins";
}
