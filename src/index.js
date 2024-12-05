import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '47324612-8ceed49284fd3133cd5b6cb67';
const BASE_URL = 'https://pixabay.com/api/';
const form = document.getElementById('search-form');
const galleryImg = document.querySelector('.gallery_images');
const btnLoadMore = document.querySelector('.load-more');
                                       
let page = 1;
 galleryImg.innerHTML = '';
let query = '';

form.addEventListener('submit',onSubmitForm );
btnLoadMore.addEventListener('click', onLoadMoreClick);

let lightbox = new SimpleLightbox('.gallery_images a', {
  captionsData: 'alt',
  captionDelay: 250  
})


async function onSubmitForm(event) {
    event.preventDefault();
     query = event.target.searchQuery.value;
    
    if (!query) {
        Notiflix.Notify.warning('Please enter a search query!');
        return;
    }
    page = 1;
    
    try {
        const data = await fnFetch(query, page);
        render(data)
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

         if (data.hits.length < 40) {
             btnLoadMore.style.display = 'none';
              
    } else {
            btnLoadMore.style.display = 'block';
        }
    } catch (error) {
        Notiflix.Notify.failure('Oops, something went wrong.');
        console.error(error)
    }

   
}  


async function onLoadMoreClick() {
    page += 1; // Збільшуємо номер сторінки
    try {
        const data = await fnFetch(query, page); // Отримуємо нові дані

        if (data.hits.length < 40 || galleryImg.children.length >= data.totalHits) {
            btnLoadMore.classList.add('is-hidden'); // Якщо більше зображень немає
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            render(data); // Додаємо нові зображення в галерею
        }
    } catch (error) {
        Notiflix.Notify.failure('Oops, something went wrong.');
        console.error(error);
    }
}



 async function fnFetch(query, page){

     const params = {
         key: API_KEY,
         q: query,
         image_type: 'photo',
         orientation: 'horizontal',
         safesearch: true,
         per_page: 40,
     };
    
     const response = await axios.get(BASE_URL, { params });
        
     return response.data;
}   
    

function render(images) {
    const murkup = images.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
 `<div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" width="400"  />
        </a>
      <div class="info">
        <p class="info-item"> <b>Likes:</b>${likes}</p>
        <p class="info-item"><b>Views:</b>${views}</p>
        <p class="info-item"><b>Comments:</b>${comments}</p>
        <p class="info-item"><b>Downloads:</b>${downloads}</p>
      </div>
    </div>`
    ).join('');
    galleryImg.insertAdjacentHTML('beforeend', murkup);

     lightbox.refresh();
}




