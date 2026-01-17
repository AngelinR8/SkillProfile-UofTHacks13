function loadSkills() {
  fetch("http://localhost:5000/api/skills")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("skillsList");
      list.innerHTML = "";
      data.forEach((skill) => {
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
    body: JSON.stringify({ skill }),
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById("skillInput").value = "";
      loadSkills();
    });
}

window.onload = loadSkills;

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
