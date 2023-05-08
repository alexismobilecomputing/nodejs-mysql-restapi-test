import app from './app.js' //Me traigo todo lo q hay en app.js, aca tengo toda la configuracion del express y el llamado de las rutas.
import { PORT } from './config.js' //Traigo para usar todas mas variables de entorno globales
import './dbMongo.js' // Conecto a la base de datos mongo


app.listen(PORT);
console.log(`Server running on port ${PORT}`)