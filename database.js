const fs = require('fs');
const { formatDate } = require('./helper');

const schema = {
  id: "",
  name: "",
  transactions: [{
    totalRaw: {
      amount: 0,
      blockchain: ""
    },
    total: 0,
    createdAt: "",
  }]
}

const filePath = 'temp/data.txt';

function saveToFile(data) {
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    console.log('Data saved to file');
}

function loadFromFile() {
    if (!fs.existsSync(filePath)) {
        return []; 
    }

    let data = fs.readFileSync(filePath, 'utf8');
    if (data.length == 0) {
      data = "[]"
    }
    return JSON.parse(data); 
}

function addItem(newItem) {
    const array = loadFromFile();
    array.push(newItem); 
    saveToFile(array); 
}

function updateItem(id, newItem) {
  const array = loadFromFile();
  const data = array.map(elm => {
    if (elm.id == id) {
      elm = newItem
    }
    return elm
  })

  saveToFile(data); 
}

function getItem() {
  return loadFromFile();
}

function findItem(id) {
  return loadFromFile().find(elm => {
    if (elm.id == id) return elm
  });
}

module.exports = {addItem, updateItem, getItem, findItem, schema}
