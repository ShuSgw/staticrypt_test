document.querySelectorAll('nav a[href^="#"]:not(#logout)').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  })
);

// StatiCrypt のログイン保存を消して、パスワード画面に戻す
document.getElementById('logout').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('staticrypt_passphrase');
  localStorage.removeItem('staticrypt_expiration');
  location.reload();
});
