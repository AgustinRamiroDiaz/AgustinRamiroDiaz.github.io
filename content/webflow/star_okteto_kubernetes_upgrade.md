# Situation

At Okteto we developed a product which allowed developers to develop their multi-service applications in Kubernetes, simulating as close as possible their production environments. This was done by creating Kubernetes namespaces for each user, deploying the whole environment, and then allowing them to remotely connect to each pod for real time development. This granted developers real interactions with the whole system, not just mocked data

I've started working at Okteto as a Backend Engineer, and was then moved to the Platform team due to the needs of the company (I was more than happy, because I really liked the opportunity to continue learning). So at the time I was working at the platform team. We managed the hosted Kuberenetes clusters in GCP

# Task

We had to do the migration from Kubernetes 1.24 to 1.25

For context:

- Kubernetes versions are compatible with +-1 (version skew of 1 minor), so you can have nodes running 1.24 and 1.25 kubernetes versions
- Our strategy was using blue-green deployments, since Kubernetes pods can move from old nodes to new nodes
- Why use a maintenance window then? Because even though pods get moved around, they get evicted and that process could cause confusion for a user, since they would need to reconnect to the new pod.

# Action

Since this was a major upgrade, prior to the migration I looked up the changelog of Kubernetes from 1.24 to 1.25, which included:

## PodSecurityPolicy (PSP) Removal

- PSP is fully removed in 1.25. You must migrate to the Pod Security Admission controller, which uses namespace labels (enforce, audit, warn) to apply security standards.

This meant primarily changes in the Okteto's control plane code, since that's where we were creating and managing the PSP. Luckily, I had already worked at the backend team, so with permission from the team I did the upgrades myself. This was something key that we always tried to do in the platform team: enable and offload as much work from the developers as possible. I wrote the code, tested it, and sent a PR

## Testing the upgrade

Prior to upgrading the client's cluster, I've simulad an upgrade of my personal dev cluster. Everything went smooth

## Communication

We scheduled a maintenance window for one cluster

### Notifying the users for upgrading their tools

Developers might use kubectl to interact with their clusters. Luckily, it also manages the version skew. Nonetheless, we always notify the users that they should be using the latest kubectl version, which in this case was 1.25

# Result

No changes in the end
Post mortem

# Reflect

PSP removal was already deprecated in Kubernetes 1.23. Even thought that was not the core issue, this could have been addressed eagerly
