document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
  
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (username === 'Khusenov' && password === '1205') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
      } else {
        alert('Login yoki parol noto‘g‘ri!');
      }

      if (username === 'Shoxrux' && password === '1747') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
      } else {
        alert('Login yoki parol noto‘g‘ri!');
      }
      
    });
  });
