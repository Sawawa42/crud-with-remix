import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, redirect, useActionData } from "@remix-run/react";
import { PrismaClient, Status } from '@prisma/client';
import { z } from 'zod';

const statusOptions = Object.values(Status);
const prisma = new PrismaClient();

const zodTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    desc: z.string(),
    status: z.nativeEnum(Status),
});

export default function Page() {
    const { task } = useLoaderData<typeof loader>();
    const data = useActionData<typeof action>();

    return (
        <div>
            <h1 className="text-3xl font-bold">Edit Task</h1>
            <Form method="put">
                <label>
                    <input type="text" name="title" className="block border-2" placeholder="Title" defaultValue={task?.title}/>
                </label>
                <label>
                    <textarea name="desc" className="block border-2" placeholder="Description" defaultValue={task?.desc}/>
                </label>
                <label>
                    <select name="status" className="block border-2" defaultValue={task?.status}>
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const task = await prisma.task.findUnique({
        where: {
            id: String(params.taskId),
        },
    });
    return json({ task });
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const desc = formData.get("desc");
    const status = formData.get("status");
   
    const result = zodTaskSchema.safeParse({ title, desc, status });
    if (!result.success) {
        return { error: 'error!' };
    }

    await prisma.task.update({
        where: {
            id: String(params.taskId),
        },
        data: result.data,
    });
    return redirect("/");
}
