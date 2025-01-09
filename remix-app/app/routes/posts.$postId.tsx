import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.postId}`)
  const data = await response.json()
  return json({ post: data })
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1 className="text-3xl font-bold">Post</h1>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p>{post.body}</p>
    </div>
  )
}
