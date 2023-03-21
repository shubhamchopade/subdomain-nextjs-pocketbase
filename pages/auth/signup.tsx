import { FormEventHandler, useState } from "react";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createUser } from "../../components/utils/pocketbase-api-methods";

interface Props {
  setShowSignUp: (value: boolean) => void;
}

const defaultValues = {
  username: "",
  password: "",
  email: "",
  name: "",
};

const SignUp: NextPage<Props> = (props): JSX.Element => {
  const formMethods = useForm<any>({
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = formMethods;

  const onSubmit: SubmitHandler<any> = (data) => {
    const register = async () => {
      const response = await createUser({
        email: data.email,
        username: data.username,
        password: data.password,
        passwordConfirm: data.password,
      });
      console.log(response);
      if (response.statuscode === 200) {
        toast.success("User created successfully");
        props.setShowSignUp(false);
      } else {
        toast.error(response.message);
      }
    };

    register();
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-12 mt-4">
        Register Account
      </h1>
      <div className="flex justify-center items-center">
        <FormProvider {...formMethods}>
          <form className="form-control max-w-xs">
            {/* EMAIL */}
            <label htmlFor="email">Email</label>
            <input
              {...register("email", { required: true })}
              type="text"
              placeholder="email"
              className="input input-bordered w-full max-w-xs"
            />
            {/* Username */}
            <label htmlFor="username">Username</label>
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="username"
              className="input input-bordered w-full max-w-xs"
            />
            {/* PASSWORD */}
            <label htmlFor="password">Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="password"
              className="input input-bordered w-full max-w-xs"
            />
            {/* CONFIRM PASSWORD */}
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              name="confirm_password"
              type="password"
              className="input input-bordered w-full max-w-xs"
            />

            {/* LAST NAME */}
            <label htmlFor="name">Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary mt-2"
            >
              Register
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SignUp;
