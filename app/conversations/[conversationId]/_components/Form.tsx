"use client";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { CldUploadButton } from "next-cloudinary";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";

import MessageInput from "./MessageInput";
import useConversation from "@/app/_hooks/useConversation";

export default function Form() {
    const { conversationId } = useConversation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue("message", "", { shouldValidate: true });
        axios.post("/api/messages", {
            ...data,
            conversationId: conversationId,
        });
    };

    const handleUpload = (result: any) => {
        axios.post("/api/messages", {
            image: result?.info?.secure_url,
            conversationId,
        });
    };

    return (
        <div
            className="flex items-center w-full py-4 px-4 bg-white border-t 
            gap-2 lg:gap-4"
        >
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset={process.env.CLOUDINARY_PRESET}
            >
                <HiPhoto size={30} className="text-gray-500" />
            </CldUploadButton>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                <button
                    type="submit"
                    className="rounded-full p-2 bg-gray-500 cursor-pointer 
                    hover:bg-gray-600 transition"
                >
                    <HiPaperAirplane size={18} className="text-white" />
                </button>
            </form>
        </div>
    );
}
