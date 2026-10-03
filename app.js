/* =========================================
   FASEEH APP
========================================= */


/* =========================================
   USER DATA
========================================= */

let userData = JSON.parse(localStorage.getItem("faseehUser")) || {

    xp: 0,

    streak: 0,

    level: 1,

    plan: "Basic",

    surveyCompleted: false,

    language: "en",

    profile: {
        background: "",
        education: "",
        level: "",
        skills: []
    }

};


/* =========================================
   LANGUAGE
========================================= */

let language = userData.language || "en";


function setLanguage(newLanguage) {

    /*
        Arab users:
        Arabic only.

        Non-Arab users:
        English + Arabic.
    */

    if (
        userData.profile.background === "arab" &&
        newLanguage === "en"
    ) {
        newLanguage = "ar";
    }

    language = newLanguage;

    userData.language = language;

    saveUser();

    document.documentElement.lang = language;

    document.body.classList.toggle(
        "rtl",
        language === "ar"
    );

    updateText();

    updateLanguageButtons();

    createLearningPath();

    updateStats();

}


function updateText() {

    document
        .querySelectorAll("[data-en][data-ar]")
        .forEach(element => {

            element.textContent =
                language === "ar"
                    ? element.getAttribute("data-ar")
                    : element.getAttribute("data-en");

        });

}


function updateLanguageButtons() {

    const languageButton =
        document.getElementById("languageButton");

    const topLanguage =
        document.getElementById("topLanguage");


    /*
        Arab users cannot switch to English.
    */

    if (
        userData.profile.background === "arab"
    ) {

        if (languageButton) {
            languageButton.style.display = "none";
        }

        if (topLanguage) {
            topLanguage.style.display = "none";
        }

        return;
    }


    if (languageButton) {

        languageButton.textContent =
            language === "ar"
                ? "English"
                : "العربية";

    }


    if (topLanguage) {

        topLanguage.textContent =
            language === "ar"
                ? "English"
                : "العربية";

    }

}


/* =========================================
   LANGUAGE BUTTONS
========================================= */

function toggleLanguage() {

    if (
        userData.profile.background === "arab"
    ) {

        setLanguage("ar");

        return;
    }


    setLanguage(
        language === "en"
            ? "ar"
            : "en"
    );

}


document
    .getElementById("languageButton")
    ?.addEventListener(
        "click",
        toggleLanguage
    );


document
    .getElementById("topLanguage")
    ?.addEventListener(
        "click",
        toggleLanguage
    );


/* =========================================
   SURVEY
========================================= */

let currentStep = 1;


let surveyAnswers = {

    background: "",

    education: "",

    level: "",

    skills: []

};


function showSurveyStep(step) {

    currentStep = step;


    document
        .querySelectorAll(".survey-step")
        .forEach(section => {

            section.classList.toggle(
                "active",
                Number(section.dataset.step) === step
            );

        });


    const progress =
        document.getElementById("progressBar");

    if (progress) {

        progress.style.width =
            `${step * 25}%`;

    }


    const counter =
        document.getElementById("stepCounter");

    if (counter) {

        counter.textContent =
            `${step} of 4`;

    }


    const backButton =
        document.getElementById("backButton");


    if (backButton) {

        backButton.classList.toggle(
            "hidden",
            step === 1
        );

    }

}


/* =========================================
   SURVEY CHOICES
========================================= */

document
    .querySelectorAll(".choice")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.dataset.question;

                const value =
                    button.dataset.value;


                document
                    .querySelectorAll(
                        `.choice[data-question="${question}"]`
                    )
                    .forEach(choice => {

                        choice.classList.remove(
                            "selected"
                        );

                    });


                button.classList.add(
                    "selected"
                );


                surveyAnswers[question] =
                    value;


                /*
                    Automatically move forward.
                */

                if (currentStep < 4) {

                    setTimeout(() => {

                        showSurveyStep(
                            currentStep + 1
                        );

                    }, 220);

                }

            }
        );

    });


/* =========================================
   GOALS
========================================= */

document
    .querySelectorAll(".goal")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                button.classList.toggle(
                    "selected"
                );


                const goal =
                    button.dataset.goal;


                if (
                    surveyAnswers.skills.includes(goal)
                ) {

                    surveyAnswers.skills =
                        surveyAnswers.skills.filter(
                            item => item !== goal
                        );

                } else {

                    surveyAnswers.skills.push(
                        goal
                    );

                }

            }
        );

    });


/* =========================================
   BACK BUTTON
========================================= */

document
    .getElementById("backButton")
    ?.addEventListener(
        "click",
        () => {

            if (currentStep > 1) {

                showSurveyStep(
                    currentStep - 1
                );

            }

        }
    );


/* =========================================
   FINISH SURVEY
========================================= */

document
    .getElementById("finishSurvey")
    ?.addEventListener(
        "click",
        () => {

            if (!surveyAnswers.background) {

                showToast(
                    "Please complete the survey."
                );

                return;
            }


            if (!surveyAnswers.education) {

                showToast(
                    "Please choose your education level."
                );

                return;
            }


            if (!surveyAnswers.level) {

                showToast(
                    "Please choose your Arabic level."
                );

                return;
            }


            if (
                surveyAnswers.skills.length === 0
            ) {

                showToast(
                    "Choose at least one learning goal."
                );

                return;
            }


            userData.profile = {

                background:
                    surveyAnswers.background,

                education:
                    surveyAnswers.education,

                level:
                    surveyAnswers.level,

                skills:
                    surveyAnswers.skills

            };


            userData.surveyCompleted = true;


            /*
                IMPORTANT:

                Arab users automatically
                receive Arabic-only interface.
            */

            if (
                surveyAnswers.background === "arab"
            ) {

                language = "ar";

            } else {

                language = "en";

            }


            userData.language =
                language;


            saveUser();


            document
                .getElementById("onboarding")
                .classList.add("hidden");


            document
                .getElementById("app")
                .classList.remove("hidden");


            updateLanguageButtons();

            updateText();

            updateStats();

            createLearningPath();

            updateProfileGoals();

            updatePersonalization();

            showPage("dashboard");


            showToast(
                language === "ar"
                    ? "تم إنشاء مسارك التعليمي! 🎉"
                    : "Your personalized learning path is ready! 🎉"
            );

        }
    );


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {

    document
        .querySelectorAll(".app-page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    const page =
        document.getElementById(pageId);


    if (page) {

        page.classList.add(
            "active-page"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === pageId
            );

        });


    updatePageHeading(pageId);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


document
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-page]"
                );


            if (!button) return;


            const page =
                button.dataset.page;


            if (page) {

                showPage(page);

            }

        }
    );


/* =========================================
   PAGE HEADINGS
========================================= */

function updatePageHeading(page) {

    const heading =
        document.getElementById(
            "pageHeading"
        );


    if (!heading) return;


    const headings = {

        dashboard: {
            en: "Your Arabic journey",
            ar: "رحلتك في اللغة العربية"
        },

        learn: {
            en: "Your learning path",
            ar: "مسارك التعليمي"
        },

        feed: {
            en: "Short Arabic lessons",
            ar: "دروس عربية قصيرة"
        },

        games: {
            en: "Practice through games",
            ar: "تعلّم من خلال الألعاب"
        },

        tutor: {
            en: "Your Faseeh AI Tutor",
            ar: "معلم فصيح الذكي"
        },

        friends: {
            en: "Learn together",
            ar: "تعلّموا معًا"
        },

        profile: {
            en: "Your profile",
            ar: "ملفك الشخصي"
        }

    };


    const selected =
        headings[page] ||
        headings.dashboard;


    heading.textContent =
        selected[language];

}


/* =========================================
   PERSONALIZED LEARNING
========================================= */

const lessonData = {

    vocabulary: {
        icon: "📚",
        en: "Arabic Vocabulary",
        ar: "المفردات العربية"
    },

    grammar: {
        icon: "📝",
        en: "Arabic Grammar",
        ar: "القواعد العربية"
    },

    speaking: {
        icon: "🎤",
        en: "Speaking Practice",
        ar: "تدريب المحادثة"
    },

    writing: {
        icon: "✍️",
        en: "Arabic Writing",
        ar: "الكتابة العربية"
    },

    reading: {
        icon: "📖",
        en: "Reading Practice",
        ar: "تدريب القراءة"
    },

    listening: {
        icon: "🎧",
        en: "Listening Practice",
        ar: "تدريب الاستماع"
    },

    expression: {
        icon: "💬",
        en: "Arabic Expression",
        ar: "التعبير العربي"
    },

    literature: {
        icon: "📜",
        en: "Arabic Literature",
        ar: "الأدب العربي"
    }

};


function createLearningPath() {

    const dashboard =
        document.getElementById(
            "dashboardLessons"
        );

    const allLessons =
        document.getElementById(
            "allLessons"
        );


    if (!dashboard || !allLessons) return;


    let skills =
        userData.profile.skills;


    if (
        !skills ||
        skills.length === 0
    ) {

        skills = [
            "vocabulary",
            "grammar",
            "reading"
        ];

    }


    dashboard.innerHTML = "";

    allLessons.innerHTML = "";


    skills.forEach(
        (skill, index) => {

            const lesson =
                lessonData[skill];


            if (!lesson) return;


            const title =
                language === "ar"
                    ? lesson.ar
                    : lesson.en;


            const description =
                getLessonDescription(
                    skill
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "lesson-card";


            card.innerHTML = `

                <div class="lesson-cover">

                    <span class="lesson-icon">
                        ${lesson.icon}
                    </span>

                    <span class="lesson-number">
                        LESSON ${index + 1}
                    </span>

                </div>

                <div class="lesson-body">

                    <h3>
                        ${title}
                    </h3>

                    <p>
                        ${description}
                    </p>

                    <button
                        class="primary-button lesson-button"
                        data-lesson="${skill}">
                        ${language === "ar"
                            ? "ابدأ الدرس ←"
                            : "Start Lesson →"}
                    </button>

                </div>
            `;


            dashboard.appendChild(
                card.cloneNode(true)
            );


            allLessons.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(
            "[data-lesson]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    completeLesson();

                }
            );

        });


    const subtitle =
        document.getElementById(
            "learningSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            language === "ar"
                ? `مستواك الحالي: ${translateLevel(userData.profile.level)}`
                : `Your current level: ${userData.profile.level}`;

    }

}


function getLessonDescription(skill) {

    const level =
        userData.profile.level ||
        "beginner";


    const descriptions = {

        vocabulary: {
            beginner: "Learn useful everyday Arabic words.",
            intermediate: "Expand your Arabic vocabulary.",
            advanced: "Master advanced Arabic vocabulary."
        },

        grammar: {
            beginner: "Build your Arabic grammar foundation.",
            intermediate: "Strengthen your grammar skills.",
            advanced: "Challenge yourself with advanced grammar."
        },

        speaking: {
            beginner: "Practice simple Arabic conversations.",
            intermediate: "Speak with more confidence.",
            advanced: "Improve natural Arabic expression."
        },

        writing: {
            beginner: "Write simple Arabic sentences.",
            intermediate: "Build stronger Arabic paragraphs.",
            advanced: "Develop advanced Arabic writing."
        },

        reading: {
            beginner: "Read simple Arabic texts.",
            intermediate: "Understand longer Arabic texts.",
            advanced: "Analyze advanced Arabic passages."
        },

        listening: {
            beginner: "Train your ears with simple Arabic.",
            intermediate: "Understand natural Arabic speech.",
            advanced: "Challenge yourself with advanced listening."
        },

        expression: {
            beginner: "Learn useful Arabic expressions.",
            intermediate: "Use Arabic more naturally.",
            advanced: "Master advanced expressions."
        },

        literature: {
            beginner: "Discover simple Arabic texts.",
            intermediate: "Explore Arabic literature.",
            advanced: "Analyze advanced Arabic literature."
        }

    };


    if (language === "ar") {

        const arabicDescriptions = {

            vocabulary: "تعلّم كلمات عربية مفيدة في حياتك اليومية.",

            grammar: "ابنِ أساسًا قويًا في قواعد اللغة العربية.",

            speaking: "تدرّب على المحادثة باللغة العربية.",

            writing: "طوّر مهاراتك في الكتابة العربية.",

            reading: "اقرأ نصوصًا عربية مناسبة لمستواك.",

            listening: "درّب أذنك على فهم اللغة العربية.",

            expression: "تعلّم التعبيرات العربية واستخدمها بشكل طبيعي.",

            literature: "اكتشف الأدب العربي وطوّر فهمك للنصوص."

        };


        return arabicDescriptions[skill];

    }


    return descriptions[skill]?.[level]
        || descriptions[skill]?.beginner
        || "";

}


/* =========================================
   LEVEL
========================================= */

function translateLevel(level) {

    const levels = {

        beginner: "مبتدئ",

        intermediate: "متوسط",

        advanced: "متقدم"

    };


    return levels[level] || "مبتدئ";

}


function updateLevel() {

    userData.level =
        Math.floor(
            userData.xp / 500
        ) + 1;

}


/* =========================================
   LESSON COMPLETION
========================================= */

function completeLesson() {

    userData.xp += 50;

    updateLevel();

    saveUser();

    updateStats();

    showToast(
        language === "ar"
            ? "أحسنت! حصلت على +50 XP 🎉"
            : "Great job! You earned +50 XP 🎉"
    );

}


/* =========================================
   STATS
========================================= */

function updateStats() {

    const elements = {

        dashboardXP:
            userData.xp,

        dashboardStreak:
            userData.streak,

        dashboardLevel:
            userData.level,

        dashboardProgress:
            `${Math.min(
                100,
                userData.xp % 100
            )}%`,

        profileXP:
            userData.xp,

        profileLevel:
            userData.level,

        profileStreak:
            userData.streak,

        friendXP:
            `${userData.xp} XP`,

        friendStreak:
            userData.streak,

        sideStreak:
            userData.streak

    };


    Object.entries(elements)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.textContent =
                        value;

                }

            }
        );


    const progress =
        Math.min(
            100,
            userData.xp % 100
        );


    const bar =
        document.getElementById(
            "learnProgressBar"
        );


    const progressText =
        document.getElementById(
            "learnProgressText"
        );


    if (bar) {

        bar.style.width =
            `${progress}%`;

    }


    if (progressText) {

        progressText.textContent =
            language === "ar"
                ? `${progress}% مكتمل`
                : `${progress}% complete`;

    }

}


/* =========================================
   STREAK
========================================= */

function updateStreak() {

    const today =
        new Date().toDateString();


    const lastVisit =
        localStorage.getItem(
            "faseehLastVisit"
        );


    if (lastVisit !== today) {

        userData.streak++;

        localStorage.setItem(
            "faseehLastVisit",
            today
        );


        saveUser();

    }

}


/* =========================================
   PROFILE GOALS
========================================= */

function updateProfileGoals() {

    const container =
        document.getElementById(
            "profileGoals"
        );


    if (!container) return;


    container.innerHTML = "";


    userData.profile.skills
        .forEach(
            skill => {

                const lesson =
                    lessonData[skill];


                if (!lesson) return;


                const tag =
                    document.createElement(
                        "span"
                    );


                tag.textContent =
                    language === "ar"
                        ? lesson.ar
                        : lesson.en;


                container.appendChild(
                    tag
                );

            }
        );

}


/* =========================================
   PERSONALIZATION MESSAGE
========================================= */

function updatePersonalization() {

    const hero =
        document.getElementById(
            "heroDescription"
        );


    const dailyTitle =
        document.getElementById(
            "dailyTitle"
        );


    const dailyDescription =
        document.getElementById(
            "dailyDescription"
        );


    if (
        userData.profile.background ===
        "arab"
    ) {

        if (language === "ar") {

            hero.textContent =
                "تم تصميم هذا المسار بناءً على مستواك وأهدافك.";

            dailyTitle.textContent =
                "أكمل درسًا واحدًا اليوم";

            dailyDescription.textContent =
                "حافظ على تقدمك واحصل على 50 XP.";

        }

    } else {

        if (language === "en") {

            hero.textContent =
                "Your path is personalized to your Arabic level and goals.";

            dailyTitle.textContent =
                "Complete one lesson today";

            dailyDescription.textContent =
                "Keep learning and earn 50 XP.";

        }

    }

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================
   AI TUTOR PROTOTYPE
========================================= */

function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    const messages =
        document.getElementById(
            "messages"
        );


    if (!input || !messages) return;


    const text =
        input.value.trim();


    if (!text) return;


    /*
        For now this is a prototype.
        Real AI API can be connected later.
    */


    const userMessage =
        document.createElement(
            "div"
        );


    userMessage.className =
        "chat-message user";


    userMessage.innerHTML = `

        <span>YOU</span>

        <p>
            ${escapeHTML(text)}
        </p>

    `;


    messages.appendChild(
        userMessage
    );


    input.value = "";


    setTimeout(
        () => {

            const aiMessage =
                document.createElement(
                    "div"
                );


            aiMessage.className =
                "chat-message ai";


            aiMessage.innerHTML = `

                <span>ف</span>

                <p>
                    ${
                        language === "ar"
                            ? "رائع! يمكنني مساعدتك في تعلّم العربية. سيتم ربط فصيح بالذكاء الاصطناعي الحقيقي لاحقًا."
                            : "Great question! Faseeh can help you practice Arabic. The real AI tutor will be connected later."
                    }
                </p>

            `;


            messages.appendChild(
                aiMessage
            );


            messages.scrollTop =
                messages.scrollHeight;

        },
        500
    );

}


document
    .getElementById("sendMessage")
    ?.addEventListener(
        "click",
        sendMessage
    );


document
    .getElementById("messageInput")
    ?.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                sendMessage();

            }

        }
    );


/* QUICK PROMPTS */

document
    .querySelectorAll(
        "[data-prompt]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        "messageInput"
                    );


                if (!input) return;


                input.value =
                    button.dataset.prompt;


                input.focus();

            }
        );

    });


/* =========================================
   GAMES
========================================= */

document
    .querySelectorAll(
        "[data-game]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const game =
                    button.dataset.game;


                playGame(
                    game
                );

            }
        );

    });


function playGame(game) {

    const gameArea =
        document.getElementById(
            "gameArea"
        );


    if (!gameArea) return;


    gameArea.classList.remove(
        "hidden"
    );


    let question = "";


    if (game === "word") {

        question =
            language === "ar"
                ? "اختر معنى كلمة «كتاب»: 📖"
                : "What does «كتاب» mean? 📖";

    }


    if (game === "grammar") {

        question =
            language === "ar"
                ? "أي جملة صحيحة؟"
                : "Which sentence is correct?";

    }


    if (game === "listening") {

        question =
            language === "ar"
                ? "🎧 استمع واختر معنى «صباح الخير»."
                : "🎧 Choose the meaning of «صباح الخير».";

    }


    gameArea.innerHTML = `

        <h2>
            ${question}
        </h2>

        <button class="primary-button game-answer">
            ${
                language === "ar"
                    ? "الإجابة الصحيحة"
                    : "Correct Answer"
            }
        </button>

    `;


    gameArea
        .querySelector(".game-answer")
        .addEventListener(
            "click",
            () => {

                userData.xp += 25;

                updateLevel();

                saveUser();

                updateStats();


                showToast(
                    language === "ar"
                        ? "أحسنت! +25 XP 🎮"
                        : "Nice! +25 XP 🎮"
                );

            }
        );

}


/* =========================================
   PREMIUM / PLATINUM
========================================= */

document
    .querySelectorAll(
        ".plan-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const plan =
                    button.dataset.plan;


                choosePlan(
                    plan
                );

            }
        );

    });


function choosePlan(plan) {

    userData.plan =
        plan;


    saveUser();


    if (plan === "Premium") {

        showToast(
            language === "ar"
                ? "أساسية — 14.99 درهم شهريًا. الدفع سيتم ربطه لاحقًا."
                : "Premium — 14.99 AED/month. Payments will be connected later."
        );

    }


    if (plan === "Platinum") {

        showToast(
            language === "ar"
                ? "مميزة — 24.99 درهم شهريًا. الدفع سيتم ربطه لاحقًا."
                : "Platinum — 24.99 AED/month. Payments will be connected later."
        );

    }

}


/* =========================================
   PREMIUM FEATURE BUTTONS
========================================= */

document
    .querySelectorAll(
        "[data-plan-feature]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const requiredPlan =
                    button.dataset.planFeature;


                if (
                    requiredPlan === "premium" &&
                    (
                        userData.plan === "Premium" ||
                        userData.plan === "Platinum"
                    )
                ) {

                    showToast(
                        language === "ar"
                            ? "تم فتح Smart Review!"
                            : "Smart Review is unlocked!"
                    );

                    return;
                }


                showToast(
                    language === "ar"
                        ? "هذه الميزة متاحة في أساسية ومميزة."
                        : "This feature is available in Premium and Platinum."
                );

            }
        );

    });


/* =========================================
   SECURITY / HTML ESCAPE
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================
   SAVE
========================================= */

function saveUser() {

    localStorage.setItem(
        "faseehUser",
        JSON.stringify(
            userData
        )
    );

}


/* =========================================
   START APP
========================================= */

updateStreak();

updateLevel();


if (
    userData.surveyCompleted
) {

    document
        .getElementById("onboarding")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    /*
        Make sure Arab users
        are ALWAYS Arabic-only.
    */

    if (
        userData.profile.background ===
        "arab"
    ) {

        language = "ar";

        userData.language = "ar";

        saveUser();

    }


    updateText();

    updateLanguageButtons();

    updateStats();

    createLearningPath();

    updateProfileGoals();

    updatePersonalization();

    showPage("dashboard");

} else {

    showSurveyStep(1);

}