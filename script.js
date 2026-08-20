/* script.js */

/* ==========================================
   SUPABASE CONFIG
========================================== */

const SUPABASE_URL = "https://oamnqyghxftraydqxynt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbW5xeWdoeGZ0cmF5ZHF4eW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NzYxNTYsImV4cCI6MjA5NzM1MjE1Nn0.Q5eg9_XtAbmcJQMIBU2ZG7d6ghLnFE76J9aKcuDrux8";

const { createClient } = window.supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* ==========================================
   DOM
========================================== */

const $ = (id) => document.getElementById(id);


/* ==========================================
   THEME
========================================== */

const themes = [
    "light",
    "dark",
    "ocean",
    "lavender"
];

let currentTheme =
    localStorage.getItem("portfolio-theme") || "light";

document.documentElement.dataset.theme = currentTheme;

function updateThemeIcon() {

    const icon = $("themeIcon");

    if (!icon) return;

    const icons = {
        light: "☀",
        dark: "☾",
        ocean: "◉",
        lavender: "✦"
    };

    icon.textContent = icons[currentTheme] || "☀";
}

function changeTheme() {

    let index = themes.indexOf(currentTheme);

    index++;

    if (index >= themes.length) {
        index = 0;
    }

    currentTheme = themes[index];

    document.documentElement.dataset.theme = currentTheme;

    localStorage.setItem(
        "portfolio-theme",
        currentTheme
    );

    updateThemeIcon();

    updateThemeText();
}

function updateThemeText() {

    const content = {

        light: {
            status: "AVAILABLE TO BUILD",
            kicker: "HELLO, WORLD.",
            about:
                "Curious mind. Constant learner. Builder of things that make sense.",
            footer:
                "Designed & built with curiosity."
        },

        dark: {
            status: "SYSTEM ONLINE",
            kicker: "WELCOME TO MY SPACE.",
            about:
                "Ideas become systems when curiosity meets code.",
            footer:
                "Built somewhere between coffee & code."
        },

        ocean: {
            status: "EXPLORING DATA",
            kicker: "DIVE INTO MY WORK.",
            about:
                "Exploring data, technology and the stories hidden underneath.",
            footer:
                "Built with curiosity. Powered by data."
        },

        lavender: {
            status: "CREATIVE MODE ON",
            kicker: "NICE TO MEET YOU.",
            about:
                "A creative technologist who likes turning random ideas into real things.",
            footer:
                "Made with ideas, experiments & a little chaos."
        }

    };

    const selected =
        content[currentTheme] || content.light;

    if ($("statusText"))
        $("statusText").textContent = selected.status;

    if ($("heroKicker"))
        $("heroKicker").textContent = selected.kicker;

    if ($("aboutStatement"))
        $("aboutStatement").textContent = selected.about;

    if ($("footerMessage"))
        $("footerMessage").textContent = selected.footer;
}

$("themeBtn")?.addEventListener(
    "click",
    changeTheme
);

updateThemeIcon();


/* ==========================================
   CURSOR EFFECT
========================================== */

const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (event) => {

    if (!glow) return;

    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;

});


/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn = $("menuBtn");
const navLinks = $("navLinks");

menuBtn?.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});


/* ==========================================
   HELPERS
========================================== */

function clean(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    return String(value);
}

function safeUrl(url) {

    if (!url) return "#";

    return String(url).trim();

}

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ==========================================
   FETCH PORTFOLIO METADATA
========================================== */

async function loadPortfolio() {

    try {

        const { data, error } =
            await supabaseClient
                .from("portfolio_metadata")
                .select("*");

        if (error) throw error;

        const portfolio = data?.[0];

        if (!portfolio) {

            console.warn(
                "No portfolio_metadata record found."
            );

            return;

        }

        renderPortfolio(portfolio);

    } catch (error) {

        console.error(
            "Portfolio error:",
            error
        );

        if ($("heroName")) {
            $("heroName").textContent = "Your Name";
        }

    }

}


/* ==========================================
   RENDER PORTFOLIO
========================================== */

function renderPortfolio(data) {

    const name =
        data["Full_Name"] ||
        data["full_name"] ||
        "Your Name";

    const headline =
        data["HeadLine"] ||
        data["headline"] ||
        "AI & Analytics Enthusiast";

    const bio =
        data["Bio"] ||
        data["bio"] ||
        "Building useful things with technology.";

    const email =
        data["Professional E-Mail"] ||
        data["Professional_E-Mail"] ||
        data["Professional Email"] ||
        data["professional_email"] ||
        data["Personal E-Mail"] ||
        "";

    const linkedin =
        data["Linkedin"] ||
        data["LinkedIn"] ||
        data["linkedin"] ||
        "";

    const github =
        data["Github"] ||
        data["GitHub"] ||
        data["github"] ||
        "";

    const resume =
        data["Resume_Link"] ||
        data["resume_link"] ||
        "";

    const city =
        data["City"] ||
        data["city"] ||
        "";

    const hobbies =
        data["Hobbies"] ||
        data["hobbies"] ||
        "";

    $("heroName").textContent = name;

    $("terminalName").textContent =
        name.toLowerCase().replaceAll(" ", "_");

    $("heroHeadline").textContent = headline;

    $("heroBio").textContent = bio;

    $("aboutBio").textContent = bio;

    $("navName").textContent = name;

    $("footerName").textContent = name;

    if (resume) {

        $("resumeBtn").href =
            safeUrl(resume);

        $("resumeNavBtn").href =
            safeUrl(resume);

    } else {

        $("resumeBtn").style.display = "none";

        $("resumeNavBtn").style.display = "none";

    }

    renderMeta(
        city,
        email,
        hobbies,
        data
    );

    renderSocials(
        github,
        linkedin,
        email
    );

    setupContact(
        email,
        data
    );

}


/* ==========================================
   META
========================================== */

function renderMeta(
    city,
    email,
    hobbies,
    data
) {

    const items = [];

    if (city) {

        items.push({
            label: "Based in",
            value: city
        });

    }

    if (email) {

        items.push({
            label: "Email",
            value: email
        });

    }

    if (hobbies) {

        items.push({
            label: "Off-screen",
            value: hobbies
        });

    }

    if (data["Date Of Birth"]) {

        items.push({
            label: "Born",
            value: data["Date Of Birth"]
        });

    }

    $("metaRow").innerHTML =
        items.map(item => `

            <div class="meta-item">

                <span class="meta-label">
                    ${escapeHTML(item.label)}
                </span>

                <span class="meta-value">
                    ${escapeHTML(item.value)}
                </span>

            </div>

        `).join("");

}


/* ==========================================
   SOCIAL LINKS
========================================== */

function renderSocials(
    github,
    linkedin,
    email
) {

    const links = [];

    if (github) {

        links.push(`
            <a href="${safeUrl(github)}"
               target="_blank"
               rel="noopener">
               GITHUB ↗
            </a>
        `);

    }

    if (linkedin) {

        links.push(`
            <a href="${safeUrl(linkedin)}"
               target="_blank"
               rel="noopener">
               LINKEDIN ↗
            </a>
        `);

    }

    if (email) {

        links.push(`
            <a href="mailto:${escapeHTML(email)}">
               EMAIL ↗
            </a>
        `);

    }

    $("socialRow").innerHTML =
        links.join("");

    $("socialRowFooter").innerHTML =
        links.join("");

}


/* ==========================================
   EDUCATION
========================================== */

async function loadEducation() {

    try {

        const { data, error } =
            await supabaseClient
                .from("education")
                .select("*");

        if (error) throw error;

        renderEducation(data || []);

    } catch (error) {

        console.error(
            "Education error:",
            error
        );

        $("educationList").innerHTML = `
            <div class="loading-card">
                Unable to load education.
            </div>
        `;

    }

}

function renderEducation(rows) {

    if (!rows.length) {

        $("educationList").innerHTML = `
            <div class="loading-card">
                No education records found.
            </div>
        `;

        return;

    }

    $("educationList").innerHTML =
        rows.map((item, index) => {

            const course =
                item["Course_Title"] ||
                "Course";

            const year =
                item["Year_Of_Complet"] ||
                item["Year_Of_Completion"] ||
                "—";

            const institute =
                item["Institute_Name"] ||
                "Institute";

            const cgpa =
                item["CGPA/CPI/CGPI"] ||
                "—";

            const duration =
                item["Course_Duration"] ||
                "";

            const specialization =
                item["Specialization"] ||
                "";

            return `

                <article class="education-item">

                    <div class="edu-year">
                        ${escapeHTML(year)}
                    </div>

                    <div>

                        <div class="edu-title">
                            ${escapeHTML(course)}
                        </div>

                        <div class="edu-institute">
                            ${escapeHTML(institute)}
                        </div>

                    </div>

                    <div class="edu-side">

                        <div>
                            ${escapeHTML(cgpa)}
                        </div>

                        <div>
                            ${escapeHTML(duration)}
                        </div>

                        <div>
                            ${escapeHTML(specialization)}
                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


/* ==========================================
   PROJECTS
========================================== */

async function loadProjects() {

    try {

        const { data, error } =
            await supabaseClient
                .from("project")
                .select("*");

        if (error) throw error;

        renderProjects(data || []);

    } catch (error) {

        console.error(
            "Projects error:",
            error
        );

        $("projectsList").innerHTML = `
            <div class="loading-card">
                Unable to load projects.
            </div>
        `;

    }

}

function renderProjects(rows) {

    if (!rows.length) {

        $("projectsList").innerHTML = `
            <div class="loading-card">
                No projects found.
            </div>
        `;

        return;

    }

    $("projectsList").innerHTML =
        rows.map((item, index) => {

            const title =
                item["Project_Title"] ||
                "Untitled Project";

            const description =
                item["Description"] ||
                "A project built with technology and curiosity.";

            const year =
                item["Year_Of_Project"] ||
                "—";

            const skills =
                item["Skill_Tech"] ||
                "";

            const link =
                item["Project_Link"] ||
                "";

            const demo =
                item["Project_Drone_Ul"] ||
                "";

            const skillArray =
                String(skills)
                    .split(",")
                    .map(x => x.trim())
                    .filter(Boolean);

            return `

                <article class="project-card">

                    <span class="project-number">
                        PROJECT_${String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 class="project-title">
                        ${escapeHTML(title)}
                    </h3>

                    <p class="project-description">
                        ${escapeHTML(description)}
                    </p>

                    <div class="project-tech">

                        ${
                            skillArray.length
                                ? skillArray.map(skill => `
                                    <span>
                                        ${escapeHTML(skill)}
                                    </span>
                                `).join("")
                                : `
                                    <span>TECH</span>
                                `
                        }

                    </div>

                    <div class="project-footer">

                        <span class="project-year">
                            ${escapeHTML(year)}
                        </span>

                        ${
                            link
                                ? `
                                    <a
                                        class="project-link"
                                        href="${safeUrl(link)}"
                                        target="_blank"
                                        rel="noopener">
                                        VIEW PROJECT ↗
                                    </a>
                                `
                                : `
                                    <span class="project-link">
                                        BUILT ↗
                                    </span>
                                `
                        }

                    </div>

                </article>

            `;

        }).join("");

}


/* ==========================================
   CERTIFICATES
========================================== */

async function loadCertificates() {

    try {

        const { data, error } =
            await supabaseClient
                .from("certificate")
                .select("*");

        if (error) throw error;

        renderCertificates(data || []);

    } catch (error) {

        console.error(
            "Certificates error:",
            error
        );

        $("certificatesList").innerHTML = `
            <div class="loading-card">
                Unable to load certificates.
            </div>
        `;

    }

}

function renderCertificates(rows) {

    if (!rows.length) {

        $("certificatesList").innerHTML = `
            <div class="loading-card">
                No certificates found.
            </div>
        `;

        return;

    }

    $("certificatesList").innerHTML =
        rows.map((item, index) => {

            const name =
                item["Certificate_Name"] ||
                "Certificate";

            const org =
                item["Issuing_Organization"] ||
                "Organization";

            const date =
                item["Issue_Date"] ||
                "—";

            const link =
                item["Certificate_Link"] ||
                "";

            return `

                <article class="certificate-card">

                    <div>

                        <div class="cert-icon">
                            ✦
                        </div>

                        <h3 class="cert-name">
                            ${escapeHTML(name)}
                        </h3>

                        <p class="cert-org">
                            ${escapeHTML(org)}
                        </p>

                    </div>

                    <div class="cert-bottom">

                        <span class="cert-date">
                            ${escapeHTML(date)}
                        </span>

                        ${
                            link
                                ? `
                                    <a
                                        class="cert-link"
                                        href="${safeUrl(link)}"
                                        target="_blank"
                                        rel="noopener">
                                        VERIFY ↗
                                    </a>
                                `
                                : `
                                    <span class="cert-link">
                                        VERIFIED
                                    </span>
                                `
                        }

                    </div>

                </article>

            `;

        }).join("");

}


/* ==========================================
   CONTACT
========================================== */

function setupContact(email, data) {

    if (!email) {

        $("emailLink").style.display =
            "none";

    } else {

        $("emailLink").href =
            `mailto:${email}`;

    }

    const phone =
        data["Mobile Number"] ||
        data["Mobile_Number"] ||
        data["MobileNumber"] ||
        "";

    if (phone) {

        const cleanPhone =
            String(phone)
                .replace(/\D/g, "");

        $("whatsappBtn").href =
            `https://wa.me/${cleanPhone}`;

    } else {

        $("whatsappBtn").style.display =
            "none";

    }

}


/* ==========================================
   YEAR
========================================== */

$("year").textContent =
    new Date().getFullYear();


/* ==========================================
   START APP
========================================== */

async function initPortfolio() {

    updateThemeText();

    await Promise.all([
        loadPortfolio(),
        loadEducation(),
        loadProjects(),
        loadCertificates()
    ]);

}

document.addEventListener(
    "DOMContentLoaded",
    initPortfolio
);