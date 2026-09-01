const lockDiv = document.getElementById("interaction-lock");

const lockInteraction = () => {
  if (lockDiv) lockDiv.style.display = "block";
};

const unlockInteraction = () => {
  if (lockDiv) lockDiv.style.display = "none";
};

export { lockInteraction, unlockInteraction };
