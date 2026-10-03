/* =========================================
   FASEEH
   Main Application
========================================= */


/* =========================================
   DATA
========================================= */

const defaultUser = {
    xp: 0,
    streak: 0,
    level: 1,
    plan: "Basic",

    surveyCompleted: false,

    profile: {
        background: "",
        education: "",
        level: "",
        goals: []
    },

    completedLessons: []
};


let user = JSON.parse(
    localStorage.getItem("faseehUser")
) || defaultUser;


let surveyStep = 1;


let surveyAnswers = {
    background: "",
    education: "",
    level: "",
    goals: []
};


/* =========================================
   STORAGE
========================================= */

function saveUser() {

    localStorage.setItem(
        "faseehUser",
        JSON.stringify(user)
    );
}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================
   STREAK
========================================= */

function updateStreak() {

    const today =
        new Date().toDateString();

    const lastVisit =
        localStorage.getItem("faseehLastVisit");


    if (!lastVisit) {

        user.streak = 1;

        localStorage.setItem(
            "faseehLastVisit",
            today
        );

        saveUser();

        return;
    }


    if (lastVisit !== today) {

        user.streak++;

        localStorage.setItem(
            "faseehLastVisit",
            today
        );

        saveUser();
    }
}


/* =========================================
   LEVEL
========================================= */

function calculateLevel() {

    user.level =
        Math.floor(user.xp / 500) + 1;
}


/* =========================================
   ONBOARDING
========================================= */

function setupSurvey() {

    const choices =
        document.querySelectorAll(".choice");


    choices.forEach(choice => {

        choice.addEventListener("click", () => {

            const question =
                choice.dataset.question;

            const value =
                choice.dataset.value;


            surveyAnswers[question] =
                value;


            document
                .querySelectorAll(
                    `.choice[data-question="${question}"]`
                )
                .forEach(item => {
                    item.classList.remove("selected");
                });


            choice.classList.add("selected");


            setTimeout(() => {

                if (surveyStep < 4) {

                    surveyStep++;

                    showSurveyStep();

                }

            }, 250);

        });

    });


    document
        .querySelectorAll(".goal")
        .forEach(goal => {

            goal.addEventListener("click", () => {

                const value =
                    goal.dataset.goal;


                goal.classList.toggle("selected");


                if (
                    surveyAnswers.goals.includes(value)
                ) {

                    surveyAnswers.goals =
                        surveyAnswers.goals.filter(
                            item => item !== value
                        );

                } else {

                    surveyAnswers.goals.push(value);

                }

            });

        });


    document
        .getElementById("backButton")
        .addEventListener(
            "click",
            previousSurveyStep
        );


    document
        .getElementById("finishSurvey")
        .addEventListener(
            "click",
            finishSurvey
        );
}


function showSurveyStep() {

    document
        .querySelectorAll(".survey-step")
        .forEach(step => {

            step.classList.toggle(
                "active",
                Number(step.dataset.step) === surveyStep
            );

        });


    const progress =
        document.getElementById("progressBar");

    progress.style.width =
        `${surveyStep * 25}%`;


    document
        .getElementById("stepCounter")
        .textContent =
        `${surveyStep} of 4`;


    document
        .getElementById("backButton")
        .classList.toggle(
            "hidden",
            surveyStep === 1
        );
}


function previousSurveyStep() {

    if (surveyStep > 1) {

        surveyStep--;

        showSurveyStep();
    }
}


function finishSurvey() {

    if (!surveyAnswers.goals.length) {

        showToast(
            "Choose at least one learning goal."
        );

        return;
    }


    user.profile = {
        background: surveyAnswers.background,
        education: surveyAnswers.education,
        level: surveyAnswers.level,
        goals: surveyAnswers.goals
    };


    user.surveyCompleted = true;


    saveUser();


    document
        .getElementById("onboarding")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    buildLearningPath();

    updateInterface();

    showPage("dashboard");

    showToast(
        "Your personalized learning path is ready!"
    );
}


/* =========================================
   LEARNING PATH
========================================= */

const lessonInfo = {

    vocabulary: {
        title: "Arabic Vocabulary",
        description: "Build useful Arabic words and expressions.",
        icon: "📚",
        color: "purple"
    },

    grammar: {
        title: "Arabic Grammar",
        description: "Understand Arabic grammar step by step.",
        icon: "📝",
        color: "blue"
    },

    speaking: {
        title: "Speaking Practice",
        description: "Practice useful Arabic conversations.",
        icon: "🎤",
        color: "green"
    },

    writing: {
        title: "Arabic Writing",
        description: "Improve your Arabic writing skills.",
        icon: "✍️",
        color: "orange"
    },

    reading: {
        title: "Reading Practice",
        description: "Read Arabic texts and understand them.",
        icon: "📖",
        color: "purple"
    },

    listening: {
        title: "Listening Practice",
        description: "Train your ear to understand Arabic.",
        icon: "🎧",
        color: "blue"
    },

    expression: {
        title: "Arabic Expression",
        description: "Learn how to express your ideas clearly.",
        icon: "💬",
        color: "green"
    },

    literature: {
        title: "Arabic Literature",
        description: "Explore Arabic texts, stories and poetry.",
        icon: "📜",
        color: "pink"
    }

};


function getRecommendedGoals() {

    const profile =
        user.profile;


    if (profile.goals && profile.goals.length) {
        return profile.goals;
    }


    if (profile.level === "beginner") {

        return [
            "vocabulary",
            "reading",
            "speaking"
        ];

    }


    return [
        "vocabulary",
        "grammar",
        "reading"
    ];
}


function buildLearningPath() {

    const goals =
        getRecommendedGoals();


    const dashboard =
        document.getElementById(
            "dashboardLessons"
        );

    const allLessons =
        document.getElementById(
            "allLessons"
        );


    dashboard.innerHTML = "";
    allLessons.innerHTML = "";


    goals.forEach(
        (goal, index) => {

            const info =
                lessonInfo[goal];

            if (!info) return;


            const completed =
                user.completedLessons.includes(goal);


            const card =
                createLessonCard(
                    info,
                    goal,
                    index,
                    completed
                );


            allLessons.appendChild(card.cloneNode(true));


            if (index < 3) {

                dashboard.appendChild(card);

            }

        }
    );


    updateProgress();
}


function createLessonCard(
    info,
    goal,
    index,
    completed
) {

    const card =
        document.createElement("article");


    card.className =
        "lesson-card";


    card.innerHTML = `

        <div class="lesson-cover ${info.color}">

            <span class="lesson-emoji">
                ${info.icon}
            </span>

            <span class="lesson-number">
                LESSON ${index + 1}
            </span>

        </div>

        <div class="lesson-body">

            <span class="lesson-tag">
                ${user.profile.level || "BEGINNER"}
            </span>

            <h3>
                ${info.title}
            </h3>

            <p>
                ${info.description}
            </p>

            <button
                class="primary-button lesson-button"
                data-lesson="${goal}"
                ${completed ? "disabled" : ""}>

                ${
                    completed
                    ? "✓ Completed"
                    : "Start Lesson →"
                }

            </button>

        </div>
    `;


    const button =
        card.querySelector(
            ".lesson-button"
        );


    if (!completed) {

        button.addEventListener(
            "click",
            () => completeLesson(goal)
        );

    }


    return card;
}


/* =========================================
   COMPLETE LESSON
========================================= */

function completeLesson(goal) {

    if (
        user.completedLessons.includes(goal)
    ) {
        return;
    }


    user.completedLessons.push(goal);

    user.xp += 50;


    calculateLevel();

    saveUser();

    buildLearningPath();

    updateInterface();


    showToast(
        "Great job! +50 XP ⭐"
    );
}


/* =========================================
   PROGRESS
========================================= */

function updateProgress() {

    const goals =
        getRecommendedGoals();


    const completed =
        goals.filter(goal =>
            user.completedLessons.includes(goal)
        ).length;


    const percentage =
        goals.length
            ? Math.round(
                (completed / goals.length) * 100
            )
            : 0;


    document
        .getElementById("dashboardProgress")
        .textContent =
        `${percentage}%`;


    document
        .getElementById("learnProgressText")
        .textContent =
        `${percentage}% complete`;


    document
        .getElementById("learnProgressBar")
        .style.width =
        `${percentage}%`;
}


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation() {

    document
        .querySelectorAll("[data-page]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    showPage(page);

                }
            );

        });
}


function showPage(pageId) {

    document
        .querySelectorAll(".app-page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    const target =
        document.getElementById(pageId);


    if (target) {

        target.classList.add(
            "active-page"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(nav => {

            nav.classList.toggle(
                "active",
                nav.dataset.page === pageId
            );

        });


    const titles = {

        dashboard: "Your Arabic journey",

        learn: "Your Learning Path",

        feed: "Short Lessons",

        games: "Daily Games",

        friends: "Friends",

        profile: "Your Profile"

    };


    document
        .getElementById("pageHeading")
        .textContent =
        titles[pageId] || "Faseeh";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   INTERFACE
========================================= */

function updateInterface() {

    calculateLevel();


    const xp =
        user.xp;

    const streak =
        user.streak;

    const level =
        user.level;


    document
        .getElementById("dashboardXP")
        .textContent =
        xp;


    document
        .getElementById("dashboardStreak")
        .textContent =
        streak;


    document
        .getElementById("dashboardLevel")
        .textContent =
        level;


    document
        .getElementById("sideStreak")
        .textContent =
        streak;


    document
        .getElementById("profileXP")
        .textContent =
        xp;


    document
        .getElementById("profileLevel")
        .textContent =
        level;


    document
        .getElementById("profileStreak")
        .textContent =
        streak;


    document
        .getElementById("friendXP")
        .textContent =
        `${xp} XP`;


    document
        .getElementById("friendStreak")
        .textContent =
        streak;


    const goals =
        user.profile.goals || [];


    const profileGoals =
        document.getElementById(
            "profileGoals"
        );


    profileGoals.innerHTML = "";


    if (!goals.length) {

        profileGoals.innerHTML =
            "<span>No goals selected yet.</span>";

    } else {

        goals.forEach(goal => {

            const tag =
                document.createElement("span");


            tag.textContent =
                goal.charAt(0).toUpperCase()
                + goal.slice(1);


            profileGoals.appendChild(tag);

        });

    }


    const levelText =
        user.profile.level
            ? user.profile.level
            : "beginner";


    document
        .getElementById("learningSubtitle")
        .textContent =
        `Your path is designed for your ${levelText} level and selected goals.`;
}


/* =========================================
   GAMES
========================================= */

function setupGames() {

    document
        .querySelectorAll(".game-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    startGame(
                        button.dataset.game
                    );

                }
            );

        });

}


function startGame(type) {

    const area =
        document.getElementById(
            "gameArea"
        );


    area.classList.remove(
        "hidden"
    );


    if (type === "word") {

        area.innerHTML = `

            <h2>🧩 Word Match</h2>

            <p>What does <strong>كتاب</strong> mean?</p>

            <button class="game-option" data-answer="wrong">
                School
            </button>

            <button class="game-option" data-answer="correct">
                Book
            </button>

            <button class="game-option" data-answer="wrong">
                Pen
            </button>

        `;

    }


    if (type === "grammar") {

        area.innerHTML = `

            <h2>📝 Grammar Challenge</h2>

            <p>Choose the correct sentence:</p>

            <button class="game-option" data-answer="correct">
                أنا أحب القراءة.
            </button>

            <button class="game-option" data-answer="wrong">
                أنا يحب القراءة.
            </button>

            <button class="game-option" data-answer="wrong">
                أنا تحب القراءة.
            </button>

        `;

    }


    if (type === "listening") {

        area.innerHTML = `

            <h2>🎧 Listening Challenge</h2>

            <p>Imagine you hear: <strong>صباح الخير</strong></p>

            <button class="game-option" data-answer="correct">
                Good morning
            </button>

            <button class="game-option" data-answer="wrong">
                Good night
            </button>

            <button class="game-option" data-answer="wrong">
                Thank you
            </button>

        `;

    }


    area
        .querySelectorAll(".game-option")
        .forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    if (
                        option.dataset.answer ===
                        "correct"
                    ) {

                        user.xp += 25;

                        calculateLevel();

                        saveUser();

                        updateInterface();

                        option.style.background =
                            "#e6faf4";

                        showToast(
                            "Correct! +25 XP 🎉"
                        );

                    } else {

                        option.style.background =
                            "#ffecef";

                        showToast(
                            "Not quite — try again!"
                        );

                    }

                }
            );

        });


    area.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   AI TUTOR
========================================= */

function setupTutor() {

    const input =
        document.getElementById(
            "messageInput"
        );

    const send =
        document.getElementById(
            "sendMessage"
        );


    function sendMessage() {

        const text =
            input.value.trim();


        if (!text) return;


        addMessage(
            text,
            "user"
        );


        input.value = "";


        setTimeout(() => {

            addMessage(
                getAIResponse(text),
                "ai"
            );

        }, 600);

    }


    send.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                sendMessage();
            }

        }
    );


    document
        .querySelectorAll(
            ".quick-prompts button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    input.value =
                        button.dataset.prompt;

                    sendMessage();

                }
            );

        });
}


function addMessage(
    text,
    type
) {

    const messages =
        document.getElementById(
            "messages"
        );


    const message =
        document.createElement("div");


    message.className =
        `chat-message ${type}`;


    message.innerHTML = `

        <span>ف</span>

        <p>
            ${escapeHTML(text)}
        </p>

    `;


    messages.appendChild(
        message
    );


    messages.scrollTop =
        messages.scrollHeight;
}


function getAIResponse(text) {

    const lower =
        text.toLowerCase();


    if (
        lower.includes("grammar") ||
        lower.includes("قواعد")
    ) {

        return "Of course! Arabic grammar becomes easier when we break it into small steps. Start by identifying the subject, verb, and object in a sentence.";

    }


    if (
        lower.includes("word") ||
        lower.includes("كلمة")
    ) {

        return "Sure! Send me the Arabic word and I can explain its meaning, pronunciation, and how to use it in a sentence.";

    }


    if (
        lower.includes("conversation") ||
        lower.includes("محادثة")
    ) {

        return "Let's practice! أنا فصيح. كيف حالك اليوم؟";

    }


    return "Great question! I'm here to help you understand Arabic step by step. The full Faseeh AI Tutor will be connected to a real AI system later.";

}


function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   VIDEO BUTTONS
========================================= */

function setupVideos() {

    document
        .querySelectorAll(".play-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showToast(
                        "Video lessons will be connected here."
                    );

                }
            );

        });
}


/* =========================================
   PLANS
========================================= */

function setupPlans() {

    document
        .querySelectorAll("[data-plan]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const plan =
                        button.dataset.plan;


                    user.plan =
                        plan;


                    saveUser();


                    showToast(
                        `${plan} selected — payments will be connected later.`
                    );

                }
            );

        });
}


/* =========================================
   LANGUAGE
========================================= */

function toggleLanguage() {

    const isArabic =
        document.body.classList.toggle(
            "rtl"
        );


    document.documentElement.lang =
        isArabic
            ? "ar"
            : "en";


    const text =
        isArabic
            ? "English"
            : "العربية";


    document
        .getElementById(
            "languageButton"
        )
        .textContent =
        text;


    document
        .getElementById(
            "topLanguage"
        )
        .textContent =
        text;


    showToast(
        isArabic
            ? "Arabic layout enabled."
            : "English layout enabled."
    );
}


/* =========================================
   START APP
========================================= */

function startApp() {

    updateStreak();

    setupSurvey();

    setupNavigation();

    setupGames();

    setupTutor();

    setupVideos();

    setupPlans();

    document
        .getElementById(
            "languageButton"
        )
        .addEventListener(
            "click",
            toggleLanguage
        );


    document
        .getElementById(
            "topLanguage"
        )
        .addEventListener(
            "click",
            toggleLanguage
        );


    if (user.surveyCompleted) {

        document
            .getElementById(
                "onboarding"
            )
            .classList.add("hidden");


        document
            .getElementById(
                "app"
            )
            .classList.remove("hidden");


        buildLearningPath();

        updateInterface();

    }

}


/* RUN */

startApp();