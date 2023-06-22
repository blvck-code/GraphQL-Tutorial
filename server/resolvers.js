import { createJob, getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql/error/index.js";

export const resolvers = {
  Query: {
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },
    jobs: () => getJobs(),
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("No Company found with id " + id);
      }
      return company;
    },
  },
  Mutation: {
    createJob: (_root, { title, description }) => {
      const companyId = "FjcJCHJALA4i";
      return createJob({ companyId, title, description });
    },
  },
  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};

const notFoundError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
};

const toIsoDate = (value) => {
  return value.slice(0, "yyyy-mm-dd".length);
};
