import { Modal } from 'bootstrap';

const traductions = {
    "Perennial": "Vivace", "Annual": "Annuelle", "Biennial": "Bisannuelle",
    "Evergreen": "Persistant", "Deciduous": "Caduc", "Semi-evergreen": "Semi-persistant",
    "Yes": "Oui", "No": "Non",
    "Hardy": "Rustique", "Tender": "Fragile",
    "red": "rouge", "blue": "bleu", "white": "blanc", "yellow": "jaune",
    "pink": "rose", "purple": "violet", "orange": "orange", "green": "vert",
    "brown": "brun", "black": "noir", "grey": "gris", "silver": "argenté",
    "jan": "janvier", "feb": "février", "mar": "mars", "apr": "avril",
    "may": "mai", "jun": "juin", "jul": "juillet", "aug": "août",
    "sep": "septembre", "oct": "octobre", "nov": "novembre", "dec": "décembre"
};

function traduire(val) {
    if (val === null || val === undefined) return val;
    if (Array.isArray(val)) return val.map(traduire);
    if (typeof val === 'string') return traductions[val] || val;
    return val;
}

function echelleTexte(val, labels) {
    if (val === null || val === undefined) return null;
    const idx = Math.min(Math.floor(val / (10 / labels.length)), labels.length - 1);
    return `${labels[idx]} (${val}/10)`;
}

const cache = {};

async function fetchDetails(nom) {
    if (cache[nom]) return cache[nom];
    const res = await fetch(`/api/plante/${encodeURIComponent(nom)}/details`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erreur ${res.status}`);
    }
    const plant = await res.json();
    cache[nom] = plant;
    return plant;
}

function construireHtml(nom, plant, {
    titre = false,
    colImg = 'col-md-4',
    colTable = 'col-md-8',
    tableClass = 'table table-sm'
} = {}) {
    const imageUrl = plant.image_url
        || (plant.images?.flower?.[0]?.image_url)
        || (plant.images?.habit?.[0]?.image_url);

    const ligne = (label, val) => {
        const v = traduire(val);
        if (v !== undefined && v !== null && v !== '') {
            const texte = Array.isArray(v) ? v.join(', ') : v;
            return `<tr><th class="text-nowrap">${label}</th><td>${texte}</td></tr>`;
        }
        return '';
    };

    const g    = plant.growth || {};
    const spec = plant.specifications || {};
    const fl   = plant.flower || {};
    const fo   = plant.foliage || {};

    let rows = '';
    rows += ligne('Nom commun', plant.common_name);
    rows += ligne('Nom scientifique', plant.scientific_name);
    rows += ligne('Famille', plant.family);
    rows += ligne('Cycle', plant.duration);
    rows += ligne('Humidité', echelleTexte(g.atmospheric_humidity, ['Très sec', 'Sec', 'Moyen', 'Humide', 'Très humide']));
    rows += ligne('Ensoleillement', echelleTexte(g.light, ['Ombre totale', 'Ombre', 'Mi-ombre', 'Soleil partiel', 'Plein soleil']));
    if (g.minimum_temperature?.deg_c != null) rows += ligne('Rusticité', `Min. ${g.minimum_temperature.deg_c} °C`);
    if (spec.maximum_height?.cm != null) rows += ligne('Taille max.', `${spec.maximum_height.cm / 100} m`);
    if (plant.edible !== null && plant.edible !== undefined) rows += ligne('Comestible', plant.edible ? 'Oui' : 'Non');
    if (plant.edible_part) rows += ligne('Parties comestibles', plant.edible_part);
    if (spec.toxicity && spec.toxicity !== 'none') rows += ligne('Toxicité', spec.toxicity);
    if (fl.color) rows += ligne('Couleur des fleurs', fl.color);
    if (fo.color) rows += ligne('Couleur du feuillage', fo.color);
    if (fo.leaf_retention !== null && fo.leaf_retention !== undefined) {
        rows += ligne('Feuillage', fo.leaf_retention ? 'Persistant' : 'Caduc');
    }
    if (g.bloom_months) rows += ligne('Mois de floraison', g.bloom_months);

    let html = titre ? '<h5 class="mb-3">Informations botaniques</h5>' : '';
    html += '<div class="row">';
    if (imageUrl) {
        html += `<div class="${colImg} mb-3"><img src="${imageUrl}" class="img-fluid rounded shadow-sm" alt="${plant.common_name || nom}"></div>`;
        html += `<div class="${colTable}">`;
    } else {
        html += '<div class="col-12">';
    }
    html += `<table class="${tableClass}">${rows}</table>`;
    html += '</div></div>';

    return html;
}

export function initAdminEdit() {
    const modalEl = document.getElementById('editModal');
    if (!modalEl) return;

    const modal = new Modal(modalEl);
    const textarea = document.getElementById('editModalTextarea');
    const saveBtn = document.getElementById('editModalSave');
    const errorDiv = document.getElementById('editModalError');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    let currentId = null;
    let currentSpan = null;

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="editer-details"]');
        if (!btn) return;

        currentId = btn.dataset.id;
        currentSpan = btn.closest('td').querySelector('.details-texte');
        textarea.value = currentSpan.dataset.details ?? currentSpan.textContent.trim();
        errorDiv.classList.add('d-none');
        modal.show();
        textarea.focus();
    });

    saveBtn.addEventListener('click', async () => {
        if (!currentId) return;

        saveBtn.disabled = true;
        errorDiv.classList.add('d-none');

        try {
            const res = await fetch(`/admin/entretien/${currentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ details: textarea.value }),
            });

            const data = await res.json();

            if (!res.ok) {
                errorDiv.textContent = data.error || 'Erreur lors de la sauvegarde';
                errorDiv.classList.remove('d-none');
                return;
            }

            currentSpan.dataset.details = data.details;
            currentSpan.innerHTML = data.details.replace(/\n/g, '<br>');
            modal.hide();
        } catch {
            errorDiv.textContent = 'Erreur réseau, veuillez réessayer.';
            errorDiv.classList.remove('d-none');
        } finally {
            saveBtn.disabled = false;
        }
    });
}

export function initAdminPhoto() {
    const cameraSection = document.getElementById('camera-section');
    if (!cameraSection) return;

    const btnOuvrir = document.getElementById('btn-ouvrir-camera');
    const cameraUi = document.getElementById('camera-ui');
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const preview = document.getElementById('camera-preview');
    const btnCapturer = document.getElementById('btn-capturer');
    const btnSauvegarder = document.getElementById('btn-sauvegarder-photo');
    const btnReprendre = document.getElementById('btn-reprendre');
    const btnAnnuler = document.getElementById('btn-annuler-camera');
    const errorDiv = document.getElementById('photo-error');
    const photosGrid = document.getElementById('photos-grid');

    const nom = cameraSection.dataset.nom;
    const csrfToken = cameraSection.dataset.csrf;

    let stream = null;
    let photoDataUrl = null;

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
    }

    function ouvrirCamera() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(s => {
                stream = s;
                video.srcObject = stream;
                cameraUi.classList.remove('d-none');
                video.classList.remove('d-none');
                preview.classList.add('d-none');
                btnCapturer.classList.remove('d-none');
                btnSauvegarder.classList.add('d-none');
                btnReprendre.classList.add('d-none');
                errorDiv.classList.add('d-none');
                photoDataUrl = null;
            })
            .catch(err => alert(`Impossible d'accéder à la caméra : ${err.message}`));
    }

    btnOuvrir.addEventListener('click', ouvrirCamera);

    btnCapturer.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        preview.src = photoDataUrl;
        stopCamera();
        video.classList.add('d-none');
        preview.classList.remove('d-none');
        btnCapturer.classList.add('d-none');
        btnSauvegarder.classList.remove('d-none');
        btnReprendre.classList.remove('d-none');
    });

    btnReprendre.addEventListener('click', ouvrirCamera);

    btnAnnuler.addEventListener('click', () => {
        stopCamera();
        cameraUi.classList.add('d-none');
        photoDataUrl = null;
    });

    btnSauvegarder.addEventListener('click', async () => {
        if (!photoDataUrl) return;

        btnSauvegarder.disabled = true;
        errorDiv.classList.add('d-none');

        try {
            const res = await fetch(`/admin/plante/${encodeURIComponent(nom)}/photo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
                body: JSON.stringify({ photo: photoDataUrl }),
            });

            const data = await res.json();
            if (!res.ok) {
                errorDiv.textContent = data.error || "Erreur lors de l'enregistrement";
                errorDiv.classList.remove('d-none');
                return;
            }

            window.location.reload();
        } catch {
            errorDiv.textContent = 'Erreur réseau, veuillez réessayer.';
            errorDiv.classList.remove('d-none');
        } finally {
            btnSauvegarder.disabled = false;
        }
    });

    if (photosGrid) {
        photosGrid.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-action="supprimer-photo"]');
            if (!btn) return;

            if (!confirm('Supprimer cette photo ?')) return;

            const photoId = btn.dataset.id;
            const photoNom = btn.dataset.nom;

            try {
                const res = await fetch(`/admin/plante/${encodeURIComponent(photoNom)}/photo/${photoId}`, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-Token': csrfToken },
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    alert(data.error || 'Erreur lors de la suppression');
                    return;
                }

                document.getElementById(`photo-${photoId}`)?.remove();
            } catch {
                alert('Erreur réseau, veuillez réessayer.');
            }
        });
    }
}

export function initMoisDetails() {
    const modalEl = document.getElementById('plantModal');
    if (!modalEl) return;

    const modalLabel = document.getElementById('plantModalLabel');
    const modalBody  = document.getElementById('plantModalBody');
    const modal = new Modal(modalEl);

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-action="ouvrir-details"]');
        if (!btn) return;

        const nom = btn.dataset.nom;
        modalLabel.textContent = `Détails : ${nom}`;
        modalBody.innerHTML = `
            <div class="text-center my-4">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-2">Recherche en cours...</p>
            </div>`;
        modal.show();

        try {
            const plant = await fetchDetails(nom);
            modalBody.innerHTML = construireHtml(nom, plant);
        } catch (err) {
            modalBody.innerHTML = `<div class="alert alert-danger">Erreur : ${err.message}</div>`;
        }
    });
}

export function initPlanteDetails() {
    const section = document.getElementById('details-section');
    if (!section) return;

    const nom = section.dataset.nom;
    if (!nom) return;

    fetchDetails(nom)
        .then(plant => {
            section.innerHTML = construireHtml(nom, plant, {
                titre: true,
                colImg: 'col-md-3',
                colTable: 'col-md-9',
                tableClass: 'table table-sm table-bordered'
            });
        })
        .catch(err => {
            section.innerHTML = `<div class="alert alert-warning">Informations botaniques non disponibles : ${err.message}</div>`;
        });
}
