const loginBtn = document.getElementById('loginBtn');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginMessage = document.getElementById('loginMessage');

loginBtn.addEventListener('click', () => {
  const storedUser = localStorage.getItem('registeredUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    if (
      userData.username === loginUsername.value &&
      userData.password === loginPassword.value
    ) {
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      window.location.href = 'dashboard.html';
    } else {
      loginMessage.textContent = 'Invalid credentials.';
    }
  } else {
    loginMessage.textContent = 'No user found. Please sign up.';
  }
});
