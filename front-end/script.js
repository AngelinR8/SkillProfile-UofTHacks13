// Load skills from API
function loadSkills() {
  fetch("http://localhost:5000/api/skills")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("skillsList");
      if (!list) return; // Exit if element doesn't exist
      
      list.innerHTML = "";
      // API returns { skills: [...] }, not array directly
      const skills = data.skills || [];
      skills.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill.name;
        list.appendChild(li);
      });
    })
    .catch(error => console.error("Error loading skills:", error));
}

// Add new skill
function addSkill() {
  const skillName = document.getElementById("skillInput").value;
  if (!skillName) return;

  // New API format requires full skill object
  const skillData = {
    name: skillName,
    category: "other", // Default category
    proficiency: "intermediate" // Default proficiency
  };

  fetch("http://localhost:5000/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(skillData)
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("skillInput").value = "";
      loadSkills();
    })
    .catch(error => console.error("Error adding skill:", error));
}

// Load skills when page loads
window.onload = loadSkills;