import React, { useEffect } from 'react'
import Pocketbase from 'pocketbase'
import { useDebounce } from '../../hooks/useDebounce'

const Subdomain = (props) => {
    const { name, projectId } = props
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL)


    const [newSubdomainName, setNewSubdomainName] = React.useState('')
    const [subdomainAvailable, setSubdomainAvailable] = React.useState(false)
    const [isSearching, setIsSearching] = React.useState(false);

    const debouncedSearchTerm = useDebounce(newSubdomainName, 500);

    // TODO-
    // 1a. Disable the systemctl process
    // 1b. Remove nginx config file
    // 2a. Enable the systemctl process with new subdomain name
    // 2b. Create new nginx config file

    useEffect(() => {
        // console.log(debouncedSearchTerm)
        if (debouncedSearchTerm.length > 0) {
            searchSubdomain(debouncedSearchTerm)
        }

        if (debouncedSearchTerm.length === 0) {
            setSubdomainAvailable(false)
        }
    }, [debouncedSearchTerm])

    const searchSubdomain = async (name: string) => {
        // Check if subdomain name exists in DB
        try {
            setIsSearching(true)
            const res = await pb.collection('subdomains').getFirstListItem(`name="${name}"`)
            console.log(name, "already exists")
            setSubdomainAvailable(false)
            setIsSearching(false)
        } catch (e) {
            console.log(name, "is available")
            setSubdomainAvailable(true)
        }
    }



    return (
        <div>
            <div className='card bg-base-200 shadow-md max-w-xl mx-auto my-2'>
                <div className='card-body'>
                    <h2 className='card-title'>Subdomain</h2>
                    <p className='card-subtitle'>You can use a custom subdomain for your project</p>
                    <div className='form-control'>
                        <label htmlFor='subdomain-editor' className='label w-64'>
                            <span className='label-text'>Subdomain</span>
                            <span hidden={debouncedSearchTerm.length === 0} className='label-text-alt'>{subdomainAvailable ? "available" : "not available"}</span>
                        </label>
                        <div className='flex items-center'>
                            <input name="subdomain-editor" type="text" placeholder={name} value={newSubdomainName} onChange={e => setNewSubdomainName(e.target.value.toLowerCase())}
                                className={`input input-bordered ${subdomainAvailable && "ring-2 ring-green-500"} ${debouncedSearchTerm.length > 0 && !subdomainAvailable && "ring-2 ring-red-500"}`} />
                            <p className='text-2xl ml-4'>.techsapien.dev</p>
                        </div>
                    </div>
                    <button disabled={debouncedSearchTerm.length === 0} className='btn btn-primary w-full mt-4'>Save</button>
                </div>
            </div>
        </div>
    )
}

export default Subdomain