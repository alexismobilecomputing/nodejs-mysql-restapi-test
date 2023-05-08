import mongoose from 'mongoose'

mongoose.connect(process.env.URI_MONGO_DB_PRUEBA, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((error) => console.error('Error al conectarse a la base de datos', error));

export default mongoose



// ESTA ES LA FORMA LARGA DE CONECTARLO, SEGUN LA PAGINA DE MONGODB ATLAS

////////////// MONGO DB //////////////
//Voy a intentar conectar a una base de datos mongo
//Primero instalo MONGO-> npm i mongodb

// import { MongoClient, ServerApiVersion } from 'mongodb';
// const uri = "mongodb+srv://alexisaostri:34812753@cluster0.emqhmdd.mongodb.net/?retryWrites=true&w=majority"; //Con esto se comunicaria con mi usuario:alexisaostri, passwd: 34812753

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

////////////// MONGO DB //////////////
