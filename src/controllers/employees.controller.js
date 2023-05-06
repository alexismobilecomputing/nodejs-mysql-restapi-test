import { pool } from '../db.js'

export const getEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employee')
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ //Igualmente no es necesario mandar un mensaje de error, podemos mandar lo q queramos o no mandar nada
            message: 'Something goes wrong'
        })
    }
}

export const getEmployee = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [req.params.id])
        if (rows.length <= 0) {
            return res.status(404).json({
                message: 'Employee not found'
            })
        }
        res.json(rows[0]);
    } catch (error) {
        return res.status(500) //Puedo mandar si quiero simplemente el status
    }
}

export const createEmployee = async (req, res) => {
    try {
        const { name, salary } = req.body;
        //El orden de lo q paso en el array es lo q pongo en los ? del value
        const [rows] = await pool.query('INSERT INTO employee (name, salary) VALUES(?,?)', [name, salary]) //Es una consulta asincrona por eso ponemos el await, y tambien agregamos el async a la funcion
        //La consulta devuelve un objeto grande, pero en este caso solo quiero las filas "rows"
        //Rows me devuelve un objeto con varios atributos, pero el q nos interesa es el de insertId, que es el id del nuevo objeto creado

        //Ahora en la respuesta q devolvamos vamos a poner el name y salario q mandamos a crear sumado al id q nos devolvio la consulta
        res.send({
            id: rows.insertId,
            name,
            salary
        });
    } catch (error) {
        return res.status(500).json({ //Igualmente no es necesario mandar un mensaje de error, podemos mandar lo q queramos o no mandar nada
            message: 'Something goes wrong'
        })
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM employee WHERE id = ?', [req.params.id])

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Employee not found'
            })
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ //Igualmente no es necesario mandar un mensaje de error, podemos mandar lo q queramos o no mandar nada
            message: 'Something goes wrong'
        })
    }

}

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, salary } = req.body;
        const [result] = await pool.query('UPDATE employee SET name =?, salary = ? WHERE id= ?', [name, salary, id])

        if (result.affectedRows == 0) return res.status(404).json({
            message: 'Employee not found'
        })

        //Cuando actualizamos sql nos devuelve un objeto, pero no esta el objeto actualizado
        //Si quisieramos enviarle el objeto actualizado al cliente, habria q hacer de nuevo la consulta
        const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [req.params.id])

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ //Igualmente no es necesario mandar un mensaje de error, podemos mandar lo q queramos o no mandar nada
            message: 'Something goes wrong'
        })
    }
}

export const updatePatchEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, salary } = req.body;

        // El IFNULL('?') lo q hace es q si no viene un valor null o undefined en ? , le deja el valor que colocamos al lado de la coma, en este caso el mismo valor q ya tenia IFNULL(?,name)
        //El name o el salario puedo traerlos o no en este caso
        const [result] = await pool.query('UPDATE employee SET name = IFNULL(?,name), salary = IFNULL(?,salary) WHERE id= ?', [name, salary, id])

        if (result.affectedRows == 0) return res.status(404).json({
            message: 'Employee not found'
        })

        const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [req.params.id])

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ //Igualmente no es necesario mandar un mensaje de error, podemos mandar lo q queramos o no mandar nada
            message: 'Something goes wrong'
        })
    }
}

