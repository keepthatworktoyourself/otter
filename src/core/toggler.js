
export default function toggler(ev) {
  const target = document.getElementById(ev.currentTarget.getAttribute('data-toggler-target'));
  if (!target) {
    return;
  }

  if (getComputedStyle(target).display === 'none') {
    target.style.display = 'block';
    ev.currentTarget.setAttribute('data-toggle-open', true)
  }
  else {
    target.style.display = 'none';
    ev.currentTarget.removeAttribute('data-toggle-open');
  }
}

