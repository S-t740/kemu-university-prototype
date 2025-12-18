import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

const tvetPrograms = [
    // Diploma Programmes (Level 6)
    { title: 'Diploma in Accountancy', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Business Management', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Project Management', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Human Resource Management', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Procurement & Supplies Management', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in ICT Technician', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Library & Information Science', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Social Work & Community Development', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Community Health', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Agricultural Extension', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Horticulture Production & Processing', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Food & Beverage Sales & Services', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Human Nutrition & Dietetics', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Tourism & Travel Management', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Criminal Justice & Security Management', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Counselling Psychology', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },
    { title: 'Diploma in Maritime Transport & Logistics (KMA Approved)', degreeType: 'Diploma', duration: '2 Years', level: 'Level 6' },

    // Craft Certificate Programmes (Level 5)
    { title: 'Certificate in Business Management', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in ICT Technician', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Records & Archives Management', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Social Work & Community Development', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Community Health', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Horticulture Production', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Food & Beverage Sales & Services', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Tourism & Travel Management', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in International Relations', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Kenyan Sign Language', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },
    { title: 'Certificate in Maritime Transport & Logistics (KMA Approved)', degreeType: 'Certificate', duration: '1 Year', level: 'Level 5' },

    // Artisan Certificate Programmes (Level 4)
    { title: 'Artisan Certificate in Office Assistance', degreeType: 'Certificate', duration: '6 Months', level: 'Level 4' },

    // Professional & Short Courses
    { title: 'Commercial Driver\'s License (CDL)', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'CISCO Certification (CCNA 1-4)', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'Kenyan Sign Language (Short Course)', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'Foreign Languages - French', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'Foreign Languages - German', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'Music - Keyboard', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'Music - Guitar', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'Music - Drums', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'Music - Vocals', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
    { title: 'KASNEB Professional Courses', degreeType: 'Certificate', duration: 'Varies', level: 'Short Course' },
];

async function seedTVET() {
    console.log('🎓 Seeding TVET Institute data...');

    try {
        // Create or find TVET Institute school
        let tvetSchool = await prisma.school.findFirst({
            where: { slug: 'kemu-tvet-institute' }
        });

        if (!tvetSchool) {
            tvetSchool = await prisma.school.create({
                data: {
                    name: 'KeMU TVET Institute',
                    slug: 'kemu-tvet-institute',
                    overview: 'KeMU TVET Institute is a TVETA Licensed institution (TVETA/PRIVATE/TVC/0042/2021AI) providing quality competency-based education and training (CBET) that recognizes and nurtures the potential of each learner. Our motto: "Dreams are still valid."'
                }
            });
            console.log('✅ Created TVET Institute school');
        } else {
            console.log('ℹ️ TVET Institute school already exists');
        }

        // Seed TVET programs
        let created = 0;
        let skipped = 0;

        for (const program of tvetPrograms) {
            const slug = generateSlug(program.title);

            const existing = await prisma.program.findFirst({
                where: { slug }
            });

            if (!existing) {
                await prisma.program.create({
                    data: {
                        title: program.title,
                        slug,
                        degreeType: program.degreeType,
                        duration: program.duration,
                        overview: `${program.title} - ${program.level}. This program is offered under the Competence Based Education and Training (CBET) curriculum, emphasizing practical skills and industry readiness.`,
                        requirements: 'KCSE Mean Grade D (Plain) or equivalent. Specific requirements vary by program.',
                        schoolId: tvetSchool.id,
                        institution: 'TVET'
                    }
                });
                created++;
            } else {
                skipped++;
            }
        }

        console.log(`✅ Created ${created} TVET programs`);
        console.log(`ℹ️ Skipped ${skipped} existing programs`);
        console.log('🎉 TVET seeding complete!');

    } catch (error) {
        console.error('❌ Error seeding TVET data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedTVET();
