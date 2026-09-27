# AI-Enabled Scholarship & Fellowship Management System
### Ministry of Tribal Affairs (India) — SIH 2026 Prototype

---

## 🏛️ Executive Pitch & SIH Differentiators

1. **Configurable, Not Hardcoded (Scheme-Agnostic Engine)**:
   - Eligibility rules, required document checklists, and scoring weightage formulas are **NOT hardcoded** in application logic.
   - They are defined through a **No-Code Builder UI** and saved as versioned records in `SchemeConfig`.
   - Scaling from **NFST** (National Fellowship for ST Students) to **NOS** (National Overseas Scholarship) or any future scheme is purely a configuration task.

2. **AI Assists, Humans Decide**:
   - The **Document Intelligence OCR Microservice** parses uploaded certificates, extracts fields, and flags mismatches (e.g., income mismatch or name spelling discrepancy).
   - The **Eligibility Rules Engine** evaluates applicant data deterministically (100% explainable, non-black-box).
   - The **Merit Scoring Engine** normalizes post-graduation marks and ranks candidates.
   - **Mandatory Human Oversight**: Any manual rank override by an officer requires a **mandatory justification logged to the audit trail** before final selection lock.

3. **Applicant-Side Instant OCR Feedback**:
   - Reduces rejection cycles by detecting blurriness, missing signatures, or field mismatches *before* final submission.

4. **Tamper-Proof Auditability**:
   - Every action (submission, officer scrutiny, deficiency notice, rank override) writes to a central `AuditLog` for RTI & CAG audit compliance.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend Portal | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts |
| Backend API | Node.js, Express, TypeScript, Socket.io |
| Database & ORM | SQLite / PostgreSQL via Prisma ORM |
| Document AI / OCR | Tesseract.js & Pattern Matching Microservice |
| PDF Engine | PDFKit (server-side acknowledgment slips & selection letters) |
| Containerization | Docker Compose |

---

## 🚀 Quick Setup & Run Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```
*Backend runs on `http://localhost:5001`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🔑 SIH Live Demo Credentials & Quick Switcher

The top navigation bar includes a **1-Click Live Demo Role Switcher**:

- 🎓 **ST Applicant**: `amit.santhal@gmail.com` / `Password123!`
- 🔍 **District Verification Officer**: `verifier.ranchi@mota.gov.in` / `Password123!`
- 🏛️ **State Nodal Officer (Jharkhand)**: `state.jharkhand@mota.gov.in` / `Password123!`
- 👑 **Ministry Super Admin**: `admin@mota.gov.in` / `Password123!`

---

## 📊 End-to-End Demo Flow for Judges

1. **Scheme Discovery & Application**: Log in as ST Applicant, select **NFST**, fill dynamic form, upload document for **OCR Scan**, view pre-check results, and submit.
2. **Officer Verification Queue**: Switch role to **District Verifier**, view side-by-side OCR diff, flag a deficiency notice or approve.
3. **Deficiency Resolution**: Switch back to **ST Applicant**, view active deficiency notice and countdown timer, re-upload document, and resubmit.
4. **Merit Scoring & Selection**: Switch role to **Ministry Super Admin**, calculate composite merit scores, test manual rank override with mandatory justification modal, and publish final selection list.
5. **Analytics & Audit Logs**: View live conversion funnels, SLA turnaround metrics, rejection breakdown charts, geographic heatmaps, and tamper-proof audit trails.
