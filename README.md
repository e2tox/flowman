
## Flowman

A lightweight (25 SLOC) async flow control to convert your callbacks to promise

## Installation

```bash
$ npm install flowman;.
```

## Usage

```js

var flow = require('flowman');

var combine = flow.sequential(
    function(input, next){
        setTimeout(function(){
            next(null, input.first, input.family);
        }, 5);
    },
    function(first, family, next){
        setTimeout(function(){
            next(null, first + ', ' + family);
        }, 5);
    });

combine({first:'Ling', family:'Chang'}).done(function(name){
    name.should.equal('Ling, Chang');
});

```