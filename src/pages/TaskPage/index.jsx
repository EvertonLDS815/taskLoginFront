import { useNavigate } from 'react-router-dom';  // Importar useNavigate
import { useEffect, useState } from 'react';
import api from '../../config/api';
import './style.css';

const TodoList = () => {
  const [user, setUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();  // Inicializando o navigate

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks'); // Sem necessidade de passar headers manualmente
      setTasks(data); // Atualiza a lista de tarefas
    } catch (err) {
      console.error('Failed to fetch tasks:', err); // Loga erros no console
    }
  };

  async function fetchUser() {
    try {
      const { data } = await api.get('/user');
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask === '') {
      alert('Digite uma tarefa!');
      return;
    }
  
    // Cria um ID temporário e adiciona localmente
    const tempId = Math.random().toString(36).substring(2, 15); // Gera um ID temporário único
    const newTaskObject = { _id: tempId, task: newTask, completed: false };
  
    setTasks((prevTasks) => [...prevTasks, newTaskObject]);
    setNewTask(''); // Limpa o input imediatamente
  
    try {
      const { data } = await api.post('/tasks', { task: newTask });
      
      // Atualiza o ID temporário com o ID real do banco
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === tempId ? { ...task, _id: data._id } : task
        )
      );
    } catch (err) {
      console.error('Failed to add task:', err);
  
      // Remove a tarefa local caso a API falhe
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== tempId));
      alert('Falha ao adicionar a tarefa. Tente novamente.');
    }
  };
  

  const handleDeleteTask = async (id) => {
    // Remove a tarefa localmente antes de chamar a API
    const updatedTasks = tasks.filter((task) => task._id !== id);
    setTasks(updatedTasks);
  
    try {
      await api.delete(`/tasks/${id}`); // Remove a tarefa no banco de dados
    } catch (err) {
      console.error('Failed to delete task:', err);
  
      // Reverte a exclusão local caso a API falhe
      setTasks((prevTasks) => [...prevTasks, tasks.find((task) => task._id === id)]);
    }
  };
  

  const handleToggleTaskCompletion = async (id) => {
    // Atualiza o estado local antes de fazer a chamada à API
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      )
    );
  
    try {
      await api.patch(`/tasks/${id}`); // Faz o toggle no banco de dados
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
  
      // Reverte a mudança local caso a API falhe
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove o token do localStorage
    navigate('/');  // Redireciona para a página de login
  };

  return (
    <>
      <header className="headfix">
        <h2>{user}</h2>
        <button onClick={handleLogout} className="logout">Sair</button>
      </header>
      <div className="table-todo">
        <h2>Lista de Tarefas</h2>
        <div className="content-space">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New Task"
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        <ul className="list">
          {tasks.map((item) => (
            <li
              key={item._id}
              style={{
                backgroundColor: item.completed ? '#2a8257' : '#3f3f3f'
              }}
            >
              <button onClick={() => handleToggleTaskCompletion(item._id)} className="complete">
                {item.completed ? 'Undo' : 'Todo'}
              </button>
              <span>{item.task}</span>
              <button onClick={() => handleDeleteTask(item._id)} className="delete">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
