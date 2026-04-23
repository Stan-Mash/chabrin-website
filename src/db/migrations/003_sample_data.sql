-- ============================================================
-- 003_sample_data.sql — Sample data for testing admin panel
-- Run as: sudo -u postgres psql -d chabrin_public -f 003_sample_data.sql
-- ============================================================

-- ── Sample Applications ───────────────────────────────────────────────────────

INSERT INTO applications (reference, job_id, full_name, email, phone, linkedin_url, cover_letter, answers, stage, internal_notes, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-OPS-2025-KM3X7',
  id,
  'James Kariuki Mwangi',
  'james.kariuki@gmail.com',
  '+254 712 345 678',
  'https://linkedin.com/in/james-kariuki-pm',
  'Dear Hiring Team, I am a seasoned property manager with 5 years of experience managing residential portfolios in Kilimani and Westlands. I have overseen up to 35 units simultaneously and maintain 95%+ occupancy rates. I hold a Diploma in Real Estate from Kenya Institute of Management and am an active ISK member.',
  '{"Do you hold a valid Kenyan driving licence?": "Yes, valid until 2028", "How many properties have you managed simultaneously at your peak?": "35 units across Kilimani and Westlands"}',
  'shortlisted',
  'Very strong candidate. 5 years exp, ISK member. Schedule for interview Mon or Tue.',
  true,
  'LinkedIn',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day'
FROM jobs WHERE slug = 'property-manager'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, cover_letter, answers, stage, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-OPS-2025-RN8P2',
  id,
  'Faith Wanjiku Njoroge',
  'faith.wanjiku@yahoo.com',
  '+254 721 987 654',
  'I have 3 years of property management experience with a mid-sized agency in Thika and Ruiru corridor. I managed 22 commercial and residential units and am well versed in lease preparation and tenant screening.',
  '{"Do you hold a valid Kenyan driving licence?": "Yes", "How many properties have you managed simultaneously at your peak?": "22 units"}',
  'reviewing',
  true,
  'BrighterMonday',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
FROM jobs WHERE slug = 'property-manager'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, linkedin_url, cover_letter, answers, stage, internal_notes, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-OPS-2025-DW4Q9',
  id,
  'Brian Odhiambo Otieno',
  'brian.odhiambo@outlook.com',
  '+254 700 112 233',
  'https://linkedin.com/in/brian-otieno-re',
  'Dear Chabrin Team, I bring 7 years in real estate and property management, including 2 years with a large EARB-registered firm in Nairobi CBD. My strengths are client relations, maintenance coordination, and financial reporting to landlords.',
  '{"Do you hold a valid Kenyan driving licence?": "Yes, motorcycle and car", "How many properties have you managed simultaneously at your peak?": "48 units"}',
  'interview_scheduled',
  'Excellent profile. 7 years exp, EARB firm background. Interview booked for Friday 10am.',
  true,
  'Referral',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '2 days'
FROM jobs WHERE slug = 'property-manager'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, cover_letter, answers, stage, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-OPS-2025-LT5A1',
  id,
  'Mercy Achieng Ouma',
  'mercy.achieng@gmail.com',
  '+254 733 456 789',
  'Fresh graduate with a BSc in Real Estate from University of Nairobi. Completed internship at a property firm in Westlands. Eager to start my career with a reputable company.',
  '{"Do you hold a valid Kenyan driving licence?": "No, currently training", "How many properties have you managed simultaneously at your peak?": "5 units during internship"}',
  'applied',
  true,
  'chabrinagencies.com',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
FROM jobs WHERE slug = 'property-manager'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, cover_letter, answers, stage, internal_notes, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-OPS-2025-XP7B3',
  id,
  'Samuel Githinji Kamau',
  's.githinji@gmail.com',
  '+254 745 321 654',
  'I have been managing properties independently for landlords in Kasarani and Ruiru for the past 4 years. Looking to formalise my career under an established agency.',
  '{"Do you hold a valid Kenyan driving licence?": "Yes", "How many properties have you managed simultaneously at your peak?": "18 units"}',
  'rejected',
  'Good experience but location expertise only covers Kasarani. Does not meet minimum 2yr agency requirement.',
  true,
  'Walk-in',
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '6 days'
FROM jobs WHERE slug = 'property-manager'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, cover_letter, answers, stage, internal_notes, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-OPS-2025-FO2K8',
  id,
  'Peter Mwenda Kioko',
  'peter.mwenda.k@gmail.com',
  '+254 710 654 321',
  'I have 2 years of field experience doing property inspections and coordinating repairs in Embakasi. I know Nairobi East, Kasarani, and Thika Road well.',
  '{"Do you hold a valid Kenyan driving licence?": "Yes, Class B and A", "Which areas of Nairobi/Kiambu are you most familiar with?": "Embakasi, Kasarani, Thika Road, Ruiru"}',
  'shortlisted',
  'Strong field candidate. Good area knowledge. Call to confirm availability.',
  true,
  'Fuzu',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '1 day'
FROM jobs WHERE slug = 'field-officer'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, cover_letter, answers, stage, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-OPS-2025-FO9L4',
  id,
  'Diana Chebet Kiplangat',
  'diana.chebet@gmail.com',
  '+254 728 543 210',
  'I worked as a field coordinator for a building contractor in Kiambu County for 18 months. I am hardworking, punctual, and have a clean driving record.',
  '{"Do you hold a valid Kenyan driving licence?": "Yes", "Which areas of Nairobi/Kiambu are you most familiar with?": "Kiambu, Ruaka, Banana, Limuru"}',
  'applied',
  true,
  'chabrinagencies.com',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
FROM jobs WHERE slug = 'field-officer'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, cover_letter, answers, stage, internal_notes, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-ADM-2025-AA3T6',
  id,
  'Caroline Wambui Ndegwa',
  'caroline.wambui@gmail.com',
  '+254 722 876 543',
  'Dear Hiring Manager, I am a professional administrative assistant with 3 years of experience in a busy real estate office in Upperhill. I am fluent in English and Swahili, proficient in MS Office and QuickBooks, and known for my organisational skills and warm client manner.',
  '{"Are you fluent in both English and Swahili?": "Yes, native Swahili and fluent English", "What is your expected monthly salary (KES)?": "KES 45,000"}',
  'offer_extended',
  'Top candidate. Professional, articulate, real estate background. Offer sent 15 Apr.',
  true,
  'LinkedIn',
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '3 days'
FROM jobs WHERE slug = 'administrative-assistant'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO applications (reference, job_id, full_name, email, phone, cover_letter, answers, stage, internal_notes, consent_given, source, submitted_at, updated_at)
SELECT
  'APP-ADM-2025-AA7H1',
  id,
  'Kevin Njoroge Waweru',
  'kevin.njoroge.w@outlook.com',
  '+254 735 678 901',
  'I hold a Diploma in Business Administration from Nairobi Institute of Business Studies. I have 1 year of office experience at a logistics company and am eager to transition into real estate administration.',
  '{"Are you fluent in both English and Swahili?": "Yes", "What is your expected monthly salary (KES)?": "KES 38,000"}',
  'interviewed',
  'Decent interview. Less experience than Caroline but backup option. Decision pending.',
  true,
  'BrighterMonday',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '4 days'
FROM jobs WHERE slug = 'administrative-assistant'
ON CONFLICT (reference) DO NOTHING;

-- ── Sample Complaints ─────────────────────────────────────────────────────────

INSERT INTO complaints (reference, submitter_type, full_name, email, phone, property_area, category, subcategory, priority, description, status, internal_notes, resolution_notes, consent_given, submitted_at, acknowledged_at, resolved_at)
VALUES
(
  'CMP-2025-KT3X9',
  'tenant',
  'John Mwangi',
  'john.mwangi@gmail.com',
  '+254 712 111 222',
  'Kasarani',
  'maintenance',
  'Plumbing',
  'urgent',
  'The main water pipe in my bathroom burst at around 6pm yesterday. Water is flooding the bathroom and I cannot use it. The building caretaker is not responding to calls. This is causing significant damage to my belongings.',
  'in_progress',
  'Caretaker confirmed unresponsive. Dispatched field officer Peter Kioko to assess. Plumber booked for tomorrow morning.',
  NULL,
  true,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days' + INTERVAL '3 hours',
  NULL
)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO complaints (reference, submitter_type, full_name, email, phone, property_area, category, subcategory, priority, description, status, internal_notes, resolution_notes, consent_given, submitted_at, acknowledged_at, resolved_at)
VALUES
(
  'CMP-2025-WR8L2',
  'tenant',
  'Amina Hassan',
  'amina.hassan@yahoo.com',
  '+254 733 444 555',
  'South B',
  'noise_neighbour',
  'Loud music',
  'routine',
  'My upstairs neighbour plays loud music every night from 10pm to 2am. I have knocked and asked them to lower the volume twice but the problem continues. I work early mornings and this is affecting my health.',
  'resolved',
  'Spoke to upstairs tenant. Warned them formally in writing. No further complaints received.',
  'We spoke with the tenant in question and issued a formal written warning as per the tenancy agreement. They have agreed to observe quiet hours after 10pm. Please let us know if the issue recurs.',
  true,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days' + INTERVAL '5 hours',
  NOW() - INTERVAL '7 days'
)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO complaints (reference, submitter_type, full_name, email, phone, property_area, category, subcategory, priority, description, status, internal_notes, resolution_notes, consent_given, submitted_at, acknowledged_at, resolved_at)
VALUES
(
  'CMP-2025-EM4P1',
  'tenant',
  'Grace Otieno',
  'grace.otieno@gmail.com',
  '+254 700 789 012',
  'Githurai 44',
  'safety',
  'Broken gate lock',
  'emergency',
  'The main gate lock to our apartment block has been broken since last week. Anyone can walk in at any time. There have been two incidents of strangers loitering in the compound at night. I am afraid for my safety and that of my children.',
  'acknowledged',
  'Emergency safety issue. Locksmith dispatched same day. Awaiting confirmation of completion.',
  NULL,
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day' + INTERVAL '45 minutes',
  NULL
)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO complaints (reference, submitter_type, full_name, email, phone, property_area, category, subcategory, priority, description, status, internal_notes, resolution_notes, consent_given, submitted_at, acknowledged_at, resolved_at)
VALUES
(
  'CMP-2025-BL9Q5',
  'landlord',
  'David Kamau',
  'david.kamau.property@gmail.com',
  '+254 722 333 444',
  'Ruiru',
  'billing',
  'Rent remittance delay',
  'enquiry',
  'I have not received my rental remittance for March 2025. I was expecting payment by the 10th but it is now the 17th and nothing has come through. Please clarify the status of my payment.',
  'resolved',
  'Accounts confirmed payment processed. MPESA float issue caused 3 day delay. Resolved.',
  'We apologise for the delay in your March remittance. There was a temporary MPESA float issue that has now been resolved. Payment of KES 87,500 was sent to your registered number on 16 April 2025. Please check your MPESA statement.',
  true,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days' + INTERVAL '2 hours',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO complaints (reference, submitter_type, full_name, email, phone, property_area, category, subcategory, priority, description, status, consent_given, submitted_at)
VALUES
(
  'CMP-2025-MG6R3',
  'tenant',
  'Beatrice Njeri',
  'beatrice.njeri@gmail.com',
  '+254 711 234 567',
  'Kitengela',
  'management',
  'Unresponsive agent',
  'routine',
  'I have been trying to reach my property manager for 2 weeks about renewing my lease which expires at end of April. No response to calls or messages. I do not want to face eviction.',
  'submitted',
  true,
  NOW() - INTERVAL '3 hours'
)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO complaints (reference, submitter_type, full_name, email, phone, property_area, category, priority, description, status, internal_notes, consent_given, submitted_at, acknowledged_at)
VALUES
(
  'CMP-2025-XT2N7',
  'prospective',
  'Michael Omondi',
  'michael.omondi@outlook.com',
  '+254 744 567 890',
  'Kilimani',
  'general',
  'enquiry',
  'I viewed a 2-bedroom apartment in Kilimani last week and was told to expect a feedback call within 2 days. It has now been 5 days and I have not heard anything. I am still interested but need to know if it is available.',
  'acknowledged',
  'Assigned to agent Kariuki to follow up on the Kilimani 2br viewing.',
  true,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '4 days'
)
ON CONFLICT (reference) DO NOTHING;

SELECT 'Done! Inserted sample applications and complaints.' AS result;
