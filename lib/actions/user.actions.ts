"use server";

import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDatabase();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true } //upsert means update and insert. will update if row exists, will insert a new row if not
    );

    if (path === "/profile/edit") {
      // to revalidate data associated with a specific path
      // useful for scenarios where you want to update your cached data without waiting for a revalidation period to expire
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDatabase();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model:
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy: SortOrder;
}) {
  try {
    connectToDatabase();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i"); // case insensitive regex
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // $ne = not equal to the current user
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUserCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    connectToDatabase();

    //Find all threads authored by user with the given userId

    // TODO: Populate community
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDatabase();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies id) from the 'children'
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const sortBy: SortOrder = "desc";
    const sortOptions = { createdAt: sortBy };

    // Collect all the replies where id is in childThreadIds and author is not equal to the userId ( current user )
    // This will simply find all the comments the user received from their threads
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    })
      .sort(sortOptions)
      .populate({
        path: "author",
        model: User,
        select: "name image _id",
      });

    console.log(replies);
    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user activity: ${error.message}`);
  }
}
