import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import { initMoisDetails, initPlanteDetails, initAdminEdit, initAdminPhoto } from './js/details.js';
import { initSwipeMois } from './js/swipe.js';

document.addEventListener('DOMContentLoaded', () => {
    initMoisDetails();
    initPlanteDetails();
    initAdminEdit();
    initAdminPhoto();
    initSwipeMois();
});
