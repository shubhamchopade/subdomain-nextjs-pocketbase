import React, { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';
import { motion, AnimatePresence } from "framer-motion"

const BuildMetrics = (props) => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const [metrics, setMetrics] = React.useState(props?.metrics)
    const metricId = metrics.id

    // TODO: Get build metrics here

    // console.log(props)
    useEffect(() => {
        pb.collection('deployMetrics').getOne(metricId)
            .then((res) => { setMetrics(res) })
            .catch((err) => { console.log(err) })

    }, [metricId])

    const totalTime = Number(Number(metrics?.timeInstall) + Number(metrics?.timeBuild)).toFixed(2)
    return (
        <div>
            <p>✨ Done in - <span className='font-bold'>{totalTime}s</span></p>
        </div>
    )
}

export default BuildMetrics