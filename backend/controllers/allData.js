const connection = require('../config/db');

//function to get all data to display in admin, analytics
const getAllData = (req, res) => {
    const queries = {
      students: 'SELECT * FROM Student',
      teachers: 'SELECT * FROM Teacher',
      admins: 'SELECT * FROM Admin',
      courses: 'SELECT * FROM Courses',
      departments: 'SELECT * FROM Department',
    };
  
    const fetchData = (query) => {
      return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
    };
  
    Promise.all([
      fetchData(queries.students),
      fetchData(queries.teachers),
      fetchData(queries.admins),
      fetchData(queries.courses),
      fetchData(queries.departments),
    ])
      .then(([students, teachers, admins, courses, departments]) => {
        const data = {
          students,
          teachers,
          admins,
          courses,
          departments,
        };
  
        const fs = require('fs');
        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
          if (err) {
            console.error('Error saving data to file:', err);
            return res.status(500).json({ status: 'error', message: 'Failed to save data to file' });
          }
          res.status(200).json({ status: 'success', data });
        });
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch data' });
      });
  };

  module.exports = {getAllData};