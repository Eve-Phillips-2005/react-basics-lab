const AddTaskForm = (props) => {

    return (
        <section className="form-panel">

            <div className="form-heading">
                <h2>Add a new task</h2>
                <p>Got something to do? Add it to your list!</p>
            </div>

            <form className="task-form" onSubmit={props.submit}>

                <div className="form-field">
                    <label htmlFor="title">Task title</label>

                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="What needs doing?"
                        value={props.form.title}
                        onChange={props.change}
                        required
                    />
                </div>

                <div className="form-row">

                    <div className="form-field">
                        <label htmlFor="deadline">Due date</label>

                        <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            lang="en-IE"
                            value={props.form.deadline}
                            onChange={props.change}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="priority">Priority</label>

                        <select
                            id="priority"
                            name="priority"
                            value={props.form.priority}
                            onChange={props.change}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                </div>

                <div className="form-field">
                    <label htmlFor="description">Description</label>

                    <textarea
                        id="description"
                        name="description"
                        placeholder="Add a few details..."
                        value={props.form.description}
                        onChange={props.change}
                        rows="3"
                    />
                </div>

                <button type="submit" className="add-task-button">
                    + Add Task
                </button>

            </form>

        </section>
    );
};

export default AddTaskForm;