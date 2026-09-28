import { Router, Request, Response } from 'express';
import { GeminiService } from '../services/geminiService.js';
import { prisma } from '../services/db.js';

const router = Router();

const SYSTEM_PROMPT = `You are the Official MoTA AI Portal Assistant for India's Ministry of Tribal Affairs (Single Window Scholarship & Fellowship Portal).
Key Knowledge:
1. 5 MoTA Schemes:
   - Pre-Matric (BPVGK): Classes IX-X, Family Income <= ₹2.5L/yr, Day Scholar ₹225/mo, Hosteller ₹525/mo.
   - Post-Matric (BVOBC): Class XI+ any recognized course, Family Income <= ₹2.5L/yr, Compulsory fees + maintenance stipend ₹230-1200/mo.
   - Top Class/National Scholarship (A023B): Premier institutes (IITs, AIIMS, IIMs, NITs), Income <= ₹6L/yr, Full tuition + living + books.
   - National Fellowship/NFST (ARG45): M.Phil/Ph.D, Merit-based, ₹25,000/mo (M.Phil) or ₹28,000/mo (Ph.D) + HRA/contingency.
   - National Overseas/NOS (AZKMI): PG/Ph.D/Post-Doc abroad, Income <= ₹6L/yr, Full tuition + GBP 9,900 / USD 15,400 per annum living allowance.
2. AI Advisory Features:
   - AI Document Verification checks for missing stamps/dates and figure consistency (strictly advisory, human oversight retained).
   - Plain-language eligibility explanations in English & Hindi.
   - Automated officer scrutiny SLA target: 7 working days.
3. Helpline: 1800-11-7788 (Toll Free).

Be helpful, polite, accurate, concise, and provide dual English/Hindi assistance when requested.`;

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6J-A2uh0414F-fHV-aTOKlyf_LcI0ppFHup-2l_BA_cOg';
    let reply = '';

    try {
      if (GEMINI_API_KEY) {
        const contents = [
          { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}` }] }
        ];

        const apiResp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
          }
        );

        if (apiResp.ok) {
          const data: any = await apiResp.json();
          reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      }
    } catch (err) {
      console.warn('[Assistant Chat Gemini API Fallback triggered]:', err);
    }

    // Fallback response generator if API fails
    if (!reply) {
      const lower = message.toLowerCase();
      if (lower.includes('income') || lower.includes('limit')) {
        reply = 'Family annual income caps for MoTA schemes: Pre-Matric (BPVGK) & Post-Matric (BVOBC) require income ≤ ₹2.5 Lakhs/year. Top Class (A023B), National Fellowship (ARG45), and Overseas (AZKMI) allow income up to ₹6.0 Lakhs/year.';
      } else if (lower.includes('document') || lower.includes('deficiency') || lower.includes('stamp')) {
        reply = 'If your document receives an AI advisory flag or deficiency notice, check if the certificate seal/stamp or issue date is clear. Re-upload a scanned copy via your Applicant Dashboard -> Track Status.';
      } else if (lower.includes('post-matric') || lower.includes('bvobc')) {
        reply = 'Post-Matric Scholarship (BVOBC) covers ST students in Class 11, 12, UG, PG, Ph.D, and Diplomas. Income limit is ₹2.5L/yr. Benefits cover compulsory non-refundable fees plus maintenance allowance.';
      } else if (lower.includes('helpline') || lower.includes('contact') || lower.includes('phone')) {
        reply = 'MoTA Student Helpdesk Toll-Free Number: 1800-11-7788 (Available 9:30 AM to 6:00 PM Mon-Fri) or email support@dbttribal.gov.in.';
      } else {
        reply = `Namaste! I am your MoTA AI Assistant. I can help you check scheme eligibility (Pre-Matric, Post-Matric, Higher Fellowship, Top Class, NOS), guide document re-uploads, explain deficiency notices, and track DBT sanction status. How may I assist you today?`;
      }
    }

    // Log AI Audit
    await GeminiService.logAiAudit('ASSISTANT_CHAT', message, reply);

    return res.json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
