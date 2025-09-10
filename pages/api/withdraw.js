// pages/api/withdraw.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // The request body should provide amounts for Video Games and/or General Spending.
    const { videoGames, generalSpending } = req.body;
    const withdrawVideo = parseFloat(videoGames) || 0;
    const withdrawGeneral = parseFloat(generalSpending) || 0;
    
    try {
      const balance = await prisma.balance.findUnique({ where: { id: 1 } });
      if (!balance) {
        return res.status(400).json({ error: 'Balance record not found' });
      }
      
      // Check that each withdrawal does not exceed available funds
      if (withdrawVideo > balance.videoGames) {
        return res.status(400).json({ error: 'Withdrawal amount for Video Games exceeds available funds' });
      }
      if (withdrawGeneral > balance.generalSpending) {
        return res.status(400).json({ error: 'Withdrawal amount for General Spending exceeds available funds' });
      }
      
      // Update the balance
      const updatedBalance = await prisma.balance.update({
        where: { id: 1 },
        data: {
          videoGames: { decrement: withdrawVideo },
          generalSpending: { decrement: withdrawGeneral },
        },
      });
      
      // Create a withdrawal transaction record (note negative values)
      await prisma.transaction.create({
        data: {
          type: 'WITHDRAWAL',
          amount: withdrawVideo + withdrawGeneral,
          videoGames: withdrawVideo > 0 ? -withdrawVideo : 0,
          generalSpending: withdrawGeneral > 0 ? -withdrawGeneral : 0,
        },
      });
      
      return res.status(200).json(updatedBalance);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

