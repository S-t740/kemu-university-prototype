import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      email: 'admin',
      password: hashedPassword,
      role: 'admin'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create all schools (from kemu_content.json)
  const schoolsData = [
    { name: 'KeMU Business School', slug: 'kemu-business-school', overview: 'Excellence in business administration, economics, finance, and management education with industry-focused programmes.' },
    { name: 'School of Education and Social Sciences', slug: 'school-of-education-and-social-sciences', overview: 'Preparing transformational educators and social scientists for leadership roles in education and community development.' },
    { name: 'School of Medicine and Pharmacy', slug: 'school-of-medicine-and-pharmacy', overview: 'Premier school for medical education - first private university in Kenya to graduate medical doctors.' },
    { name: 'School of Science and Technology', slug: 'school-of-science-and-technology', overview: 'Leading school in agricultural sciences, environmental studies, and applied sciences.' },
    { name: 'School of Health Sciences', slug: 'school-of-health-sciences', overview: 'Excellence in nursing, nutrition, public health, and health systems management education.' },
    { name: 'School of Computing and Informatics', slug: 'school-of-computing-and-informatics', overview: 'Cutting-edge programmes in computer science, information technology, data science, and cybersecurity.' },
    { name: 'School of Law', slug: 'school-of-law', overview: 'Comprehensive legal education preparing students for careers in legal practice and justice.' },
    { name: 'School of Economics and Political Science', slug: 'school-of-economics-and-political-science', overview: 'Training future economists, policy analysts, and political scientists for global challenges.' },
    { name: 'School of Theology and Religious Studies', slug: 'school-of-theology-and-religious-studies', overview: 'Deep theological education for ministry, mission work, and religious scholarship.' }
  ];

  const schools = {};
  for (const schoolData of schoolsData) {
    schools[schoolData.slug] = await prisma.school.upsert({
      where: { slug: schoolData.slug },
      update: { name: schoolData.name, overview: schoolData.overview },
      create: schoolData
    });
  }
  console.log('✅ Schools created');

  // Create all programs (from ProgrammesAll.tsx and kemu_content.json)
  const programs = [
    // Certificate Programmes
    { title: 'Certificate in Church Ministry', slug: 'certificate-church-ministry', degreeType: 'Certificate', duration: '1-2 Years', overview: 'Equip yourself for effective ministry leadership with comprehensive biblical studies, pastoral care, and church administration.', requirements: 'KCSE D+ or equivalent', schoolId: schools['school-of-theology-and-religious-studies'].id },
    { title: 'Certificate in Church Music', slug: 'certificate-church-music', degreeType: 'Certificate', duration: '1-2 Years', overview: 'Develop musical skills and theological understanding for effective church music ministry, covering worship leadership and choir direction.', requirements: 'KCSE D+ or equivalent', schoolId: schools['school-of-theology-and-religious-studies'].id },
    { title: 'Certificate in Food and Beverage', slug: 'certificate-food-beverage', degreeType: 'Certificate', duration: '1-2 Years', overview: 'Master fundamentals of food service and beverage management, including food safety and hospitality operations.', requirements: 'KCSE D+ or equivalent', schoolId: schools['kemu-business-school'].id },
    { title: 'Certificate in Records and Archives Management', slug: 'certificate-records-archives', degreeType: 'Certificate', duration: '1-2 Years', overview: 'Gain essential skills in organizing, preserving, and managing organizational records in physical and digital formats.', requirements: 'KCSE D+ or equivalent', schoolId: schools['school-of-computing-and-informatics'].id },
    { title: 'Certificate in Sign Language', slug: 'certificate-sign-language', degreeType: 'Certificate', duration: '1-2 Years', overview: 'Learn effective communication through sign language, promoting inclusivity for the deaf and hard-of-hearing community.', requirements: 'KCSE D+ or equivalent', schoolId: schools['school-of-education-and-social-sciences'].id },
    { title: 'Certificate in Theology', slug: 'certificate-theology', degreeType: 'Certificate', duration: '1-2 Years', overview: 'Build solid foundation in Christian theology, biblical studies, and systematic doctrine for ministry or further education.', requirements: 'KCSE D+ or equivalent', schoolId: schools['school-of-theology-and-religious-studies'].id },

    // Undergraduate Programmes
    { title: 'BSc. Computer Science', slug: 'bsc-computer-science', degreeType: 'Undergraduate', duration: '4 Years', overview: 'Comprehensive program covering software engineering, artificial intelligence, and computer systems.', requirements: 'KCSE mean grade C+ with C+ in Mathematics and Physics', schoolId: schools['school-of-computing-and-informatics'].id },
    { title: 'BSc. Information Technology', slug: 'bsc-information-technology', degreeType: 'Undergraduate', duration: '4 Years', overview: 'Comprehensive IT program covering networking, database management, and web development.', requirements: 'KCSE mean grade C+ with C+ in Mathematics', schoolId: schools['school-of-computing-and-informatics'].id },
    { title: 'Bachelor of Commerce', slug: 'bachelor-of-commerce', degreeType: 'Undergraduate', duration: '4 Years', overview: 'Business and commerce degree preparing students for careers in accounting, finance, and management.', requirements: 'KCSE mean grade C+ with C+ in Mathematics', schoolId: schools['kemu-business-school'].id },
    { title: 'BSc. Nursing', slug: 'bsc-nursing', degreeType: 'Undergraduate', duration: '4 Years', overview: 'Become a registered nurse with clinical and theoretical expertise.', requirements: 'KCSE mean grade C+ with C+ in Biology, Chemistry, and Mathematics', schoolId: schools['school-of-health-sciences'].id },
    { title: 'Bachelor of Medicine and Surgery (MBChB)', slug: 'mbchb', degreeType: 'Undergraduate', duration: '6 Years', overview: 'Train to become a medical doctor at Kenya\'s first private university to graduate doctors.', requirements: 'KCSE mean grade B+ with A- in Biology, Chemistry, Physics, and Mathematics', schoolId: schools['school-of-medicine-and-pharmacy'].id },
    { title: 'Bachelor of Pharmacy', slug: 'bachelor-pharmacy', degreeType: 'Undergraduate', duration: '5 Years', overview: 'Comprehensive pharmacy education preparing students for pharmaceutical practice and research.', requirements: 'KCSE mean grade B with B in Chemistry, Biology, and Mathematics', schoolId: schools['school-of-medicine-and-pharmacy'].id },
    { title: 'Bachelor of Laws (LLB)', slug: 'llb', degreeType: 'Undergraduate', duration: '4 Years', overview: 'Comprehensive legal education preparing students for careers in legal practice and justice.', requirements: 'KCSE mean grade B+ with B+ in English', schoolId: schools['school-of-law'].id },
    { title: 'Bachelor of Education', slug: 'bachelor-education', degreeType: 'Undergraduate', duration: '4 Years', overview: 'Train to become an effective educator with strong pedagogical and subject matter expertise.', requirements: 'KCSE mean grade C+ with relevant subjects', schoolId: schools['school-of-education-and-social-sciences'].id },
    { title: 'BSc. Agriculture', slug: 'bsc-agriculture', degreeType: 'Undergraduate', duration: '4 Years', overview: 'Study agricultural sciences and sustainable farming for food security and rural development.', requirements: 'KCSE mean grade C+ with C+ in Biology, Chemistry, Agriculture', schoolId: schools['school-of-science-and-technology'].id },

    // Masters Programmes
    { title: 'Master of Arts in Counselling Psychology', slug: 'ma-counselling-psychology', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Advance expertise in psychological counseling with rigorous training in therapeutic techniques and mental health assessment.', requirements: 'Bachelor\'s degree in Psychology or related field', schoolId: schools['school-of-education-and-social-sciences'].id },
    { title: 'Master of Arts in Mission Studies', slug: 'ma-mission-studies', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Deepen understanding of missiology, cross-cultural ministry, and global Christianity for missions work.', requirements: 'Bachelor\'s degree in Theology or related field', schoolId: schools['school-of-theology-and-religious-studies'].id },
    { title: 'Master of Arts in Religious Studies', slug: 'ma-religious-studies', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Explore world religions, comparative theology, and religious philosophy for academic research.', requirements: 'Bachelor\'s degree in Theology or Humanities', schoolId: schools['school-of-theology-and-religious-studies'].id },
    { title: 'Master of Business Administration (MBA)', slug: 'mba', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Transform your career with advanced business strategy, leadership, finance, and marketing skills.', requirements: 'Bachelor\'s degree with at least Second Class Honours', schoolId: schools['kemu-business-school'].id },
    { title: 'Master of Education in Leadership and Management', slug: 'm-ed-leadership', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Become an effective educational leader with expertise in school administration and curriculum development.', requirements: 'Bachelor\'s degree in Education or related field', schoolId: schools['school-of-education-and-social-sciences'].id },
    { title: 'Master of Information Science', slug: 'mis', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Master advanced information management, data analytics, and digital systems.', requirements: 'Bachelor\'s degree in IT, Library Science, or related field', schoolId: schools['school-of-computing-and-informatics'].id },
    { title: 'Master of Public Health', slug: 'mph', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Address critical health challenges with comprehensive training in epidemiology and health policy.', requirements: 'Bachelor\'s degree in health-related field', schoolId: schools['school-of-health-sciences'].id },
    { title: 'MSc. Agricultural and Rural Development', slug: 'msc-agriculture-rural', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Drive sustainable agricultural development through advanced research in crop science and agribusiness.', requirements: 'Bachelor\'s degree in Agriculture or related field', schoolId: schools['school-of-science-and-technology'].id },
    { title: 'MSc. Computer Information Systems', slug: 'msc-cis', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Lead digital transformation with knowledge in systems analysis, database management, and cybersecurity.', requirements: 'Bachelor\'s degree in IT, Computer Science, or related field', schoolId: schools['school-of-computing-and-informatics'].id },
    { title: 'MSc. Finance and Investment', slug: 'msc-finance-investment', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Excel in financial markets with training in investment analysis, portfolio management, and risk assessment.', requirements: 'Bachelor\'s degree in Finance, Economics, or Business', schoolId: schools['kemu-business-school'].id },
    { title: 'MSc. Health Systems Management', slug: 'msc-health-systems', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Lead healthcare organizations with expertise in health policy and hospital administration.', requirements: 'Bachelor\'s degree in Health or Management field', schoolId: schools['school-of-health-sciences'].id },
    { title: 'MSc. Hospitality and Tourism Management', slug: 'msc-hospitality-tourism', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Advance your career in hospitality with strategic management skills in hotel operations and tourism marketing.', requirements: 'Bachelor\'s degree in Hospitality, Tourism, or Business', schoolId: schools['kemu-business-school'].id },
    { title: 'MSc. Human Nutrition and Dietetics', slug: 'msc-nutrition-dietetics', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Become a nutrition expert with advanced knowledge in clinical nutrition and public health nutrition.', requirements: 'Bachelor\'s degree in Nutrition, Food Science, or related field', schoolId: schools['school-of-health-sciences'].id },
    { title: 'MSc. Nursing Education', slug: 'msc-nursing-education', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Prepare future nurses with advanced teaching methodologies and clinical education strategies.', requirements: 'Bachelor\'s degree in Nursing with valid license', schoolId: schools['school-of-health-sciences'].id },
    { title: 'Masters in International Relations', slug: 'mir', degreeType: 'Postgraduate', duration: '2 Years', overview: 'Navigate global politics and diplomacy with training in international law and conflict resolution.', requirements: 'Bachelor\'s degree in Social Sciences or related field', schoolId: schools['school-of-economics-and-political-science'].id },

    // PhD Programmes
    { title: 'Doctor of Philosophy in Agriculture', slug: 'phd-agriculture', degreeType: 'Postgraduate', duration: '3-5 Years', overview: 'Conduct groundbreaking research in agricultural sciences for food security and sustainable farming.', requirements: 'Master\'s degree in Agriculture or related field', schoolId: schools['school-of-science-and-technology'].id },
    { title: 'PhD in Business Administration and Management', slug: 'phd-business', degreeType: 'Postgraduate', duration: '3-5 Years', overview: 'Become a thought leader in business scholarship through rigorous research in strategic management.', requirements: 'Master\'s degree in Business or Management', schoolId: schools['kemu-business-school'].id },
    { title: 'PhD in Counselling Psychology', slug: 'phd-counselling-psychology', degreeType: 'Postgraduate', duration: '3-5 Years', overview: 'Advance the field of counseling psychology through original research in mental health interventions.', requirements: 'Master\'s degree in Psychology or Counselling', schoolId: schools['school-of-education-and-social-sciences'].id },
    { title: 'PhD in Education Leadership and Management', slug: 'phd-education-leadership', degreeType: 'Postgraduate', duration: '3-5 Years', overview: 'Shape the future of education through scholarly research in educational policy and leadership theory.', requirements: 'Master\'s degree in Education or related field', schoolId: schools['school-of-education-and-social-sciences'].id },
    { title: 'PhD in Health Systems Management', slug: 'phd-health-systems', degreeType: 'Postgraduate', duration: '3-5 Years', overview: 'Drive healthcare innovation through advanced research in health policy and systems optimization.', requirements: 'Master\'s degree in Health or Management field', schoolId: schools['school-of-health-sciences'].id },
    { title: 'PhD in Religious Studies', slug: 'phd-religious-studies', degreeType: 'Postgraduate', duration: '3-5 Years', overview: 'Contribute to theological scholarship through research in systematic theology and biblical studies.', requirements: 'Master\'s degree in Theology or Religious Studies', schoolId: schools['school-of-theology-and-religious-studies'].id },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: { title: program.title, degreeType: program.degreeType, duration: program.duration, overview: program.overview, requirements: program.requirements, schoolId: program.schoolId },
      create: program
    });
  }
  console.log('✅ Programs created');

  // Create TVET Programs
  const tvetPrograms = [
    // Artisan Programmes (Level 3)
    { title: 'Artisan in Electrical Installation', slug: 'tvet-artisan-electrical', degreeType: 'Artisan', duration: '6 Months', overview: 'Gain hands-on skills in domestic and industrial electrical installations, wiring, and maintenance.', requirements: 'KCSE D or equivalent', institution: 'TVET', schoolId: schools['school-of-science-and-technology'].id },
    { title: 'Artisan in Motor Vehicle Mechanics', slug: 'tvet-artisan-motor-vehicle', degreeType: 'Artisan', duration: '6 Months', overview: 'Learn practical skills in vehicle maintenance, engine repair, and automotive systems.', requirements: 'KCSE D or equivalent', institution: 'TVET', schoolId: schools['school-of-science-and-technology'].id },
    { title: 'Artisan in Plumbing', slug: 'tvet-artisan-plumbing', degreeType: 'Artisan', duration: '6 Months', overview: 'Master pipe installation, water systems, and sanitary plumbing for residential and commercial buildings.', requirements: 'KCSE D or equivalent', institution: 'TVET', schoolId: schools['school-of-science-and-technology'].id },
    { title: 'Artisan in Welding and Fabrication', slug: 'tvet-artisan-welding', degreeType: 'Artisan', duration: '6 Months', overview: 'Develop skills in metal joining, cutting, and fabrication techniques for construction and manufacturing.', requirements: 'KCSE D or equivalent', institution: 'TVET', schoolId: schools['school-of-science-and-technology'].id },
    { title: 'Artisan in Beauty Therapy', slug: 'tvet-artisan-beauty', degreeType: 'Artisan', duration: '6 Months', overview: 'Learn beauty treatments, skincare, makeup application, and spa therapy techniques.', requirements: 'KCSE D or equivalent', institution: 'TVET', schoolId: schools['kemu-business-school'].id },

    // Craft Certificate Programmes (Level 4-5)
    { title: 'Craft Certificate in ICT', slug: 'tvet-craft-ict', degreeType: 'Craft Certificate', duration: '1 Year', overview: 'Comprehensive training in computer applications, networking basics, and IT support.', requirements: 'KCSE D+ or equivalent', institution: 'TVET', schoolId: schools['school-of-computing-and-informatics'].id },
    { title: 'Craft Certificate in Food and Beverage Production', slug: 'tvet-craft-food-beverage', degreeType: 'Craft Certificate', duration: '1 Year', overview: 'Learn food preparation, kitchen management, and hospitality service skills.', requirements: 'KCSE D+ or equivalent', institution: 'TVET', schoolId: schools['kemu-business-school'].id },
    { title: 'Craft Certificate in Business Management', slug: 'tvet-craft-business', degreeType: 'Craft Certificate', duration: '1 Year', overview: 'Foundational business skills including bookkeeping, entrepreneurship, and office administration.', requirements: 'KCSE D+ or equivalent', institution: 'TVET', schoolId: schools['kemu-business-school'].id },
    { title: 'Craft Certificate in Community Health', slug: 'tvet-craft-community-health', degreeType: 'Craft Certificate', duration: '1 Year', overview: 'Training in community health education, disease prevention, and primary healthcare support.', requirements: 'KCSE D+ or equivalent', institution: 'TVET', schoolId: schools['school-of-health-sciences'].id },
    { title: 'Craft Certificate in Agriculture', slug: 'tvet-craft-agriculture', degreeType: 'Craft Certificate', duration: '1 Year', overview: 'Practical skills in crop production, animal husbandry, and sustainable farming practices.', requirements: 'KCSE D+ or equivalent', institution: 'TVET', schoolId: schools['school-of-science-and-technology'].id },

    // Diploma Programmes (Level 6)
    { title: 'Diploma in Information Communication Technology', slug: 'tvet-diploma-ict', degreeType: 'Diploma', duration: '2 Years', overview: 'Advanced ICT training covering programming, database management, and network administration.', requirements: 'KCSE C- or equivalent', institution: 'TVET', schoolId: schools['school-of-computing-and-informatics'].id },
    { title: 'Diploma in Business Management', slug: 'tvet-diploma-business', degreeType: 'Diploma', duration: '2 Years', overview: 'Comprehensive business education including accounting, marketing, and human resource management.', requirements: 'KCSE C- or equivalent', institution: 'TVET', schoolId: schools['kemu-business-school'].id },
    { title: 'Diploma in Hospitality Management', slug: 'tvet-diploma-hospitality', degreeType: 'Diploma', duration: '2 Years', overview: 'Professional training in hotel operations, tourism, and hospitality industry management.', requirements: 'KCSE C- or equivalent', institution: 'TVET', schoolId: schools['kemu-business-school'].id },
    { title: 'Diploma in Social Work and Community Development', slug: 'tvet-diploma-social-work', degreeType: 'Diploma', duration: '2 Years', overview: 'Training in community development, social welfare, and counseling skills.', requirements: 'KCSE C- or equivalent', institution: 'TVET', schoolId: schools['school-of-education-and-social-sciences'].id },
    { title: 'Diploma in Electrical and Electronics Engineering', slug: 'tvet-diploma-electrical', degreeType: 'Diploma', duration: '2 Years', overview: 'Technical training in electrical systems, electronics, and power engineering.', requirements: 'KCSE C- or equivalent', institution: 'TVET', schoolId: schools['school-of-science-and-technology'].id },
  ];

  for (const program of tvetPrograms) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: { title: program.title, degreeType: program.degreeType, duration: program.duration, overview: program.overview, requirements: program.requirements, institution: program.institution, schoolId: program.schoolId },
      create: program
    });
  }
  console.log('✅ TVET Programs created');

  // Create news
  const newsItems = [
    {
      title: 'Trimester 3, 2025 Academic Calendar Released',
      slug: 'trimester-3-calendar-2025',
      summary: 'Registration for new and continuing students begins Monday, 1st – Friday, 5th September 2025.',
      content: 'Kenya Methodist University has released the academic calendar for Trimester 3, 2025. All students are expected to register between Monday, 1st – Friday, 5th September 2025. Lectures will begin promptly on Monday, 8th September 2025.',
      publishedAt: new Date('2025-08-15')
    },
    {
      title: 'KeMU Celebrates Over 32,000 Alumni Worldwide',
      slug: 'kemu-alumni-milestone',
      summary: 'Kenya Methodist University marks a significant milestone with over 32,000 alumni making an impact globally.',
      content: 'Kenya Methodist University is proud to celebrate a significant milestone with over 32,000 alumni making positive contributions worldwide. As a Chartered Christian University with campuses in Meru, Nairobi, and Mombasa, KeMU continues to produce professional and transformational leaders.',
      publishedAt: new Date('2025-08-10')
    },
    {
      title: 'KeMU: First Private University in Kenya to Graduate Medical Doctors',
      slug: 'medical-doctors-graduation',
      summary: 'Kenya Methodist University maintains its unique distinction as the first and only private university in Kenya to graduate medical doctors.',
      content: 'Kenya Methodist University continues to hold the unique distinction of being the first and only private university in Kenya to graduate medical doctors. This achievement reflects the university\'s commitment to excellence in medical education.',
      publishedAt: new Date('2025-07-28')
    },
    {
      title: 'New State-of-the-Art Computer Lab Opens',
      slug: 'new-computer-lab-opens',
      summary: 'The School of Computing and Informatics opens a new state-of-the-art computer laboratory.',
      content: 'The School of Computing and Informatics is pleased to announce the opening of a new state-of-the-art computer laboratory equipped with the latest technology for enhanced learning and research.',
      publishedAt: new Date('2025-09-01')
    }
  ];

  for (const news of newsItems) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: news
    });
  }
  console.log('✅ News items created');

  // Create events
  const events = [
    {
      title: '26th Graduation Ceremony',
      date: new Date('2026-03-15'),
      venue: 'KeMU Graduation Square, Kaaga, off Meru-Maua Highway, Meru',
      details: 'For all students who have satisfied Academic Requirements and met Financial Obligations for conferment of degrees and award of diplomas. Ceremony will be held from 8:20 AM to 5:00 PM.'
    },
    {
      title: 'Registration and Classes Begin - Trimester 1, 2026',
      date: new Date('2026-01-20'),
      venue: 'All Campuses (Meru, Nairobi, Mombasa)',
      details: 'New and continuing students registration period: Monday, 13th – Friday, 17th January 2026. Lectures begin on Monday, 20th January 2026.'
    },
    {
      title: 'Registrar AA\'s Students Interactive Forum',
      date: new Date('2026-02-14'),
      venue: 'Main Campus, Meru',
      details: 'This trimester\'s RGAA\'s forum with all students will be held on Friday, 14th February 2026.'
    }
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event
    });
  }
  console.log('✅ Events created');

  // Create student services (from kemu_content.json student_services)
  const studentServices = [
    {
      slug: 'welfare',
      title: 'Student Welfare',
      summary: 'Student Welfare services at Kenya Methodist University provide support and resources for student well-being, including guidance, counselling, and assistance with various student needs throughout their academic journey.',
      details: JSON.stringify([
        'Academic Support - Guidance on academic matters and course selection',
        'Career Services - Career counselling and job readiness programs',
        'Health Services - On-campus clinic with outpatient and preventive care',
        'Accommodation - Wi-Fi enabled hostels'
      ]),
      sortOrder: 1
    },
    {
      slug: 'leadership',
      title: 'Student Leadership',
      summary: 'The KeMU student fraternity annually elects a leadership to articulate their interests. The University management is keen on mentoring the student governance into a model leadership and constantly engages with student leaders.',
      details: JSON.stringify([
        'Student leadership elected annually',
        'University management mentors student governance',
        'Main Campus positions: President, Academic Secretary, Secretary General, Treasurer',
        'Nairobi Campus: Chairperson, Academics Secretary, Treasurer',
        'Mombasa Campus: Chairperson, Sports/Clubs/Entertainment Secretary, Treasurer',
        'Current Main Campus President: Masai Naomi Chebet'
      ]),
      sortOrder: 2
    },
    {
      slug: 'counselling',
      title: 'Guidance and Counselling',
      summary: 'The well-being of students is taken very seriously at Kenya Methodist University. Across all campuses, welfare, chaplaincy and counseling services are available, managed by highly qualified staff.',
      details: JSON.stringify([
        'Services available at all campuses (Main, Nairobi, Mombasa)',
        'Vision: Trusted, visible and inclusive counselling center enhancing mental health and well-being',
        'Services: Confidential counselling, therapeutic assistance, consultation, prevention, outreach',
        'Nairobi Campus counsellors: Rev. Gregory Kivanguli, Anastasia Muriithi, Dr. Zipporah Kaaria',
        'Main Campus counsellors: Kenneth Gitiye (Team Lead), Jane Marete, Dr. Monica Gitonga, Dr. Peter Mwiti, Dr. Rebecca Wachira',
        'Toll-free partner lines: Child Line Kenya (116), RedCross GBV/Crisis (1199), Niskize (0900620800), NACADA (1192)',
        'All information shared during counselling is CONFIDENTIAL'
      ]),
      sortOrder: 3
    },
    {
      slug: 'life',
      title: 'Student Life',
      summary: 'A student of Kenya Methodist University is exposed to a variety of curricula and extra-curricula activities. The university provides sports and recreational programmes, health services, clubs and societies, accommodation facilities, cultural festivals, and student leadership opportunities.',
      details: JSON.stringify([
        'Sports disciplines: Soccer, Netball, Basketball, Volleyball, Rugby, Handball, Tennis, Karate, Taekwondo, Swimming, Chess, Hockey',
        'Health Services: Outpatient, Preventive, Curative, Promotive, Referral Services',
        'Clubs and Societies available for all interests',
        'Accommodation: All hostels Wi-Fi enabled',
        'Cultural Festival: Features Mr. and Miss KeMU beauty pageant',
        'Student Leadership: Annual elections for student governance'
      ]),
      sortOrder: 4
    },
    {
      slug: 'scholarships',
      title: 'Scholarships',
      summary: 'Kenya Methodist University offers the "Bless to Bless" scholarship program, providing a variety of scholarships and fellowships designed to help students and their families pay for university. Scholarships and grants are types of gift aid that do not have to be repaid.',
      details: JSON.stringify([
        'Bless to Bless scholarship program',
        'Requirements: Full-time student (at least 12 points), timely financial aid application',
        'Must meet Satisfactory Academic Progress standards',
        'Office hours: Monday-Friday, 8am-5pm',
        'Contact: +254724256162',
        'Email: info@kemu.ac.ke'
      ]),
      url: 'https://kemu.ac.ke/scholarships',
      sortOrder: 5
    },
    {
      slug: 'announcements',
      title: 'Student Announcements',
      summary: 'The Student Announcements page provides important updates and information for students at Kenya Methodist University. Students are encouraged to regularly check this page for the latest information.',
      details: JSON.stringify([
        'Graduation lists and announcements',
        'Examination results and provisional results',
        'HELB allocation updates',
        'Online examination application links',
        'Other student-related notices and updates'
      ]),
      url: 'https://kemu.ac.ke/student-welfare/student-announcements',
      sortOrder: 6
    },
    {
      slug: 'timetables',
      title: 'Timetables',
      summary: 'The Timetables page provides access to study timetables and examination timetables for students at Kenya Methodist University. The Academic Registry manages and publishes class schedules, examination schedules, and other time-related academic information.',
      details: JSON.stringify([
        'Study timetables for all programmes',
        'Examination timetables',
        'Managed by Academic Registry',
        'Available for all campuses (Meru, Nairobi, Mombasa)',
        'Links to registration, student forms, graduation, academic calendar'
      ]),
      url: 'https://kemu.ac.ke/timetables',
      sortOrder: 7
    },
    {
      slug: 'graduation',
      title: 'Graduation',
      summary: 'Students are conferred with academic honours upon successful completion of their programmes during an event known as graduation. Graduation is done once per year as per the academic calendar.',
      details: JSON.stringify([
        'Graduation done once per year as per academic calendar',
        'Intent to Graduate Form required',
        'Must meet academic programme requirements (credit hours, core courses, electives)',
        'Final Year Clearance Form required',
        'Graduation fee must be fully paid',
        '25th Graduation Ceremony scheduled'
      ]),
      url: 'https://kemu.ac.ke/graduation',
      sortOrder: 8
    },
    {
      slug: 'booklets',
      title: 'Graduation Booklets',
      summary: 'Graduation booklets are provided by Kenya Methodist University for each graduation ceremony. These booklets contain information about the graduating class, ceremony details, and other relevant graduation information.',
      details: JSON.stringify([]),
      url: 'https://kemu.ac.ke/graduation-booklets',
      sortOrder: 9
    }
  ];

  for (const service of studentServices) {
    await prisma.studentService.upsert({
      where: { slug: service.slug },
      update: service,
      create: service
    });
  }
  console.log('✅ Student services created');

  // Create directorates (from kemu_content.json)
  const directorates = [
    {
      name: 'Directorate of Research and Innovation',
      slug: 'directorate-research-innovation',
      overview: 'The Directorate of Research, Community Outreach and Industry Linkages is mandated to coordinate all research activities in the University, fundraise for research activities, coordinate grant writing activities, and disseminate scientific research through the International Journal of Professional Publication (IJPP) and annual scientific conferences.'
    },
    {
      name: 'Directorate of Quality Assurance',
      slug: 'directorate-quality-assurance',
      overview: 'The Directorate for Quality Assurance is mandated to coordinate all aspects of quality assurance in the university. The quality assurance directorate aims to enhance quality improvement processes and measures for teaching, learning, research, and other administrative services.'
    },
    {
      name: 'Directorate of Marketing and Advancement',
      slug: 'directorate-marketing-advancement',
      overview: 'The Marketing and Advancement Directorate is mandated to undertake marketing and promotion of University programmes, promote the corporate image, maintain positive relationships with customers, and conduct market research to inform institutional planning.'
    }
  ];

  for (const directorate of directorates) {
    await prisma.directorate.upsert({
      where: { slug: directorate.slug },
      update: { name: directorate.name, overview: directorate.overview },
      create: directorate
    });
  }
  console.log('✅ Directorates created');

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

