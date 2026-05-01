const data = [];

let selected = new Set(JSON.parse(localStorage.getItem("selected") || "[]"));
let rectified = new Set(JSON.parse(localStorage.getItem("rectified") || "[]"));
let observation = new Set(
  JSON.parse(localStorage.getItem("observation") || "[]"),
);

function render(list) {
  const container = document.getElementById("list");
  container.innerHTML = "";

  list.forEach((item) => {
    let label = document.createElement("label");

    label.innerHTML = `
      <input type="checkbox" class="main" ${selected.has(item) ? "checked" : ""}>
      <input type="checkbox" class="rect" ${rectified.has(item) ? "checked" : ""}>
      <input type="checkbox" class="obs" ${observation.has(item) ? "checked" : ""}>
      ${item}
    `;

    let main = label.querySelector(".main");
    let rect = label.querySelector(".rect");
    let obs = label.querySelector(".obs");

    // Punch checkbox
    main.addEventListener("change", () => {
      if (main.checked) {
        selected.add(item);

        rectified.delete(item);
        observation.delete(item);

        rect.checked = false;
        obs.checked = false;
      } else {
        selected.delete(item);
      }
      save();
    });

    // Rectified checkbox
    rect.addEventListener("change", () => {
      if (rect.checked) {
        rectified.add(item);

        selected.delete(item);
        observation.delete(item);

        main.checked = false;
        obs.checked = false;
      } else {
        rectified.delete(item);
      }
      save();
    });

    // Observation checkbox
    obs.addEventListener("change", () => {
      if (obs.checked) {
        observation.add(item);

        selected.delete(item);
        rectified.delete(item);

        main.checked = false;
        rect.checked = false;
      } else {
        observation.delete(item);
      }
      save();
    });

    container.appendChild(label);
  });
}

function filterList() {
  let q = document.getElementById("search").value.toLowerCase();
  render(data.filter((x) => x.toLowerCase().includes(q)));
}

function save() {
  localStorage.setItem("selected", JSON.stringify([...selected]));
  localStorage.setItem("rectified", JSON.stringify([...rectified]));
  localStorage.setItem("observation", JSON.stringify([...observation]));
  localStorage.setItem("siteId", siteId.value);
  localStorage.setItem("siteName", siteName.value);
}

window.onload = () => {
  siteId.value = localStorage.getItem("siteId") || "";
  siteName.value = localStorage.getItem("siteName") || "";
  render(data);
};

document.addEventListener("input", save);

function generate() {
  let date = new Date().toLocaleDateString("en-GB");
  let output = "Date :- " + date + "\n";
  output += "Site ID :- " + (siteId.value || "") + "\n";
  output += "Site Name :- " + (siteName.value || "") + "\n\n";

  if (selected.size > 0) {
    output += "Punch points (With Defect Code):-\n";
    [...selected].forEach((x, i) => (output += i + 1 + ". " + x + "\n"));
  }

  if (rectified.size > 0) {
    output += "\nRectified Punch points (With Defect Code):-\n";
    [...rectified].forEach((x, i) => (output += i + 1 + ". " + x + "\n"));
  }

  if (observation.size > 0) {
    output += "\nObservations (With Defect Code):-\n";
    [...observation].forEach((x, i) => (output += i + 1 + ". " + x + "\n"));
  }

  document.getElementById("output").textContent = output;
  document.getElementById("output").scrollIntoView({ behavior: "smooth" });
}

function copyText() {
  let text = document.getElementById("output").textContent;
  navigator.clipboard.writeText(text);
  alert("Copied");
}

function clearData() {
  document.getElementById("confirmBox").style.display = "flex";
}

function confirmYes() {
  localStorage.clear();

  selected.clear();
  rectified.clear();
  observation.clear();

  document.getElementById("siteId").value = "";
  document.getElementById("siteName").value = "";
  document.getElementById("search").value = "";
  document.getElementById("output").textContent = "";

  render(data);

  document.getElementById("confirmBox").style.display = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function confirmNo() {
  document.getElementById("confirmBox").style.display = "none";
}
