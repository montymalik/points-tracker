// pages/api/tasks.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { name, description, points } = req.body;
    
    if (!name || !points || points <= 0) {
      return res.status(400).json({ error: 'Name and valid points are required' });
    }
    
    try {
      const task = await prisma.task.create({
        data: {
          name,
          description: description || null,
          points: parseInt(points),
        },
      });
      return res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { id, name, description, points, isActive } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    try {
      const task = await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(points && { points: parseInt(points) }),
          ...(isActive !== undefined && { isActive }),
        },
      });
      return res.status(200).json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    try {
      await prisma.task.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });
      return res.status(200).json({ message: 'Task deactivated successfully' });
    } catch (error) {
      console.error('Error deactivating task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
