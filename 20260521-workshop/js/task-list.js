(function () {
  'use strict';

  var STATUS_LABELS = {
    pending: '대기',
    in_progress: '실행 중',
    waiting: '대기 중',
    blocked: '차단됨',
    error: '오류',
    done: '완료'
  };

  var PRIORITY_LABELS = {
    high: '높음',
    medium: '보통',
    low: '낮음'
  };

  var HIGHLIGHTED_STATUSES = { blocked: true, error: true };

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  // 원본 ISO 표기와 화면 표시가 어긋나지 않도록 UTC 성분으로 포맷한다.
  function formatTimestamp(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return (
      d.getUTCFullYear() +
      '-' + pad2(d.getUTCMonth() + 1) +
      '-' + pad2(d.getUTCDate()) +
      ' ' + pad2(d.getUTCHours()) +
      ':' + pad2(d.getUTCMinutes())
    );
  }

  function buildAgentMap(agents) {
    var map = {};
    for (var i = 0; i < agents.length; i++) {
      map[agents[i].id] = agents[i];
    }
    return map;
  }

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function createTaskCard(task, agentMap) {
    var classes = ['card', 'status-border-' + task.status];
    if (HIGHLIGHTED_STATUSES[task.status]) {
      classes.push('status-' + task.status);
    }
    var card = createEl('div', classes.join(' '));

    var head = createEl('div', 'row-between');
    head.appendChild(createEl('h3', 'card-title', task.title));
    var badge = document.createElement('span');
    badge.className = 'badge status-' + task.status;

    var dot = document.createElement('span');
    dot.className = 'status-dot status-' + task.status;
    badge.appendChild(dot);

    badge.appendChild(document.createTextNode(STATUS_LABELS[task.status] || task.status));
    head.appendChild(badge);

    var agent = agentMap[task.assignedAgent];
    var agentName = agent ? agent.name : '담당자 미지정';

    var meta = createEl('div', 'row');
    meta.appendChild(createEl('span', 'card-meta', '담당 · ' + agentName));
    meta.appendChild(
      createEl(
        'span',
        'chip',
        PRIORITY_LABELS[task.priority] || task.priority
      )
    );
    meta.appendChild(
      createEl('span', 'card-meta', '업데이트 ' + formatTimestamp(task.updatedAt))
    );

    card.appendChild(head);
    card.appendChild(meta);
    return card;
  }

  function createEmptyState() {
    return createEl('p', 'empty-state', '표시할 작업 상태가 없습니다.');
  }

  function removeChildrenExceptHeading(root) {
    var children = Array.prototype.slice.call(root.children);
    for (var i = 0; i < children.length; i++) {
      var node = children[i];
      if (node.tagName !== 'H2') {
        root.removeChild(node);
      }
    }
  }

  function render() {
    var root = document.getElementById('task-list');
    if (!root) return;

    var data = window.MOCK_DATA || {};
    var tasks = Array.isArray(data.tasks) ? data.tasks : [];
    var agents = Array.isArray(data.agents) ? data.agents : [];

    removeChildrenExceptHeading(root);

    if (tasks.length === 0) {
      root.appendChild(createEmptyState());
      return;
    }

    var agentMap = buildAgentMap(agents);
    var listContainer = createEl('div', 'scroll-region stack');

    for (var i = 0; i < tasks.length; i++) {
      listContainer.appendChild(createTaskCard(tasks[i], agentMap));
    }

    root.appendChild(listContainer);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
