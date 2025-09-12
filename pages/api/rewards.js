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
      // When updating a reward, we should NOT update historical redemption costs
      // Only update the reward definition for future redemptions
      const reward = await prisma.reward.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(pointsCost && { pointsCost: parseInt(pointsCost) }),
          ...(isActive !== undefined && { isActive }),
        },
      });
      
      // Note: We deliberately do NOT update RewardRedemption records
      // Historical redemptions should preserve the points they cost at the time
      
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
      // Instead of hard deleting, we set isActive to false
      // This preserves historical data while hiding the reward from active lists
      await prisma.reward.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });
      
      // Historical RewardRedemption records are preserved
      // They still reference the reward and maintain their original pointsSpent values
      
      return res.status(200).json({ message: 'Reward deactivated successfully (historical data preserved)' });
    } catch (error) {
      console.error('Error deactivating reward:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
