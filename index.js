var when = require('when');


var extensions = {


    sequential: function(promise, boot) {
        var step = 0, state = {}, steps = this.steps;
        function done(result) {
            promise.resolve(result);
        }
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
            args.push(done);
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
        flow.sequential(p, Array.prototype.slice.call(arguments));
        return p.promise;
    }
    flow.sequential = extensions.sequential;
    flow.steps = Array.prototype.slice.call(arguments);
    return flow;
};
