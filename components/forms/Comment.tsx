"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommentValidation } from "@/lib/validations/thread";
//import { createThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    alert("submit clicked");
    // await addCommentToThread(
    //   threadId,
    //   values.thread,
    //   JSON.parse(currentUserId),
    //   pathname
    // );

    // form.reset();

    // router.push("/");
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="mt-10 flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="w-full flex items-center gap-3">
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt="profile-image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-light-1 outline-none"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="rounded-3xl bg-primary-500 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full"
          >
            Reply
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Comment;
