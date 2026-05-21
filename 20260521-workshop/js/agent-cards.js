(function () {
  'use strict';

  var STATUS_LABELS = {
    idle:    '대기',
    running: '실행 중',
    waiting: '대기 중',
    blocked: '차단됨',
    error:   '오류',
    done:    '완료'
  };

  function formatDateTime(iso) {
    if (!iso || typeof iso !== 'string') return '—';
    var datePart = iso.slice(0, 10);
    var timePart = iso.slice(11, 16);
    if (!datePart) return '—';
    return timePart ? datePart + ' ' + timePart : datePart;
  }

  function getTaskTitle(taskId, tasks) {
    if (!taskId || !Array.isArray(tasks)) return null;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i] && tasks[i].id === taskId) return tasks[i].title || null;
    }
    return null;
  }

  function createStatusBadge(status) {
    var safeStatus = STATUS_LABELS[status] ? status : 'idle';
    var label = STATUS_LABELS[safeStatus];

    var badge = document.createElement('span');
    badge.className = 'badge status-' + safeStatus;

    var dot = document.createElement('span');
    dot.className = 'status-dot status-' + safeStatus;
    badge.appendChild(dot);

    badge.appendChild(document.createTextNode(label));
    return badge;
  }

  function createMetaLine(label, value) {
    var line = document.createElement('p');
    line.className = 'card-meta';

    var labelEl = document.createElement('span');
    labelEl.className = 'muted';
    labelEl.textContent = label;
    line.appendChild(labelEl);

    line.appendChild(document.createTextNode(' · ' + value));
    return line;
  }

  function createAgentCard(agent, tasks) {
    var status = STATUS_LABELS[agent.status] ? agent.status : 'idle';

    var card = document.createElement('article');
    card.className = 'card status-border-' + status;
    card.setAttribute('data-agent-id', agent.id || '');

    if (agent.status === 'error') {
      card.style.background =
        'linear-gradient(0deg, var(--color-error-bg), var(--color-error-bg)), var(--color-surface)';
      card.style.borderColor = 'var(--color-error)';
    }

    var header = document.createElement('div');
    header.className = 'row-between';

    var title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = agent.name || '이름 없는 에이전트';
    header.appendChild(title);

    header.appendChild(createStatusBadge(agent.status));
    card.appendChild(header);

    if (agent.role) {
      var role = document.createElement('p');
      role.className = 'card-meta';
      role.textContent = agent.role;
      card.appendChild(role);
    }

    var stack = document.createElement('div');
    stack.className = 'stack';
    stack.style.gap = '0.2rem';

    var taskTitle = getTaskTitle(agent.currentTask, tasks);
    stack.appendChild(createMetaLine('현재 작업', taskTitle || '없음'));
    stack.appendChild(createMetaLine('마지막 업데이트', formatDateTime(agent.lastUpdate)));

    card.appendChild(stack);

    if (agent.logSnippet) {
      var snippet = document.createElement('p');
      snippet.className = 'card-meta subtle';
      snippet.style.fontStyle = 'italic';
      snippet.style.borderTop = '1px dashed var(--color-border-soft)';
      snippet.style.paddingTop = '0.4rem';
      snippet.style.marginTop = '0.1rem';
      snippet.textContent = '\u201C' + agent.logSnippet + '\u201D';
      card.appendChild(snippet);
    }

    return card;
  }

  function renderEmptyState(section) {
    var empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = '표시할 에이전트 카드가 없습니다.';
    section.appendChild(empty);
  }

  function clearSectionKeepingHeading(section) {
    var heading = section.querySelector('h2');
    section.innerHTML = '';
    if (heading) section.appendChild(heading);
  }

  function renderAgentCards() {
    var section = document.getElementById('agent-cards');
    if (!section) return;

    var data = (window.MOCK_DATA && Array.isArray(window.MOCK_DATA.agents))
      ? window.MOCK_DATA.agents
      : [];
    var tasks = (window.MOCK_DATA && Array.isArray(window.MOCK_DATA.tasks))
      ? window.MOCK_DATA.tasks
      : [];

    clearSectionKeepingHeading(section);

    if (data.length === 0) {
      renderEmptyState(section);
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'card-grid scroll-region';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
    grid.style.gap = '0.75rem';
    grid.style.alignItems = 'stretch';

    for (var i = 0; i < data.length; i++) {
      grid.appendChild(createAgentCard(data[i], tasks));
    }

    section.appendChild(grid);
  }

  document.addEventListener('DOMContentLoaded', renderAgentCards);
})();
