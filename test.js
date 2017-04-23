var getPrice = require('./main');
var mockPriceData = {"prices":[{"name":"A","unit_price":20,"special_qty":3,"special_price":50},{"name":"B","unit_price":30,"special_qty":4,"special_price":80},{"name":"C","unit_price":40},{"name":"D","unit_price":50,"special_qty":2,"special_price":90},{"name":"E","unit_price":60}]};

[ // Single item, undefined quantity
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
].map(function(test) {
  var price = getPrice(test.order, mockPriceData);
  var expectedPrice = test.expect;

  if (price === expectedPrice)
    console.log('✅ ' + JSON.stringify(test.order) + ' passed');
  else
    console.error(`❌ Expected ${expectedPrice}, got ${price}:
      `+ JSON.stringify(test.order))
});
