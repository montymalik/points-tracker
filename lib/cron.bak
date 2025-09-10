// lib/cron.js
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const startAutoDepositCron = () => {
  // This cron expression runs every Sunday at midnight.
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running auto-deposit cron job...');
    const amount = 10;
    const videoGames = amount * 0.1;
    const generalSpending = amount * 0.3;
    const charity = amount * 0.2;
    const savings = amount * 0.4;
    
    try {
      // Ensure the balance record exists
      let balance = await prisma.balance.findUnique({ where: { id: 1 } });
      if (!balance) {
        balance = await prisma.balance.create({ data: { id: 1 } });
      }
      // Update balance
      await prisma.balance.update({
        where: { id: 1 },
        data: {
          videoGames: { increment: videoGames },
          generalSpending: { increment: generalSpending },
          charity: { increment: charity },
          savings: { increment: savings },
        },
      });
      
      // Record the auto deposit transaction
      await prisma.transaction.create({
        data: {
          type: 'AUTO_DEPOSIT',
          amount,
          videoGames,
          generalSpending,
          charity,
          savings,
        },
      });
      
      console.log('Auto deposit completed.');
    } catch (error) {
      console.error('Error during auto deposit:', error);
    }
  });
};

module.exports = { startAutoDepositCron };

