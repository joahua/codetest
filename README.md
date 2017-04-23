# Pricing service

## Usage:
This exports a function that accepts an order and pricing information.

```
require('./main')(order, pricing);
```

See `test.js` for a usage example.

### Order example:

```
{
  name:String,
  qty:Number
}
```

### Pricing example:

```
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
```

If no pricing information is provided, a request will be made to an external pricing service. This is just a JSON file.

## How to make it do a thing

```
npm install && npm run test
```
