
var rivets = require('rivets');

var RTCWrapper = require('utils/rtc_wrapper.js');
var ChatBox = require('views/chat_panel.js');

// RoomPanel
module.exports = Backbone.View.extend({
	id: 'RoomPanel',
	template: `
		<a class="btn btn-default" href="#"><- Leave</a>
		<br>
		You're in room { scope.roomName }
		<br>
		<div class="room-subject">
			<button class="btn btn-default">EDIT</button>
			<span> { scope.roomSubject } </span>
		</div>
		<br><br>Users:
		<ul id="users-panel">
			<li rv-each-user="scope.users" rv-show="user.extra.name">
				{ user.extra.name }
			</li>
		</ul>
		<div data-subview="chat"></div>
	`,
	events: {
		'click .room-subject .btn': function() {
			RTCWrapper.updateState({roomSubject: window.prompt("New Subject:")});
		}
	},
	initialize: function() {
		Backbone.Subviews.add( this );
		var self = this;
		RTCWrapper.onStateChange(function(old, newState) {
			console.log("StateUpdate", old, newState)
			self.scope.roomSubject = newState.roomSubject;
		});
	},
	subviewCreators: {
		chat: function() { return new ChatBox(); },
	},
	render: function(){
		this.scope.roomName = window.location.hash
		this.scope.users = RTCWrapper.users

		this.$el.html(this.template);
		var rvo = rivets.bind(this.$el, {scope: this.scope})
		return this;
	},
	scope: {},
})