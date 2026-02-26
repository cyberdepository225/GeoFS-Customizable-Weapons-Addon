// ==UserScript==
// @name         GeoFS Weapon Arsenal Noises
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Combat sound system
// @author       You
// @match        https://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

let selectedSound = null;
let currentAudio = null;
let isLoopPlaying = false;

// 🔑 Change this to whatever key you want
// Examples:
// "KeyJ" = J
// "KeyK" = K
// "Period" = .
// "Space" = Spacebar
// "KeyF" = F
let FIRE_KEY = "KeyI";

const SOUND_LIBRARY = {
    "High Definition Machine Gun": {
        url: "https://raw.githubusercontent.com/cyberdepository225/personal-addons/main/High_Definition_Machine_gun-WEL-2006923900.mp3",
        loop: true,
        volume: 0.8
    },
    "Vulcan Noise": {
        url: "https://raw.githubusercontent.com/cyberdepository225/personal-addons/main/vulcan%20noise.mp3",
        loop: true,
        volume: 0.60
    },
    "Missile Launching": {
        url: "https://raw.githubusercontent.com/cyberdepository225/personal-addons/main/missile%20launching.mp3",
        loop: false,
        volume: 1.0
    },
    "Bunker Buster": {
        url: "https://raw.githubusercontent.com/cyberdepository225/personal-addons/main/Bunkerbuster(1).mp3",
        loop: false,
        volume: 1.0
    },
    "Minigun": {
        url: "https://raw.githubusercontent.com/cyberdepository225/personal-addons/main/Minigun-Jim_Rogers-633894726.mp3",
        loop: true,
        volume: 1.0
    }
};

function createAudio(config) {
    const audio = new Audio(config.url);
    audio.loop = config.loop;
    audio.volume = config.volume;
    audio.preload = "auto";
    return audio;
}

function stopLoopSound() {
    if (currentAudio && isLoopPlaying) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        isLoopPlaying = false;
    }
}

function startAddon() {

    // ================= UI =================

    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "70px";
    panel.style.right = "10px";
    panel.style.padding = "10px 14px";
    panel.style.backgroundColor = "rgba(0,0,0,0.75)";
    panel.style.color = "red";
    panel.style.fontFamily = "monospace";
    panel.style.fontSize = "14px";
    panel.style.borderRadius = "6px";
    panel.style.zIndex = "9999";

    const title = document.createElement("div");
    title.innerText = "Combat Sound Menu";
    panel.appendChild(title);

    const select = document.createElement("select");
    select.style.marginTop = "8px";
    select.style.width = "240px";

    Object.keys(SOUND_LIBRARY).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.innerText = name;
        select.appendChild(option);
    });

    selectedSound = select.value;

    select.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    select.addEventListener("change", function () {
        selectedSound = this.value;
        stopLoopSound();
        this.blur();
    });

    panel.appendChild(select);

    const hint = document.createElement("div");
    hint.style.marginTop = "8px";
    hint.innerText = "Press " + FIRE_KEY.replace("Key", "") + " to execute";
    panel.appendChild(hint);

    document.body.appendChild(panel);

    // ================= KEY CONTROL =================

    document.addEventListener("keydown", function (event) {

        if (event.code !== FIRE_KEY) return;
        if (event.repeat) return;

        const config = SOUND_LIBRARY[selectedSound];
        if (!config) return;

        if (config.loop) {
            if (isLoopPlaying) return;

            currentAudio = createAudio(config);
            currentAudio.currentTime = 0;
            currentAudio.play().catch(() => {});
            isLoopPlaying = true;
        } else {
            const oneShot = createAudio(config);
            oneShot.play().catch(() => {});
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.code === FIRE_KEY) {
            stopLoopSound();
        }
    });

    console.log("Combat Sound Menu Ready.");
}

// ================= WAIT FOR GEOFS =================

const waitForGeoFS = setInterval(() => {
    if (typeof geofs !== "undefined" &&
        geofs.aircraft &&
        geofs.aircraft.instance) {

        clearInterval(waitForGeoFS);

        setTimeout(() => {
            startAddon();
            console.log("GeoFS loaded. Sound system armed.");
        }, 1000);
    }
}, 100);
