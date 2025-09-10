// pages/api/daily-points.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;
    
    try {
      let whereClause = {};
      if (startDate && endDate) {
        whereClause = {
          completedDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        };
      }
      
      const completions = await prisma.dailyTaskCompletion.findMany({
        where: whereClause,
        include: {
          task: true,
        },
        orderBy: { completedDate: 'desc' },
      });
      
      // Group by date and sum points
      const dailyPoints = completions.reduce((acc, completion) => {
        const dateStr = completion.completedDate.toISOString().split('T')[0];
        if (!acc[dateStr]) {
          acc[dateStr] = {
            date: dateStr,
            totalPoints: 0,
            completedTasks: [],
          };
        }
        acc[dateStr].totalPoints += completion.pointsEarned;
        acc[dateStr].completedTasks.push({
          taskName: completion.task.name,
          points: completion.pointsEarned,
        });
        return acc;
      }, {});
      
      return res.status(200).json(Object.values(dailyPoints));
    } catch (error) {
      console.error('Error fetching daily points:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
