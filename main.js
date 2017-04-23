if (!module.parent) {
  console.info(`# Usage:
This exports a function that accepts an order and pricing information.

  ## Order example:

    {
      name:String,
      qty:Number
    }

  ## Pricing example:

    {
      prices:
        [
          {
            name:String,
            unit_price:Number,
            special_qty:Number,
            special_price:Number
          },
          …
        ]
    }

See \`test.js\` for a usage example.

If no pricing information is provided, a request will be made to an external pricing service.`);
}

var priceData = require('./data');

// var XMLHttpRequest = XMLHttpRequest || require("xmlhttprequest").XMLHttpRequest;
// var req = new XMLHttpRequest();
// req.onreadystatechange = function() {
//   var DONE = this.DONE || 4;
//   if (this.readyState === DONE){
//     res = this.responseText;
//     if (!res || !res.length) return console.error("No response");
//     setPriceData(JSON.parse(res));
//   }
// };
// req.open('GET', 'https://api.myjson.com/bins/gx6vz', true);
// req.send();

module.exports = function getPrice(order, pricing) {
  if(!order || order.constructor !== Array || !order.length) return 0;
  if(!pricing && !priceDataLoaded()) return 'Loading price information…';

  if(pricing) priceData = setPriceData(pricing);
  return order.map(getItemPrice).reduce(getOrderPrice);
};

function priceDataLoaded() {
  return !(Object.keys(priceData).length === 0 && priceData.constructor === Object);
}

function setPriceData(data) {
  if (!data) return {};

  priceData = {};

  data.prices.map(function(item){
    priceData[item.name] = item;
  });

  return priceData;
}

function getOrderPrice(prev, next) {
  return prev + next;
}

function getItemPrice(item) {
  if (item && item.qty && priceData[item.name]) {
    var catalogItem = priceData[item.name];

    if (item.qty === catalogItem.special_qty)
      return catalogItem.special_price;

    return priceData[item.name].unit_price * item.qty;
  }
  return 0;
}
