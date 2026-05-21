window.MOCK_DATA = {
  agents: [
    {
      id: "agent-01",
      name: "기획 오케스트레이터",
      role: "요구사항 정리와 우선순위 조율",
      status: "running",
      currentTask: "task-01",
      lastUpdate: "2026-05-21T09:12:00.000Z",
      logSnippet: "전체 작업 흐름을 재정렬했습니다."
    },
    {
      id: "agent-02",
      name: "UI/UX 디자이너",
      role: "화면 구조와 상태 표현 설계",
      status: "idle",
      currentTask: null,
      lastUpdate: "2026-05-21T09:05:00.000Z",
      logSnippet: "대기 중이며 다음 시안을 준비합니다."
    },
    {
      id: "agent-03",
      name: "데이터/상태 설계자",
      role: "데이터 구조와 상태 모델 정의",
      status: "waiting",
      currentTask: "task-03",
      lastUpdate: "2026-05-21T09:18:00.000Z",
      logSnippet: "입력 검토를 기다리고 있습니다."
    },
    {
      id: "agent-04",
      name: "구현 에이전트",
      role: "실제 코드와 UI 연결 구현",
      status: "blocked",
      currentTask: "task-04",
      lastUpdate: "2026-05-21T09:22:00.000Z",
      logSnippet: "의존성 누락으로 진행이 멈췄습니다."
    },
    {
      id: "agent-05",
      name: "코드 리뷰어",
      role: "결함과 리스크 검토",
      status: "error",
      currentTask: "task-05",
      lastUpdate: "2026-05-21T09:25:00.000Z",
      logSnippet: "검토 기준 충돌이 발생했습니다."
    },
    {
      id: "agent-06",
      name: "TDD 에이전트",
      role: "핵심 흐름 테스트 초안 작성",
      status: "done",
      currentTask: "task-06",
      lastUpdate: "2026-05-21T09:28:00.000Z",
      logSnippet: "테스트 초안을 완료했습니다."
    },
    {
      id: "agent-07",
      name: "QA/검증 에이전트",
      role: "사용자 흐름과 빈 상태 점검",
      status: "running",
      currentTask: "task-08",
      lastUpdate: "2026-05-21T09:30:00.000Z",
      logSnippet: "실제 화면 흐름을 검증 중입니다."
    }
  ],
  tasks: [
    {
      id: "task-01",
      title: "대시보드 정보 구조 정리",
      status: "in_progress",
      assignedAgent: "agent-01",
      priority: "high",
      createdAt: "2026-05-21T08:40:00.000Z",
      updatedAt: "2026-05-21T09:12:00.000Z"
    },
    {
      id: "task-02",
      title: "상태 카드 레이아웃 초안",
      status: "pending",
      assignedAgent: "agent-02",
      priority: "medium",
      createdAt: "2026-05-21T08:45:00.000Z",
      updatedAt: "2026-05-21T08:45:00.000Z"
    },
    {
      id: "task-03",
      title: "에이전트 데이터 스키마 확정",
      status: "waiting",
      assignedAgent: "agent-03",
      priority: "high",
      createdAt: "2026-05-21T08:50:00.000Z",
      updatedAt: "2026-05-21T09:18:00.000Z"
    },
    {
      id: "task-04",
      title: "실시간 로그 스트림 연결",
      status: "blocked",
      assignedAgent: "agent-04",
      priority: "high",
      createdAt: "2026-05-21T08:55:00.000Z",
      updatedAt: "2026-05-21T09:22:00.000Z"
    },
    {
      id: "task-05",
      title: "리뷰 기준과 경고 문구 정리",
      status: "error",
      assignedAgent: "agent-05",
      priority: "medium",
      createdAt: "2026-05-21T08:58:00.000Z",
      updatedAt: "2026-05-21T09:25:00.000Z"
    },
    {
      id: "task-06",
      title: "핵심 흐름 테스트 초안 작성",
      status: "done",
      assignedAgent: "agent-06",
      priority: "medium",
      createdAt: "2026-05-21T09:00:00.000Z",
      updatedAt: "2026-05-21T09:28:00.000Z"
    },
    {
      id: "task-07",
      title: "빈 상태 안내 문구 점검",
      status: "pending",
      assignedAgent: "agent-07",
      priority: "low",
      createdAt: "2026-05-21T09:02:00.000Z",
      updatedAt: "2026-05-21T09:02:00.000Z"
    },
    {
      id: "task-08",
      title: "사용자 흐름 수동 검증",
      status: "in_progress",
      assignedAgent: "agent-07",
      priority: "high",
      createdAt: "2026-05-21T09:10:00.000Z",
      updatedAt: "2026-05-21T09:30:00.000Z"
    },
    {
      id: "task-09",
      title: "전략 옵션 라벨 정리",
      status: "waiting",
      assignedAgent: "agent-02",
      priority: "low",
      createdAt: "2026-05-21T09:14:00.000Z",
      updatedAt: "2026-05-21T09:20:00.000Z"
    },
    {
      id: "task-10",
      title: "최종 메모 반영 및 마감",
      status: "done",
      assignedAgent: "agent-01",
      priority: "medium",
      createdAt: "2026-05-21T09:16:00.000Z",
      updatedAt: "2026-05-21T09:32:00.000Z"
    }
  ],
  logs: [
    {
      id: "log-01",
      timestamp: "2026-05-21T09:12:00.000Z",
      agentId: "agent-01",
      agentName: "기획 오케스트레이터",
      message: "우선순위를 재조정하고 작업 순서를 다시 배치했습니다.",
      level: "info"
    },
    {
      id: "log-02",
      timestamp: "2026-05-21T09:18:00.000Z",
      agentId: "agent-03",
      agentName: "데이터/상태 설계자",
      message: "상태 모델 초안을 검토 요청 상태로 전환했습니다.",
      level: "info"
    },
    {
      id: "log-03",
      timestamp: "2026-05-21T09:22:00.000Z",
      agentId: "agent-04",
      agentName: "구현 에이전트",
      message: "필수 입력 데이터가 없어 로그 연결을 중단했습니다.",
      level: "warn"
    },
    {
      id: "log-04",
      timestamp: "2026-05-21T09:25:00.000Z",
      agentId: "agent-05",
      agentName: "코드 리뷰어",
      message: "검토 규칙 충돌로 자동 판정에 실패했습니다.",
      level: "error"
    },
    {
      id: "log-05",
      timestamp: "2026-05-21T09:28:00.000Z",
      agentId: "agent-06",
      agentName: "TDD 에이전트",
      message: "핵심 시나리오 3건에 대한 테스트 초안을 저장했습니다.",
      level: "info"
    },
    {
      id: "log-06",
      timestamp: "2026-05-21T09:30:00.000Z",
      agentId: "agent-07",
      agentName: "QA/검증 에이전트",
      message: "빈 상태와 로딩 상태를 실제 흐름 기준으로 확인 중입니다.",
      level: "info"
    },
    {
      id: "log-07",
      timestamp: "2026-05-21T09:31:00.000Z",
      agentId: "agent-02",
      agentName: "UI/UX 디자이너",
      message: "카드 간 간격과 시선 흐름을 다시 정리했습니다.",
      level: "info"
    },
    {
      id: "log-08",
      timestamp: "2026-05-21T09:32:00.000Z",
      agentId: "agent-01",
      agentName: "기획 오케스트레이터",
      message: "최종 메모 반영 후 다음 단계로 이관했습니다.",
      level: "info"
    }
  ],
  memos: [
    {
      id: "memo-01",
      timestamp: "2026-05-21T09:15:00.000Z",
      content: "대시보드는 읽기 전용으로 유지하고, 상태 변화는 한눈에 보이도록 정리한다.",
      author: "기획 오케스트레이터"
    },
    {
      id: "memo-02",
      timestamp: "2026-05-21T09:27:00.000Z",
      content: "오류와 차단 상태는 색보다 문구를 우선 보여 주어 오해를 줄인다.",
      author: "코드 리뷰어"
    }
  ],
  strategies: [
    {
      id: "strategy-01",
      name: "위원회형",
      description: "여러 에이전트가 함께 검토하고 합의로 결정을 내립니다.",
      isActive: false,
      isConfirmed: false
    },
    {
      id: "strategy-02",
      name: "리더형",
      description: "한 명의 중심 에이전트가 전체 흐름을 지휘합니다.",
      isActive: false,
      isConfirmed: false
    },
    {
      id: "strategy-03",
      name: "분산형",
      description: "역할별 에이전트가 독립적으로 움직이며 결과를 모읍니다.",
      isActive: true,
      isConfirmed: true
    },
    {
      id: "strategy-04",
      name: "파이프라인형",
      description: "기획부터 검증까지 순차 단계로 흘려보냅니다.",
      isActive: false,
      isConfirmed: true
    }
  ]
};
