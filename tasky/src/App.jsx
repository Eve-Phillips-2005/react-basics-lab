import AddTaskForm from './components/Form';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react'; // Import useEffect for saving state to browser
import './App.css';
import Task from './components/Task';

// Better colour consistency as well. Probably better long-term for a rainbow system as tasks will be constantly added or deleted
const taskColors = [
  "#ffaaa5", // Coral
  "#ffb7c5", // Pink
  "#ffc875", // Peach
  "#ffe07a", // Yellow
  "#a8df9b", // Green
  "#7dd3a8", // Mint
  "#7dd6d8", // Teal
  "#8ec5f5", // Blue
  "#b49bea"  // Lavender
];

const chooseColorIndex = (tasks) => {

  // Count how many tasks use each colour
  const colorCounts = taskColors.map((_, index) =>
    tasks.filter((task) => task.colorIndex === index).length
  );

  // Find the lowest usage count
  const lowestCount = Math.min(...colorCounts);

  // Prefer the next colour after the most recently added task
  const lastColor = tasks.length > 0
    ? tasks[tasks.length - 1].colorIndex
    : -1;

  // Find the next colour that is currently used the least
  for (let step = 1; step <= taskColors.length; step++) {

    const index = (lastColor + step) % taskColors.length;

    if (colorCounts[index] === lowestCount) {
      return index;
    }
  }

  return 0;
};

const getTaskColor = (task) => {
  const index = typeof task.id === "number"
    ? task.id - 1
    : [...String(task.id)].reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0
    );

  return taskColors[index % taskColors.length];
};

// Date functions for consistency, rather than something vague like "Next week", etc. being random placeholders
// Will vary depending on urgency, though. If it's due today, it should be "Today", if it's due tomorrow, it should be "Tomorrow", etc. Otherwise, it should be a specific date
const dateOffset = (days) => {
  const date = new Date();

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDeadline = (deadline) => {
  if (deadline === dateOffset(0)) {
    return "Today";
  }

  if (deadline === dateOffset(1)) {
    return "Tomorrow";
  }

  const [year, month, day] = deadline.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

function App() {

  const [tasks, setTasks] = useState(() => {

    // Try to load previously saved tasks
    try {
      const savedTasks = localStorage.getItem("tasky-tasks");

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          return parsedTasks.map((task, index) => ({
            ...task,
            colorIndex:
              Number.isInteger(task.colorIndex) &&
                task.colorIndex >= 0 &&
                task.colorIndex < taskColors.length
                ? task.colorIndex
                : index % taskColors.length
          }));
        }
      }
    }
    catch (error) {
      console.error("Could not load saved tasks:", error);
    }

    // If no saved tasks exist, use these default tasks
    return [
      {
        id: 1,
        title: "Dishes",
        deadline: dateOffset(0),
        description: "Wash the dishes and put them away",
        priority: "High",
        done: false,
        colorIndex: 0
      },
      {
        id: 2,
        title: "Tidy",
        deadline: dateOffset(0),
        description: "Tidy up the living room",
        priority: "High",
        done: false,
        colorIndex: 1
      },
      {
        id: 3,
        title: "Vacuum",
        deadline: dateOffset(0),
        description: "Vacuum the living room and hallway",
        priority: "High",
        done: false,
        colorIndex: 2
      },
      {
        id: 4,
        title: "Laundry",
        deadline: dateOffset(1),
        description: "Fold laundry and put it away",
        priority: "Medium",
        done: false,
        colorIndex: 3
      },
      {
        id: 5,
        title: "Groceries",
        deadline: dateOffset(1),
        description: "Buy groceries for the week",
        priority: "Medium",
        done: false,
        colorIndex: 4
      },
      {
        id: 6,
        title: "Project",
        deadline: dateOffset(1),
        description: "Work on the next section of the project",
        priority: "High",
        done: false,
        colorIndex: 5
      },
      {
        id: 7,
        title: "Exercise",
        deadline: dateOffset(7),
        description: "Go for a run or hit the gym",
        priority: "Low",
        done: false,
        colorIndex: 6
      },
      {
        id: 8,
        title: "Emails",
        deadline: dateOffset(7),
        description: "Catch up on emails and messages",
        priority: "Medium",
        done: false,
        colorIndex: 7
      },
      {
        id: 9,
        title: "Homework",
        deadline: dateOffset(7),
        description: "Finish homework before the next class",
        priority: "High",
        done: false,
        colorIndex: 8
      }
    ];

  });

  // Save tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "tasky-tasks",
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Could not save tasks:", error);
    }
  }, [tasks]);

  const [sortBy, setSortBy] = useState("deadline");

  const priorityOrder = {
    High: 0,
    Medium: 1,
    Low: 2
  };

  // Convert deadlines into dates that JavaScript can compare
  const getDeadlineValue = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadline === "Today") {
      return today.getTime();
    }

    if (deadline === "Tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.getTime();
    }

    if (deadline === "Next week") {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.getTime();
    }

    // Dates created by the form use YYYY-MM-DD
    const [year, month, day] = deadline.split("-").map(Number);

    if (year && month && day) {
      return new Date(year, month - 1, day).getTime();
    }

    return Infinity;
  };

  // Remember each task's original position
  const taskPositions = new Map(
    tasks.map((task, index) => [task.id, index])
  );

  // Create a sorted copy of the tasks array
  const sortedTasks = [...tasks].sort((a, b) => {

    // Completed tasks always appear last
    if (a.done !== b.done) {
      return Number(a.done) - Number(b.done);
    }

    // Sort by priority
    if (sortBy === "priority") {
      return (
        priorityOrder[a.priority] - priorityOrder[b.priority] ||
        getDeadlineValue(a.deadline) - getDeadlineValue(b.deadline) ||
        taskPositions.get(a.id) - taskPositions.get(b.id)
      );
    }

    // Show recently added tasks first
    if (sortBy === "newest") {
      return taskPositions.get(b.id) - taskPositions.get(a.id);
    }

    // Default: sort by deadline, then priority
    return (
      getDeadlineValue(a.deadline) - getDeadlineValue(b.deadline) ||
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      taskPositions.get(a.id) - taskPositions.get(b.id)
    );

  });

  const [formState, setFormState] = useState({
    title: "",
    deadline: "",
    description: "",
    priority: "Medium"
  });

  const doneHandler = (taskId) => {

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, done: !task.done }
          : task
      )
    );

  };

  const deleteHandler = (taskId) => {

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );

  };

  const formChangeHandler = (event) => {

    const { name, value } = event.target;

    setFormState((currentForm) => ({
      ...currentForm,
      [name]: value
    }));

  };

  const formSubmitHandler = (event) => {

    event.preventDefault();

    setTasks((currentTasks) => {

      const newTask = {
        ...formState,
        id: uuidv4(),
        done: false,
        colorIndex: chooseColorIndex(currentTasks)
      };

      return [...currentTasks, newTask];
    });

    setFormState({
      title: "",
      deadline: "",
      description: "",
      priority: "Medium"
    });

  };

  return (
    <div className="container">

      <h1>Tasky</h1>

      <div className="sort-bar">

        <div className="sort-info">
          <span className="sort-icon">✦</span>
          <span>My tasks</span>

          <span className="task-count">
            {tasks.filter((task) => !task.done).length} remaining
          </span>
        </div>

        <div className="sort-controls">

          <label htmlFor="sortBy">
            Sort by
          </label>

          <select
            id="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="deadline">Due date</option>
            <option value="priority">Priority</option>
            <option value="newest">Newest first</option>
          </select>

        </div>

      </div>

      <div className="task-list">

        {sortedTasks.map((task) => (

          <Task
            key={task.id}
            title={task.title}
            deadline={formatDeadline(task.deadline)}
            description={task.description}
            priority={task.priority}
            done={task.done}
            markDone={() => doneHandler(task.id)}
            deleteTask={() => deleteHandler(task.id)}
            color={getTaskColor(task)}
          />

        ))}

      </div>

      <AddTaskForm
        form={formState}
        change={formChangeHandler}
        submit={formSubmitHandler}
      />

    </div>
  );
}

export default App;