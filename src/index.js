import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '47324612-8ceed49284fd3133cd5b6cb67';
const BASE_URL = 'https://pixabay.com/api/';
const form = document.getElementById('search-form');
const galleryImg = document.querySelector('.gallery_images');
const btnLoadMore = document.querySelector('.load-more');

let page = 0;
let query = '';
let totalHits = 0; // Загальна кількість зображень
let lightbox;


form.addEventListener('submit', onSubmitForm);
btnLoadMore.addEventListener('click', onLoadMoreClick);

async function onSubmitForm(event) {
    event.preventDefault();
    query = event.target.searchQuery.value;

    if (!query) {
        Notiflix.Notify.warning('Please enter a search query!');
        return;
    }

    page = 1; // скидаємо сторінку на початок
    galleryImg.innerHTML = ''; // очищаємо галерею
    totalHits = 0; // скидаємо загальну кількість зображень

    btnLoadMore.classList.add('is-hidden');

    try {
        const data = await fnFetch(query, page);
        totalHits = data.totalHits; // встановлюємо загальну кількість зображень
        render(data);
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        // Сховати кнопку, якщо зображень менше або рівно 40
        if (totalHits <= 40) {
            btnLoadMore.classList.add('is-hidden');
        } else {
            btnLoadMore.classList.remove('is-hidden');
        }
    } catch (error) {
        Notiflix.Notify.failure('Oops, something went wrong.');
        console.error(error);
    }
}

async function onLoadMoreClick() {
    page += 1; // збільшуємо номер сторінки
    try {
        const data = await fnFetch(query, page);
        const totalImagesLoaded = galleryImg.children.length; // кількість завантажених зображень

        console.log(`totalImagesLoaded: ${totalImagesLoaded}, totalHits: ${totalHits}`);

        // Перевіряємо, чи завантажено всі зображення
        if (totalImagesLoaded >= totalHits) {
            btnLoadMore.classList.add('is-hidden'); // сховати кнопку, якщо всі зображення завантажено
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            render(data);
            lightbox.refresh(); // оновлюємо lightbox після додавання нових зображень
        }
    } catch (error) {
        Notiflix.Notify.failure('Oops, something went wrong.');
        console.error(error);
    }
}

async function fnFetch(query, page) {
    const params = {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page, // додаємо параметр сторінки
    };

    const response = await axios.get(BASE_URL, { params });
    return response.data;
}

function render(images) {
    const murkup = images.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
            <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="400" />
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

    // Перевіряємо, чи не ініціалізовано lightbox
    if (!lightbox) {
        initLightBox();
    } else {
        lightbox.refresh(); // оновлюємо lightbox, якщо він вже ініціалізований
    }
}

function initLightBox() {
    lightbox = new SimpleLightbox('.gallery_images a', {
        captionsData: 'alt',
        captionDelay: 250
    });
}








// 1.Ставимо слухач.
// 2.При сабміні ми отримуємо інформацію.
// 3.створюємо посилання для виклику до бекенду.
// 4.За допомогою html створюємо розмітку та рендеримо фото з бекенду.


// form.addEventListener('submit', onSubmitForm);
// btnLoadMore.addEventListener('click', onClickLoadMore);


// async function onSubmitForm(event) {
//     event.preventDefault();
//     query = event.target.searchQuery.value;

//     if (!query) {
//         Notiflix.Notify.warning('Please enter a search query!');
//         return;
//     }
    
//     page = 1;
//     galleryImg.innerHTML = '';
//     totalHits = 0;

//     try {
//         const getData = await fnFetch(query, page);
//         totalHits = getData.totalHits;
//         render(getData); 
//         Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

//         if (totalHits <= 40) {
//             btnLoadMore.classList.add('is-hidden');
//         } else {
//             btnLoadMore.classList.remove('is-hidden');
//         }
//     }catch(error) {
//          Notiflix.Notify.failure('Oops, something went wrong.');
//          console.error(error);
//     }
        
// }


// async function fnFetch() {
//     params = {
//         key: API_KEY,
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         per_page: 40,
//     }
 
//     const response = await axios.get(BASE_URL, { params });
//     return response.data;
// }


// function render(images) {
//     const murkup = images.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
//         `<div class="photo-card">
//     <a href="${largeImageURL}">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" width="400" />
//    </a>  
//   <div class="info">
//     <p class="info-item">
//       <b>likes</b>
//       ${likes}
//     </p>
//     <p class="info-item">
//       <b>views</b>
//       ${views}
//     </p>
//     <p class="info-item">
//       <b>comments</b>
//       ${comments}
//     </p>
//     <p class="info-item">
//       <b>downloads</b>
//       ${downloads}
//     </p>
//   </div>
// </div>`
//     ).join('');
//     galleryImg.insertAdjacentHTML('beforeend', murkup);
// }














