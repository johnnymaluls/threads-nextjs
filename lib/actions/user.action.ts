"use server";

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
