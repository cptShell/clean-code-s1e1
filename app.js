class Todo {
  constructor(state, root) {
    this.tasks = this.distributeTasks(state.tasks);
    this.root = root;
  }

  distributeTasks(tasks) {
    return {
      active: tasks.filter(task => !task.isComplete),
      completed: tasks.filter(task => task.isComplete),
    }
  }
  setElement(tagName, classList, innerText) {
    const elem = document.createElement(tagName);
    if (innerText) elem.textContent = innerText;
    if (classList) elem.classList.add(...classList);
    return elem;
  }
  setTaskList(list) {
    return [...list].map((item, index) => {
      let isEdit = false;
      const elem = this.setElement('LI', ['task-item']);
      const checkbox = this.setElement('INPUT', ['task-item__checkbox']);
      checkbox.setAttribute('type', 'checkbox');
      if (item.isComplete) checkbox.setAttribute('checked', 'checked');
      checkbox.addEventListener('input', () => {
        list[index].isComplete = checkbox.checked;
        this.tasks = this.distributeTasks([...this.tasks.active, ...this.tasks.completed]); 
        this.update();
      });
      const label = this.setElement('LABEL', ['task-item__label'], item.description);
      const input = this.setElement('INPUT', ['task-item__input']);
      input.addEventListener('input', () => {
        list[index].description = input.value;
        label.textContent = input.value;
      });
      input.setAttribute('value', item.description);
      const editBtn = this.setElement('BUTTON', ['task-item__edit-btn'], 'Edit');
      editBtn.addEventListener('click', () => {
        isEdit = !isEdit;
        elem.classList.toggle('editMode', isEdit);
      });
      const deleteBtn = this.setElement('BUTTON', ['task-item__delete-btn']);
      deleteBtn.addEventListener('click', () => this.removeTask(list, index));
      const deleteIcon = this.setElement('IMG', ['task-item__edit-btn_icon']);
      deleteIcon.setAttribute('src', './remove.svg');
      deleteBtn.append(deleteIcon);
      elem.append(checkbox, label, input, editBtn, deleteBtn);
      return elem;
    });
  }
  removeTask(currentTaskList, elemIndex) {
    currentTaskList.splice(elemIndex, 1);
    this.update();
  }
  addTask(taskDescription) {
    this.tasks.active.push({
      description: taskDescription,
      isComplete: false,
    });
    this.update();
  }
  buildTodoContainer(type) {
    const title = type === 'active' ? 'TODO' : 'COMPLETED'; 
    const todoContainer = this.setElement('DIV', [`todo-${type}`]);
    const todoTitle = this.setElement('H2', [`todo-${type}__title`], title);
    const taskContainer = this.setElement('UL', ['task-list']);
    const taskList = this.setTaskList(this.tasks[type]);
    taskContainer.append(...taskList);
    todoContainer.append(todoTitle, taskContainer);
    return todoContainer;
  }
  update() {
    this.root.innerHTML = '';
    const todoAddContainer = this.setElement('DIV', ['todo-add']);
    const todoAddTitle = this.setElement('H2', ['todo-add__title'], 'Add Item');
    const todoAddPanel = this.setElement('DIV', ['todo-add__panel']);
    const todoAddInput = this.setElement('INPUT', ['todo-add__input']);
    todoAddInput.setAttribute('type', 'text');
    const todoAddButton = this.setElement('BUTTON', ['todo-add__button'], 'Add');
    todoAddButton.addEventListener('click', () => this.addTask(todoAddInput.value));
    todoAddPanel.append(todoAddInput, todoAddButton);
    todoAddContainer.append(todoAddTitle, todoAddPanel);

    const todoActiveContainer = this.buildTodoContainer('active');
    const todoCompletedContainer = this.buildTodoContainer('completed');

    root.append(todoAddContainer, todoActiveContainer, todoCompletedContainer);
  }
  init() {
    this.update();
    window.addEventListener('beforeunload', () => {
      const totalData = {tasks: [...this.tasks.active, ...this.tasks.completed]};
      localStorage.setItem('todo-user-stat', JSON.stringify(totalData));
    });
  }
}

const root = document.getElementById('root');
const state = JSON.parse(localStorage.getItem('todo-user-stat')) || {
  tasks: [
    {description: 'Pay Bills', isComplete: false},
    {description: 'Go Shopping', isComplete: false},
    {description: 'See the Doctor', isComplete: true}
  ]
};
const todo = new Todo(state, root);
todo.init();