import React, { useState } from 'react'
import { getRepos } from '../utils/build-helpers'
import PocketBase from "pocketbase";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const GithubRepos = () => {
    const [repos, setRepos] = useState([])
    const router = useRouter()
    const handleRepos = async () => {
        const auth = localStorage.getItem("pocketbase_auth")
        const json = JSON.parse(auth)
        const username = json?.model?.username
        // console.log(JSON.parse(auth))
        // get userid then username
        // get username here
        if (username) {
            const reposRes = await getRepos('shubhamchopade')
            setRepos(reposRes)
            console.log(repos)
        }
    }

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
                    // console.log("Project created res", projectCreated)
                    toast.success("Project created")
                    router.reload()
                } catch (error) {
                    console.log(error)
                    // const errors = error?.data?.data
                    // const keys = Object.keys(errors)
                    // keys.map(e => toast.error(errors[e].message))
                }
        };

        register();
    };
    return (
        <div><button className='btn' onClick={handleRepos}>Github Repos</button>

            <div className="overflow-x-auto">
                <table className="table-xs w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {
                            repos.map(repo => (
                                <tr>
                                    <th>{repo.id}</th>
                                    <td>{repo.name}</td>
                                    <td>{repo.fullname}</td>
                                    {/* TODO - Trigger create project for this repo! */}
                                    <td><p className='btn btn-primary btn-xs' onClick={() => handleCreateProject(repo.name, repo.html_url)}>USE THIS</p></td>
                                </tr>))
                        }
                    </tbody>
                </table>
            </div>

            {/*            
                    <div key={repo.id} className='card w-40 bg-base-100 shadow-xl'>
                        <p>{repo.name}</p>
                        <p>{repo.fullname}</p>
                        <p>{repo.git_url}</p>
                    </div> */}

        </div>
    )
}

export default GithubRepos