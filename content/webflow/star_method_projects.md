# STAR Method Projects

## SZICOM

### Situation

SZICOM is a company, for which I worked as a freelance contractor, running a
Distribution Management System built in C# / .NET on Windows-only VMs in AWS.
The infrastructure was outdated: the application only ran on Windows, used an
older .NET version with IdentityServer that needed migration, and was deployed
on bare VMs managed by a third-party organization, CISB. The owner of the
company wanted to modernize to containerized infrastructure on Amazon ECS.

### Task

I was solely responsible for the entire migration, from architecture design
through execution. This included stakeholder communication with the company
owner and the third-party infrastructure team, all technical decisions, code
changes in the C# codebase, and teaching the developers the new tools and
workflows.

### Action

I started by aligning with the owner on scope and goals. He described the
desired end state, ECS with containers, and I researched and designed the
complete solution: ECS services, RDS, Lambda, S3, CodePipelines, networking
including subnets, IP ranges, DNS, firewall rules, load balancers, and security
groups. Having admin rights to the AWS account let me move fast without waiting
on approvals from CISB.

#### Key Technical Challenges

- **Porting the C# application from Windows to Linux:** I adapted the code to
  run on Linux containers, which required changes to path handling and OS-level
  assumptions.
- **Migrating IdentityServer:** I migrated from an older IdentityServer version
  to a compatible one within the newer .NET runtime.
- **Packaging the application into Docker images:** I designed the Dockerfile
  and image build pipeline.
- **Handling RabbitMQ worker bursts:** For a CPU-bound worker service that
  consumed messages from RabbitMQ, I first tried horizontal autoscaling based on
  CPU. It worked, but new instances took too long to spin up during burst events
  of around 1000 messages. I then tried AmazonMQ metrics for faster scaling
  triggers, which helped but still had around one minute of measurement lag. The
  final decision was to use a larger instance that could absorb bursts,
  accepting a fixed cost of $30/month more in exchange for simplicity and
  reliability.

#### Human Challenges

- **Educating developers:** I held an in-person session with the dev team,
  despite the company being remote, because the team is in Rosario. I explained
  Docker and the new cloud architecture, and I submitted PRs to the codebase to
  model best practices and teach through code review.
- **Working with third parties:** The people in charge of the cloud
  infrastructure at SZICOM were called CISB. Their team had limited containerization context, so I was the one able to make the changes. I had some back
  and forth trying to delegate tasks to them, such as VPC configuration, but
  after many attempts I noticed that their response times were slowing delivery.
  That's where I applied the rule: "If it's not working, change something." I
  discussed this with SZICOM so I could handle all the cloud-side work myself,
  which led to faster implementation by not relying on third parties.
- **Access management:** I had to get access to code, BitBucket, DNS,
  CloudFlare, and AWS through CISB. I had the benefit of knowing how to code and
  how to work with infrastructure, so I was able to close the feedback loop by
  doing code, PR, deploy, and fixes myself. This added a lot of value to my
  service because it did not impact the dev team's velocity.

### Result

- The migration was completed successfully, with no interruptions to the
  development team and no downtime.
- The developer team was educated on containerization and AWS cloud services.
- All services ran on Linux containers in ECS, backed by RDS, with a CI/CD
  pipeline via CodePipelines.
- The worker service handled message bursts reliably with the right-sized
  instance.
- The developer team was equipped to maintain and extend the new infrastructure.

### Reflection

The biggest lesson from this project was to validate scale and usage patterns
before choosing infrastructure patterns. I initially approached the RabbitMQ
worker with a Kubernetes-style mindset: smaller instances, horizontal scaling,
and reactive autoscaling. After measuring the real workload, I realized the
customer did not need a complex autoscaling setup. They needed a simple,
reliable service that could absorb predictable bursts at a low fixed cost.

I also learned that ownership sometimes means changing the collaboration model.
My first instinct was to delegate cloud tasks to the existing infrastructure
provider, but when that path slowed delivery, I made the constraint explicit,
aligned with the customer, and took direct ownership of the cloud work. In a
future project, I would identify those delivery risks earlier and agree on
clear ownership boundaries from the beginning.

### Impact on Webflow Core Behaviors

- **Build lasting customer trust:** By taking full ownership of the migration,
  communicating clearly with the owner, and delivering the move without downtime
  or disruption to the dev team, I helped the customer trust that I was able to
  offer end-to-end solutions.
- **Win together:** Even though I was the sole owner of the technical migration,
  I did not treat it as a solo deliverable. I taught the dev team Docker and the
  new AWS architecture, used PRs to model best practices, and made sure the team
  could maintain the system after I left. The goal was not just to ship the
  migration, but to leave the organization stronger.
- **Reinvent ourselves:** The work required moving from a VM-based,
  Windows-only deployment model to a containerized, cloud-native architecture. I
  also changed my own operating model when the original delegation path with
  CISB was too slow. Instead of continuing with a process that was not working,
  I adapted, took direct responsibility for the cloud side, and unblocked the
  project.
- **Deliver with Speed, Clarity, and Craft:** I balanced speed with pragmatic
  engineering. For example, on the RabbitMQ worker autoscaling problem, I
  explored CPU-based scaling and AmazonMQ metrics, then chose a slightly larger
  instance because it was simpler, more reliable, and still inexpensive. That
  decision showed craft: the best solution was not the most complex one, but the
  one that delivered the required reliability with clear tradeoffs.

## GENLAYER LABS

### Situation

GenLayer is a blockchain platform built around a decentralized executor called
the GenLayer Node. The node is responsible for processing every transaction in
the GenLayer ecosystem, essentially a distributed financial ledger that must be
correct, fault-tolerant, and scalable. Smart contracts emit events that drive
the node's internal logic, but the event delivery infrastructure was unreliable:
the websocket connection to the blockchain API was unstable, and the external web
API provider we depended on had a latency bug where events for newly published
blocks had not been indexed yet, causing dropped events.

### Task

I was responsible for designing and implementing the core event handling system
from scratch: the pipeline that reads on-chain events from smart contracts and
routes them to the right internal consumers. I also owned the GenLayer developer
tooling, GenLayer Studio and genlayer-js, end-to-end, from design through
deployment.

### Action

For the event pipeline, I designed a multi-layer, modular architecture:

- **Block range fetcher:** Combined websocket notifications with polling to
  reliably determine which block range needed processing, making the system
  resilient to connection drops.
- **Event fetcher:** Queried the smart contract API for events within a given
  block range.
- **Event router:** Used the pub-sub pattern, completely decoupling consumers
  from the event source. New functionality in the node could be added simply by
  registering a new consumer, without touching the core pipeline.

After deploying and monitoring the system, I found two performance problems and
fixed both:

1. Block range fetching and event fetching were sequential. I introduced a
   pre-fetcher that concurrently fetched events for block range `[n+1, n+X]`
   while syncing range `[0, n]`, significantly improving throughput.
2. For the API indexing lag bug, I leveraged Ethereum's bloom filters. Each block
   carries a bloom filter indicating whether it contains logs. I modified the
   event fetcher to check the bloom filter before querying, waiting if the API
   was still indexing, which eliminated dropped events entirely.

I also used goroutines and channels extensively, analogous to Elixir's processes
and message passing, for all concurrent code. I injected the fetch function as a
dependency via the strategy pattern to keep the syncer decoupled from the
fetching implementation.

### Result

The event pipeline became the backbone of the GenLayer Node: reliable,
extensible, and observable. Dropped events were eliminated. Throughput improved
due to concurrent pre-fetching. Adding new event consumers became a trivial
operation. The modular design meant that the indexing lag fix was a contained,
surgical change in one component rather than a rewrite.

### Reflection

This project reinforced the importance of designing systems around failure
modes, not just happy paths. The first version of the pipeline was modular and
functional, but real production behavior exposed issues that were outside our
direct control: websocket instability and delayed indexing from an external API
provider. The strongest design choice was not assuming those dependencies would
behave perfectly.

It also taught me the value of observability and narrow interfaces. Because the
pipeline was split into block detection, event fetching, and event routing, I
could isolate the indexing problem and fix it without rewriting the whole
system. In future systems, I would continue investing early in clear component
boundaries, metrics, and operational visibility, especially when correctness is
part of the product promise.

### Impact on Webflow Core Behaviors

- **Build lasting customer trust:** The GenLayer Node processed financial ledger
  activity, so correctness and reliability were essential to user trust. Dropped
  events could have meant incorrect internal state or missed business-critical
  activity. By eliminating dropped events and making the pipeline observable, I
  strengthened the reliability guarantees that developers and users needed from
  the platform.
- **Win together:** The event router made it easier for other engineers to build
  on top of the node. Instead of each feature needing to understand the event
  source directly, teams could add consumers through a clean pub-sub interface.
  That reduced coordination overhead and gave the team a shared foundation for
  future work.
- **Reinvent ourselves:** I did not stop at the first working implementation.
  After observing real production behavior, I redesigned parts of the pipeline
  to handle websocket instability, external API indexing lag, and throughput
  limits. The bloom filter solution is a good example: I used a lower-level
  blockchain primitive to solve a reliability issue caused by an external
  provider.
- **Deliver with Speed, Clarity, and Craft:** The design separated block
  detection, event fetching, and event routing into independent components,
  which made the system easier to reason about and evolve. When performance and
  indexing issues appeared, the fixes were precise rather than broad rewrites.
  That combination of modularity, concurrency, and targeted iteration is how I
  try to deliver fast without lowering the engineering bar.

## OKTETO

### Situation

Okteto is a developer platform that provides on-demand Kubernetes-based
development environments for software teams. I originally joined as a backend
developer, working mostly on Go services, GraphQL APIs, and developer-facing
product features.

As the company grew, the Platform team needed more help. Okteto had several
enterprise customer environments running on dedicated Kubernetes clusters, and
the team needed more capacity to manage infrastructure, improve deployment
processes, and keep cloud resources organized. The company had a stronger need
for platform engineering than for one more backend developer at that specific
moment.

### Task

My task was not just to contribute to a different codebase. I actually moved
teams, from Backend to Platform, and had to become productive in a different
kind of engineering work. That meant learning the team's infrastructure tooling,
understanding how customer environments were provisioned and maintained, and
taking responsibility for work that affected the company's cloud operations and
resource distribution.

### Action

I treated the move as a learning and execution problem at the same time. I had
some previous curiosity and experience with cloud infrastructure, but I still had
to ramp up on the specific tools and processes used by the Platform team.

The main actions I took were:

- **Learned Terraform and Terraform Cloud:** I studied the existing modules,
  state management, workspace structure, and review workflow so I could make
  infrastructure changes safely instead of treating Terraform as a black box.
- **Ramped up on GCP:** I learned the relevant GCP services used by Okteto's
  platform, how the Kubernetes clusters were configured, and how cloud resources
  were allocated across environments.
- **Understood custom deployment pipelines:** I learned the internal pipelines
  used to provision, update, and operate customer environments, including where
  automation existed and where manual care was still required.
- **Connected backend context with platform work:** Because I came from the
  backend/product side, I could reason not only about infrastructure mechanics,
  but also about how platform decisions affected developers, customers, and the
  product experience.
- **Contributed while learning:** I did not wait to become an expert before
  helping. I started with smaller, safer tasks, asked questions, reviewed
  existing patterns, and gradually took on more responsibility as I built trust
  with the Platform team.

### Result

The company got a better distribution of engineering resources. Instead of
having backend capacity where it was less urgently needed and platform capacity
where the team was under pressure, I was able to move into the area with higher
organizational need and become useful there.

For the Platform team, this meant more hands on infrastructure work, customer
environment operations, Terraform changes, GCP work, and deployment pipeline
maintenance. For the company, it meant better coverage of critical platform
responsibilities without needing to wait for a new hire or leave the Platform
team overloaded.

### Reflection

This experience reinforced the value of curiosity and breadth. My previous
interest in cloud infrastructure made it possible for me to adapt when the
company needed help outside my original backend role. I was not a platform
specialist at the start, but I had enough foundation and enough learning
momentum to become productive.

The larger lesson is that versatility can be a real team asset. Sometimes the
highest-impact thing is not staying inside the role where you are already most
comfortable, but moving toward the team's actual constraint. I learned that my
background in backend development, combined with curiosity about cloud and
infrastructure, allowed me to bridge teams and create useful impact in a new
area.

### Impact on Webflow Core Behaviors

- **Build lasting customer trust:** Okteto served enterprise customer
  environments, so platform reliability directly affected customer confidence.
  By moving into the team responsible for those environments, I helped increase
  the company's ability to maintain and improve the systems customers depended
  on.
- **Win together:** This story is mostly about team-first behavior. I moved from
  the team where I was already comfortable to the team where the company had the
  greater need. That helped balance engineering capacity and reduced pressure on
  the Platform team.
- **Reinvent ourselves:** I had to reinvent my own role from backend developer
  to platform engineer. That meant learning Terraform, Terraform Cloud, GCP,
  Kubernetes operations, and custom deployment pipelines while still contributing
  useful work.
- **Deliver with Speed, Clarity, and Craft:** I ramped up carefully by studying
  existing patterns, taking smaller safe tasks first, and growing into broader
  responsibility. That let me move quickly without treating infrastructure as a
  place for reckless experimentation.
