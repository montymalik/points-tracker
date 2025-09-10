// pages/api/updateBalance.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { videoGames, generalSpending, charity, savings } = req.body;
      
      // Update the balance record (assumes a single record with id=1)
      const updatedBalance = await prisma.balance.update({
        where: { id: 1 },
        data: {
          videoGames: parseFloat(videoGames),
          generalSpending: parseFloat(generalSpending),
          charity: parseFloat(charity),
          savings: parseFloat(savings),
        },
      });
      
      res.status(200).json(updatedBalance);
    } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).json({ error: "Error updating balance" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

