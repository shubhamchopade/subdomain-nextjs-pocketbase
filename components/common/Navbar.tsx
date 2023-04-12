import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const session = useSession();
  const isLoggedOut = session.data == null || session.data == undefined;
  const [userData, setUserData] = useState({});
  const [loading, progress] = useStore((state) => [
    state.loading,
    state.progress,
  ]);

  const handleSignin = async () => {
    signIn("github", { redirect: true, callbackUrl: "/" });
  };
  const handleSignOut = async () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  useEffect(() => {
    setUserData(session.data?.user);
  }, [session]);

  return (
    <>
      {loadingProgressBar(loading, progress)}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">TechSapien</a>
        </div>
        {session.data && (
          <div className="flex">
            <Link
              className={`btn btn-primary btn-sm mx-4 ${
                isLoggedOut && "hidden"
              }`}
              href={"/projects/create"}
            >
              Create new project
            </Link>
            <Link className="link" href={"/projects"}>
              Projects
            </Link>
          </div>
        )}
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <Image
                  width={50}
                  height={50}
                  className="rounded-full"
                  src={
                    userData?.picture || "https://avatar.vercel.sh/shubham.svg"
                  }
                  alt="profilepic"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <p className="text-sm">{userData?.name}</p>
              </li>
              <li>
                {session.data ? (
                  <button className="btn" onClick={handleSignOut}>
                    SIGN OUT
                  </button>
                ) : (
                  <button className="btn" onClick={handleSignin}>
                    SIGN IN
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

function loadingProgressBar(loading: boolean, progress: number) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ width: 0, height: 5 }}
          animate={{ width: progress + "%" }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-secondary animate-pulse fixed top-0"
        />
      )}
    </AnimatePresence>
  );
}
