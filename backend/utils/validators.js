export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const sanitizeString = (str) => {
  return typeof str === 'string' ? str.trim() : '';
};
