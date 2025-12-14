import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdmin() {
    try {
        // Update admin@gmail.com with hashed password
        const hash = await bcrypt.hash('admin', 10);
        await prisma.admin.update({
            where: { email: 'admin@gmail.com' },
            data: { password: hash }
        });
        console.log('✅ Updated admin@gmail.com with hashed password');

        // Update stephen@gmail.com with hashed password  
        const hash2 = await bcrypt.hash('123456', 10);
        await prisma.admin.update({
            where: { email: 'stephen@gmail.com' },
            data: { password: hash2 }
        });
        console.log('✅ Updated stephen@gmail.com with hashed password');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdmin();
