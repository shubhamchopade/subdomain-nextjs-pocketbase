import React, { useEffect, useState } from "react";
import { getRepos, getUserRepos } from "../utils/build-helpers";
import PocketBase from "pocketbase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import LinkCard from "./LinkCard";
import Link from "next/link";

const GithubRepos = () => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleRepos = async () => {
    const auth = localStorage.getItem("pocketbase_auth");
    const json = JSON.parse(auth);
    const username = json?.model?.username;
    const userId = json?.model?.id;
    // console.log(username);
    if (username) {
      const reposRes = await getRepos(username);
      console.log(reposRes);
      const records = await pb.collection("projects").getFullList(
        {
          userId,
        },
        { $autoCancel: false }
      );
      // if html_url is in records, then remove it from reposRes
      const filteredRepos = reposRes.filter((repo: any) => {
        return !records.find((record: any) => record.link === repo.html_url);
      });
      setRepos(filteredRepos);

      // const filteredRepos = reposRes;
      // only include repos that whose title consists of keywords like "react", "next", "remix"
      // const filteredRepos2 = filteredRepos.filter((repo: any) => {
      //   return (
      //     repo.name.toLowerCase().includes("react") ||
      //     repo.name.toLowerCase().includes("next") ||
      //     repo.name.toLowerCase().includes("remix")
      //   );
      // });

      // setRepos(filteredRepos2);
    }
  };

  useEffect(() => {
    handleRepos();
  }, []);

  const handleSearchRepo = async (e: any) => {
    setSearchQuery(e.target.value);
    const filteredResults = repos.filter((repo: any) => {
      return repo.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    if (e.target.value === "") {
      handleRepos();
    }
    setRepos(filteredResults);
  };

  return (
    <main className="container mx-auto">
      <div className="mx-auto w-96 grid place-items-center prose mt-4 mb-8">
        <div className="bg-white rounded-full">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="fill-black"
              d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z"
            />
          </svg>
        </div>

        <h1 className="my-2">
          These are your github public repositories. Please select the next app
          you want to import to reactly!
        </h1>
        <p className="my-2">
          Please note - repositories greater than 50 MB are not yet supported.
        </p>

        <input
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={handleSearchRepo}
        />

        <div className="flex flex-col h-96 overflow-y-auto overflow-x-hidden">
          {repos.map((repo) => (
            <div key={repo.id} className="my-2 mx-auto w-11/12">
              <LinkCard
                name={repo.name}
                link={repo.html_url}
                size={repo.size}
                stars={repo.stargazers_count}
                forks={repo.forks_count}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default GithubRepos;
