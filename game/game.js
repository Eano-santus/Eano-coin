function postComment() {
  const box = document.getElementById('commentBox');
  const comment = box.value.trim();
  if (!comment) return;

  const list = document.getElementById('commentList');
  const li = document.createElement('li');
  li.textContent = comment;
  list.appendChild(li);
  box.value = '';
}

function shareEpisode() {
  const url = window.location.href;
  navigator.share
    ? navigator.share({ title: 'Alpha-Wolf Episode', url })
    : alert('Copy this link to share:\n' + url);
}
