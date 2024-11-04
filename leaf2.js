let map = L.map("map").setView([1.3521, 103.8198], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const MrtIcon2 = L.icon({
  iconUrl: "img/MRT.png",
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20],
});

// Custom icons for exits
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

  // Create a div element for the custom marker
  const div = document.createElement("div");
  div.className = "custom-icon";

  // Add images to the div
  if (Array.isArray(images)) {
    images.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = `${index * 20}px`; // Adjust position for overlap
      div.appendChild(img);
    });
  } else {
    // Single image case
    const img = document.createElement("img");
    img.src = images;
    div.appendChild(img);
  }

  return L.divIcon({
    className: "", // No extra class
    html: div.outerHTML, // Use the div's outerHTML for the custom icon
    iconSize: [25, 25], // Size of the icon
    iconAnchor: [12, 24], // Anchor point of the icon
    popupAnchor: [0, -24], // Popup anchor point
  });
 };

let mrtbylinedata = {}; // To store the fetched data

// Function to load MRT data
// async function loadMrtData() {
//   try {
//     const response = await axios.get("/natgeojson/mrtbyline.js"); // Update the path accordingly
//     mrtbylinedata = response.data; // Assuming mrtbyline.js exports an object or array
//     // console.log('MRT Data loaded:', mrtbylinedata); // For debugging
//   } catch (error) {
//     console.error("Error loading MRT data:", error);
//   }
// }let geojsonData; 
// loadMrtData();
const requests = [  
   { url: '2024/linestring/BukitPanjangLRT.Geojson', lineName: 'BPL' },
   { url: '2024/linestring/CircleLine.geojson', lineName: 'CCL' },
   { url: '2024/linestring/DowntownLine.Geojson', lineName: 'DTL' },
   { url: '2024/linestring/EastWestLine.geojson', lineName: 'EWL' },
   { url: '2024/linestring/NorthEastLine.Geojson', lineName: 'NEL' },
   { url: '2024/linestring/NorthSouthLine.geojson', lineName: 'NSL' },
   { url: '2024/linestring/PunggolLRT.Geojson', lineName: 'PLRT' },
   { url: '2024/linestring/SengkangLRT.Geojson', lineName: 'SKRT' },
   { url: '2024/linestring/Thomson–EastCoastLine.geojson', lineName: 'TEL' },
   //{ url: '2024/point/BukitPanjangLRT.Geojson', lineName: 'BPL' },
   //{ url: '2024/point/CircleLine.geojson', lineName: 'CCL' },
   //{ url: '2024/point/DowntownLine.Geojson', lineName: 'DTL' },
   //{ url: '2024/point/EastWestLine.geojson', lineName: 'EWL' },
   //{ url: '2024/point/NorthEastLine.Geojson', lineName: 'NEL' },
   //{ url: '2024/point/NorthSouthLine.geojson', lineName: 'NSL' },
   //{ url: '2024/point/PunggolLRT.Geojson', lineName: 'PLRT' },
   //{ url: '2024/point/SengkangLRT.Geojson', lineName: 'SKRT' },
   //{ url: '2024/point/Thomson–EastCoastLine.geojson', lineName: 'TEL' },
   { url: '2024/polygon/BukitPanjangLRT.Geojson', lineName: 'BPL' },
   { url: '2024/polygon/CircleLine.geojson', lineName: 'CCL' },
   { url: '2024/polygon/DowntownLine.Geojson', lineName: 'DTL' },
   { url: '2024/polygon/EastWestLine.geojson', lineName: 'EWL' },
   { url: '2024/polygon/NorthEastLine.Geojson', lineName: 'NEL' },
   { url: '2024/polygon/NorthSouthLine.geojson', lineName: 'NSL' },
   { url: '2024/polygon/PunggolLRT.Geojson', lineName: 'PLRT' },
   { url: '2024/polygon/SengkangLRT.Geojson', lineName: 'SKRT' },
   { url: '2024/polygon/Thomson–EastCoastLine.geojson', lineName: 'TEL' }
];

Promise.all(
  requests.map((request) =>
    axios.get(request.url).then(response => ({
      data: response.data,
      lineName: request.lineName
     
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
  let geoJsonFeatures = []
const lineLayerGroups = {};
axios.get('simpleexit.geojson')
  .then(response => {
    const exitdata = response.data;
    const exitLayerGroup = L.layerGroup();

    if (exitdata && exitdata.type === "FeatureCollection") {
      // Create a function to add markers based on the current map bounds
      const addMarkersWithinBounds = () => {
        exitLayerGroup.clearLayers(); // Clear existing markers
        const bounds = map.getBounds(); // Get current map bounds

        L.geoJSON(exitdata, {
          onEachFeature: function (feature, layer) {
            if (feature.properties) {
              let stationName = feature.properties.Station_Name || "No Station Name";
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
          }
        }).addTo(exitLayerGroup);

        // Add the exit layer group to the map if the checkbox is checked
        const exitCheckbox = document.querySelector('.geometry-type-checkbox[value="exits"]');
        if (exitCheckbox.checked) {
          map.addLayer(exitLayerGroup);
        }
      };

      // Call the function to add markers initially
      addMarkersWithinBounds();

      // Add an event listener to toggle the "Exits" layer group
      const exitCheckbox = document.querySelector('.geometry-type-checkbox[value="exits"]');
      exitCheckbox.addEventListener('change', function () {
        if (this.checked) {
          map.addLayer(exitLayerGroup);
          addMarkersWithinBounds(); // Re-add markers when checkbox is checked
        } else {
          map.removeLayer(exitLayerGroup);
        }
      });

      // Update markers on map move
      map.on('moveend', addMarkersWithinBounds);
    } else {
      console.error('Invalid GeoJSON data:', exitdata);
    }
  })
  .catch(error => console.error('Error loading GeoJSON data:', error));
const loadGeoJSON = (geojsonData, lineName) => {
  lineLayerGroups[lineName] = lineLayerGroups[lineName] || {
    mainGroup: L.layerGroup().addTo(map),
    lineStrings: L.layerGroup(),
    polygons: L.layerGroup(),
    points: L.layerGroup()
  };

  lineLayerGroups[lineName].mainGroup
    .addLayer(lineLayerGroups[lineName].lineStrings)
    .addLayer(lineLayerGroups[lineName].polygons)
    .addLayer(lineLayerGroups[lineName].points);

  const lineColor = lineColorMapping[lineName] || 'black';

  geojsonData.features.forEach(feature => {
    const { geometry } = feature;

    if (geometry.type === 'LineString') {
      L.geoJSON(feature, {
        style: { color: lineColor }
      }).addTo(lineLayerGroups[lineName].lineStrings);

    } else if (geometry.type === 'Polygon') {
      L.geoJSON(feature, {
        style: { color: lineColor, fillOpacity: 0.5 },
        onEachFeature: (feature, layer) => {
          layer.on('click', () => onPolygonClick(feature));
        }
      }).addTo(lineLayerGroups[lineName].polygons);
      geoJsonFeatures.push(feature)
    }
  });

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
  

}


function onPolygonClick(feature) {
  const properties = feature.properties;
  const stationNameInName = properties.Name;
  let stationDetails = null;

  for (const line of mrtbylinedata) {
    for (const station of line.stations) {
      if (station.name.toLowerCase() === stationNameInName.trim().toLowerCase()) {
        stationDetails = station;
        break;
      }
    }
    if (stationDetails) break;
  }

  const codes = [
    stationDetails?.code,
    stationDetails?.code2,
    stationDetails?.code3
  ].filter(Boolean);

  const stationInfo = `
      <strong>Name:</strong> ${properties.Name}<br>
      <strong>Station Code:</strong> ${codes.length > 0 ? codes.join(', ') : 'N/A'}
  `;

  const polygon = L.geoJSON(feature);
  const centroid = polygon.getBounds().getCenter();
  map.setView([centroid.lat, centroid.lng], 15);

  L.popup()
      .setLatLng([centroid.lat, centroid.lng])
      .setContent(stationInfo)
      .openOn(map);
}

const loadMrtData = async () => {
  try {
    const response = await axios.get('/natgeojson/mrtbyline.js');
    mrtbylinedata = response.data;
    
    // console.log("MRT Data Loaded:", mrtbylinedata)
  } catch (error) {
    console.error('Error loading MRT data:', error);
  }
};


loadMrtData()
const toggleLayers = () => {
  document.querySelectorAll('.train-line-checkbox').forEach(trainLineCheckbox => {
    const lineName = trainLineCheckbox.value;
    const isLineChecked = trainLineCheckbox.checked;

    if (lineLayerGroups[lineName]) {
      document.querySelectorAll('.geometry-type-checkbox').forEach(geometryCheckbox => {
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
// Add event listeners to all checkboxes for toggling layers
document.querySelectorAll('.train-line-checkbox, .geometry-type-checkbox').forEach(checkbox => {
  checkbox.addEventListener('change', toggleLayers);
});

const searchInput = document.getElementById('searchInput');
let selectedIndex = -1;
const stationSelect = document.getElementById("stationSelect");

const filterStations = (event) => {
  if (!event || !event.target) return;
  const searchTerm = event.target.value.toLowerCase().trim();
  stationSelect.innerHTML = '';
  selectedIndex = -1;

  if (!geoJsonFeatures.length) return;
  const stationMap = new Map();

  geoJsonFeatures.forEach(feature => {
    const properties = feature.properties;
    if (properties && properties.Name) {
      const stationName = properties.Name.toLowerCase().trim();
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

      const codes = [
        stationDetails?.code?.trim(),
        stationDetails?.code2?.trim(),
        stationDetails?.code3?.trim()
      ].filter(Boolean);

      if (stationName.includes(searchTerm) || codes.some(code => code?.toLowerCase().includes(searchTerm))) {
        const mergedCodes = stationMap.get(stationName) || [];
        mergedCodes.push(...codes);
        stationMap.set(stationName, Array.from(new Set(mergedCodes)));
      }
    }
  });

  stationMap.forEach((codes, stationName) => {
    const listItem = document.createElement('li');
    listItem.className = 'dropdown-item';
    listItem.textContent = `${capitalizeStationName(stationName)} ${codes.join(', ') || 'No Codes'}`;
    listItem.dataset.stationName = stationName;
    listItem.dataset.codes = JSON.stringify(codes);
    listItem.onclick = () => {
      selectStationHandler(stationName, codes);
    };
    stationSelect.appendChild(listItem);
  });

  if (stationSelect.children.length > 0) {
    stationSelect.classList.add('show');
  } else {
    stationSelect.classList.remove('show');
  }
};

searchInput.addEventListener('input', filterStations);
searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    stationSelect.classList.remove('show');
  }, 150);
});

function highlightSelection() {
  Array.from(stationSelect.children).forEach((li, index) => {
    li.classList.toggle("active", index === selectedIndex);
  });
}

function handleKeyDown(event) {
  const items = stationSelect.children;

  if (event.key === "ArrowDown") {
    if (items.length > 0) {
      selectedIndex = (selectedIndex + 1) % items.length;
      highlightSelection();
    }
    event.preventDefault();
  } else if (event.key === "ArrowUp") {
    if (items.length > 0) {
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      highlightSelection();
    }
    event.preventDefault();
  } else if (event.key === "Enter") {
    if (selectedIndex >= 0 && selectedIndex < items.length) {
      const selectedItem = items[selectedIndex];
      const stationName = selectedItem.dataset.stationName;
      const codes = JSON.parse(selectedItem.dataset.codes);
      selectStationHandler(stationName, codes);
      event.preventDefault();
    }
  } else if (event.key === "Escape") {
    stationSelect.classList.remove('show');
  }
}

function selectStationHandler(stationName, codes = []) {
  const formattedCodes = codes.join(', ') || 'No Codes';
  searchInput.value = `${capitalizeStationName(stationName)} ${formattedCodes}`;
  const feature = geoJsonFeatures.find(f => f.properties.Name.toLowerCase().trim() === stationName);
  if (feature) {
    onPolygonClick(feature);
    onPolygonClick(feature);
  }
  stationSelect.innerHTML = '';
  stationSelect.classList.remove('show');
}

const searchInputEnd = document.getElementById('searchInputEnd');
let selectedIndexEnd = -1;
const stationSelectEnd = document.getElementById("stationSelectEnd");

const filterStationsEnd = (event) => {
  if (!event || !event.target) return;
  const searchTerm = event.target.value.toLowerCase().trim();
  stationSelectEnd.innerHTML = '';
  selectedIndexEnd = -1;

  if (!geoJsonFeatures.length) return;
  const stationMapEnd = new Map();

  geoJsonFeatures.forEach(feature => {
    const properties = feature.properties;
    if (properties && properties.Name) {
      const stationName = properties.Name.toLowerCase().trim();
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

      const codes = [
        stationDetails?.code?.trim(),
        stationDetails?.code2?.trim(),
        stationDetails?.code3?.trim()
      ].filter(Boolean);

      if (stationName.includes(searchTerm) || codes.some(code => code?.toLowerCase().includes(searchTerm))) {
        const mergedCodes = stationMapEnd.get(stationName) || [];
        mergedCodes.push(...codes);
        stationMapEnd.set(stationName, Array.from(new Set(mergedCodes)));
      }
    }
  });

  stationMapEnd.forEach((codes, stationName) => {
    const listItem = document.createElement('li');
    listItem.className = 'dropdown-item';
    listItem.textContent = `${capitalizeStationName(stationName)} ${codes.join(', ') || 'No Codes'}`;
    listItem.dataset.stationName = stationName;
    listItem.dataset.codes = JSON.stringify(codes);
    listItem.onclick = () => {
      selectStationHandlerEnd(stationName, codes);
    };
    stationSelectEnd.appendChild(listItem);
  });

  if (stationSelectEnd.children.length > 0) {
    stationSelectEnd.classList.add('show');
  } else {
    stationSelectEnd.classList.remove('show');
  }
};

searchInputEnd.addEventListener('input', filterStationsEnd);
searchInputEnd.addEventListener('blur', () => {
  setTimeout(() => {
    stationSelectEnd.classList.remove('show');
  }, 150);
});

function highlightSelectionEnd() {
  Array.from(stationSelectEnd.children).forEach((li, index) => {
    li.classList.toggle("active", index === selectedIndexEnd);
  });
}

function handleKeyDownEnd(event) {
  const items = stationSelectEnd.children;

  if (event.key === "ArrowDown") {
    if (items.length > 0) {
      selectedIndexEnd = (selectedIndexEnd + 1) % items.length;
      highlightSelectionEnd();
    }
    event.preventDefault();
  } else if (event.key === "ArrowUp") {
    if (items.length > 0) {
      selectedIndexEnd = (selectedIndexEnd - 1 + items.length) % items.length;
      highlightSelectionEnd();
    }
    event.preventDefault();
  } else if (event.key === "Enter") {
    if (selectedIndexEnd >= 0 && selectedIndexEnd < items.length) {
      const selectedItem = items[selectedIndexEnd];
      const stationName = selectedItem.dataset.stationName;
      const codes = JSON.parse(selectedItem.dataset.codes);
      selectStationHandlerEnd(stationName, codes);
      event.preventDefault();
    }
  } else if (event.key === "Escape") {
    stationSelectEnd.classList.remove('show');
  }
}

function selectStationHandlerEnd(stationName, codes = []) {
  const formattedCodes = codes.join(', ') || 'No Codes';
  searchInputEnd.value = `${capitalizeStationName(stationName)} ${formattedCodes}`;
  const feature = geoJsonFeatures.find(f => f.properties.Name.toLowerCase().trim() === stationName);
  if (feature) {
    onPolygonClick(feature);
    onPolygonClick(feature);
  }
  stationSelectEnd.innerHTML = '';
  stationSelectEnd.classList.remove('show');
}

const capitalizeStationName = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const showAllStationsStart = (stationSelect) => {
  stationSelect.innerHTML = '';
  geoJsonFeatures.forEach(feature => {
    const properties = feature.properties;
    if (properties && properties.Name) {
      const stationName = properties.Name.toLowerCase().trim();
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

      const codes = [
        stationDetails?.code?.trim(),
        stationDetails?.code2?.trim(),
        stationDetails?.code3?.trim()
      ].filter(Boolean);

      const listItem = document.createElement('li');
      listItem.className = 'dropdown-item';
      listItem.textContent = `${capitalizeStationName(stationName)} ${codes.join(', ') || 'No Codes'}`;
      listItem.dataset.stationName = stationName;
      listItem.dataset.codes = JSON.stringify(codes);
      listItem.onclick = () => {
        selectStationHandler(stationName, codes);
      };
      stationSelect.appendChild(listItem);
    }
  });
  stationSelect.classList.add('show');
};

const showAllStationsEnd = (stationSelectEnd) => {
  stationSelectEnd.innerHTML = '';
  geoJsonFeatures.forEach(feature => {
    const properties = feature.properties;
    if (properties && properties.Name) {
      const stationName = properties.Name.toLowerCase().trim();
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

      const codes = [
        stationDetails?.code?.trim(),
        stationDetails?.code2?.trim(),
        stationDetails?.code3?.trim()
      ].filter(Boolean);

      const listItem = document.createElement('li');
      listItem.className = 'dropdown-item';
      listItem.textContent = `${capitalizeStationName(stationName)} ${codes.join(', ') || 'No Codes'}`;
      listItem.dataset.stationName = stationName;
      listItem.dataset.codes = JSON.stringify(codes);
      listItem.onclick = () => {
        selectStationHandlerEnd(stationName, codes);
      };
      stationSelectEnd.appendChild(listItem);
    }
  });
  stationSelectEnd.classList.add('show');
};




const pathfindingButton = document.getElementById('pathfindingButton');
const startingStationInput = document.getElementById('searchInput');
const endingStationInput = document.getElementById('searchInputEnd');
const resultTextarea = document.getElementById('pathfindingresult'); // Get the textarea element


    // Check if the input fields are not empty
    pathfindingButton.addEventListener('click', () => {
      // Get the values from the input fields
      const startingStation = startingStationInput.value.trim();
      const endingStation = endingStationInput.value.trim();
  
      // Check if both starting and ending stations are provided
      if (startingStation && endingStation) {
          // Update the textarea with the input values
          resultTextarea.value = `Starting Station: ${startingStation}\nEnding Station: ${endingStation}\nTotal distance: price:`;
      } 
      // Check if only starting station is provided
      else if (startingStation) {
          resultTextarea.value = `Starting Station: ${startingStation}\nEnding Station: Not specified\nTotal distance: price:`;
      } 
      // Check if only ending station is provided
      else if (endingStation) {
          resultTextarea.value = `Starting Station: Not specified\nEnding Station: ${endingStation}\nTotal distance: price:`;
      } 
      // If neither station is provided
      else {
          alert("Please enter both starting and ending stations.");
      }
  });
