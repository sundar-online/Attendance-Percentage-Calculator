const attendedInput = document.getElementById("attended");
const totalInput = document.getElementById("total");
const additionalInput = document.getElementById("additional");
const requiredInput = document.getElementById("required");
const percentageDisplay = document.getElementById("percentage");
const statusBadge = document.getElementById("status-badge");
const guidanceText = document.getElementById("guidance");
const futureBox = document.getElementById("future-box");
const futureDetails = document.getElementById("future-details");
const futurePercentage = document.getElementById("future-percentage");
const futureStatus = document.getElementById("future-status");
const futureGuidance = document.getElementById("future-guidance");

function clearZero(e) {
  if (e.target.value === "0") {
    e.target.value = "";
  }
}

function calculate() {
  const attended = parseFloat(attendedInput.value) || 0;
  const total = parseFloat(totalInput.value) || 0;
  const additional = parseFloat(additionalInput.value) || 0;
  const required = parseFloat(requiredInput.value) || 80;

  if (total === 0 || attended > total) {
    percentageDisplay.textContent = "0.00%";
    statusBadge.textContent = "INVALID";
    statusBadge.className = "status-badge status-not-safe";
    guidanceText.textContent =
      attended > total ? "Attended cannot exceed Total" : "Enter Total Classes";
    futureBox.style.display = "none";
    return;
  }

  // Current percentage calculation
  const currentPercentage = (attended / total) * 100;
  percentageDisplay.textContent = currentPercentage.toFixed(2) + "%";

  // Check if SAFE or NOT SAFE
  const isSafe = currentPercentage >= required;

  if (isSafe) {
    statusBadge.textContent = "SAFE";
    statusBadge.className = "status-badge status-safe";

    // Calculate how many classes can be missed
    let canMiss = 0;
    for (let miss = 1; miss <= 1000; miss++) {
      const testTotal = total + miss;
      const testPercentage = (attended / testTotal) * 100;
      if (testPercentage >= required) {
        canMiss = miss;
      } else {
        break;
      }
    }

    guidanceText.textContent = `✓ You can miss up to ${canMiss} class${
      canMiss !== 1 ? "es" : ""
    } and still stay above ${required.toFixed(1)}%`;
  } else {
    statusBadge.textContent = "NOT SAFE";
    statusBadge.className = "status-badge status-not-safe";

    // Calculate how many consecutive classes needed to reach required %
    let classesNeeded = 0;
    let testAttended = attended;
    let testTotal = total;

    for (let i = 1; i <= 1000; i++) {
      testAttended++;
      testTotal++;
      const testPercentage = (testAttended / testTotal) * 100;
      if (testPercentage >= required) {
        classesNeeded = i;
        break;
      }
    }

    if (classesNeeded > 0) {
      guidanceText.textContent = `✗ You must attend ${classesNeeded} consecutive class${
        classesNeeded !== 1 ? "es" : ""
      } to reach ${required.toFixed(1)}%`;
    } else {
      guidanceText.textContent = `✗ Cannot reach ${required.toFixed(
        1
      )}% with current attendance`;
    }
  }

  // Handle "Add Classes" logic
  if (additional > 0) {
    futureBox.style.display = "block";

    const newTotal = total + additional;

    // Calculate how many of the additional classes must be attended to stay safe
    let mustAttend = 0;
    let canSkip = 0;

    for (let attend = 0; attend <= additional; attend++) {
      const newAttended = attended + attend;
      const newPercentage = (newAttended / newTotal) * 100;

      if (newPercentage >= required) {
        mustAttend = attend;
        canSkip = additional - attend;
        break;
      }
    }

    // If attending all additional classes
    const maxAttended = attended + additional;
    const maxPercentage = (maxAttended / newTotal) * 100;

    // Calculate how many can be skipped from the additional classes
    let maxCanSkip = 0;
    for (let skip = 0; skip <= additional; skip++) {
      const testAttended = attended + (additional - skip);
      const testPercentage = (testAttended / newTotal) * 100;

      if (testPercentage >= required) {
        maxCanSkip = skip;
      } else {
        break;
      }
    }

    futureDetails.textContent = `If you attend all: ${maxAttended} / Total: ${newTotal}`;
    futurePercentage.textContent = maxPercentage.toFixed(2) + "%";

    const isNewSafe = maxPercentage >= required;

    if (isNewSafe) {
      futureStatus.textContent = "SAFE";
      futureStatus.className = "status-badge status-safe";

      if (maxCanSkip > 0) {
        const minAttend = additional - maxCanSkip;
        futureGuidance.textContent = `✓ Out of ${additional} classes: You can skip ${maxCanSkip} and must attend ${minAttend} to stay above ${required.toFixed(
          1
        )}%`;
      } else {
        futureGuidance.textContent = `✓ You must attend all ${additional} classes to maintain ${required.toFixed(
          1
        )}%`;
      }
    } else {
      futureStatus.textContent = "NOT SAFE";
      futureStatus.className = "status-badge status-not-safe";

      // Calculate minimum classes needed from additional to become safe
      let minNeeded = additional + 1;
      for (let attend = 0; attend <= additional; attend++) {
        const testAttended = attended + attend;
        const testPercentage = (testAttended / newTotal) * 100;

        if (testPercentage >= required) {
          minNeeded = attend;
          break;
        }
      }

      if (minNeeded <= additional) {
        futureGuidance.textContent = `⚠ You must attend at least ${minNeeded} out of ${additional} classes to reach ${required.toFixed(
          1
        )}%`;
      } else {
        futureGuidance.textContent = `✗ Even attending all ${additional} classes won't reach ${required.toFixed(
          1
        )}% - Need more classes`;
      }
    }
  } else {
    futureBox.style.display = "none";
  }
}

attendedInput.addEventListener("focus", clearZero);
totalInput.addEventListener("focus", clearZero);
additionalInput.addEventListener("focus", clearZero);
requiredInput.addEventListener("focus", clearZero);

attendedInput.addEventListener("input", calculate);
totalInput.addEventListener("input", calculate);
additionalInput.addEventListener("input", calculate);
requiredInput.addEventListener("input", calculate);

calculate();
