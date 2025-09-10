// pages/api/deposit.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }
    
    // Split the deposit as per percentages
    const videoGames = amount * 0.30;
    const generalSpending = amount * 0.2;
    const charity = amount * 0.1;
    const savings = amount * 0.4;
    
    try {
      // Ensure the balance record exists
      let balance = await prisma.balance.findUnique({ where: { id: 1 } });
      if (!balance) {
        balance = await prisma.balance.create({ data: { id: 1 } });
      }
      
      // Update the balance
      const updatedBalance = await prisma.balance.update({
        where: { id: 1 },
        data: {
          videoGames: { increment: videoGames },
          generalSpending: { increment: generalSpending },
          charity: { increment: charity },
          savings: { increment: savings },
        },
      });
      
      // Create a deposit transaction record
      await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount,
          videoGames,
          generalSpending,
          charity,
          savings,
        },
      });
      
      return res.status(200).json(updatedBalance);
    } catch (error) {
      console.error('Error processing deposit:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

