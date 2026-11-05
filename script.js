// ==========================================================================
// Nepal Skills Hub — Core Application & Portfolio Engine
// ==========================================================================

const TRACK_DATA = {
  web: {
    id: "web",
    title: "Web Development",
    level: "Beginner",
    projectTitle: "Milestone Project: Build Your Personal Bio-Link Page",
    projectObjective: "Create a mobile-first, responsive profile page (like Linktree) using semantic HTML and CSS, then deploy it for free on GitHub Pages.",
    steps: [
      {
        id: "step_web_1",
        title: "Step 1: Semantic HTML Skeleton",
        instruction: "Create an index.html file with an avatar image, your name, a short bio, and three external link buttons.",
        codeSnippet: `<div class="profile-card">\n  <img src="avatar.jpg" alt="Profile avatar" />\n  <h1>Aayush Sharma</h1>\n  <p>Student & Builder from Kathmandu</p>\n  <a href="https://github.com" class="link-btn">GitHub</a>\n</div>`
      },
      {
        id: "step_web_2",
        title: "Step 2: Responsive Card Styling",
        instruction: "Use CSS Flexbox to center your card in the viewport and style the buttons with clean borders and hover effects.",
        codeSnippet: `body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  background: #0f172a;\n}`
      },
      {
        id: "step_web_3",
        title: "Step 3: Free Deployment",
        instruction: "Push your code to a public GitHub repository and activate GitHub Pages under Settings > Pages.",
        codeSnippet: `git init\ngit add .\ngit commit -m "feat: initial bio page"\ngit branch -M main`
      }
    ]
  },
  design: {
    id: "design",
    title: "Graphic Design",
    level: "Beginner",
    projectTitle: "Milestone Project: Brand Identity Starter Kit",
    projectObjective: "Design a logo mark, primary color palette, and typography pairing for a local Nepali business using Figma.",
    steps: [
      {
        id: "step_design_1",
        title: "Step 1: Moodboard & Color Palette",
        instruction: "Select 3 primary colors and 2 typography styles that convey trust and modern appeal.",
        codeSnippet: `Primary: #1E40AF (Deep Navy)\nAccent: #F59E0B (Amber)\nNeutral: #F8FAFC (Snow)`
      },
      {
        id: "step_design_2",
        title: "Step 2: Vector Logo Mark",
        instruction: "Create an icon that scales cleanly down to 16x16 px for favicons and up to billboards.",
        codeSnippet: `Export format: SVG & High-Res PNG (300 DPI)`
      }
    ]
  },
  video: {
    id: "video",
    title: "Video Editing",
    level: "Beginner",
    projectTitle: "Milestone Project: 60-Second Explainer Reel",
    projectObjective: "Edit an engaging short-form vertical video (9:16) with hook pacing, animated captions, and audio normalization using CapCut or DaVinci Resolve.",
    steps: [
      {
        id: "step_video_1",
        title: "Step 1: The 3-Second Hook",
        instruction: "Cut dead air instantly. Add visual or text movement in the first 2 seconds to retain viewer retention.",
        codeSnippet: `Aspect Ratio: 1080x1920 (9:16)\nFrame Rate: 30fps or 60fps`
      },
      {
        id: "step_video_2",
        title: "Step 2: Clean Subtitles & Sound Design",
        instruction: "Add readable center-aligned captions and mix background music down to -18dB relative to vocal track at -3dB.",
        codeSnippet: `Voiceover: -3dB to -6dB\nBGM: -18dB to -24dB`
      }
    ]
  },
  marketing: {
    id: "marketing",
    title: "Digital Marketing",
    level: "Beginner",
    projectTitle: "Milestone Project: Organic Launch Strategy",
    projectObjective: "Design an organic social campaign breakdown and copy brief that attracts 100 beta signups for a student project.",
    steps: [
      {
        id: "step_marketing_1",
        title: "Step 1: Value Proposition & Hooks",
        instruction: "Draft 5 clear hooks highlighting why someone should care about your product in one sentence.",
        codeSnippet: `Formula: [Action] without [Common Pain Point] in [Timeframe]`
      },
      {
        id: "step_marketing_2",
        title: "Step 2: Community Distribution Plan",
        instruction: "Map out 3 communities (Reddit, Discord, Facebook groups) where your target users discuss daily problems.",
        codeSnippet: `Focus: Give 80% free value before asking for signups.`
      }
    ]
  }
};

let currentActiveTrackKey = null;

// ==========================================================================
// Local Storage Helpers
// ==========================================================================

function getCompletedSteps() {
  const stored = localStorage.getItem("nsh_completed_steps");
  return stored ? JSON.parse(stored) : [];
}

function toggleStepCompletion(stepId) {
  let completed = getCompletedSteps();
  if (completed.includes(stepId)) {
    completed = completed.filter(id => id !== stepId);
  } else {
    completed.push(stepId);
  }
  localStorage.setItem("nsh_completed_steps", JSON.stringify(completed));
  updateStatsCounter();
}

function getSubmittedProjects() {
  const stored = localStorage.getItem("nsh_portfolio_projects");
  return stored ? JSON.parse(stored) : [];
}

function saveProject(project) {
  const projects = getSubmittedProjects();
  // If already submitted for this track, replace it; otherwise add
  const existingIndex = projects.findIndex(p => p.trackId === project.trackId);
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem("nsh_portfolio_projects", JSON.stringify(projects));
  renderPortfolio();
  updateStatsCounter();
}

function updateStatsCounter() {
  const completed = getCompletedSteps();
  const projects = getSubmittedProjects();
  
  const stepStat = document.querySelector(".hero-stats .stat-item:nth-child(3) .stat-number");
  if (stepStat) {
    stepStat.textContent = `${completed.length} Steps`;
  }

  const projectStat = document.querySelector(".hero-stats .stat-item:nth-child(1) .stat-number");
  if (projectStat && projects.length > 0) {
    projectStat.textContent = `${projects.length} Built`;
  }
}

// ==========================================================================
// Modal Management & Form Handling
// ==========================================================================

function createModalDOM() {
  if (document.getElementById("trackModal")) return;

  const modalHtml = `
    <div id="trackModal" class="modal-backdrop">
      <div class="modal-dialog">
        <header class="modal-header">
          <div>
            <span id="modalTrackBadge" class="badge">Track Details</span>
            <h2 id="modalTrackTitle" class="modal-title"></h2>
          </div>
          <button id="modalCloseBtn" class="close-btn" aria-label="Close modal">&times;</button>
        </header>

        <div class="modal-body">
          <div class="project-brief-box">
            <h3 id="modalProjectTitle" class="project-title"></h3>
            <p id="modalProjectObjective" class="project-objective"></p>
          </div>

          <h4 class="steps-heading">Action Steps & Code</h4>
          <div id="modalStepsList" class="steps-list"></div>

          <!-- Project Submission Form -->
          <div class="submission-box">
            <h4 class="submission-title">Submit Finished Project</h4>
            <p class="submission-desc">Done with the steps? Add your live link or repo to feature it in your personal portfolio.</p>
            <form id="projectSubmitForm" class="submission-form">
              <div class="form-group">
                <label class="form-label" for="projLiveUrl">Live Demo URL (or Figma / Video link)</label>
                <input class="form-input" type="url" id="projLiveUrl" placeholder="https://yourname.github.io/bio-link" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="projRepoUrl">GitHub / Source File URL (Optional)</label>
                <input class="form-input" type="url" id="projRepoUrl" placeholder="https://github.com/yourname/bio-link" />
              </div>

              <div class="form-group">
                <label class="form-label" for="projNotes">What did you learn? (Brief reflection)</label>
                <textarea class="form-textarea" id="projNotes" placeholder="Built a clean layout using CSS flexbox and deployed to GitHub Pages." required></textarea>
              </div>

              <button type="submit" class="btn btn-primary">Save to Portfolio</button>
              <div id="submissionSuccessMsg" class="submission-status-msg">Project successfully saved to your portfolio below!</div>
            </form>
          </div>
        </div>

        <footer class="modal-footer">
          <span class="modal-footer-note">Progress & projects save automatically to your browser.</span>
          <button id="modalDoneBtn" class="btn btn-secondary">Close</button>
        </footer>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Wire static buttons
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("modalDoneBtn").addEventListener("click", closeModal);
  document.getElementById("trackModal").addEventListener("click", (e) => {
    if (e.target.id === "trackModal") closeModal();
  });

  // Wire project submission form
  document.getElementById("projectSubmitForm").addEventListener("submit", handleProjectSubmit);
}

function openTrackModal(trackKey) {
  const data = TRACK_DATA[trackKey];
  if (!data) return;

  currentActiveTrackKey = trackKey;
  createModalDOM();

  const modal = document.getElementById("trackModal");
  document.getElementById("modalTrackBadge").textContent = `${data.level} Track`;
  document.getElementById("modalTrackTitle").textContent = data.title;
  document.getElementById("modalProjectTitle").textContent = data.projectTitle;
  document.getElementById("modalProjectObjective").textContent = data.projectObjective;

  // Clear previous form states
  const successMsg = document.getElementById("submissionSuccessMsg");
  successMsg.classList.remove("success");
  
  // Pre-fill existing submission if already done
  const existingProjects = getSubmittedProjects();
  const existing = existingProjects.find(p => p.trackId === data.id);
  if (existing) {
    document.getElementById("projLiveUrl").value = existing.liveUrl || "";
    document.getElementById("projRepoUrl").value = existing.repoUrl || "";
    document.getElementById("projNotes").value = existing.notes || "";
  } else {
    document.getElementById("projectSubmitForm").reset();
  }

  // Populate steps
  const stepsList = document.getElementById("modalStepsList");
  const completed = getCompletedSteps();

  stepsList.innerHTML = data.steps.map(step => {
    const isDone = completed.includes(step.id);
    return `
      <div class="step-card ${isDone ? 'completed' : ''}" data-step-id="${step.id}">
        <div class="step-header">
          <label class="step-checkbox-label">
            <input type="checkbox" class="step-checkbox" ${isDone ? 'checked' : ''} />
            <strong>${escapeHTML(step.title)}</strong>
          </label>
        </div>
        <p class="step-instruction">${escapeHTML(step.instruction)}</p>
        <pre class="step-code"><code>${escapeHTML(step.codeSnippet)}</code></pre>
      </div>
    `;
  }).join("");

  // Attach step toggle handlers
  stepsList.querySelectorAll(".step-checkbox").forEach(input => {
    input.addEventListener("change", (e) => {
      const card = e.target.closest(".step-card");
      const stepId = card.getAttribute("data-step-id");
      toggleStepCompletion(stepId);
      card.classList.toggle("completed", e.target.checked);
    });
  });

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("trackModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function handleProjectSubmit(e) {
  e.preventDefault();
  if (!currentActiveTrackKey) return;

  const track = TRACK_DATA[currentActiveTrackKey];
  const liveUrl = document.getElementById("projLiveUrl").value.trim();
  const repoUrl = document.getElementById("projRepoUrl").value.trim();
  const notes = document.getElementById("projNotes").value.trim();

  const projectRecord = {
    trackId: track.id,
    trackTitle: track.title,
    projectTitle: track.projectTitle,
    liveUrl,
    repoUrl,
    notes,
    submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  };

  saveProject(projectRecord);

  const successMsg = document.getElementById("submissionSuccessMsg");
  successMsg.classList.add("success");

  setTimeout(() => {
    closeModal();
    // Smooth scroll down to portfolio
    const portfolioElem = document.getElementById("portfolio");
    if (portfolioElem) {
      portfolioElem.scrollIntoView({ behavior: "smooth" });
    }
  }, 900);
}

// ==========================================================================
// Portfolio Rendering
// ==========================================================================

function renderPortfolio() {
  const grid = document.getElementById("portfolioGrid");
  const emptyState = document.getElementById("portfolioEmpty");
  if (!grid || !emptyState) return;

  const projects = getSubmittedProjects();

  if (projects.length === 0) {
    emptyState.style.display = "block";
    grid.innerHTML = "";
    grid.appendChild(emptyState);
    return;
  }

  emptyState.style.display = "none";
  grid.innerHTML = projects.map(proj => `
    <article class="portfolio-card">
      <div class="portfolio-card-header">
        <span class="portfolio-track-badge">${escapeHTML(proj.trackTitle)}</span>
        <span class="portfolio-date">${escapeHTML(proj.submittedAt)}</span>
      </div>
      <h3 class="portfolio-card-title">${escapeHTML(proj.projectTitle)}</h3>
      <p class="portfolio-card-notes">${escapeHTML(proj.notes)}</p>
      <div class="portfolio-card-links">
        <a href="${escapeHTML(proj.liveUrl)}" target="_blank" rel="noopener noreferrer" class="portfolio-link-btn portfolio-link-live">
          View Demo &rarr;
        </a>
        ${proj.repoUrl ? `
          <a href="${escapeHTML(proj.repoUrl)}" target="_blank" rel="noopener noreferrer" class="portfolio-link-btn portfolio-link-repo">
            Code / Source
          </a>
        ` : ''}
      </div>
    </article>
  `).join("");
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================================================
// App Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".skill-card");
  const trackKeys = ["web", "design", "video", "marketing"];

  cards.forEach((card, index) => {
    const key = trackKeys[index];
    card.addEventListener("click", () => openTrackModal(key));
    const link = card.querySelector(".card-action");
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        openTrackModal(key);
      });
    }
  });

  renderPortfolio();
  updateStatsCounter();
});