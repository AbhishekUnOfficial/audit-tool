const data = [
  "(ELEC-01) Equipment Status- 1) Faulty Equipment, 2) Faulty component, 3) Damaged 4) Dent 5) Cell leakage (OEM for 1,2 and TSP for 3,4,5,)",
  "(ELEC-02) Equipment position not placed as per approved layout.",
  "(ELEC-03) Cable: 1) Make, 2) Size, 3) Grade, 4) St. Compliance",
  "(ELEC-04) Cable termination : 1) Terminals without lugs, 2) Terminals lug crimping, 3) Terminals without Heat shrink sleeves, 4) Terminals tightness",
  "(ELEC-05) Cable Routings :1)Underground trench depth 600mm, 2) Cable routing protections-HDPE pipe/flexible pipe",
  "(ELEC-06) Equipment earthing as per earthing scheme: 1) All Equipment bodies earthing, 2) Cable sizes as per specification, 3) All terminations tightened, 4) Terminal crimped",
  "(ELEC-07) Earthing strips sizes :1)EGB/IGB with 25x6mm GI, 3)Tower/Pole with 25x6mm GI, 4) LA with 25x3mm GI, 5) All other metallic body with 25x3mm GI strip, 6) Shelter/Cage/Shed/fence/EB panel with 25x3mm GI strip",
  "(ELEC-08) Combined Earthing value <2 Ohms",
  "(ELEC-09) Earthing scheme of site as per GL",
  "(ELEC-10) EGB / IGB interconnection not done in indoor sites",
  "(ELEC-11) Non PDI equipment installed at site",
  "(ELEC-12) EGB / IGB interconnection not done in indoor sites",
  "(ELEC-13) Non PDI equipment installed at site",
  "(ELEC-14) False / wrong commission report.",
  "(ELEC-15) OEM Comm report not available: 1) BB, 2) SMPS, 3) SPS, 4) DG, 5) AC",
  "(ELEC-16) MCB: 1) Make,2) Ratings, 3) St. Compliance",
  "(ELEC-17) MCCB: 1) Make,2) Ratings, 3) St. Compliance, 4)Spreader link for MCCB",
  "(ELEC-18) DCDB: 1) Configuration, 2) St. Compliance",
  "(ELEC-19) ACDB: 1) Configuration, 2) St. Compliance",
  "(ELEC-20) Equipment functionality- 1) No Output, 2) Display not working, 3) Indications not working (OEM)",
  "(ELEC-21) Equipment safety features- 1) DG safety, 2) F&S safety, 3) HRT safety (OEM)",
  "(ELEC-22) Equipment Automation and alarm (OEM)",
  "(ELEC-23) BB : 1) Cell voltage variation -0.05V, 2) Cell terminal torque, 3) TC cable not available, 4) Interconnecting strip (OEM for 1,2, 4 & TSP for 3,)",
  "(ELEC-24) Parameter settings in SMPS, SPS etc (OEM)",
  "(ELEC-25) Class B/Class B+C SPD installation",
  "(ELEC-26) All OD cabinet cooling system functional (OEM)",
  "(ELEC-27) Aviation lamp functionality as applicable",
  "(ELEC-29) Power socket installed as per location and IP rating",
  "(ELEC-29) All OD distribution boards including Meter Box IP rating",
  "(ELEC-30) Meter box installation: 1) Grouting of Meter Box stand, 2) No mounting over fence/cage/Tower legs/Tower foundation",
  "(ELEC-31) Cable tray installation: 1)as par layout/ slop not towards BTS / Cable tray defect free / rusting or any galvanization issue",
  "(ELEC-32) Equipment mounting poles grouting: 1) SP/SPS poles, 2) SM Pole",
  "(ELEC-33) Galvanizing of : GI strips / IGB / EGB < 85 microns",
  "(ELEC-34) Interconnections of tower legs using 25x6mm GI strip",
  "(ELEC-35) DG Earthing: 1) GRID around DG using 25x3mm GI strip, 2) DG canopy earthing at DG GRID, 3) DG Grid with Site earth GRID using 25x6mm GI strip, 4) DG neutral as per GL",
  "(ELEC-36) Separation of active and passive earthing strips not done",
  "(ELEC-37) Earthing not isolated from building metallic structures",
  "(ELEC-38) Anti-static earthing of shelter not complied",
  "(ELEC-39) Cable tray earthing not done",
  "(ELEC-40) Earth strip joints: 1) Welding not proper, 2) Nut-bolts not used, 3) Overlapping not as per specification, 4) Loose nut-bolts",
  "(ELEC-41) GI strip routings:1) Underground trench of 600mm, 2) Surface routing using SS saddle",
  "(ELEC-42) LA GI strip routing using insulator (RTT,GBT,GBM)",
  "(ELEC-43) Equipment mounting poles grounding: 1) SP/SPS poles, 2) SM Pole, 3) LT EB poles, 4) Earthing using 25x3mm GI strip",
  "(F46) Back-filling not done as per guideline",
  "(F38) Incorrect JMS Difference between Partner offered JMS sheet and Quality approved quantities or items.",
  "(T34) Ladder fitment not as per drawing and any damage / twisting / bending / location as per layout",
  "(T35) Cable tray fitment not as per drawing and any damage / twisting / bending (TP/EP)",
  "(PM 28) Site not ready for audit",
  "(Str-03) Hilti fastener: Nos & Size not as per drawing or not used",
  "(Str-06) Covered the fastener by grouting",
  "(Str-07) Painting / galvanizing as per recommendation / Rust if any / crack / damage if any for",
  "(Str-09) Non-compliance to guideline / drawing",
  "(Fenc-05) Painting: Single coat primer and double coat paint not done",
  "(Fenc-06) Back filling",
  "(Fenc-08) Rusting if any (angle, gate , fencing post, shed etc.)",
  "(Fenc-09) Fence foundation not as per drawing",
  "(Fenc-11) Foundation not as per drawing",
  "(Fenc-12) Gate column & foundation not as per drawing",
  "(Fenc-14) Fence / angles grouting not as per drawing",
  "(G-1) Documents regularly offered by TSP for audit : SBC / SSC / Drawing / Tower / template drawing / filled check sheet / TVCL / Equipment commissioning reports  / PTW",
];

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
  localStorage.clear();

  selected.clear();
  rectified.clear();
  observation.clear();

  document.getElementById("siteId").value = "";
  document.getElementById("siteName").value = "";
  document.getElementById("search").value = "";
  document.getElementById("output").textContent = "";

  render(data);

  window.scrollTo({ top: 0, behavior: "smooth" });
}