document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert('Login successful!');
            window.location.href = 'home.html';
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
        console.error('Error:', error);
    }
});