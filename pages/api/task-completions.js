// pages/api/task-completions.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { date } = req.query;
    
    try {
      const completedTasks = await prisma.dailyTaskCompletion.findMany({
        where: {
          completedDate: date ? new Date(date) : new Date(),
        },
        include: {
          task: true, // Include task data even if task is inactive
        },
      });
      
      // Filter out completions where the task was deleted from database entirely
      // But keep completions for inactive tasks (preserves historical data)
      const validCompletions = completedTasks.filter(completion => completion.task !== null);
      
      return res.status(200).json(validCompletions);
    } catch (error) {
      console.error('Error fetching task completions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { taskId, date } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    const completedDate = date ? new Date(date) : new Date();
    
    try {
      // Get the task to get points and verify it's active
      const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId) },
      });
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      // Only allow completion of active tasks
      if (!task.isActive) {
        return res.status(400).json({ error: 'Cannot complete inactive task' });
      }
      
      // Check if task is already completed for this date
      const existingCompletion = await prisma.dailyTaskCompletion.findUnique({
        where: {
          taskId_completedDate: {
            taskId: parseInt(taskId),
            completedDate: completedDate,
          },
        },
      });
      
      if (existingCompletion) {
        return res.status(400).json({ error: 'Task already completed for this date' });
      }
      
      // Create completion and update points balance in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Store the CURRENT points value of the task at time of completion
        // This preserves historical accuracy even if task points are changed later
        const completion = await tx.dailyTaskCompletion.create({
          data: {
            taskId: parseInt(taskId),
            completedDate: completedDate,
            pointsEarned: task.points, // Store current points value
          },
        });
        
        // Update points balance
        let pointsBalance = await tx.pointsBalance.findUnique({ where: { id: 1 } });
        if (!pointsBalance) {
          pointsBalance = await tx.pointsBalance.create({ data: { id: 1, totalPoints: 0 } });
        }
        
        await tx.pointsBalance.update({
          where: { id: 1 },
          data: {
            totalPoints: { increment: task.points },
          },
        });
        
        return completion;
      });
      
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error completing task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { taskId, date } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    const completedDate = date ? new Date(date) : new Date();
    
    try {
      const result = await prisma.$transaction(async (tx) => {
        const completion = await tx.dailyTaskCompletion.findUnique({
          where: {
            taskId_completedDate: {
              taskId: parseInt(taskId),
              completedDate: completedDate,
            },
          },
        });
        
        if (!completion) {
          throw new Error('Task completion not found');
        }
        
        await tx.dailyTaskCompletion.delete({
          where: {
            taskId_completedDate: {
              taskId: parseInt(taskId),
              completedDate: completedDate,
            },
          },
        });
        
        // Use the ORIGINAL points earned (from when it was completed)
        // Not the current task points (which may have changed)
        await tx.pointsBalance.update({
          where: { id: 1 },
          data: {
            totalPoints: { decrement: completion.pointsEarned },
          },
        });
        
        return completion;
      });
      
      return res.status(200).json({ message: 'Task completion removed successfully' });
    } catch (error) {
      console.error('Error removing task completion:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
