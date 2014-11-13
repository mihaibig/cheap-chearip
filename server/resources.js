module.exports = function(allocationStrategy) {
	var resources = [];
	Array.prototype.swap = function(a, b){
	    this[a] = this.splice(b, 1, this[a])[0];
	    return this;
	}
	return {
		add: function(name, resource) {
			resources.push({name: name, res: resource, usedBy: 0});
		},
		remove: function(name) {
			for (var i = resources.length - 1; i >= 0; i--) {
				if(resources[i].name === name) {
					resources.splice(i, 1);
					break;
				}
			};
		},
		aquire: function(callback) {
			var tries = 0;
			var search = function () {
				tries ++;
				for (var i = resources.length - 1; i >= 0; i--) {
					if(allocationStrategy.canAllocate(resources[i])) {
						resources[i].usedBy++;						
						while(i > 0 && resources[i].usedBy > resources[i - 1].usedBy) {
							resources.swap(i, i - 1);
							i--;
						}					
						callback(null, resources[i]);	
						return;
					}
				};				
				if(tries < allocationStrategy.numberOfRetries) setTimeout(search, allocationStrategy.timeBetweenRetries)
				else callback("Unable to aquire resource!")
			}	
			setTimeout(search, 1);				
		},
		release: function(name) {
			for (var i = resources.length - 1; i >= 0; i--) {
				if(resources[i].name === name) {
					resources[i].usedBy--;
					while(i < resources.length - 1 && resources[i].usedBy < resources[i + 1].usedBy) {
						resources.swap(i, i + 1);
						i++;
					}
					break;
				}
			};
		}
	}
}