/**
 * strategy.js
 * Renders the model strategy checklist into the #strategy-checklist panel
 * using window.MOCK_DATA.strategies.
 *
 * Selection is in-memory only (pure UI state, no persistence).
 */
(function () {
  'use strict';

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
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

  function createAssumptionBadge() {
    return createEl('span', 'badge status-waiting', '가정');
  }

  function createStrategyButton(strategy, onSelect) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.dataset.strategyId = strategy.id;
    btn.setAttribute('aria-pressed', strategy.isActive ? 'true' : 'false');
    btn.style.cursor = 'pointer';

    btn.appendChild(document.createTextNode(strategy.name));

    if (!strategy.isConfirmed) {
      btn.appendChild(createAssumptionBadge());
    }

    if (strategy.isActive) {
      btn.classList.add('status-running');
      btn.style.outline = '2px solid var(--color-running)';
      btn.style.outlineOffset = '1px';
      btn.style.borderColor = 'transparent';
    }

    btn.addEventListener('click', function () {
      onSelect(strategy.id);
    });

    return btn;
  }

  function createDetailCard(active) {
    var card = createEl('div', 'card');

    if (!active) {
      var empty = createEl('p', 'card-meta', '선택된 전략이 없습니다.');
      empty.style.margin = '0';
      card.appendChild(empty);
      return card;
    }

    var header = createEl('div', 'row');
    header.appendChild(createEl('span', 'card-meta', '현재 전략:'));

    var name = createEl('strong', 'card-title', active.name);
    name.style.margin = '0';
    header.appendChild(name);

    if (!active.isConfirmed) {
      header.appendChild(createAssumptionBadge());
    }

    var description = createEl('p', null, active.description);
    description.style.margin = '0';

    card.appendChild(header);
    card.appendChild(description);
    return card;
  }

  function render(root, strategies, onSelect) {
    removeChildrenExceptHeading(root);

    if (!strategies.length) {
      root.appendChild(createEl('p', 'empty-state', '확인할 전략 항목이 없습니다.'));
      return;
    }

    var stack = createEl('div', 'stack');

    var options = createEl('div', 'row');
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', '전략 옵션');

    for (var i = 0; i < strategies.length; i++) {
      options.appendChild(createStrategyButton(strategies[i], onSelect));
    }

    var active = null;
    for (var j = 0; j < strategies.length; j++) {
      if (strategies[j].isActive) { active = strategies[j]; break; }
    }

    stack.appendChild(options);
    stack.appendChild(createDetailCard(active));
    root.appendChild(stack);
  }

  function init() {
    var root = document.getElementById('strategy-checklist');
    if (!root) return;

    var source = (window.MOCK_DATA && Array.isArray(window.MOCK_DATA.strategies))
      ? window.MOCK_DATA.strategies
      : [];

    var strategies = source.map(function (s) {
      return {
        id: s.id,
        name: s.name,
        description: s.description,
        isActive: !!s.isActive,
        isConfirmed: !!s.isConfirmed
      };
    });

    function setActive(id) {
      for (var i = 0; i < strategies.length; i++) {
        strategies[i].isActive = (strategies[i].id === id);
      }
      render(root, strategies, setActive);
    }

    render(root, strategies, setActive);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
