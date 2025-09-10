// pages/api/monthlyFlow.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Optionally, you can limit the query to a date range (for example, the last 12 months)
      // For simplicity, here we fetch all transactions.
      const transactions = await prisma.transaction.findMany();

      // Object to group data by month-year
      const monthlyDataMap = {};

      transactions.forEach((tx) => {
        // Create a key in the format "Month Year" (e.g., "January 2023")
        const date = new Date(tx.createdAt);
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        // Initialize the month group if it doesn't exist
        if (!monthlyDataMap[monthKey]) {
          monthlyDataMap[monthKey] = {
            month: monthKey,
            videoGamesInflow: 0,
            videoGamesOutflow: 0,
            generalSpendingInflow: 0,
            generalSpendingOutflow: 0,
          };
        }

        // Process the Video Games column:
        if (tx.videoGames) {
          if (tx.videoGames > 0) {
            monthlyDataMap[monthKey].videoGamesInflow += tx.videoGames;
          } else {
            monthlyDataMap[monthKey].videoGamesOutflow += Math.abs(tx.videoGames);
          }
        }

        // Process the General Spending column:
        if (tx.generalSpending) {
          if (tx.generalSpending > 0) {
            monthlyDataMap[monthKey].generalSpendingInflow += tx.generalSpending;
          } else {
            monthlyDataMap[monthKey].generalSpendingOutflow += Math.abs(tx.generalSpending);
          }
        }
      });

      // Convert the grouped data into an array
      const monthlyData = Object.values(monthlyDataMap);

      // Sort the monthly data by date (oldest first)
      monthlyData.sort((a, b) => {
        // Parse the month strings into Date objects for comparison
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');
        return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
      });

      res.status(200).json(monthlyData);
    } catch (error) {
      console.error("Error fetching monthly flow data:", error);
      res.status(500).json({ error: "Error fetching monthly flow data" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

