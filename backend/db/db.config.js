import {PrismaClient} from '@prisma/client';

const prisma =new PrismaClient({
    log:['query'],
});
export default prisma;


// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// export default prisma;

// module.exports = prisma;
