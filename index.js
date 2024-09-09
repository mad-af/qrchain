const express = require('express');
const app = express();
const path = require('path');
const QRCode = require('qrcode');
const { findItem, addItem, getItem, schema, updateItem } = require('./database');
const { randomUUID } = require('crypto');
const { formatDate, getCryptoPrices } = require('./helper');
require('dotenv').config();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json()) 

// Define a route to render the ejs file
app.get('/', (req, res) => {
    const list = getItem()
    res.render('index', { list });
});

app.get('/merchent/:merchentID', async (req, res) => {
  const { merchentID: id } = req.params
  const qr = await QRCode.toDataURL(`${process.env.HOST}/payment/${id}`)
  const data = findItem(id)
  if (!data) {
    res.redirect('/')
  } else {
    data.transactions = data.transactions.sort((a, b) => b.createdAt - a.createdAt).map(elm => {
      elm.createdAt = formatDate(new Date(elm.createdAt))
      return elm
    })
    res.render('merchent-detail', { qr, data });
  }

});

app.get('/payment/:merchentID', (req, res) => {
  const { merchentID: id } = req.params
  const data = findItem(id)
  res.render('payment', { data });
});

// API
app.post('/api', (req, res) => {
  const {name} = req.body
  const data = schema
  data.id = randomUUID()
  data.name = name
  data.transactions=[]
  addItem(data)
  res.json({id: data.id});
});

app.post('/api/payment', async (req, res) => {
  const {merchentID, blockchain, total} = req.body
  
  const bc = await getCryptoPrices()
  const data = findItem(merchentID)
  const coba = bc[blockchain] / bc.ZETA 
  
  data.transactions.push({
    totalRaw: {
      amount: total,
      blockchain: blockchain
    },
    total: total * (bc[blockchain] / bc.ZETA),
    createdAt: Date.now(),
  })

  updateItem(merchentID, data)
  res.json({id: data.id});
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});