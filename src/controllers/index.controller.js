import {pool} from '../db.js';

export const getPing = async (req,resp)=>{
    // const result = await pool.query('SELECT 1 + 1 AS result')
    const [result] = await pool.query('SELECT 1 + 1 AS result') //Pongo [result], para que de todo el json me traiga solo el result
    // const [result] = await pool.query('SELECT * from employee') 
    resp.json(result)
}