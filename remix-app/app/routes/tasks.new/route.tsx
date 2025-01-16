import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";

import { PrismaClient, Status } from '@prisma/client';

const statusOptions = Object.values(Status);
const prisma = new PrismaClient();

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const desc = formData.get("desc");
    const status = formData.get("status");
    console.log(`create: ${title} ${desc} ${status}`);
    await prisma.task.create({
        data: {
            title: title as string,
            desc: desc as string,
            status: status as Status,
        }
    });
    return redirect("/");
}

export default function Page() {
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
            </Form>
        </div>
    )
}