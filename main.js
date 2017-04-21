// This is implemented mostly as a
// test runner, but you can pass arbitrary
// orders to `getPrice` to actually use this.

var priceData = {};

var XMLHttpRequest = XMLHttpRequest || require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();
req.onreadystatechange = function() {
  var DONE = this.DONE || 4;
  if (this.readyState === DONE){
    res = this.responseText;
    if (!res || !res.length) return console.error("No response");
    setPriceData(JSON.parse(res));

    // TODO: OK, it's a bit silly having test orders against an XHR response that's
    // likely dynamic – this should really live in a separate integration
    // test suite with mocked responses for some stability.

    var testOrders = [
      // Single item, undefined quantity
      {order:[{name:"A"}], expect: 0},
      // Single item, single quantity
      {order:[{name:"A", qty:1}], expect: 20},
      // Single item, double quantity
      {order:[{name:"A", qty:2}], expect: 40},
      // Single item, special price
      {order:[{name:"A", qty:3}], expect: 50},
      // Two item types, [one special_qty, one without]
      {order:[{name:"A", qty:3}, {name:"C", qty:3}], expect: 170},
      // Two item types, [regular, special price]
      {order:[{name:"A", qty:1}, {name:"B", qty:4}], expect: 100},
      // Multiple items, [regular and special qty and no set special qty]
      {order:[{name:"A", qty:1}, {name:"B", qty:4}, {name:"C", qty:4}], expect: 260},
      // Unknown item
      {order:[{name:"ZZ", qty:1}], expect: 0},
      // Unknown and known items [unknown, special qty, no set special qty]
      {order:[{name:"ZZ", qty:1}, {name:"B", qty:4}, {name:"C", qty:4}], expect: 240}
    ];

    testOrders.map(function(test) {
      var price = getPrice(test.order);
      var expectedPrice = test.expect;

      if (price === expectedPrice)
        console.log(JSON.stringify(test.order) + ' passed 👌');
      else
        console.error(`😟 Expected ${expectedPrice}, got ${price}:
          `+ JSON.stringify(test.order))
    });
  }
};
req.open('GET', 'https://api.myjson.com/bins/gx6vz', true);
req.send();

function setPriceData(data) {
  // var input = {"prices":[
  //   {"name":"A","unit_price":20,"special_qty":3,"special_price":50},
  //   {"name":"B","unit_price":30,"special_qty":4,"special_price":80},
  //   {"name":"C","unit_price":40},
  //   {"name":"D","unit_price":50,"special_qty":2,"special_price":90},
  //   {"name":"E","unit_price":60}
  // ]};
  data.prices.map(function(item){
    priceData[item.name] = item;
    delete priceData[item.name].name;
  });
}

function getPrice(order) {
  if(!order || order.constructor !== Array || !order.length)
    return 0;

  return order.map(getItemPrice).reduce(getOrderPrice);
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