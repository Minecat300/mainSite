const loadPage = async () => {
    const hash = location.hash || '#/home/';
    const route = hash.replace(/^#\/?|\/+$/g, '') || 'home';
    const path = `pages/${route || 'home'}.html`;

    try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Not found');
    const html = await res.text();
    document.getElementById('content').innerHTML = html;
    loadSection("header", "/sub-pages/header.html");
    loadSection("footer", "/sub-pages/footer.html");
    moveStylesAndLinksToHead();
    executeScriptsFromContent(document.getElementById('content'));
    document.title = "Flameys - " + route;
    } catch {
    const fallback = await fetch('pages/404.html');
    document.getElementById('content').innerHTML = await fallback.text();
    loadSection("header", "/sub-pages/header.html");
    loadSection("footer", "/sub-pages/footer.html");
    moveStylesAndLinksToHead();
    executeScriptsFromContent(document.getElementById('content'));
    document.title = "Flameys - 404";
    location.replace('#/404/');
    }
};

function clearDynamicCSS() {
    const oldStyles = document.head.querySelectorAll('style[data-dynamic-css], link[data-dynamic-css]');
    oldStyles.forEach(el => el.remove());
}

function moveStylesAndLinksToHead() {
    const content = document.getElementById('content');

    clearDynamicCSS();

    const styles = content.querySelectorAll('style');
    styles.forEach(style => {
        const clone = style.cloneNode(true);
        clone.setAttribute('data-dynamic-css', 'true');
        document.head.appendChild(clone);
        style.remove();
    });

    const links = content.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      if (!document.head.querySelector(`link[href="${link.href}"]`)) {
          const clone = link.cloneNode(true);
          clone.setAttribute('data-dynamic-css', 'true');
          document.head.appendChild(clone);
      }
        link.remove();
    });
}

function executeScriptsFromContent(container) {
    const scripts = container.querySelectorAll('script');

    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        for (const attr of oldScript.attributes) {
            newScript.setAttribute(attr.name, attr.value);
        }
        newScript.textContent = oldScript.textContent;

        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}


window.addEventListener('hashchange', loadPage);
window.addEventListener('DOMContentLoaded', loadPage);