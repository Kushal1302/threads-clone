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
  const [files, setFiles] = useState<File[]>([]); // Array to store multiple files
  const [previews, setPreviews] = useState<string[]>([]); // Array for previews
  const { startUpload } = useUploadThing("media");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      userId,
      imageUrls: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ThreadValidation>) => {
    setIsLoading(true);

    let uploadedUrls: string[] = [];

    try {
      // Check if there are files to upload
      if (previews.length > 0 && files.length > 0) {
        const imgRes = await Promise.all(
          files.map((file) => startUpload([file]))
        );

        // Process responses to extract URLs and filter out undefined
        uploadedUrls = imgRes
          .flat() // Flatten nested arrays if startUpload returns arrays
          .map((file) => file?.url) // Map to extract URLs
          .filter((url): url is string => url !== undefined); // Filter undefined values
      }

      console.log("Uploaded URLs:", uploadedUrls);

      // Create a thread with the uploaded URLs
      await createThread({
        text: data.thread,
        communityId: null,
        userId: data.userId,
        path: pathname,
        imageUrls: uploadedUrls, // Save all URLs as a comma-separated string
      });
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error uploading files or creating thread:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files); // Convert FileList to array
      setFiles((prev) => [...prev, ...selectedFiles]);
      console.log(selectedFiles);

      const newPreviews = selectedFiles.map((file) => {
        if (file.type.includes("image")) {
          return URL.createObjectURL(file); // Image preview URL
        } else if (file.type.includes("video")) {
          return URL.createObjectURL(file); // Video preview URL
        }
        return ""; // Fallback for unsupported file types
      });

      setPreviews((prev) => [...prev, ...newPreviews]); // Append new previews
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index)); // Remove file from array
    setPreviews((prev) => prev.filter((_, i) => i !== index)); // Remove preview from array
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
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Media Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  {files[index]?.type.includes("video") ? (
                    <video
                      controls
                      className="w-full max-h-64 object-cover rounded-md border border-dark-4 bg-dark-2"
                    >
                      <source src={preview} type={files[index]?.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={preview}
                      alt="Media Preview"
                      className="w-full max-h-64 object-cover rounded-md border border-dark-4 bg-dark-2"
                      width={200}
                      height={200}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)} // Remove file on click
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* File Upload */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="mediaUpload"
              className="cursor-pointer text-primary-500 hover:font-bold font-semibold flex gap-2"
            >
              <ImagePlus />
              <p>Add Media</p>
            </label>
            <input
              type="file"
              id="mediaUpload"
              accept="image/*" // Accept images and videos
              onChange={handleChange}
              className="hidden"
              multiple // Allow multiple file uploads
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
