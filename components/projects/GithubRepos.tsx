import React, { useState } from 'react'
import { getRepos } from '../utils/build-helpers'

const GithubRepos = () => {
    const [repos, setRepos] = useState([])
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
    return (
        <div><button className='btn' onClick={handleRepos}>Github Repos</button>

            {
                repos.map(repo => (
                    <div key={repo.id} className='card w-40 bg-base-100 shadow-xl'>
                        <p>{repo.name}</p>
                        <p>{repo.fullname}</p>
                        <p>{repo.git_url}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default GithubRepos