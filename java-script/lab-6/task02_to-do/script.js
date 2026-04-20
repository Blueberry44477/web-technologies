const createTask = (text) => ({
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
});

const addTask = (tasks, text) => [...tasks, createTask(text)];

const deleteTask = (tasks, id) => tasks.filter(task => task.id !== id);

const toggleTask = (tasks, id) => tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed, updatedAt: Date.now() } : task
);

const editTask = (tasks, id, newText) => tasks.map(task =>
    task.id === id ? { ...task, text: newText, updatedAt: Date.now() } : task
);

const sortTasks = (tasks, criteria) => {
    const copy = [...tasks];
    switch (criteria) {
        case 'date-asc':
            return copy.sort((a, b) => a.createdAt - b.createdAt);
        case 'date-desc':
            return copy.sort((a, b) => b.createdAt - a.createdAt);
        case 'completed':
            return copy.sort((a, b) => Number(a.completed) - Number(b.completed));
        case 'updated':
            return copy.sort((a, b) => b.updatedAt - a.updatedAt);
        default:
            return copy;
    }
};


let state = {
    tasks: [],
    sortBy: 'date-desc',
    editingId: null
};

const updateState = (newState) => {
    state = { ...state, ...newState };
    render(state);
};

const DOM = {
    form: document.getElementById('todo-form'),
    input: document.getElementById('todo-input'),
    list: document.getElementById('todo-list'),
    sortSelect: document.getElementById('sort-select')
};

const handleAddTask = (e) => {
    e.preventDefault();
    const text = DOM.input.value.trim();
    if (text) {
        updateState({ tasks: addTask(state.tasks, text) });
        DOM.input.value = '';
    }
};

const handleDeleteTask = (id, liElement) => {
    liElement.addEventListener('transitionend', () => {
        updateState({ tasks: deleteTask(state.tasks, id) });
    }, { once: true });
    liElement.classList.add('todo-item--removing');
};

const handleToggleTask = (id) => updateState({ tasks: toggleTask(state.tasks, id) });

const handleStartEdit = (id) => updateState({ editingId: id });

const handleSaveEdit = (id, newText) => {
    if (newText.trim()) {
        updateState({
            tasks: editTask(state.tasks, id, newText.trim()),
            editingId: null
        });
    }
};

const handleSortChange = (e) => updateState({ sortBy: e.target.value });

const render = ({ tasks, sortBy, editingId }) => {
    DOM.list.innerHTML = '';
    const sortedTasks = sortTasks(tasks, sortBy);

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'todo-item--completed' : ''}`;
        const isEditing = task.id === editingId;

        li.innerHTML = `
            <input type="checkbox" class="todo-item__checkbox" ${task.completed ? 'checked' : ''}>
            <div class="todo-item__content">
                ${isEditing
                    ? `<input type="text" class="todo-item__edit-input" value="${task.text}">`
                    : `<span class="todo-item__text">${task.text}</span>`
                }
            </div>
            <div class="todo-item__actions">
                ${isEditing
                    ? `<button class="todo-item__btn todo-item__btn--save">Зберегти</button>`
                    : `<button class="todo-item__btn todo-item__btn--edit">Редагувати</button>`
                }
                <button class="todo-item__btn todo-item__btn--delete">Видалити</button>
            </div>
        `;

        li.querySelector('.todo-item__checkbox').addEventListener('change', () => handleToggleTask(task.id));
        li.querySelector('.todo-item__btn--delete').addEventListener('click', () => handleDeleteTask(task.id, li));

        if (isEditing) {
            const editInput = li.querySelector('.todo-item__edit-input');
            editInput.focus();
            li.querySelector('.todo-item__btn--save').addEventListener('click', () => handleSaveEdit(task.id, editInput.value));
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSaveEdit(task.id, editInput.value);
            });
        } else {
            li.querySelector('.todo-item__btn--edit').addEventListener('click', () => handleStartEdit(task.id));
        }

        DOM.list.appendChild(li);
    });
};

DOM.form.addEventListener('submit', handleAddTask);
DOM.sortSelect.addEventListener('change', handleSortChange);
render(state);