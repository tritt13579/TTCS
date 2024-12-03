// document.getElementById("fileInput").addEventListener("change", handleFile);

// function handleFile(event) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = JSON.parse(e.target.result);
//       applyForceDirectedLayout(data);
//       drawGraph(data);
//     };
//     reader.readAsText(file);
//   }
// }

// function applyForceDirectedLayout(data) {
//   const width = 800;
//   const height = 600;
//   const k = Math.sqrt((width * height) / data.nodes.length); // Hằng số cho lực
//   const iterations = 500; // Số vòng lặp

//   // Gán vị trí ngẫu nhiên ban đầu
//   data.nodes.forEach((node) => {
//     node.x = Math.random() * width;
//     node.y = Math.random() * height;
//   });

//   // Cập nhật vị trí dựa trên lực
//   for (let iter = 0; iter < iterations; iter++) {
//     // Tính lực đẩy
//     data.nodes.forEach((nodeA) => {
//       nodeA.vx = 0;
//       nodeA.vy = 0;
//       data.nodes.forEach((nodeB) => {
//         if (nodeA !== nodeB) {
//           const dx = nodeA.x - nodeB.x;
//           const dy = nodeA.y - nodeB.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
//           if (distance > 0) {
//             const force = (k * k) / distance;
//             nodeA.vx += (dx / distance) * force;
//             nodeA.vy += (dy / distance) * force;
//           }
//         }
//       });
//     });

//     // Tính lực hút
//     data.edges.forEach((edge) => {
//       const source = data.nodes.find((node) => node.id === edge.source);
//       const target = data.nodes.find((node) => node.id === edge.target);
//       const dx = target.x - source.x;
//       const dy = target.y - source.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);
//       const force = (distance * distance) / k;
//       const fx = (dx / distance) * force;
//       const fy = (dy / distance) * force;
//       source.vx += fx;
//       source.vy += fy;
//       target.vx -= fx;
//       target.vy -= fy;
//     });

//     // Cập nhật vị trí
//     data.nodes.forEach((node) => {
//       node.x += node.vx * 0.1; // Tỉ lệ giảm để tránh di chuyển quá nhiều
//       node.y += node.vy * 0.1;

//       // Giữ các nút trong phạm vi đồ thị
//       node.x = Math.max(20, Math.min(width - 20, node.x));
//       node.y = Math.max(20, Math.min(height - 20, node.y));
//     });
//   }
// }
// function drawGraph(data) {
//   const svg = document.getElementById("graphCanvas");
//   const svgWidth = svg.clientWidth || 800;
//   const svgHeight = svg.clientHeight || 600;
//   svg.innerHTML = ""; // Xóa nội dung cũ

//   // Vẽ các cạnh
//   data.edges.forEach((edge) => {
//     const source = data.nodes.find((node) => node.id === edge.source);
//     const target = data.nodes.find((node) => node.id === edge.target);

//     // Vẽ đường thẳng
//     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", source.x);
//     line.setAttribute("y1", source.y);
//     line.setAttribute("x2", target.x);
//     line.setAttribute("y2", target.y);
//     line.classList.add("edge");
//     svg.appendChild(line);

//     // Hiển thị trọng số - di chuyển sang một vị trí khác
//     const weightText = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "text"
//     );
//     const midX = (source.x + target.x) / 2;
//     const midY = (source.y + target.y) / 2;

//     // Tính toán vector pháp tuyến để di chuyển trọng số ra xa đường line
//     const dx = target.x - source.x;
//     const dy = target.y - source.y;
//     const length = Math.sqrt(dx * dx + dy * dy);
//     const offsetDistance = 12; // Khoảng cách di chuyển

//     // Vector pháp tuyến
//     const normalX = (-dy / length) * offsetDistance;
//     const normalY = (dx / length) * offsetDistance;

//     weightText.setAttribute("x", midX + normalX);
//     weightText.setAttribute("y", midY + normalY);
//     weightText.setAttribute("text-anchor", "middle");
//     weightText.setAttribute("class", "weight");
//     weightText.textContent = edge.weight;
//     svg.appendChild(weightText);
//   });

//   // Vẽ các đỉnh
//   data.nodes.forEach((node) => {
//     // Vẽ hình tròn đại diện cho node
//     const circle = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "circle"
//     );
//     circle.setAttribute("cx", node.x);
//     circle.setAttribute("cy", node.y);
//     circle.setAttribute("r", 20);
//     circle.classList.add("node");
//     svg.appendChild(circle);

//     // Hiển thị khoảng cách bên trong node
//     const distanceText = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "text"
//     );
//     distanceText.setAttribute("x", node.x);
//     distanceText.setAttribute("y", node.y + 5);
//     distanceText.setAttribute("text-anchor", "middle");
//     distanceText.setAttribute("class", "distance");
//     distanceText.textContent = "∞"; // Giá trị mặc định
//     svg.appendChild(distanceText);

//     // Hiển thị nhãn đỉnh - tránh đè lên các phần tử khác
//     const labelText = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "text"
//     );
//     const labelOffsetX = 30; // Khoảng cách ngang
//     const labelOffsetY = 30; // Khoảng cách dọc

//     // Tìm vị trí phù hợp để đặt nhãn
//     let adjustedX = node.x + labelOffsetX;
//     let adjustedY = node.y - labelOffsetY;

//     // Điều chỉnh để tránh ra khỏi biên SVG
//     adjustedX = Math.max(
//       labelOffsetX,
//       Math.min(adjustedX, svgWidth - labelOffsetX)
//     );
//     adjustedY = Math.max(
//       labelOffsetY,
//       Math.min(adjustedY, svgHeight - labelOffsetY)
//     );

//     labelText.setAttribute("x", adjustedX);
//     labelText.setAttribute("y", adjustedY);
//     labelText.setAttribute("text-anchor", "middle");
//     labelText.setAttribute("class", "label");
//     labelText.textContent = node.id;
//     svg.appendChild(labelText);
//   });
// }

// function dijkstra(graph, startNode) {
//   const distances = {};
//   const previousNodes = {};
//   const unvisitedNodes = new Set();

//   // Khởi tạo khoảng cách ban đầu
//   for (const node in graph) {
//     distances[node] = Infinity;
//     previousNodes[node] = null;
//     unvisitedNodes.add(node);
//   }
//   distances[startNode] = 0;

//   const steps = []; // Lưu các bước

//   while (unvisitedNodes.size > 0) {
//     // Tìm đỉnh gần nhất chưa được thăm
//     let currentNode = null;
//     for (const node of unvisitedNodes) {
//       if (currentNode === null || distances[node] < distances[currentNode]) {
//         currentNode = node;
//       }
//     }

//     if (distances[currentNode] === Infinity) break;

//     // Cập nhật khoảng cách đến các đỉnh kề
//     for (const [neighbor, weight] of Object.entries(graph[currentNode])) {
//       const newDist = distances[currentNode] + weight;
//       if (newDist < distances[neighbor]) {
//         distances[neighbor] = newDist;
//         previousNodes[neighbor] = currentNode;
//         // Lưu trạng thái hiện tại
//         steps.push({
//           node: neighbor,
//           distance: newDist,
//           previous: currentNode,
//         });
//       }
//     }

//     // Đánh dấu đỉnh đã thăm
//     unvisitedNodes.delete(currentNode);
//   }

//   return { distances, previousNodes, steps };
// }

// Global variables to manage visualization state
// let currentStep = 0;
// let dijkstraSteps = [];
// let graphData = null;

// // Event listener for file input
// document.getElementById("fileInput").addEventListener("change", handleFile);

// // Handle file upload and graph initialization
// function handleFile(event) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       graphData = JSON.parse(e.target.result);

//       // Apply layout and draw initial graph
//       applyForceDirectedLayout(graphData);
//       drawGraph(graphData);

//       // Prepare Dijkstra visualization starting from first node
//       const startNode = graphData.nodes[0].id;
//       const graph = convertToAdjacencyList(graphData);
//       const dijkstraResult = dijkstra(graph, startNode);
//       dijkstraSteps = dijkstraResult.steps;
//       currentStep = 0;

//       // Show step controls
//       document.getElementById("stepControls").style.display = "block";

//       // Add event listeners for step controls
//       document
//         .getElementById("nextStepBtn")
//         .addEventListener("click", visualizeNextStep);
//       document
//         .getElementById("resetBtn")
//         .addEventListener("click", resetVisualization);
//     };
//     reader.readAsText(file);
//   }
// }

// // Convert graph data to adjacency list format for Dijkstra
// function convertToAdjacencyList(data) {
//   const graph = {};
//   data.nodes.forEach((node) => {
//     graph[node.id] = {};
//   });

//   data.edges.forEach((edge) => {
//     graph[edge.source][edge.target] = edge.weight;
//     // If undirected graph, add reverse edge
//     graph[edge.target][edge.source] = edge.weight;
//   });

//   return graph;
// }

// // Visualize next step of Dijkstra's algorithm
// function visualizeNextStep() {
//   if (currentStep >= dijkstraSteps.length) {
//     alert("Algorithm visualization complete!");
//     return;
//   }

//   // Reset all nodes and edges
//   resetNodeStyles();

//   const currentStepData = dijkstraSteps[currentStep];

//   // Highlight current node in green
//   const currentNodeElement = document.querySelector(
//     `circle[data-node="${currentStepData.node}"]`
//   );
//   currentNodeElement.style.fill = "green";

//   // Highlight previous node (source) that led to current node
//   if (currentStepData.previous) {
//     const previousNodeElement = document.querySelector(
//       `circle[data-node="${currentStepData.previous}"]`
//     );
//     if (previousNodeElement) previousNodeElement.style.fill = "orange";
//   }

//   // Highlight connecting edge in purple
//   if (currentStepData.previous) {
//     const edgeElement = document.querySelector(
//       `line[data-source="${currentStepData.previous}"][data-target="${currentStepData.node}"], line[data-source="${currentStepData.node}"][data-target="${currentStepData.previous}"]`
//     );
//     if (edgeElement) {
//       edgeElement.style.stroke = "purple";
//       edgeElement.style.strokeWidth = "4px";
//     }
//   }

//   // Update distance text
//   const distanceTextElement = document.querySelector(
//     `text.distance[data-node="${currentStepData.node}"]`
//   );
//   distanceTextElement.textContent = currentStepData.distance.toFixed(2);

//   currentStep++;
// }

// // Reset node and edge styles
// function resetNodeStyles() {
//   document.querySelectorAll(".node").forEach((node) => {
//     node.style.fill = "lightblue";
//   });

//   document.querySelectorAll(".edge").forEach((edge) => {
//     edge.style.stroke = "black";
//     edge.style.strokeWidth = "2px";
//   });
// }

// // Reset visualization
// function resetVisualization() {
//   currentStep = 0;
//   resetNodeStyles();

//   // Reset distance texts
//   document.querySelectorAll(".distance").forEach((distanceText) => {
//     distanceText.textContent = "∞";
//   });
// }

// // Apply force-directed layout (existing implementation)
// function applyForceDirectedLayout(data) {
//   const width = 800;
//   const height = 600;
//   const k = Math.sqrt((width * height) / data.nodes.length);
//   const iterations = 500;

//   // Initial random positions
//   data.nodes.forEach((node) => {
//     node.x = Math.random() * width;
//     node.y = Math.random() * height;
//   });

//   // Update positions based on forces
//   for (let iter = 0; iter < iterations; iter++) {
//     data.nodes.forEach((nodeA) => {
//       nodeA.vx = 0;
//       nodeA.vy = 0;
//       data.nodes.forEach((nodeB) => {
//         if (nodeA !== nodeB) {
//           const dx = nodeA.x - nodeB.x;
//           const dy = nodeA.y - nodeB.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
//           if (distance > 0) {
//             const force = (k * k) / distance;
//             nodeA.vx += (dx / distance) * force;
//             nodeA.vy += (dy / distance) * force;
//           }
//         }
//       });
//     });

//     // Attraction forces
//     data.edges.forEach((edge) => {
//       const source = data.nodes.find((node) => node.id === edge.source);
//       const target = data.nodes.find((node) => node.id === edge.target);
//       const dx = target.x - source.x;
//       const dy = target.y - source.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);
//       const force = (distance * distance) / k;
//       const fx = (dx / distance) * force;
//       const fy = (dy / distance) * force;
//       source.vx += fx;
//       source.vy += fy;
//       target.vx -= fx;
//       target.vy -= fy;
//     });

//     // Update positions
//     data.nodes.forEach((node) => {
//       node.x += node.vx * 0.1;
//       node.y += node.vy * 0.1;

//       // Keep nodes within graph boundaries
//       node.x = Math.max(20, Math.min(width - 20, node.x));
//       node.y = Math.max(20, Math.min(height - 20, node.y));
//     });
//   }
// }

// // Draw graph on SVG
// function drawGraph(data) {
//   const svg = document.getElementById("graphCanvas");
//   const svgWidth = svg.clientWidth || 800;
//   const svgHeight = svg.clientHeight || 600;
//   svg.innerHTML = ""; // Clear previous content

//   // Draw edges
//   data.edges.forEach((edge) => {
//     const source = data.nodes.find((node) => node.id === edge.source);
//     const target = data.nodes.find((node) => node.id === edge.target);

//     // Draw line
//     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", source.x);
//     line.setAttribute("y1", source.y);
//     line.setAttribute("x2", target.x);
//     line.setAttribute("y2", target.y);
//     line.setAttribute("data-source", edge.source);
//     line.setAttribute("data-target", edge.target);
//     line.classList.add("edge");
//     svg.appendChild(line);

//     // Draw weight text
//     const weightText = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "text"
//     );
//     const midX = (source.x + target.x) / 2;
//     const midY = (source.y + target.y) / 2;

//     const dx = target.x - source.x;
//     const dy = target.y - source.y;
//     const length = Math.sqrt(dx * dx + dy * dy);
//     const offsetDistance = 12;

//     const normalX = (-dy / length) * offsetDistance;
//     const normalY = (dx / length) * offsetDistance;

//     weightText.setAttribute("x", midX + normalX);
//     weightText.setAttribute("y", midY + normalY);
//     weightText.setAttribute("text-anchor", "middle");
//     weightText.setAttribute("class", "weight");
//     weightText.textContent = edge.weight;
//     svg.appendChild(weightText);
//   });

//   // Draw nodes
//   data.nodes.forEach((node) => {
//     // Draw circle
//     const circle = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "circle"
//     );
//     circle.setAttribute("cx", node.x);
//     circle.setAttribute("cy", node.y);
//     circle.setAttribute("r", 20);
//     circle.setAttribute("data-node", node.id);
//     circle.classList.add("node");
//     svg.appendChild(circle);

//     // Draw distance text
//     const distanceText = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "text"
//     );
//     distanceText.setAttribute("x", node.x);
//     distanceText.setAttribute("y", node.y + 5);
//     distanceText.setAttribute("text-anchor", "middle");
//     distanceText.setAttribute("class", "distance");
//     distanceText.setAttribute("data-node", node.id);
//     distanceText.textContent = "∞";
//     svg.appendChild(distanceText);

//     // Draw node label
//     const labelText = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "text"
//     );
//     const labelOffsetX = 30;
//     const labelOffsetY = 30;

//     let adjustedX = node.x + labelOffsetX;
//     let adjustedY = node.y - labelOffsetY;

//     adjustedX = Math.max(
//       labelOffsetX,
//       Math.min(adjustedX, svgWidth - labelOffsetX)
//     );
//     adjustedY = Math.max(
//       labelOffsetY,
//       Math.min(adjustedY, svgHeight - labelOffsetY)
//     );

//     labelText.setAttribute("x", adjustedX);
//     labelText.setAttribute("y", adjustedY);
//     labelText.setAttribute("text-anchor", "middle");
//     labelText.setAttribute("class", "label");
//     labelText.textContent = node.id;
//     svg.appendChild(labelText);
//   });
// }

// // Dijkstra's algorithm implementation
// function dijkstra(graph, startNode) {
//   const distances = {};
//   const previousNodes = {};
//   const unvisitedNodes = new Set();

//   // Initialize distances
//   for (const node in graph) {
//     distances[node] = Infinity;
//     previousNodes[node] = null;
//     unvisitedNodes.add(node);
//   }
//   distances[startNode] = 0;

//   const steps = []; // Store steps

//   while (unvisitedNodes.size > 0) {
//     // Find nearest unvisited node
//     let currentNode = null;
//     for (const node of unvisitedNodes) {
//       if (currentNode === null || distances[node] < distances[currentNode]) {
//         currentNode = node;
//       }
//     }

//     if (distances[currentNode] === Infinity) break;

//     // Update distances to neighboring nodes
//     for (const [neighbor, weight] of Object.entries(graph[currentNode])) {
//       const newDist = distances[currentNode] + weight;
//       if (newDist < distances[neighbor]) {
//         distances[neighbor] = newDist;
//         previousNodes[neighbor] = currentNode;
//         // Save current state
//         steps.push({
//           node: neighbor,
//           distance: newDist,
//           previous: currentNode,
//         });
//       }
//     }

//     // Mark node as visited
//     unvisitedNodes.delete(currentNode);
//   }

//   return { distances, previousNodes, steps };
// }

// Global variables to manage visualization state
let currentStep = 0;
let dijkstraSteps = [];
let graphData = null;
let startNodeSelect = null;
let animationInterval = null;

// Initialize start node selection on page load
document.addEventListener("DOMContentLoaded", () => {
  startNodeSelect = document.createElement("select");
  startNodeSelect.id = "startNodeSelect";
  document
    .querySelector(".controls")
    .insertBefore(startNodeSelect, document.getElementById("fileInput"));

  // Add play button
  const playButton = document.createElement("button");
  playButton.textContent = "Play Visualization";
  playButton.id = "playVisualizationBtn";
  playButton.style.display = "none";
  startNodeSelect.after(playButton);
});

// Event listener for file input
document.getElementById("fileInput").addEventListener("change", handleFile);

// Handle file upload and graph initialization
function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      graphData = JSON.parse(e.target.result);

      // Apply layout and draw initial graph
      applyForceDirectedLayout(graphData);
      drawGraph(graphData);

      // Populate start node selection
      populateStartNodeSelect();
    };
    reader.readAsText(file);
  }
}

// Populate start node selection dropdown
function populateStartNodeSelect() {
  const select = document.getElementById("startNodeSelect");
  select.innerHTML = ""; // Clear previous options

  // Add start node options
  graphData.nodes.forEach((node) => {
    const option = document.createElement("option");
    option.value = node.id;
    option.textContent = `Start from ${node.id}`;
    select.appendChild(option);
  });

  // Show play visualization button
  const playButton = document.getElementById("playVisualizationBtn");
  playButton.style.display = "inline-block";
  playButton.addEventListener("click", startAutomaticVisualization);
}

// Start automatic visualization
function startAutomaticVisualization() {
  const startNode = document.getElementById("startNodeSelect").value;

  // Prepare Dijkstra visualization
  const graph = convertToAdjacencyList(graphData);
  const dijkstraResult = dijkstra(graph, startNode);
  dijkstraSteps = dijkstraResult.steps;
  currentStep = 0;

  // Reset visualization first
  resetVisualization();

  // Add initial step for start node
  dijkstraSteps.unshift({
    node: startNode,
    distance: 0,
    previous: null,
    type: "start",
  });

  // Start automatic step-by-step visualization
  animationInterval = setInterval(visualizeNextStep, 3000);

  // Disable play button during visualization
  document.getElementById("playVisualizationBtn").disabled = true;
}

// Run Dijkstra visualization
function runDijkstraVisualization() {
  const startNode = document.getElementById("startNodeSelect").value;

  // Prepare Dijkstra visualization
  const graph = convertToAdjacencyList(graphData);
  const dijkstraResult = dijkstra(graph, startNode);
  dijkstraSteps = dijkstraResult.steps;
  currentStep = 0;

  // Show step controls
  document.getElementById("stepControls").style.display = "block";

  // Add event listeners for step controls
  document
    .getElementById("nextStepBtn")
    .addEventListener("click", visualizeNextStep);
  document
    .getElementById("resetBtn")
    .addEventListener("click", resetVisualization);
}

// Convert graph data to adjacency list format for Dijkstra
function convertToAdjacencyList(data) {
  const graph = {};
  data.nodes.forEach((node) => {
    graph[node.id] = {};
  });

  data.edges.forEach((edge) => {
    graph[edge.source][edge.target] = edge.weight;
    // If undirected graph, add reverse edge
    graph[edge.target][edge.source] = edge.weight;
  });

  return graph;
}

// Visualize next step of Dijkstra's algorithm
function visualizeNextStep() {
  if (currentStep >= dijkstraSteps.length) {
    clearInterval(animationInterval);
    document.getElementById("playVisualizationBtn").disabled = false;
    alert("Algorithm visualization complete!");
    return;
  }

  // Reset all nodes and edges
  resetNodeStyles();

  const currentStepData = dijkstraSteps[currentStep];

  // Special handling for start node
  if (currentStepData.type === "start") {
    // Highlight start node in green
    const startNodeElement = document.querySelector(
      `circle[data-node="${currentStepData.node}"]`
    );
    startNodeElement.style.fill = "green";

    // Update distance text for start node
    const distanceTextElement = document.querySelector(
      `text.distance[data-node="${currentStepData.node}"]`
    );
    distanceTextElement.textContent = "0";
  } else {
    // Find all neighbors of the current node in the original graph
    const neighbors = findNeighbors(currentStepData.node);

    // Highlight current node in green
    const currentNodeElement = document.querySelector(
      `circle[data-node="${currentStepData.node}"]`
    );
    currentNodeElement.style.fill = "green";

    // Highlight path from previous node if exists
    if (currentStepData.previous) {
      const previousEdge = document.querySelector(
        `line[data-source="${currentStepData.previous}"][data-target="${currentStepData.node}"], line[data-source="${currentStepData.node}"][data-target="${currentStepData.previous}"]`
      );
      if (previousEdge) {
        previousEdge.style.stroke = "purple";
        previousEdge.style.strokeWidth = "4px";
      }
    }

    // Highlight all neighboring nodes in yellow
    neighbors.forEach((neighborId) => {
      const neighborNodeElement = document.querySelector(
        `circle[data-node="${neighborId}"]`
      );
      if (neighborNodeElement) {
        neighborNodeElement.style.fill = "yellow";
      }
    });

    // Update distance text
    const distanceTextElement = document.querySelector(
      `text.distance[data-node="${currentStepData.node}"]`
    );
    distanceTextElement.textContent =
      currentStepData.distance === Infinity
        ? "∞"
        : currentStepData.distance.toFixed(2);
  }

  currentStep++;
}

// Find neighbors of a node in the graph
function findNeighbors(nodeId) {
  return graphData.edges
    .filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .map((edge) => (edge.source === nodeId ? edge.target : edge.source));
}

// Reset node and edge styles
function resetNodeStyles() {
  document.querySelectorAll(".node").forEach((node) => {
    node.style.fill = "lightblue";
  });

  document.querySelectorAll(".edge").forEach((edge) => {
    edge.style.stroke = "black";
    edge.style.strokeWidth = "2px";
  });
}

// Reset visualization
function resetVisualization() {
  currentStep = 0;
  resetNodeStyles();

  // Reset distance texts
  document.querySelectorAll(".distance").forEach((distanceText) => {
    distanceText.textContent = "∞";
  });
}

// Apply force-directed layout (existing implementation)
function applyForceDirectedLayout(data) {
  const width = 800;
  const height = 600;
  const k = Math.sqrt((width * height) / data.nodes.length);
  const iterations = 500;

  // Initial random positions
  data.nodes.forEach((node) => {
    node.x = Math.random() * width;
    node.y = Math.random() * height;
  });

  // Update positions based on forces
  for (let iter = 0; iter < iterations; iter++) {
    data.nodes.forEach((nodeA) => {
      nodeA.vx = 0;
      nodeA.vy = 0;
      data.nodes.forEach((nodeB) => {
        if (nodeA !== nodeB) {
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0) {
            const force = (k * k) / distance;
            nodeA.vx += (dx / distance) * force;
            nodeA.vy += (dy / distance) * force;
          }
        }
      });
    });

    // Attraction forces
    data.edges.forEach((edge) => {
      const source = data.nodes.find((node) => node.id === edge.source);
      const target = data.nodes.find((node) => node.id === edge.target);
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = (distance * distance) / k;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    });

    // Update positions
    data.nodes.forEach((node) => {
      node.x += node.vx * 0.1;
      node.y += node.vy * 0.1;

      // Keep nodes within graph boundaries
      node.x = Math.max(20, Math.min(width - 20, node.x));
      node.y = Math.max(20, Math.min(height - 20, node.y));
    });
  }
}

// Draw graph on SVG
function drawGraph(data) {
  const svg = document.getElementById("graphCanvas");
  const svgWidth = svg.clientWidth || 800;
  const svgHeight = svg.clientHeight || 600;
  svg.innerHTML = ""; // Clear previous content

  // Draw edges
  data.edges.forEach((edge) => {
    const source = data.nodes.find((node) => node.id === edge.source);
    const target = data.nodes.find((node) => node.id === edge.target);

    // Draw line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", source.x);
    line.setAttribute("y1", source.y);
    line.setAttribute("x2", target.x);
    line.setAttribute("y2", target.y);
    line.setAttribute("data-source", edge.source);
    line.setAttribute("data-target", edge.target);
    line.classList.add("edge");
    svg.appendChild(line);

    // Draw weight text
    const weightText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const offsetDistance = 12;

    const normalX = (-dy / length) * offsetDistance;
    const normalY = (dx / length) * offsetDistance;

    weightText.setAttribute("x", midX + normalX);
    weightText.setAttribute("y", midY + normalY);
    weightText.setAttribute("text-anchor", "middle");
    weightText.setAttribute("class", "weight");
    weightText.textContent = edge.weight;
    svg.appendChild(weightText);
  });

  // Draw nodes
  data.nodes.forEach((node) => {
    // Draw circle
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 20);
    circle.setAttribute("data-node", node.id);
    circle.classList.add("node");
    svg.appendChild(circle);

    // Draw distance text
    const distanceText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    distanceText.setAttribute("x", node.x);
    distanceText.setAttribute("y", node.y + 5);
    distanceText.setAttribute("text-anchor", "middle");
    distanceText.setAttribute("class", "distance");
    distanceText.setAttribute("data-node", node.id);
    distanceText.textContent = "∞";
    svg.appendChild(distanceText);

    // Draw node label
    const labelText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const labelOffsetX = 30;
    const labelOffsetY = 30;

    let adjustedX = node.x + labelOffsetX;
    let adjustedY = node.y - labelOffsetY;

    adjustedX = Math.max(
      labelOffsetX,
      Math.min(adjustedX, svgWidth - labelOffsetX)
    );
    adjustedY = Math.max(
      labelOffsetY,
      Math.min(adjustedY, svgHeight - labelOffsetY)
    );

    labelText.setAttribute("x", adjustedX);
    labelText.setAttribute("y", adjustedY);
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("class", "label");
    labelText.textContent = node.id;
    svg.appendChild(labelText);
  });
}

// Dijkstra's algorithm implementation
function dijkstra(graph, startNode) {
  const distances = {};
  const previousNodes = {};
  const unvisitedNodes = new Set();

  // Initialize distances
  for (const node in graph) {
    distances[node] = Infinity;
    previousNodes[node] = null;
    unvisitedNodes.add(node);
  }
  distances[startNode] = 0; // Set start node distance to 0

  const steps = []; // Store steps

  while (unvisitedNodes.size > 0) {
    // Find nearest unvisited node
    let currentNode = null;
    for (const node of unvisitedNodes) {
      if (currentNode === null || distances[node] < distances[currentNode]) {
        currentNode = node;
      }
    }

    if (currentNode === null || distances[currentNode] === Infinity) break;

    // Update distances to neighboring nodes
    const neighbors = Object.entries(graph[currentNode]);
    for (const [neighbor, weight] of neighbors) {
      if (unvisitedNodes.has(neighbor)) {
        const newDist = distances[currentNode] + weight;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previousNodes[neighbor] = currentNode;
          // Save current state
          steps.push({
            node: neighbor,
            distance: newDist,
            previous: currentNode,
          });
        }
      }
    }

    // Mark node as visited
    unvisitedNodes.delete(currentNode);
  }

  return { distances, previousNodes, steps };
}

// Rest of the code remains the same (applyForceDirectedLayout, drawGraph functions)
