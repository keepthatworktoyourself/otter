
export default function toggler(ev) {
  const target = ev.currentTarget.parentNode.querySelector('.toggle');
  if (!target) {
    return;
  }

  if (getComputedStyle(target).display === 'none') {
    target.style.display = 'block';
  }
  else {
    target.style.display = 'none';
  }
}
