function loadSkills() {
  fetch("http://localhost:5000/api/skills")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("skillsList");
      list.innerHTML = "";
      data.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill.name;
        list.appendChild(li);
      });
    });
}

function addSkill() {
  const skill = document.getElementById("skillInput").value;

  fetch("http://localhost:5000/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("skillInput").value = "";
      loadSkills();
    });
}

window.onload = loadSkills;