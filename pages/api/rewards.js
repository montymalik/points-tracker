// pages/api/rewards.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rewards = await prisma.reward.findMany({
        where: { isActive: true },
        orderBy: { pointsCost: 'asc' },
      });
      return res.status(200).json(rewards);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { name, description, pointsCost } = req.body;
    
    if (!name || !pointsCost || pointsCost <= 0) {
      return res.status(400).json({ error: 'Name and valid points cost are required' });
    }
    
    try {
      const reward = await prisma.reward.create({
        data: {
          name,
          description: description || null,
          pointsCost: parseInt(pointsCost),
        },
      });
      return res.status(201).json(reward);
    } catch (error) {
      console.error('Error creating reward:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { id, name, description, pointsCost, isActive } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }
    
    try {
      const reward = await prisma.reward.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(pointsCost && { pointsCost: parseInt(pointsCost) }),
          ...(isActive !== undefined && { isActive }),
        },
      });
      return res.status(200).json(reward);
    } catch (error) {
      console.error('Error updating reward:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }
    
    try {
      await prisma.reward.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });
      return res.status(200).json({ message: 'Reward deactivated successfully' });
    } catch (error) {
      console.error('Error deactivating reward:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
