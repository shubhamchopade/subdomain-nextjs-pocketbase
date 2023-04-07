import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React, { useState } from 'react'
import PocketBase from "pocketbase";
import { GetServerSideProps } from 'next';
import { authOptions } from '../api/auth/[...nextauth]';
import Status from '../../components/projects/Status';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useStatusState } from '../../store/statusState';
import BuildMetrics from '../../components/projects/BuildMetrics';

const Project = (props) => {
    const status = props.status && JSON.parse(props.status)
    const data = props.data && JSON.parse(props.data)
    const projectMetrics = props.projectMetrics && JSON.parse(props.projectMetrics)
    const router = useRouter()

    const framework = data?.framework
    const projectId = data?.id
    const title = data?.title
    const description = data?.description
    const subdomain = data?.subdomain
    const id = data?.userId;
    const link = data?.link;
    const port = data?.port
    const liveStatus = useStatusState()

    const [isLoading, setIsLoading] = useState(false)

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);


    // console.log("METRICS", projectMetrics.id)

    // Clone repo
    const cloneRepo = async () => {
        const cloneRes = await fetch(
            `/api/clone?link=${link}&id=${id}&projectId=${projectId}&statusId=${status.id}`
        );
        return cloneRes
    };



    // Install dependencies
    const installDependencies = async () => {
        const res = await fetch(
            `/api/install?link=${link}&id=${id}&projectId=${projectId}&statusId=${status.id}&metricId=${projectMetrics.id}`
        );
        return res
    };

    // Build dependencies
    const buildDependencies = async () => {
        const res = await fetch(
            `/api/build?link=${link}&id=${id}&projectId=${projectId}&statusId=${status.id}&metricId=${projectMetrics.id}`
        );
        return res
    };

    // Start project
    const startProject = async () => {
        return await fetch(
            `/api/start?link=${link}&id=${id}&projectId=${projectId}&subdomain=${subdomain}&statusId=${status.id}`
        );

    };

    // Delete project
    const handleDelete = async () => {
        const dangerouslyDeleteProject = async () => {
            const res = await fetch(
                `/api/delete?link=${link}&id=${id}&projectId=${projectId}&subdomain=${subdomain}&framework=${framework}&statusId=${status.id}`
            );
            const data = await res.json();
            if (data) {
                router.push("/dashboard")
            }
        };
        const stoppedProject = await dangerouslyDeleteProject();
        console.log("stoppedProject", stoppedProject);
    };

    // Create subdomain entry
    const createSubdomainEntry = async () => {
        const res = await fetch(
            `/api/subdomain?link=${link}&id=${id}&projectId=${projectId}&statusId=${status.id}&subdomain=${subdomain}`
        );

        return res;
    };


    // DEPLOY
    const deploy = async () => {
        setIsLoading(true)
        try {
            // const clone = await cloneRepo()
            const subdomain = await createSubdomainEntry()
            const install = await installDependencies()
            const build = await buildDependencies()
            setIsLoading(false)
            if (build.status == 400) {
                toast.error(`Build failed, please check the logs for more info`)
                return
            }

            const start = await startProject()
            toast.success(`Project deployed successfully`)
        } catch (e) {
            setIsLoading(false)
            toast.error(`Build failed, please check the logs for more info`)
            console.log(e)
        }
    }

    // RE BUILD
    const rebuild = async () => {
        setIsLoading(true)
        try {
            const build = await buildDependencies()
            setIsLoading(false)

            if (build.status == 400) {
                toast.error(`Build failed, please check the logs for more info`)
                return
            }

            toast.success(`Project built successfully`)
        } catch (e) {
            setIsLoading(false)
            toast.error(`Build failed, please check the logs for more info`)
            console.log(e)
        }
    }

    // console.log(liveStatus)
    return (
        <main className='container mx-auto'>
            <div className='breadcrumbs'>
                <ul>
                    <li><Link href={"/dashboard"}>projects</Link></li>
                    <li>{title}</li>
                </ul>
            </div>

            <div className='mb-32 relative container mx-auto'>
                <div className={`card bg-base-400 shadow-xl relative m-16 ${isLoading && "card-project"}`}>


                    <div className="absolute top-2 right-2 ">
                        <span className='btn btn-xs btn-error' onClick={handleDelete}>-</span>
                        <label tabIndex={0} className="btn btn-square btn-ghost" onClick={() => router.push(`${projectId}/settings?name=${title}&id=${id}&statusId=${status.id}&framework=${framework}&port=${port}`)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='fill-base-content' d="M12 15.5C11.0717 15.5 10.1815 15.1313 9.52509 14.4749C8.86871 13.8185 8.49996 12.9283 8.49996 12C8.49996 11.0717 8.86871 10.1815 9.52509 9.52513C10.1815 8.86875 11.0717 8.5 12 8.5C12.9282 8.5 13.8185 8.86875 14.4748 9.52513C15.1312 10.1815 15.5 11.0717 15.5 12C15.5 12.9283 15.1312 13.8185 14.4748 14.4749C13.8185 15.1313 12.9282 15.5 12 15.5ZM19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.4796 2.30222 14.4183 2.19543 14.3268 2.11855C14.2353 2.04168 14.1195 1.99968 14 2H9.99996C9.74996 2 9.53996 2.18 9.49996 2.42L9.12996 5.07C8.49996 5.32 7.95996 5.66 7.43996 6.05L4.94996 5.05C4.72996 4.96 4.45996 5.05 4.33996 5.27L2.33996 8.73C2.20996 8.95 2.26996 9.22 2.45996 9.37L4.56996 11C4.52996 11.34 4.49996 11.67 4.49996 12C4.49996 12.33 4.52996 12.65 4.56996 12.97L2.45996 14.63C2.26996 14.78 2.20996 15.05 2.33996 15.27L4.33996 18.73C4.45996 18.95 4.72996 19.03 4.94996 18.95L7.43996 17.94C7.95996 18.34 8.49996 18.68 9.12996 18.93L9.49996 21.58C9.53996 21.82 9.74996 22 9.99996 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.67 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z" />
                            </svg>
                        </label>
                    </div>

                    <span className="uppercase text-xs font-bold">{framework}</span>
                    <div className="card-body">
                        {data?.id && <p className="card-title">{title}</p>}
                        <p>{description}</p>
                        <div className="h-5">
                            {isLoading && <progress className="progress progress-primary w-56"></progress>}
                        </div>

                        {!isLoading && <BuildMetrics metrics={projectMetrics} />}

                        <a href={`https://${subdomain}.techsapien.dev`} className="link my-2 ml-auto">{subdomain}.techsapien.dev</a>

                        <div className="card-actions">
                            <button onClick={deploy} className={`btn btn-primary text-xs btn-xs ${status?.isOnline && "hidden"} ${isLoading && "loading disabled"}`}>
                                DEPLOY
                            </button>
                            {status?.isOnline && <button onClick={rebuild} className={`btn btn-primary text-xs btn-xs ${isLoading && "loading disabled"}`}>
                                RE-BUILD
                            </button>}
                        </div>
                    </div>
                </div>
                {status && <Status status={status} />}

                {/* <Logger projectId={projectId} status={status} /> */}
            </div>
        </main>

    )
}

export default Project


export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    let session = null;
    let status = null;
    let projectMetrics = null;
    let data = null;

    const projectId = context.params?.project;

    const metricId = context.query.metricId

    console.log("METRIC ID", metricId)

    try {
        const sessionRes = await getServerSession(
            context.req,
            context.res,
            authOptions
        );

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
            port: records.port,
        });


        // Get status
        const statusExists = await pb
            .collection("projectStatus")
            .getFullList({ projectId: projectId }, { $autoCancel: false })
        status = JSON.stringify({
            id: statusExists[0].id,
            status: statusExists[0].current,
            cloned: statusExists[0].cloned,
            subdomain: statusExists[0].subdomain,
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

        // Get metrics
        const deployMetrics = await pb
            .collection("deployMetrics")
            .getFullList({ projectId: projectId }, { $autoCancel: false })
        projectMetrics = JSON.stringify({
            id: deployMetrics[0].id,
            timeInstall: deployMetrics[0].timeInstall,
            timeBuild: deployMetrics[0].timeBuild,
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
                projectMetrics
            },
        };
    }

    return {
        props: {},
    };
};
