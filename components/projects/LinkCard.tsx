import React, { useEffect, useState } from 'react'
import { getRepos } from '../utils/build-helpers'
import PocketBase from "pocketbase";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const LinkCard = (props) => {
    const [repos, setRepos] = useState([])
    const router = useRouter()

    const name = props?.name
    const link = props?.link

    const handleCreateProject = (name, link) => {
        const auth = localStorage.getItem("pocketbase_auth")
        const json = JSON.parse(auth)
        const userId = json?.model?.id
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
        const createProject = async () => {
            if (userId)
                try {
                    // Create project
                    const projectCreated = await pb.collection("projects").create({ subdomain: name, title: name, description: name, link, userId })
                    if (projectCreated.id) {
                        // Create project status
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
                        // Create project metrics
                        const projectMetrics = await pb.collection('deployMetrics').create({
                            "projectId": projectCreated.id,
                            "timeInstall": 0,
                            "timeBuild": 0,
                        }, {
                            "projectId": projectCreated.id
                        });

                        // TODO
                        // 1. DONE - During import process, clone the project first
                        // 2. DONE - Show the SecretsCard component
                        // 3. If the secrets are entered, create an .env file at the project location with the secrets
                        // 4. If successful, redirect to the project page

                        // Clone repo
                        const cloneRes = await fetch(
                            `/api/clone?link=${link}&id=${userId}&projectId=${projectCreated.id}&statusId=${projectStatus.id}`
                        );

                        router.push(`/create/secrets?projectId=${projectCreated.id}&statusId=${projectStatus.id}&name=${name}&id=${userId}`)

                        // toast.success("Project created")
                        // router.push(`${projectCreated.id}?metricId=${projectMetrics.id}&statusId=${projectStatus.id}`)
                    }
                } catch (error) {
                    toast.error("Failed to create project, a project with the same name already exists");
                    console.log(error)
                }
        };

        createProject();
    };

    return (
        <div className='card shadow-md '>
            <div className='flex justify-between'>
                <p className='text-md font-bold ml-4 my-4'>{name}</p>
                <button onClick={() => handleCreateProject(name, link)} className='btn btn-xs m-2'>import</button>
            </div>
        </div>
    )
}

export default LinkCard