const loadPage = async () => {
    const hash = location.hash || '#/home/';
    const route = hash.replace(/^#\/?|\/+$/g, '') || 'home';
    const path = `pages/${route}.html`;

    const buffer = document.getElementById('page-buffer') || createPageBuffer();
    const content = document.getElementById('content');

    document.body.classList.remove('no-scroll');

    try {
        const html = await getHtml(path);
        buffer.innerHTML = html;

        await loadSectionToBuffer(buffer, "header", "/sub-pages/header.html");
        await loadSectionToBuffer(buffer, "footer", "/sub-pages/footer.html");

        moveStylesAndLinksToHeadFrom(buffer);
        await runInlineSVGs(buffer); 
        document.title = "Flameys - " + route;

        content.innerHTML = buffer.innerHTML;
        buffer.remove();
        loadExtras();
        executeScriptsFromContent(content);
    } catch {
        const html = await getHtml('pages/404.html');
        buffer.innerHTML = html;

        await loadSectionToBuffer(buffer, "header", "/sub-pages/header.html");
        await loadSectionToBuffer(buffer, "footer", "/sub-pages/footer.html");

        moveStylesAndLinksToHeadFrom(buffer);
        await runInlineSVGs(buffer);
        document.title = "Flameys - 404";
        
        content.innerHTML = buffer.innerHTML;
        buffer.remove();
        loadExtras();
        executeScriptsFromContent(content);
        location.replace('#/404/');
    }
};

function clearDynamicCSS() {
    const oldStyles = document.head.querySelectorAll('style[data-dynamic-css], link[data-dynamic-css]');
    oldStyles.forEach(el => el.remove());
}

function createPageBuffer() {
    const div = document.createElement('div');
    div.id = 'page-buffer';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
}

function moveStylesAndLinksToHeadFrom(source) {
    clearDynamicCSS();

    const styles = source.querySelectorAll('style');
    styles.forEach(style => {
        const clone = style.cloneNode(true);
        clone.setAttribute('data-dynamic-css', 'true');
        document.head.appendChild(clone);
        style.remove();
    });

    const links = source.querySelectorAll('link[rel="stylesheet"]');
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

async function getHtml(url) {
    if (cachedHtml[url]) {return cachedHtml[url];}
    const res = await fetch(url);
    if (!res.ok) {throw new Error('Not found');}
    const html = await res.text();
    cachedHtml[url] = html;
    return html;
}

async function runInlineSVGs(container = document) {
    const images = container.querySelectorAll('img[is="inline-svg"]');
    
    for (const img of images) {
        const src = img.getAttribute('src');
        const color = img.dataset.color || 'currentColor';

        if (!src) continue;

        const response = await fetch(src);
        const svgText = await response.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svg = svgDoc.querySelector('svg');
        if (!svg) continue;

        svg.classList.add(...img.classList);
        if (img.width) svg.setAttribute('width', img.width);
        if (img.height) svg.setAttribute('height', img.height);

        if (color) {
            svg.querySelectorAll('[fill]').forEach(el => {
                el.setAttribute('fill', color);
            });
        }

        img.replaceWith(svg);
    }
}

function loadExtras() {
    const copyright = document.getElementById("copyright");
    if (!copyright) return console.error("Missing #copyright element!");
    copyright.innerHTML = `© ${new Date().getFullYear()} Minecat`;

    const header = document.getElementById('header');
    if (!header) return console.error("Missing #header element!");
    const stickyOffset = header.offsetTop;
    const triggerPoint = 30;

    const updateScrollState = () => {
        if (window.pageYOffset > triggerPoint) {
            document.body.classList.add('header-stuck');
        } else {
            document.body.classList.remove('header-stuck');
        }
    };

    window.addEventListener('scroll', updateScrollState);

    requestAnimationFrame(() => {
        setTimeout(updateScrollState, 0);
    });

    const menuToggle = document.getElementById("menu");
    const overlay = document.querySelector(".overlay");

    function toggleScrollock(locked) {
        if (locked) {
            window.scrollTo(0, 0);
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }

    menuToggle.addEventListener('change', () => {
        toggleScrollock(menuToggle.checked);
    });

    overlay.addEventListener('click', () => {
        menuToggle.checked = false;
        toggleScrollock(false);
    });
}

const cachedHtml = {}

window.addEventListener('hashchange', loadPage);
window.addEventListener('DOMContentLoaded', loadPage);