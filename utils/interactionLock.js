const lockInteraction = () => {
  const lockDiv = document.getElementById("interaction-lock");
  if (lockDiv) {
    lockDiv.style.display = "block";
  }
};

const unlockInteraction = () => {
  const lockDiv = document.getElementById("interaction-lock");
  if (lockDiv) {
    lockDiv.style.display = "none";
  }
};

export { lockInteraction, unlockInteraction };
