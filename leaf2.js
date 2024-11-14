let map = L.map("map").setView([1.3521, 103.8198], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// point not in use 
// const MrtIcon2 = L.icon({
//   iconUrl: "img/MRT.png",
//   iconSize: [20, 20],
//   iconAnchor: [10, 20],
//   popupAnchor: [0, -20],
// });
// const textarea = document.getElementById('pathfindingresult');
  
const iconMapping = {
  "Exit A": "img/A.png",
  "Exit B": "img/B.png",
  "Exit C": "img/C.png",
  "Exit D": "img/D.png",
  "Exit E": "img/E.png",
  "Exit F": "img/F.png",
  "Exit G": "img/G.png",
  "Exit H": "img/H.png",
  "Exit I": "img/I.png",
  "Exit J": "img/J.png",
  "Exit K": "img/K.png",
  "Exit L": "img/L.png",
  "Exit M": "img/M.png",
  "Exit 1": "img/1.png",
  "Exit 2": "img/2.png",
  "Exit 3": "img/3.png",
  "Exit 4": "img/4.png",
  "Exit 5": "img/5.png",
  "Exit 6": "img/6.png",
  "Exit 7": "img/7.png",
  "Exit 8": "img/8.png",
  "Exit 9": "img/9.png",
  "Exit 10": "img/10.png",
  "Exit 11": "img/11.png",
  "Exit 12": "img/12.png",
  "Exit 13": "img/13.png",
};
const lineColorMapping = {
  "North South MRT Line": "Red",
  "East West MRT Line": "Green",
  "North East MRT Line": "Purple",
  "Circle MRT Line": "Orange",
  "Downtown MRT Line": "Blue",
  "Thomson-East Coast MRT Line": "Brown",
  "Bukit Panjang LRT": "gray",
  "Sengkang LRT": "gray",
  "Punggol LRT": "gray",
  NSL: "Red",
  EWL: "Green",
  NEL: "Purple",
  CCL: "Orange",
  DTL: "Blue",
  TEL: "Brown",
  BPL: "gray",
  SKRT: "gray",
  PLRT: "gray",
};

const createCustomIcon = (exitCode) => {
  const images = iconMapping[exitCode];
  const div = document.createElement("div");
  div.className = "custom-icon";

  if (Array.isArray(images)) {
    images.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = `${index * 20}px`; 
      div.appendChild(img);
    });
  } else { 
    const img = document.createElement("img");
    img.src = images;
    div.appendChild(img);
  }

  return L.divIcon({
    className: "", 
    html: div.outerHTML, 
    iconSize: [25, 25], 
    iconAnchor: [12, 24], 
    popupAnchor: [0, -24], 
  });
};

let mrtbylinedata = {}; 
const requests = [
  { url: "2024/linestring/BukitPanjangLRT.Geojson", lineName: "BPL" },
  { url: "2024/linestring/CircleLine.geojson", lineName: "CCL" },
  { url: "2024/linestring/DowntownLine.Geojson", lineName: "DTL" },
  { url: "2024/linestring/EastWestLine.geojson", lineName: "EWL" },
  { url: "2024/linestring/NorthEastLine.Geojson", lineName: "NEL" },
  { url: "2024/linestring/NorthSouthLine.geojson", lineName: "NSL" },
  { url: "2024/linestring/PunggolLRT.Geojson", lineName: "PLRT" },
  { url: "2024/linestring/SengkangLRT.Geojson", lineName: "SKRT" },
  { url: "2024/linestring/Thomson–EastCoastLine.geojson", lineName: "TEL" },
  //{ url: '2024/point/BukitPanjangLRT.Geojson', lineName: 'BPL' }, // not implemented
  //{ url: '2024/point/CircleLine.geojson', lineName: 'CCL' },
  //{ url: '2024/point/DowntownLine.Geojson', lineName: 'DTL' },
  //{ url: '2024/point/EastWestLine.geojson', lineName: 'EWL' },
  //{ url: '2024/point/NorthEastLine.Geojson', lineName: 'NEL' },
  //{ url: '2024/point/NorthSouthLine.geojson', lineName: 'NSL' },
  //{ url: '2024/point/PunggolLRT.Geojson', lineName: 'PLRT' },
  //{ url: '2024/point/SengkangLRT.Geojson', lineName: 'SKRT' },
  //{ url: '2024/point/Thomson–EastCoastLine.geojson', lineName: 'TEL' },
  { url: "2024/polygon/BukitPanjangLRT.Geojson", lineName: "BPL" },
  { url: "2024/polygon/CircleLine.geojson", lineName: "CCL" },
  { url: "2024/polygon/DowntownLine.Geojson", lineName: "DTL" },
  { url: "2024/polygon/EastWestLine.geojson", lineName: "EWL" },
  { url: "2024/polygon/NorthEastLine.Geojson", lineName: "NEL" },
  { url: "2024/polygon/NorthSouthLine.geojson", lineName: "NSL" },
  { url: "2024/polygon/PunggolLRT.Geojson", lineName: "PLRT" },
  { url: "2024/polygon/SengkangLRT.Geojson", lineName: "SKRT" },
  { url: "2024/polygon/Thomson–EastCoastLine.geojson", lineName: "TEL" },
];

Promise.all(
  requests.map((request) =>
    axios.get(request.url).then((response) => ({
      data: response.data,
      lineName: request.lineName,
    }))
  )
)
  .then((responses) => {
    responses.forEach(({ data, lineName }) => {
      loadGeoJSON(data, lineName);
    });
  })
  .catch((error) => {
    console.error("Error loading GeoJSON data:", error);
  });
let geoJsonFeatures = [];
const lineLayerGroups = {};
axios.get("simpleexit.geojson").then((response) => {
    const exitdata = response.data;
    const exitLayerGroup = L.layerGroup();

    if (exitdata && exitdata.type === "FeatureCollection") {
      //exitmarkers
      const addMarkersWithinBounds = () => {
        exitLayerGroup.clearLayers(); 
        const bounds = map.getBounds(); 

        L.geoJSON(exitdata, {
          onEachFeature: function (feature, layer) {
            if (feature.properties) {
              let stationName =
                feature.properties.Station_Name || "No Station Name";
              let exitCode = feature.properties.EXIT_CODE || "No Exit Code";
              let popupContent = `<b>${stationName}</b><br>${exitCode}`;
              layer.bindPopup(popupContent);
            }
          },
          pointToLayer: function (feature, latlng) {
            // Only add the marker if it's within the current bounds
            if (bounds.contains(latlng)) {
              let exitCode = feature.properties.EXIT_CODE || "No Exit Code";
              let icon = createCustomIcon(exitCode);
              return L.marker(latlng, { icon: icon });
            }
            return null; // Return null if outside bounds
          },
        }).addTo(exitLayerGroup);

        // Add the exit layer group to the map if the checkbox is checked
        const exitCheckbox = document.querySelector(
          '.geometry-type-checkbox[value="exits"]'
        );
        if (exitCheckbox.checked) {
          map.addLayer(exitLayerGroup);
        }
      };

     
      addMarkersWithinBounds();

      // Add an event listener to toggle the "Exits" layer group
      const exitCheckbox = document.querySelector(
        '.geometry-type-checkbox[value="exits"]'
      );
      exitCheckbox.addEventListener("change", function () {
        if (this.checked) {
          map.addLayer(exitLayerGroup);
          addMarkersWithinBounds(); // Re-add markers when checkbox is checked
        } else {
          map.removeLayer(exitLayerGroup);
        }
      });

      // Update markers on map move
      map.on("moveend", addMarkersWithinBounds);
    } else {
      console.error("Invalid GeoJSON data:", exitdata);
    }})
  .catch((error) => console.error("Error loading GeoJSON data:", error));
const loadGeoJSON = (geojsonData, lineName) => {
  lineLayerGroups[lineName] = lineLayerGroups[lineName] || {
    mainGroup: L.layerGroup().addTo(map),
    lineStrings: L.layerGroup(),
    polygons: L.layerGroup(),
    //points: L.layerGroup(),
  };

  lineLayerGroups[lineName].mainGroup
    .addLayer(lineLayerGroups[lineName].lineStrings)
    .addLayer(lineLayerGroups[lineName].polygons)
    //.addLayer(lineLayerGroups[lineName].points)
    ;

  const lineColor = lineColorMapping[lineName] || "black";

  geojsonData.features.forEach((feature) => {
    const { geometry } = feature;

    if (geometry.type === "LineString") {
      L.geoJSON(feature, {
        style: { color: lineColor },
      }).addTo(lineLayerGroups[lineName].lineStrings);
    } else if (geometry.type === "Polygon") {
      L.geoJSON(feature, {
        style: { color: lineColor, fillOpacity: 0.5 },
        onEachFeature: (feature, layer) => {
          layer.on("click", () => onPolygonClick(feature));
        },
      }).addTo(lineLayerGroups[lineName].polygons);
      geoJsonFeatures.push(feature);
    }
  });
// removed as poly is slighty better than point for this. 
  // let currentPopup = null;

  // function onMarkerClick(feature) {
  //   const properties = feature.properties;
  //   const [codeInName, ...stationParts] = properties.Name.split(" ");
  //   const stationNameInName = stationParts.join(" ");
  //   let stationDetails = null;

  //   for (const line of mrtbylinedata) {
  //       for (const station of line.stations) {
  //           if (station.name.toLowerCase() === stationNameInName.toLowerCase()) {
  //               if (
  //                   station.code === codeInName ||
  //                   station.code2 === codeInName ||
  //                   station.code3 === codeInName
  //               ) {
  //                   stationDetails = station;
  //                   break;
  //               }
  //           }
  //       }
  //       if (stationDetails) break;
  //   }

  //   const codes = [
  //       stationDetails?.code,
  //       stationDetails?.code2,
  //       stationDetails?.code3
  //   ].filter(Boolean);

  //   const stationInfo = `
  //       <strong>Name:</strong> ${properties.Name}<br>
  //       <strong>Station Code:</strong> ${codes.length > 0 ? codes.join(', ') : ''}
  //   `;

  //   const coordinates = feature.geometry.coordinates;

  //   if (currentPopup) {
  //       currentPopup.setContent(stationInfo);
  //       currentPopup.setLatLng([coordinates[1], coordinates[0]]);
  //   } else {
  //       currentPopup = L.popup()
  //           .setLatLng([coordinates[1], coordinates[0]])
  //           .setContent(stationInfo)
  //           .openOn(map);
  //   }

  //   map.on('popupclose', function() {
  //       currentPopup = null;
  //   });
  // }
};

function onPolygonClick(feature) {
  const properties = feature.properties;
  const stationNameInName = properties.Name;
  let stationDetails = null;

  for (const line of mrtbylinedata) {
    for (const station of line.stations) {
      if (
        station.name.toLowerCase() === stationNameInName.trim().toLowerCase()
      ) {
        stationDetails = station;
        break;
      }
    }
    if (stationDetails) break;
  }

  const codes = [
    stationDetails?.code,
    stationDetails?.code2,
    stationDetails?.code3,
  ].filter(Boolean);

  const stationInfo = `
      ${properties.Name}<br>
     ${
        codes.length > 0 ? codes.join(", ") : "N/A"
      }
  `;

  const polygon = L.geoJSON(feature);
  const centroid = polygon.getBounds().getCenter();
  map.setView([centroid.lat, centroid.lng], 15);

  L.popup({ className: 'custom-popup' })
    .setLatLng([centroid.lat, centroid.lng])
    .setContent(stationInfo)
    .openOn(map);
}

const loadMrtData = async () => {
  try {
    const response = await axios.get("/natgeojson/mrtbyline.js");
    mrtbylinedata = response.data;

    // console.log("MRT Data Loaded:", mrtbylinedata)
  } catch (error) {
    console.error("Error loading MRT data:", error);
  }
};

loadMrtData();
const toggleLayers = () => {
  document
    .querySelectorAll(".train-line-checkbox")
    .forEach((trainLineCheckbox) => {
      const lineName = trainLineCheckbox.value;
      const isLineChecked = trainLineCheckbox.checked;
      if (lineLayerGroups[lineName]) {
        document
          .querySelectorAll(".geometry-type-checkbox")
          .forEach((geometryCheckbox) => {
            const geometryType = geometryCheckbox.value;
            const isGeometryChecked = geometryCheckbox.checked;
            const layer = lineLayerGroups[lineName][geometryType];
            if (layer) {
              if (isLineChecked && isGeometryChecked) {
                map.addLayer(layer);
              } else {
                map.removeLayer(layer);
              }
            } else {
              // console.warn(`Layer for ${lineName} - ${geometryType} is undefined`);
            }
          });
      } else {
        console.error(`Layer group for ${lineName} not found`);
      }
    });
};

document
  .querySelectorAll(".train-line-checkbox, .geometry-type-checkbox")
  .forEach((checkbox) => {
    checkbox.addEventListener("change", toggleLayers);
  });

// left input
const searchInput = document.getElementById("searchInput");
const stationSelect = document.getElementById("stationSelect");
let selectedIndex = -1;

const filterStations = (event) => {
  if (!event || !event.target) return;

  const searchTerm = event.target.value.toLowerCase().trim();
  stationSelect.innerHTML = "";
  selectedIndex = -1;

  if (!geoJsonFeatures.length) return;

  const stationMap = new Map();

  geoJsonFeatures.forEach((feature) => {
    const { Name } = feature.properties || {};
    if (!Name) return;

    const stationName = Name.toLowerCase().trim();
    let stationDetails = findStationDetails(stationName);

    if (!stationDetails) return;

    const codes = [
      stationDetails?.code?.trim(),
      stationDetails?.code2?.trim(),
      stationDetails?.code3?.trim(),
    ].filter(Boolean);

    if (stationName.includes(searchTerm) || codes.some((code) => code.toLowerCase().includes(searchTerm))) {
      const mergedCodes = stationMap.get(stationName) || [];
      stationMap.set(stationName, Array.from(new Set([...mergedCodes, ...codes])));
    }
  });

  renderStationList(stationMap);
};

const findStationDetails = (stationName) => {
  for (const line of mrtbylinedata) {
    for (const station of line.stations) {
      if (station.name.toLowerCase().trim() === stationName) {
        return station;
      }
    }
  }
  return null;
};

const renderStationList = (stationMap) => {
  stationMap.forEach((codes, stationName) => {
    const listItem = document.createElement("li");
    listItem.className = "dropdown-item";
    listItem.textContent = `${capitalizeStationName(stationName)} - ${codes.join(", ") || "No Codes"}`;
    listItem.dataset.stationName = stationName;
    listItem.dataset.codes = JSON.stringify(codes);
    listItem.onclick = () => selectStationHandler(stationName, codes);
    stationSelect.appendChild(listItem);
  });

  stationSelect.classList.toggle("show", stationSelect.children.length > 0);
};

const highlightSelection = () => {
  Array.from(stationSelect.children).forEach((li, index) => {
    li.classList.toggle("active", index === selectedIndex);
  });
};

const handleKeyDown = (event) => {
  const items = stationSelect.children;

  // Check if there are any items in the dropdown list
  if (items.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      // Increment the selectedIndex, wrapping around the list length
      selectedIndex = (selectedIndex + 1) % items.length;
      highlightSelection();
      event.preventDefault(); // Prevent the default behavior (e.g., scrolling)
      break;

    case "ArrowUp":
      // Decrement the selectedIndex, wrapping around the list length
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      highlightSelection();
      event.preventDefault(); // Prevent the default behavior
      break;

    case "Enter":
      // Handle item selection on Enter key
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        const selectedItem = items[selectedIndex];
        const stationName = selectedItem.dataset.stationName;
        const codes = JSON.parse(selectedItem.dataset.codes);
        selectStationHandler(stationName, codes);
        event.preventDefault(); // Prevent the default behavior
      }
      break;

    case "Escape":
      // Close the dropdown on Escape key
      stationSelect.classList.remove("show");
      break;

    default:
      break;
  }
};

// Attach the keydown handler to the search input field
searchInput.addEventListener("keydown", handleKeyDown);

const selectStationHandler = (stationName, codes = []) => {
  const formattedCodes = codes.join(", ") || "No Codes";
  searchInput.value = `${capitalizeStationName(stationName)} - ${formattedCodes}`;

  const feature = geoJsonFeatures.find((f) => f.properties.Name.toLowerCase().trim() === stationName);
  if (feature) {
    onPolygonClick(feature);
  }

  stationSelect.innerHTML = "";
  stationSelect.classList.remove("show");
};

searchInput.addEventListener("input", filterStations);
searchInput.addEventListener("blur", () => {
  setTimeout(() => stationSelect.classList.remove("show"), 150);
});




//right input
const searchInputEnd = document.getElementById("searchInputEnd");
const stationSelectEnd = document.getElementById("stationSelectEnd");
let selectedIndexEnd = -1;
const capitalizeStationName = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
const getStationCodes = (stationName) => {
  let stationDetails = null;
  for (const line of mrtbylinedata) {
    for (const station of line.stations) {
      if (station.name.toLowerCase().trim() === stationName) {
        stationDetails = station;
        break;
      }
    }
    if (stationDetails) break;
  }
  return [
    stationDetails?.code?.trim(),
    stationDetails?.code2?.trim(),
    stationDetails?.code3?.trim(),
  ].filter(Boolean);
};
const createStationListItem = (stationName, codes, selectHandler) => {
  const listItem = document.createElement("li");
  listItem.className = "dropdown-item";
  listItem.textContent = `${capitalizeStationName(stationName)} - ${codes.join(", ") || "No Codes"}`;
  listItem.dataset.stationName = stationName;
  listItem.dataset.codes = JSON.stringify(codes);
  listItem.onclick = () => selectHandler(stationName, codes);
  return listItem;
};
const displayFilteredStations = (stationsMap, stationSelect) => {
  stationSelect.innerHTML = "";
  stationsMap.forEach((codes, stationName) => {
    const listItem = createStationListItem(stationName, codes, selectStationHandlerEnd);
    stationSelect.appendChild(listItem);
  });
  stationSelect.classList.toggle("show", stationSelect.children.length > 0);
};
const filterStationsEnd = (event) => {
  const searchTerm = event.target.value.toLowerCase().trim();
  stationSelectEnd.innerHTML = "";
  selectedIndexEnd = -1;
  if (!geoJsonFeatures.length) return;
  const stationMapEnd = new Map();
  geoJsonFeatures.forEach((feature) => {
    const stationName = feature.properties?.Name?.toLowerCase().trim();
    if (!stationName) return;
    const codes = getStationCodes(stationName);
    if (stationName.includes(searchTerm) || codes.some((code) => code.toLowerCase().includes(searchTerm))) {
      const mergedCodes = stationMapEnd.get(stationName) || [];
      mergedCodes.push(...codes);
      stationMapEnd.set(stationName, Array.from(new Set(mergedCodes)));
    }
  });
  displayFilteredStations(stationMapEnd, stationSelectEnd);
};
searchInputEnd.addEventListener("input", filterStationsEnd);
searchInputEnd.addEventListener("blur", () => {
  setTimeout(() => stationSelectEnd.classList.remove("show"), 150);
});
const highlightSelectionEnd = () => {
  Array.from(stationSelectEnd.children).forEach((li, index) => {
    li.classList.toggle("active", index === selectedIndexEnd);
  });
};
searchInputEnd.addEventListener("keydown", handleKeyDownEnd);
function handleKeyDownEnd(event) {
  const items = stationSelectEnd.children;
  const totalItems = items.length;
  if (totalItems === 0) return; 
  switch (event.key) {
    case "ArrowDown":
      selectedIndexEnd = (selectedIndexEnd + 1) % totalItems;
      highlightSelectionEnd();
      event.preventDefault(); 
      break;
    case "ArrowUp":
      selectedIndexEnd = (selectedIndexEnd - 1 + totalItems) % totalItems;
      highlightSelectionEnd();
      event.preventDefault();
      break;
    case "Enter":   
      if (selectedIndexEnd >= 0 && selectedIndexEnd < totalItems) {
        const selectedItem = items[selectedIndexEnd];
        const stationName = selectedItem.dataset.stationName;
        const codes = JSON.parse(selectedItem.dataset.codes);
        selectStationHandlerEnd(stationName, codes);
        event.preventDefault();}
      break;
    case "Escape":      
      stationSelectEnd.classList.remove("show");
      break;
    default:
      break;
  }
}
const selectStationHandlerEnd = (stationName, codes = []) => {
  searchInputEnd.value = `${capitalizeStationName(stationName)} - ${codes.join(", ") || "No Codes"}`;
  const feature = geoJsonFeatures.find((f) => f.properties.Name.toLowerCase().trim() === stationName);
  if (feature) {
    onPolygonClick(feature);
    onPolygonClick(feature);
  }
  stationSelectEnd.innerHTML = "";
  stationSelectEnd.classList.remove("show");
};
const showAllStations = (stationSelect) => {
  const stationMap = new Map();
    geoJsonFeatures.forEach((feature) => {
    const stationName = feature.properties?.Name?.toLowerCase().trim();
    if (!stationName) return;
    const codes = getStationCodes(stationName);
    const mergedCodes = stationMap.get(stationName) || [];
    mergedCodes.push(...codes);
    stationMap.set(stationName, Array.from(new Set(mergedCodes)));
  });
  displayFilteredStations(stationMap, stationSelect);
};
const showAllStationsEnd = () => {
  showAllStations(stationSelectEnd);
};
//different code
// Fetch station data
axios
  .get("remodifiedstations.json")
  .then((response) => {
    const stationData = response.data;
    const graph = {};
    stationData.forEach((item) => {
      if (item.status === "Decommissioned") return;
      const start = item.start.toLowerCase();
      const end = item.end.toLowerCase();
      const distance = item.distance;
      const line = item.line.toLowerCase();
      if (!graph[start]) graph[start] = {};
      if (!graph[end]) graph[end] = {};     
      graph[start][end] = { distance, line };
      graph[end][start] = { distance, line };
    });
    axios.get("farebydistance.json")
      .then((fareResponse) => {
        const fares = fareResponse.data;
        function transformFares(fares, distance) {
          const fareResults = {};
          fares.forEach(({ cardType, fareTypes }) => {
            fareResults[cardType] = fareTypes.reduce((acc, { fareType, fareRanges }) => {
              acc[fareType] = fareRanges
                .filter(({ Distance }) => {
                  const [min, max] = Distance.split(" - ").map(parseFloat);
                  return distance >= min && distance <= max;})
                .map(({ Fare }) => ({ Fare }));return acc;
            }, {});
          });return fareResults;}
        const fareResults = transformFares(fares);
        const pathfindingButton = document.getElementById("pathfindingButton");
        const startingStationInput = document.getElementById("searchInput");
        const endingStationInput = document.getElementById("searchInputEnd");
        pathfindingButton.addEventListener("click", () => {
          const startingStationCode = startingStationInput.value.trim();
          const endingStationCode = endingStationInput.value.trim();
          // console.log("Starting station code:", startingStationCode);
          // console.log("Ending station code:", endingStationCode);
          displayPathfindingResult(graph, startingStationCode, endingStationCode, fareResults);
        });
      })
      .catch((error) => {
        console.error("Error fetching fare data:", error);
        alert("Failed to load fare data.");
      });
  })
  .catch((error) => {
    console.error("Error fetching station data:", error);
    alert("Failed to load station data.");
  });
function displayPathfindingResult(graph, startCode, endCode, fareResults) {
  const start = extractStationNameFromCode(startCode);
  const end = extractStationNameFromCode(endCode);
  const result = findShortestPath(graph, start, end);
  const routeList = document.getElementById("routeList");
  const distanceList = document.getElementById("distanceList");
  const lineDetailsList = document.getElementById("lineDetailsList");
  const fareList = document.getElementById("fareList");

  // Clear
  routeList.innerHTML = '';
  distanceList.innerHTML = '';
  lineDetailsList.innerHTML = '';
  fareList.innerHTML = '';

  if (result) {
    // Display the path in the route list
    const routeItem = document.createElement("li");
    routeItem.textContent = result.path || "No path found";
    routeList.appendChild(routeItem);

    // Display the distance
    const distanceItem = document.createElement("li");
    distanceItem.textContent = result.distance !== undefined ? result.distance.toFixed(2) + " km" : "N/A";
    distanceList.appendChild(distanceItem);

    // Display the line details 
    const lineDetailsItem = document.createElement("li");
    lineDetailsItem.textContent = result.lines || "No line details";
    lineDetailsList.appendChild(lineDetailsItem);

   // Determine fare future implement. to useby distance calulation. N/A for now
   // const distance = result.distance;
   // const selectedFare = determineFare(fareResults, distance);
    const selectedFare = fareResults;
    const fareItem = document.createElement("li");
    fareItem.textContent = selectedFare?.AdultCard?.Basic?.[0]?.Fare || "N/A";
    fareList.appendChild(fareItem);
  } else {
    const noRouteItem = document.createElement("li");
    noRouteItem.textContent = "No route found";
    routeList.appendChild(noRouteItem);

    const noDistanceItem = document.createElement("li");
    noDistanceItem.textContent = "N/A";
    distanceList.appendChild(noDistanceItem);

    const noLineDetailsItem = document.createElement("li");
    noLineDetailsItem.textContent = "N/A";
    lineDetailsList.appendChild(noLineDetailsItem);

    const noFareItem = document.createElement("li");
    noFareItem.textContent = "N/A";
    fareList.appendChild(noFareItem);
  }
}
// future implement
// function determineFare(fareResults, distance) {
//   // const fareRange = Math.ceil(distance); 
//   return fareResults; 
// }
function findShortestPath(graph, start, end) {
  const distances = {};
  const previous = {};
  const nodes = new Set(Object.keys(graph).map((node) => node.toLowerCase()));
  const startLower = start.toLowerCase();
  const endLower = end.toLowerCase();
  const linesUsed = {};

  // Initialize distances and previous nodes for dijkstra's setup
  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startLower] = 0;

  // Dijkstra's algorithm 
  while (nodes.size) {
    let closestNode = [...nodes].reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );

    if (distances[closestNode] === Infinity) break;
    nodes.delete(closestNode);

    for (let neighbor in graph[closestNode]) {
      const alternative = distances[closestNode] + graph[closestNode][neighbor].distance;
      if (alternative < distances[neighbor]) {
        distances[neighbor] = alternative;
        previous[neighbor] = closestNode;
        linesUsed[neighbor] = graph[closestNode][neighbor].line;
      }
    }
  }

  let currentNode = endLower;
  const shortestPath = [];
  const linesOnPath = [];
  let lastLine = null;

  while (previous[currentNode] !== null) {
    if (linesUsed[currentNode] !== lastLine) {
      shortestPath.unshift(currentNode);
      linesOnPath.unshift(linesUsed[currentNode]);
      lastLine = linesUsed[currentNode];
    }
    currentNode = previous[currentNode];
  }

  if (shortestPath.length === 0) {
    return null;
  }

  shortestPath.unshift(startLower);
  const shortestDistance = distances[endLower];

  const pathWithTransfers = [];
  const lineDetails = [];
  let lastAddedStation = null;

  shortestPath.forEach((station, index) => {
    const stationName = station.charAt(0).toUpperCase() + station.slice(1);
    if (stationName !== lastAddedStation) {
      pathWithTransfers.push(stationName);
      lineDetails.push(linesOnPath[index] || "");
      lastAddedStation = stationName;
    } else {
      pathWithTransfers.push(stationName);
    }
  });

  const finalLineDetails = [];
  let lastLineDetail = null;
  lineDetails.forEach((line) => {
    if (line !== lastLineDetail) {
      finalLineDetails.push(line);
      lastLineDetail = line;
    }
  });

  const linesOutput = finalLineDetails.length > 1 ? finalLineDetails.join(" -> ") : finalLineDetails[0] || '';

  return {
    path: pathWithTransfers.join(" -> "),
    distance: shortestDistance,
    lines: linesOutput,
  };
}

function extractStationNameFromCode(stationCode) {
  return stationCode.split(" - ")[0].trim().toLowerCase();
}
document.getElementById('pathfindingButton').addEventListener('click', function() {
  var resultsContainer = document.getElementById('resultsContainer');
  
  // Toggle visibility of the results container
  resultsContainer.classList.toggle('d-none');
});
document.getElementById('pathfindingButton').addEventListener('click', function() {
  var resultsContainer2 = document.getElementById('resultsContainer2');
  
  // Toggle visibility of the results container
  resultsContainer2.classList.toggle('d-none');
});
// Select the button using its ID
const searchButton = document.getElementById('pathfindingButton');
// searchButton.style.width = '100px';

searchButton.addEventListener('click', function() {
  // Toggle the button text between 'Search' and 'Hide Search'
  if (searchButton.textContent === 'Search') {
    searchButton.textContent = 'Hide Search';
  } else {
    searchButton.textContent = 'Search';
  }


});