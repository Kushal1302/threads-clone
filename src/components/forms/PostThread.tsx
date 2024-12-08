"use client";
import { ThreadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { createThread } from "@/lib/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";

const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const { startUpload } = useUploadThing("media");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      userId,
      imageUrl: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ThreadValidation>) => {
    setIsLoading(true);
    if (imagePreview) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        data.imageUrl = imgRes[0].url;
      }
    }
    await createThread({
      text: data.thread,
      communityId: null,
      userId: data.userId,
      path: pathname,
      imageUrl: data.imageUrl,
    });
    setIsLoading(false);
    router.push("/");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() ?? "";
        setImagePreview(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBeautify = async () => {
    try {
      const response = await fetch("/api/beautify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: form.getValues("thread") }),
      });

      const data = await response.json();
      if (response.ok) {
        form.setValue("thread", data.beautifiedText);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 mt-10"
        >
          {/* Text Area */}
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Textarea rows={15} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-4">
              <Image
                src={imagePreview}
                alt="Selected Preview"
                className="w-full max-h-64 object-cover rounded-md border border-dark-4 bg-dark-2"
                width={200}
                height={200}
              />
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setImagePreview("");
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}

          {/* Image Upload */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer text-primary-500 hover:font-bold font-semibold flex gap-2"
            >
              <ImagePlus />
              <p>Add Photo</p>
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-primary-500" disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Post Thread"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PostThread;
