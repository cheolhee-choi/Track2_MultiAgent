# 멀티 에이전트 오케스트레이션 관리 대시보드 계획

## TL;DR

> **Quick Summary**: HTML + CSS + JS 기반의 대시보드를 작은 10~20분 단위 작업으로 나눈다. 중심은 에이전트 카드, 작업 상태 목록, 로그/메모 패널, 모델 사용 전략 체크리스트다.
>
> **Deliverables**:
> - 에이전트 카드 중심 대시보드 UI
> - 작업 상태 목록 UI
> - 로그/메모 패널 UI
> - 모델 사용 전략 체크리스트 UI
> - 정적 목업 데이터 기반의 상태 전환
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: 데이터 모델 → 카드/목록/패널 → 전략 체크리스트 → 통합/검증

---

## Context

### Original Request
멀티 에이전트 오케스트레이션 관리 대시보드를 만들고 싶다. 스택은 HTML + CSS + JS이며, 에이전트 카드 / 작업 상태 목록 / 로그 또는 메모 패널 / 모델 사용 전략 체크리스트를 포함한다. 10~20분 단위로 잘게 쪼갠 구현 계획과 보강 추천이 필요하다.

### Interview Summary
**Key Discussions**:
- 핵심 목표는 에이전트 카드 중심 UI다.
- v1은 모니터링 전용으로 정했다.
- 데이터 소스는 정적 목업 또는 로컬 JSON fixture로 시작한다.

**Research Findings**:
- 기존 `Agents.md` / `.opencode/agents/agent-team.md`에 7개 역할이 정리돼 있다.
- 역할은 기획, UI/UX, 데이터/상태, 구현, 리뷰, TDD, QA로 분리된다.

### Metis Review
**Identified Gaps** (addressed):
- Scope OUT 미정 → 실제 실행/백엔드/인증/실시간 동기화 등을 제외로 고정
- MVP 범위 미정 → 모니터링 전용으로 고정
- 데이터 소스 미정 → 정적 목업 또는 로컬 JSON fixture로 고정

---

## Work Objectives

### Core Objective
에이전트 상태와 작업 흐름을 한 화면에서 빠르게 읽을 수 있는 관리 대시보드를 만든다.

### Concrete Deliverables
- 에이전트 카드 그리드
- 작업 상태 목록
- 로그/메모 패널
- 모델 사용 전략 체크리스트
- 정적 목업 데이터와 상태 갱신 로직

### Definition of Done
- [ ] 4개 핵심 패널이 한 화면에서 동작한다.
- [ ] 상태 변화가 화면에 반영된다.
- [ ] 빈 상태 / 실패 상태 / 로딩 상태가 구분된다.

### Must Have
- HTML + CSS + JS만 사용한다.
- v1은 모니터링 전용이다.
- 한국어 UI 텍스트를 사용한다.

### Must NOT Have (Guardrails)
- 실제 에이전트 실행
- 백엔드 연동
- 인증/권한
- 복잡한 차트/통계
- 다국어 시스템
- 프레임워크 도입

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None for v1
- **Framework**: none
- **Primary QA**: browser-based agent QA using Playwright-style checks

### QA Policy
모든 작업은 화면에 실제로 나타나는 결과를 기준으로 검증한다.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation + data shape)
├── Task 1: HTML shell and layout regions
├── Task 2: Mock data schema and sample fixtures
└── Task 3: Shared status palette and utility classes

Wave 2 (Core panels)
├── Task 4: Agent card component block
├── Task 5: Task status list block
├── Task 6: Log/memo panel block
└── Task 7: Model strategy checklist block

Wave 3 (Interaction + polish)
├── Task 8: State switching and mock interactions
├── Task 9: Responsive layout and overflow handling
└── Task 10: Accessibility pass and empty/error states
```

### Dependency Matrix
- **1**: - → 4, 5, 6, 7
- **2**: - → 4, 5, 6, 7, 8
- **3**: - → 4, 5, 6, 7, 9
- **4**: 1, 2, 3 → 8, 10
- **5**: 1, 2, 3 → 8, 10
- **6**: 1, 2, 3 → 8, 10
- **7**: 1, 2, 3 → 8, 10
- **8**: 4, 5, 6, 7 → 9, 10
- **9**: 4, 5, 6, 7, 8 → 10
- **10**: 4, 5, 6, 7, 8, 9 → final review

### Agent Dispatch Summary
- **Wave 1**: `quick` 3 tasks
- **Wave 2**: `visual-engineering` 4 tasks
- **Wave 3**: `unspecified-high` / `quick` 3 tasks

---

## TODOs

- [x] 1. HTML shell and layout regions

  **What to do**:
  - Create the page skeleton with header, main dashboard grid, and footer note.
  - Reserve regions for agent cards, task list, log/memo, and strategy checklist.
  - Add placeholder content for empty states.

  **Must NOT do**:
  - Do not add business logic.
  - Do not add framework code.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `quick`
    - Reason: single-file or small layout-first task.
  - **Skills**: `[]`
    - Reason: no special external skill needed.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 4-10
  - **Blocked By**: None

  **References**:
  - `Agents.md` - role names and dashboard focus
  - `role-card.md` - required role structure and wording

  **Acceptance Criteria**:
  - [ ] Page skeleton exists.
  - [ ] Four dashboard regions are visibly reserved.
  - [ ] Empty placeholders render without errors.

  **QA Scenarios**:
  ```
  Scenario: Shell renders all regions
    Tool: Browser QA
    Steps:
      1. Open the page.
      2. Confirm the header, card area, task list, log/memo area, and strategy area exist.
    Expected Result: All regions are visible.

  Scenario: Empty state is readable
    Tool: Browser QA
    Steps:
      1. Load with empty mock data.
      2. Verify placeholder text appears in every region.
    Expected Result: Empty states are shown cleanly.
  ```

- [x] 2. Mock data schema and sample fixtures

  **What to do**:
  - Define the JSON shape for agents, tasks, logs, memos, and strategies.
  - Create 5-7 representative agents and 8-12 tasks.
  - Include success, waiting, blocked, and error samples.

  **Must NOT do**:
  - Do not connect a backend.
  - Do not invent complex persistence.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `quick`
    - Reason: data-shape definition and fixture creation.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 4-10
  - **Blocked By**: None

  **References**:
  - `Agents.md` - role taxonomy to seed fixture names
  - `agetn-team.md` - panel concepts and orchestration vocabulary

  **Acceptance Criteria**:
  - [ ] Data schema documented in code.
  - [ ] Fixtures cover normal and edge states.

  **QA Scenarios**:
  ```
  Scenario: Fixture loads expected counts
    Tool: Browser QA
    Steps:
      1. Load the mock data file.
      2. Confirm agent and task counts match the fixture.
    Expected Result: Counts are consistent.

  Scenario: Edge-state fixtures exist
    Tool: Browser QA
    Steps:
      1. Inspect fixture records.
      2. Confirm blocked/error/waiting values exist.
    Expected Result: Edge states are represented.
  ```

- [x] 3. Shared status palette and utility classes

  **What to do**:
  - Define color tokens for idle/running/waiting/blocked/error/done.
  - Add reusable classes for badges, chips, cards, and scroll regions.
  - Keep CSS naming consistent and compact.

  **Must NOT do**:
  - Do not introduce a full design system.
  - Do not add animation-heavy styling.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `quick`
    - Reason: small CSS foundation work.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 4-10
  - **Blocked By**: None

  **References**:
  - `role-card.md` - keep visual output natural, not AI-looking

  **Acceptance Criteria**:
  - [ ] Status colors are defined once.
  - [ ] Utility classes exist for cards, badges, and overflow.

  **QA Scenarios**:
  ```
  Scenario: Status colors are distinguishable
    Tool: Browser QA
    Steps:
      1. Render all statuses.
      2. Verify each has a distinct visual treatment.
    Expected Result: Statuses are easy to differentiate.

  Scenario: Utilities do not break layout
    Tool: Browser QA
    Steps:
      1. Apply card and badge utilities to test elements.
      2. Confirm spacing remains stable.
    Expected Result: Layout stays intact.
  ```

- [x] 4. Agent card block

  **What to do**:
  - Build the card UI for agent name, role, status, current task, and last update.
  - Include recent log preview or memo snippet.
  - Support empty and error card states.

  **Must NOT do**:
  - Do not make cards editable yet.
  - Do not add drag-and-drop.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `visual-engineering`
    - Reason: core UI block and visual hierarchy.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 8-10
  - **Blocked By**: 1, 2, 3

  **References**:
  - `Agents.md:3-29` - role naming and responsibilities
  - `agent-team.md:38-71` - team structure and panel intent

  **Acceptance Criteria**:
  - [ ] Each agent card shows at least 5 fields.
  - [ ] Status and last update are visible.
  - [ ] Empty/error cards render clearly.

  **QA Scenarios**:
  ```
  Scenario: Agent cards render with data
    Tool: Browser QA
    Steps:
      1. Load sample agent data.
      2. Verify name, role, status, task, and update time are visible.
    Expected Result: Cards display core info.

  Scenario: Long names wrap safely
    Tool: Browser QA
    Steps:
      1. Use a long agent name and task title.
      2. Confirm card layout does not break.
    Expected Result: Text wraps or truncates safely.
  ```

- [x] 5. Task status list block

  **What to do**:
  - Render a table or stacked list of task summaries.
  - Show status, assigned agent, priority, and timestamps.
  - Make blocked/error tasks easy to spot.

  **Must NOT do**:
  - Do not add task editing.
  - Do not introduce complex sorting filters.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `visual-engineering`
    - Reason: structured list/table UI.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 8-10
  - **Blocked By**: 1, 2, 3

  **References**:
  - `Agents.md:11-17` - data/status expectations

  **Acceptance Criteria**:
  - [ ] Task summary, state, owner, and priority are visible.
  - [ ] Empty and blocked rows are clearly distinguishable.

  **QA Scenarios**:
  ```
  Scenario: Task list shows assigned agents
    Tool: Browser QA
    Steps:
      1. Load sample task data.
      2. Verify assigned agent names appear next to tasks.
    Expected Result: Ownership is readable.

  Scenario: Blocked tasks are highlighted
    Tool: Browser QA
    Steps:
      1. Load blocked task records.
      2. Confirm they are visually marked.
    Expected Result: Blocked status stands out.
  ```

- [x] 6. Log/memo panel block

  **What to do**:
  - Show agent execution logs in time order.
  - Add memo notes for operational comments.
  - Support scrolling, truncation, and empty state.

  **Must NOT do**:
  - Do not build a full log query system.
  - Do not persist to backend.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `visual-engineering`
    - Reason: panel layout and readability.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 8-10
  - **Blocked By**: 1, 2, 3

  **References**:
  - `Agents.md:27-29` - QA expectations for logs and empty state

  **Acceptance Criteria**:
  - [ ] Log entries show time, agent, and message.
  - [ ] Memo area supports short notes.

  **QA Scenarios**:
  ```
  Scenario: Log stream displays newest entry order
    Tool: Browser QA
    Steps:
      1. Load multiple log entries.
      2. Confirm ordering matches the chosen rule.
    Expected Result: Logs are readable and ordered.

  Scenario: Empty memo state is visible
    Tool: Browser QA
    Steps:
      1. Clear memo data.
      2. Confirm placeholder text appears.
    Expected Result: Empty memo is clear.
  ```

- [x] 7. Model strategy checklist block

  **What to do**:
  - Add checklist chips or toggles for strategy candidates.
  - Mark each candidate as an assumption until confirmed.
  - Use the user-provided examples (위원회형, 리더형) plus 2 recommended candidates (분산형, 파이프라인형).
  - Show the active strategy and a short explanation.
  - Keep selection behavior simple.

  **Must NOT do**:
  - Do not turn this into a rules engine.
  - Do not build complex branching logic.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `visual-engineering`
    - Reason: checklist and state indicators.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 8-10
  - **Blocked By**: 1, 2, 3

  **References**:
  - Original request - 모델 사용 전략 체크리스트
  - `Agents.md:33` - 모호한 요구는 추측하지 않고 표시한다

  **Acceptance Criteria**:
  - [ ] At least 4 strategy options are visible.
  - [ ] Assumption labels are visible on unconfirmed strategy names.
  - [ ] Active selection is clearly marked.

  **QA Scenarios**:
  ```
  Scenario: Strategy selection updates UI
    Tool: Browser QA
    Steps:
      1. Click one strategy.
      2. Confirm active state changes.
    Expected Result: Selected strategy is obvious.

  Scenario: Checklist remains readable on narrow width
    Tool: Browser QA
    Steps:
      1. Shrink viewport width.
      2. Verify checklist stays usable.
    Expected Result: No overlap or clipping.
  ```

- [x] 8. State switching and mock interactions

  **What to do**:
  - Wire mock buttons or controls to change statuses.
  - Simulate running, waiting, blocked, and done transitions.
  - Update cards, tasks, and logs together.

  **Must NOT do**:
  - Do not connect to real agents.
  - Do not add async network calls.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `unspecified-high`
    - Reason: multiple panels must stay in sync.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: 9, 10
  - **Blocked By**: 4, 5, 6, 7

  **References**:
  - `Agents.md:31-34` - keep flow traceable and explicit

  **Acceptance Criteria**:
  - [ ] A single control changes at least one shared status.
  - [ ] Cards, task list, and logs update consistently.

  **QA Scenarios**:
  ```
  Scenario: Status transition updates multiple panels
    Tool: Browser QA
    Steps:
      1. Trigger a mock status change.
      2. Verify card, list, and log areas update.
    Expected Result: Panels stay in sync.

  Scenario: Invalid transition is handled safely
    Tool: Browser QA
    Steps:
      1. Attempt an unsupported mock status.
      2. Confirm UI does not break.
    Expected Result: Invalid input is ignored or flagged.
  ```

- [x] 9. Responsive layout and overflow handling

  **What to do**:
  - Make the dashboard stack well on narrower widths.
  - Ensure logs and task list can scroll safely.
  - Prevent long text from breaking the layout.

  **Must NOT do**:
  - Do not add mobile app complexity.
  - Do not redesign the entire UI.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `visual-engineering`
    - Reason: layout adaptation.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: 10
  - **Blocked By**: 4, 5, 6, 7, 8

  **References**:
  - `role-card.md:8-9` - avoid AI-looking, preserve readable design

  **Acceptance Criteria**:
  - [ ] Layout remains usable under narrow width.
  - [ ] Overflow is controlled in panels.

  **QA Scenarios**:
  ```
  Scenario: Narrow viewport still readable
    Tool: Browser QA
    Steps:
      1. Reduce viewport width.
      2. Verify panels stack or scroll safely.
    Expected Result: Dashboard remains usable.

  Scenario: Long content does not break grid
    Tool: Browser QA
    Steps:
      1. Insert long names and logs.
      2. Confirm grid stays aligned.
    Expected Result: No overlap or clipping.
  ```

- [x] 10. Accessibility pass and empty/error states

  **What to do**:
  - Add keyboard focus states and readable labels.
  - Verify color contrast for status chips.
  - Finalize empty, loading, and error states.

  **Must NOT do**:
  - Do not add a heavy accessibility library.
  - Do not over-engineer the state model.

  **Recommended Agent Profile**:
  > Select category + skills based on task domain.
  - **Category**: `unspecified-high`
    - Reason: cross-cutting quality pass.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Final
  - **Blocks**: Final sign-off
  - **Blocked By**: 4, 5, 6, 7, 8, 9

  **References**:
  - `Agents.md:27-34` - QA and common principles

  **Acceptance Criteria**:
  - [ ] Keyboard navigation works on key controls.
  - [ ] Empty/loading/error states are visually distinct.
  - [ ] Contrast is readable.

  **QA Scenarios**:
  ```
  Scenario: Keyboard focus is visible
    Tool: Browser QA
    Steps:
      1. Use Tab through the dashboard.
      2. Confirm focus is visible.
    Expected Result: Focus can be tracked.

  Scenario: Error state is understandable
    Tool: Browser QA
    Steps:
      1. Trigger an error mock.
      2. Confirm the message is clear.
    Expected Result: Error state is readable.
  ```

---

## Final Verification Wave

- [x] F1. Visual consistency check
- [x] F2. State sync check across panels
- [x] F3. Empty/error/loading state check
- [x] F4. Scope fidelity check against the plan

---

## Commit Strategy

- 1 plan file only: `docs`는 사용하지 않음
- Message: `docs(plan): add multi-agent dashboard plan`

---

## Success Criteria

### Verification Commands
```bash
open .omo/plans/multi-agent-dashboard.md
```

### Final Checklist
- [ ] 4개 핵심 패널이 정의됨
- [ ] 10~20분 단위 작업으로 쪼개짐
- [ ] v1 범위가 모니터링 전용으로 고정됨
- [ ] 보강 항목이 분리되어 있음
