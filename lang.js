// lang.js

const translations = {
  en: {
    welcome: "Welcome to EANO Network",
    balanceLabel: "Your EANO Balance",
    mine: "Start Mining",
    nextMining: "Next mining in:",
    ready: "⛏ Ready to mine again!",
    logout: "Logout"
  },
  fr: {
    welcome: "Bienvenue sur EANO Network",
    balanceLabel: "Votre solde EANO",
    mine: "Commencer le minage",
    nextMining: "Prochaine extraction dans :",
    ready: "⛏ Prêt à miner à nouveau !",
    logout: "Se déconnecter"
  },
  sw: {
    welcome: "Karibu kwenye Mtandao wa EANO",
    balanceLabel: "Salio lako la EANO",
    mine: "Anza kuchimba",
    nextMining: "Muda wa kuchimba tena:",
    ready: "⛏ Tayari kuchimba tena!",
    logout: "Toka"
  },
  ig: {
    welcome: "Nnọọ na EANO Network",
    balanceLabel: "Ego EANO gị",
    mine: "Malite maining",
    nextMining: "Ọnwa ọzọ maining:",
    ready: "⛏ Kwadebe ime maining ọzọ!",
    logout: "Pụọ"
  },
  ha: {
    welcome: "Barka da zuwa EANO Network",
    balanceLabel: "Balance ɗin EANO ɗinka",
    mine: "Fara hakowa",
    nextMining: "Lokacin hakowa na gaba:",
    ready: "⛏ Shirye don hakowa!",
    logout: "Fita"
  }
};

function applyTranslations(lang) {
  const t = translations[lang] || translations.en;

  document.querySelector("#welcome-text")?.textContent = t.welcome;
  document.querySelector("#balance-label")?.textContent = t.balanceLabel;
  document.querySelector("#mine-btn")?.textContent = t.mine;
  document.querySelector("#logout-btn")?.textContent = t.logout;

  // If timer is running, it updates dynamically elsewhere
}

// Auto-detect browser language on load
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");

  let userLang = navigator.language.slice(0, 2);
  if (!translations[userLang]) userLang = "en";

  langSelect.value = userLang;
  applyTranslations(userLang);

  langSelect.addEventListener("change", () => {
    const selectedLang = langSelect.value;
    applyTranslations(selectedLang);
  });
});
