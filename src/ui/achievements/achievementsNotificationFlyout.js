// achievementsFlyout.js

import { planetInfoMap } from "../../data/planetData";
import { giveAchievementReward } from "./achievementRewarder";

// CSS styles for the flyout
const style = document.createElement('style');
style.textContent = `
.achievement-flyout {
    position: fixed;
    right: 32px;
    bottom: -140px;
    min-width: 360px;
    max-width: 460px;
    background: #222e38;
    color: #fff;
    border-radius: 16px 16px 10px 10px; /* More rounded upper border */
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
    padding: 12px 28px 20px 28px;   /* Increased top and side padding */
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 1.08rem;
    opacity: 0;
    z-index: 9999;
    transition: bottom 0.5s cubic-bezier(.4,2,.6,1), opacity 0.5s;
    display: flex;
    align-items: center;
    gap: 18px; /* Increased gap */
}
.achievement-flyout.show {
    bottom: 40px;
    opacity: 1;
}
.achievement-flyout .icon {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    object-fit: cover;
}
.achievement-flyout .content {
    flex: 1;
}
.achievement-flyout .title {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 1.08em;
}
.achievement-flyout .desc {
    font-size: 1em;
    opacity: 0.85;
}
`;

function createNotificationElement(title, description, icon) {
    const flyout = document.createElement('div');
    flyout.className = 'achievement-flyout';

    if (icon) {
        const img = document.createElement('img');
        img.src = icon;
        img.alt = '';
        img.className = 'icon';
        flyout.appendChild(img);
    }

    const content = document.createElement('div');
    content.className = 'content';

    const titleElem = document.createElement('div');
    titleElem.className = 'title';
    titleElem.textContent = title;

    const descElem = document.createElement('div');
    descElem.className = 'desc';
    descElem.textContent = description;

    content.appendChild(titleElem);
    content.appendChild(descElem);
    flyout.appendChild(content);

    return flyout;
}

// Ensure the style is only added once
let styleAppended = false;

const notificationQueue = [];
let isNotificationActive = false;

/**
 * Shows an achievement flyout in the bottom right corner.
 * @param {string} title - The title of the achievement to show.
 * @param {number} [duration=3500] - How long to show (ms)
 */
export function showAchievementNotification(title, duration = 3500) {
    if (!styleAppended) {
        document.head.appendChild(style);
        styleAppended = true;
    }

    // Queue the notification request
    notificationQueue.push({ title, duration });
    if (!isNotificationActive) {
        processNextNotification();
    }
}

function processNextNotification() {
    if (notificationQueue.length === 0) {
        isNotificationActive = false;
        return;
    }

    isNotificationActive = true;

    const { title, duration } = notificationQueue.shift();
    giveAchievementReward(title);
    const currAchievement = planetInfoMap['Achievements'].skills[title];
    currAchievement.isDone = true;
    const icon = currAchievement.icon || null;

    const flyout = createNotificationElement(title, currAchievement.description, icon);
    const showFlyout = () => {
        document.body.appendChild(flyout);
        // Fade in
        setTimeout(() => flyout.classList.add('show'), 10);

        // Fade out after duration
        setTimeout(() => {
            flyout.classList.remove('show');
            // Wait for fade-out animation (e.g., 1s), then remove and process next
            setTimeout(() => {
                flyout.remove();
                processNextNotification();
            }, 100);
        }, duration);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", showFlyout);
    } else {
        showFlyout();
    }
}