// Các biến toàn cục để quản lý trạng thái trực quan hóa
let currentStep = 0;
let dijkstraSteps = [];
let graphData = null;
let startNodeSelect = null;
let animationInterval = null;
let startNode = null;

// Khởi tạo lựa chọn đỉnh bắt đầu khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  startNodeSelect = document.createElement("select");
  startNodeSelect.id = "startNodeSelect";
  document
    .querySelector(".controls")
    .insertBefore(startNodeSelect, document.getElementById("fileInput"));

  // Thêm nút "Play"
  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.id = "playVisualizationBtn";
  playButton.style.display = "none";
  startNodeSelect.after(playButton);
});

// Lắng nghe sự kiện thay đổi file
document.getElementById("fileInput").addEventListener("change", handleFile);

// Xử lý việc tải file và khởi tạo đồ thị
function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      graphData = JSON.parse(e.target.result);

      // Áp dụng bố cục và vẽ đồ thị ban đầu
      applyForceDirectedLayout(graphData);
      drawGraph(graphData);

      // Tạo danh sách lựa chọn đỉnh bắt đầu
      populateStartNodeSelect();
    };
    reader.readAsText(file);
  }
}

// Tạo danh sách lựa chọn đỉnh bắt đầu
function populateStartNodeSelect() {
  const select = document.getElementById("startNodeSelect");
  select.innerHTML = ""; // Xóa các tùy chọn trước đó

  // Thêm các tùy chọn đỉnh bắt đầu
  graphData.nodes.forEach((node) => {
    const option = document.createElement("option");
    option.value = node.id;
    option.textContent = `Bắt đầu từ ${node.id}`;
    select.appendChild(option);
  });

  // Hiển thị nút chạy
  const playButton = document.getElementById("playVisualizationBtn");
  playButton.style.display = "inline-block";
  playButton.addEventListener("click", startAutomaticVisualization);
}

// Chuyển đổi dữ liệu đồ thị sang dạng danh sách kề để sử dụng với thuật toán Dijkstra
function convertToAdjacencyList(data) {
  const graph = {};
  data.nodes.forEach((node) => {
    graph[node.id] = {};
  });

  data.edges.forEach((edge) => {
    graph[edge.source][edge.target] = edge.weight;
    // Nếu là đồ thị vô hướng, thêm cạnh ngược
    graph[edge.target][edge.source] = edge.weight;
  });

  return graph;
}

// Bắt đầu trực quan hóa tự động
function startAutomaticVisualization() {
  startNode = document.getElementById("startNodeSelect").value;

  // Chuẩn bị dữ liệu để trực quan hóa Dijkstra
  const graph = convertToAdjacencyList(graphData);
  const dijkstraResult = dijkstra(graph, startNode);
  dijkstraSteps = dijkstraResult.steps;
  currentStep = 0;

  // Đặt lại trực quan hóa ban đầu
  resetVisualization();

  // Thêm bước ban đầu cho đỉnh bắt đầu
  const startNodeDistanceElement = document.querySelector(
    `text.distance[data-node="${startNode}"]`
  );
  startNodeDistanceElement.textContent = "0";
  const startNodeElement = document.querySelector(
    `circle[data-node="${startNode}"]`
  );
  startNodeElement.classList.add("start");
  startNodeElement.style.fill = "lightgreen";

  // Bắt đầu trực quan hóa từng bước tự động
  animationInterval = setInterval(visualizeNextStep, 2000);

  // Vô hiệu hóa nút "Play" trong khi đang trực quan hóa
  document.getElementById("playVisualizationBtn").disabled = true;
}

// Trực quan hóa bước tiếp theo của thuật toán Dijkstra
function visualizeNextStep() {
  if (currentStep >= dijkstraSteps.length) {
    clearInterval(animationInterval);
    document.getElementById("playVisualizationBtn").disabled = false;
    alert("Hoàn thành trực quan hóa thuật toán!");
    return;
  }

  // Đặt lại tất cả các đỉnh và cạnh
  resetNodeStyles();

  const currentStepData = dijkstraSteps[currentStep];

  // Tô màu đỉnh đang xử lý hiện tại bằng màu đỏ
  const currentNodeElement = document.querySelector(
    `circle[data-node="${currentStepData.node}"]`
  );
  if (currentNodeElement) {
    currentNodeElement.style.fill = "tomato";
    currentNodeElement.classList.add("current"); // Đánh dấu đỉnh hiện tại
  }

  // Tìm các đỉnh lân cận và tô màu
  const neighbors = findNeighbors(currentStepData.previous).filter(
    (neighborId) => neighborId !== startNode
  );

  neighbors.forEach((neighborId) => {
    const neighborNodeElement = document.querySelector(
      `circle[data-node="${neighborId}"]`
    );
    if (neighborNodeElement) {
      neighborNodeElement.style.fill = "gold";
    }

    const edgeElement = document.querySelector(
      `line[data-source="${currentStepData.previous}"][data-target="${neighborId}"], line[data-source="${neighborId}"][data-target="${currentStepData.previous}"]`
    );
    if (edgeElement) {
      edgeElement.style.stroke = "purple";
      edgeElement.style.strokeWidth = "4px";
    }
  });

  // Cập nhật giá trị khoảng cách cho đỉnh hiện tại
  const distanceTextElement = document.querySelector(
    `text.distance[data-node="${currentStepData.node}"]`
  );
  if (distanceTextElement) {
    distanceTextElement.textContent =
      currentStepData.distance === Infinity
        ? "∞"
        : currentStepData.distance.toFixed(2);
  }

  currentStep++;
}

// Đặt lại trực quan hóa
function resetVisualization() {
  currentStep = 0;
  resetNodeStyles();

  // Đặt lại văn bản hiển thị khoảng cách
  document.querySelectorAll(".distance").forEach((distanceText) => {
    distanceText.textContent = "∞";
  });
}

// Đặt lại kiểu dáng của các đỉnh và cạnh
function resetNodeStyles() {
  // document.querySelectorAll(".node").forEach((node) => {
  //   if (!node.classList.contains("current")) {
  //     node.style.fill = "lightblue";
  //   }
  // });
  document.querySelectorAll(".node").forEach((node) => {
    node.style.fill = "lightblue";
  });

  document.querySelectorAll(".edge").forEach((edge) => {
    edge.style.stroke = "black";
    edge.style.strokeWidth = "3px";
  });
}

// Tìm các đỉnh lân cận của một đỉnh trong đồ thị
function findNeighbors(nodeId) {
  return graphData.edges
    .filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .map((edge) => (edge.source === nodeId ? edge.target : edge.source));
}

// Vẽ đồ thị trên SVG
function drawGraph(data) {
  const svg = document.getElementById("graphCanvas");
  const svgWidth = svg.clientWidth || 800;
  const svgHeight = svg.clientHeight || 600;
  svg.innerHTML = ""; // Xóa nội dung trước đó

  // Vẽ các cạnh
  data.edges.forEach((edge) => {
    const source = data.nodes.find((node) => node.id === edge.source);
    const target = data.nodes.find((node) => node.id === edge.target);

    // Vẽ đường thẳng
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", source.x);
    line.setAttribute("y1", source.y);
    line.setAttribute("x2", target.x);
    line.setAttribute("y2", target.y);
    line.setAttribute("data-source", edge.source);
    line.setAttribute("data-target", edge.target);
    line.classList.add("edge");
    svg.appendChild(line);

    // Vẽ trọng số của cạnh
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

  // Vẽ các đỉnh
  data.nodes.forEach((node) => {
    // Vẽ hình tròn cho đỉnh
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

    // Vẽ khoảng cách từ đỉnh
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

    // Vẽ nhãn cho đỉnh
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

// Áp dụng bố cục dựa trên lực
function applyForceDirectedLayout(data) {
  const width = 800;
  const height = 600;
  const k = Math.sqrt((width * height) / data.nodes.length);
  const iterations = 500;

  // Gán vị trí ngẫu nhiên ban đầu
  data.nodes.forEach((node) => {
    node.x = Math.random() * width;
    node.y = Math.random() * height;
  });

  // Cập nhật vị trí dựa trên các lực tác động
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

    // Lực hút giữa các đỉnh
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

    // Cập nhật vị trí của các đỉnh
    data.nodes.forEach((node) => {
      node.x += node.vx * 0.1;
      node.y += node.vy * 0.1;

      // Đảm bảo các đỉnh nằm trong giới hạn đồ thị
      node.x = Math.max(20, Math.min(width - 20, node.x));
      node.y = Math.max(20, Math.min(height - 20, node.y));
    });
  }
}

// Triển khai thuật toán Dijkstra
function dijkstra(graph, startNode) {
  const distances = {};
  const previousNodes = {};
  const unvisitedNodes = new Set();

  // Khởi tạo khoảng cách
  for (const node in graph) {
    distances[node] = Infinity;
    previousNodes[node] = null;
    unvisitedNodes.add(node);
  }
  distances[startNode] = 0; // Thiết lập khoảng cách từ nút bắt đầu là 0

  const steps = []; // Lưu các bước thực hiện

  while (unvisitedNodes.size > 0) {
    // Tìm nút gần nhất chưa được thăm
    let currentNode = null;
    for (const node of unvisitedNodes) {
      if (currentNode === null || distances[node] < distances[currentNode]) {
        currentNode = node;
      }
    }

    if (currentNode === null || distances[currentNode] === Infinity) break;

    // Cập nhật khoảng cách đến các nút lân cận
    const neighbors = Object.entries(graph[currentNode]);
    for (const [neighbor, weight] of neighbors) {
      if (unvisitedNodes.has(neighbor)) {
        const newDist = distances[currentNode] + weight;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previousNodes[neighbor] = currentNode;
          // Lưu trạng thái hiện tại
          steps.push({
            node: neighbor,
            distance: newDist,
            previous: currentNode,
          });
        }
      }
    }

    // Đánh dấu nút đã được thăm
    unvisitedNodes.delete(currentNode);
  }

  return { distances, previousNodes, steps };
}
