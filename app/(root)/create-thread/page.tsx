import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null; //return if there are no user

  const userInfo = await fetchUser(user.id);

  // Redirect if user is not yet onboarded
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="text-heading2-bold text-light-1">Create Thread</h1>
    </div>
  );
};

export default Page;
