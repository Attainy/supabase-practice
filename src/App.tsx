import { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  updated_at: Date;
  created_at: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[] | null>([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("todo").select();
    setTodos(data);
  }

  return (
    <>
      <div>
        <ul>
          {todos?.map((todo) => (
            <li key={todo?.title}>{todo.title}</li>
          ))}
        </ul>
      </div>
      <form>
        <input type="text" />
        <button>할일 넣기</button>
      </form>
    </>
  );
}

export default App;
