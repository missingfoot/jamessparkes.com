// js/router.js
let current = null;

export function getSelection() {
    return current;
}

export function navigate(type, id = null) {
    current = { type, id };
    const hash = type === 'project' ? `project-${id}` : type;
    history.replaceState(null, '', `#${hash}`);
    window.dispatchEvent(new CustomEvent('selection-change', { detail: current }));
}

export function initRouter() {
    const hash = location.hash.slice(1);
    if (hash.startsWith('project-')) {
        const id = parseInt(hash.slice(8), 10);
        if (!isNaN(id)) {
            navigate('project', id);
            return;
        }
    }
    if (hash === 'cv') {
        navigate('cv');
        return;
    }
    navigate('about');
}
