window.initMain ??= async () => {
    if (document.readyState === "loading") {
        window.addEventListener('DOMContentLoaded', runMain);
    } else {
        await runMain();
    }

    async function runMain() {
        console.log("code ran")
        await loadProjects();
    }

    async function loadJSON(path) {
        const response = await fetchAndCache(path);
        if (!response.ok) throw new Error(`Failed to load JSON from ${path}`);
        return await response.json();
    }

    async function loadProjects() {
        const container = document.getElementById("githubProList");
        const projects = await loadJSON("/data/githubProjects.json");

        for (const project of projects) {
            const githubProjectDiv = document.createElement("div");
            githubProjectDiv.className = "githubProject";

            const projectName = document.createElement("p");
            projectName.innerHTML = `<b>${project.name}</b>`;

            const gitProContentDiv = document.createElement("div");
            gitProContentDiv.className = "gitProContent";

            const gitProImgDiv = document.createElement("div");
            gitProImgDiv.className = "gitProImg";
            gitProImgDiv.innerHTML = `<img src="${project.icon}" alt="Project Icon">`;

            const gitProTextDiv = document.createElement("div");
            gitProTextDiv.className = "gitProText";

            const projectDescription = document.createElement("p");
            projectDescription.innerHTML = project.description;

            const gitProButtonsDiv = document.createElement("div");
            gitProButtonsDiv.className = "gitProButtons";

            for (const button of project.buttons) {
                const linkElement = document.createElement("a");
                linkElement.href = button.link;
                if (!button.replacePage) {
                    linkElement.target = "_blank";
                    linkElement.rel = "noopener noreferrer";
                }
                linkElement.innerHTML = `<button>${button.text}</button>`;
                gitProButtonsDiv.appendChild(linkElement);
            }

            gitProTextDiv.appendChild(projectDescription);
            gitProTextDiv.appendChild(gitProButtonsDiv);
            gitProContentDiv.appendChild(gitProImgDiv);
            gitProContentDiv.appendChild(gitProTextDiv);
            githubProjectDiv.appendChild(projectName);
            githubProjectDiv.appendChild(gitProContentDiv);
            container.appendChild(githubProjectDiv);
        }
    }
};

initMain();
