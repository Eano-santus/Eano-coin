// lang.js

const translations = { en: { welcome: "👋 Welcome to EANO Network", miningTip: "Mine EANO every 24 hours to increase your score and trust level.", announcement: "📢 Announcement", referrals: "Referrals", level: "Mining Level", trust: "Trust Score", lowTrust: "⚠ Low Trust", logout: "Logout", startMining: "⛏ Start Mining", team: "👥 Team", profile: "👤 Profile", settings: "⚙️ Settings", leaderboard: "🏆 Leaderboard" }, fr: { welcome: "👋 Bienvenue sur EANO Network", miningTip: "Minez EANO toutes les 24 heures pour augmenter votre score et niveau de confiance.", announcement: "📢 Annonce", referrals: "Parrainages", level: "Niveau de minage", trust: "Score de confiance", lowTrust: "⚠ Faible confiance", logout: "Se déconnecter", startMining: "⛏ Commencer le minage", team: "👥 Équipe", profile: "👤 Profil", settings: "⚙️ Paramètres", leaderboard: "🏆 Classement" }, sw: { welcome: "👋 Karibu EANO Network", miningTip: "Chimba EANO kila masaa 24 kuongeza alama na uaminifu.", announcement: "📢 Taarifa", referrals: "Marejeleo", level: "Kiwango cha uchimbaji", trust: "Alama ya uaminifu", lowTrust: "⚠ Uaminifu wa chini", logout: "Toka", startMining: "⛏ Anza kuchimba", team: "👥 Timu", profile: "👤 Wasifu", settings: "⚙️ Mipangilio", leaderboard: "🏆 Orodha ya Viongozi" }, ig: { welcome: "👋 Nnọọ na EANO Network", miningTip: "Were EANO kwa awa iri abụọ na anọ iji bulie akara na ntụkwasị obi.", announcement: "📢 Ọkwa", referrals: "Nzipụ", level: "Ọkwa nchịkọta", trust: "Ntụkwasị obi", lowTrust: "⚠ Ntụkwasị obi dị ala", logout: "Pụọ", startMining: "⛏ Bido nchịkọta", team: "👥 Ndị otu", profile: "👤 Profaịlụ", settings: "⚙️ Ntọala", leaderboard: "🏆 Ndi kacha elu" }, ha: {
    welcome: "Barka da zuwa EANO",
    mine: "⛏ Fara hakowa",
    logout: "Fita",
    referrals: "👥 Kiran abokai",
    leaderboard: "🏆 Manyan masu hakowa",
    settings: "⚙️ Saituna",
    profile: "👤 Bayani",
    announcement: "📢 Sanarwa",
    balance: "Balance",
    timer: "Lokaci ya rage",
    level: "Matsayin hakowa",
    trust: "Matsayin amana"
  },
  efik: {
    welcome: "Idem mfo ke EANO",
    mine: "⛏ Fọkoro mining",
    logout: "Wɔfi",
    referrals: "👥 Ufọk iso",
    leaderboard: "🏆 Eyen mmọñ oro",
    settings: "⚙️ Usoro",
    profile: "👤 Isop idem",
    announcement: "📢 Ifọk",
    balance: "Ego",
    timer: "Ubɔk iwak",
    level: "Mining mbuọk",
    trust: "Isop udia"
  },
zh: { welcome: "👋 欢迎来到 EANO 网络", miningTip: "每 24 小时挖矿一次可增加积分和信任等级。", announcement: "📢 公告", referrals: "推荐", level: "挖矿等级", trust: "信任分数", lowTrust: "⚠ 信任度低", logout: "退出登录", startMining: "⛏ 开始挖矿", team: "👥 团队", profile: "👤 个人资料", settings: "⚙️ 设置", leaderboard: "🏆 排行榜" }, pid: { welcome: "👋 How far! Welcome to EANO Network", miningTip: "Make you dey mine EANO every 24 hours make your score and trust level go up.", announcement: "📢 Tori", referrals: "People wey you refer", level: "Mining Level", trust: "Trust Score", lowTrust: "⚠ Your trust no high", logout: "Comot", startMining: "⛏ Start to mine", team: "👥 Your Squad", profile: "👤 Your Info", settings: "⚙️ Settings", leaderboard: "🏆 Top People" } };

function applyLanguage(lang) { const t = translations[lang] || translations.en;

document.querySelector("h3")?.textContent = t.welcome; document.querySelector("#announcement-box h5")?.textContent = t.announcement; document.getElementById("latest-announcement")?.textContent ||= "No updates yet."; document.getElementById("referral-count-label")?.textContent = ${t.referrals}:; document.getElementById("level-label")?.textContent = ${t.level}:; document.getElementById("trust-label")?.textContent = ${t.trust}:; document.getElementById("logout-btn")?.textContent = t.logout; document.getElementById("mine-btn")?.textContent = t.startMining; }

const langSelect = document.getElementById("lang-select"); if (langSelect) { langSelect.addEventListener("change", () => { const selected = langSelect.value; localStorage.setItem("lang", selected); applyLanguage(selected); });

let savedLang = localStorage.getItem("lang"); if (!savedLang) { const userLang = navigator.language.slice(0, 2); savedLang = Object.keys(translations).includes(userLang) ? userLang : "en"; localStorage.setItem("lang", savedLang); }

langSelect.value = savedLang; applyLanguage(savedLang); }

