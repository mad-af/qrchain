function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear(); 

  const hours = String(date.getHours()).padStart(2, '0'); 
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function getCryptoPrices() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,zetachain&vs_currencies=usd');
  const data = await response.json();
  
  return { 
    BTC: data.bitcoin.usd,
    ETH: data.ethereum.usd,
    ZETA: data.zetachain.usd,
   };
}

module.exports = {getCryptoPrices, formatDate}