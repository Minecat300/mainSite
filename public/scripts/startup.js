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

async function loadSection(id, file) {
    const html = await fetchAndCache(file);
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

(async () => {
    await Promise.all([
        fetchAndCache("/sub-pages/header.html"),
        fetchAndCache("/sub-pages/footer.html")
    ]); 
})();