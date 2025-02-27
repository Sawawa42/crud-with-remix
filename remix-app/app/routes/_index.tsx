import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

// @prisma/clientからTask型をimport
import { PrismaClient, Task } from '@prisma/client';


type TaskType = Pick<Task, 'id' | 'title' | 'status' | 'updatedAt'>;
const prisma = new PrismaClient(); // 今はここでもOK

// meta関数: メタデータを変更する関数
export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

// default export
// useLoaderData: loader関数で取得したデータをコンポーネント内で利用するためのフック
export default function Index() {
  const { tasks } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-8">ToDo</h1>
      <div className='border rounded-lg p-4 my-4 flex'>
        {/* タスクのステータスごとに分割表示 */}
          {taskItem(tasks, 'BACKLOG')}
          {taskItem(tasks, 'IN_PROGRESS')}
          {taskItem(tasks, 'DONE')}
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link to="/tasks/new">New Task</Link>
      </button>
    </div>
  )
}

// named export
// loader関数: レンダリング時にデータを取得するためにサーバ側で実行される関数
export const loader = async () => {
  // Prismaを使ってデータベースからデータを取得
  const tasks = await prisma.task.findMany();
  const data: TaskType[] = tasks.map((task) => {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      updatedAt: task.updatedAt,
    };
  });
  return { tasks: data };
}

const dateToStr = (input: Date): string => {
  const result = new Date(input).toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit", day: "2-digit"});
  return result;
};

const taskItem = (tasks: TaskType[], status: string) => {
  return (
    <div className='border rounded-lg p-4 my-4 flex-1'>
      {status}
      {tasks.map((task) => (
        task.status === status && (
          <div key={task.id} className="border p-4 my-4">
            <div>
              <Link to={`/tasks/edit/${task.id}`} className="text-blue-600">
                {task.title}
              </Link>
              <div className='flex-1'>updatedAt: {dateToStr(task.updatedAt)}</div>
            </div>
          </div>
        )
      ))}
    </div>
  )
}
