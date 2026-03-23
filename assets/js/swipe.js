export function initSwipeMois() {
    const moisEl = document.getElementById('mois-courant');
    if (!moisEl) return;

    const mois    = parseInt(moisEl.value, 10);
    const content = document.querySelector('.container');
    const hintPrev = document.getElementById('swipe-hint-prev');
    const hintNext = document.getElementById('swipe-hint-next');

    let startX = 0, startY = 0, navigating = false;

    // Animation d'entrée si on arrive depuis un swipe
    const dir = sessionStorage.getItem('swipeDir');
    if (dir) {
        sessionStorage.removeItem('swipeDir');
        content.classList.add(dir === 'left' ? 'swipe-in-right' : 'swipe-in-left');
        content.addEventListener('animationend', () => {
            content.classList.remove('swipe-in-right', 'swipe-in-left');
        }, { once: true });
    }

    document.addEventListener('touchstart', (e) => {
        if (navigating) return;
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (navigating) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dy) > Math.abs(dx)) {
            hintPrev.style.opacity = hintNext.style.opacity = 0;
            return;
        }
        const ratio = Math.min(Math.abs(dx) / 100, 1);
        hintPrev.style.opacity = dx > 0 ? ratio : 0;
        hintNext.style.opacity = dx < 0 ? ratio : 0;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        hintPrev.style.opacity = hintNext.style.opacity = 0;
        if (navigating) return;

        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;

        navigating = true;
        const gauche = dx < 0;
        const cible  = gauche ? (mois === 12 ? 1 : mois + 1) : (mois === 1 ? 12 : mois - 1);

        sessionStorage.setItem('swipeDir', gauche ? 'left' : 'right');
        content.classList.add(gauche ? 'swipe-out-left' : 'swipe-out-right');
        content.addEventListener('animationend', () => {
            window.location = '/mois/' + cible;
        }, { once: true });
    }, { passive: true });
}
