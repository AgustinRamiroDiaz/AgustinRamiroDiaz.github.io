# SZICOM

Situation:
SZICOM is a company (for which I worked as a freelance contractor) running a
Distribution Management System built in C# / .NET on Windows-only VMs in AWS.
The infrastructure was outdated: the application only ran on Windows, used an
older .NET version with IdentityServer that needed migration, and was deployed
on bare VMs managed by a third-party organization (CISB). The owner of the
company wanted to modernize to containerized infrastructure on Amazon ECS.

Task:
I was solely responsible for the entire migration — from architecture design
through execution. This included stakeholder communication with the company
owner and the third-party infrastructure team, all technical decisions, code
changes in the C# codebase, and teaching the developers the new tools and
workflows.

Action:
I started by aligning with the owner on scope and goals. He described the
desired end state (ECS with containers), and I researched and designed the
complete solution: ECS services, RDS, Lambda, S3, CodePipelines, networking
(subnets, IP ranges, DNS, firewall rules, load balancers, security groups).
Having admin rights to the AWS account let me move fast without waiting on
approvals from CISB.

Key technical challenges I solved:

- Porting the C# application from Windows to Linux: I adapted the code to run
  on Linux containers, which required changes to path handling and OS-level
  assumptions.
- Migrating from an older IdentityServer version to a compatible one within
  the newer .NET runtime.
- Packaging the application into Docker images, designing the Dockerfile and
  image build pipeline.
- For a CPU-bound worker service that consumed messages from RabbitMQ: I first
  tried horizontal autoscaling based on CPU — it worked but new instances took
  too long to spin up during burst events of ~1000 messages. I then tried
  AmazonMQ metrics for faster scaling triggers, which helped but still had
  ~1 minute measurement lag. The final decision was to use a larger instance
  that could absorb bursts, accepting a fixed cost of $30/month more in exchange
  for simplicity and reliability.

Human challenges:

- Educating devs: I also held an in-person session with the dev team (despite the company being
  remote, the team is in Rosario) to explain Docker and
  the new cloud architecture, and I submitted PRs to the codebase to model best
  practices and teach through code review.
- Working with 3rd parties: The people in charge of the cloud infrastructure at SZICOM were called CISB.
  These people were not knowledgeable in containerization, thus I was the one able to make the changes.
  I had some back and forths trying to delegate tasks to them (like VPC conficguration), but after many attempts I've noticed that
  they were slow and many times unresponsive.
  That's where I applied the following rule "If it's not working, change something", so I discussed with SZICOM in order to handle all the cloud side neede myself,
  which lead me to faster implementation by not relying on third parties.
- Access management: I had to get access to code (BitBucket), DNS (CloudFlare), AWS (CISB). I had the great benefit of knowing how to code + knowing about infrastructure,
  thus I was able to close the feedback loop by doing code + PR + deploy and fixing things myself.
  This added a ton of value to my service since it didn't impact the dev's team velocity.

Result:

- The migration was completed successfully, with no interruptions to the development team and no down time
- Developer team was educated on containerization and AWS cloud services
- All services ran on Linux containers in ECS, backed by RDS, with a CI/CD pipeline via CodePipelines.
- The worker service handled message bursts reliably with the right-sized instance. The developer team was equipped to maintain and extend the new infrastructure.

# GENLAYER LABS

Situation:
GenLayer is a blockchain platform built around a decentralized executor called the
GenLayer Node. The node is responsible for processing every transaction in the
GenLayer ecosystem — essentially a distributed financial ledger that must be
correct, fault-tolerant, and scalable. Smart contracts emit events that drive
the node's internal logic, but the event delivery infrastructure was unreliable:
the websocket connection to the blockchain API was unstable, and the external web
API provider we depended on had a latency bug where events for newly published
blocks hadn't been indexed yet, causing dropped events.

Task:
I was responsible for designing and implementing the core event handling system
from scratch — the pipeline that reads on-chain events from smart contracts and
routes them to the right internal consumers. I also owned the GenLayer developer
tooling (GenLayer Studio and genlayer-js) end-to-end, from design through
deployment.

Action:
For the event pipeline, I designed a multi-layer, modular architecture:

- A block range fetcher that combined websocket notifications with polling to
  reliably determine which block range needed processing, making the system
  resilient to connection drops.
- An event fetcher that queried the smart contract API for events within a given
  block range.
- An event router using the pub-sub pattern, completely decoupling consumers from
  the event source. New functionality in the node could be added simply by
  registering a new consumer, without touching the core pipeline.

After deploying and monitoring the system, I found two performance problems and
fixed both:

1. Block range fetching and event fetching were sequential. I introduced a
   pre-fetcher that concurrently fetched events for block range [n+1, n+X] while
   syncing range [0, n], significantly improving throughput.
2. For the API indexing lag bug, I leveraged Ethereum's bloom filters — each block
   carries a bloom filter indicating whether it contains logs. I modified the event
   fetcher to check the bloom filter before querying, waiting if the API was still
   indexing, which eliminated dropped events entirely.

I also used goroutines and channels extensively (analogous to Elixir's processes
and message passing) for all concurrent code, and injected the fetch function as
a dependency via the strategy pattern to keep the syncer decoupled from the
fetching implementation.

Result:
The event pipeline became the backbone of the GenLayer Node — reliable, extensible,
and observable. Dropped events were eliminated. Throughput improved due to
concurrent pre-fetching. Adding new event consumers became a trivial operation.
The modular design meant that the indexing lag fix was a contained, surgical
change in one component rather than a rewrite.

# OKTETO

Situation:
Okteto is a developer platform that provides on-demand Kubernetes-based
development environments for software teams. The platform served 20+ enterprise
customer environments, each running on dedicated Kubernetes clusters. The
infrastructure and observability tooling was immature: there was no centralized
monitoring or alerting stack, which made it difficult to detect reliability
issues proactively. The backend services and CLI tooling also needed active
development to serve a growing developer audience.

Task:
I was responsible for managing Kubernetes clusters across all customer
environments, developing backend services and a GraphQL API in Go, building
the CLI tool for Kubernetes interaction, and leading the design and
implementation of a monitoring and observability stack from the ground up.

Action:
On the infrastructure side, I managed multi-tenant Kubernetes clusters across
20+ environments using Terraform for infrastructure-as-code and Helm charts for
multi-service deployments on GCP. I wrote Helm charts that could be parameterized
per customer, enabling consistent deployments with environment-specific overrides.

For observability, I designed and built the full monitoring stack from scratch:

- Prometheus for metrics collection from all cluster components and services.
- Grafana for dashboards and visualization.
- Alerting rules and notification channels to surface issues to the team
  before customers reported them.

This required defining clear specs for what "healthy" looked like for each
service, instrumenting the services to emit the right metrics, and closing the
loop with alerts that had actionable runbooks.

On the backend, I developed services in Go that powered the platform's developer
APIs, contributed to a GraphQL API serving thousands of developers, and built
CLI tooling that let developers interact with their Kubernetes environments
without needing deep Kubernetes expertise. I collaborated cross-functionally
with product managers, designers, and data analysts to ship features end-to-end.

Result:
The monitoring and observability stack became the team's primary tool for
detecting and diagnosing production issues. System reliability improved
measurably — problems were caught proactively rather than reactively. The
infrastructure-as-code approach made onboarding new customer environments
repeatable and auditable. The CLI and GraphQL API improvements contributed
to a platform that served thousands of developers managing their Kubernetes
development environments.
