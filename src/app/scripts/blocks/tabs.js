const Tabs = {
    init: () => {
        Tabs.showFirstTab();
        Tabs.addEvents();
    },
    showFirstTab: () => {
        const firstTab = document.querySelector('.tabs__item_content:first-of-type');
        const firstContent = document.querySelector('.tabs__tab:first-of-type');
        if(!firstTab || !firstContent) return;

        firstTab.classList.add('active');
        firstContent.classList.add('active');
    },
    addEvents: () => {
        const tabs = document.querySelectorAll('.tabs__tab');
        const contents = document.querySelectorAll('.tabs__item_content');
        if(!tabs || !contents) return;

        tabs.forEach((item) => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-target');
                tabs.forEach(tab => tab.classList.remove('active'));
                contents.forEach(content => content.classList.remove('active'));
                document.getElementById(id).classList.add('active');
                item.classList.add('active');
            });
        })
    }
}

export default Tabs;