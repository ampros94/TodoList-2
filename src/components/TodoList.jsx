import { useState, useEffect } from 'react';
import './TodoList.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';


const TodoList = () => {

    const [todoArray, setTodoArray] = useState([])
    const completeCount = todoArray.filter(todo => todo.isComplete === true).length;
    const pendingCount = todoArray.length - completeCount;
    const [forData, setForData] = useState({titulo: '', descripcion: ''});
    const [todoEditId, setTodoEditId] = useState(null);

    useEffect(() =>{
        const data = window.localStorage.getItem('todoItems')
        if(data !== null) setTodoArray(JSON.parse(data))
    }, [])

    useEffect(() => {
        const data = JSON.stringify(todoArray)
        window.localStorage.setItem('todoItems', data)
    }, [todoArray])

    const handleChange = ({target}) => {
        setForData({ ...forData, [target.name]: target.value })
    }

    const addTodo = (e) => {
        e.preventDefault();
        if(todoEditId != null){
            const newTodo = [...todoArray];
            let todo = newTodo.find((todo) => todo.id === todoEditId);
            todo.titulo = forData.titulo;
            todo.descripcion = forData.descripcion;
            setTodoArray(newTodo);
            setTodoEditId(null);
            setForData({titulo: '', descripcion: ''});
        }else{
            if(forData.titulo !== '' && forData.descripcion !== ''){
                const todo = forData;
                todo.isComplete = false;
                todo.id = Date.now();

                setTodoArray([...todoArray, todo]);
                setForData({titulo: '', descripcion: ''});
            }
        }
    }

    const deleteTodo = (id) => {
        const newTodos = todoArray.filter(todo => todo.id !== id)
        setTodoArray(newTodos)
    }

    const toggleTodo = (id) => {
        const newTodo = [...todoArray];
        let todo = newTodo.find((todo) => todo.id === id)
        todo.isComplete = !todo.isComplete;
        setTodoArray(newTodo);
    }

    const deleteAllComplete = () => {
        const newTodo = todoArray.filter(todo => todo.isComplete === false);
        setTodoArray(newTodo);
    }

    const setTodoEdit = (id) => {
        const todo = todoArray.find((todo) => todo.id === id);
        setForData({titulo: todo.titulo, descripcion: todo.descripcion});
        setTodoEditId(id);
    }

    return (
        <div className="container">
            <form onSubmit={addTodo}>
                <input type="text" placeholder="Titulo" name='titulo' value={forData.titulo} onChange={handleChange}/>
                <input type="text" placeholder="Descripción" name='descripcion' value={forData.descripcion} onChange={handleChange}/>
                <input type="submit" value="Añadir" className='add' />
            </form>

            <div className="list">
                <div className='banner'>
                    <h5>Todo List</h5>
                    <button onClick={deleteAllComplete}>Eliminar tareas completadas</button>
                </div>
                {
                    todoArray.map((todo) => 
                        <div key={todo.id} className='todo'>
                            <input type="checkbox" checked={todo.isComplete} onChange={() => toggleTodo(todo.id)}/>
                            <p className={`info ${todo.isComplete ? 'text-decoration-line-through' :'' }`}>
                                {todo.titulo}
                                <span>{todo.descripcion}</span>
                            </p>
                            {todo.isComplete && <span className='completed'>Completada</span>}
                            <div className='buttons'>
                                <FontAwesomeIcon icon={faPen} className='pen' onClick={() => setTodoEdit(todo.id)}/>
                                <FontAwesomeIcon icon={faXmark} className='x' onClick={() => deleteTodo(todo.id)} />
                            </div>
                        </div>
                    )
                }

                <div className='footer'>
                    <span className='infoFooter'>Total de tareas:{todoArray.length} , Completadas:{completeCount} , Pendientes:{pendingCount} </span>
                </div>
            </div>
        </div>
    )
}

export default TodoList