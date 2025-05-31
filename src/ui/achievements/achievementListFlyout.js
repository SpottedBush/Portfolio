import { flyoutElements } from '../flyout.js';


function createSingleAchievementElement(name, info){
    const wrapper = document.createElement("li");
    wrapper.className = "achievement-entry";

    // Title
    const titleElem = document.createElement("div");
    titleElem.className = "achievement-title";
    titleElem.textContent = name;
    wrapper.appendChild(titleElem);

    // Content row
    const contentRow = document.createElement("div");
    contentRow.className = "achievement-content-row";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.disabled = true;
    checkbox.checked = info.isDone;
    checkbox.className = "achievement-checkbox";
    contentRow.appendChild(checkbox);

    // Icon
    const iconWrapper = document.createElement("div");
    iconWrapper.className = "achievement-icon-wrapper";
    const iconImg = document.createElement("img");
    iconImg.src = info.icon;
    iconImg.alt = name;
    iconImg.className = "achievement-icon";
    iconWrapper.appendChild(iconImg);
    contentRow.appendChild(iconWrapper);

    // Description + reward
    const text = document.createElement("div");
    text.className = "achievement-text";

    if (info.isDone) {
        const desc = document.createElement("div");
        desc.className = "achievement-desc";
        desc.textContent = info.description;
        text.appendChild(desc);
    }

    if (info.reward) {
        const reward = document.createElement("div");
        reward.className = "achievement-reward";
        reward.textContent = "Reward: " + info.reward;
        if (!info.isDone && name === "100%")
            reward.textContent = "Reward: Unknown Reward, unlock it to find out!";
        text.appendChild(reward);
    }

    contentRow.appendChild(text);
    wrapper.appendChild(contentRow);
    return wrapper;
}

export async function displayAchievements(data) {
    if (!flyoutElements.flyout) return console.warn("Flyout not initialized.");

    flyoutElements.title.textContent = data.name || "Achievements";
    flyoutElements.description.textContent = data.description || "";
    flyoutElements.icon.src = data.icon || "";
    flyoutElements.icon.alt = data.name || "Achievements";
    flyoutElements.icon.style.width = "286px"; // Reduce main icon size
    flyoutElements.icon.style.height = "286px";
    flyoutElements.icon.style.objectFit = "contain"; // Maintain aspect ratio
    flyoutElements.icon.style.margin = "0 auto"; // Center the icon
    flyoutElements.link.style.display = 'none';
    flyoutElements.location.textContent = data.location || "";
    flyoutElements.year.textContent = data.year ? `Year: ${data.year}` : "";
    flyoutElements.skills.innerHTML = "";
    flyoutElements.skillLabel.textContent = "";
    const rawText = data.modelReference || '';
    const linkedText = rawText.replace( // Convert URLs to links with anchor tags
        /(https?:\/\/[^\s)]+)/g,
        url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    flyoutElements.modelReference.innerHTML = linkedText;

    const skills = data.skills;
    for (const [name, info] of Object.entries(skills)) {
        const wrapper = createSingleAchievementElement(name, info);
        flyoutElements.skills.appendChild(wrapper);
    }

    flyoutElements.flyout.classList.add('open');
}
