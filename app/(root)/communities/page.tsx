import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null; //return if there are no user

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding"); // Redirect if user is not yet onboarded

  // Fetch communities
  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p className="text-center !text-base-regular text-light-3">
            No users
          </p>
        ) : (
          result.communities.map((community) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              imgUrl={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
