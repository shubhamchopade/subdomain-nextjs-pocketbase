import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React, { useState } from 'react'
import PocketBase from "pocketbase";
import { GetServerSideProps } from 'next';
import { authOptions } from './api/auth/[...nextauth]';
import Status from '../components/projects/Status';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useStatusState } from '../store/statusState';
import BuildMetrics from '../components/projects/BuildMetrics';

const Project = (props) => {
    const status = JSON.parse(props.status)
    const data = JSON.parse(props.data)
    const projectMetrics = JSON.parse(props.projectMetrics)
    const router = useRouter()

    const framework = data?.framework
    const projectId = data?.id
    const title = data?.title
    const description = data?.description
    const subdomain = data?.subdomain
    const id = data?.userId;
    const link = data?.link;
    const liveStatus = useStatusState()

    const [isLoading, setIsLoading] = useState(false)

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);


    console.log("METRICS", projectMetrics.id)

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
            const clone = await cloneRepo()
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

    console.log(liveStatus)
    return (
        <div className='mb-32 relative'>
            <div className={`card bg-base-400 shadow-xl relative m-16 ${isLoading && "card-project"}`}>
                <span
                    onClick={handleDelete}
                    className="absolute top-2 right-2 btn btn-xs btn-square btn-outline btn-error"
                >
                    x
                </span>
                <span className="uppercase text-xs font-bold">{framework}</span>
                <div className="card-body">
                    {data?.id && <Link href={`${projectId}`} className="card-title">{title}</Link>}
                    <p>{description}</p>



                    <div className="h-5">
                        {isLoading && <progress className="progress progress-primary w-56"></progress>}
                    </div>

                    {!isLoading && <BuildMetrics metrics={projectMetrics} />}

                    <a href={`https://${subdomain}.techsapien.dev`} className="link my-2 ml-auto">{subdomain}.techsapien.dev</a>

                    <div className="card-actions">
                        <button onClick={deploy} className={`btn btn-primary text-xs btn-xs ${status.isOnline && "hidden"} ${isLoading && "loading disabled"}`}>
                            DEPLOY
                        </button>
                    </div>
                </div>
            </div>
            {status && <Status status={status} />}

            {/* <Logger projectId={projectId} status={status} /> */}
        </div>
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
