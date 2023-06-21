require('dotenv').config();
require('./utils/mongodbConnection')

const Farm = require('./models/Farm')
const Type = require('./models/Type')
const RewardLink = require('./models/RewardLink')

const express = require('express')
const app = express()

app.set('view engine', 'ejs');

const bodyParser = require('body-parser')
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

const linkShortener = require('./routes/linkShortener')
const linkCreator = require('./routes/linksCreator')
app.use('/api',linkShortener,linkCreator)

app.get('/admin/add-option',(req,res) =>{
  res.render('addOption')
})

app.get('/admin',async (req,res) =>{
  const farms = await Farm.find({})
  const types = await Type.find({})
  res.render('linksGeneratorHomeScreen',{
    totalFarms:farms.length,
    farms:farms,
    types:types
  })

})

app.get('/admin/farms',async (req,res) =>{
  const farms = await Farm.find({})

  res.render('farms',{
    farms:farms
  })
})

app.post('/admin/farms',async (req,res) =>{
  try {
    const { name, snsid, uss, hash } = req.body;
    console.log(req.body)
    const farm = new Farm({ name, snsid, uss, hash });
    await farm.save();
    res.redirect('/admin/farms');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
})

app.delete('/admin/farms/:id', async (req, res) => {
  try {
    const farmId = req.params.id;
    console.log('im here');

    // Use Mongoose or any other method to find and delete the farm
    const deletedFarm = await Farm.findByIdAndDelete(farmId);

    if (!deletedFarm) {
      console.log('in deleted')
      return res.status(404).send('Farm not found.');
    }

    // Farm deleted successfully
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the farm.');
  }
});

app.get('/admin/farms/create',async (req,res) =>{

  res.render('create-farm')
})

app.get('/admin/types',async (req,res) =>{
  const types = await Type.find({})

  return res.render('types',{
    types:types
  })
})

app.get('/admin/types/create',async (req,res) =>{
  return res.render('create-type')
})

app.post('/admin/types', async (req, res) => {
  try {
    const { name, value } = req.body;

    // Create a new type using the Type model
    const newType = new Type({
      name,
      value
    });

    // Save the new type to the database
    const createdType = await newType.save();

    // Redirect to the types page or any other desired page
    res.redirect('/admin/types');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating the type.');
  }
});

app.delete('/admin/types/:id', async (req, res) => {
  try {
    const typeId = req.params.id;

    // Use Mongoose or any other method to find and delete the type
    const deletedType = await Type.findByIdAndDelete(typeId);

    if (!deletedType) {
      return res.status(404).send('Type not found.');
    }

    // Type deleted successfully
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the type.');
  }
});

app.get('/admin/links', async (req, res) => {
  try {
    const links = await RewardLink.find({});
    const types = await Type.find({});

    // Extract unique reward values from links
    const rewards = [...new Set(links.map(link => link.reward))];
    res.render('links', { links: links, types: types, rewards: rewards });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving the links.');
  }
});


const port = process.env.PORT || 3000;
app.listen(port,() => console.log('app is running on http://localhost:3000/'))
