// Load skills from API
function loadSkills() {
  fetch("http://localhost:5001/api/skills")
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

  fetch("http://localhost:5001/api/skills", {
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
    document.getElementById("inStartDate").value = "";
    document.getElementById("inEndDate").value = "";
    document.getElementById("inDetails").value = "";
    activeEntryType = null;
  };

  // --- 2. ADD NEW ENTRY ---
  confirmBtn.addEventListener("click", async function () {
    const title = document.getElementById("inTitle").value.trim();
    const sub = document.getElementById("inSub").value.trim();
    const startDateInput = document.getElementById("inStartDate").value;
    const endDateInput = document.getElementById("inEndDate").value;
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
        // Education: title = degree, sub = institution, details = fieldOfStudy (first line) + description (remaining lines)
        // Required: institution, degree, fieldOfStudy
        apiEndpoint = "/api/education";
        const detailsLines = details.split("\n").filter(line => line.trim());
        const fieldOfStudy = detailsLines[0] || null;
        const description = detailsLines.length > 1 ? detailsLines.slice(1).join("\n") : null;
        
        apiData = {
          institution: sub || "Unknown Institution", // Fallback if sub is empty
          degree: title,
          fieldOfStudy: fieldOfStudy || "General",
          startDate: startDateInput ? new Date(startDateInput).toISOString() : new Date().toISOString(),
          endDate: endDateInput ? new Date(endDateInput).toISOString() : null,
          gpa: null
        };
        
        // Add description if provided (from remaining lines in details)
        if (description) {
          apiData.description = description;
        }
        
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
          startDate: startDateInput ? new Date(startDateInput).toISOString() : new Date().toISOString(),
          endDate: endDateInput ? new Date(endDateInput).toISOString() : null,
          bullets: details ? details.split("\n").filter(l => l.trim()) : []
        };
        
      } else if (activeEntryType === "project") {
        // Project: title = name, sub = date range (optional), details = description/bullets
        // Required: name, startDate
        apiEndpoint = "/api/projects";
        apiData = {
          name: title,
          description: details || sub || "",
          startDate: startDateInput ? new Date(startDateInput).toISOString() : new Date().toISOString(),
          endDate: endDateInput ? new Date(endDateInput).toISOString() : null,
          bullets: details ? details.split("\n").filter(l => l.trim()) : []
        };
        
      } else if (activeEntryType === "skill") {
        // Skill: title = name, sub = category | proficiency, details = years
        // Required: name, category, proficiency
        apiEndpoint = "/api/skills";
        const validCategories = ["programming", "framework", "tool", "language", "soft-skill", "other"];
        const validProficiencies = ["beginner", "intermediate", "advanced", "expert"];
        
        const [category, proficiency] = sub.split(" | ").map(s => s.trim().toLowerCase());
        // Validate category - must be in enum list
        const validCategory = validCategories.includes(category) ? category : "other";
        // Validate proficiency - must be in enum list
        const validProficiency = validProficiencies.includes(proficiency) ? proficiency : "intermediate";
        
        apiData = {
          name: title,
          category: validCategory,
          proficiency: validProficiency,
          yearsOfExperience: details ? parseInt(details) || null : null
        };
        
      } else if (activeEntryType === "award") {
        // Award: title = award title, sub = issuer | date, details = description
        // Required: title, date
        apiEndpoint = "/api/awards";
        const [issuer, dateStr] = sub.split(" | ").map(s => s.trim());
        // For awards, use startDateInput as the date, or parse from sub field
        const awardDate = startDateInput ? new Date(startDateInput) : (dateStr ? new Date(dateStr) : new Date());
        apiData = {
          title: title,
          issuer: issuer || "",
          date: awardDate.toISOString(),
          description: details || ""
        };
      }

      // Call API to create entry
      const response = await fetch(`http://localhost:5001${apiEndpoint}`, {
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
        fetch(`http://localhost:5001${endpoint}/${entryId}`, {
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
        const entryId = entry.getAttribute("data-id");
        const entryType = entry.getAttribute("data-type");
        
        // If clicking Save (currently editing), save to API
        if (isEditing) {
          if (!entryId || !entryType) {
            alert("Cannot save: missing entry ID or type");
            entry.contentEditable = false;
            entry.style.backgroundColor = "white";
            entry.style.outline = "none";
            button.innerText = "✏️ Edit";
            return;
          }
          
          // Parse DOM content and extract structured data
          const paragraphs = Array.from(entry.querySelectorAll("p"));
          const lists = Array.from(entry.querySelectorAll("ul"));
          
          // Remove action buttons from text extraction
          const actionRow = entry.querySelector(".action-row");
          if (actionRow) actionRow.remove();
          
          // Extract text content from paragraphs (first p is usually title)
          const titleText = paragraphs[0] ? paragraphs[0].innerText.trim() : "";
          const subText = paragraphs[1] ? paragraphs[1].innerText.trim() : "";
          
          // Extract bullets from lists
          const bullets = [];
          lists.forEach(list => {
            const listItems = Array.from(list.querySelectorAll("li"));
            listItems.forEach(li => {
              bullets.push(li.innerText.trim());
            });
          });
          
          // Build update payload based on entry type
          const apiEndpoints = {
            "education": "/api/education",
            "experience": "/api/experience",
            "project": "/api/projects",
            "skill": "/api/skills",
            "award": "/api/awards"
          };
          
          const endpoint = apiEndpoints[entryType];
          if (!endpoint) {
            alert(`Unknown entry type: ${entryType}`);
            return;
          }
          
          let updateData = {};
          
          if (entryType === "education") {
            // Parse: "Degree in Field" -> degree, fieldOfStudy
            // Institution from second line
            const degreeMatch = titleText.match(/^(.+?)(?:\s+in\s+(.+))?$/);
            updateData = {
              degree: degreeMatch ? (degreeMatch[2] ? degreeMatch[1].trim() : degreeMatch[1].trim()) : titleText,
              fieldOfStudy: degreeMatch && degreeMatch[2] ? degreeMatch[2].trim() : "General",
              institution: subText || ""
            };
            // Try to parse GPA from details
            const gpaMatch = paragraphs.find(p => p.innerText.includes("GPA"));
            if (gpaMatch) {
              const gpaValue = gpaMatch.innerText.match(/GPA[:\s]*([0-9.]+)/i);
              if (gpaValue) updateData.gpa = parseFloat(gpaValue[1]);
            }
          } else if (entryType === "experience") {
            updateData = {
              title: titleText || ""
            };
            if (subText) {
              const parts = subText.split(" • ");
              updateData.company = parts[0] || "";
              updateData.location = parts[1] || "";
            }
            if (bullets.length > 0) updateData.bullets = bullets;
          } else if (entryType === "project") {
            updateData = {
              name: titleText || "",
              description: subText || ""
            };
            if (bullets.length > 0) updateData.bullets = bullets;
          } else if (entryType === "skill") {
            updateData = {
              name: titleText || ""
            };
            if (subText) {
              const parts = subText.split(" | ");
              updateData.category = parts[0] ? parts[0].toLowerCase() : "other";
              updateData.proficiency = parts[1] ? parts[1].toLowerCase() : "intermediate";
            }
          } else if (entryType === "award") {
            updateData = {
              title: titleText || ""
            };
            if (subText) {
              const parts = subText.split(" | ");
              updateData.issuer = parts[0] || "";
            }
            // Extract description from remaining paragraphs
            if (paragraphs.length > 2) {
              const descText = paragraphs.slice(2).map(p => p.innerText.trim()).join("\n");
              if (descText) updateData.description = descText;
            }
          }
          
          // Call PUT API
          fetch(`http://localhost:5001${endpoint}/${entryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData)
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "success") {
                // Reload the section to show updated content
                const reloadFunctions = {
                  "education": () => { if (window.loadEducationEntries) window.loadEducationEntries(); },
                  "experience": () => { if (window.loadExperienceEntries) window.loadExperienceEntries(); },
                  "project": () => { if (window.loadProjectEntries) window.loadProjectEntries(); },
                  "skill": () => { if (window.loadSkillEntries) window.loadSkillEntries(); },
                  "award": () => { if (window.loadAwardEntries) window.loadAwardEntries(); }
                };
                
                const reloadFunc = reloadFunctions[entryType];
                if (reloadFunc) {
                  reloadFunc();
                }
              } else {
                alert(`Error updating entry: ${data.message || "Unknown error"}`);
                // Restore editing state if error
                entry.contentEditable = true;
                entry.style.backgroundColor = "#fffdf0";
                entry.style.outline = "1px dashed black";
                button.innerText = "💾 Save";
                if (actionRow) entry.appendChild(actionRow);
              }
            })
            .catch((error) => {
              console.error("Error updating entry:", error);
              alert("Failed to update entry. Please try again.");
              // Restore editing state if error
              entry.contentEditable = true;
              entry.style.backgroundColor = "#fffdf0";
              entry.style.outline = "1px dashed black";
              button.innerText = "💾 Save";
              if (actionRow) entry.appendChild(actionRow);
            });
          
          return; // Exit early, reload will handle UI reset
        }
        
        // Toggle editing state (entering edit mode)
        entry.contentEditable = !isEditing;
        entry.style.backgroundColor = !isEditing ? "#fffdf0" : "white";
        entry.style.outline = !isEditing ? "1px dashed black" : "none";
        button.innerText = !isEditing ? "💾 Save" : "✏️ Edit";
        if (!isEditing) entry.focus();
        return;
      }
    });
});
