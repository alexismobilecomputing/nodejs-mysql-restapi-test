import { config } from 'dotenv'

config() //Con esto ya estoy leyendo variables de entorno

//Si estamos en otro ambiente q no sea el local por ej va a traer las variables del process.env, caso contrario le asignamos los valores harcodeados a la derecha del ||
//En este caso los valores q tengo en el archivo .env coinciden con los valores harcodeados a la derecha del || , igualmente no va a suceder este en otros ambientes.
export const PORT = process.env.PORT || 3000;//Uso procces es un objeto global de nodejs, env almacena todas las variables que tiene mi computador y PORT es una de esas variables
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'MobileComputing'
export const DB_DATABASE = process.env.DB_DATABASE || 'companydb'
export const DB_PORT = process.env.DB_PORT || 3306 //db_port es el puerto de la base de datos
