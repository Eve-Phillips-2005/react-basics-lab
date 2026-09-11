import './App.css';
import Task from './components/Task';

function App() {
  return (
    <div className="container">
      <h1>Tasky</h1>

      <Task
        title="Dishes"
        deadline="Today"
        description="Wash the dishes and put them away"
      />

      <Task
        title="Tidy"
        deadline="Today"
        description="Tidy up the living room"
      />

      <Task
        title="Vacuum"
        deadline="Today"
        description="Vacuum the living room and hallway"
      />

      <Task
        title="Laundry"
        deadline="Tomorrow"
        description="Fold laundry and put it away"
      />

      <Task
        title="Groceries"
        deadline="Tomorrow"
        description="Buy groceries for the week"
      />

      <Task
        title="Project"
        deadline="Tomorrow"
        description="Work on the next section of the project"
      />

      <Task
        title="Exercise"
        deadline="Next week"
        description="Go for a run or hit the gym"
      />

      <Task
        title="Emails"
        deadline="Next week"
        description="Catch up on emails and messages"
      />

      <Task
        title="Homework"
        deadline="Next week"
        description="Finish homework before the next class"
      />

    </div>
  );
}

export default App;

