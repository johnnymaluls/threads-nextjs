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

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDatabase();

  // Calculate the number of threads to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the threads that have no parent (top-level threads) (a thread that is not a comment/reply).
  const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level threads i.e., threads that are not comments.
  const totalThreadsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of threads

  const threads = await threadsQuery.exec();

  const isNext = totalThreadsCount > skipAmount + threads.length;

  return { threads, isNext };
}
