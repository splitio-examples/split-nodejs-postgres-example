const { Pool, types } = require('pg');

types.setTypeParser(1700, parseFloat);

const pool = new Pool({
  user: 'moviefan',
  host: 'localhost',
  database: 'movies',
  password: 'password',
  port: 5432
});

const inMemoryHorrors = [
    {
        name: 'The Hills Have Eyes',
        rating: 7.8
    },
    {
        name: 'The Night of Living Dead',
        rating: 9.0
    },
    {
        name: 'The Scream',
        rating: 7.2
    }
];

const getAllHorrors = async (request, response) => {
    if (request.treatment == 'on') {
      pool.query('SELECT * FROM horrors ORDER BY rating ASC', (error, results) => {
        response.status(200).json(results.rows);
      });
    } else {
      response.status(200).json(inMemoryHorrors);
    }
};
  
const getHorrorById = (request, response) => {
    const id = parseInt(request.params.id);
    if (request.treatment == 'on') {
        pool.query('SELECT * FROM horrors WHERE id = $1', [id], (error, results) => {
            response.status(200).json(results.rows);
        });
    } else {
        response.status(200).json(inMemoryHorrors[0]);
    }
};
  
const addHorror = async (request, response) => {
    const { name, rating } = request.body;
    if (request.treatment == 'on') {
        pool.query('INSERT INTO horrors (name, rating) VALUES ($1, $2)', [name, rating], (error, results) => {
            response.status(201).send(`Horror added successfully.`);
        });
    } else {
        inMemoryHorrors.push({ name, rating });
        response.status(201).send(`Horror added successfully.`);
    }
};

const updateHorror = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, rating } = request.body;

    if (request.treatment == 'on') {
        pool.query('UPDATE horrors SET name = $1, rating = $2 WHERE id = $3', [name, rating, id], (error, results) => {
            response.status(200).send(`Horror with id ${id} modified.`);
        });
    } else {
        inMemoryHorrors[0] = { name, rating };
        response.status(200).send(`Horror with id ${id} modified.`);
    }
};

const deleteHorror = (request, response) => {
    const id = parseInt(request.params.id);

    if (request.treatment == 'on') {
        pool.query('DELETE FROM horrors WHERE id = $1', [id], (error, results) => {
            response.status(200).send(`Horror with id ${id} deleted.`);
        });
    } else {
        inMemoryHorrors.shift();
        response.status(200).send(`Horror with id ${id} deleted.`);
    }
};  

module.exports = {
    getAllHorrors,
    getHorrorById,
    addHorror,
    updateHorror,
    deleteHorror
};  