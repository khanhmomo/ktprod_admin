export const generateReport = (
  tasks: any[],
  allUsers: any[],
  selectedMonth: string,
  selectedYear: string,
  selectedUser: string
) => {
  // Filter tasks based on selected user, month, and year
  const filterTasks = (tasks: any[], userId: string, month: string, year: string) => {
    let filtered = tasks;

    if (userId !== "all") {
      filtered = filtered.filter((task) => task.user === userId);
    }

    filtered = filtered.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const taskMonth = taskDate.getMonth() + 1; // Months are 0-based in JS Date
      const taskYear = taskDate.getFullYear().toString();
      return (
        (month === "all" || taskMonth === parseInt(month)) &&
        (year === "all" || taskYear === year)
      );
    });

    return filtered;
  };

  const tasksForMonth = filterTasks(tasks, selectedUser, selectedMonth, selectedYear);

  if (tasksForMonth.length === 0) {
    alert("No tasks for this selection!");
    return;
  }

  // Determine the report title based on selected filters
  let reportTitle = "General Task Report"; // Default title
  if (selectedYear !== "all" && selectedMonth === "all") {
    reportTitle = `Task Report of ${selectedYear}`;
  } else if (selectedYear !== "all" && selectedMonth !== "all") {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    reportTitle = `Tasks Report for ${monthNames[parseInt(selectedMonth) - 1]} ${selectedYear}`;
  }

  const reportWindow = window.open('', '', 'width=800,height=600');
  const reportContent = `
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1, h2 {
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
          td {
            text-align: center;
          }
          .status-completed {
            color: green;
          }
          .status-not-completed {
            color: red;
          }
          .print-button {
            margin-top: 20px;
            display: block;
            text-align: center;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
          }
          .print-button:hover {
            background-color: #45a049;
          }
          /* Logo Positioning */
          .logo {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 120px;
            height: auto;
          }
        </style>
      </head>
      <body>
        <img src="/Trans_logo.png" alt="Trans Logo" class="logo">
        <h1>${reportTitle}</h1>
        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tasksForMonth.map((task) => {
              const taskUser = allUsers.find((u) => u._id === task.user);
              const userName = taskUser ? taskUser.name : "Unknown User";
              return ` 
                <tr>
                  <td>${task.title}</td>
                  <td>${task.description}</td>
                  <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</td>
                  <td>${userName}</td>
                  <td class="${task.completed ? 'status-completed' : 'status-not-completed'}">
                    ${task.completed ? "Completed" : "Not Completed"}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <button class="print-button" onclick="window.print()">Print Report</button>
      </body>
    </html>
  `;
  
  // Write the report content into the new window
  reportWindow?.document.write(reportContent);
};
