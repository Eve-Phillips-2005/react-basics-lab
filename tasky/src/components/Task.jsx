const Task = (props) => {

    return (
        <div
            className={`card ${props.done ? 'done' : ''}`}
            style={{ '--task-color': props.color }}
        >

            <p className="title">{props.title}</p>

            <p className="deadline">
                Due: {props.deadline}
            </p>

            <p className="description">
                {props.description}
            </p>

            <div className="card-actions">

                <p
                    className="priority"
                    data-priority={props.priority}
                >
                    {props.priority}
                </p>

                <div className="action-buttons">

                    <button
                        type="button"
                        className="doneButton"
                        onClick={props.markDone}
                    >
                        {props.done ? "Undo" : "Done"}
                    </button>

                    <button
                        type="button"
                        className="doneButton deleteButton"
                        onClick={props.deleteTask}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Task;