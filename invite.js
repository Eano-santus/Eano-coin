// invite.js

import { auth } from "./firebase.js";

// Get your frontend domain or Netlify domain
const BASE_URL = "https://eano-miner.netlify.app/signup.html"; // change if needed

// Get DOM elements
const inviteInput = document.getElementById("invite-link");
const copyButton = document.getElementById("copy-invite");

// Generate and display referral link
auth.onAuthStateChanged((user) => {
  if (user) {
    const referralLink = `${BASE_URL}?ref=${user.uid}`;
    if (inviteInput) inviteInput.value = referralLink;
    copyButton?.addEventListener("click", () => {
      navigator.clipboard.writeText(referralLink).then(() => {
        alert("Referral link copied!");
      }).catch((err) => {
        console.error("Copy failed: ", err);
        alert("Failed to copy referral link.");
      });
    });
  } else {
    if (inviteInput) inviteInput.value = "Login to get your referral link";
    copyButton?.disabled = true;
  }
});
