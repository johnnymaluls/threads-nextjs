"use server"; //important to add because we can't directly create database actions in client side reason CORS
//Cross Origin Request doesn't allow it
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: Params): Promise<void> => {
  try {
    connectToDatabase();
    const createdThread = await Thread.create({
      text,
      author,
      community: communityId,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);

    // Update community model
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
};
