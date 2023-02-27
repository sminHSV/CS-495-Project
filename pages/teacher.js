import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function Teacher() {
  const router = useRouter();
  const [courseName, setCourseName] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [status, setStatus] = useState('typing');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const response = await fetch('/api/create-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseName }),
    });

    if (response.ok) {
      router.push('/teacher/courses');
    } else {
      let message = (await response.json()).message;
      setErrorMsg(message);
      setStatus('typing');
    }
  };

  return (
    <>
      <h1>Create a New Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Course Name:{' '}
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              disabled={status === 'submitting'}
            />
          </label>
        </div>
        <div>
          <button
            disabled={courseName.length === 0 || status === 'submitting'}
            type="submit"
          >
            Create Course
          </button>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
      <br />
      <Link href="/teacher/courses">View Your Courses</Link>
    </>
  );
}
