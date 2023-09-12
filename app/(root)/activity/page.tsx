import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null; //return if there are no user

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding"); // Redirect if user is not yet onboarded

  // getActivity or getNotifications actions

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
    </section>
  );
};

export default Page;
