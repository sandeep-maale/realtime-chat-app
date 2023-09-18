export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
}

export const isStrongPassword = (password: string): boolean => {
    // Check for minimum length (e.g., 8 characters)
    if (password.length < 8) {
      return false;
    }
  
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }
  
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }
  
    // Check for at least one digit
    if (!/\d/.test(password)) {
      return false;
    }
  
    // Check for at least one special character (e.g., !@#$%^&*)
    if (!/[!@#$%^&*]/.test(password)) {
      return false;
    }
  
    // All checks passed, so the password is considered strong
    return true;
  }

  export const isValidName = (name: string): boolean => {
    // Check if the name is not empty
    if (name.trim() === "") {
      return false;
    }
  
    // Check if the name contains only valid characters
    const validNameRegex = /^[A-Za-z\s\-']+$/;
    return validNameRegex.test(name);
  }