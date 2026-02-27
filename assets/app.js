import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import { initMoisDetails, initPlanteDetails } from './js/details.js';

document.addEventListener('DOMContentLoaded', () => {
    initMoisDetails();
    initPlanteDetails();
});
