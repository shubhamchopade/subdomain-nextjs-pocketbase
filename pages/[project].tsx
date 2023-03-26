import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import PocketBase from "pocketbase";
import { GetServerSideProps } from 'next';
import { authOptions } from './api/auth/[...nextauth]';
import Status from '../components/projects/Status';
import { useRouter } from 'next/router';
import { generateRandomNumber } from '../components/utils/build-helpers';
import { toast } from 'react-toastify';
import Logger from '../components/projects/Logger';

const Project = (props) => {
    const status = JSON.parse(props.status)
    const data = JSON.parse(props.data)
    const router = useRouter()

    const framework = data?.framework
    const projectId = data?.id
    const title = data?.title
    const description = data?.description
    const subdomain = data?.subdomain
    const id = data?.userId;
    const link = data?.link;

    // const [isLoading, setIsLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    console.log("PROJECT-----------", status)


    const pb = new PocketBase("https://pocketbase.techsapien.dev");

    // console.log(props)
    // useEffect(() => {
    //     try {
    //         pb.collection('projectStatus').subscribe(statusId, function (e) {
    //             // console.log(e.record);
    //             setStatus(e.record)
    //         });
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }, [statusId])

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
        console.log(status)

        const cloneRes = await fetch(
            `/api/clone?link=${link}&id=${id}&projectId=${projectId}&statusId=${status.id}`
        );

        if (cloneRes.status == 200) {
            const data = await cloneRes.json();
            console.log("clone logs", JSON.parse(data.logs));

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

        return cloneRes
    };



    // Install dependencies
    const installDependencies = async () => {

        const res = await fetch(
            `/api/install?link=${link}&id=${id}&projectId=${projectId}&statusId=${status.id}`
        );

        if (res.status == 200) {
            const data = await res.json();
            console.log("install logs", JSON.parse(data.logs));
        }

        return res
    };

    // Build dependencies
    const buildDependencies = async () => {

        const res = await fetch(
            `/api/build?link=${link}&id=${id}&projectId=${projectId}&statusId=${status.id}`
        );

        if (res.status == 200) {
            const data = await res.json();
            console.log("build logs", JSON.parse(data.logs));

        } else {
            const data = await res.json();
            console.log("build failed", data);
        }

        return res
    };

    // Start project
    const startProject = async () => {
        const getPort = await pb.collection("subdomains").getFullList({
            sort: "-created",
            projectId: projectId,
        });
        console.log("PROD PORT", getPort[0]?.port);

        const framework = await getFramework()

        const port = getPort[0]?.port;
        console.log("framework", framework)
        if (framework && port) {
            const res = await fetch(
                `/api/start?link=${link}&id=${id}&projectId=${projectId}&port=${port}&subdomain=${subdomain}&framework=${framework.data}&statusId=${status.id}`
            );

            return res
        }

    };

    // Stop the project
    const stopProject = () => {
        const stopProjectCallback = async () => {
            const getPort = await pb.collection("subdomains").getFullList({
                sort: "-created",
                projectId: projectId,
            });
            const port = getPort[0]?.port;
            // console.log("ACTIVE PORT =", port);

            // Kill the port
            if (port && status && framework) {
                const killServerPort = async (port) => {
                    await fetch(
                        `/api/stop?link=${link}&id=${id}&projectId=${projectId}&port=${port}&subdomain=${subdomain}&framework=${framework}&statusId=${status.id}`
                    );
                };
                await killServerPort(port);
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

    // Delete project
    const handleDelete = () => {
        const register = async () => {
            // Kill the port
            const getPort = await pb.collection("subdomains").getFullList({
                sort: "-created",
                projectId: projectId,
            });
            const port = getPort[0]?.port;
            // console.log("card-handleDelete-port", port);

            if (port) {
                // First stop then delete
                // If port then stop and delete
                // else only delete
                stopProject()

                const dangerouslyDeleteProject = async (_port) => {
                    const res = await fetch(
                        `/api/delete?link=${link}&id=${id}&projectId=${projectId}&port=${_port}&subdomain=${subdomain}&framework=${framework}&statusId=${status.id}`
                    );
                    const data = await res.json();
                    if (data) {
                        router.reload()
                    }
                    // console.log(data);
                };
                const stoppedProject = await dangerouslyDeleteProject(port);
                console.log("stoppedProject", stoppedProject);
            } else {
                const dangerouslyDeleteProject = async (_port) => {
                    const res = await fetch(
                        `/api/delete?link=${link}&id=${id}&projectId=${projectId}&port=${_port}&subdomain=${subdomain}&framework=${framework}&statusId=${status.id}`
                    );
                    const data = await res.json();
                    if (data) {
                        router.reload()
                    }
                    // console.log(data);
                };
                const stoppedProject = await dangerouslyDeleteProject(port);
                console.log("stoppedProject", stoppedProject);
            }

        };

        register();
    };

    // Create subdomain entry
    const createSubdomainEntry = async () => {
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
                console.log("SUBDOMAIN DATA", id, subdomain, port, status.id);
                const res = await fetch(
                    `/api/subdomain?link=${link}&id=${id}&projectId=${projectId}&subdomain=${subdomain}&port=${port}&statusId=${status.id}`
                );
                const data = await res.json();
                console.log("NGNX - .conf file created", data);
                toast.success(`Subdomain created ${subdomain}`)
                return res;
            } catch (e) {
                toast.error(`Subdomain already exists, please try again`)
                console.log("ERROR CREATING SUBDOMAIN", e);
                return false;
            }
        };


        return await exists();
    };


    // DEPLOY
    const deploy = async () => {
        setIsLoading(true)
        try {
            const clone = await cloneRepo()
            const subdomain = await createSubdomainEntry()
            const install = await installDependencies()
            const build = await buildDependencies()
            const start = await startProject()
            setIsLoading(false)

            toast.success(`Project deployed successfully`)

        } catch (e) {
            setIsLoading(false)
            toast.error(`Build failed, please check the logs for more info`)
            console.log(e)
        }
    }
    return (
        <div>
            <div className={`card bg-base-200 shadow-xl relative m-4 `}>
                <span
                    className="absolute top-2 right-2 btn btn-xs btn-square btn-outline btn-error"
                >
                    x
                </span>
                <span className="uppercase text-xs font-bold">{framework}</span>
                <div className="card-body">
                    {data?.id && <Link href={`${projectId}`} className="card-title">{title}</Link>}
                    <p>{description}</p>

                    <Status status={status} />

                    <div className="h-5">

                        {false && <progress className="progress progress-primary w-56"></progress>}
                    </div>


                    <a href={`https://${subdomain}.techsapien.dev`} className="link my-2 ml-auto">{subdomain}.techsapien.dev</a>

                    <div className="card-actions">
                        <button onClick={deploy} className="btn btn-primary text-xs btn-xs">
                            DEPLOY
                        </button>
                        <button
                            onClick={createSubdomainEntry}
                            className="btn btn-outline btn-xs"
                        >
                            SUBDOMAIN
                        </button>
                        {/* <button
                            // onClick={installDependencies}
                            className={`btn btn-outline btn-xs`}
                        >
                            INSTALL
                        </button>
                        <button
                            // onClick={buildDependencies}
                            className={`btn btn-outline btn-xs`}
                        >
                            BUILD
                        </button> */}
                        <button
                            // onClick={startProject}
                            className={`btn btn-outline btn-xs`}
                        >
                            START
                        </button>
                        <button
                            // onClick={stopProject}
                            className={`btn btn-outline btn-xs`}
                        >
                            STOP
                        </button>
                        <a href={props.data.link} className="">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="black" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <Logger projectId={projectId} status={status} />
        </div>
    )
}

export default Project


export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const pb = new PocketBase("https://pocketbase.techsapien.dev");

    let session = null;
    let status = null;
    let data = null;
    let logs = null;

    const projectId = context.params?.project;

    try {
        const sessionRes = await getServerSession(
            context.req,
            context.res,
            authOptions
        );

        const projectLogs = await pb
            .collection("projectStatus")
            .getFullList({ projectId }, { $autoCancel: false })

        logs = JSON.stringify({
            current: projectLogs[0].current,
            cloned: projectLogs[0].cloned,
            installed: projectLogs[0].installed,
            built: projectLogs[0].built,
            stopped: projectLogs[0].stopped,
            isOnline: projectLogs[0].isOnline,
            logClone: projectLogs[0].logClone,
            logInstall: projectLogs[0].logInstall,
            logBuild: projectLogs[0].logBuild,
            logStart: projectLogs[0].logStart,
            logStop: projectLogs[0].logStop,
            created: projectLogs[0].created,
        });

        // Get project data
        const records = await pb.collection('projects').getOne(projectId);
        data = JSON.stringify({
            id: records.id,
            title: records.title,
            description: records.description,
            link: records.link,
            framework: records.framework,
            userId: records.userId,
            createdAt: records.createdAt,
            updatedAt: records.updatedAt,
            subdomain: records.subdomain,
        });


        // Get status
        const statusExists = await pb
            .collection("projectStatus")
            .getFullList({ projectId: projectId }, { $autoCancel: false })
        status = JSON.stringify({
            id: statusExists[0].id,
            status: statusExists[0].current,
            cloned: statusExists[0].cloned,
            installed: statusExists[0].installed,
            built: statusExists[0].built,
            stopped: statusExists[0].stopped,
            isOnline: statusExists[0].isOnline,
            timeElapsed: statusExists[0].timeElapsed,
            logClone: statusExists[0].logClone,
            logSubdomain: statusExists[0].logSubdomain,
            logInstall: statusExists[0].logInstall,
            logBuild: statusExists[0].logBuild,
            logStart: statusExists[0].logStart,
        })
        // console.log("GSSR ---------------", cookies);
        session = sessionRes;
    } catch (e) {
        console.log(e);
    }

    // console.log(resultList)

    if (session) {
        return {
            props: {
                user: session?.user,
                status,
                data,
                logs
            },
        };
    }

    return {
        props: {},
    };
};
