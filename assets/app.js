import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import { initMoisDetails, initPlanteDetails, initAdminEdit } from './js/details.js';

document.addEventListener('DOMContentLoaded', () => {
    initMoisDetails();
    initPlanteDetails();
    initAdminEdit();
});
