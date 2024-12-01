import React, { useState } from "react";

const AssignStudents = () => {
  const [students] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Emily Johnson" },
    { id: 3, name: "Michael Brown" },
    { id: 4, name: "Sarah Wilson" },
    { id: 5, name: "James Smith" },
    { id: 6, name: "Emma White" },
    { id: 7, name: "Robert Green" },
    { id: 8, name: "Olivia Davis" },
    { id: 9, name: "William Martinez" },
    { id: 10, name: "Sophia Anderson" },
    { id: 11, name: "Daniel Thomas" },
    { id: 12, name: "Isabella Jackson" },
    { id: 13, name: "Joseph Harris" },
    { id: 14, name: "Charlotte Martin" },
    { id: 15, name: "David Allen" },

  ]);

  const [courses] = useState([
    { id: 1, name: "Mathematics 101" },
    { id: 2, name: "Introduction to Programming" },
    { id: 3, name: "Database Systems" },
  ]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleAssign = () => {
    if (selectedStudents.length > 0 && selectedCourse) {
      const course = courses.find(
        (course) => course.id === parseInt(selectedCourse)
      );

      const newAssignments = selectedStudents
        .filter(
          (studentId) =>
            !assignments.some(
              (assignment) =>
                assignment.studentId === studentId &&
                assignment.courseId === course.id
            )
        )
        .map((studentId) => {
          const student = students.find((student) => student.id === studentId);
          return {
            studentId,
            studentName: student.name,
            courseId: course.id,
            courseName: course.name,
          };
        });

      setAssignments([...assignments, ...newAssignments]);
      setSelectedStudents([]);
      setSelectedCourse("");
      alert("Students assigned successfully");
    } else {
      alert("Please select at least one student and a course");
    }
  };

  const handleRemoveAssignment = (index) => {
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(updatedAssignments);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h3 className="text-3xl font-bold text-gray-800 text-center">
        Assign Students to Courses
      </h3>

      {/* Assign Students Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Assign Students
        </h4>
        <div className="space-y-4">
          {/* Search Students */}
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Search Students:</p>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Select Students */}
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Select Students:</p>
            <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentSelection(student.id)}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`student-${student.id}`}
                    className="text-gray-700"
                  >
                    {student.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Select Course */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          {/* Assign Button */}
          <button
            onClick={handleAssign}
            className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Assign Students to Course
          </button>
        </div>
      </div>

      {/* Assigned Students List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Assigned Students
        </h4>
        {assignments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {assignments.map((assignment, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-4"
              >
                <div>
                  <p className="font-semibold text-gray-700">
                    {assignment.studentName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Assigned to: {assignment.courseName}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveAssignment(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No students assigned to courses yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignStudents;
