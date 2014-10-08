var assert = require("assert");
var jsonify = require("../lib/json_udp.js").jsonify;

describe('Jsonify', function(){
	describe('jsonify', function(){
		it('should return key-value with timestamp in jsonformat', function(){
			assert.equal("{\"flushTimestamp\":\"123\",\"type\":\"lmm-test\",\"name\":\"test.timer\",\"value\":100,\"type_instance\":\"\"}\n",
				     jsonify("123", "lmm-test", "test.timer", "",100));
		    })
		    
		    it('should return key-value with timestamp in jsonformat, usage for timers', function(){
			    //usage for timers
			    var subname= "std";
			    assert.equal("{\"flushTimestamp\":\"123\",\"type\":\"lmm-test\",\"name\":\"test.timer\",\"value\":100,\"type_instance\":\"mean\"}\n",
				     jsonify("123", "lmm-test", "test.timer", "mean",100));			    
			    
			})
		    })
	    
	    })