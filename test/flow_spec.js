/**
 * Copyright 2013 =E.2=TOX
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Created by ling on 12/18/13 9:12 PM
 */

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
