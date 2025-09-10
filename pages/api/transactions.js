// pages/api/transactions.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { month, year } = req.query;
    let filter = {};
    if (month && year) {
      const monthInt = parseInt(month);
      const yearInt = parseInt(year);
      // Create a date range for the provided month/year
      const startDate = new Date(yearInt, monthInt - 1, 1);
      const endDate = new Date(yearInt, monthInt, 1);
      filter = {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      };
    }
    
    try {
      const transactions = await prisma.transaction.findMany({
        where: filter,
        orderBy: { createdAt: 'asc' },
      });
      return res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

