import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Update all programs with degreeType 'Undergraduate' to 'Degree'
    const result = await prisma.program.updateMany({
        where: { degreeType: 'Undergraduate' },
        data: { degreeType: 'Degree' }
    });

    console.log(`Updated ${result.count} programs from 'Undergraduate' to 'Degree'`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
