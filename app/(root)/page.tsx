import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";

const Home = async () => {
  const result = await fetchThreads(1, 30);
  console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p className="text-center !text-base-regular text-light-3">
            No threads found
          </p>
        ) : (
          <>
            {result.threads.map((thread) => (
              <ThreadCard />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
