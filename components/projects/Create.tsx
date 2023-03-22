import { FormEventHandler, useState } from "react";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createUser } from "../../components/utils/pocketbase-api-methods";
import PocketBase from "pocketbase";
import { useRouter } from "next/router";

const defaultValues = {
    title: "",
    description: "",
    status: "",
    subdomain: ""
};

// example create data
const projectStatus = {
    "projectId": "RELATION_RECORD_ID",
    "cloned": true,
    "installed": true,
    "built": true,
    "isOnline": "test",
    "stopped": true,
    "current": "test"
};

const CreateProject: NextPage<any> = (props): JSX.Element => {
    const router = useRouter()
    const [showCreateProject, setShowCreateProject] = useState(false)

    const user = props?.auth?.user

    // console.log(user)
    const formMethods = useForm<any>({
        defaultValues,
    });

    const pb = new PocketBase("https://pocketbase.techsapien.dev");
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        reset,
    } = formMethods;

    const onSubmit: SubmitHandler<any> = (data) => {
        const register = async () => {
            try {
                // Create project
                const projectCreated = await pb.collection("projects").create({ ...data, userId: user.id })
                // Create project status
                if (projectCreated.id) {
                    const projectStatus = await pb.collection('projectStatus').create({
                        "projectId": projectCreated.id,
                        "cloned": false,
                        "installed": false,
                        "built": false,
                        "isOnline": false,
                        "stopped": false,
                        "current": "init"
                    }, {
                        "projectId": projectCreated.id
                    });
                    console.log("projectStatus res", projectStatus)
                }
                // console.log("Project created res", projectCreated)
                toast.success("Project created")
                router.reload()
            } catch (error) {
                const errors = error.data.data
                const keys = Object.keys(errors)
                keys.map(e => toast.error(errors[e].message))
            }
        };

        register();
    };

    const handleShowCreateProject = () => {
        setShowCreateProject(!showCreateProject)
    }

    return (
        <div>
            <p onClick={handleShowCreateProject} className="btn">
                Create Project
            </p>
            {showCreateProject && <div className="flex justify-center items-center">
                <FormProvider {...formMethods}>
                    <form className="form-control max-w-xs">
                        {/* link */}
                        <label htmlFor="link">link</label>
                        <input
                            {...register("link", { required: true })}
                            type="link"
                            className="input input-bordered w-full max-w-xs"
                        />
                        {/* subdomain */}
                        <label htmlFor="subdomain">subdomain</label>
                        <input
                            {...register("subdomain", { required: true })}
                            type="subdomain"
                            className="input input-bordered w-full max-w-xs"
                        />
                        {/* title */}
                        <label htmlFor="title">title</label>
                        <input
                            {...register("title", { required: true })}
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                        />
                        {/* description */}
                        <label htmlFor="description">description</label>
                        <input
                            {...register("description", { required: true })}
                            type="description"
                            className="input input-bordered w-full max-w-xs"
                        />


                        <button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            className="btn btn-primary mt-2"
                        >
                            Create Project
                        </button>
                    </form>
                </FormProvider>
            </div>}
        </div>
    );
};

export default CreateProject;
