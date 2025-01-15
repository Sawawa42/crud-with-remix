import { PrismaClient, Task } from '@prisma/client';

type TaskType = Pick<Task, 'title' | 'desc' | 'status'>;

const prisma = new PrismaClient();

async function main() {
  // Taskの初期データを作成
  const tasks:TaskType[] = [
    {
      title: 'Task 1',
      desc: 'This is Task 1',
      status: 'BACKLOG',
    },
    {
      title: 'Task 2',
      desc: 'This is Task 2',
      status: 'BACKLOG',
    },
    {
      title: 'Task 3',
      desc: 'This is Task 3',
      status: 'BACKLOG',
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
        data: task
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
