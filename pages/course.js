// pages/teacher/courses.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import { connectToDatabase } from '../../util/mongodb';

export default function Courses({ courses }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = '/login';
      } else {
        setSession(session);
      }
    });
  }, []);

  return (
    <div>
      <h1>My Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <Link href={`/teacher/courses/${course._id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
      <Link href="/teacher/create-course">Create a New Course</Link>
    </div>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const courses = await db.collection('courses').find().toArray();

  return {
    props: {
      courses: JSON.parse(JSON.stringify(courses)),
    },
  };
}
