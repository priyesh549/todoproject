document.addEventListener('DOMContentLoaded', function () {
    const todoname = document.getElementById('TodoName');
    const tododescription = document.getElementById('TodoDescription');
    const submitButton = document.getElementById('submit');
    const todoListLeft = document.getElementById('TodoIncomplete');
    const todoListCompleted = document.getElementById('TodoCompleted');

    axios.get('https://crudcrud.com/api/1b306929ada94faf933f4f11d4bb39ef/todos')
    .then(todos=>{
        todos.data.forEach((todo)=>{
            const todoList = createTodoList(todo._id,todo.Name,todo.description,todo.Status)
            if(todo.Status){
                todoListCompleted.appendChild(todoList)
                console.log(true)
            }
            else{
                todoListLeft.appendChild(todoList)
                console.log(false)
            }
        })
        console.log(todos.data);
    })
    .catch(err=>{
        console.log(err);
    })


    function createTodoList(id,name,description,status){
        const todoItem = document.createElement('li');

        todoItem.className = 'todo-item'

        todoItem.innerHTML = `
            Name:${name} , Description: ${description}
            <input type="checkbox" name="todocomplete" class="checkbox">
            <button class="delete">X</button>
        `;

        const checkbox = todoItem.querySelector('.checkbox');
        checkbox.checked = status;
        todoItem.setAttribute('todo-item-id',id)

        const deleteButton = todoItem.querySelector('.delete')

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                todoListCompleted.appendChild(todoItem);
                console.log('Completed');
            } else {
                todoListLeft.appendChild(todoItem);
                console.log('Incomplete');
            }
            const id = todoItem.getAttribute('todo-item-id')
            changeStatus(id,name,description,this.checked);
        });

        deleteButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Determine from which list the item should be removed
            const parentList = todoItem.parentElement === todoListLeft ? todoListLeft : todoListCompleted;
            const id = todoItem.getAttribute('todo-item-id');
            deletefromCrudCrud(id);
            parentList.removeChild(todoItem);
        });

        return todoItem;
    }

    submitButton.addEventListener('click', function (e) {
        e.preventDefault();
        const name = todoname.value;
        const description = tododescription.value;

        const todoItem = createTodoItem(name, description);
        todoListLeft.appendChild(todoItem);

        const checkbox = todoItem.querySelector('.checkbox');
        saveInCrudCrud(name,description,checkbox.checked,todoItem)
    });

    function createTodoItem(name, description) {
        const todoItem = document.createElement('li');

        todoItem.innerHTML = `
            Name:${name} , Description: ${description}
            <input type="checkbox" name="todocomplete" class="checkbox">
            <button class="delete">X</button>
        `;

        todoItem.className = 'todo-item'

        const deleteButton = todoItem.querySelector('.delete');
        const checkbox = todoItem.querySelector('.checkbox');

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                todoListCompleted.appendChild(todoItem);
                console.log('Completed');
            } else {
                todoListLeft.appendChild(todoItem);
                console.log('Incomplete');
            }
            const id = todoItem.getAttribute('todo-item-id')
            changeStatus(id,name,description,this.checked);
        });

        deleteButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Determine from which list the item should be removed
            const parentList = todoItem.parentElement === todoListLeft ? todoListLeft : todoListCompleted;
            const id = todoItem.getAttribute('todo-item-id');
            deletefromCrudCrud(id);
            parentList.removeChild(todoItem);
        });

        return todoItem;
    }

    function saveInCrudCrud(name,description,checked,todoItem){
        axios.post('https://crudcrud.com/api/1b306929ada94faf933f4f11d4bb39ef/todos',{
            Name: name,
            description: description,
            Status: checked
        })
        .then(res=>{
            todoItem.setAttribute("todo-item-id",res.data._id);
            console.log(res);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    function changeStatus(id,name,description, status) {
        axios.put(`https://crudcrud.com/api/1b306929ada94faf933f4f11d4bb39ef/todos/${id}`, {
            Name: name,
            description: description,
            Status: status
        })
        .then(res => {
            console.log('PATCH request successful:', res.data);
        })
        .catch(err => {
            console.error('Error in PATCH request:', err);
        });
    }    

    function deletefromCrudCrud(id){
        axios.delete(`https://crudcrud.com/api/1b306929ada94faf933f4f11d4bb39ef/todos/${id}`)
        .then(res=>{
            console.log(res);
        })
        .catch(err=>{
            console.log(err);
        })
    }
});
