import axios from 'axios';
import Notiflix from 'notiflix';


const API_KEY = '47324612-8ceed49284fd3133cd5b6cb67';
const BASE_URL = 'https://pixabay.com/api/';


const form = document.getElementById('search-form');
const galleryImg = document.querySelector('.gallery_images');
const btnLoadMore = document.querySelector('.load-more');



form.addEventListener('submit', getElements);

function getElements(event) {
    event.preventDefault();
    
}
