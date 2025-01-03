const AppMenu = {
    init: () => {
        AppMenu.menuToggle();
        AppMenu.parentMenu();
    },
    menuToggle: () => {
        const menuToggle = document.getElementById('menu-toggle');
        if(menuToggle) {
            menuToggle.addEventListener('click', (evt) => {
                const menuContainer = document.querySelector('.menu-container');
                if(menuContainer.className.includes('open')) {
                    menuContainer.classList.remove('open');
                } else {
                    menuContainer.classList.add('open');
                    const wpadminbar = document.getElementById('wpadminbar'),
                        header = document.querySelector('.header'),
                        menu = document.querySelector('.header-menu');
                    let adminBarOFfset = 0;
                    if(wpadminbar) {
                        adminBarOFfset = wpadminbar.offsetHeight
                    }
                    menu.style.top = `${adminBarOFfset + header.offsetHeight}px`;
                }
            });
        }
    },
    parentMenu: () => {
        const parentMenu = document.querySelectorAll('.header-menu__item--parent');
        if(parentMenu) {
            parentMenu.forEach((element) => {
                element.addEventListener('click', (evt) => {
                    const subMenu = element.querySelector('.sub-menu');
                    if(subMenu) {
                        if(subMenu.className.includes('open')) {
                            subMenu.classList.remove('open');
                        } else {
                            subMenu.classList.add('open');
                        }
                    }
                })
            })
        }
    }
}

export default AppMenu;