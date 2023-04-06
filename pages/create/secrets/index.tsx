import React from 'react'
import SecretsCard from '../../../components/projects/SecretsCard'
import { GetServerSideProps } from 'next'

const Secret = (props) => {
    return (
        <div><SecretsCard {...props} /></div>
    )
}

export default Secret

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const projectId = context.query.projectId;
    const statusId = context.query.statusId;
    const metricId = context.query.metricId;
    const name = context.query.name;
    const id = context.query.id;


    return {
        props: {
            projectId,
            statusId,
            metricId,
            name,
            id
        }
    }
}