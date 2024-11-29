import axios from 'axios';
import Notiflix from 'notiflix';


const API_KEY = '47324612-8ceed49284fd3133cd5b6cb67';
const BASE_URL = 'https://pixabay.com/api/';
const form = document.getElementById('search-form');
const galleryImg = document.querySelector('.gallery_images');
const btnLoadMore = document.querySelector('.load-more');
                                       
form.addEventListener('submit',onSubmitForm );
                                           

async function onSubmitForm(event) {
    event.preventDefault();
    const query = event.target.elements.searchQuery.value;
    
    if (!query) {
        Notiflix.Notify.warning('Please enter a search query!');
        return;
    }
  
    try {
        const data = await fnFetch(query);
        render(data);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
    } catch (error) {
        Notiflix.Notify.failure('Oops, something went wrong.');
        console.error(error)
    }
}  



 async function fnFetch(query){

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
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
     <div class="info">
    <p class="info-item"> <b>Likes</b>${likes}</p>
    <p class="info-item"><b>Views</b>${views}</p>
    <p class="info-item"><b>Comments</b>${comments}</p>
    <p class="info-item"><b>Downloads</b>${downloads}</p>
    </div>
    </div>`
    ).join('');
    galleryImg.innerHTML = murkup;
}




