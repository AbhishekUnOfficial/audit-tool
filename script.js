const data = {};

let selected = new Set(JSON.parse(localStorage.getItem("selected") || "[]"));
let rectified = new Set(JSON.parse(localStorage.getItem("rectified") || "[]"));
let observation = new Set(
  JSON.parse(localStorage.getItem("observation") || "[]"),
);
let collapsed = new Set(JSON.parse(localStorage.getItem("collapsed") || "[]"));

async function loadData() {
  const files = ['Civil.json', 'Electrical.json', 'Tower.json', 'Earthing.json', 'Fence.json', 'Shelter.json', 'ODBed.json', 'ProjectManagement.json', 'Addendum.json'];
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

      let statusClass = "";
      if (selected.has(defectCode)) statusClass = "status-punch";
      else if (rectified.has(defectCode)) statusClass = "status-rectified";
      else if (observation.has(defectCode)) statusClass = "status-observation";

      label.className = statusClass;

      let displayText;
      if (item["Severity"]) {
        displayText = `<strong>${defectCode}:</strong> ${item["Classification of Defects"]} (${item["Severity"]})`;
      } else {
        displayText = `<strong>${defectCode}:</strong> ${item["Check-point"]} - ${item["Description"]}`;
      }

      label.innerHTML = `
        <input type="checkbox" class="main" ${selected.has(defectCode) ? "checked" : ""}>
        <input type="checkbox" class="rect" ${rectified.has(defectCode) ? "checked" : ""}>
        <input type="checkbox" class="obs" ${observation.has(defectCode) ? "checked" : ""}>
        ${displayText}
      `;

      let main = label.querySelector(".main");
      let rect = label.querySelector(".rect");
      let obs = label.querySelector(".obs");

      // Punch checkbox
      main.addEventListener("change", () => {
        if (main.checked) {
          selected.add(defectCode);

          rectified.delete(defectCode);
          observation.delete(defectCode);

          rect.checked = false;
          obs.checked = false;
          label.className = "status-punch";
        } else {
          selected.delete(defectCode);
          label.className = "";
        }
        save();
      });

      // Rectified checkbox
      rect.addEventListener("change", () => {
        if (rect.checked) {
          rectified.add(defectCode);

          selected.delete(defectCode);
          observation.delete(defectCode);

          main.checked = false;
          obs.checked = false;
          label.className = "status-rectified";
        } else {
          rectified.delete(defectCode);
          label.className = "";
        }
        save();
      });

      // Observation checkbox
      obs.addEventListener("change", () => {
        if (obs.checked) {
          observation.add(defectCode);

          selected.delete(defectCode);
          rectified.delete(defectCode);

          main.checked = false;
          rect.checked = false;
          label.className = "status-observation";
        } else {
          observation.delete(defectCode);
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
}

window.onload = () => {
  siteId.value = localStorage.getItem("siteId") || "";
  siteName.value = localStorage.getItem("siteName") || "";
  loadData();
};

document.addEventListener("input", save);

function generate() {
  let date = new Date().toLocaleDateString("en-GB");
  let output = "Date :- " + date + "\n";
  output += "Site ID :- " + (siteId.value || "") + "\n";
  output += "Site Name :- " + (siteName.value || "") + "\n\n";

  let punchList = [];
  let rectifiedList = [];
  let observationList = [];

  for (let category in data) {
    data[category].forEach(item => {
      let defectCode = item["Defect Code"];
      let desc = item["Severity"] ? item["Classification of Defects"] : item["Check-point"];

      if (selected.has(defectCode)) {
        punchList.push(`(${defectCode}) ${desc}`);
      }
      if (rectified.has(defectCode)) {
        rectifiedList.push(`(${defectCode}) ${desc}`);
      }
      if (observation.has(defectCode)) {
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
