import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserCard from "@/components/cards/UserCard";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null; //return if there are no user

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding"); // Redirect if user is not yet onboarded

  // Fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="text-center !text-base-regular text-light-3">
            No users
          </p>
        ) : (
          result.users.map((person) => (
            <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType="User"
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
