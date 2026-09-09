/* รังติว - shared app logic */
const STORAGE = {
  loggedIn: 'rungtiewLoggedIn',
  email: 'rungtiewEmail',
  name: 'rungtiewName',
  photo: 'rungtiewPhoto',
  notifications: 'rungtiewNotifications'
};

let toastTimer;
let dropdownOpen = false;

function $(id) { return document.getElementById(id); }

function showToast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function toggleDrawer(open) {
  const drawer = $('drawer');
  const overlay = $('drawerOverlay');
  if (drawer) drawer.classList.toggle('show', open);
  if (overlay) overlay.classList.toggle('show', open);
}

function toggleDropdown() {
  const dd = $('profileDropdown');
  if (!dd) return;
  dropdownOpen = !dropdownOpen;
  dd.classList.toggle('show', dropdownOpen);
}

function logout() {
  localStorage.removeItem(STORAGE.loggedIn);
  window.location.href = 'index.html';
}

function requireLogin() {
  const publicPages = ['index.html', 'signup.html', 'forgot.html'];
  const page = location.pathname.split('/').pop() || 'index.html';
  if (!publicPages.includes(page) && localStorage.getItem(STORAGE.loggedIn) !== 'true') {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function getName() {
  return localStorage.getItem(STORAGE.name) || 'เกย์ริน';
}

function getEmail() {
  return localStorage.getItem(STORAGE.email) || '';
}

function getInitial(name) {
  return (name || 'G').trim().charAt(0).toUpperCase() || 'G';
}

function loadProfile() {
  const name = getName();
  const email = getEmail();
  const photo = localStorage.getItem(STORAGE.photo);

  const nameDisplay = $('nameDisplay');
  const nameInput = $('nameInput');
  const emailInput = $('profileEmail');
  const avatarLetter = $('avatarLetter');
  const avatarImg = $('avatarImg');

  if (nameDisplay) nameDisplay.textContent = name;
  if (nameInput) nameInput.value = name;
  if (emailInput) emailInput.value = email;

  if (avatarLetter) avatarLetter.textContent = getInitial(name);
  document.querySelectorAll('.profile-chip .avatar').forEach(a => a.textContent = getInitial(name));

  if (photo && avatarImg && avatarLetter) {
    avatarImg.src = photo;
    avatarImg.style.display = 'block';
    avatarLetter.style.display = 'none';
  }
}

function setupLogin() {
  const form = $('loginForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('loginEmail')?.value.trim();
    const pass = $('loginPass')?.value || '';
    if (!email || !pass) return;

    localStorage.setItem(STORAGE.loggedIn, 'true');
    localStorage.setItem(STORAGE.email, email);
    if (!localStorage.getItem(STORAGE.name)) {
      localStorage.setItem(STORAGE.name, email.split('@')[0] || 'เกย์ริน');
    }
    window.location.href = 'main.html';
  });
}

function setupSignup() {
  const form = $('signupForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('name')?.value.trim() || '';
    const email = $('email')?.value.trim() || '';
    const p1 = $('pass')?.value || '';
    const p2 = $('pass2')?.value || '';
    const error = $('signupError');
    const fail = msg => {
      if (error) { error.textContent = msg; error.style.display = 'block'; }
      showToast(msg);
    };
    if (error) error.style.display = 'none';
    if (!name || !email || !p1 || !p2) { fail('กรุณากรอกข้อมูลให้ครบทุกช่อง'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fail('กรุณากรอกอีเมลให้ถูกต้อง'); return; }
    if (p1.length < 6) { fail('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return; }
    if (p1 !== p2) { fail('รหัสผ่านไม่ตรงกัน กรุณาลองใหม่'); return; }

    try {
      localStorage.setItem(STORAGE.loggedIn, 'true');
      localStorage.setItem(STORAGE.email, email);
      localStorage.setItem(STORAGE.name, name);
      window.location.assign('main.html');
    } catch (err) {
      fail('ไม่สามารถบันทึกบัญชีในเบราว์เซอร์ได้ กรุณาเปิดเว็บผ่าน Chrome/Edge แล้วลองใหม่');
      console.error(err);
    }
  });
}

function setupForgot() {
  const form = $('forgotForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('femail')?.value.trim();
    if (!email) return;
    showToast('ส่งรหัสยืนยันไปยังอีเมลแล้ว');
    form.reset();
  });
}

function setupContact() {
  const form = $('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('ส่งข้อความเรียบร้อยแล้ว');
    form.reset();
  });
}

function setupReport() {
  const form = $('reportForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('ส่งรายงานเรียบร้อยแล้ว');
    form.reset();
  });
}

function goToCourse(id) {
  localStorage.setItem('rungtiewCourseId', id);
  window.location.href = 'course.html?c=' + encodeURIComponent(id);
}

function openJoinModal() {
  const modal = $('joinModal');
  if (!modal) return;
  modal.classList.add('show');
  $('classCodeInput')?.focus();
}

function closeJoinModal() {
  $('joinModal')?.classList.remove('show');
}

function checkClassCode() {
  const input = $('classCodeInput');
  const btn = $('joinConfirmBtn');
  if (input && btn) btn.disabled = input.value.trim().length === 0;
}

function confirmJoin() {
  const input = $('classCodeInput');
  const code = input?.value.trim();
  if (!code) return;
  closeJoinModal();
  showToast('เข้าร่วมชั้นเรียนแล้ว');
  if (input) input.value = '';
  const btn = $('joinConfirmBtn');
  if (btn) btn.disabled = true;
}

function toggleEditName() {
  const display = $('nameDisplay');
  const input = $('nameInput');
  const btn = $('editNameBtn');
  if (!display || !input || !btn) return;

  const editing = input.style.display !== 'none';
  if (!editing) {
    display.style.display = 'none';
    input.style.display = 'inline-block';
    input.focus();
    input.select();
  } else {
    const newName = input.value.trim() || getName();
    localStorage.setItem(STORAGE.name, newName);
    display.textContent = newName;
    input.value = newName;
    display.style.display = 'inline-block';
    input.style.display = 'none';
    document.querySelectorAll('.profile-chip .avatar').forEach(a => a.textContent = getInitial(newName));
    const avatarLetter = $('avatarLetter');
    if (avatarLetter) avatarLetter.textContent = getInitial(newName);
    showToast('บันทึกชื่อแล้ว');
  }
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;
  if (file.size > 3 * 1024 * 1024) {
    showToast('รูปต้องมีขนาดไม่เกิน 3 MB');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    localStorage.setItem(STORAGE.photo, dataUrl);
    const img = $('avatarImg');
    const letter = $('avatarLetter');
    if (img) { img.src = dataUrl; img.style.display = 'block'; }
    if (letter) letter.style.display = 'none';
    showToast('เปลี่ยนรูปโปรไฟล์แล้ว');
  };
  reader.readAsDataURL(file);
}

function setupSettings() {
  const toggle = $('notificationToggle');
  if (!toggle) return;
  toggle.checked = localStorage.getItem(STORAGE.notifications) !== 'false';
  toggle.addEventListener('change', () => {
    localStorage.setItem(STORAGE.notifications, String(toggle.checked));
    showToast(toggle.checked ? 'เปิดการแจ้งเตือนแล้ว' : 'ปิดการแจ้งเตือนแล้ว');
  });
}

document.addEventListener('click', e => {
  if (!e.target.closest('.profile-chip') && !e.target.closest('.dropdown')) {
    dropdownOpen = false;
    const dd = $('profileDropdown');
    if (dd) dd.classList.remove('show');
  }
  if (e.target.id === 'joinModal') closeJoinModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeJoinModal();
    toggleDrawer(false);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;
  loadProfile();
  setupLogin();
  setupSignup();
  setupForgot();
  setupContact();
  setupReport();
  setupSettings();
  checkClassCode();
});
