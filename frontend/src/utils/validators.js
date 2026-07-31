export const validators = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isStrongPassword: (password) => {
    const minLength = 6;
    return password.length >= minLength;
  },

  // Validate name
  isValidName: (name) => {
    return name.length >= 2 && name.length <= 50;
  },

  // Validate phone number (optional)
  isValidPhone: (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  },
};

// Error messages
export const errorMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidName: 'Name must be between 2 and 50 characters',
  weakPassword: 'Password must be at least 6 characters',
  passwordMismatch: 'Passwords do not match',
};