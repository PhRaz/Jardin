import { Modal } from 'bootstrap';

// ── CONSTANTS ──
const CELL = 22;    // px par case
const CELL_M = 0.5; // mètres par case

const ZONE_TYPES = {
    culture:   { label: 'Planche de culture', icon: '🥦' },
    haie:      { label: 'Haie',               icon: '🌿' },
    arbre:     { label: 'Arbre',              icon: '🌳' },
    palissage: { label: 'Palissage',          icon: '🪵' },
    allee:     { label: 'Allée',              icon: '🪨' },
    gazon:     { label: 'Gazon',              icon: '🌾' },
    autre:     { label: 'Autre',              icon: '⬜' },
};

const TYPE_COLORS = {
    culture:   '#7bc47f',
    haie:      '#2d7a2d',
    arbre:     '#5a3e1b',
    palissage: '#a0784a',
    allee:     '#c8baa0',
    gazon:     '#b8e090',
    autre:     '#aaaaaa',
};

const PRESETS = [
    '#e74c3c','#e67e22','#f1c40f','#2ecc71','#1abc9c',
    '#3498db','#9b59b6','#e91e63','#795548','#607d8b',
    '#2d7a2d','#b8e090','#c8baa0','#a0784a','#5a3e1b',
];

// ── STATE ──
let gardens = [];
let activeGarden = null;
let newGardenModal = null;
let saveTimer = null;

// ── INIT ──
export function initPotager() {
    const modalEl = document.getElementById('potagerNewModal');
    if (!modalEl) return;
    newGardenModal = new Modal(modalEl);

    document.getElementById('potager-modal-cols')?.addEventListener('input', updateModalHint);
    document.getElementById('potager-modal-rows')?.addEventListener('input', updateModalHint);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && activeGarden?.state.drag) cancelDrag(activeGarden);
    });

    // Délégation des clics
    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const gid = btn.dataset.gardenId;
        const g = gid ? getGarden(gid) : null;

        switch (action) {
            case 'open-new-garden':    openNewGardenModal(); break;
            case 'confirm-new-garden': confirmNewGarden(); break;
            case 'switch-garden':      if (gid) switchToGarden(gid); break;
            case 'delete-garden':      e.stopPropagation(); if (gid) deleteGarden(gid); break;
            case 'apply-settings':     if (g) applyGardenSettings(g); break;
            case 'add-zone':           if (g) addZone(g); break;
            case 'set-tool':           if (g) setTool(g, btn.dataset.tool); break;
            case 'delete-zone':        e.stopPropagation(); if (g) deleteZone(g, btn.dataset.zoneId); break;
            case 'select-zone':        if (g) selectZone(g, btn.closest('.potager-zone-item')?.dataset.zoneId); break;
        }
    });

    // Délégation des inputs
    document.addEventListener('input', e => {
        const el = e.target.closest('[data-action="update-size-hint"]');
        if (el) { const g = getGarden(el.dataset.gardenId); if (g) updateGardenSizeHint(g); }
        const el2 = e.target.closest('[data-action="type-change"]');
        if (el2) { const g = getGarden(el2.dataset.gardenId); if (g) onTypeChange(g); }
    });

    // Relâchement hors canvas (annule le drag)
    document.addEventListener('mouseup', e => {
        if (activeGarden?.state.drag && !e.target.closest('canvas')) cancelDrag(activeGarden);
    });

    // Chargement depuis l'API si connecté
    const csrfMeta = document.querySelector('meta[name="potager-csrf-token"]');
    if (csrfMeta) {
        loadPlan();
    } else {
        createGarden('Potager 1', 20, 20);
    }
}

// ── MODAL NOUVEAU POTAGER ──
function openNewGardenModal() {
    document.getElementById('potager-modal-name').value = '';
    document.getElementById('potager-modal-cols').value = 20;
    document.getElementById('potager-modal-rows').value = 20;
    updateModalHint();
    newGardenModal.show();
    setTimeout(() => document.getElementById('potager-modal-name').focus(), 300);
}

function updateModalHint() {
    const c = clamp(parseInt(document.getElementById('potager-modal-cols').value) || 20, 5, 40);
    const r = clamp(parseInt(document.getElementById('potager-modal-rows').value) || 20, 5, 40);
    document.getElementById('potager-modal-hint').textContent =
        `→ ${(c * CELL_M).toFixed(1)} m × ${(r * CELL_M).toFixed(1)} m = ${(c * r * CELL_M * CELL_M).toFixed(2)} m²`;
}

function confirmNewGarden() {
    const name = document.getElementById('potager-modal-name').value.trim();
    if (!name) { document.getElementById('potager-modal-name').focus(); return; }
    const cols = clamp(parseInt(document.getElementById('potager-modal-cols').value) || 20, 5, 40);
    const rows = clamp(parseInt(document.getElementById('potager-modal-rows').value) || 20, 5, 40);
    newGardenModal.hide();
    createGarden(name, cols, rows);
    scheduleSave();
}

// ── CRÉATION D'UN POTAGER ──
function createGarden(name, cols, rows, id = null) {
    const gid = id || crypto.randomUUID();
    const garden = {
        id: gid, name, cols, rows,
        zones: [],
        grid: Array.from({length: rows}, () => new Array(cols).fill(null)),
        state: { activeZoneId: null, tool: 'paint', painting: false, drag: null, canvas: null, ctx: null },
    };
    gardens.push(garden);
    buildTabDOM(garden);
    switchToGarden(gid);
    updateTitle();
    return garden;
}

function buildTabDOM(garden) {
    const tabsEl    = document.getElementById('potager-tabs');
    const contentsEl = document.getElementById('potager-tab-contents');

    // ── Onglet ──
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.setAttribute('role', 'presentation');
    li.dataset.gardenId = garden.id;

    const span = document.createElement('span');
    span.className = 'nav-link potager-tab-link';
    span.setAttribute('role', 'tab');
    span.dataset.action = 'switch-garden';
    span.dataset.gardenId = garden.id;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'potager-tab-label';
    labelSpan.textContent = garden.name;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'potager-tab-close';
    closeBtn.title = 'Supprimer ce potager';
    closeBtn.textContent = '✕';
    closeBtn.dataset.action = 'delete-garden';
    closeBtn.dataset.gardenId = garden.id;

    span.appendChild(labelSpan);
    span.appendChild(closeBtn);
    li.appendChild(span);

    // Insérer avant le bouton "+"
    tabsEl.insertBefore(li, tabsEl.querySelector('.nav-item:last-child'));

    // ── Contenu ──
    const pane = document.createElement('div');
    pane.className = 'tab-pane p-3';
    pane.id = `potager-pane-${garden.id}`;
    pane.setAttribute('role', 'tabpanel');

    const W    = garden.cols * CELL, H = garden.rows * CELL;
    const wm   = (garden.cols * CELL_M).toFixed(1);
    const hm   = (garden.rows * CELL_M).toFixed(1);
    const surf = (garden.cols * garden.rows * CELL_M * CELL_M).toFixed(2);

    pane.innerHTML = `
        <div class="row g-3">
            <!-- Panel gauche -->
            <div class="col-auto potager-panel">
                <h6 class="text-success border-bottom pb-2 mb-2">Paramètres</h6>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Nom</label>
                    <input type="text" id="gardenName-${garden.id}" class="form-control form-control-sm"
                           value="${escHtml(garden.name)}" maxlength="30">
                </div>
                <div class="d-flex align-items-end gap-1 mb-1">
                    <div class="flex-fill">
                        <label class="form-label small fw-bold mb-1">Largeur</label>
                        <input type="number" id="gardenCols-${garden.id}"
                               class="form-control form-control-sm text-center"
                               value="${garden.cols}" min="5" max="40"
                               data-action="update-size-hint" data-garden-id="${garden.id}">
                    </div>
                    <span class="pb-1 text-muted">×</span>
                    <div class="flex-fill">
                        <label class="form-label small fw-bold mb-1">Hauteur</label>
                        <input type="number" id="gardenRows-${garden.id}"
                               class="form-control form-control-sm text-center"
                               value="${garden.rows}" min="5" max="40"
                               data-action="update-size-hint" data-garden-id="${garden.id}">
                    </div>
                </div>
                <p class="text-muted small fst-italic mb-2" id="gardenSizeHint-${garden.id}"></p>
                <button class="btn btn-success btn-sm w-100 mb-3"
                        data-action="apply-settings" data-garden-id="${garden.id}">✓ Appliquer</button>

                <h6 class="text-success border-bottom pb-2 mb-2">Nouvelle Zone</h6>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Type</label>
                    <select id="zoneType-${garden.id}" class="form-select form-select-sm"
                            data-action="type-change" data-garden-id="${garden.id}">
                        <option value="culture">🥦 Planche de culture</option>
                        <option value="haie">🌿 Haie</option>
                        <option value="arbre">🌳 Arbre</option>
                        <option value="palissage">🪵 Palissage</option>
                        <option value="allee">🪨 Allée</option>
                        <option value="gazon">🌾 Gazon</option>
                        <option value="autre">⬜ Autre</option>
                    </select>
                </div>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Nom de la zone</label>
                    <input type="text" id="zoneName-${garden.id}" class="form-control form-control-sm"
                           placeholder="ex : Tomates, Haie Nord…" maxlength="30">
                </div>
                <div class="mb-2">
                    <label class="form-label small fw-bold mb-1">Couleur</label>
                    <div class="d-flex align-items-center gap-2">
                        <input type="color" id="zoneColor-${garden.id}" value="#7bc47f"
                               class="potager-color-input">
                        <div class="d-flex flex-wrap gap-1" id="colorPresets-${garden.id}"></div>
                    </div>
                </div>
                <button class="btn btn-success btn-sm w-100 mb-3"
                        data-action="add-zone" data-garden-id="${garden.id}">＋ Ajouter cette zone</button>

                <h6 class="text-success border-bottom pb-2 mb-2">Zones créées</h6>
                <div id="zoneList-${garden.id}" class="potager-zone-list">
                    <p class="text-muted small fst-italic">Aucune zone pour l'instant.</p>
                </div>

                <div class="btn-group w-100 mt-3" role="group">
                    <button type="button" class="btn btn-success btn-sm" id="toolPaint-${garden.id}"
                            data-action="set-tool" data-tool="paint" data-garden-id="${garden.id}">✏ Peindre</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm" id="toolErase-${garden.id}"
                            data-action="set-tool" data-tool="erase" data-garden-id="${garden.id}">⌫ Effacer</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm" id="toolMove-${garden.id}"
                            data-action="set-tool" data-tool="move" data-garden-id="${garden.id}">✥ Déplacer</button>
                </div>
            </div>

            <!-- Grille -->
            <div class="col overflow-auto">
                <div class="text-muted small mb-2" id="gridInfo-${garden.id}">
                    Potager <strong>${escHtml(garden.name)}</strong> —
                    Grille <span>${garden.cols} × ${garden.rows}</span> —
                    <span>${wm} m × ${hm} m</span> = <span>${surf} m²</span>
                </div>
                <canvas id="canvas-${garden.id}" width="${W}" height="${H}"
                        class="potager-canvas"></canvas>
                <div class="d-flex flex-wrap gap-2 mt-2" id="legend-${garden.id}"></div>
                <div class="text-muted small fst-italic mt-1" id="status-${garden.id}">
                    Sélectionnez ou créez une zone, puis cliquez sur la grille.
                </div>
            </div>
        </div>`;

    contentsEl.appendChild(pane);

    // Init canvas
    const canvas = document.getElementById(`canvas-${garden.id}`);
    const ctx    = canvas.getContext('2d');
    garden.state.canvas = canvas;
    garden.state.ctx    = ctx;

    // Pastilles de couleur
    const presetsEl = document.getElementById(`colorPresets-${garden.id}`);
    PRESETS.forEach(c => {
        const sw = document.createElement('div');
        sw.className = 'potager-preset-swatch';
        sw.style.background = c;
        sw.addEventListener('click', () => {
            document.getElementById(`zoneColor-${garden.id}`).value = c;
            presetsEl.querySelectorAll('.potager-preset-swatch').forEach(s => s.classList.remove('selected'));
            sw.classList.add('selected');
        });
        presetsEl.appendChild(sw);
    });

    bindCanvasEvents(garden, canvas);
    drawGarden(garden);
    updateLegend(garden);
    renderZoneList(garden);
    updateGardenSizeHint(garden);
}

// ── PARAMÈTRES DU POTAGER ──
function updateGardenSizeHint(g) {
    const colsEl = document.getElementById(`gardenCols-${g.id}`);
    const rowsEl = document.getElementById(`gardenRows-${g.id}`);
    if (!colsEl || !rowsEl) return;
    const c = clamp(parseInt(colsEl.value) || 20, 5, 40);
    const r = clamp(parseInt(rowsEl.value) || 20, 5, 40);
    const hint = document.getElementById(`gardenSizeHint-${g.id}`);
    if (hint) hint.textContent =
        `${c} × ${r} — ${(c*CELL_M).toFixed(1)} m × ${(r*CELL_M).toFixed(1)} m = ${(c*r*CELL_M*CELL_M).toFixed(2)} m²`;
}

function applyGardenSettings(g) {
    const newName = document.getElementById(`gardenName-${g.id}`).value.trim();
    if (!newName) { setStatus(g, '⚠ Le nom du potager ne peut pas être vide.'); return; }

    const newCols = clamp(parseInt(document.getElementById(`gardenCols-${g.id}`).value) || g.cols, 5, 40);
    const newRows = clamp(parseInt(document.getElementById(`gardenRows-${g.id}`).value) || g.rows, 5, 40);

    if (newCols < g.cols || newRows < g.rows) {
        let lost = 0;
        for (let r = 0; r < g.rows; r++)
            for (let c = 0; c < g.cols; c++)
                if (g.grid[r][c] !== null && (r >= newRows || c >= newCols)) lost++;
        if (lost > 0 && !confirm(`Réduire la grille va supprimer ${lost} case${lost > 1 ? 's' : ''} peinte${lost > 1 ? 's' : ''}. Continuer ?`)) return;
    }

    g.name = newName;
    const tabLi = document.querySelector(`#potager-tabs li[data-garden-id="${g.id}"]`);
    if (tabLi) tabLi.querySelector('.potager-tab-label').textContent = newName;
    updateTitle();

    if (newCols !== g.cols || newRows !== g.rows) {
        const newGrid = Array.from({length: newRows}, (_, r) =>
            Array.from({length: newCols}, (_, c) => (r < g.rows && c < g.cols) ? g.grid[r][c] : null)
        );
        g.grid = newGrid; g.cols = newCols; g.rows = newRows;

        g.zones.forEach(z => {
            if (!isConnected(g, z.id)) {
                const biggest = biggestComponent(g, z.id);
                for (let r = 0; r < g.rows; r++)
                    for (let c = 0; c < g.cols; c++)
                        if (g.grid[r][c] === z.id && !biggest.has(r * g.cols + c))
                            g.grid[r][c] = null;
            }
        });

        g.state.canvas.width  = newCols * CELL;
        g.state.canvas.height = newRows * CELL;
    }

    updateGridInfo(g);
    drawGarden(g); updateLegend(g); renderZoneList(g);
    setStatus(g, `✓ Paramètres appliqués — "${newName}", ${g.cols} × ${g.rows} cases.`);
    scheduleSave();
}

function updateGridInfo(g) {
    const wm = (g.cols * CELL_M).toFixed(1), hm = (g.rows * CELL_M).toFixed(1);
    const surf = (g.cols * g.rows * CELL_M * CELL_M).toFixed(2);
    const el = document.getElementById(`gridInfo-${g.id}`);
    if (el) el.innerHTML =
        `Potager <strong>${escHtml(g.name)}</strong> — Grille <span>${g.cols} × ${g.rows}</span> — <span>${wm} m × ${hm} m</span> = <span>${surf} m²</span>`;
}

// ── NAVIGATION ONGLETS ──
function switchToGarden(id) {
    activeGarden = gardens.find(g => g.id === id) || null;

    document.querySelectorAll('#potager-tabs .potager-tab-link').forEach(el => {
        el.classList.toggle('active', el.dataset.gardenId === id);
    });
    document.querySelectorAll('#potager-tab-contents .tab-pane').forEach(pane => {
        const active = pane.id === `potager-pane-${id}`;
        pane.classList.toggle('show', active);
        pane.classList.toggle('active', active);
    });
}

function deleteGarden(id) {
    const li = document.querySelector(`#potager-tabs li[data-garden-id="${id}"]`);
    if (!li) return;

    if (li.dataset.confirmDelete === '1') {
        li.dataset.confirmDelete = '0';
        gardens = gardens.filter(g => g.id !== id);
        li.remove();
        document.getElementById(`potager-pane-${id}`)?.remove();
        if (activeGarden?.id === id) {
            activeGarden = null;
            if (gardens.length) switchToGarden(gardens[gardens.length - 1].id);
        }
        updateTitle();
        scheduleSave();
        return;
    }

    li.dataset.confirmDelete = '1';
    const closeBtn = li.querySelector('.potager-tab-close');
    if (closeBtn) { closeBtn.textContent = '?'; closeBtn.classList.add('confirming'); }
    setTimeout(() => {
        if (li.dataset.confirmDelete === '1') {
            li.dataset.confirmDelete = '0';
            if (closeBtn) { closeBtn.textContent = '✕'; closeBtn.classList.remove('confirming'); }
        }
    }, 2500);
}

function updateTitle() {
    const n = gardens.length;
    const el = document.getElementById('potager-main-title');
    if (el) el.textContent = n <= 1 ? '🌱 Plan du Potager' : '🌱 Plans des Potagers';
}

// ── DESSIN ──
function drawGarden(g) {
    const { cols, rows, grid, zones, state } = g;
    const { ctx, drag } = state;
    const W = cols * CELL, H = rows * CELL;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#faf5e4';
    ctx.fillRect(0, 0, W, H);

    const dragId = drag ? drag.zoneId : null;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const id = grid[r][c];
            if (id === null || id === dragId) continue;
            const z = zones.find(z => z.id === id);
            if (z) drawCell(ctx, c, r, z.color, 1);
        }
    }

    if (drag && drag.valid) {
        const z = zones.find(z => z.id === drag.zoneId);
        if (z) {
            drag.relCells.forEach(({dr, dc}) => {
                const gr = drag.ghostR + dr, gc = drag.ghostC + dc;
                if (gr >= 0 && gr < rows && gc >= 0 && gc < cols) {
                    drawCell(ctx, gc, gr, z.color, 0.55);
                    ctx.save();
                    ctx.setLineDash([3, 2]);
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
                    ctx.strokeRect(gc * CELL + 1, gr * CELL + 1, CELL - 2, CELL - 2);
                    ctx.restore();
                }
            });
        }
    }

    ctx.strokeStyle = '#d4c8b0'; ctx.lineWidth = 0.5; ctx.setLineDash([]);
    for (let c = 0; c <= cols; c++) {
        ctx.beginPath(); ctx.moveTo(c*CELL, 0); ctx.lineTo(c*CELL, H); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r*CELL); ctx.lineTo(W, r*CELL); ctx.stroke();
    }

    ctx.fillStyle = '#b0a088'; ctx.font = '9px sans-serif'; ctx.textBaseline = 'middle';
    for (let c = 0; c < cols; c += 5) {
        ctx.textAlign = 'center'; ctx.fillText(c+1, c*CELL + CELL/2, 6);
    }
    for (let r = 0; r < rows; r += 5) {
        ctx.textAlign = 'right'; ctx.fillText(r+1, CELL/2 - 2, r*CELL + CELL/2);
    }
}

function drawCell(ctx, c, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
    const grad = ctx.createLinearGradient(c*CELL, r*CELL, c*CELL+CELL, r*CELL+CELL);
    grad.addColorStop(0, 'rgba(255,255,255,0.18)');
    grad.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
    ctx.restore();
}

function flashInvalid(g, col, row) {
    let count = 0;
    const interval = setInterval(() => {
        drawGarden(g);
        if (count % 2 === 0) {
            g.state.ctx.save();
            g.state.ctx.fillStyle = 'rgba(220,50,50,0.55)';
            g.state.ctx.fillRect(col * CELL, row * CELL, CELL, CELL);
            g.state.ctx.restore();
        }
        if (++count >= 6) clearInterval(interval);
    }, 80);
}

// ── CONNEXITÉ ──
function isConnected(g, id) {
    const { cols, rows, grid } = g;
    const cells = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (grid[r][c] === id) cells.push([r, c]);
    if (cells.length <= 1) return true;
    const visited = new Set();
    const key = (r, c) => r * cols + c;
    const queue = [cells[0]];
    visited.add(key(cells[0][0], cells[0][1]));
    while (queue.length) {
        const [r, c] = queue.shift();
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] !== id) continue;
            const k = key(nr, nc);
            if (visited.has(k)) continue;
            visited.add(k); queue.push([nr, nc]);
        }
    }
    return visited.size === cells.length;
}

function biggestComponent(g, id) {
    const { cols, rows, grid } = g;
    const visited = new Set();
    let biggest = new Set();
    for (let sr = 0; sr < rows; sr++) {
        for (let sc = 0; sc < cols; sc++) {
            if (grid[sr][sc] !== id) continue;
            const k = sr * cols + sc;
            if (visited.has(k)) continue;
            const component = new Set();
            const queue = [[sr, sc]];
            component.add(k); visited.add(k);
            while (queue.length) {
                const [r, c] = queue.shift();
                for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                    const nr = r+dr, nc = c+dc;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                    if (grid[nr][nc] !== id) continue;
                    const nk = nr * cols + nc;
                    if (visited.has(nk)) continue;
                    visited.add(nk); component.add(nk); queue.push([nr, nc]);
                }
            }
            if (component.size > biggest.size) biggest = component;
        }
    }
    return biggest;
}

// ── ÉVÉNEMENTS CANVAS ──
function getCellFromEvent(g, e) {
    const rect = g.state.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const c = Math.floor(x / CELL), r = Math.floor(y / CELL);
    if (c >= 0 && c < g.cols && r >= 0 && r < g.rows) return {r, c};
    return null;
}

function bindCanvasEvents(g, canvas) {
    canvas.addEventListener('mousedown', e => {
        const cell = getCellFromEvent(g, e);
        if (!cell) return;
        if (g.state.tool === 'move') {
            const id = g.grid[cell.r][cell.c];
            if (!id) { setStatus(g, '⚠ Cliquez sur une case colorée pour déplacer la zone.'); return; }
            const originalCells = getCellsOfZone(g, id);
            const relCells = originalCells.map(({r, c}) => ({ dr: r - cell.r, dc: c - cell.c }));
            originalCells.forEach(({r, c}) => { g.grid[r][c] = null; });
            g.state.drag = { zoneId: id, originalCells, relCells, ghostR: cell.r, ghostC: cell.c, valid: true };
            canvas.style.cursor = 'grabbing';
            const z = g.zones.find(z => z.id === id);
            setStatus(g, `Déplacement de "${z ? z.name : ''}" — relâchez pour poser, Échap pour annuler.`);
            drawGarden(g); return;
        }
        g.state.painting = true;
        applyPaint(g, cell);
    });

    canvas.addEventListener('mousemove', e => {
        const cell = getCellFromEvent(g, e);
        if (g.state.drag) {
            if (cell) { g.state.drag.ghostR = cell.r; g.state.drag.ghostC = cell.c; }
            g.state.drag.valid = cell ? ghostFits(g) : false;
            drawGarden(g);
            showDragTooltip(e, g, cell); return;
        }
        showTooltip(e, g, cell);
        if (g.state.painting && cell) applyPaint(g, cell);
    });

    canvas.addEventListener('mouseup', e => {
        if (g.state.drag) {
            const cell = getCellFromEvent(g, e);
            if (cell && ghostFits(g)) {
                const overwritten = [];
                g.state.drag.relCells.forEach(({dr, dc}) => {
                    const gr = g.state.drag.ghostR + dr, gc = g.state.drag.ghostC + dc;
                    if (gr >= 0 && gr < g.rows && gc >= 0 && gc < g.cols) {
                        overwritten.push({ r: gr, c: gc, prevId: g.grid[gr][gc] });
                        g.grid[gr][gc] = g.state.drag.zoneId;
                    }
                });
                if (!isConnected(g, g.state.drag.zoneId)) {
                    overwritten.forEach(({r, c, prevId}) => { g.grid[r][c] = prevId; });
                    g.state.drag.originalCells.forEach(({r, c}) => { g.grid[r][c] = g.state.drag.zoneId; });
                    const z = g.zones.find(z => z.id === g.state.drag.zoneId);
                    setStatus(g, `⚠ Dépôt impossible : la zone "${z ? z.name : ''}" ne serait pas connexe ici.`);
                    finishDrag(g); return;
                }
                const affectedIds = new Set(overwritten.map(o => o.prevId).filter(id => id !== null && id !== g.state.drag.zoneId));
                for (const id of affectedIds) {
                    if (!isConnected(g, id)) {
                        overwritten.forEach(({r, c, prevId}) => { g.grid[r][c] = prevId; });
                        g.state.drag.originalCells.forEach(({r, c}) => { g.grid[r][c] = g.state.drag.zoneId; });
                        const bz = g.zones.find(z => z.id === id);
                        setStatus(g, `⚠ Dépôt impossible : la zone "${bz ? bz.name : ''}" serait coupée en deux.`);
                        finishDrag(g); return;
                    }
                }
                const z = g.zones.find(z => z.id === g.state.drag.zoneId);
                setStatus(g, `✓ Zone "${z ? z.name : ''}" déplacée.`);
                scheduleSave();
            } else {
                g.state.drag.originalCells.forEach(({r, c}) => { g.grid[r][c] = g.state.drag.zoneId; });
                setStatus(g, '⚠ Déplacement annulé — zone restituée.');
            }
            finishDrag(g); return;
        }
        g.state.painting = false;
        scheduleSave();
    });

    canvas.addEventListener('mouseleave', () => {
        if (g.state.drag) { g.state.drag.valid = false; drawGarden(g); return; }
        g.state.painting = false;
        hideTooltip();
    });
}

function ghostFits(g) {
    const { drag } = g.state;
    if (!drag) return false;
    return drag.relCells.every(({dr, dc}) => {
        const gr = drag.ghostR + dr, gc = drag.ghostC + dc;
        return gr >= 0 && gr < g.rows && gc >= 0 && gc < g.cols;
    });
}

function cancelDrag(g) {
    if (!g.state.drag) return;
    g.state.drag.originalCells.forEach(({r, c}) => { g.grid[r][c] = g.state.drag.zoneId; });
    setStatus(g, 'Déplacement annulé — zone restituée.');
    finishDrag(g);
}

function finishDrag(g) {
    g.state.drag = null;
    g.state.canvas.style.cursor = 'move';
    drawGarden(g); updateLegend(g); renderZoneList(g);
}

// ── PEINTURE ──
function applyPaint(g, cell) {
    const {r, c} = cell;
    if (g.state.tool === 'erase') {
        const prevId = g.grid[r][c];
        if (prevId === null) return;
        g.grid[r][c] = null;
        if (!isConnected(g, prevId)) {
            g.grid[r][c] = prevId;
            flashInvalid(g, c, r);
            setStatus(g, '⚠ Impossible : effacer cette case couperait la zone en deux parties.');
            return;
        }
    } else {
        if (!g.state.activeZoneId) { setStatus(g, '⚠ Sélectionnez une zone dans la liste avant de peindre.'); return; }
        if (g.grid[r][c] === g.state.activeZoneId) return;
        const prevId = g.grid[r][c];
        g.grid[r][c] = g.state.activeZoneId;
        if (!isConnected(g, g.state.activeZoneId)) {
            g.grid[r][c] = prevId;
            flashInvalid(g, c, r);
            setStatus(g, '⚠ Impossible : cette case créerait une zone non connexe.');
            return;
        }
        if (prevId !== null && !isConnected(g, prevId)) {
            g.grid[r][c] = prevId;
            flashInvalid(g, c, r);
            setStatus(g, '⚠ Impossible : peindre ici couperait une zone voisine en deux parties.');
            return;
        }
    }
    drawGarden(g); updateLegend(g); renderZoneList(g);
}

// ── TOOLTIP ──
function getTooltipEl() { return document.getElementById('potager-tooltip'); }

function showTooltip(e, g, cell) {
    const el = getTooltipEl();
    if (!el) return;
    if (!cell) { hideTooltip(); return; }
    const {r, c} = cell;
    const id = g.grid[r][c];
    const z  = id ? g.zones.find(z => z.id === id) : null;
    const ti = z ? ZONE_TYPES[z.type] : null;
    el.style.display = 'block';
    el.style.left    = (e.clientX + 14) + 'px';
    el.style.top     = (e.clientY - 28) + 'px';
    el.textContent   = `Col ${c+1}, Lig ${r+1}${z ? ' — '+(ti?ti.icon+' ':'')+z.name : ''}`;
}

function showDragTooltip(e, g, cell) {
    const el = getTooltipEl();
    if (!el) return;
    el.style.display = 'block';
    el.style.left    = (e.clientX + 14) + 'px';
    el.style.top     = (e.clientY - 28) + 'px';
    el.textContent   = (!cell || !ghostFits(g))
        ? '⚠ Hors grille — relâchez pour annuler'
        : `→ Col ${cell.c+1}, Lig ${cell.r+1} — relâchez pour poser`;
}

function hideTooltip() {
    const el = getTooltipEl();
    if (el) el.style.display = 'none';
}

// ── ZONES ──
function onTypeChange(g) {
    const t = document.getElementById(`zoneType-${g.id}`).value;
    document.getElementById(`zoneColor-${g.id}`).value = TYPE_COLORS[t] || '#aaaaaa';
    document.querySelectorAll(`#colorPresets-${g.id} .potager-preset-swatch`).forEach(s => s.classList.remove('selected'));
}

function addZone(g) {
    const name  = document.getElementById(`zoneName-${g.id}`).value.trim();
    const type  = document.getElementById(`zoneType-${g.id}`).value;
    const color = document.getElementById(`zoneColor-${g.id}`).value;
    if (!name) { setStatus(g, '⚠ Donnez un nom à la zone.'); return; }
    if (g.zones.find(z => z.name.toLowerCase() === name.toLowerCase())) {
        setStatus(g, '⚠ Une zone avec ce nom existe déjà.'); return;
    }
    const id = crypto.randomUUID();
    g.zones.push({ id, name, type, color });
    document.getElementById(`zoneName-${g.id}`).value = '';
    renderZoneList(g);
    selectZone(g, id);
    const ti = ZONE_TYPES[type];
    setStatus(g, `✓ Zone "${name}" (${ti ? ti.label : type}) créée.`);
    scheduleSave();
}

function selectZone(g, id) {
    g.state.activeZoneId = id;
    if (g.state.tool === 'move') setTool(g, 'paint');
    else renderZoneList(g);
    const z = g.zones.find(z => z.id === id);
    if (z) {
        const ti = ZONE_TYPES[z.type];
        setStatus(g, `Zone active : ${ti ? ti.icon+' ' : ''}"${z.name}" — cliquez/glissez pour peindre.`);
    }
}

function deleteZone(g, id) {
    const z = g.zones.find(z => z.id === id);
    if (!z) return;
    const zoneEl = document.querySelector(`#zoneList-${g.id} [data-zone-id="${id}"]`);
    if (!zoneEl) return;

    if (zoneEl.dataset.confirmDelete === '1') {
        zoneEl.dataset.confirmDelete = '0';
        for (let r = 0; r < g.rows; r++)
            for (let c = 0; c < g.cols; c++)
                if (g.grid[r][c] === id) g.grid[r][c] = null;
        g.zones = g.zones.filter(z => z.id !== id);
        if (g.state.activeZoneId === id) g.state.activeZoneId = null;
        renderZoneList(g); drawGarden(g); updateLegend(g);
        setStatus(g, `Zone "${z.name}" supprimée.`);
        scheduleSave();
        return;
    }

    zoneEl.dataset.confirmDelete = '1';
    const deleteBtn = zoneEl.querySelector('[data-action="delete-zone"]');
    if (deleteBtn) { deleteBtn.textContent = '?'; deleteBtn.classList.add('text-danger'); }
    setTimeout(() => {
        if (zoneEl.dataset.confirmDelete === '1') {
            zoneEl.dataset.confirmDelete = '0';
            if (deleteBtn) { deleteBtn.textContent = '✕'; deleteBtn.classList.remove('text-danger'); }
        }
    }, 2500);
}

function getCellsOfZone(g, id) {
    const cells = [];
    for (let r = 0; r < g.rows; r++)
        for (let c = 0; c < g.cols; c++)
            if (g.grid[r][c] === id) cells.push({r, c});
    return cells;
}

function computeDims(g, id) {
    const cells = getCellsOfZone(g, id);
    if (!cells.length) return null;
    const rs = cells.map(p => p.r), cs = cells.map(p => p.c);
    const count   = cells.length;
    const surface = +(count * CELL_M * CELL_M).toFixed(2);
    const largeur = +((Math.max(...cs) - Math.min(...cs) + 1) * CELL_M).toFixed(1);
    const hauteur = +((Math.max(...rs) - Math.min(...rs) + 1) * CELL_M).toFixed(1);
    return { count, surface, largeur, hauteur };
}

function renderZoneList(g) {
    const el = document.getElementById(`zoneList-${g.id}`);
    if (!el) return;
    if (!g.zones.length) {
        el.innerHTML = '<p class="text-muted small fst-italic">Aucune zone pour l\'instant.</p>';
        return;
    }
    el.innerHTML = '';
    g.zones.forEach(z => {
        const ti   = ZONE_TYPES[z.type] || { label: z.type, icon: '⬜' };
        const dims = computeDims(g, z.id);
        const div  = document.createElement('div');
        div.className = 'potager-zone-item' + (z.id === g.state.activeZoneId ? ' active' : '');
        div.dataset.action   = 'select-zone';
        div.dataset.gardenId = g.id;
        div.dataset.zoneId   = z.id;

        const statsHtml = dims
            ? `<div class="potager-zone-stats">
                   <span>📐 <strong>${dims.largeur} m × ${dims.hauteur} m</strong></span>
                   <span>⬛ <strong>${dims.count}</strong> case${dims.count > 1 ? 's' : ''}</span>
                   <span class="potager-zone-stats-full">📏 Surface : <strong>${dims.surface} m²</strong></span>
               </div>`
            : `<div class="potager-zone-stats"><span class="fst-italic opacity-50">Aucune case peinte</span></div>`;

        div.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <div class="potager-zone-swatch" style="background:${z.color}"></div>
                <div class="flex-fill overflow-hidden">
                    <div class="small fw-bold text-truncate">${escHtml(z.name)}</div>
                    <div class="potager-zone-badge">${ti.icon} ${escHtml(ti.label)}</div>
                </div>
                <button class="potager-btn-delete-zone" title="Supprimer"
                        data-action="delete-zone" data-garden-id="${g.id}" data-zone-id="${z.id}">✕</button>
            </div>${statsHtml}`;
        el.appendChild(div);
    });
}

function updateLegend(g) {
    const el = document.getElementById(`legend-${g.id}`);
    if (!el) return;
    const used = new Set(g.grid.flat().filter(Boolean));
    el.innerHTML = '';
    used.forEach(id => {
        const z = g.zones.find(z => z.id === id);
        if (!z) return;
        const ti   = ZONE_TYPES[z.type] || { icon: '⬜' };
        const item = document.createElement('div');
        item.className = 'potager-legend-item';
        item.innerHTML = `<div class="potager-legend-dot" style="background:${z.color}"></div><span>${ti.icon} ${escHtml(z.name)}</span>`;
        el.appendChild(item);
    });
}

// ── OUTILS ──
function setTool(g, t) {
    g.state.tool = t;
    ['paint', 'erase', 'move'].forEach(tool => {
        const id  = { paint: 'toolPaint', erase: 'toolErase', move: 'toolMove' }[tool];
        const btn = document.getElementById(`${id}-${g.id}`);
        if (!btn) return;
        btn.classList.toggle('btn-success', tool === t);
        btn.classList.toggle('btn-outline-secondary', tool !== t);
    });
    g.state.canvas.style.cursor = t === 'erase' ? 'cell' : t === 'move' ? 'move' : 'crosshair';
    if (t === 'erase') { g.state.activeZoneId = null; setStatus(g, 'Mode effacement — cliquez/glissez sur les cases à effacer.'); }
    if (t === 'move')  { g.state.activeZoneId = null; setStatus(g, 'Mode déplacement — cliquez sur une zone et glissez-la.'); }
    renderZoneList(g);
}

// ── UTILITAIRES ──
function getGarden(id) { return gardens.find(g => g.id === id) || null; }
function setStatus(g, msg) { const el = document.getElementById(`status-${g.id}`); if (el) el.textContent = msg; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function escHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── API ──
function scheduleSave() {
    if (!document.querySelector('meta[name="potager-csrf-token"]')) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 1500);
}

async function doSave() {
    const csrfToken = document.querySelector('meta[name="potager-csrf-token"]')?.content;
    if (!csrfToken) return;
    setSaveStatus('Sauvegarde…');
    try {
        const res = await fetch('/api/potager', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify(serializeState()),
        });
        if (res.ok) {
            setSaveStatus('✓ Sauvegardé');
            setTimeout(() => setSaveStatus(''), 2000);
        } else {
            setSaveStatus('⚠ Erreur de sauvegarde');
        }
    } catch {
        setSaveStatus('⚠ Erreur réseau');
    }
}

async function loadPlan() {
    try {
        const res = await fetch('/api/potager');
        if (!res.ok) { createGarden('Potager 1', 20, 20); return; }
        const data = await res.json();
        if (!data?.jardins?.length) { createGarden('Potager 1', 20, 20); return; }
        data.jardins.forEach(j => rehydrateGarden(j));
        if (gardens.length) switchToGarden(gardens[0].id);
        updateTitle();
    } catch {
        createGarden('Potager 1', 20, 20);
    }
}

function rehydrateGarden(jardinData) {
    const grid = Array.from({length: jardinData.rows}, () => new Array(jardinData.cols).fill(null));
    (jardinData.cellules || []).forEach(({ligne, colonne, zoneId}) => {
        if (ligne < jardinData.rows && colonne < jardinData.cols) grid[ligne][colonne] = zoneId;
    });
    const garden = {
        id:    jardinData.id || crypto.randomUUID(),
        name:  jardinData.nom,
        cols:  jardinData.cols,
        rows:  jardinData.rows,
        zones: (jardinData.zones || []).map(z => ({ id: z.id, name: z.nom, type: z.type, color: z.couleur })),
        grid,
        state: { activeZoneId: null, tool: 'paint', painting: false, drag: null, canvas: null, ctx: null },
    };
    gardens.push(garden);
    buildTabDOM(garden);
    return garden;
}

function serializeState() {
    return {
        jardins: gardens.map(g => ({
            id:       g.id,
            nom:      g.name,
            cols:     g.cols,
            rows:     g.rows,
            zones:    g.zones.map(z => ({ id: z.id, nom: z.name, type: z.type, couleur: z.color })),
            cellules: (() => {
                const cells = [];
                for (let r = 0; r < g.rows; r++)
                    for (let c = 0; c < g.cols; c++)
                        if (g.grid[r][c] !== null) cells.push({ ligne: r, colonne: c, zoneId: g.grid[r][c] });
                return cells;
            })(),
        })),
    };
}

function setSaveStatus(msg) {
    const el = document.getElementById('potager-save-status');
    if (el) el.textContent = msg;
}
