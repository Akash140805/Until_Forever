/* =========================================================
   ELEMENTS
========================================================= */

const openEnvelope =
    document.getElementById("openEnvelope");

const letterOverlay =
    document.getElementById("letterOverlay");

const closeLetter =
    document.getElementById("closeLetter");

const loveScreen =
    document.getElementById("loveScreen");

const replayButton =
    document.getElementById("replayButton");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicControl =
    document.getElementById("musicControl");

 
/* =========================================================
   MUSIC FADE
========================================================= */

const MUSIC_VOLUME = 0.40;
const FADE_DURATION = 1200; // milliseconds

let fadeAnimation = null;

function fadeInMusic() {
    cancelAnimationFrame(fadeAnimation);

    backgroundMusic.volume = 0;

    backgroundMusic.play().catch(() => {
        return;
    });

    const startTime = performance.now();

    function fade(time) {
        const progress = Math.min(
            (time - startTime) / FADE_DURATION,
            1
        );

        backgroundMusic.volume =
            progress * MUSIC_VOLUME;

        if (progress < 1) {
            fadeAnimation = requestAnimationFrame(fade);
        }
    }

    fadeAnimation = requestAnimationFrame(fade);
}

function fadeOutMusic() {
    cancelAnimationFrame(fadeAnimation);

    const startVolume = backgroundMusic.volume;
    const startTime = performance.now();

    function fade(time) {
        const progress = Math.min(
            (time - startTime) / FADE_DURATION,
            1
        );

        backgroundMusic.volume =
            startVolume * (1 - progress);

        if (progress < 1) {
            fadeAnimation = requestAnimationFrame(fade);
        } else {
            backgroundMusic.pause();
            backgroundMusic.volume = 0;
        }
    }

    fadeAnimation = requestAnimationFrame(fade);
}


/* =========================================================
   STATE
========================================================= */

let petalsActive = false;


/* =========================================================
   OPEN ENVELOPE
========================================================= */

openEnvelope.addEventListener(
    "click",
    async () => {

        /*
         * Show the letter
         */

        letterOverlay.classList.add(
            "active"
        );


        /*
         * Start music.
         *
         * This happens after a user click,
         * so browser autoplay restrictions
         * are satisfied.
         */

        try {

             fadeInMusic();

            musicControl.classList.add(
                "visible"
            );

            musicControl.textContent =
                "♫";

            musicControl.setAttribute(
                "aria-label",
                "Pause music"
            );

        } catch (error) {

            console.log(
                "Music could not be started:",
                error
            );

        }


        /*
         * Focus close button after
         * letter animation.
         */

        setTimeout(
            () => {
                closeLetter.focus();
            },
            500
        );

    }
);


/* =========================================================
   CLOSE LETTER
========================================================= */

closeLetter.addEventListener(
    "click",
    () => {

        /*
         * Hide letter
         */

        letterOverlay.classList.remove(
            "active"
        );


        /*
         * Start petals
         */

        startPetalShower();


        /*
         * Show final message
         * shortly after petals begin.
         */

        setTimeout(
            () => {

                loveScreen.classList.add(
                    "active"
                );

            },
            1100
        );

    }
);


/* =========================================================
   CLICK OUTSIDE LETTER
========================================================= */

letterOverlay.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            letterOverlay
        ) {

            closeLetter.click();

        }

    }
);


/* =========================================================
   PETAL SHOWER
========================================================= */

function startPetalShower() {

    /*
     * Prevent duplicate showers.
     */

    if (petalsActive) {
        return;
    }

    petalsActive = true;


    /*
     * Keep particle count reasonable
     * for mobile performance.
     */

    const petalCount = 55;


    const symbols = [
        "🌸",
        "🌷",
        "🌹",
        "💗",
        "🌸"
    ];


    for (
        let i = 0;
        i < petalCount;
        i++
    ) {

        const petal =
            document.createElement(
                "span"
            );


        petal.className =
            "petal";


        /*
         * Random petal.
         */

        petal.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        /*
         * Random horizontal position.
         */

        petal.style.left =
            Math.random() *
            100 +
            "vw";


        /*
         * Horizontal movement.
         */

        const drift =
            (Math.random() - 0.5) *
            280;

        petal.style.setProperty(
            "--drift",
            drift + "px"
        );


        /*
         * Random size.
         */

        const size =
            14 +
            Math.random() * 13;

        petal.style.fontSize =
            size + "px";


        /*
         * Random fall duration.
         */

        const duration =
            3.2 +
            Math.random() * 3.2;

        petal.style.animationDuration =
            duration + "s";


        /*
         * Random delay.
         */

        const delay =
            Math.random() * 1.5;

        petal.style.animationDelay =
            delay + "s";


        /*
         * Add to page.
         */

        document.body.appendChild(
            petal
        );


        /*
         * Remove after animation.
         */

        setTimeout(
            () => {

                petal.remove();

            },

            (duration + delay) *
                1000 +
                500
        );

    }


    /*
     * Allow another shower later.
     */

    setTimeout(
        () => {

            petalsActive = false;

        },
        8000
    );

}


/* =========================================================
   MUSIC CONTROL
========================================================= */

musicControl.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        fadeInMusic();
        musicControl.textContent = "🔊";
    } else {
        fadeOutMusic();
        musicControl.textContent = "🔇";
    }
});


/* =========================================================
   REPLAY
========================================================= */

replayButton.addEventListener(
    "click",
    () => {

        /*
         * Hide final screen.
         */

        loveScreen.classList.remove(
            "active"
        );


        /*
         * Close letter.
         */

        letterOverlay.classList.remove(
            "active"
        );


        /*
         * Stop music.
         */

        cancelAnimationFrame(fadeAnimation);

backgroundMusic.pause();

backgroundMusic.currentTime = 0;

backgroundMusic.volume = 0;


        /*
         * Hide music button.
         */

        musicControl.classList.remove(
            "visible"
        );


        musicControl.textContent =
            "♫";


        /*
         * Remove remaining petals.
         */

        document
            .querySelectorAll(".petal")
            .forEach(
                (petal) => {
                    petal.remove();
                }
            );


        /*
         * Reset state.
         */

        petalsActive = false;


        /*
         * Return focus to envelope.
         */

        openEnvelope.focus();

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            letterOverlay.classList.contains(
                "active"
            )
        ) {

            closeLetter.click();

        }

    }
);

/* =========================================================
   NATURAL BUTTERFLY FLIGHT
========================================================= */

const butterflies = [
    {
        element: document.querySelector(".butterfly-left"),

        // Starting position
        x: 0,
        y: 0,

        // Current movement
        targetX: 120,
        targetY: -60,

        // Movement speed
        speed: 0.018,

        // Different timing for each butterfly
        phase: Math.random() * Math.PI * 2
    },

    {
        element: document.querySelector(".butterfly-right"),

        x: 0,
        y: 0,

        targetX: -120,
        targetY: -70,

        speed: 0.015,

        phase: Math.random() * Math.PI * 2
    }
];


/* =========================================================
   CREATE A NEW RANDOM FLIGHT TARGET
========================================================= */

function chooseNewButterflyTarget(butterfly) {

    const isLeft =
        butterfly.element.classList.contains(
            "butterfly-left"
        );


    if (isLeft) {

        butterfly.targetX =
            30 +
            Math.random() * 130;

        butterfly.targetY =
            -90 +
            Math.random() * 150;

    } else {

        butterfly.targetX =
            -(30 + Math.random() * 130);

        butterfly.targetY =
            -90 +
            Math.random() * 150;
    }


    /*
        Random speed makes the movement
        feel less mechanical.
    */

    butterfly.speed =
        0.012 +
        Math.random() * 0.012;
}


/* =========================================================
   BUTTERFLY ANIMATION LOOP
========================================================= */

function animateButterflies(time) {

    butterflies.forEach(
        (butterfly) => {

            if (!butterfly.element) {
                return;
            }


            /*
                Slowly move toward target.
            */

            butterfly.x +=
                (
                    butterfly.targetX -
                    butterfly.x
                ) *
                butterfly.speed;


            butterfly.y +=
                (
                    butterfly.targetY -
                    butterfly.y
                ) *
                butterfly.speed;


            /*
                Gentle natural bobbing.

                This makes the butterfly move
                slightly up/down even while
                travelling toward its target.
            */

            const bob =
                Math.sin(
                    time * 0.0015 +
                    butterfly.phase
                ) *
                8;


            /*
                Calculate direction.

                This lets the butterfly tilt
                slightly while flying.
            */

            const direction =
                butterfly.targetX -
                butterfly.x;


            const tilt =
                Math.max(
                    -12,
                    Math.min(
                        12,
                        direction * 0.05
                    )
                );


            /*
                Apply movement.
            */

            butterfly.element.style.transform =
                `
                translate3d(
                    ${butterfly.x}px,
                    ${butterfly.y + bob}px,
                    0
                )
                rotate(${tilt}deg)
                `;


            /*
                When close to the target,
                choose another destination.
            */

            const distance =
                Math.sqrt(
                    Math.pow(
                        butterfly.targetX -
                        butterfly.x,
                        2
                    ) +

                    Math.pow(
                        butterfly.targetY -
                        butterfly.y,
                        2
                    )
                );


            if (distance < 8) {

                chooseNewButterflyTarget(
                    butterfly
                );

            }

        }
    );


    requestAnimationFrame(
        animateButterflies
    );
}


/* =========================================================
   START BUTTERFLIES
========================================================= */

butterflies.forEach(
    chooseNewButterflyTarget
);

requestAnimationFrame(
    animateButterflies
);