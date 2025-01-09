import type { MetaFunction } from '@remix-run/node'
import { json } from "@remix-run/node";

// meta関数: メタデータを変更する関数
export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' }, 
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return <h1 className="text-2xl font-bold text-center mt-8">Welcome to Remix!</h1>
}

// loader関数: レンダリング時にデータを取得するためにサーバ側で実行される関数
export const loader = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const data = await response.json();
  console.log(data)
  return json({ posts: data });
};
