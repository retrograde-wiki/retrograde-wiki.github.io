document.querySelectorAll('.zone-body h3').forEach(function (h) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  h.parentNode.insertBefore(details, h);
  summary.appendChild(h);
  details.appendChild(summary);

  let next = details.nextSibling;
  while (next && !(next.nodeType === 1 && /^H[1-3]$/.test(next.tagName))) {
    const current = next;
    next = next.nextSibling;
    details.appendChild(current);
  }
});
