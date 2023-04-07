import React from "react";

import { GetServerSideProps } from "next";
import SecretsCard from "../../../../components/projects/SecretsCard";

const Secret = (props) => {
  const { projectId, name } = props;
  return (
    <div className="container mx-auto">
      <div className="breadcrumbs">
        <ul>
          <li>projects</li>
          <li>{name}</li>
        </ul>
      </div>
      <SecretsCard {...props} />
    </div>
  );
};

export default Secret;

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
      id,
    },
  };
};
