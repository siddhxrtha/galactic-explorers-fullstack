document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken();
  
  let totalPlanets = 0;
  let exploredPlanets = 0;
  let totalChallenges = 0;
  let completedChallenges = 0;

  ////////////////////////////////
  // Fetch Total Planets for Exploration Progress
  ////////////////////////////////
  fetchMethod(
      `${currentUrl}/api/explore`,
      function (status, data) {
          if (status === 200 && Array.isArray(data)) {
              totalPlanets = data.length;
              fetchUserExploredPlanets();
          } else {
              console.error("Failed to fetch total planets.");
          }
      },
      "GET"
  );

  ////////////////////////////////
  // Fetch User's Explored Planets
  ////////////////////////////////
  function fetchUserExploredPlanets() {
      fetchMethod(
          `${currentUrl}/api/explore/${userId}`,
          function (status, data) {
              if (status === 200 && Array.isArray(data)) {
                  exploredPlanets = data.length;
              }
              fetchTotalChallenges(); // Proceed to fetch challenges next
          },
          "GET"
      );
  }

  ////////////////////////////////
  // Fetch Total Challenges for Fitness Progress
  ////////////////////////////////
  function fetchTotalChallenges() {
      fetchMethod(
          `${currentUrl}/api/challenges`,
          function (status, data) {
              if (status === 200 && Array.isArray(data)) {
                  totalChallenges = data.length;
                  fetchCompletedChallenges();
              } else {
                  console.error("Failed to fetch total challenges.");
              }
          },
          "GET"
      );
  }

  ////////////////////////////////
  // Fetch Completed Challenges
  ////////////////////////////////
  function fetchCompletedChallenges() {
    fetchMethod(
        `${currentUrl}/api/challenges/user/${userId}`, 
        function (status, data) {
            if (status === 200 && data.completedChallenges !== undefined) {
                completedChallenges = data.completedChallenges; 
            } else {
                console.error("Failed to fetch completed challenges.");
                completedChallenges = 0; 
            }
            renderCharts();
        },
        "GET"
    );
}


  ////////////////////////////////
  // Render Exploration & Fitness Charts
  ////////////////////////////////
  function renderCharts() {
      renderDoughnutChart("explorationChart", "Exploration Progress", ["Explored", "Remaining"], 
                          [exploredPlanets, totalPlanets - exploredPlanets], 
                          ["rgba(42, 245, 109, 0.6)", "rgb(143, 42, 245)"]);

      renderDoughnutChart("fitnessChart", "Fitness Challenges", ["Completed", "Remaining"], 
                          [completedChallenges, totalChallenges - completedChallenges], 
                          ["rgba(245, 165, 42, 0.6)", "rgb(143, 42, 245)"]);
  }

  ////////////////////////////////
  // General Doughnut Chart Renderer
  ////////////////////////////////
  function renderDoughnutChart(chartId, title, labels, data, colors) {
      new Chart(document.getElementById(chartId), {
          type: "doughnut",
          data: {
              labels: labels,
              datasets: [
                  {
                      data: data,
                      backgroundColor: colors,
                      hoverBackgroundColor: colors.map(c => c.replace("0.6", "0.9")),
                      borderColor: colors.map(c => c.replace("0.6", "1")),
                      borderWidth: 2,
                      hoverOffset: 10,
                  },
              ],
          },
          options: {
              responsive: true,
              aspectRatio: 1.3,
              layout: {
                  padding: {
                      bottom: 20,
                  },
              },
              plugins: {
                  legend: {
                      position: "bottom",
                      labels: {
                          color: "#fff",
                          font: { 
                              size: 14, 
                              weight: "bold", 
                              family: "Poppins" 
                          },
                          padding: 20, 
                      },
                  },
                  tooltip: {
                      callbacks: {
                          label: function (tooltipItem) {
                              return `${tooltipItem.label}: ${tooltipItem.raw}`;
                          },
                      },
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      titleFont: { size: 14, weight: "bold", family: "Poppins" },
                      bodyFont: { size: 13, family: "Poppins" },
                      padding: 10,
                  },
              },
              animation: {
                  animateScale: true,
                  animateRotate: true,
              },
          },
      });
  }
});
