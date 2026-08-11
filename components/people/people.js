function initProfileCards() {
  const cards = document.querySelectorAll('#people .person--clickable');
  const modal = document.getElementById('personModal');
  if (!modal) return;

  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const modalAvatar = document.getElementById('modalAvatar');
  const modalRole = document.getElementById('modalRole');
  const modalName = document.getElementById('modalName');
  const modalContent = document.getElementById('modalContent');

  function openModal(card) {
    const avatar = card.querySelector('.person__avatar');
    const role = card.querySelector('.person__role');
    const name = card.querySelector('.person__name');
    const qualSrc = card.querySelector('.person__qualification-src') || card.querySelector('.person__qualification');

    if (modalAvatar && avatar) modalAvatar.innerHTML = avatar.innerHTML;
    if (modalRole && role) modalRole.textContent = role.textContent;
    if (modalName && name) modalName.textContent = name.textContent;
    if (modalContent && qualSrc) modalContent.innerHTML = qualSrc.innerHTML;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  cards.forEach(card => {
    card.addEventListener('click', function (e) {
      openModal(card);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

fetch("components/people/people.html")
  .then(response => response.text())
  .then(data => {
    const container = document.getElementById("people");
    if (!container) return;
    container.innerHTML = data;

    initProfileCards();
  });
