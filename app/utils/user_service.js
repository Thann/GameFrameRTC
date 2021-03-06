require('backbone.localstorage')

// UserService
module.exports = {
	init: function() { // sets up the username, and stuff.
		if(typeof(Storage) !== "undefined") {
			var localUsers = new (Backbone.Collection.extend({
				// idAttribute: 'name',
				// modelId: function(attrs) {return attrs.name},
				localStorage: new Backbone.LocalStorage("RTChat_Users"),
			}))()
			this.localUsers = localUsers;

			localUsers.fetch();

			this.currentUser = localUsers.get(window.localStorage.getItem('RTChat_LatestUser')) ||
				localUsers.first();

			// console.log("found user:", this.currentUser)
			if (!this.currentUser) { this.create(); }

			window.localStorage.setItem('RTChat_LatestUser', this.currentUser.id)

		} else {
			console.log("Sorry! No Web Storage support..");
		}
	},
	create: function(name) {
		this.currentUser = this.localUsers.create({
			name: name || "Guest_"+parseInt(Math.random()*10000).toString()
		});
		console.log(this.currentUser)
	},
	updateName: function(newName) {
		this.currentUser.name = newName;
		this.currentUser.save();
	},
	getExtras: function() {
		return {
			fullId: this.currentUser.id,
			name: this.currentUser.get('name')
		}
	}
}

module.exports.init();