import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { PrismaClient, Status } from '@prisma/client';
import { z } from 'zod';

const statusOptions = Object.values(Status);
const prisma = new PrismaClient();

const zodTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    desc: z.string(),
    status: z.nativeEnum(Status),
});

export const action = async ({ request }: ActionFunctionArgs) => {
    // フォームデータを取得
    const formData = await request.formData();
    const title = formData.get("title");
    const desc = formData.get("desc");
    const status = formData.get("status");

    // zodでバリデーション
    const result = zodTaskSchema.safeParse({ title, desc, status });
    if (!result.success) {
        return { error: 'error!' };
    }

    await prisma.task.create({
        data: result.data,
    });
    return redirect("/");
}

export default function Page() {
    const data = useActionData<typeof action>();
    return (
        <div>
            <h1 className="text-3xl font-bold">New Task</h1>
            <Form method="post">
                <label>
                    <input type="text" name="title" className="block border-2" placeholder="Title" />
                </label>
                <label>
                    <textarea name="desc" className="block border-2" placeholder="Description" />
                </label>
                <label>
                    <select name="status" className="block border-2">
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4">Submit</button>
                {data?.error && <p className="text-red-500">{data.error}</p>}
            </Form>
        </div>
    )
}