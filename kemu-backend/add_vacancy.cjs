const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create a test vacancy
    const vacancy = await prisma.vacancy.create({
        data: {
            title: 'Lecturer in Computer Science',
            slug: 'lecturer-computer-science',
            department: 'School of Computing and Informatics',
            location: 'Meru Campus',
            type: 'Academic',
            description: 'We are looking for a qualified lecturer to join our Computer Science department. The ideal candidate should have a PhD or Masters degree in Computer Science or related field.',
            requirements: '- PhD or Masters in Computer Science\\n- At least 3 years teaching experience\\n- Research publications preferred\\n- Good communication skills',
            deadline: new Date('2025-01-31'),
            images: null
        }
    });

    console.log('Created vacancy:', vacancy);

    // List all vacancies
    const vacancies = await prisma.vacancy.findMany();
    console.log('All vacancies:', vacancies);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
