// pages/teacher/create-course.js

import { useState } from 'react';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function CreateCourse() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = await getSession();
    const response = await fetch('/api/create-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, teacher: session.user.email }),
    });
    if (response.ok) {
      router.push('/teacher/courses');
    }
  };

  return (
    <div>
      <h1>Create a New Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:{' '}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:{' '}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </label>
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
}
