import mySQL2 from 'mysql2/promise' //Le agrego el /promise para decirle q voy a usar promesas de mysql2

import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, DB_PORT } from './config.js'


//Es el equivalente a createConnection, con algunas diferencias
//CreateConection es como mantener 1 solo hilo de conexion y createPool es como un conjunto de conexiones que podemos utilizar en produccion facilmente.
// export const pool = mySQL2.createPool({ //pool, podria llamarse conn o como quiesieramos
//     host:'localhost', //->Si estuviese en una nube, colocariamos una ip ponele 129.x etc
//     user: 'root',
//     password: 'MobileComputing',
//     port: 3306, //Por defecto siempre es 3306 aunque podriamos cambiarlo y poner el q querramos
//     database: 'companydb'
// })


//De esta manera con esta forma de trabajar, esto nos puede servir para cualquier ambiente y no solo localhost, con lo q teniamos harcodeado
export const pool = mySQL2.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE
})