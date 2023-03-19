import { FormEventHandler, useState } from "react";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import SignUp from "./signup";
import Login from "./login";

interface Props {}

const SignIn: NextPage = (props): JSX.Element => {
  const [userInfo, setUserInfo] = useState({
    username: "hcadmin",
    password: "hcadmin@Admin@2018",
  });

  const [showSignUp, setShowSignUp] = useState(false);

  console.log(process.env.NODE_ENV);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {showSignUp ? (
          <SignUp setShowSignUp={setShowSignUp} />
        ) : (
          <>
            <Login />
          </>
        )}

        <span className="link mt-8" onClick={() => setShowSignUp(!showSignUp)}>
          {!showSignUp ? "New User?" : "Already have an account?"}
        </span>
      </div>
    </>
  );
};

export default SignIn;
