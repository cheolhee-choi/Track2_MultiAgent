(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.getElementById('log-panel');
    if (!panel) return;

    var data = (window.MOCK_DATA && typeof window.MOCK_DATA === 'object') ? window.MOCK_DATA : {};
    var logs = Array.isArray(data.logs) ? data.logs.slice() : [];
    var memos = Array.isArray(data.memos) ? data.memos.slice() : [];

    ensureStyles();
    render(panel, logs, memos);
  });

  function render(panel, logs, memos) {
    var title = panel.querySelector('#log-panel-title') || panel.querySelector('h2');
    panel.innerHTML = '';
    if (title) panel.appendChild(title);

    panel.appendChild(buildLogSection(logs));

    var divider = document.createElement('hr');
    divider.className = 'divider';
    panel.appendChild(divider);

    panel.appendChild(buildMemoSection(memos));
  }

  function buildLogSection(logs) {
    var wrapper = document.createElement('div');
    wrapper.className = 'log-section';

    var heading = document.createElement('p');
    heading.className = 'panel-subtitle';
    heading.textContent = '실행 로그';
    wrapper.appendChild(heading);

    if (logs.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = '기록된 로그가 없습니다.';
      wrapper.appendChild(empty);
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

  function buildLogEntry(log) {
    var level = normalizeLevel(log.level);

    var entry = document.createElement('div');
    entry.className = 'log-entry level-' + level;

    var time = document.createElement('time');
    time.className = 'log-time';
    if (log.timestamp) time.dateTime = log.timestamp;
    time.textContent = formatTime(log.timestamp);
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

  function buildMemoSection(memos) {
    var wrapper = document.createElement('div');
    wrapper.className = 'memo-section';

    var heading = document.createElement('p');
    heading.className = 'panel-subtitle';
    heading.textContent = '메모';
    wrapper.appendChild(heading);

    if (memos.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = '메모가 없습니다.';
      wrapper.appendChild(empty);
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
    var when = formatDateTime(memo.timestamp);
    if (when) parts.push(when);
    meta.textContent = parts.join(' · ');
    card.appendChild(meta);

    return card;
  }

  function normalizeLevel(level) {
    if (level === 'warn' || level === 'error') return level;
    return 'info';
  }

  function toTime(iso) {
    if (!iso) return 0;
    var t = new Date(iso).getTime();
    return isNaN(t) ? 0 : t;
  }

  function formatTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function formatDateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function ensureStyles() {
    if (document.getElementById('log-panel-inline-styles')) return;
    var style = document.createElement('style');
    style.id = 'log-panel-inline-styles';
    style.textContent = [
      '#log-panel .log-section,',
      '#log-panel .memo-section {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: var(--space-2);',
      '}',
      '#log-panel .log-stream {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: var(--space-2);',
      '}',
      '#log-panel .log-entry {',
      '  display: flex;',
      '  align-items: baseline;',
      '  flex-wrap: wrap;',
      '  gap: 0.5rem;',
      '  padding: 0.5rem 0.65rem;',
      '  border-radius: var(--radius-sm);',
      '  background: var(--color-surface-alt);',
      '  border: 1px solid var(--color-border-soft);',
      '  border-left: 3px solid transparent;',
      '}',
      '#log-panel .log-entry.level-warn {',
      '  border-left-color: var(--color-waiting);',
      '}',
      '#log-panel .log-entry.level-error {',
      '  border-left-color: var(--color-error);',
      '}',
      '#log-panel .log-time {',
      '  font-variant-numeric: tabular-nums;',
      '  font-size: 0.78rem;',
      '  color: var(--color-text-subtle);',
      '  letter-spacing: 0.02em;',
      '  min-width: 4.5rem;',
      '}',
      '#log-panel .log-message {',
      '  flex: 1 1 12rem;',
      '  font-size: 0.86rem;',
      '  line-height: 1.5;',
      '  color: var(--color-text);',
      '}',
      '#log-panel .log-entry.level-info .log-message {',
      '  color: var(--color-text-muted);',
      '}',
      '#log-panel .memo-card .memo-content {',
      '  margin: 0;',
      '  font-size: 0.88rem;',
      '  line-height: 1.55;',
      '  color: var(--color-text);',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }
})();
