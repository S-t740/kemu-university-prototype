import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteOldEvents() {
    try {
        const result = await prisma.event.deleteMany({});
        console.log(`✅ Deleted ${result.count} old events`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteOldEvents();
