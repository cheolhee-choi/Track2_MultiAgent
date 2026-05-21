(function () {
  'use strict';

  var AGENT_STATUS_LABELS = {
    idle:    '대기',
    running: '실행 중',
    waiting: '대기 중',
    blocked: '차단됨',
    error:   '오류',
    done:    '완료'
  };

  var TASK_STATUS_LABELS = {
    pending:     '대기',
    in_progress: '실행 중',
    waiting:     '대기 중',
    blocked:     '차단됨',
    error:       '오류',
    done:        '완료'
  };

  var PRIORITY_LABELS = {
    high:   '높음',
    medium: '보통',
    low:    '낮음'
  };

  function isValidAgentStatus(status) {
    return Object.prototype.hasOwnProperty.call(AGENT_STATUS_LABELS, status);
  }

  function isValidTaskStatus(status) {
    return Object.prototype.hasOwnProperty.call(TASK_STATUS_LABELS, status);
  }

  function appendLocativeParticle(word) {
    if (!word || typeof word !== 'string') return '으로';
    var code = word.charCodeAt(word.length - 1);
    if (code < 0xAC00 || code > 0xD7A3) return '으로';
    // Hangul jongseong (받침) index from syllable code: 0 = none, 8 = ㄹ → take '로'.
    var jongseong = (code - 0xAC00) % 28;
    if (jongseong === 0 || jongseong === 8) return '로';
    return '으로';
  }

  function getAgents() {
    return (window.MOCK_DATA && Array.isArray(window.MOCK_DATA.agents))
      ? window.MOCK_DATA.agents : [];
  }

  function getTasks() {
    return (window.MOCK_DATA && Array.isArray(window.MOCK_DATA.tasks))
      ? window.MOCK_DATA.tasks : [];
  }

  function getLogs() {
    if (!window.MOCK_DATA) return [];
    if (!Array.isArray(window.MOCK_DATA.logs)) window.MOCK_DATA.logs = [];
    return window.MOCK_DATA.logs;
  }

  function getMemos() {
    return (window.MOCK_DATA && Array.isArray(window.MOCK_DATA.memos))
      ? window.MOCK_DATA.memos : [];
  }

  function findById(list, id) {
    if (!Array.isArray(list) || !id) return null;
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === id) return list[i];
    }
    return null;
  }

  var logCounter = 0;
  function nextLogId() {
    logCounter += 1;
    return 'log-auto-' + Date.now() + '-' + logCounter;
  }

  function applyTransition(opts) {
    if (!opts || typeof opts !== 'object') return false;
    if (!window.MOCK_DATA) return false;

    var agent = findById(getAgents(), opts.agentId);
    var task = findById(getTasks(), opts.taskId);
    if (!agent) return false;
    if (opts.taskId && !task) return false;

    var nowIso = new Date().toISOString();
    var prevAgentStatus = agent.status;
    var prevTaskStatus = task ? task.status : null;

    if (isValidAgentStatus(opts.agentStatus)) {
      agent.status = opts.agentStatus;
      agent.lastUpdate = nowIso;
    }

    if (task && isValidTaskStatus(opts.taskStatus)) {
      task.status = opts.taskStatus;
      task.updatedAt = nowIso;
      agent.currentTask = task.id;
    }

    var prevLabel = AGENT_STATUS_LABELS[prevAgentStatus] || prevAgentStatus || '알 수 없음';
    var nextLabel = AGENT_STATUS_LABELS[agent.status] || agent.status || '알 수 없음';
    var particle = appendLocativeParticle(nextLabel);

    var message;
    if (prevAgentStatus === agent.status) {
      message = '상태를 ' + nextLabel + particle + ' 유지했습니다.';
    } else {
      message = '상태가 ' + prevLabel + ' \u2192 ' + nextLabel + particle + ' 변경되었습니다.';
    }

    if (task && prevTaskStatus !== task.status) {
      var prevTaskLabel = TASK_STATUS_LABELS[prevTaskStatus] || prevTaskStatus || '알 수 없음';
      var nextTaskLabel = TASK_STATUS_LABELS[task.status] || task.status || '알 수 없음';
      message += ' (작업 ' + prevTaskLabel + ' \u2192 ' + nextTaskLabel + ')';
    }

    var level = (agent.status === 'error') ? 'error'
              : (agent.status === 'blocked' || agent.status === 'waiting') ? 'warn'
              : 'info';

    getLogs().push({
      id: nextLogId(),
      timestamp: nowIso,
      agentId: agent.id,
      agentName: agent.name,
      message: message,
      level: level
    });

    return true;
  }

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function clearKeepingHeading(section) {
    if (!section) return;
    var heading = section.querySelector('h2');
    section.innerHTML = '';
    if (heading) section.appendChild(heading);
  }

  function createEmptyState(text) {
    var el = document.createElement('p');
    el.className = 'empty-state';
    el.textContent = text;
    return el;
  }

  function formatAgentDateTime(iso) {
    if (!iso || typeof iso !== 'string') return '\u2014';
    var datePart = iso.slice(0, 10);
    var timePart = iso.slice(11, 16);
    if (!datePart) return '\u2014';
    return timePart ? datePart + ' ' + timePart : datePart;
  }

  function buildMetaLine(label, value) {
    var line = document.createElement('p');
    line.className = 'card-meta';
    var labelEl = document.createElement('span');
    labelEl.className = 'muted';
    labelEl.textContent = label;
    line.appendChild(labelEl);
    line.appendChild(document.createTextNode(' \u00B7 ' + value));
    return line;
  }

  function buildAgentCard(agent, tasks) {
    var status = isValidAgentStatus(agent.status) ? agent.status : 'idle';
    var label = AGENT_STATUS_LABELS[status];

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

    var badge = document.createElement('span');
    badge.className = 'badge status-' + status;
    var dot = document.createElement('span');
    dot.className = 'status-dot status-' + status;
    badge.appendChild(dot);
    badge.appendChild(document.createTextNode(label));
    header.appendChild(badge);
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

    var task = findById(tasks, agent.currentTask);
    var taskTitle = task ? (task.title || '없음') : '없음';
    stack.appendChild(buildMetaLine('현재 작업', taskTitle));
    stack.appendChild(buildMetaLine('마지막 업데이트', formatAgentDateTime(agent.lastUpdate)));
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

  function refreshAgentCards() {
    var section = document.getElementById('agent-cards');
    if (!section) return;

    var agents = getAgents();
    var tasks = getTasks();

    clearKeepingHeading(section);

    if (agents.length === 0) {
      section.appendChild(createEmptyState('표시할 에이전트 카드가 없습니다.'));
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'card-grid scroll-region';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
    grid.style.gap = '0.75rem';
    grid.style.alignItems = 'stretch';

    for (var i = 0; i < agents.length; i++) {
      grid.appendChild(buildAgentCard(agents[i], tasks));
    }
    section.appendChild(grid);
  }

  function formatTaskTimestamp(iso) {
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

  function buildTaskCard(task, agentMap) {
    var status = isValidTaskStatus(task.status) ? task.status : 'pending';
    var classes = ['card', 'status-border-' + status];
    if (status === 'blocked' || status === 'error') {
      classes.push('status-' + status);
    }

    var card = document.createElement('div');
    card.className = classes.join(' ');

    var head = document.createElement('div');
    head.className = 'row-between';

    var title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = task.title || '제목 없음';
    head.appendChild(title);

    var badge = document.createElement('span');
    badge.className = 'badge status-' + status;

    var dot = document.createElement('span');
    dot.className = 'status-dot status-' + status;
    badge.appendChild(dot);

    badge.appendChild(document.createTextNode(TASK_STATUS_LABELS[status]));
    head.appendChild(badge);

    var agent = task.assignedAgent ? agentMap[task.assignedAgent] : null;
    var agentName = agent ? agent.name : '담당자 미지정';

    var meta = document.createElement('div');
    meta.className = 'row';

    var assigned = document.createElement('span');
    assigned.className = 'card-meta';
    assigned.textContent = '담당 \u00B7 ' + agentName;
    meta.appendChild(assigned);

    var chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = PRIORITY_LABELS[task.priority] || task.priority || '\u2014';
    meta.appendChild(chip);

    var updated = document.createElement('span');
    updated.className = 'card-meta';
    updated.textContent = '업데이트 ' + formatTaskTimestamp(task.updatedAt);
    meta.appendChild(updated);

    card.appendChild(head);
    card.appendChild(meta);
    return card;
  }

  function refreshTaskList() {
    var root = document.getElementById('task-list');
    if (!root) return;

    var tasks = getTasks();
    var agents = getAgents();

    var children = Array.prototype.slice.call(root.children);
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName !== 'H2') root.removeChild(children[i]);
    }

    if (tasks.length === 0) {
      root.appendChild(createEmptyState('표시할 작업 상태가 없습니다.'));
      return;
    }

    var agentMap = {};
    for (var k = 0; k < agents.length; k++) {
      if (agents[k] && agents[k].id) agentMap[agents[k].id] = agents[k];
    }

    var listContainer = document.createElement('div');
    listContainer.className = 'scroll-region stack';
    for (var j = 0; j < tasks.length; j++) {
      listContainer.appendChild(buildTaskCard(tasks[j], agentMap));
    }
    root.appendChild(listContainer);
  }

  function toTime(iso) {
    if (!iso) return 0;
    var t = new Date(iso).getTime();
    return isNaN(t) ? 0 : t;
  }

  function formatLogTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
  }

  function formatMemoDateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) +
      ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  function normalizeLogLevel(level) {
    if (level === 'warn' || level === 'error') return level;
    return 'info';
  }

  function buildLevelBadge(level) {
    if (level === 'warn') {
      var w = document.createElement('span');
      w.className = 'badge status-waiting';
      w.textContent = '경고';
      return w;
    }
    if (level === 'error') {
      var e = document.createElement('span');
      e.className = 'badge status-error';
      e.textContent = '오류';
      return e;
    }
    return null;
  }

  function buildLogEntry(log) {
    var level = normalizeLogLevel(log.level);
    var entry = document.createElement('div');
    entry.className = 'log-entry level-' + level;

    var time = document.createElement('time');
    time.className = 'log-time';
    if (log.timestamp) time.dateTime = log.timestamp;
    time.textContent = formatLogTime(log.timestamp);
    entry.appendChild(time);

    var agent = document.createElement('span');
    agent.className = 'badge';
    agent.textContent = log.agentName || log.agentId || '알 수 없음';
    entry.appendChild(agent);

    var levelBadge = buildLevelBadge(level);
    if (levelBadge) entry.appendChild(levelBadge);

    var message = document.createElement('span');
    message.className = 'log-message';
    message.textContent = log.message || '';
    entry.appendChild(message);

    return entry;
  }

  function buildLogSection(logs) {
    var wrapper = document.createElement('div');
    wrapper.className = 'log-section';

    var heading = document.createElement('p');
    heading.className = 'panel-subtitle';
    heading.textContent = '실행 로그';
    wrapper.appendChild(heading);

    if (logs.length === 0) {
      wrapper.appendChild(createEmptyState('기록된 로그가 없습니다.'));
      return wrapper;
    }

    var sorted = logs.slice().sort(function (a, b) {
      return toTime(b.timestamp) - toTime(a.timestamp);
    });

    var scroll = document.createElement('div');
    scroll.className = 'scroll-region log-stream';
    sorted.forEach(function (log) {
      scroll.appendChild(buildLogEntry(log));
    });
    wrapper.appendChild(scroll);
    return wrapper;
  }

  function buildMemoCard(memo) {
    var card = document.createElement('div');
    card.className = 'card memo-card';

    var content = document.createElement('p');
    content.className = 'memo-content';
    content.textContent = memo.content || '';
    card.appendChild(content);

    var meta = document.createElement('p');
    meta.className = 'card-meta';
    var parts = [];
    if (memo.author) parts.push(memo.author);
    var when = formatMemoDateTime(memo.timestamp);
    if (when) parts.push(when);
    meta.textContent = parts.join(' \u00B7 ');
    card.appendChild(meta);

    return card;
  }

  function buildMemoSection(memos) {
    var wrapper = document.createElement('div');
    wrapper.className = 'memo-section';

    var heading = document.createElement('p');
    heading.className = 'panel-subtitle';
    heading.textContent = '메모';
    wrapper.appendChild(heading);

    if (memos.length === 0) {
      wrapper.appendChild(createEmptyState('메모가 없습니다.'));
      return wrapper;
    }

    var sorted = memos.slice().sort(function (a, b) {
      return toTime(b.timestamp) - toTime(a.timestamp);
    });

    var stack = document.createElement('div');
    stack.className = 'stack';
    sorted.forEach(function (memo) {
      stack.appendChild(buildMemoCard(memo));
    });
    wrapper.appendChild(stack);

    return wrapper;
  }

  function refreshLogPanel() {
    var panel = document.getElementById('log-panel');
    if (!panel) return;

    var logs = getLogs().slice();
    var memos = getMemos().slice();

    var title = panel.querySelector('#log-panel-title') || panel.querySelector('h2');
    panel.innerHTML = '';
    if (title) panel.appendChild(title);

    panel.appendChild(buildLogSection(logs));

    var divider = document.createElement('hr');
    divider.className = 'divider';
    panel.appendChild(divider);

    panel.appendChild(buildMemoSection(memos));
  }

  function safeCall(fn) {
    try { fn(); } catch (err) {
      if (typeof console !== 'undefined' && console && console.warn) {
        console.warn('패널 갱신 실패:', err);
      }
    }
  }

  function refreshAll() {
    safeCall(refreshAgentCards);
    safeCall(refreshTaskList);
    safeCall(refreshLogPanel);
  }

  var TRANSITIONS = [
    {
      id: 'transition-planner-start',
      label: '기획자 실행 시작',
      agentId: 'agent-01',
      agentStatus: 'running',
      taskId: 'task-01',
      taskStatus: 'in_progress'
    },
    {
      id: 'transition-ui-done',
      label: 'UI 디자이너 작업 완료',
      agentId: 'agent-02',
      agentStatus: 'done',
      taskId: 'task-02',
      taskStatus: 'done'
    },
    {
      id: 'transition-reviewer-reset',
      label: '리뷰어 오류 초기화',
      agentId: 'agent-05',
      agentStatus: 'idle',
      taskId: 'task-05',
      taskStatus: 'pending'
    }
  ];

  function buildControls() {
    var bar = document.createElement('div');
    bar.id = 'state-controls';
    bar.className = 'panel';
    bar.style.flexDirection = 'row';
    bar.style.alignItems = 'center';
    bar.style.flexWrap = 'wrap';
    bar.style.gap = '0.6rem';
    bar.style.minHeight = '0';
    bar.style.padding = '0.6rem 0.9rem';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', '상태 시뮬레이션');

    var heading = document.createElement('h2');
    heading.textContent = '상태 시뮬레이션';
    heading.style.margin = '0';
    heading.style.fontSize = '0.95rem';
    heading.style.flex = '0 0 auto';
    bar.appendChild(heading);

    var hint = document.createElement('span');
    hint.className = 'card-meta';
    hint.style.margin = '0';
    hint.textContent = '버튼을 누르면 에이전트·작업·로그가 함께 갱신됩니다.';
    bar.appendChild(hint);

    var spacer = document.createElement('span');
    spacer.style.flex = '1 1 auto';
    bar.appendChild(spacer);

    TRANSITIONS.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.dataset.transitionId = t.id;
      btn.textContent = t.label;
      btn.style.cursor = 'pointer';
      btn.style.border = '1px solid var(--color-border)';
      btn.style.background = 'var(--color-surface)';
      btn.style.fontWeight = '500';
      btn.addEventListener('click', function () {
        try {
          var ok = applyTransition(t);
          if (ok) refreshAll();
        } catch (err) {
          if (typeof console !== 'undefined' && console && console.warn) {
            console.warn('상태 변경 실패:', err);
          }
        }
      });
      bar.appendChild(btn);
    });

    return bar;
  }

  function injectControls() {
    if (document.getElementById('state-controls')) return;
    var controls = buildControls();
    var header = document.querySelector('body > header');
    var main = document.querySelector('body > main');

    if (main && main.parentNode) {
      main.parentNode.insertBefore(controls, main);
    } else if (header && header.parentNode) {
      header.parentNode.insertBefore(controls, header.nextSibling);
    } else {
      document.body.appendChild(controls);
    }
  }

  window.DASHBOARD = window.DASHBOARD || {};
  window.DASHBOARD.refresh = refreshAll;
  window.DASHBOARD.applyTransition = applyTransition;

  document.addEventListener('DOMContentLoaded', function () {
    injectControls();
  });
})();
