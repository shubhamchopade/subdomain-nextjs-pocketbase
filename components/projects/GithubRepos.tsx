import React, { useEffect, useState } from 'react'
import { getRepos } from '../utils/build-helpers'
import PocketBase from "pocketbase";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import LinkCard from './LinkCard';

const GithubRepos = () => {
    const [repos, setRepos] = useState([])
    const router = useRouter()

    const handleRepos = async () => {
        const auth = localStorage.getItem("pocketbase_auth")
        const json = JSON.parse(auth)
        const username = json?.model?.username

        if (username) {
            const reposRes = await getRepos(username)
            setRepos(reposRes)
            console.log(repos)
        }
    }

    useEffect(() => {
        handleRepos()
    }, [])

    const handleCreateProject = (name, link) => {
        const auth = localStorage.getItem("pocketbase_auth")
        const json = JSON.parse(auth)
        const userId = json?.model?.id
        const pb = new PocketBase("https://pocketbase.techsapien.dev");
        const register = async () => {
            if (userId)
                try {
                    // Create project
                    const projectCreated = await pb.collection("projects").create({ subdomain: name, title: name, description: name, link, userId })
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
                    toast.success("Project created")
                    router.push('/dashboard')
                } catch (error) {
                    toast.error("Failed to create project, a project with the same name already exists");
                    console.log(error)
                }
        };

        register();
    };
    return (
        <div className='mx-auto w-96 grid place-items-center'>
            <div className=''>
                <label htmlFor='project-search'>Search github repository</label>
                <input className='input input-bordered w-full' name="project-search" value={"input"} onChange={() => console.log("clicked")} />
            </div>
            <div className="flex  flex-col h-96 overflow-y-auto overflow-x-hidden">
                {
                    repos.map(repo => (
                        <div key={repo.id} className='cursor-pointer hover:scale-105 bg-gray-700' onClick={() => handleCreateProject(repo.name, repo.html_url)}>
                            <LinkCard name={repo.name} link={repo.html_url} />
                        </div>))
                }
            </div>
        </div>
    )
}

export default GithubRepos