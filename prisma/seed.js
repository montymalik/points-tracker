// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create initial balance record
  const balance = await prisma.balance.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      videoGames: 0,
      generalSpending: 0,
      charity: 0,
      savings: 0,
    },
  });
  console.log('Created balance record:', balance);

  // Create initial points balance
  const pointsBalance = await prisma.pointsBalance.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      totalPoints: 0,
    },
  });
  console.log('Created points balance record:', pointsBalance);

  // Create sample tasks
  const tasks = [
    {
      name: 'Breathing Exercise',
      description: 'Complete 10 minutes of breathing exercises',
      points: 10,
    },
    {
      name: 'Reading',
      description: 'Read for 30 minutes',
      points: 15,
    },
    {
      name: 'Exercise',
      description: 'Complete workout routine',
      points: 20,
    },
    {
      name: 'Chores',
      description: 'Complete assigned household chores',
      points: 25,
    },
    {
      name: 'Practice Instrument',
      description: 'Practice musical instrument for 20 minutes',
      points: 15,
    },
    {
      name: 'Help with Cooking',
      description: 'Help prepare a meal',
      points: 12,
    },
  ];

  for (const taskData of tasks) {
    const task = await prisma.task.upsert({
      where: { name: taskData.name },
      update: taskData,
      create: taskData,
    });
    console.log('Created/updated task:', task.name);
  }

  // Create sample rewards
  const rewards = [
    {
      name: 'Extra Screen Time',
      description: '30 minutes of extra screen time',
      pointsCost: 50,
    },
    {
      name: 'Special Treat',
      description: 'Choose a special snack or treat',
      pointsCost: 75,
    },
    {
      name: 'Small Toy',
      description: 'Pick a small toy under $10',
      pointsCost: 100,
    },
    {
      name: 'Movie Night Choice',
      description: 'Choose the family movie for movie night',
      pointsCost: 125,
    },
    {
      name: 'Stay Up Late',
      description: 'Stay up 1 hour past bedtime on weekend',
      pointsCost: 150,
    },
    {
      name: 'Friend Sleepover',
      description: 'Have a friend over for a sleepover',
      pointsCost: 200,
    },
  ];

  for (const rewardData of rewards) {
    const reward = await prisma.reward.upsert({
      where: { name: rewardData.name },
      update: rewardData,
      create: rewardData,
    });
    console.log('Created/updated reward:', reward.name);
  }

  console.log('Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
