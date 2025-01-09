import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

// 型定義
type Post = {
  userId: string
  id: string
  title: string
  body: string
}

// meta関数: メタデータを変更する関数
export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

// default export
// useLoaderData: loader関数で取得したデータをコンポーネント内で利用するためのフック
export default function Index() {
  const { posts } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-8">Welcome to Remix!</h1>
      <div>
        {/* 要素に一意性を持たせるためにkey属性を付与 */}
        {posts.map((post) => (
          <div key={post.id} className="border p-4 my-4">
            <li>
              <Link to={`/posts/${post.id}`} className="text-blue-600">
                {post.title}
              </Link>
            </li>
          </div>
        ))}
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link to="/posts/new">New Post</Link>
      </button>
    </div>
  )
}

// named export
// loader関数: レンダリング時にデータを取得するためにサーバ側で実行される関数
export const loader = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
  // 自分で定義したPost型を用いて、構造的型付けで型注釈を行なっている
  const data: Post[] = await response.json()
  // console.log(data)
  return json({ posts: data })
}
