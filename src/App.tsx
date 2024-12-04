import { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';
import { Tables } from './types/supabase.types';

type Todo = Tables<'todo'>;

const userUUID = '3';

function App() {
  const [todos, setTodos] = useState<Todo[] | null>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string[]>([]);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const { data, error } = await supabase.from('todo').select();
    if (error) {
      console.error('Error fetching todos:', error.message);
      return;
    }
    setTodos(data);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo = {
      title: 'New Todo',
      completed: true,
    };

    const { error } = await supabase.from('todo').insert([newTodo]);

    if (error) {
      console.error('Error inserting todo:', error.message);
    } else {
      alert('Todo added successfully!');
      getTodos();
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      console.error('No files selected.');
      return;
    }
    setFileName(files[0].name);
    console.log(files[0].name);

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      // 파일 이름 수정
      const filePath = `${userUUID}/${Date.now()}`;
      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from('resume_images')
        .upload(filePath, file);

      if (error) {
        console.error(`Error uploading file ${file.name}:`, error.message);
        continue;
      }

      // 업로드
      const res = supabase.storage.from('resume_images').getPublicUrl(filePath);
      if (res.data.publicUrl && fileName) {
        uploadedUrls.push(res.data.publicUrl);
        setFileUrl(res.data.publicUrl);

        // Supabase DB에 이미지 URL 저장
        const { error: dbError } = await supabase.from('page').insert([
          {
            title: res.data.publicUrl.toString(),
            body: fileName.toString(),
          },
        ]);

        if (dbError) {
          console.error('Error saving URL to database:', dbError.message);
        }
      }
    }

    setUploadedFileUrl((prev) => [...prev, ...uploadedUrls]);
    alert('Files uploaded successfully!');
  };

  const handleDownload = async (imgSource: string) => {
    const filePath = imgSource.split('/').slice(-2).join('/'); // 파일 경로 추출

    const { data, error } = await supabase.storage
      .from('resume_images')
      .download(filePath);

    if (error) {
      console.error('Error downloading file:', error.message);
      return;
    }

    if (data) {
      const blob = new Blob([data], { type: data.type });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filePath.split('/').pop() || 'download';
      link.click();
      URL.revokeObjectURL(link.href);
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
      <div>
        {uploadedFileUrl.map((imgSource, i) => (
          <div key={i} onClick={() => handleDownload(imgSource)}>
            <img
              src={imgSource}
              alt={`uploaded-${i}`}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        ))}
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileInputChange}
          multiple
        />
        <p>{fileUrl}</p>
      </div>
    </>
  );
}

export default App;
