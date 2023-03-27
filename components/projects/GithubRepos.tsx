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
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
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
                    router.push(`${projectCreated.id}`)
                } catch (error) {
                    toast.error("Failed to create project, a project with the same name already exists");
                    console.log(error)
                }
        };

        register();
    };
    return (
        <div className='mx-auto w-96 grid place-items-center prose mt-12'>
            <svg width="204" height="204" viewBox="0 0 204 204" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="102" cy="102" r="102" fill="white" />
                <path d="M101.632 41.3993C93.7222 41.3993 85.8897 42.9573 78.5818 45.9843C71.2739 49.0114 64.6337 53.4481 59.0405 59.0414C47.7445 70.3374 41.3984 85.6581 41.3984 101.633C41.3984 128.256 58.6855 150.844 82.5984 158.855C85.6101 159.337 86.5738 157.47 86.5738 155.844V145.664C69.889 149.278 66.3352 137.593 66.3352 137.593C63.5645 130.606 59.6493 128.738 59.6493 128.738C54.168 125.004 60.0709 125.124 60.0709 125.124C66.0943 125.546 69.2867 131.328 69.2867 131.328C74.527 140.484 83.3814 137.773 86.8147 136.328C87.3568 132.413 88.9229 129.762 90.6095 128.256C77.2376 126.751 63.2031 121.57 63.2031 98.6214C63.2031 91.9355 65.492 86.5747 69.4072 82.2981C68.8048 80.7922 66.6966 74.5279 70.0095 66.3963C70.0095 66.3963 75.0691 64.77 86.5738 72.5402C91.3323 71.215 96.5124 70.5525 101.632 70.5525C106.752 70.5525 111.932 71.215 116.691 72.5402C128.195 64.77 133.255 66.3963 133.255 66.3963C136.568 74.5279 134.46 80.7922 133.857 82.2981C137.773 86.5747 140.061 91.9355 140.061 98.6214C140.061 121.631 125.967 126.69 112.535 128.196C114.703 130.063 116.691 133.738 116.691 139.339V155.844C116.691 157.47 117.654 159.397 120.726 158.855C144.639 150.784 161.866 128.256 161.866 101.633C161.866 93.7231 160.308 85.8905 157.281 78.5826C154.254 71.2747 149.817 64.6346 144.224 59.0414C138.631 53.4481 131.991 49.0114 124.683 45.9843C117.375 42.9573 109.542 41.3993 101.632 41.3993Z" fill="black" />
            </svg>


            <h1 className='text-center my-8'>These are your github public repositories. Please select the next app you want to import to reactly!</h1>
            <div className=''>
                <label className='text-xs' htmlFor='project-search'>Search github repository</label>
                <input className='input input-bordered bg-base-300 w-full' name="project-search" value={"input"} onChange={() => console.log("clicked")} />
            </div>
            <div className="flex flex-col h-96 overflow-y-auto overflow-x-hidden">
                {
                    repos.map(repo => (
                        <div key={repo.id} className='cursor-pointer hover:ring card bg-base-300 my-2 mx-auto w-11/12' onClick={() => handleCreateProject(repo.name, repo.html_url)}>
                            <LinkCard name={repo.name} link={repo.html_url} />
                        </div>))
                }
            </div>
        </div>
    )
}

export default GithubRepos