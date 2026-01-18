// Load skills from API
function loadSkills() {
  fetch("http://localhost:5000/api/skills")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("skillsList");
      if (!list) return; // Exit if element doesn't exist

      list.innerHTML = "";
      data.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill.name;
        list.appendChild(li);
      });
    })
    .catch((error) => console.error("Error loading skills:", error));
}

// Add new skill
function addSkill() {
  const skillName = document.getElementById("skillInput").value;
  if (!skillName) return;

  // New API format requires full skill object
  const skillData = {
    name: skillName,
    category: "other", // Default category
    proficiency: "intermediate", // Default proficiency
  };

  fetch("http://localhost:5000/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill }),
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById("skillInput").value = "";
      loadSkills();
    })
    .catch((error) => console.error("Error adding skill:", error));
}

// Load skills when page loads
window.onload = loadSkills;

// Edit bio logic
document.addEventListener("DOMContentLoaded", function () {
  const paragraph = document.getElementById("bio");
  const edit_button = document.getElementById("edit_bio");
  const end_button = document.getElementById("end_bio_editing");

  edit_button.addEventListener("click", function () {
    paragraph.contentEditable = true;
    paragraph.style.border = "1px dashed #333"; // Optional: visual cue
    paragraph.focus();
  });

  end_button.addEventListener("click", function () {
    paragraph.contentEditable = false;
    paragraph.style.border = "none"; // Remove visual cue
  });
});

// Identity Vault button logic
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("vaultModal");
  const confirmBtn = document.getElementById("confirmAdd");
  let activeSectionBody = null;

  // --- 1. MODAL TOGGLE ---
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("add-btn") ||
      e.target.id === "addGeneric"
    ) {
      activeSectionBody = e.target
        .closest(".info-card")
        .querySelector(".info-body");
      document.getElementById("modalTitle").innerText = e.target.innerText;
      modal.style.display = "flex";
    }
  });

  window.closeVaultModal = function () {
    modal.style.display = "none";
    document.getElementById("inTitle").value = "";
    document.getElementById("inSub").value = "";
    document.getElementById("inDetails").value = "";
  };

  // --- 2. ADD NEW ENTRY ---
  confirmBtn.addEventListener("click", function () {
    const title = document.getElementById("inTitle").value;
    const sub = document.getElementById("inSub").value;
    const details = document.getElementById("inDetails").value.split("\n");

    if (!title) return alert("Please enter a title");

    const newEntry = document.createElement("div");
    newEntry.className = "vault-entry";

    let listItems = details
      .map((item) => (item.trim() ? `<li>${item}</li>` : ""))
      .join("");

    newEntry.innerHTML = `
      <p style="font-weight: bold; font-size: 1.1em">${title}</p>
      <p>${sub}</p>
      <ul>${listItems}</ul>
      <div class="action-row">
        <button class="btn-outline">✏️ Edit</button>
        <button class="btn-outline">🗑️ Delete</button>
        <button class="btn-outline">📋 Copy</button>
      </div>
    `;

    const placeholder = activeSectionBody.querySelector(".empty-placeholder");
    if (placeholder) placeholder.remove();

    activeSectionBody.appendChild(newEntry);
    closeVaultModal();
  });

  // --- 3. EDIT / DELETE / COPY ---
  document
    .querySelector(".container")
    .addEventListener("click", function (event) {
      const target = event.target;
      const entry = target.closest(".vault-entry");
      if (!entry) return;

      if (target.innerText.includes("🗑️ Delete")) {
        if (confirm("Are you sure?")) entry.remove();
      }

      if (target.innerText.includes("📋 Copy")) {
        const text = entry.innerText
          .replace(/✏️ Edit|🗑️ Delete|📋 Copy/g, "")
          .trim();
        navigator.clipboard.writeText(text);
        const original = target.innerText;
        target.innerText = "✅";
        setTimeout(() => (target.innerText = original), 1000);
      }

      if (
        target.innerText.includes("✏️ Edit") ||
        target.innerText.includes("💾 Save")
      ) {
        const isEditing = entry.contentEditable === "true";
        entry.contentEditable = !isEditing;
        entry.style.backgroundColor = !isEditing ? "#fffdf0" : "white";
        entry.style.outline = !isEditing ? "1px dashed black" : "none";
        target.innerText = !isEditing ? "💾 Save" : "✏️ Edit";
        if (!isEditing) entry.focus();
      }
    });
});
