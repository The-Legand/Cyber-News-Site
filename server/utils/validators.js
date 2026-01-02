function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isStrongPassword(pwd) {
  return typeof pwd === "string" && pwd.length >= 8;
}

function hasMinLength(minLength, string){
  return (string.trim().length >= minLength)
} 

function exceedsMaxLength(maxLength, string){
  return (string.trim().length>maxLength)
}
module.exports = {isNonEmptyString, isEmail, isStrongPassword, hasMinLength,exceedsMaxLength};
