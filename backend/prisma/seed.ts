import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[MoTA Seed] Clearing existing database records...');
  await prisma.auditLog.deleteMany();
  await prisma.meritEntry.deleteMany();
  await prisma.deficiencyNotice.deleteMany();
  await prisma.document.deleteMany();
  await prisma.application.deleteMany();
  await prisma.schemeConfig.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  console.log('[MoTA Seed] Creating Administrative & Officer users...');

  // Ministry Super Admin
  const ministryAdmin = await prisma.user.create({
    data: {
      email: 'admin@mota.gov.in',
      password: hashedPassword,
      fullName: 'Dr. Rameshwar Munda (IAS)',
      role: 'MINISTRY_ADMIN',
      state: 'New Delhi',
      phone: '+91 98765 43210',
      category: 'ST',
    },
  });

  // State Nodal Officer (Jharkhand)
  const stateAdmin = await prisma.user.create({
    data: {
      email: 'state.jharkhand@mota.gov.in',
      password: hashedPassword,
      fullName: 'Sunita Oraon (Nodal Officer)',
      role: 'STATE_ADMIN',
      state: 'Jharkhand',
      district: 'Ranchi',
      phone: '+91 98123 45678',
      category: 'ST',
    },
  });

  // District Verification Officer
  const verifier = await prisma.user.create({
    data: {
      email: 'verifier.ranchi@mota.gov.in',
      password: hashedPassword,
      fullName: 'Anil Kumar Hansda (Scrutiny Officer)',
      role: 'VERIFIER',
      state: 'Jharkhand',
      district: 'Ranchi',
      phone: '+91 97654 32109',
      category: 'ST',
    },
  });

  console.log('[MoTA Seed] Seeding 5 Official Schemes directly from dbttribal.gov.in & tribal.nic.in...');

  // Scheme 1: Pre-Matric (BPVGK)
  const preMatricScheme = await prisma.scheme.create({
    data: {
      code: 'BPVGK',
      name: 'Pre-Matric Scholarship Scheme For ST Student',
      description: 'Centrally Sponsored Scheme providing financial support to ST students studying in Classes IX and X to minimize dropout rates and foster secondary education. Benefit Type: In Cash.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-01'),
      applicationWindowEnd: new Date('2026-12-31'),
      isActive: true,
      budgetAllocation: 120000000.0, // 12 Crore INR
      budgetUtilized: 45000000.0,
      totalSeats: 15000,
    },
  });

  // Scheme 2: Post-Matric (BVOBC)
  const postMatricScheme = await prisma.scheme.create({
    data: {
      code: 'BVOBC',
      name: 'Post-Matric Scholarship Scheme For ST Students',
      description: 'Centrally Sponsored Scheme to provide financial assistance to ST students studying at post-secondary / post-matriculation stage (Classes XI, XII, UG, PG, Diploma). Benefit Type: In Cash.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-01'),
      applicationWindowEnd: new Date('2026-12-31'),
      isActive: true,
      budgetAllocation: 250000000.0, // 25 Crore INR
      budgetUtilized: 110000000.0,
      totalSeats: 25000,
    },
  });

  // Scheme 3: Top Class Education (A023B)
  const topClassScheme = await prisma.scheme.create({
    data: {
      code: 'A023B',
      name: 'Top Class Education For ST Students',
      description: 'Central Sector Scheme providing full tuition fee reimbursement and living expenses for meritorious ST students admitted to premier notified institutes (IITs, IIMs, NITs, AIIMS, NIFTs, NLUs). Benefit Type: In Cash.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-10'),
      applicationWindowEnd: new Date('2026-11-30'),
      isActive: true,
      budgetAllocation: 60000000.0, // 6 Crore INR
      budgetUtilized: 25000000.0,
      totalSeats: 1000,
    },
  });

  // Scheme 4: National Fellowship (ARG45)
  const nfstScheme = await prisma.scheme.create({
    data: {
      code: 'ARG45',
      name: 'National Fellowship for ST Students',
      description: 'Central Sector Scheme providing financial assistance/fellowship to Scheduled Tribe students for pursuing M.Phil / Ph.D in Humanities, Sciences, and Engineering at premier Indian Universities. Benefit Type: In Cash.',
      portalType: 'FELLOWSHIP',
      applicationWindowStart: new Date('2026-01-01'),
      applicationWindowEnd: new Date('2026-12-31'),
      isActive: true,
      budgetAllocation: 55000000.0, // 5.5 Crore INR
      budgetUtilized: 21000000.0,
      totalSeats: 750,
    },
  });

  // Scheme 5: National Overseas Scholarship Scheme (AZKMI)
  const nosScheme = await prisma.scheme.create({
    data: {
      code: 'AZKMI',
      name: 'National Overseas Scholarship Scheme',
      description: 'Central Sector Scheme providing financial support for selected ST students pursuing Master Degree, Ph.D, and Post-Doctoral research in top 500 foreign universities abroad. Benefit Type: In Others.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: new Date('2026-01-15'),
      applicationWindowEnd: new Date('2026-11-30'),
      isActive: true,
      budgetAllocation: 80000000.0, // 8 Crore INR
      budgetUtilized: 34000000.0,
      totalSeats: 120,
    },
  });

  // Dynamic Rules & Configs for Schemes
  const tieBreakers = ['lower_family_income', 'older_age', 'earlier_submission_time'];
  const scoringWeightage = {
    academicMarksWeight: 50, // 50%
    incomeWeight: 30,        // 30% inverse scale
    pvtgBonus: 15,           // 15% bonus for Particularly Vulnerable Tribal Group
    femaleBonus: 5,          // 5% bonus for female candidates
    maxIncomeCap: 600000,
  };

  // Config: Pre-Matric
  await prisma.schemeConfig.create({
    data: {
      schemeId: preMatricScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_p1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 250000, description: 'Annual family income must not exceed ₹2,50,000/-' },
        { id: 'rule_p2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
        { id: 'rule_p3', field: 'currentClass', label: 'Class IX or X Enrollment', operator: 'in', value: ['Class IX', 'Class X'], description: 'Must be studying in Class IX or X in a recognized school.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'MARK_SHEET', name: 'Class VIII / IX Marksheet', required: true },
      ]),
      scoringWeightageJson: JSON.stringify({ ...scoringWeightage, maxIncomeCap: 250000 }),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: Post-Matric
  await prisma.schemeConfig.create({
    data: {
      schemeId: postMatricScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_pm1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 250000, description: 'Annual family income must not exceed ₹2,50,000/-' },
        { id: 'rule_pm2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
        { id: 'rule_pm3', field: 'isRecognizedCollege', label: 'Recognized College / University', operator: '==', value: true, description: 'Must be enrolled in a post-secondary course.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'MARK_SHEET', name: 'Class X / XII / Graduation Marksheet', required: true },
      ]),
      scoringWeightageJson: JSON.stringify({ ...scoringWeightage, maxIncomeCap: 250000 }),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: Top Class
  await prisma.schemeConfig.create({
    data: {
      schemeId: topClassScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_tc1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income must not exceed ₹6,00,000/-' },
        { id: 'rule_tc2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
        { id: 'rule_tc3', field: 'isTopClassInstitute', label: 'Notified Premier Institute', operator: '==', value: true, description: 'Must be admitted into a MoTA notified Top Class Premier Institute (IIT, IIM, NIT, AIIMS, NLU, etc.).' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'ADMISSION_LETTER', name: 'Institute Fee Structure & Admission Offer', required: true },
      ]),
      scoringWeightageJson: JSON.stringify(scoringWeightage),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: NFST
  await prisma.schemeConfig.create({
    data: {
      schemeId: nfstScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_nf1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income from all sources must not exceed ₹6,00,000/-' },
        { id: 'rule_nf2', field: 'aggregateMarks', label: 'Post-Graduation Minimum Marks', operator: '>=', value: 55, description: 'Must have secured a minimum of 55% aggregate marks in PG Degree.' },
        { id: 'rule_nf3', field: 'category', label: 'Category Verification', operator: '==', value: 'ST', description: 'Applicant must belong to a notified Scheduled Tribe community.' },
        { id: 'rule_nf4', field: 'isApprovedInstitution', label: 'MoTA Approved University / Institute', operator: '==', value: true, description: 'Course must be pursued at a UGC/MoE accredited premier institution.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'MARK_SHEET', name: 'Post-Graduation Marksheet / Degree', required: true },
        { type: 'ADMISSION_LETTER', name: 'Ph.D / M.Phil Admission Offer Letter', required: true },
      ]),
      scoringWeightageJson: JSON.stringify(scoringWeightage),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  // Config: NOS
  await prisma.schemeConfig.create({
    data: {
      schemeId: nosScheme.id,
      version: 1,
      isActive: true,
      eligibilityRulesJson: JSON.stringify([
        { id: 'rule_nos1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income must not exceed ₹6,00,000/-' },
        { id: 'rule_nos2', field: 'aggregateMarks', label: 'Qualifying Exam Minimum Marks', operator: '>=', value: 60, description: 'Must have secured a minimum of 60% aggregate marks in qualifying exam.' },
        { id: 'rule_nos3', field: 'passportValid', label: 'Valid Indian Passport', operator: '==', value: true, description: 'Must possess a valid Indian passport.' },
      ]),
      requiredDocumentsJson: JSON.stringify([
        { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
        { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
        { type: 'PASSPORT', name: 'Valid Passport Copy', required: true },
        { type: 'ADMISSION_LETTER', name: 'Foreign University Unconditional Offer Letter', required: true },
      ]),
      scoringWeightageJson: JSON.stringify(scoringWeightage),
      tieBreakerRulesJson: JSON.stringify(tieBreakers),
    },
  });

  console.log('[MoTA Seed] Creating 16 realistic ST Applicant profiles...');

  const sampleApplicantsData = [
    { name: 'Amit Kumar Santhal', email: 'amit.santhal@gmail.com', state: 'Jharkhand', district: 'Dumka', tribe: 'Santhal', pvtg: null, gender: 'Male', marks: 82.5, income: 180000, status: 'SUBMITTED', conf: 96.0, risk: 'LOW' },
    { name: 'Priya Birhor', email: 'priya.birhor@gmail.com', state: 'Jharkhand', district: 'Hazaribagh', tribe: 'Birhor (PVTG)', pvtg: 'Birhor', gender: 'Female', marks: 88.0, income: 120000, status: 'SHORTLISTED', conf: 98.5, risk: 'LOW' },
    { name: 'Sanjay Oraon', email: 'sanjay.oraon@gmail.com', state: 'Jharkhand', district: 'Ranchi', tribe: 'Oraon', pvtg: null, gender: 'Male', marks: 74.0, income: 240000, status: 'UNDER_SCRUTINY', conf: 91.0, risk: 'LOW' },
    { name: 'Meena Gond', email: 'meena.gond@gmail.com', state: 'Madhya Pradesh', district: 'Dindori', tribe: 'Gond', pvtg: null, gender: 'Female', marks: 85.0, income: 195000, status: 'SELECTED', conf: 97.2, risk: 'LOW' },
    { name: 'Vikram Baiga', email: 'vikram.baiga@gmail.com', state: 'Madhya Pradesh', district: 'Mandla', tribe: 'Baiga (PVTG)', pvtg: 'Baiga', gender: 'Male', marks: 79.0, income: 90000, status: 'SHORTLISTED', conf: 94.0, risk: 'LOW' },
    { name: 'Deepak Munda', email: 'deepak.munda@gmail.com', state: 'Odisha', district: 'Mayurbhanj', tribe: 'Munda', pvtg: null, gender: 'Male', marks: 71.5, income: 520000, status: 'DEFICIENCY_RAISED', conf: 64.0, risk: 'HIGH' },
    { name: 'Ankita Saora', email: 'ankita.saora@gmail.com', state: 'Odisha', district: 'Gajapati', tribe: 'Saora (PVTG)', pvtg: 'Saora', gender: 'Female', marks: 83.0, income: 140000, status: 'RESUBMITTED', conf: 89.0, risk: 'MEDIUM' },
    { name: 'Rahul Meena', email: 'rahul.meena@gmail.com', state: 'Rajasthan', district: 'Udaipur', tribe: 'Bhil Meena', pvtg: null, gender: 'Male', marks: 91.0, income: 280000, status: 'SELECTED', conf: 99.0, risk: 'LOW' },
    { name: 'Kavita Bodo', email: 'kavita.bodo@gmail.com', state: 'Assam', district: 'Kokrajhar', tribe: 'Bodo', pvtg: null, gender: 'Female', marks: 77.0, income: 210000, status: 'UNDER_SCRUTINY', conf: 90.0, risk: 'LOW' },
    { name: 'Rohan Katkari', email: 'rohan.katkari@gmail.com', state: 'Maharashtra', district: 'Raigad', tribe: 'Katkari (PVTG)', pvtg: 'Katkari', gender: 'Male', marks: 76.0, income: 110000, status: 'SHORTLISTED', conf: 93.0, risk: 'LOW' },
    { name: 'Sunil Chenchu', email: 'sunil.chenchu@gmail.com', state: 'Telangana', district: 'Nagarkurnool', tribe: 'Chenchu (PVTG)', pvtg: 'Chenchu', gender: 'Male', marks: 80.0, income: 130000, status: 'SHORTLISTED', conf: 95.0, risk: 'LOW' },
    { name: 'Aarti Kamar', email: 'aarti.kamar@gmail.com', state: 'Chhattisgarh', district: 'Gariaband', tribe: 'Kamar (PVTG)', pvtg: 'Kamar', gender: 'Female', marks: 86.5, income: 85000, status: 'SELECTED', conf: 98.0, risk: 'LOW' },
    { name: 'Manish Halba', email: 'manish.halba@gmail.com', state: 'Chhattisgarh', district: 'Bastar', tribe: 'Halba', pvtg: null, gender: 'Male', marks: 68.0, income: 340000, status: 'SUBMITTED', conf: 88.0, risk: 'LOW' },
    { name: 'Pooja Bhil', email: 'pooja.bhil@gmail.com', state: 'Gujarat', district: 'Dahod', tribe: 'Bhil', pvtg: null, gender: 'Female', marks: 73.0, income: 260000, status: 'UNDER_SCRUTINY', conf: 87.0, risk: 'LOW' },
    { name: 'Rajesh Khadia', email: 'rajesh.khadia@gmail.com', state: 'Jharkhand', district: 'Simdega', tribe: 'Khadia', pvtg: null, gender: 'Male', marks: 62.0, income: 650000, status: 'REJECTED', conf: 55.0, risk: 'HIGH' },
    { name: 'Ritu Toda', email: 'ritu.toda@gmail.com', state: 'Tamil Nadu', district: 'Nilgiris', tribe: 'Toda (PVTG)', pvtg: 'Toda', gender: 'Female', marks: 84.0, income: 150000, status: 'SELECTED', conf: 96.5, risk: 'LOW' },
  ];

  for (let i = 0; i < sampleApplicantsData.length; i++) {
    const data = sampleApplicantsData[i];
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.name,
        role: 'APPLICANT',
        state: data.state,
        district: data.district,
        category: 'ST',
        pvtgGroup: data.pvtg,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        aadhaarNumber: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
        digilockerId: `DIGI-ST-${10000 + i}`,
      },
    });

    const schemeList = [preMatricScheme, postMatricScheme, topClassScheme, nfstScheme, nosScheme];
    const targetScheme = schemeList[i % schemeList.length];

    const appNo = `MOTA-${targetScheme.code}-2026-${String(i + 1).padStart(5, '0')}`;

    const formDataObj = {
      fullName: data.name,
      email: data.email,
      gender: data.gender,
      tribeName: data.tribe,
      isPVTG: Boolean(data.pvtg),
      annualIncome: data.income,
      aggregateMarks: data.marks,
      courseName: targetScheme.code === 'PRE_MATRIC' ? 'Class X (Secondary Education)' : targetScheme.code === 'POST_MATRIC' ? 'Higher Secondary Science (Class XII)' : targetScheme.code === 'TOP_CLASS' ? 'B.Tech in Computer Science & Engineering' : targetScheme.code === 'NOS' ? 'M.Sc in Artificial Intelligence (University of Oxford)' : 'Ph.D in Tribal Ethnography & Renewable Energy',
      institutionName: targetScheme.code === 'TOP_CLASS' ? 'Indian Institute of Technology (IIT) Bombay' : targetScheme.code === 'NOS' ? 'University of Oxford (UK)' : 'Central University of Jharkhand',
      isApprovedInstitution: true,
      bankAccountNo: `918273645${i}`,
      ifscCode: 'SBIN0001234',
    };

    const application = await prisma.application.create({
      data: {
        applicationNo: appNo,
        userId: user.id,
        schemeId: targetScheme.id,
        schemeConfigVersion: 1,
        status: data.status,
        riskLevel: data.risk,
        aiConfidenceScore: data.conf,
        formDataJson: JSON.stringify(formDataObj),
        submittedAt: new Date(Date.now() - (20 - i) * 86400 * 1000),
      },
    });

    // Create realistic Documents for Application
    await prisma.document.create({
      data: {
        applicationId: application.id,
        type: 'CASTE_CERT',
        fileName: `${data.name.toLowerCase().replace(/ /g, '_')}_caste_certificate.png`,
        fileUrl: '/sample-docs/caste_certificate.png',
        ocrExtractedJson: JSON.stringify({
          applicantName: data.name,
          casteTribeName: data.tribe,
          certificateNumber: `ST/CERT/2025/${1000 + i}`,
          issuingAuthority: `SDM Court, ${data.district}`,
        }),
        ocrConfidenceScore: data.conf,
        verificationStatus: data.risk === 'HIGH' ? 'FLAGGED' : 'VERIFIED',
      },
    });

    await prisma.document.create({
      data: {
        applicationId: application.id,
        type: 'INCOME_CERT',
        fileName: `${data.name.toLowerCase().replace(/ /g, '_')}_income_certificate.png`,
        fileUrl: '/sample-docs/income_certificate.png',
        ocrExtractedJson: JSON.stringify({
          applicantName: data.name,
          annualIncome: data.status === 'DEFICIENCY_RAISED' ? data.income + 150000 : data.income,
          certificateNumber: `INC/2025/${2000 + i}`,
          issuingAuthority: `Tehsildar, ${data.district}`,
        }),
        ocrConfidenceScore: data.status === 'DEFICIENCY_RAISED' ? 64.0 : 95.0,
        verificationStatus: data.status === 'DEFICIENCY_RAISED' ? 'FLAGGED' : 'VERIFIED',
        mismatchFlagsJson: data.status === 'DEFICIENCY_RAISED'
          ? JSON.stringify([{ field: 'annualIncome', documentValue: `₹${data.income + 150000}`, formValue: `₹${data.income}`, severity: 'CRITICAL', description: 'Income Certificate mismatch detected by OCR engine.' }])
          : '[]',
      },
    });

    // Create Deficiency Notice if status is DEFICIENCY_RAISED
    if (data.status === 'DEFICIENCY_RAISED') {
      await prisma.deficiencyNotice.create({
        data: {
          applicationId: application.id,
          raisedById: verifier.id,
          reason: 'Income mismatch between uploaded Income Certificate and application form entry.',
          remarks: 'Income Certificate states ₹6,70,000 whereas form entry states ₹5,20,000. Please re-upload updated revenue officer certificate.',
          category: 'DOCUMENT_MISMATCH',
          deadline: new Date(Date.now() + 5 * 86400 * 1000),
          status: 'OPEN',
        },
      });
    }

    // Create Merit Entry
    const academicPoints = (data.marks / 100) * 50;
    const incomePoints = (1 - Math.min(600000, data.income) / 600000) * 30;
    const pvtgPoints = data.pvtg ? 15 : 0;
    const femalePoints = data.gender === 'Female' ? 5 : 0;
    const score = Math.round((academicPoints + incomePoints + pvtgPoints + femalePoints) * 100) / 100;

    await prisma.meritEntry.create({
      data: {
        applicationId: application.id,
        schemeId: targetScheme.id,
        computedScore: score,
        scoreBreakdownJson: JSON.stringify({ academicPoints, incomePoints, pvtgPoints, femalePoints, total: score }),
        rank: i + 1,
        category: 'ST',
        state: data.state,
        isOverridden: false,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        applicationId: application.id,
        actorId: user.id,
        actorRole: 'APPLICANT',
        action: 'SUBMITTED',
        reason: 'Initial submission of application',
        previousState: 'DRAFT',
        newState: data.status,
      },
    });
  }

  console.log('[MoTA Seed] Seed completed successfully!');
  console.log(`Summary of Credentials created for Demo:`);
  console.log(`-----------------------------------------------------`);
  console.log(`Ministry Admin: admin@mota.gov.in / Password123!`);
  console.log(`State Nodal Officer: state.jharkhand@mota.gov.in / Password123!`);
  console.log(`District Verifier: verifier.ranchi@mota.gov.in / Password123!`);
  console.log(`ST Applicant 1: amit.santhal@gmail.com / Password123!`);
  console.log(`-----------------------------------------------------`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
