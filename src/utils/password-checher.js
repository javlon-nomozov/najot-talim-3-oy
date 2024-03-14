module.exports = function checkPasswordStrength(password) {
  const strength = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
  };

  let score = 0;

  for (const key in strength) {
    if (strength[key]) {
      score++;
      if (score > 2) {
        return true;
      }
    }
  }
  return false;
};
