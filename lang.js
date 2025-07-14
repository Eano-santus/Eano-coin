// lang.js

const langData = {
  en: {
    welcome: "🚀 Welcome to EANO",
    signup_btn: "Sign Up",
    login_btn: "Login",
    first_name: "First Name",
    last_name: "Last Name",
    username: "Username",
    email: "Email",
    password: "Password",
    theme_toggle: "🌗 Toggle Light/Dark",
    already_have: "Already have an account? Login",
    dont_have: "Don't have an account? Sign up",
    google_signin: "🔐 Sign in with Google"
  },
  fr: {
    welcome: "🚀 Bienvenue à EANO",
    signup_btn: "S'inscrire",
    login_btn: "Connexion",
    first_name: "Prénom",
    last_name: "Nom",
    username: "Nom d'utilisateur",
    email: "Adresse e-mail",
    password: "Mot de passe",
    theme_toggle: "🌗 Mode Clair/Sombre",
    already_have: "Vous avez déjà un compte ? Connexion",
    dont_have: "Pas de compte ? S'inscrire",
    google_signin: "🔐 Connexion avec Google"
  },
  sw: {
    welcome: "🚀 Karibu EANO",
    signup_btn: "Jisajili",
    login_btn: "Ingia",
    first_name: "Jina la Kwanza",
    last_name: "Jina la Mwisho",
    username: "Jina la Mtumiaji",
    email: "Barua pepe",
    password: "Nenosiri",
    theme_toggle: "🌗 Badilisha Mwanga/Giza",
    already_have: "Una akaunti tayari? Ingia",
    dont_have: "Hauna akaunti? Jisajili",
    google_signin: "🔐 Ingia na Google"
  },
  ig: {
    welcome: "🚀 Nnọọ na EANO",
    signup_btn: "Debanye aha",
    login_btn: "Banye",
    first_name: "Aha mbu",
    last_name: "Aha ikpeazụ",
    username: "Aha njirimara",
    email: "Email",
    password: "Okwuntughe",
    theme_toggle: "🌗 Gbanwee Ụtụtụ/Night",
    already_have: "Ị nwere akaụntụ? Banye",
    dont_have: "Ị nweghị akaụntụ? Debanye",
    google_signin: "🔐 Banye site na Google"
  },
  ha: {
    welcome: "🚀 Barka da zuwa EANO",
    signup_btn: "Yi rijista",
    login_btn: "Shiga",
    first_name: "Sunan farko",
    last_name: "Sunan ƙarshe",
    username: "Sunan mai amfani",
    email: "Imel",
    password: "Kalmar wucewa",
    theme_toggle: "🌗 Canja Duhu/Hasken rana",
    already_have: "Kana da asusu? Shiga",
    dont_have: "Babu asusu? Yi rijista",
    google_signin: "🔐 Shiga ta Google"
  },
  efik: {
    welcome: "🚀 Abadie EANO",
    signup_btn: "Sign Up",
    login_btn: "Login",
    first_name: "First Name",
    last_name: "Last Name",
    username: "Username",
    email: "Email",
    password: "Password",
    theme_toggle: "🌗 Switch Light/Dark",
    already_have: "You get account? Login",
    dont_have: "You no get? Sign up",
    google_signin: "🔐 Use Google Join"
  },
  pid: {
    welcome: "🚀 Welcome to EANO",
    signup_btn: "Register",
    login_btn: "Login",
    first_name: "Ya First Name",
    last_name: "Ya Surname",
    username: "Your Username",
    email: "Email Address",
    password: "Password",
    theme_toggle: "🌗 Change Light or Dark",
    already_have: "You don get account? Login",
    dont_have: "You never get? Register",
    google_signin: "🔐 Login with Google"
  },
  zh: {
    welcome: "🚀 欢迎使用 EANO",
    signup_btn: "注册",
    login_btn: "登录",
    first_name: "名字",
    last_name: "姓氏",
    username: "用户名",
    email: "电子邮件",
    password: "密码",
    theme_toggle: "🌗 切换亮/暗模式",
    already_have: "已有账号？登录",
    dont_have: "没有账号？注册",
    google_signin: "🔐 使用 Google 登录"
  }
};

function applyTranslations(lang) {
  const strings = langData[lang] || langData["en"];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (strings[key]) el.textContent = strings[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (strings[key]) el.setAttribute("placeholder", strings[key]);
  });
}

function initLanguage() {
  let lang = localStorage.getItem("lang");

  // Auto-detect on first visit
  if (!lang) {
    lang = navigator.language.slice(0, 2).toLowerCase();
    if (!langData[lang]) lang = "en";
    localStorage.setItem("lang", lang);
  }

  applyTranslations(lang);

  // Language selector
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener("change", () => {
      const selectedLang = langSelect.value;
      localStorage.setItem("lang", selectedLang);
      applyTranslations(selectedLang);
    });
  }
}

window.addEventListener("DOMContentLoaded", initLanguage);
