import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";

// action関数: データの変更を行うためにサーバ側で実行される関数 POST/PUT/DELETE/PATCHが送られた時実行
export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const body = formData.get("body");
    console.log(title, body);
    return redirect("/");
}

// Formコンポーネント: HTMLのform要素をラップする
export default function New() {
    return (
        <div>
            <h1 className="text-3xl font-bold">New Post</h1>
            <Form method="post">
                <label>
                    <input type="text" name="title" className="block border-2" placeholder="Title" />
                </label>
                <label>
                    <textarea name="body" className="block border-2" placeholder="Body" />
                </label>
                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4">Submit</button>
            </Form>
        </div>
    )
}