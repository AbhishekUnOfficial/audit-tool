const data = {};
const siteId = document.getElementById("siteId");
const siteName = document.getElementById("siteName");
const notes = document.getElementById("notes");
const outputEl = document.getElementById("output");

function getItemId(category, item) {
  const defectCode = item["Defect Code"] || "";
  const description = item["Severity"]
    ? item["Classification of Defects"]
    : item["Check-point"] || item["Description"] || "";
  return `${category}||${defectCode}||${description}`;
}

let selected = new Set(JSON.parse(localStorage.getItem("selected") || "[]"));
let rectified = new Set(JSON.parse(localStorage.getItem("rectified") || "[]"));
let observation = new Set(
  JSON.parse(localStorage.getItem("observation") || "[]"),
);
let collapsed = new Set(JSON.parse(localStorage.getItem("collapsed") || "[]"));

async function loadData() {
  const files = ['Civil.json', 'Electrical.json', 'Tower.json', 'Earthing.json', 'Fence.json', 'Shelter.json', 'ODBed.json', 'ProjectManagement.json'];
  for (let file of files) {
    try {
      const response = await fetch(file);
      const json = await response.json();
      Object.assign(data, json);
    } catch (e) {
      console.error('Error loading', file, e);
    }
  }
  render(data);
}

function render(dataObj) {
  const container = document.getElementById("list");
  container.innerHTML = "";

  for (let category in dataObj) {
    let categoryDiv = document.createElement("div");
    categoryDiv.className = "category";
    if (collapsed.has(category)) categoryDiv.classList.add("collapsed");

    let header = document.createElement("h3");
    header.innerHTML = (collapsed.has(category) ? "&#9654; " : "&#9660; ") + category;
    header.addEventListener("click", () => {
      categoryDiv.classList.toggle("collapsed");
      if (categoryDiv.classList.contains("collapsed")) {
        collapsed.add(category);
        header.innerHTML = "&#9654; " + category;
      } else {
        collapsed.delete(category);
        header.innerHTML = "&#9660; " + category;
      }
      save();
    });
    categoryDiv.appendChild(header);

    let defectsDiv = document.createElement("div");
    defectsDiv.className = "defects";

    dataObj[category].forEach((item) => {
      let label = document.createElement("label");
      let defectCode = item["Defect Code"];
      let itemId = getItemId(category, item);

      let statusClass = "";
      if (selected.has(itemId)) statusClass = "status-punch";
      else if (rectified.has(itemId)) statusClass = "status-rectified";
      else if (observation.has(itemId)) statusClass = "status-observation";

      label.className = statusClass;

      let displayText;
      if (item["Severity"]) {
        displayText = `(${defectCode}) ${item["Classification of Defects"]} (${item["Severity"]})`;
      } else {
        displayText = `(${defectCode}) ${item["Check-point"]} - ${item["Description"]}`;
      }

      label.innerHTML = `
        <input type="checkbox" class="main" ${selected.has(itemId) ? "checked" : ""}>
        <input type="checkbox" class="rect" ${rectified.has(itemId) ? "checked" : ""}>
        <input type="checkbox" class="obs" ${observation.has(itemId) ? "checked" : ""}>
        ${displayText}
      `;

      let main = label.querySelector(".main");
      let rect = label.querySelector(".rect");
      let obs = label.querySelector(".obs");

      // Punch checkbox
      main.addEventListener("change", () => {
        if (main.checked) {
          selected.add(itemId);

          rectified.delete(itemId);
          observation.delete(itemId);

          rect.checked = false;
          obs.checked = false;
          label.className = "status-punch";
        } else {
          selected.delete(itemId);
          label.className = "";
        }
        save();
      });

      // Rectified checkbox
      rect.addEventListener("change", () => {
        if (rect.checked) {
          rectified.add(itemId);

          selected.delete(itemId);
          observation.delete(itemId);

          main.checked = false;
          obs.checked = false;
          label.className = "status-rectified";
        } else {
          rectified.delete(itemId);
          label.className = "";
        }
        save();
      });

      // Observation checkbox
      obs.addEventListener("change", () => {
        if (obs.checked) {
          observation.add(itemId);

          selected.delete(itemId);
          rectified.delete(itemId);

          main.checked = false;
          rect.checked = false;
          label.className = "status-observation";
        } else {
          observation.delete(itemId);
          label.className = "";
        }
        save();
      });

      defectsDiv.appendChild(label);
    });

    categoryDiv.appendChild(defectsDiv);
    container.appendChild(categoryDiv);
  }
}

function filterList() {
  let q = document.getElementById("search").value.toLowerCase();
  let filtered = {};
  for (let category in data) {
    filtered[category] = data[category].filter((item) => {
      return Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(q));
    });
  }
  render(filtered);
}

function save() {
  localStorage.setItem("selected", JSON.stringify([...selected]));
  localStorage.setItem("rectified", JSON.stringify([...rectified]));
  localStorage.setItem("observation", JSON.stringify([...observation]));
  localStorage.setItem("collapsed", JSON.stringify([...collapsed]));
  localStorage.setItem("siteId", siteId.value);
  localStorage.setItem("siteName", siteName.value);
  localStorage.setItem("notes", notes.value);
}

window.onload = () => {
  siteId.value = localStorage.getItem("siteId") || "";
  siteName.value = localStorage.getItem("siteName") || "";
  notes.value = localStorage.getItem("notes") || "";
  loadData();
};

document.addEventListener("input", save);

function generate() {
  let date = new Date().toLocaleDateString("en-GB");
  let output = "Date :- " + date + "\n";
  output += "Site ID :- " + (siteId.value || "") + "\n";
  output += "Site Name :- " + (siteName.value || "") + "\n";
  output += "Notes :- " + (notes.value || "") + "\n\n";

  let punchList = [];
  let rectifiedList = [];
  let observationList = [];

  for (let category in data) {
    data[category].forEach(item => {
      let defectCode = item["Defect Code"];
      let itemId = getItemId(category, item);
      let desc = item["Severity"] ? item["Classification of Defects"] : item["Check-point"];

      if (selected.has(itemId)) {
        punchList.push(`(${defectCode}) ${desc}`);
      }
      if (rectified.has(itemId)) {
        rectifiedList.push(`(${defectCode}) ${desc}`);
      }
      if (observation.has(itemId)) {
        observationList.push(`(${defectCode}) ${desc}`);
      }
    });
  }

  if (punchList.length > 0) {
    output += "Punch points:-\n";
    punchList.forEach((x, i) => (output += i + 1 + ". " + x + "\n"));
  }

  if (rectifiedList.length > 0) {
    output += "\nRectified Punch points:-\n";
    rectifiedList.forEach((x, i) => (output += i + 1 + ". " + x + "\n"));
  }

  if (observationList.length > 0) {
    output += "\nObservations:-\n";
    observationList.forEach((x, i) => (output += i + 1 + ". " + x + "\n"));
  }

  outputEl.textContent = output;
  outputEl.scrollIntoView({ behavior: "smooth" });
}

function copyText() {
  let text = outputEl.textContent;
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
  collapsed.clear();

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
