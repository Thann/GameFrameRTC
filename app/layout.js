
$(function(){
document.GameFrameRTC = {
	AppLayout: Backbone.View.extend({
		el: $('body'),
		template: '\
			<div id="top-bar">\
				<div class="fa fa-bars"></div>\
				<div>IMG</div>\
				<div data-subview="user"></div>\
			</div>\
			<div id="main-bar">\
				<div id="left-side-bar">Side Bar</div>\
				<div data-subview="main"></div>\
				<div id="right-side-bar" class="right hidden">Right Side Bar</div>\
			</div>\
			<div id="bottom-bar">Bottom Bar</div>',
		events: {
			'click .fa-bars': function() { $('#left-side-bar').toggleClass('hidden'); },
		},
		initialize: function() {
			Backbone.Subviews.add( this );
		},
		subviewCreators: {
			user: function() { return new document.GameFrameRTC.UserMenu },
			main: function() { return new document.GameFrameRTC.MainPanel },
		},
		render: function(){
			console.log('rendering layout!')
			this.$el.html(this.template);
			return this;
		}
	}),

	UserMenu: Backbone.View.extend({
		className: 'float-right dropdown navbar-right',
		template: '\
			<div class="dropdown-toggle" data-toggle="dropdown">\
				{ scope.userName } <span class="fa fa-chevron-down"></span>\
			</div>\
			<ul class="dropdown-menu">\
				<li id="edit-btn">Edit</li>\
				<li class="disabled">Coming Soon ----</li>\
				<li class="disabled">Sync user w/ Dropbox</li>\
				<li class="disabled">Settings</li>\
				<li class="disabled">Friends</li>\
				<li class="disabled">Switch User</li>\
			</ul>',
		editNameTemplate: '\
			<div><input type="text" rv-value="scope.userName"></div>',
		// UserService: document.GameFrameRTC.UserService
		initialize: function() {
		// 	// this.UserService = new document.GameFrameRTC.UserService;
			if(typeof(Storage) !== "undefined") {
				//TODO: use backbone.localStorage?
				this.scope.userName = window.localStorage.getItem('UserName')
				console.log("found user:", this.scope.userName)
				if (!this.scope.userName) {
					this.scope.userName = "Guest_"+parseInt(Math.random()*10000).toString();
					window.localStorage.setItem('UserName', this.scope.userName)
				}
			} else {
				console.log("Sorry! No Web Storage support..")
			}
		},
		events: {
			'click #edit-btn': function() {
				console.log("clicked!");
				this.$el.removeClass('open') //Hack?
				this.render(true);
				this.$el.find('input').select();
			},
			'keyup input': function(ev) {
				if (ev.keyCode == 13) this.updateName();
			},
			'blur input': 'updateName'
		},
		render: function(edit){
			// this.scope.userName = window.localStorage.getItem('UserName')
			if (edit)
				this.$el.html(this.editNameTemplate);
			else
				this.$el.html(this.template);
			var rvo = rivets.bind(this.$el, {scope: this.scope})
			console.log('rivets..', rvo)
			return this;
		},
		updateName: function() {
			window.localStorage.setItem('UserName', this.scope.userName)
			this.render();
		},
		scope: {} // Used for Rivets..
	}),

	// Wraps the main App
	MainPanel: Backbone.View.extend({
		id: 'main-panel',
		welcomeTemplate: '<div data-subview="welcome"></div>',
		gameTemplate: '<div data-subview="game"></div>',
		initialize: function() {
			Backbone.Subviews.add( this );
		},
		subviewCreators: {
			welcome: function() { return new (document.GameFrameRTC.app.WelcomePanel) },
			game: function() { return new (document.GameFrameRTC.app.GamePanel) }
		},
		render: function(){
			this.$el.html(this.template);

			var self = this;
			$(window).on('hashchange', function() {
				console.log('Loc:', window.location.hash);
				self.render();
			})

			if (document.location.hash.length == 0)
				this.$el.html(this.welcomeTemplate)
			else
				this.$el.html(this.gameTemplate)

			return this;
		}
	}),

	// ==== INIT ====
	init: function() {
		(new this.AppLayout).render();
	}

}});

// .app is where the game.app lives...
$(function(){
document.GameFrameRTC.app = {
	WelcomePanel: Backbone.View.extend({
		template: 'pick a room!',
		render: function(){
			this.$el.html(this.template);
			return this;
		}
	}),
	GamePanel: Backbone.View.extend({
		template: 'ur in room ',
		render: function(){
			this.$el.html(this.template + window.location.hash);
			return this;
		}
	}),
}});


// Demos extending GamePanel.
// $(function() {
// 	document.GameFrameRTC.GamePanel = document.GameFrameRTC.GamePanel.extend({
// 		template: 'blaaaaaah'
// 	})
// })
