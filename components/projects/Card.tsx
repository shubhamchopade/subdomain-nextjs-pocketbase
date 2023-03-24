import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { generateRandomNumber } from "../utils/build-helpers";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Status from "./Status";

const Card = (props) => {
    const project = props.project;
    const router = useRouter()
    const id = props.userId;
    const projectId = project.id;
    const link = project.link;
    const subdomain = project.subdomain;
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(null)

    const pb = new PocketBase("https://pocketbase.techsapien.dev");

    // get id for this project status collection
    useEffect(() => {
        const getStatusId = async () => {
            try {
                const statusExists = await pb
                    .collection("projectStatus")
                    .getFullList({ projectId: projectId }, { $autoCancel: false })
                // console.log(statusExists[0])
                setStatus(statusExists[0])
                return statusExists[0]
            } catch (e) {
                console.error("statusExists error");
                return null
            }
        };
        getStatusId()
    }, [])

    // Get the framework
    const getFramework = async () => {
        const res = await fetch(
            `/api/framework?link=${link}&id=${id}&projectId=${projectId}`
        );
        const data = await res.json();
        return data
    }

    // Clone repo
    const cloneRepo = async () => {
        setIsLoading(true)
        console.log(status)

        const cloneRes = await fetch(
            `/api/clone?link=${link}&id=${id}&projectId=${projectId}`
        );
        if (cloneRes) {
            setIsLoading(false)
        }

        if (cloneRes.status == 200) {
            if (status) {
                const projectStatusRes = await pb.collection('projectStatus').update(status.id, {
                    cloned: true
                })
                console.log(projectStatusRes)
            }

            // Call getFramework() API
            const framework = await getFramework()
            console.log(framework)

            if (framework) {
                const frameworkRes = await pb.collection('projects').update(projectId, {
                    framework: framework.data
                })
                console.log(frameworkRes)
            }
        }

        if (status) {
            const res = await pb.collection('projectStatus').update(status.id, {
                cloned: true
            })
            console.log("cloned", res)
        }
    };



    // Install dependencies
    const installDependencies = async () => {
        setIsLoading(true)
        const res = await fetch(
            `/api/install?link=${link}&id=${id}&projectId=${projectId}`
        );
        if (res) {
            setIsLoading(false)
        }
        if (res.status == 200) {
            if (status) {
                const res = await pb.collection('projectStatus').update(status.id, {
                    installed: true
                })
                console.log("Installed", res)
            }
        }
        const data = await res.json();
        console.log(data);
    };

    // Build dependencies
    const buildDependencies = async () => {
        setIsLoading(true)
        const res = await fetch(
            `/api/build?link=${link}&id=${id}&projectId=${projectId}`
        );
        if (res) {
            setIsLoading(false)
        }

        if (res.status == 200) {
            if (status) {
                const res = await pb.collection('projectStatus').update(status.id, {
                    built: true
                })
                console.log("built", res)
            }
        }

        const data = await res.json();
        console.log("build", data);
    };

    // Start project
    const startProject = async () => {
        const getPort = await pb.collection("subdomains").getFullList({
            sort: "-created",
            projectId: projectId,
        });
        console.log("DEV PORT", getPort[0].port);

        const port = getPort[0].port;
        const res = await fetch(
            `/api/start?link=${link}&id=${id}&projectId=${projectId}&port=${port}`
        );

        if (res.status == 200) {
            if (status) {
                const res = await pb.collection('projectStatus').update(status.id, {
                    isOnline: true,
                    stopped: false
                })
                console.log("isOnline", res)
            }
        }
        const data = await res.json();
        console.log(data);
    };

    // Stop the project
    const stopProject = () => {

        const stopProjectCallback = async () => {
            // Kill the port
            const getPort = await pb.collection("subdomains").getFullList({
                sort: "-created",
                projectId: projectId,
            });
            const port = getPort[0]?.port;
            console.log("ACTIVE PORT =", port);

            if (port && status) {
                const killServerPort = async (port) => {
                    const res = await fetch(
                        `/api/stop?link=${link}&id=${id}&projectId=${projectId}&port=${port}&subdomain=${subdomain}`
                    );
                    const data = await res.json();
                    console.log(data);
                };
                const killedPort = await killServerPort(port);
                console.log("killedPort STOP", killedPort);


                const projectStatusRes = await pb.collection('projectStatus').update(status.id, {
                    stopped: true,
                    isOnline: false
                })
                console.log("PK - STOP", projectStatusRes)

            }
        }

        stopProjectCallback()
    }

    // Start dev mode
    const startDevMode = async () => {
        // Get the port from API
        const getPort = await pb.collection("subdomains").getFullList({
            sort: "-created",
            projectId: projectId,
        });
        console.log("DEV PORT", getPort[0].port);

        const port = getPort[0].port;

        const res = await fetch(
            `/api/dev?link=${link}&id=${id}&projectId=${projectId}&port=${port}`
        );
        const data = await res.json();
        console.log("started dev server 🫶 >>>>", data);
    };

    const handleDelete = () => {
        const register = async () => {
            // Kill the port
            const getPort = await pb.collection("subdomains").getFullList({
                sort: "-created",
                projectId: projectId,
            });
            const port = getPort[0]?.port;
            console.log("card-handleDelete-port", port);

            if (port) {
                // First stop then delete
                // If port then stop and delete
                // else only delete
                stopProject()

                const dangerouslyDeleteProject = async (port) => {
                    const res = await fetch(
                        `/api/delete?link=${link}&id=${id}&projectId=${projectId}&port=${port}&subdomain=${subdomain}`
                    );
                    const data = await res.json();
                    console.log(data);
                };
                const stoppedProject = await dangerouslyDeleteProject(port);
                console.log("stoppedProject", stoppedProject);
            } else {
                const dangerouslyDeleteProject = async (port) => {
                    const res = await fetch(
                        `/api/delete?link=${link}&id=${id}&projectId=${projectId}&port=${port}&subdomain=${subdomain}`
                    );
                    const data = await res.json();
                    console.log(data);
                };
                const stoppedProject = await dangerouslyDeleteProject(port);
                console.log("stoppedProject", stoppedProject);
            }

            // delete from pocketbase
            const deleted = await pb.collection("projects").delete(project.id);
            console.log("deleted from supabase", deleted);


            if (deleted) {
                router.reload()
            }
        };

        register();
    };

    const createSubdomainEntry = () => {
        // Generate a random port number
        const port = generateRandomNumber();
        // Check if the ports exists in DB
        const exists = async () => {
            try {
                const portExists = await pb
                    .collection("subdomains")
                    .getFirstListItem(`port = ${port}`);
                console.log("portExists", portExists);
                return false;
            } catch (e) {
                // if exists, generate again
                console.log("Port already in use, assigning new");
                // else create a new entry in subdomains
                return create(port);
            }
        };

        // create a new entry in subdomains
        const create = async (port) => {
            try {
                const created = await pb
                    .collection("subdomains")
                    .create({ projectId, port, name: subdomain });
                console.log("PK - SUBDOMAIN CREATED", created);
                const res = await fetch(
                    `/api/subdomain?link=${link}&id=${id}&projectId=${projectId}&subdomain=${subdomain}&port=${port}`
                );
                const data = await res.json();
                console.log("NGNX - .conf file created", data);
                toast.success(`CLIent - Subdomain created ${subdomain}`)
                return res;
            } catch (e) {
                console.log("CLIent - ERROR CREATING SUBDOMAIN", e);
                return false;
            }
        };
        exists();
    };
    return (
        <div>
            <div className={`card max-w-xl bg-base-200 shadow-xl relative m-4 ${isLoading && "animate-pulse"}`}>
                <span
                    onClick={handleDelete}
                    className="absolute top-2 right-2 btn btn-xs btn-square btn-outline btn-error"
                >
                    x
                </span>
                <span className="uppercase text-xs font-bold">{props?.project?.framework}</span>
                <div className="card-body">
                    <h2 className="card-title">{props.project.title}</h2>
                    <p>{props.project.description}</p>

                    {status && <Status status={status} />}

                    <div className="h-5">

                        {isLoading && <progress className="progress progress-primary w-56"></progress>}
                    </div>


                    <a href={`https://${props.project.subdomain}.techsapien.dev`} className="link my-2 ml-auto">{props.project.subdomain}.techsapien.dev</a>

                    <div className="card-actions">
                        <button onClick={cloneRepo} className="btn btn-outline text-xs btn-xs">
                            CLONE
                        </button>
                        <button
                            onClick={installDependencies}
                            className={`btn btn-outline btn-xs`}
                        >
                            INSTALL
                        </button>
                        <button
                            onClick={buildDependencies}
                            className={`btn btn-outline btn-xs`}
                        >
                            BUILD
                        </button>
                        <button
                            onClick={createSubdomainEntry}
                            className="btn btn-outline btn-xs"
                        >
                            SUBDOMAIN
                        </button>
                        <button
                            onClick={startProject}
                            className={`btn btn-outline btn-xs`}
                        >
                            START
                        </button>
                        <button
                            onClick={stopProject}
                            className={`btn btn-outline btn-xs`}
                        >
                            STOP
                        </button>

                        <button onClick={startDevMode} className="btn btn-outline btn-xs">
                            DEV
                        </button>
                        <a href={props.project.link} className="">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="black" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
