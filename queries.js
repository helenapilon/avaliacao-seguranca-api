const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "db.inbblmgwcrwdmhfovput.supabase.co",
  database: "postgres",
  password: "dbavaliacaodb",
  port: 5432,
});

const getUsers = async (request, response) => {
  const { name } = request.query;

  pool.query(
    "SELECT id, name, email FROM users WHERE name ilike '%" +
      name +
      "%' ORDER BY id ASC",
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send(error);
      }

      return response.status(200).json(results.rows);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT id, name, email, password, role_id FROM users WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows[0]);
    }
  );
};

const login = (request, response) => {
  const { email, password } = request.body;

  pool.query(
    "SELECT id, name, email, role_id from users WHERE email = $1 AND password = $2",
    [email, password],
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send(error);
      }
      if (result?.rows?.length == 0) {
        return response.status(500).send({ message: "Usuário não encontrado" });
      } else if (!!result?.rows && result?.rows?.length === 1) {
        return response.status(201).send(result.rows[0]);
      }
    }
  );
};

const createUser = (request, response) => {
  const { name, email, password } = request.body;

  pool.query(
    'INSERT INTO users (name, email, password, role, "inserted_at", "updated_at") VALUES ($1, $2, $3, $4, now(), now()) RETURNING *',
    [name, email, password, role],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(201).send(results.rows[0]);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email, role } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2, role=$3 "updated_at" = now() WHERE id = $4',
    [name, email, role, id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getLogs = (request, response) => {
  const { description } = request.query;

  pool.query(
    `SELECT log.id, action, description, origin, user_id, users.name as user_name FROM log LEFT JOIN users ON user_id = users.id ${
      "WHERE description ilike '%" + description + "%'"
    } ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getLogById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM log WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).json(results.rows[0]);
  });
};

const getLogByUserId = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM log WHERE user_id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).json(results.rows);
  });
};

const createLog = (request, response) => {
  const { action, description, user_id } = request.body;

  pool.query(
    'INSERT INTO log (action, description, user_id, "created_at") VALUES ($1, $2, $3, now()) RETURNING *',
    [action, description, user_id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(201).send(results.rows[0]);
    }
  );
};

const deleteLog = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM log WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getRoles = (request, response) => {
  const { name } = request.query;

  pool.query(
    `SELECT * FROM role ${"WHERE name ilike '%" + name + "%'"} ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getRoleById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM role WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).json(results.rows[0]);
  });
};

const createRole = (request, response) => {
  const { name } = request.body;

  pool.query(
    'INSERT INTO role (name, "inserted_at", "updated_at") VALUES ($1, now(), now()) RETURNING *',
    [name],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      if (results.rows.length > 0) {
        return response.status(201).send(results.rows[0]);
      } else
        return response.status(400).send({ message: "Não foi possível criar" });
    }
  );
};

const updateRole = (request, response) => {
  const id = parseInt(request.params.id);
  const { name } = request.body;

  pool.query(
    `UPDATE role SET name = $1, "updated_at" = now() WHERE id = $2`,
    [name, id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteRole = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM role WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getTypes = (request, response) => {
  const { name } = request.query;

  pool.query(
    `SELECT * FROM pet_type ${
      "WHERE name ilike '%" + name + "%'"
    } ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getTypeById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM pet_type WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).json(results.rows[0]);
  });
};

const createType = (request, response) => {
  const { name } = request.body;

  pool.query(
    'INSERT INTO pet_type (name, "inserted_at", "updated_at") VALUES ($1, now(), now()) RETURNING *',
    [name],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      if (results.rows.length > 0) {
        return response.status(201).send(results.rows[0]);
      } else
        return response.status(400).send({ message: "Não foi possível criar" });
    }
  );
};

const updateType = (request, response) => {
  const id = parseInt(request.params.id);
  const { name } = request.body;

  pool.query(
    `UPDATE pet_type SET name = $1,"updated_at" = now() WHERE id = $2`,
    [name, id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteType = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM pet_type WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getPets = (request, response) => {
  const { name } = request.query;

  pool.query(
    `SELECT pet.id, pet.name, gender, color, breed, pet_type.name as type, users.name as owner FROM pet 
     LEFT JOIN users ON user_id = users.id LEFT JOIN pet_type ON pet_type_id = pet_type.id
    ${
      " WHERE pet.name ilike '%" + name + "%' AND pet.id != " + 2
    } ORDER BY id ASC`,

    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send(error);
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getPetById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM pet WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).json(results.rows[0]);
  });
};

const createPet = (request, response) => {
  const { name, gender, breed, color, pet_type, user_id } = request.body;

  pool.query(
    'INSERT INTO pet (name, gender, breed, color, pet_type_id, user_id, "inserted_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, now(), now()) RETURNING *',
    [name, gender, breed, color, pet_type, user_id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      if (results.rows.length > 0) {
        return response.status(201).send(results.rows[0]);
      } else
        return response.status(400).send({ message: "Não foi possível criar" });
    }
  );
};
const updatePet = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, gender, breed, color, pet_type } = request.body;
  pool.query(
    `UPDATE pet SET name = $1, gender = $2, breed = $3, color = $4, pet_type_id = $5, "updated_at" = now() WHERE id = $6`,
    [name, gender, breed, color, pet_type, id],
    (error, results) => {
      if (error) {
        return response.status(500).send(error);
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deletePet = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM pet WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    return response.status(200).send(results.rows[0]);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  getLogs,
  getLogById,
  getLogByUserId,
  createLog,
  deleteLog,
  getTypes,
  getTypeById,
  createType,
  updateType,
  deleteType,
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};
