# Situation

Lead the migration from VMs to container

# Task

Particular focus on migration from test to prod

# Action

1. Tested everything prior in custom environments that I had with all replicated: ECS clusters, load balancer routes
2. Deploy strategy: blue green. Created all production services with their configurations, and even ran most of their components: Since the UI and API were stateless, we could have multiple replicas running in parallel. The only component that actually required a switch off/on was their "Bus" which was the responsible for asyncronous tasks. This was no problem, since it relied on existing data from a RabbitMQ, so nothing was lost while migrating to the new instance
3. Changed DNS routes
4. Smoke tested

## Communication

- We scheduled a maintenance window due to the small downtime required from the upgrade
- I did huge focus on the developers, I taught them about containers (with Docker), docker-compose, and all their services in their cloud
  - I also created thorough documentation of the architecture, and also WHY it was that way, and what things I had tried but didn't work

# Result

- Developers learned AWS cloud and containerization
- Transferred ownership of cloud pipelines
- New system up and running, reducing their costs from huge VMs to small containers in ECS

# Reflect

Human side was more important than technology side

## surprises you encountered

Luckily all surprises were encountered during tests.

- Many of them were related to discrepancies between running on Windows and Linux
- One of them was related to FS usage, which had to be moved to AWS S3 bucket
