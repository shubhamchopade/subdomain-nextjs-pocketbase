import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";

const Navbar = () => {
  const session = useSession();

  const handleSignin = async () => {
    signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      username: "",
      password: "",
    });
  };
  const handleSignOut = async () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
        </div>
        {session.data && (
          <Link className="flex-1 text-purple-500" href={"/dashboard"}>
            Dashboard
          </Link>
        )}
        <div className="flex-none">
          {session.data ? (
            <button className="btn" onClick={handleSignOut}>
              SIGN OUT
            </button>
          ) : (
            <button className="btn" onClick={handleSignin}>
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
