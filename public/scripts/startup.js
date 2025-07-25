if (!location.href.includes('/#/')) {
    const path = location.pathname.replace(/\/+$/, '');
    location.replace(`${location.origin}/#${path}`);
}

if (location.hash.includes('index.html')) {
    const newHash = location.hash.replace(/index\.html\/?/, '');
    const newUrl = location.origin + location.pathname + location.search + newHash;
    history.replaceState(null, '', newUrl);
}

const pageCache = {};

async function fetchAndCache(url) {
    if (pageCache[url]) return pageCache[url];

    const res = await fetch(url);
    const html = await res.text();
    pageCache[url] = html;
    return html;
}

async function loadSectionToBuffer(container, id, file) {
    const html = await fetchAndCache(file);
    const target = container.querySelector(`#${id}`);
    if (target) {
        target.innerHTML = html;
    } else {
        const wrapper = document.createElement(id === 'header' ? 'header' : 'footer');
        wrapper.id = id;
        wrapper.innerHTML = html;
        if (id === 'header') {
            container.prepend(wrapper);
        }
        if (id === 'footer') {
            container.appendChild(wrapper);
        }
    }
}

function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVh);
window.addEventListener('load', setVh);

(async () => {
    await Promise.all([
        fetchAndCache("/sub-pages/header.html"),
        fetchAndCache("/sub-pages/footer.html")
    ]); 
})();