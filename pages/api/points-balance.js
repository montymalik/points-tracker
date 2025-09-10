// pages/api/points-balance.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let pointsBalance = await prisma.pointsBalance.findUnique({ where: { id: 1 } });
      if (!pointsBalance) {
        pointsBalance = await prisma.pointsBalance.create({ data: { id: 1, totalPoints: 0 } });
      }
      return res.status(200).json(pointsBalance);
    } catch (error) {
      console.error('Error fetching points balance:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
