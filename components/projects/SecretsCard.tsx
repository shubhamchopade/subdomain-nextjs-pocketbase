import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-toastify'

const SecretsCard = (props) => {
    const { projectId, statusId, metricId, name, id } = props
    const [secretText, setSecretText] = React.useState('')
    const router = useRouter()
    const redirectLink = `/${projectId}?statusId=${statusId}&name=${name}&id=${id}&metricId=${metricId}`

    // TODO: Call /api/secret api and send the secretText as payload

    const handleCreateEnv = async () => {
        const res = await fetch(`/api/secret?id=${id}&projectId=${projectId}&statusId=${statusId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: secretText
            })
        })

        if (res.status == 200) {
            router.push(redirectLink)
        } else {
            toast.error('Something went wrong')
        }

        const data = await res.json()
        console.log(data)
    }


    return (
        <div className='card rounded shadow-md bg-base-200 max-w-xl mx-auto my-8 p-4'>
            <div className='breadcrumbs'>
                <ul>
                    <li>projects</li>
                    <li>{projectId}</li>
                    <li>{name}</li>
                </ul>
            </div>
            <p className='text-'>Please paste the contents of your .env file if you have any and save the secrets.</p>
            <div className='mt-8 mb-4 flex flex-col'>
                <label htmlFor="secrets-card">Secrets</label>
                <textarea name="secrets-card" className='textarea textarea-bordered' value={secretText} onChange={e => setSecretText(e.target.value)} />

                <div className='flex justify-between'>
                    <Link href={redirectLink} className='btn btn-ghost btn-sm mt-4'>I don't have .env file</Link>
                    <button onClick={handleCreateEnv} className='btn btn-primary btn-sm mt-4 w-32'>Save</button>
                </div>

            </div>
        </div>
    )
}

export default SecretsCard