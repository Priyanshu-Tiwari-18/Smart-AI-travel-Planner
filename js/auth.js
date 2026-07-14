document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('travelUser')) {
        window.location.href = 'planner.html';
    }

    const authForm = document.getElementById('auth-form');

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (email && password) {
                const namePart = email.split('@')[0];
                const cleanNameMatch = namePart.match(/^[a-zA-Z]+/);
                const cleanName = cleanNameMatch ? cleanNameMatch[0] : 'Traveler';
                const userName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();

                localStorage.setItem('travelUser', userName);
                window.location.href = 'planner.html';
            }
        });
    }

    // --- FORGOT PASSWORD CLICK HANDLER ---
    const forgotPass = document.getElementById('forgot-pass');
    if (forgotPass) {
        forgotPass.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🔒 Reset link has been sent to your registered Gmail ID! (Demo Mode)');
        });
    }

    // --- TOGGLE LOGIN / REGISTER WITH SMART FORGOT BUTTON VISIBILITY ---
    const toggleAuth = document.getElementById('toggle-auth');
    if (toggleAuth) {
        let isLogin = true;
        toggleAuth.addEventListener('click', (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            
            const formTitle = document.querySelector('.login-form-container h2');
            const formSubtitle = document.querySelector('.subtitle');
            const submitBtn = document.querySelector('.btn-primary');
            
            if (isLogin) {
                formTitle.textContent = 'Welcome back ✨';
                formSubtitle.textContent = 'Login to access your saved itineraries and plan new trips.';
                submitBtn.innerHTML = 'Login ➔';
                toggleAuth.textContent = 'Create an account';
                toggleAuth.previousSibling.textContent = 'New user? ';
                if (forgotPass) forgotPass.style.display = 'inline-block'; // Login par show hoga
            } else {
                formTitle.textContent = 'Create Account 🚀';
                formSubtitle.textContent = 'Join TripPilot and start planning your dream trips today.';
                submitBtn.innerHTML = 'Sign Up ➔';
                toggleAuth.textContent = 'Login here';
                toggleAuth.previousSibling.textContent = 'Already have an account? ';
                if (forgotPass) forgotPass.style.display = 'none'; // Register par hide ho jayega
            }
        });
    }
});