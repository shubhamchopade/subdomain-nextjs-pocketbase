import { FormEventHandler, useState } from "react";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createUser } from "../../components/utils/pocketbase-api-methods";
import PocketBase from "pocketbase";

const defaultValues = {
  title: "",
  description: "",
  status: "",
};

const CreateProject: NextPage<any> = (props): JSX.Element => {
  const formMethods = useForm<any>({
    defaultValues,
  });

  const pb = new PocketBase("https://pocketbase.techsapien.dev");

  const data = {
    title: "test",
    description: "test",
    subdomain: "test",
    status: "test",
    link: "https://example.com",
  };
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = formMethods;

  const onSubmit: SubmitHandler<any> = (data) => {
    const register = async () => {
      const record = await pb.collection("projects").create(data);
      console.log(record);
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
            {/* title */}
            <label htmlFor="title">title</label>
            <input
              {...register("title", { required: true })}
              type="text"
              placeholder="title"
              className="input input-bordered w-full max-w-xs"
            />
            {/* description */}
            <label htmlFor="description">description</label>
            <input
              {...register("description", { required: true })}
              type="description"
              placeholder="description"
              className="input input-bordered w-full max-w-xs"
            />
            {/* link */}
            <label htmlFor="link">link</label>
            <input
              {...register("link", { required: true })}
              type="link"
              placeholder="link"
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

export default CreateProject;
