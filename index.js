const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oyvr00h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const studentCollection = client.db("job-task").collection("students");

        app.post('/students', async (req, res) => {
            const newStudent = req.body;
            const result = await studentCollection.insertOne(newStudent);
            res.send(result);
        })

        app.get('/students', async (req, res) => {
            const students = await studentCollection.find().toArray();
            res.send(students);
        });

        app.get('/student', async (req, res) => {
            const pincode = req.query.pincode;
            const query = { pin_code: pincode };
            const student = await studentCollection.findOne(query);
            res.send(student);
        })

        app.put('/student-update', async (req, res) => {
            const pincode = req.query.pincode;
            const updatedStudent = req.body;
            const query = { pin_code: pincode };
            const options = { upsert: true };
            const updatedDoc={
                $set:{
                    first_name:updatedStudent.first_name,
                    middle_name:updatedStudent.middle_name,
                    last_name:updatedStudent.flastname,
                    full_name:updatedStudent.full_name,
                    class_number:updatedStudent.class_number,
                    division:updatedStudent.division,
                    roll:updatedStudent.roll,
                    address1:updatedStudent.address1,
                    address2:updatedStudent.address2,
                    landmark:updatedStudent.landmark,
                    city:updatedStudent.city
                    
                }
            };
            const result=await studentCollection.updateOne(query,updatedDoc,options);
            res.send(result)
        })

        app.delete('/student-delete', async (req, res) => {
            const pincode = req.query.pincode;
            const query = { pin_code:pincode };
            const result = await studentCollection.deleteOne(query);
            res.send(result);
      
          })


    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('This is homepage')
});



app.listen(port, () => {
    console.log('port is running')
})