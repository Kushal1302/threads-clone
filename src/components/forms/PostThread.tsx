"use client";
import { ThreadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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

const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      userId,
    },
  });

  const onSubmit = async (data: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: data.thread,
      communityId: null,
      userId: data.userId,
      path: pathname,
    });
    router.push("/");
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
          <Button type="submit" className="bg-primary-500">
            Post Thread
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PostThread;
