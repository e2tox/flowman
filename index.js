var when = require('when');


var extensions = {
    start: function(promise, boot) {
        var step = 0, state = {}, steps = this.steps;
        function next(/* error, arguments... */) {
            var fn = steps[step++]
                , args = Array.prototype.slice.call(arguments)
                , err = args.shift();
            if (err) {
                promise.reject(err);
                return;
            }
            if (!fn) {
                promise.resolve(args.shift());
                return;
            }
            args.push(next);
            try {
                fn.apply(state, args);
            }
            catch(e) {
                promise.reject(e);
            }
        }
        boot.unshift(null);
        next.apply(state, boot);
    }
};


exports.sequential = function (/* functions... */) {
    function flow() {
        var p = when.defer();
        flow.start(p, Array.prototype.slice.call(arguments));
        return p.promise;
    }
    flow.start = extensions.start;
    flow.steps = Array.prototype.slice.call(arguments);
    return flow;
};