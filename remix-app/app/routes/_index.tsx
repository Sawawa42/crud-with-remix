import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

// @prisma/clientからTask型をimport
import { PrismaClient, Task } from '@prisma/client';

type TaskType = Pick<Task, 'id' | 'title' | 'desc' | 'status'>;

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
        <div className='border rounded-lg p-4 my-4 flex-1'>
          backlog
          {tasks.map((task) => (
            task.status === 'BACKLOG' ? (
              <div key={task.id} className="border p-4 my-4">
                <li>
                  <Link to={`/tasks/edit/${task.id}`} className="text-blue-600">
                    {task.title}
                  </Link>
                </li>
              </div>
            ) : null
          ))}
        </div>
        <div className='border rounded-lg p-4 my-4 flex-1'>
          in progress
          {tasks.map((task) => (
            task.status === 'IN_PROGRESS' ? (
              <div key={task.id} className="border p-4 my-4">
                <li>
                  <Link to={`/tasks/edit/${task.id}`} className="text-blue-600">
                    {task.title}
                  </Link>
                </li>
              </div>
            ) : null
          ))}
        </div>
        <div className='border rounded-lg p-4 my-4 flex-1'>
          done
          {tasks.map((task) => (
            task.status === 'DONE' ? (
              <div key={task.id} className="border p-4 my-4">
                <li>
                  <Link to={`/tasks/edit/${task.id}`} className="text-blue-600">
                    {task.title}
                  </Link>
                </li>
              </div>
            ) : null
          ))}
        </div>
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
      desc: task.desc,
      status: task.status
    }
  });
  return json({ tasks: data })
}
