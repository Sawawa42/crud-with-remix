import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, redirect, useActionData } from "@remix-run/react";
import { PrismaClient, Status } from '@prisma/client';
import { z } from 'zod';
import { parseWithZod, getZodConstraint } from '@conform-to/zod';
import { useForm, getFormProps, getInputProps, getTextareaProps } from '@conform-to/react';

const statusOptions = Object.values(Status);
const prisma = new PrismaClient();

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    desc: z.string(),
    status: z.nativeEnum(Status),
});

export default function Page() {
    const task = useLoaderData<typeof loader>();
    const lastResult = useActionData<typeof action>();
    const [ form, fields ] = useForm({
        lastResult,
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        constraint: getZodConstraint(schema),
        onValidate( { formData }) {
            return parseWithZod(formData, { schema });
        }
    });

    return (
        <div>
            <h1 className="text-3xl font-bold">Edit Task</h1>
            <Form method="put" {...getFormProps(form)}>
                <label>
                    <input
                        {...getInputProps(fields.title, {
                            type: 'text'
                        })} className="block border-2" placeholder="Title" defaultValue={task?.title}
                    />
                </label>
                {fields.title.errors && <p className="text-red-500">{'タイトルは必須です'}</p>}
                <label>
                    <textarea
                        {...getTextareaProps(fields.desc)}
                        className="block border-2" placeholder="Description" defaultValue={task?.desc}
                    />
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
    return task;
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const submission = parseWithZod(formData, { schema });
    if (submission.status !== 'success') {
        return submission.reply();
    }

    await prisma.task.update({
        where: {
            id: String(params.taskId),
        },
        data: submission.value,
    });
    throw redirect("/");
}
