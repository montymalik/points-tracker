// pages/api/depositLog.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const deposits = await prisma.transaction.findMany({
        where: { type: 'DEPOSIT' },
        orderBy: { createdAt: 'desc' },
        select: {
          createdAt: true,
          amount: true,
        },
      });
      res.status(200).json(deposits);
    } catch (error) {
      console.error("Error fetching deposit log:", error);
      res.status(500).json({ error: "Error fetching deposit log" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

