if (!location.href.includes('/#/')) {
    const path = location.pathname.replace(/\/+$/, '');
    location.replace(`${location.origin}/#${path}`);
}

if (location.hash.includes('index.html')) {
    const newHash = location.hash.replace(/index\.html\/?/, '');
    const newUrl = location.origin + location.pathname + location.search + newHash;
    history.replaceState(null, '', newUrl);
}

const fetchCache = {};

async function fetchPage(url) {
    const res = await fetchAndCache(url);
    const html = await res.text();
    return html;
}

async function loadSectionToBuffer(container, id, file) {
    const html = await fetchPage(file);
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

async function fetchAndCache(url) {
    if (fetchCache[url]) return fetchCache[url].clone();

    const res = await fetch(url);
    if (!res.ok) {throw new Error('Not found');}
    fetchCache[url] = res.clone();
    return res;
}

function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVh);
window.addEventListener('load', setVh);