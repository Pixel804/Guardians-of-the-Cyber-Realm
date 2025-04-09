const signupBtn = document.getElementById('signupBtn');
const signupUsername = document.getElementById('signupUsername');
const signupPassword = document.getElementById('signupPassword');
const signupConfirm = document.getElementById('signupConfirm');
const signupMessage = document.getElementById('signupMessage');

signupBtn.addEventListener('click', () => {
  if (
    signupUsername.value.trim() === '' ||
    signupPassword.value.trim() === '' ||
    signupConfirm.value.trim() === ''
  ) {
    signupMessage.textContent = 'All fields are required.';
    return;
  }
  if (signupPassword.value !== signupConfirm.value) {
    signupMessage.textContent = 'Passwords do not match.';
    return;
  }
  const userData = {
    username: signupUsername.value,
    password: signupPassword.value
  };
  localStorage.setItem('registeredUser', JSON.stringify(userData));
  signupMessage.style.color = 'lime';
  signupMessage.textContent = 'Signup successful. You can now login.';
});
