window.initMain ??= () => {
    const copyright = document.getElementById("copyright");
    copyright.innerHTML = `© ${new Date().getFullYear()} Minecat`;
}
initMain();