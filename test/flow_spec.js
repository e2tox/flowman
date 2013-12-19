var flowman = require('../index')
    , assert = require('assert')
    , should = require('should');


describe('flow', function(){
    describe('#sequential()', function() {


        it('should return as function', function(done){
            var seq = flowman.sequential(function(next){
                    next();
                });
            seq.should.be.type('function');
            done();
        });


        it('should be done', function(done){
            var seq = flowman.sequential(function(next){
                    next();
                });
            seq().done(function(){
                done();
            });
        });


        it('should return true', function(done){
            var seq = flowman.sequential(function(next){
                    next(null, true);
                });
            seq().done(function(result){
                result.should.equal(true);
                done();
            });
        });


        it('should not done', function(done){
            var seq = flowman.sequential(function(next){
                    next('not good');
                });
            seq().done(function(){
                assert.fail();
            }, function(error){
                error.should.equal('not good');
                done();
            });
        });

        it('should catch error', function(done){
            var seq = flowman.sequential(function(){
                    throw new Error('you see it');
                });
            seq().catch(function(error) {
                error.should.be.an.instanceof(Error).and.have.property('message').equal('you see it');
                done();
            });
        });

        it('should have an end', function(done){
            var seq = flowman.sequential(function(){
                throw new Error('you see it');
            });
            seq().catch(function(error) {
                error.should.be.an.instanceof(Error).and.have.property('message').equal('you see it');
            }).finally(function(){
                done();
            });
        });

        it('should return combined string', function(done){
            var seq = flowman.sequential(
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

            seq({first:'Ling', family:'Chang'}).done(function(name){
                name.should.equal('Ling, Chang');
                done();
            });
        });

    });
});
