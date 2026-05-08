Below are practice exercises tailored to the **3 interview stages** in your Webflow guide: **Core Behaviors**, **Fullstack Coding**, and **Fullstack System Design**. The guide says they’ll evaluate concrete examples using Webflow’s core behaviors, React + TypeScript debugging/refactoring, API interaction, async/promises, AI-assisted workflow, and a fullstack design exercise that starts with comments and adds real-time/offline/scaling complexity.

---

# 1. Core Behaviors Interview — 60 min

Use the **STAR method**: Situation, Task, Action, Result. Prepare stories that map to Webflow’s behaviors:

- Build lasting customer trust
- Win together
- Reinvent ourselves
- Deliver with Speed, Clarity, and Craft

## Exercise 1: Customer Trust Story

Prepare a 3–5 minute answer for:

> “Tell me about a time you made a technical decision that protected users, customers, or product quality, even if it slowed the team down.”

Your answer should include:

- What customer/user risk existed?
- What options did you consider?
- How did you communicate the tradeoff?
- What was the result?
- What would you do differently now?

Good story candidates from your background could include infra reliability, ECS/ALB/Cloudflare debugging, database migration safety, production incident prevention, or improving deployment confidence.

---

Situation: SZICOM migration to Containers.
Task: Migrate SZICOM's Bus service from VM process to AWS ECS Fargate Service. A worker service that subscribed to RabbitMQ queues and processed their messages.
Action: At first I started with just creating the AWS ECS Service as usual, with low resources. This service was working fine with my tests, so I asked the dev team to tell me how to load test it. The service was mostly idle, but had bursts of messages on certain periods of times due to cron messages, and user interactions. This is where I found out that the
Turns out that AWS ECS Fargate doesn't have vertical autoscaling, which would've been the best option. So I've opted to try horizontal autoscaling based on CPU. This worked fine, but it had a problem with bursts of messages: the cpu metric interval was 1 minute, and just then the ECS horizontal autoscaler would notice it to deploy the new replica, which also took around 1 minute. This meant that we had 2 minutes of delay from the actual message burst to the new replica working. So I again tried to improve this by connecting directly to Amazon MQ metric, which would tell me the burst earlier than the CPU. This had reduced the alert time by 30s, but still the lag was 90 seconds total. At this point I evaluated what would be the size needed to handle the burst of messages, and it was only twice as big. This was a low cost of $20 per month, and it greatly improved performance. I've discussed this with Pablo and he gave me the green light
Result: Great user experience due to bigger VM handling the messages, easier management without horizontal autoscaler, with a reasonable cost

What would you do differently now? -> Evaluate scale prior to implementation. I had come with the frame of mind of Kubernetes huge clusters with high replica sets, but in this case my customer only had only one instance running, they did not need multiple replicas with autoscaling, they were using really low resources.

## Exercise 2: Win Together Story

Prepare an answer for:

> “Tell me about a time you disagreed with a teammate, manager, or stakeholder. How did you handle it?”

Structure it like this:

```text
Situation:
Task:
Action:
Result:
Reflection:
```

Practice making the story sound collaborative, not defensive. The interviewer is probably looking for whether you can disagree without becoming rigid.

Follow-up questions to rehearse:

- “What did the other person care about?”
- “How did you adapt your approach?”
- “What did you learn about collaboration?”

---

Situation: At Genlayer Labs, we wanted to use AI as much as possible, so every time something new appeared we started using it.
Task: When Claude Code Skills appeared, we were tasked to add skills for all our common workflows in our repos.
Action: I did my part and Darien (my boss, who was very stubborn) did his. The conflict appeared when I was reviewing the skills he created: he was using a design that he had copied from another coworker which did not reflect the real way skill were loaded by claude code. Example: He was using YAML with "trigger" sections, but skills get loaded by their markdown frontmatter metadata header. This lead to many discussions on the PRs where I tried to explain to him (based on the official documentation) about how his skills were not tailored to be used by claude code. After some time he eventually understood how skills worked and got loaded, but still was wanting to use his convention and style. We ended up using skills with a mix of the best practices, and then had some YAML custom stuff which was not necessary, but given that we now have huge context windows for LLMs, that small garbage was not impactful
Result:
Reflection: I think the most important part was effectively making Darien understand how skills worked. Then he was in his own right to decide how he wanted to use them. That last part was a discussion not worth having, thus it was the right call to not invest more time on the matter.

- “What did the other person care about?” -> Results. He wanted to get the skills ready ASAP, and didn't care much about how they worked.
- “How did you adapt your approach?” -> I've came to understand that my role was to inform him of how things worked, and he had the final call.
- “What did you learn about collaboration?” -> That "human problems" are even more important than technology problems

---

## Exercise 3: Reinvent Ourselves Story

Prepare an answer for:

> “Tell me about a time you improved or rethought an existing system/process.”

Strong examples:

- Replacing a brittle deployment process
- Refactoring a confusing code path
- Introducing better debugging/logging
- Improving developer feedback loops
- Simplifying infrastructure or CI/CD

Make sure the story shows **why the old approach was insufficient**, not just that you made it “cleaner.”

---

## Exercise 4: Speed, Clarity, and Craft Story

Prepare an answer for:

> “Tell me about a time you had to move quickly without sacrificing quality.”

Your answer should show:

- How you prioritized
- What quality bar you kept
- What you intentionally deferred
- How you made the work understandable to others
- What measurable impact you had

A good structure:

```text
We had limited time, so I separated the problem into:
1. Must-have correctness
2. Safety/observability
3. Nice-to-have polish

I shipped the first two, documented the tradeoffs, and created follow-up work for the rest.
```

---

## Behavioral Mock Drill

Set a 20-minute timer.

Answer these out loud:

1. “Tell me about yourself.”
2. “Why Webflow?”
3. “Tell me about a technical challenge you’re proud of.”
4. “Tell me about a conflict.”
5. “Tell me about a time you received feedback.”
6. “Tell me about a time you had to learn something quickly.”
7. “Tell me about a time you shipped something imperfect.”

After each answer, ask yourself:

- Did I explain the **impact**?
- Did I mention **tradeoffs**?
- Did I sound like someone people want to work with?
- Did I avoid over-explaining implementation details?

---

# 2. Fullstack Coding Interview — React + TypeScript

The guide says the interview will involve an inherited React + TypeScript app with issues to debug, optimize, and refactor. They care less about finishing everything and more about your approach, communication, code quality, debugging, and thoughtful AI usage.

Below are practice exercises you can implement locally.

---

## Exercise 1: Buggy Search UI

Build a small React + TypeScript app with this behavior:

- Fetch a list of users from an API.
- Display users in a list.
- Add a search input.
- Filter users by name.
- Show loading and error states.

Then intentionally add/fix these bugs:

### Bugs to practice finding

1. Search input updates but list does not filter.
2. API request fires on every keystroke unnecessarily.
3. Race condition: slower old request overwrites newer result.
4. Missing loading state.
5. TypeScript type uses `any`.
6. Component rerenders more than needed.
7. Error is swallowed and never shown.

### Skills trained

- `useState`
- `useEffect`
- controlled inputs
- async fetch
- error handling
- TypeScript types
- debugging through logs/browser devtools

---

## Exercise 2: Editable Todo List with Server Sync

Build a todo list app with:

- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Features:

- Add todo
- Edit todo text
- Toggle complete
- Delete todo
- Show pending state while saving
- Roll back optimistic update on failure

Then practice explaining:

```text
I’m choosing optimistic updates because they make the UI feel faster.
The tradeoff is that I need rollback behavior when the API fails.
For a real product, I’d also consider retry behavior and conflict handling.
```

### Add bugs and fix them

- Editing one item changes all items.
- Delete removes from UI but not server.
- Optimistic update never rolls back.
- `key={index}` causes weird UI behavior.
- Stale closure causes lost updates.
- API response shape does not match frontend type.

---

## Exercise 3: Refactor a Messy Component

Start with one huge component:

```tsx
function Dashboard() {
  // fetch data
  // loading state
  // error state
  // filters
  // sorting
  // table rendering
  // modal
  // form state
  // submit logic
}
```

Refactor it into:

```text
DashboardPage
useProjects()
ProjectFilters
ProjectTable
EditProjectModal
apiClient
types.ts
```

Practice narrating:

```text
First I’m going to preserve behavior.
Then I’ll extract the API layer.
Then I’ll separate rendering components from stateful logic.
After each step I’ll quickly verify that the app still works.
```

This is very close to the kind of “inherited app” improvement Webflow describes.

---

## Exercise 4: AI-Assisted Coding Drill

Because the guide says AI tools are encouraged, practice using AI in a way that looks senior.

Do not say:

```text
I’ll ask AI to solve it.
```

Say:

```text
I’m going to ask AI for possible causes, then I’ll validate the suggestions manually before applying anything.
```

Practice prompts like:

```text
Here is a React component with a stale state bug. Identify likely causes, but don’t rewrite the whole file yet.
```

```text
Suggest a minimal refactor that improves readability without changing behavior.
```

```text
Review this TypeScript type and API handling. What edge cases am I missing?
```

Then practice explaining what you accept/reject:

```text
The AI suggested memoizing this component, but I don’t think that addresses the root issue.
The real bug is that the effect dependency array is missing `query`.
```

---

## Exercise 5: 45-Minute Mock Coding Session

Set a timer for 45 minutes.

Prompt:

> You inherit a React + TypeScript page that displays customer feedback. It fetches feedback from `/api/feedback`, allows filtering by status, and lets users mark feedback as resolved. The app has bugs in loading state, stale data, and type safety. Fix the bugs, then refactor the code.

Expected solution areas:

- Define proper types:

```ts
type FeedbackStatus = "open" | "resolved";

type FeedbackItem = {
  id: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
};
```

- Add API wrapper.
- Add loading/error states.
- Avoid stale state.
- Update item after mutation.
- Keep components small.
- Explain tradeoffs.

Practice speaking while coding:

```text
I’m going to first reproduce the issue.
Now I’ll inspect the data shape.
Before refactoring, I want to make the failing behavior pass.
Now that behavior is stable, I’ll extract the API call.
```

---

# 3. Fullstack System Design Interview — 60 min

The guide says the design interview starts with a **simple commenting system**, then adds complexity like **real-time updates, notifications, offline handling, and scalability**.

Use this framework every time:

```text
1. Clarify requirements
2. Define users and core flows
3. Sketch frontend architecture
4. Design API
5. Design data model
6. Discuss real-time behavior
7. Discuss offline behavior
8. Discuss scalability
9. Discuss tradeoffs
```

---

## Exercise 1: Basic Commenting System

Prompt:

> Design a commenting system for a website builder. Users can leave comments on a specific page or element.

Clarifying questions to practice:

- Are comments attached to a page, an element, or both?
- Are comments threaded?
- Do we need mentions?
- Do comments support rich text?
- Can comments be edited/deleted?
- Are permissions inherited from the site/project?
- Do we need real-time updates initially?

Basic data model:

```text
User
- id
- name
- avatarUrl

Project
- id
- name

Page
- id
- projectId
- title

Comment
- id
- projectId
- pageId
- elementId nullable
- authorId
- body
- status: open | resolved
- createdAt
- updatedAt
- deletedAt nullable
```

Basic API:

```http
GET /projects/:projectId/pages/:pageId/comments
POST /projects/:projectId/pages/:pageId/comments
PATCH /comments/:commentId
DELETE /comments/:commentId
POST /comments/:commentId/resolve
```

Frontend state:

```text
CommentSidebar
CommentThread
CommentInput
useComments(pageId)
commentsApi
```

Tradeoff to explain:

```text
I’d start with a simple request/response API and polling or manual refresh.
I would not add WebSockets until we confirm real-time collaboration is required.
```

---

## Exercise 2: Add Real-Time Updates

Prompt extension:

> Now multiple collaborators are editing the same page and need to see comments appear in real time.

Design options:

### Option A: Polling

Good for:

- Simplicity
- Low scale
- Fast initial implementation

Bad for:

- Latency
- Wasted requests

### Option B: Server-Sent Events

Good for:

- One-way server-to-client updates
- Comments/notifications feeds

Bad for:

- Not ideal for bidirectional collaboration

### Option C: WebSockets

Good for:

- Real-time collaboration
- Presence
- Typing indicators
- Bidirectional updates

Bad for:

- More infra complexity
- Connection management
- Scaling across instances

Suggested answer:

```text
For comments only, I’d consider SSE first because updates are mostly server-to-client.
If we also need presence, typing indicators, or collaborative editing, I’d use WebSockets.
```

Architecture:

```text
Client
  -> API Server
  -> Database

Client
  -> Realtime Gateway
  -> Pub/Sub
  -> API workers
  -> Database
```

Events:

```ts
type CommentCreatedEvent = {
  type: "comment.created";
  projectId: string;
  pageId: string;
  comment: Comment;
};
```

---

## Exercise 3: Add Notifications and Mentions

Prompt extension:

> Users can mention teammates in comments using @name. Mentioned users should receive notifications.

Questions:

- In-app only, email, Slack, or all?
- Should notifications be immediate or batched?
- Do we notify users who already saw the comment?
- Are mentions permission-aware?
- What happens if a mentioned user does not have access?

Data model:

```text
Notification
- id
- recipientUserId
- actorUserId
- projectId
- commentId
- type: mention | reply | resolved
- readAt nullable
- createdAt
```

Flow:

```text
POST comment
  -> save comment
  -> parse mentions
  -> validate mentioned users have access
  -> create notification records
  -> publish realtime notification event
  -> enqueue email job if needed
```

Tradeoff:

```text
I’d create notifications asynchronously after the comment is saved.
That keeps the comment path fast. If notification delivery fails, the comment still exists and a worker can retry.
```

---

## Exercise 4: Add Offline Support

Prompt extension:

> Users may write comments while offline. When they reconnect, comments should sync.

Frontend design:

```text
Local pending comment
- clientId
- body
- pageId
- elementId
- createdAt
- syncStatus: pending | synced | failed
```

Flow:

```text
User creates comment offline
  -> save to IndexedDB/local storage
  -> show immediately as pending
  -> when online, POST to server
  -> server returns real id
  -> replace clientId with server id
```

Conflict questions:

- What if the page was deleted?
- What if the element no longer exists?
- What if user loses permission?
- What if the same comment is submitted twice?

Backend support:

```text
POST /comments
Idempotency-Key: clientGeneratedId
```

Tradeoff:

```text
I’d use client-generated IDs or idempotency keys to avoid duplicate comments during retries.
For conflict resolution, I’d keep the comment but mark it as detached if the target element no longer exists.
```

---

## Exercise 5: Scale the Commenting System

Prompt extension:

> The system now supports millions of sites and many enterprise teams.

Discuss:

### Database

Start:

```text
PostgreSQL
comments table indexed by projectId, pageId, createdAt
```

Indexes:

```sql
CREATE INDEX comments_page_created_idx
ON comments (project_id, page_id, created_at DESC);
```

Possible future scaling:

- Partition by project/workspace
- Read replicas
- Archival for old comments
- Search index for full-text comment search

### API scaling

```text
Load balancer
API servers
Database
Redis cache
Queue workers
Pub/Sub for realtime
Object storage for attachments
```

### Realtime scaling

Problem:

```text
If user A is connected to server 1 and user B to server 2,
server 2 needs to know when server 1 receives a new comment.
```

Solution:

```text
Use Redis Pub/Sub, Kafka, NATS, or another message bus to fan out events across realtime servers.
```

### Reliability

Discuss:

- Retries for notifications
- Idempotency for comment creation
- Dead-letter queue for failed jobs
- Rate limiting
- Permission checks on every read/write
- Audit logs for enterprise customers

---

# 4. Three-Day Practice Plan

## Day 1: Behavioral

Prepare 6 stories:

1. Customer trust
2. Team collaboration
3. Conflict/disagreement
4. Fast delivery
5. Refactor/process improvement
6. Learning/adapting after feedback

Record yourself answering each in 3 minutes.

---

## Day 2: Coding

Do two 45-minute React + TypeScript drills:

1. Buggy search/filter app
2. Editable todo/feedback app with API sync

Focus on speaking clearly while coding.

Use this script:

```text
I’ll first reproduce the bug.
Then I’ll inspect the state and data flow.
Then I’ll make the smallest safe fix.
After that, I’ll refactor only if behavior is stable.
```

---

## Day 3: System Design

Do one full 60-minute mock:

Prompt:

> Design a commenting system for a collaborative website builder. Start simple, then add real-time updates, mentions, offline support, and scalability.

Spend time like this:

```text
0–5 min: clarify requirements
5–15 min: basic architecture
15–25 min: data model and APIs
25–35 min: frontend state and UX
35–45 min: real-time and notifications
45–55 min: offline and scalability
55–60 min: recap tradeoffs
```

End with:

```text
To summarize, I’d start with a simple Postgres-backed REST API and React comment UI.
Then I’d add async notifications through a queue.
For real-time updates, I’d choose SSE or WebSockets depending on whether we need bidirectional presence.
For offline support, I’d use client-generated IDs and a pending local queue.
The main tradeoff is keeping the first version simple while leaving clear paths to scale.
```

---

# 5. Best “Interview Mode” Habits to Practice

During all exercises, practice saying these kinds of things out loud:

```text
Let me clarify the requirement before jumping into implementation.
```

```text
I’ll start with the simplest version, then we can evolve it.
```

```text
The tradeoff here is simplicity versus scalability.
```

```text
I’m going to validate this assumption before changing the code.
```

```text
I’d prefer not to optimize this yet until we know it’s a bottleneck.
```

```text
I used AI to generate possibilities, but I’m validating the code myself before trusting it.
```

These phrases align well with what the guide says they value: structured problem solving, thoughtful tradeoffs, communication, and not just memorized solutions.
