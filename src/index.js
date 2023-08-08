import Notiflix from 'notiflix';

import { fetchImages } from './js/pixabay-api';
import { renderGallery } from './js/renderGallery';

// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


loadMoreBtn.classList.add('is-hidden');

let page = 1;
let query = '';
// let simpleLightBox;
const perPage = 40;

function simple() {
    const simpleLightBox = new SimpleLightbox('.gallery a');

    return simpleLightBox
}

const lightBox = simple(); 

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearch(event) {
    event.preventDefault();
    
    page = 1;
    query = event.currentTarget.searchQuery.value.trim();
    gallery.innerHTML = '';
    

    if(query === '') {
        Notiflix.Notify.failure(`The search string cannot be empty. Please specify your search query.`);
        return;
    }

    fetchImages(query, page, perPage)
    .then(({data}) => {
        if (data.totalHits === 0) {
            Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        }else {
            renderGallery(data.hits);
            lightBox.refresh();
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            console.log(data.totalHits);

            if (data.totalHits > perPage) {
                loadMoreBtn.classList.remove('is-hidden');
            }
        }


    })
    .catch(error => console.log(error))
    .finally(() => {
        searchForm.reset();
});
}

function onLoadMoreBtn() {
    page += 1;
    // simpleLightBox.destroy();
    console.log(page);

    fetchImages(query, page, perPage)
    .then (({data}) => {
        renderGallery(data.hits)
        lightBox.refresh();

        const totalPages = Math.ceil(data.totalHits / perPage);
        console.log(totalPages);

        if (page >= totalPages) {
            loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
        }
    })
    .catch(error => console.log(error));
}

