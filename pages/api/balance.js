// pages/api/balance.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let balance = await prisma.balance.findUnique({ where: { id: 1 } });
      if (!balance) {
        balance = await prisma.balance.create({ data: { id: 1 } });
      }
      return res.status(200).json(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

