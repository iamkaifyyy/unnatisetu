# AI-Enabled Scholarship & Fellowship Management System
### Ministry of Tribal Affairs, Government of India

---

## System Overview & Key Capabilities

1. **Configurable Scheme Engine**:
   - Eligibility criteria, required document checklists, and scoring formulas are defined through a configuration interface and stored in `SchemeConfig`.
   - Adding or updating schemes such as NFST or NOS requires no code changes.

2. **AI Assistance with Human Oversight**:
   - **Document Intelligence OCR**: Scans uploaded certificates, extracts text fields, and highlights mismatches against applicant form data.
   - **Eligibility Engine**: Evaluates applicant data against active scheme criteria deterministically.
   - **Merit Scoring Engine**: Computes normalized applicant scores and generates ranked lists.
   - **Audited Human Decisiveness**: Any manual rank adjustment requires an officer to record a clear justification, which is logged to the audit system.

3. **Instant OCR Validation for Applicants**:
   - Highlights document quality issues, missing details, or mismatched data prior to final submission to minimize rework cycles.

4. **Audit Compliance**:
   - All major actions (submissions, officer reviews, deficiency notices, and rank adjustments) write to a central `AuditLog` for verification and transparency.

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts |
| Backend API | Node.js, Express, TypeScript, Socket.io |
| Database & ORM | SQLite / PostgreSQL via Prisma ORM |
| Document OCR | Tesseract.js & Field Matching Engine |
| PDF Generator | PDFKit (acknowledgment slips & selection letters) |
| Containerization | Docker Compose |

---

## Setup & Execution

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

## Demo Credentials & Role Switcher

The top navigation bar includes a role switcher with pre-configured accounts:

- **ST Applicant**: `amit.santhal@gmail.com` / `Password123!`
- **District Verification Officer**: `verifier.ranchi@mota.gov.in` / `Password123!`
- **State Nodal Officer (Jharkhand)**: `state.jharkhand@mota.gov.in` / `Password123!`
- **Ministry Super Admin**: `admin@mota.gov.in` / `Password123!`

---

## End-to-End Workflow

1. **Application Submission**: Log in as an ST Applicant, select a scheme, fill form fields, upload certificates for automated verification, review validation output, and submit.
2. **Verification Queue**: Switch to District Verifier, review form data alongside extracted OCR content, and either approve or raise a deficiency.
3. **Deficiency Resolution**: Switch back to ST Applicant to inspect deficiency remarks, re-upload documents, and resubmit.
4. **Merit Calculation**: Switch to Ministry Super Admin, compute scores, apply manual rank adjustments with recorded rationale, and finalize the list.
5. **Analytics & Audit**: Inspect pipeline status, turnaround times, rejection metrics, state distributions, and audit history.
