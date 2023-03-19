import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface Props {}
interface UserInfo {
  username: string;
  password: string;
}

const defaultValues = {
  username: "",
  password: "",
};

const Login: NextPage<Props> = (props): JSX.Element => {
  const formMethods = useForm<UserInfo>({
    defaultValues,
  });

  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = formMethods;

  const callbackUrl = (router.query.callbackUrl as string) ?? "/";

  const onSubmit: SubmitHandler<UserInfo> = (data) => {
    const loginUser = async () => {
      const response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        callbackUrl,
        redirect: true,
      });

      if (response?.status == 200) {
        toast.success("Login successful");
      }

      if (response?.status == 401) {
        toast.error("Invalid username or password");
      }
    };

    loginUser();
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-12 mt-4">Login</h1>
      <div className="flex justify-center items-center">
        <FormProvider {...formMethods}>
          <form className="form-control max-w-xs">
            {/* EMAIL */}
            <label htmlFor="username">User Name</label>
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

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary mt-2"
            >
              Login
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;
