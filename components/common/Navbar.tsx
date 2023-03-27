import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const session = useSession();
  const [userData, setUserData] = useState({})

  const handleSignin = async () => {
    signIn("github", { redirect: true, callbackUrl: "/" });
  };
  const handleSignOut = async () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  useEffect(() => {
    setUserData(session.data?.user)
  }, [session])

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">TechSapien</a>
      </div>
      {session.data && (
        <div className="flex-1">
          <Link className="flex-1 link" href={"/dashboard"}>
            Dashboard
          </Link>
          <Link className="flex-1 link" href={"/create"}>
            Create
          </Link>
        </div>
      )}
      <div className="flex-none">

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <Image width={50} height={50} className='rounded-full' src={userData?.picture} alt="Shoes" />
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
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
  );
};

export default Navbar;
