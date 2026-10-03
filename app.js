/* =========================
   FASEEH APP
========================= */

let language = localStorage.getItem("faseehLanguage") || "en";

let userData = JSON.parse(
    localStorage.getItem("faseehUser")
) || {
    xp: 0,
    streak: 0,
    level: 1,
    plan: "Basic",
    surveyCompleted: false,
    profile: {
        background: "",
        education: "",
        level: "",
        skills: []
    }
};


/* =========================
   LANGUAGE
========================= */

function toggleLanguage() {

    language = language === "en" ? "ar" : "en";

    localStorage.setItem(
        "faseehLanguage",
        language
    );

    updateLanguage();
}


function updateLanguage() {

    document.documentElement.lang = language;

    document.body.classList.toggle(
        "rtl",
        language === "ar"
    );

    document.querySelectorAll("[data-en]").forEach(element => {

        element.textContent =
            language === "ar"
                ? element.getAttribute("data-ar")
                : element.getAttribute("data-en");

    });


    const languageButton =
        document.querySelector(".language-btn");

    languageButton.textContent =
        language === "ar"
            ? "English"
            : "العربية";
}


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {

    document.querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });

    const page =
        document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   SURVEY
========================= */

document
    .getElementById("surveyForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const background =
            document.querySelector(
                'input[name="background"]:checked'
            )?.value;

        const education =
            document.querySelector(
                'input[name="education"]:checked'
            )?.value;

        const level =
            document.querySelector(
                'input[name="level"]:checked'
            )?.value;

        const skills =
            Array.from(
                document.querySelectorAll(
                    'input[name="skill"]:checked'
                )
            ).map(input => input.value);


        if (!background || !education || !level) {

            alert(
                language === "ar"
                    ? "يرجى الإجابة عن جميع الأسئلة."
                    : "Please answer all required questions."
            );

            return;
        }


        userData.profile = {
            background,
            education,
            level,
            skills
        };

        userData.surveyCompleted = true;

        saveUser();

        createLearningPath();

        showPage("learn");

        alert(
            language === "ar"
                ? "تم إنشاء مسارك التعليمي!"
                : "Your learning path has been created!"
        );
    });


/* =========================
   LEARNING PATH
========================= */

function createLearningPath() {

    const container =
        document.getElementById("learningPath");

    const level =
        userData.profile.level || "beginner";

    const skills =
        userData.profile.skills.length
            ? userData.profile.skills
            : ["vocabulary", "grammar", "reading"];


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


    container.innerHTML = "";


    skills.forEach((skill, index) => {

        const lesson =
            lessonData[skill];

        if (!lesson) return;


        const card =
            document.createElement("div");

        card.className = "lesson";


        card.innerHTML = `

            <div class="lesson-top">
                ${lesson.icon}
            </div>

            <div class="lesson-content">

                <h2>
                    ${language === "ar"
                        ? lesson.ar
                        : lesson.en}
                </h2>

                <p>
                    ${
                        language === "ar"
                        ? `الدرس ${index + 1} مناسب لمستواك الحالي.`
                        : `Lesson ${index + 1} designed for your level.`
                    }
                </p>

                <button
                    class="primary-btn"
                    onclick="completeLesson()">

                    ${
                        language === "ar"
                        ? "ابدأ الدرس"
                        : "Start Lesson"
                    }

                </button>

            </div>
        `;


        container.appendChild(card);

    });


    const description =
        document.getElementById(
            "learningDescription"
        );


    description.textContent =
        language === "ar"
            ? `مستواك: ${translateLevel(level)}`
            : `Your level: ${level}`;
}


function translateLevel(level) {

    const levels = {

        beginner: "مبتدئ",

        intermediate: "متوسط",

        advanced: "متقدم"

    };

    return levels[level] || "مبتدئ";
}


/* =========================
   XP SYSTEM
========================= */

function completeLesson() {

    userData.xp += 50;

    updateLevel();

    saveUser();

    updateStats();


    alert(
        language === "ar"
            ? "أحسنت! حصلت على +50 XP 🎉"
            : "Great job! You earned +50 XP 🎉"
    );
}


function updateLevel() {

    userData.level =
        Math.floor(userData.xp / 500) + 1;
}


/* =========================
   STREAK
========================= */

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


/* =========================
   STATS
========================= */

function updateStats() {

    document.getElementById(
        "heroXP"
    ).textContent = userData.xp;


    document.getElementById(
        "heroLevel"
    ).textContent = userData.level;


    document.getElementById(
        "heroStreak"
    ).textContent = userData.streak;


    document.getElementById(
        "profileXP"
    ).textContent = userData.xp;


    document.getElementById(
        "profileLevel"
    ).textContent = userData.level;


    document.getElementById(
        "profileStreak"
    ).textContent = userData.streak;
}


/* =========================
   AI TUTOR PROTOTYPE
========================= */

function openTutor() {

    showPage("tutor");
}


function sendMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );

    const text =
        input.value.trim();


    if (!text) return;


    const chat =
        document.getElementById(
            "chatBox"
        );


    const userMessage =
        document.createElement("div");

    userMessage.className =
        "message user-message";

    userMessage.textContent =
        text;


    chat.appendChild(
        userMessage
    );


    input.value = "";


    setTimeout(() => {

        const aiMessage =
            document.createElement("div");

        aiMessage.className =
            "message ai-message";


        aiMessage.innerHTML =
            language === "ar"
                ? "<strong>فصيح:</strong> رائع! يمكنني مساعدتك في تعلّم العربية. سيتم ربط هذا القسم بالذكاء الاصطناعي الحقيقي لاحقاً."
                : "<strong>Faseeh:</strong> Great! I can help you learn Arabic. The real AI system will be connected here later.";


        chat.appendChild(
            aiMessage
        );


        chat.scrollTop =
            chat.scrollHeight;

    }, 600);
}


/* =========================
   GAMES
========================= */

function playGame() {

    userData.xp += 25;

    updateLevel();

    saveUser();

    updateStats();


    alert(
        language === "ar"
            ? "أحسنت! حصلت على +25 XP 🎮"
            : "Nice! You earned +25 XP 🎮"
    );
}


/* =========================
   PLANS
========================= */

function choosePlan(plan) {

    userData.plan = plan;

    saveUser();


    alert(
        language === "ar"
            ? `تم اختيار خطة ${plan}. سيتم ربط الدفع لاحقاً.`
            : `${plan} plan selected. Payments will be connected later.`
    );
}


/* =========================
   STORAGE
========================= */

function saveUser() {

    localStorage.setItem(
        "faseehUser",
        JSON.stringify(userData)
    );
}


/* =========================
   START APP
========================= */

updateStreak();

updateStats();

updateLanguage();


if (userData.surveyCompleted) {

    createLearningPath();

}