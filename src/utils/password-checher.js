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
    }
  }

  switch (score) {
    case 5:
      return "Very Strong";
    case 4:
      return "Strong";
    case 3:
      return "Moderate";
    case 2:
      return "Weak";
    case 1:
      return "Very Weak";
    default:
      return "Invalid Password";
  }
};
