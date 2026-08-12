const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});

mobileMenu?.addEventListener('click', event => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    menuButton.focus();
  }
});

const dropdownButtons = [...document.querySelectorAll('[data-dropdown-button]')];

function closeDropdowns(exceptButton = null) {
  dropdownButtons.forEach(button => {
    if (button === exceptButton) return;
    button.setAttribute('aria-expanded', 'false');
    const menu = button.parentElement.querySelector('[data-dropdown-menu]');
    if (menu) menu.hidden = true;
  });
}

dropdownButtons.forEach(button => {
	const dropdown = button.closest('.nav-dropdown');
	let closeTimer;

	const openDropdown = () => {
		clearTimeout(closeTimer);
		closeDropdowns(button);
		button.setAttribute('aria-expanded', 'true');
		const menu = dropdown?.querySelector('[data-dropdown-menu]');
		if (menu) menu.hidden = false;
	};

	const scheduleClose = () => {
		closeTimer = setTimeout(() => {
			button.setAttribute('aria-expanded', 'false');
			const menu = dropdown?.querySelector('[data-dropdown-menu]');
			if (menu) menu.hidden = true;
		}, 140);
	};

	dropdown?.addEventListener('pointerenter', openDropdown);
	dropdown?.addEventListener('pointerleave', scheduleClose);
	dropdown?.addEventListener('focusin', openDropdown);
	dropdown?.addEventListener('focusout', event => {
		if (!dropdown.contains(event.relatedTarget)) scheduleClose();
	});

  button.addEventListener('click', event => {
    event.stopPropagation();
    const menu = button.parentElement.querySelector('[data-dropdown-menu]');
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    closeDropdowns(button);
    button.setAttribute('aria-expanded', String(willOpen));
    if (menu) menu.hidden = !willOpen;
  });
});

document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) closeDropdowns();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const openButton = dropdownButtons.find(button => button.getAttribute('aria-expanded') === 'true');
    if (openButton) {
      closeDropdowns();
      openButton.focus();
    }
  }
});
