export function defaultListItems() {
    const ranking_list = document.querySelectorAll('.best-ranking__list');

    let maxItems = 0;

    if (window.matchMedia('(min-width: 1024px)').matches) {
        maxItems = 6;
    } else if (window.matchMedia('(min-width: 768px)').matches) {
        maxItems = 4;
    } else {
        maxItems = 2;
    }
    
    ranking_list.forEach(list => {
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