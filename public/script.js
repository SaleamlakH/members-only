// Settings update requests

const profileForm = document.querySelector('#profile-update');
const passwordForm = document.querySelector('#password-update');
const deleteAccount = document.querySelector('#delete-account-btn');

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    username: profileForm.username.value,
    email: profileForm.email.value,
  };

  try {
    const response = await fetch('/users/settings/profile', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Profile updated successfully');
    }

    // display errors
    if (response.status === 400) {
      const { errors } = await response.json();

      // username errors
      if (errors.username) {
        const usernameError = profileForm.querySelector('.username.error');
        usernameError.textContent = errors.username.message;
      }

      // email errors
      if (errors.email) {
        const emailError = profileForm.querySelector('.email.error');
        emailError.textContent = errors.email.message;
      }
    }
  } catch (error) {
    console.log(error);
  }
});

passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    current_password: passwordForm.current_password.value,
    password: passwordForm.password.value,
    confirm_password: passwordForm.confirm_password.value,
  };

  try {
    const response = await fetch('/users/settings/password', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Password changed successfully.');

      // clear inputs
      const inputs = passwordForm.querySelectorAll('input');
      inputs.forEach((input) => (input.value = ''));
    }

    // display validation errors
    if (response.status === 400) {
      const { errors } = await response.json();

      // display password
      if (errors.password) {
        const passwordError = passwordForm.querySelector('.password.error');
        passwordError.textContent = errors.password.message;
      }

      if (errors.confirm_password) {
        const confirmPasswordError = passwordForm.querySelector('.confirm_password.error');
        confirmPasswordError.textContent = errors.confirm_password.message;
      }
    }
  } catch (error) {
    console.log(error);
  }
});

deleteAccount.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('/users/settings', {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.href = '/';
      return;
    }
  } catch (error) {
    console.log(error);
  }
});
