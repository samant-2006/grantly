# GRANTLY — Unified Scholarship Discovery & Management Platform

> **THE OUTPOST | Frontend Arena | Six-Hour Individual Hackathon**  
> **"Your Future, Funded."**  
> *Discover scholarships that fit your profile. Understand your opportunities. Track every application. Stay ahead of every deadline.*

---

## 📌 Executive Summary & Problem Statement Alignment

Accessing educational financial assistance has historically been a fragmented, intimidating journey. Students are forced to juggle disconnected portals, struggle to interpret complex eligibility jargon, lose track of shifting deadlines, and maintain scattered spreadsheets.

**GRANTLY** is a unified, student-first frontend application designed to eliminate friction across the entire scholarship lifecycle:

$$\text{DISCOVER} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{MATCH} \longrightarrow \text{SAVE} \longrightarrow \text{PREPARE} \longrightarrow \text{APPLY} \longrightarrow \text{TRACK}$$

GRANTLY replaces generic directory listings and empty dashboards with an **active personal scholarship command center** combining transparent eligibility scoring, document preparation tracking, deadline countdowns, and portfolio financial analytics.

---

## 🚀 Key Feature Modules

### 1. Unified Dashboard
- **Welcome & Profile Meter:** Displays personalized greeting and real-time profile completion progress.
- **Key Pipeline Metrics:** Saved opportunities count, active applications in progress, upcoming deadlines within 7 days, and potential pipeline funding.
- **Urgent Action Reminders:** Highlights scholarships due soonest with color-coded days-remaining badges.
- **Recommended Opportunities:** Top scholarship suggestions computed dynamically via the transparent matching algorithm.

### 2. Multi-Dimensional Discovery Catalog
- **Instant Full-Text Search:** Query across scholarship titles, providers, descriptions, and categories.
- **Faceted Filtering:**
  - *Education Level:* Undergraduate, Postgraduate, Doctoral, Diploma.
  - *Field of Study:* Computer Science, Engineering, Medicine, Business, Law, Science, Arts & Humanities, etc.
  - *Scholarship Category:* Merit-Based, Need-Based, Research, STEM, Women in Tech, International, Government, Institutional.
  - *Funding Tiers:* Under \$10k, \$10k–\$20k, Over \$20k.
  - *Deadline Horizons:* Within 30 days, within 90 days, within 6 months.
- **Smart Sorting:** Sort by Relevance (match score), Deadline (soonest first), or Funding Amount (highest first).
- **Responsive Scholarship Cards:** Displays verified funding, deadline tags, category pills, match score badges, and one-click save / details actions.

### 3. Transparent Eligibility Matching Engine
Unlike arbitrary percentage generators, GRANTLY features an **explainable rule-based matching engine**:
- **Education Level Check:** Confirms student level against eligible degrees.
- **Field of Study Match:** Validates major/discipline alignment.
- **Academic Score Threshold:** Compares normalized GPA percentage against minimum requirements.
- **Financial Need Assessment:** Assesses self-declared need level for need-based grants.
- **Diagnostic Breakdown:** Clearly enumerates *Matched Criteria*, *Unmatched Criteria*, *Missing Information*, and *Manual Review Requirements* with educational disclaimers.

### 4. Interactive Application Tracker
- **Kanban-Style Status Lifecycle:** Advance applications through standard stages:
  $$\text{Saved} \rightarrow \text{Preparing} \rightarrow \text{Ready to Apply} \rightarrow \text{Submitted} \rightarrow \text{Awarded} \ / \ \text{Rejected} \ / \ \text{Withdrawn}$$
- **Document Preparation Checklist:** Dynamic, per-application required document checklist (e.g., transcripts, recommendation letters, personal essays) with real-time completion progress meters.
- **Private Notes:** Attached private notes per application for essay drafts, external portal links, and reference notes.
- **Submission Transparency:** Explicitly reminds students that recording a "Submitted" status updates personal tracking and does not submit external documents.

### 5. Deadlines Timeline
- **Categorized Deadlines:** Automatically partitions active opportunities into *Overdue*, *Urgent (Due within 7 Days)*, *Due within 30 Days*, and *Upcoming*.
- **Days-Left Countdown Badges:** Prominent color-coded badges (Green $\rightarrow$ Yellow $\rightarrow$ Amber $\rightarrow$ Red) so students never miss a critical submission window.

### 6. Portfolio Funding & Pipeline Analytics
- **Recharts-Powered Visualizations:**
  - *Applications by Status:* Donut / Pie distribution across all pipeline phases.
  - *Funding Comparison:* Clear, explicit bar chart separating **Potential Pipeline Funding** from **Confirmed Awarded Funding**.
  - *Document Preparation Readiness:* Stacked bar visualization tracking prepared vs pending documents across top applications.

### 7. Student Profile & Sample Profile Loader
- Comprehensive profile capturing degree, major, institution, graduation year, normalized GPA score, financial need level, and thematic interest tags.
- Includes a one-click **"Load Sample Profile"** button for quick demonstration and evaluation during hackathon judging.
- Fully persisted in `localStorage` with reactive updates across all components.

---

## 🎨 Visual Design Direction & Design System

GRANTLY adopts a modern, premium fintech aesthetic prioritizing trust, clarity, and readability:
- **Deep Navy (`#101827` / `#172033`):** High-contrast primary text, brand badges, and primary action controls.
- **Fresh Lime Accent (`#D7F8A7` / `#6BBF47`):** Active navigation tabs, match badges, and positive progress indicators.
- **Warm Off-White (`#F7F8F5`):** Soft, non-glare background surface.
- **Clean Card Surfaces (`#FFFFFF`):** Bordered with `#E5E9E5` and subtle shadows for clear visual hierarchy.
- **Semantic Feedback:** Emerald (`#237A55`) for success, Amber (`#B7791F`) for warnings, Rose (`#B42318`) for alerts.
- **Accessible & Responsive:** Fluid flex/grid layouts tailored for desktop, tablet, and mobile screens with touch-friendly targets and keyboard focus rings.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core reactive component UI library |
| **TypeScript** | Strict compile-time typing for models, actions, and states |
| **Vite 8** | Modern, ultra-fast build tooling and bundling |
| **Tailwind CSS v4** | Modern utility-first styling system |
| **Lucide React** | Consistent, clean SVG iconography system |
| **Framer Motion** | Restrained, smooth page and card transitions |
| **Recharts** | Responsive SVG charts for portfolio analytics |
| **React Router v7** | Client-side routing with clean URL synchronization |
| **React Hot Toast** | Lightweight accessible in-app feedback toasts |
| **LocalStorage** | Reliable zero-config client-side persistence |

---

## 💻 Local Development & Build Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

```bash
# 1. Clone repository or navigate to workspace
cd GRANTLY

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# -> Opens on http://localhost:5173

# 4. Production build
npm run build

# 5. Preview production build locally
npm run preview
# -> Opens preview server on http://localhost:4173
```

---

## 📋 Evaluation Criteria Verification

| Evaluation Category | Implementation Verification |
| :--- | :--- |
| **1. UI/UX Design & Visual Quality** | Coherent fintech-inspired design language, custom Plus Jakarta Sans typography, lime accents, accessible contrast, responsive sidebar & mobile navigation drawer. |
| **2. Functionality** | End-to-end working flows: multi-filter search, transparent matching breakdown, checklist toggles, Kanban status changes, private notes, and profile sync. |
| **3. Creativity & Innovation** | Transparent rule-based match diagnostic with missing-info prompts; dynamic auto-generated document checklist per scholarship; explicit distinction between potential vs awarded funds. |
| **4. Problem Statement Alignment** | Fully addresses the entire student journey from initial discovery to active tracking and deadline vigilance. |
| **5. Code Quality & Architecture** | Modular directory layout (`components`, `pages`, `store`, `types`, `lib`), centralized reducer pattern, strict TypeScript interfaces, 100% clean production build. |
| **6. Responsiveness & Accessibility** | Responsive breakpoints (`sm`, `md`, `lg`), accessible ARIA attributes, semantic landmarks (`<aside>`, `<header>`, `<main>`), and keyboard focus rings. |

---

## 📄 License & Attribution

Developed for **THE OUTPOST | Frontend Arena** hackathon. All rights reserved.
