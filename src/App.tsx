import { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';
import { Tables } from './types/supabase.types';

// import { Database } from './supabaseTypes';
// type Todo = Database['public']['Tables']['todo']['Row'];

type Todo = Tables<'todo'>;

function App() {
  const [todos, setTodos] = useState<Todo[] | null>([]);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const { data } = await supabase.from('todo').select();
    setTodos(data);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    const newTodo = {
      title: 'New Todo',
      completed: true,
    };

    const { error } = await supabase.from('todo').insert([newTodo]);

    if (error) {
      console.error('Error inserting todo:', error.message);
    } else {
      alert('Todo added successfully!');
      getTodos(); // 리스트 갱신
    }
  };

  return (
    <>
      <div>
        <ul>{todos?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button>할일 넣기</button>
      </form>
    </>
  );
}

export default App;
