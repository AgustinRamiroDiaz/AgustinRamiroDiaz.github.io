# Situation

Lead the migration from VMs to container

# Task

Particular focus on migration from test to prod

# Action

1. Tested everything prior in custom environments that I had with all replicated: ECS clusters, load balancer routes
2. Created all production services with their configurations, and even ran most of their components: Since the UI and API were stateless, we could have multiple replicas running in parallel. The only component that actually required a switch off/on was their "Bus" which was the responsible for asyncronous tasks. This was no problem, since it relied on existing data from a RabbitMQ, so nothing was lost while migrating to the new instance
3. Changed DNS routes
4. Smoke tested

## Communication

We scheduled a maintenance window for one cluster

# Result

# Reflect
