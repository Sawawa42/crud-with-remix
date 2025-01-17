import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
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
    const lastResult = useActionData<typeof action>();
    // useForm: フォームの状態管理と検証を行うためのフック
    // lastResult: 直前のaction関数の結果
    // constraint: 検証ルール
    // onValidate: フォームの検証を行う関数
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
            <h1 className="text-3xl font-bold">New Task</h1>
            <Form method="post" {...getFormProps(form)}>
                <label>
                    <input
                        {...getInputProps(fields.title, {
                            type: 'text'
                        })}
                        className="block border-2" placeholder="Title"
                    />
                </label>
                {fields.title.errors && <p className="text-red-500">{'タイトルは必須です'}</p>}
                <label>
                    <textarea
                        {...getTextareaProps(fields.desc)}
                        className="block border-2" placeholder="Description"
                    />
                </label>
                <label>
                    {/* <select {...getSelectProps(fields.status)} className="block border-2"/> だと選択肢がでない?*/}
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

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    // fromEntriesをparseWithZodに置き換え
    const submission = parseWithZod(formData, { schema });
    if (submission.status !== 'success') {
        return submission.reply();
    }

    await prisma.task.create({
        data: submission.value,
    });
    throw redirect("/");
}
