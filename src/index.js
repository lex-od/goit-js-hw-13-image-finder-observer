import { notice as pnNotice, defaults as pnDefaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import 'basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';

import './styles.scss';
import photoCardTmpl from './data/photoCard.hbs';
import API from './js/apiService';

pnDefaults.delay = 3000;

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryList: document.querySelector('#gallery-list'),
    // galleryLoad: document.querySelector('#gallery-load'),
    observerTarget: document.querySelector('#observer-target'),
};

refs.searchForm.addEventListener('submit', onSearch);
// refs.galleryLoad.addEventListener('click', onGalleryLoadClick);
refs.galleryList.addEventListener('click', onGalleryListClick);

const observer = new IntersectionObserver(onTargetIntersect, {
    rootMargin: '50px',
    threshold: 0.01,
});
observer.observe(refs.observerTarget);

async function onSearch(e) {
    e.preventDefault();

    const query = e.currentTarget.elements.query.value;

    try {
        const hits = await API.getFirstPageHits(query);

        if (!hits.length) {
            notifyUser('no-results');
        }

        clearGalleryList();
        addGalleryListMarkup(hits);
    } catch (err) {
        apiErrorHandler(err);
    }
}

// async function onGalleryLoadClick() {
//     if (API.isLastPage) {
//         notifyUser('last-page');
//         return;
//     }

//     try {
//         const hits = await API.getNextPageHits();

//         addGalleryListMarkup(hits);
//         scrollToLastAdded(hits.length);
//     } catch (err) {
//         apiErrorHandler(err);
//     }
// }

async function onTargetIntersect(targets) {
    if (!targets[0].isIntersecting || API.isLastPage) {
        return;
    }

    try {
        const hits = await API.getNextPageHits();

        addGalleryListMarkup(hits);
    } catch (err) {
        apiErrorHandler(err);
    }
}

function addGalleryListMarkup(hits) {
    refs.galleryList.insertAdjacentHTML('beforeend', photoCardTmpl(hits));
}

function clearGalleryList() {
    refs.galleryList.innerHTML = '';
}

function apiErrorHandler(err) {
    console.log(`??? ${err.name}: ${err.message}`);

    clearGalleryList();
}

// function scrollToLastAdded(addedCount) {
//     if (addedCount < 1) {
//         return;
//     }

//     const collection = refs.galleryList.children;
//     const itemToScrollRef = collection[collection.length - addedCount];

//     const itemTopAbs =
//         itemToScrollRef.getBoundingClientRect().top + pageYOffset;

//     setTimeout(
//         () => window.scrollTo({ top: itemTopAbs, behavior: 'smooth' }),
//         800,
//     );
// }

function notifyUser(type) {
    let message = '';

    switch (type) {
        case 'no-results':
            message = '?? ??????????????????, ???? ???????????? ?????????????? ???????????? ???? ??????????????!';
            break;
        case 'last-page':
            message = '???? ???????????????? ?????????????? ???????????? ?????? ??????????????????????!';
            break;
    }

    if (message) {
        pnNotice(message);
    }
}

function onGalleryListClick(e) {
    if (!e.target.classList.contains('photo-card-image')) {
        return;
    }

    basicLightbox.create(`<img src="${e.target.dataset.url}">`).show();
}
