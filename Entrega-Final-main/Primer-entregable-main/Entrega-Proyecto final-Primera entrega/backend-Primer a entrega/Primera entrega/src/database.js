import mongoose from "mongoose"; 
mongoose.connect("mongodb+srv://codermajo:1234@cluster0.sadqd.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0")
   .then(()=> console.log("Conectados a la base de datos"))
   .catch((error)=> console.log("Tenemos un error", error))
