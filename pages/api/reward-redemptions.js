// pages/api/reward-redemptions.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const redemptions = await prisma.rewardRedemption.findMany({
        include: {
          reward: true,
        },
        orderBy: { redeemedDate: 'desc' },
      });
      return res.status(200).json(redemptions);
    } catch (error) {
      console.error('Error fetching reward redemptions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { rewardId } = req.body;
    
    if (!rewardId) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }
    
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Get the reward
        const reward = await tx.reward.findUnique({
          where: { id: parseInt(rewardId) },
        });
        
        if (!reward) {
          throw new Error('Reward not found');
        }
        
        // Get current points balance
        let pointsBalance = await tx.pointsBalance.findUnique({ where: { id: 1 } });
        if (!pointsBalance) {
          pointsBalance = await tx.pointsBalance.create({ data: { id: 1, totalPoints: 0 } });
        }
        
        // Check if user has enough points
        if (pointsBalance.totalPoints < reward.pointsCost) {
          throw new Error('Insufficient points for this reward');
        }
        
        // Create redemption
        const redemption = await tx.rewardRedemption.create({
          data: {
            rewardId: parseInt(rewardId),
            pointsSpent: reward.pointsCost,
          },
        });
        
        // Update points balance
        await tx.pointsBalance.update({
          where: { id: 1 },
          data: {
            totalPoints: { decrement: reward.pointsCost },
          },
        });
        
        return redemption;
      });
      
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error redeeming reward:', error);
      if (error.message === 'Reward not found') {
        return res.status(404).json({ error: 'Reward not found' });
      }
      if (error.message === 'Insufficient points for this reward') {
        return res.status(400).json({ error: 'Insufficient points for this reward' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
