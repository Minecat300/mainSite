if (!location.href.includes('/#/')) {
    const path = location.pathname.replace(/\/+$/, '');
    location.replace(`${location.origin}/#${path}`);
}

if (location.hash.includes('index.html')) {
    const newHash = location.hash.replace(/index\.html\/?/, '');
    const newUrl = location.origin + location.pathname + location.search + newHash;
    history.replaceState(null, '', newUrl);
}
