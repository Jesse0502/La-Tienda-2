import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connect(){
    const res = await prisma.$connect()
}

export default connect();