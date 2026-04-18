import React, { useEffect, useState } from 'react';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <strong>{course.title}</strong> - {course.description}
              <br />
              <em>Instructor: {course.instructor}</em> | Duration: {course.duration}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseList;