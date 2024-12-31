/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./themes/theme/src/scripts/base/menu.js":
/*!***********************************************!*\
  !*** ./themes/theme/src/scripts/base/menu.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const AppMenu = {
  init: () => {
    AppMenu.menuToggle();
    AppMenu.parentMenu();
  },
  menuToggle: () => {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', evt => {
        const menuContainer = document.querySelector('.menu-container');
        if (menuContainer.className.includes('open')) {
          menuContainer.classList.remove('open');
        } else {
          menuContainer.classList.add('open');
          const wpadminbar = document.getElementById('wpadminbar'),
            header = document.querySelector('.header'),
            menu = document.querySelector('.header-menu');
          let adminBarOFfset = 0;
          if (wpadminbar) {
            adminBarOFfset = wpadminbar.offsetHeight;
          }
          menu.style.top = `${adminBarOFfset + header.offsetHeight}px`;
        }
      });
    }
  },
  parentMenu: () => {
    const parentMenu = document.querySelectorAll('.header-menu__item--parent');
    if (parentMenu) {
      parentMenu.forEach(element => {
        element.addEventListener('click', evt => {
          const subMenu = element.querySelector('.sub-menu');
          if (subMenu) {
            if (subMenu.className.includes('open')) {
              subMenu.classList.remove('open');
            } else {
              subMenu.classList.add('open');
            }
          }
        });
      });
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AppMenu);

/***/ }),

/***/ "./themes/theme/src/scripts/blocks/tabs.js":
/*!*************************************************!*\
  !*** ./themes/theme/src/scripts/blocks/tabs.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Tabs = {
  init: () => {
    Tabs.showFirstTab();
    Tabs.addEvents();
  },
  showFirstTab: () => {
    const firstTab = document.querySelector('.tabs__item_content:first-of-type');
    const firstContent = document.querySelector('.tabs__tab:first-of-type');
    if (!firstTab || !firstContent) return;
    firstTab.classList.add('active');
    firstContent.classList.add('active');
  },
  addEvents: () => {
    const tabs = document.querySelectorAll('.tabs__tab');
    const contents = document.querySelectorAll('.tabs__item_content');
    if (!tabs || !contents) return;
    tabs.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-target');
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        item.classList.add('active');
      });
    });
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tabs);

/***/ }),

/***/ "./themes/theme/src/scss/app.scss":
/*!****************************************!*\
  !*** ./themes/theme/src/scss/app.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./themes/theme/src/scripts/app.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_app_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/app.scss */ "./themes/theme/src/scss/app.scss");
/* harmony import */ var _base_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base/menu */ "./themes/theme/src/scripts/base/menu.js");
/* harmony import */ var _blocks_tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./blocks/tabs */ "./themes/theme/src/scripts/blocks/tabs.js");



window.addEventListener('load', () => {
  _base_menu__WEBPACK_IMPORTED_MODULE_1__["default"].init();
  _blocks_tabs__WEBPACK_IMPORTED_MODULE_2__["default"].init();
});
/******/ })()
;
//# sourceMappingURL=app.js.map