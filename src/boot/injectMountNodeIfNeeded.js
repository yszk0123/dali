export default function injectMountNodeIfNeeded() {
  const mountNode = document.getElementById('root');
  if (mountNode) {
    return mountNode;
  }

  const newMountNode = document.createElement('div');
  newMountNode.id = 'root';
  document.body.appendChild(newMountNode);
  return newMountNode;
}
