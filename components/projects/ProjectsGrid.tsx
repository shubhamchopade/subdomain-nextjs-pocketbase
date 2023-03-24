import React, { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';

// Fetch all the projects

const ProjectsGrid = (props) => {
    const pb = new PocketBase('https://pocketbase.techsapien.dev');
    const [allProjects, setAllProjects] = React.useState([])
    const [_userId, setUserId] = useState("")

    useEffect(() => {
        const auth = localStorage.getItem("pocketbase_auth")
        const json = JSON.parse(auth)
        const userId = json?.model?.id
        setUserId(userId)
        const getProjects = async () => {
            const records = await pb.collection('projects').getFullList({
                userId
            }, { $autoCancel: false });
            setAllProjects(records)
            // console.log(records)
        }

        getProjects()
    }, [])

    console.log(allProjects)

    return (
        <div className='flex flex-wrap'>{allProjects && allProjects.map(project => (
            <Card userId={_userId} key={project.id} project={project} />
        ))}</div>
    )
}

export default ProjectsGrid