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
  let activeEntryType = null; // Track which type of entry is being added

  // --- 1. MODAL TOGGLE ---
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("add-btn") ||
      e.target.id === "addGeneric"
    ) {
      activeSectionBody = e.target
        .closest(".info-card")
        .querySelector(".info-body");
      
      // Determine entry type from header text
      const headerText = e.target.closest(".info-card")
        .querySelector(".info-header span").textContent || "";
      
      if (headerText.includes("🎓") || headerText.includes("DEGREES")) {
        activeEntryType = "education";
      } else if (headerText.includes("💼") || headerText.includes("EXPERIENCES")) {
        activeEntryType = "experience";
      } else if (headerText.includes("🚀") || headerText.includes("PROJECTS")) {
        activeEntryType = "project";
      } else if (headerText.includes("🛠️") || headerText.includes("SKILLS")) {
        activeEntryType = "skill";
      } else if (headerText.includes("🏆") || headerText.includes("AWARDS")) {
        activeEntryType = "award";
      } else {
        activeEntryType = null; // Generic/unknown
      }
      
      document.getElementById("modalTitle").innerText = e.target.innerText;
      modal.style.display = "flex";
    }
  });

  window.closeVaultModal = function () {
    modal.style.display = "none";
    document.getElementById("inTitle").value = "";
    document.getElementById("inSub").value = "";
    document.getElementById("inDetails").value = "";
    activeEntryType = null;
  };

  // --- 2. ADD NEW ENTRY ---
  confirmBtn.addEventListener("click", async function () {
    const title = document.getElementById("inTitle").value.trim();
    const sub = document.getElementById("inSub").value.trim();
    const details = document.getElementById("inDetails").value.trim();

    if (!title) return alert("Please enter a title");

    // If we can't determine the type, use the old DOM-only method as fallback
    if (!activeEntryType) {
      const newEntry = document.createElement("div");
      newEntry.className = "vault-entry";
      const listItems = details.split("\n")
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
      return;
    }

    // Prepare data based on entry type
    let apiData = {};
    let apiEndpoint = "";

    try {
      if (activeEntryType === "education") {
        // Education: title = degree, sub = institution, details = fieldOfStudy (or bullets)
        // Required: institution, degree, fieldOfStudy
        apiEndpoint = "/api/education";
        apiData = {
          institution: sub || title, // Fallback to title if sub is empty
          degree: title,
          fieldOfStudy: details.split("\n")[0] || "General",
          startDate: new Date().toISOString(), // Default to today
          gpa: null
        };
        // Try to parse GPA from details if present
        const gpaMatch = details.match(/GPA[:\s]*([0-9.]+)/i);
        if (gpaMatch) apiData.gpa = parseFloat(gpaMatch[1]);
        
      } else if (activeEntryType === "experience") {
        // Experience: title = job title, sub = company | location, details = bullets
        // Required: title, employmentType
        apiEndpoint = "/api/experience";
        const [company, location] = sub.split(" • ").map(s => s.trim());
        apiData = {
          title: title,
          company: company || sub || "",
          location: location || "",
          employmentType: "full-time", // Default
          startDate: new Date().toISOString(),
          bullets: details ? details.split("\n").filter(l => l.trim()) : []
        };
        
      } else if (activeEntryType === "project") {
        // Project: title = name, sub = date range (optional), details = description/bullets
        // Required: name, startDate
        apiEndpoint = "/api/projects";
        apiData = {
          name: title,
          description: details || sub || "",
          startDate: new Date().toISOString(),
          bullets: details ? details.split("\n").filter(l => l.trim()) : []
        };
        
      } else if (activeEntryType === "skill") {
        // Skill: title = name, sub = category | proficiency, details = years
        // Required: name, category, proficiency
        apiEndpoint = "/api/skills";
        const [category, proficiency] = sub.split(" | ").map(s => s.trim().toLowerCase());
        apiData = {
          name: title,
          category: category || "other",
          proficiency: proficiency || "intermediate",
          yearsOfExperience: details ? parseInt(details) || null : null
        };
        
      } else if (activeEntryType === "award") {
        // Award: title = award title, sub = issuer | date, details = description
        // Required: title, date
        apiEndpoint = "/api/awards";
        const [issuer, dateStr] = sub.split(" | ").map(s => s.trim());
        apiData = {
          title: title,
          issuer: issuer || "",
          date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
          description: details || ""
        };
      }

      // Call API to create entry
      const response = await fetch(`http://localhost:5000${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (result.status === "success") {
        // Success - reload the corresponding section
        const reloadFunctions = {
          "education": () => { if (window.loadEducationEntries) window.loadEducationEntries(); },
          "experience": () => { if (window.loadExperienceEntries) window.loadExperienceEntries(); },
          "project": () => { if (window.loadProjectEntries) window.loadProjectEntries(); },
          "skill": () => { if (window.loadSkillEntries) window.loadSkillEntries(); },
          "award": () => { if (window.loadAwardEntries) window.loadAwardEntries(); }
        };

        const reloadFunc = reloadFunctions[activeEntryType];
        if (reloadFunc) {
          reloadFunc();
        }

        closeVaultModal();
      } else {
        alert(`Error creating entry: ${result.message || "Unknown error"}`);
      }

    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add entry. Please try again.");
    }
  });

  // --- 3. EDIT / DELETE / COPY ---
  document
    .querySelector(".container")
    .addEventListener("click", function (event) {
      const target = event.target;
      const entry = target.closest(".vault-entry");
      if (!entry) return;

      // Only handle clicks on buttons, not on the entry itself
      const button = target.closest("button");
      if (!button) return;

      // Check if the button is an action button (Edit, Delete, Copy)
      const buttonText = button.innerText;

      if (buttonText.includes("🗑️ Delete")) {
        if (!confirm("Are you sure you want to delete this entry?")) return;
        
        const entryId = entry.getAttribute("data-id");
        const entryType = entry.getAttribute("data-type");
        
        if (!entryId || !entryType) {
          console.error("Missing data-id or data-type for deletion");
          entry.remove(); // Fallback: remove from DOM if API data missing
          return;
        }
        
        // Map entry type to API endpoint
        const apiEndpoints = {
          "education": "/api/education",
          "experience": "/api/experience",
          "project": "/api/projects",
          "skill": "/api/skills",
          "award": "/api/awards"
        };
        
        const endpoint = apiEndpoints[entryType];
        if (!endpoint) {
          console.error(`Unknown entry type: ${entryType}`);
          entry.remove();
          return;
        }
        
        // Call DELETE API
        fetch(`http://localhost:5000${endpoint}/${entryId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              // Remove from DOM
              entry.remove();
              
              // Reload the specific section to update count
              const reloadFunctions = {
                "education": () => { if (window.loadEducationEntries) window.loadEducationEntries(); },
                "experience": () => { if (window.loadExperienceEntries) window.loadExperienceEntries(); },
                "project": () => { if (window.loadProjectEntries) window.loadProjectEntries(); },
                "skill": () => { if (window.loadSkillEntries) window.loadSkillEntries(); },
                "award": () => { if (window.loadAwardEntries) window.loadAwardEntries(); }
              };
              
              const reloadFunc = reloadFunctions[entryType];
              if (reloadFunc) reloadFunc();
            } else {
              alert(`Error deleting entry: ${data.message || "Unknown error"}`);
            }
          })
          .catch((error) => {
            console.error("Error deleting entry:", error);
            alert("Failed to delete entry. Please try again.");
          });
        
        return;
      }

      if (buttonText.includes("📋 Copy")) {
        const text = entry.innerText
          .replace(/✏️ Edit|🗑️ Delete|📋 Copy/g, "")
          .trim();
        navigator.clipboard.writeText(text);
        const original = button.innerText;
        button.innerText = "✅";
        setTimeout(() => (button.innerText = original), 1000);
        return;
      }

      if (
        buttonText.includes("✏️ Edit") ||
        buttonText.includes("💾 Save")
      ) {
        const isEditing = entry.contentEditable === "true";
        entry.contentEditable = !isEditing;
        entry.style.backgroundColor = !isEditing ? "#fffdf0" : "white";
        entry.style.outline = !isEditing ? "1px dashed black" : "none";
        button.innerText = !isEditing ? "💾 Save" : "✏️ Edit";
        if (!isEditing) entry.focus();
        return;
      }
    });
});
