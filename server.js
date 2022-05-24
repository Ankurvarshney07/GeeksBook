const express = require('express');
const mongoose = require('mongoose');
const geekuser = require('./geekusermodel');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const reviewmodel = require('./reviewmodel');
const cors = require('cors');
const app = express();


mongoose.connect('mongodb+srv://ANKURVARSHNEY:Geeksbook01@cluster0.ce9yg.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    ()=> console.log('DB connected')
)

app.use(express.json())
app.use(cors({origin:'*'}));

app.get('/', (req, res)=>{
    return res.send('Hello, World!!!')
})

app.post('/register', async (req, res) => {
    
   try{
        const {fullname,email,mobile,skill,password,confirmpassword} = req.body;
        const exist = await geekuser.findOne({email});
        if(exist){
            return res.status(400).send('User Already Registered')
        }
        if(password != confirmpassword){
            return res.status(403).send('Not Matched');
        }

        let newUser = new geekuser({
            fullname,email,mobile,skill,password,confirmpassword
        })
        newUser.save();
        return res.status(200).send('User Successfully Registered');
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.post('/login', async (req, res)=>{
    try{
        const {email,password} = req.body;
        const exist = await geekuser.findOne({email});
        if(!exist){
            return res.status(400).send('User Not Exist')
        }
        if(exist.password != password){
            return res.status(400).send('Password Invalid')
        }
        let payload = {
            user: {
                id: exist.id
            }
        }
        jwt.sign(payload,'jwtPassword',{expiresIn:3600000000},
        (err,token)=>{
            if (err) throw err
            return res.json({token});

        })

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send('Server Error')

    }
})

app.get('/allprofiles', middleware, async(req,res) => {
    try{
        let allprofiles = await geekuser.find();
        return res.json(allprofiles);

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send('Server Error')

    }

})


app.get('/myprofile', middleware, async(req,res) => {
    try{
        let user = await geekuser.findById(req.user.id);
        return res.json(user);

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send('Server Error')

    }

})

app.post('/addreview', middleware, async(req,res) => {
    try{
        const {taskworker,rating} = req.body;
        const exist = await geekuser.findById(req.user.id);
        const newReview = new reviewmodel({
            taskprovider:exist.fullname,
            taskworker,rating
        })
        newReview.save();
        return res.status(200).send('Review updated Successfully')

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send('Server Error')

    }

})

app.get('/myreview', middleware, async(req,res) => {
    try{
        let allreview = await reviewmodel.find();
        let myreviews = allreview.filter(review => review.taskworker.toString() === req.user.id.toString());
        return res.status(200).json(myreviews);

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send('Server Error')

    }

})


app.listen(5000,()=>console.log('Server running..'))
