// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".



if (Meteor.isClient) {
  Players = new Meteor.Collection();

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.rendered = function () {
    this.firstNode._uihooks = {
      insertElement: function (node, next) {
        var data = UI.getElementData(node);

        console.log(data.name);

        $(node)
            .addClass('hidden')
            .data('test', { some: 'data'})
            .insertBefore(next)
            .fadeIn({duration: 500})
            .promise()
            .done(function () {
              $(this).removeClass('hidden');
              console.log($(this).data('test'));
            });
      },
      removeElement: function (node) {
        var data = UI.getElementData(node);

        //BUG #1 the data nodes on the element set by jquery are cleared before removeElement
        console.log($(node).data('test'));

        //BUG #2 getElementData returns null for the to be removed node
        console.log(data.name);

        $(node).animate({
          height: 0,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0
        }, {duration: 500, complete: function () {
          $(node).remove();
        }});
      }
    };
  };

  Template.leaderboard.events({
  	'click input.addPlayer': function () {
		var names = ["Ada Lovelace",
			"Grace Hopper",
			"Marie Curie",
			"Carl Friedrich Gauss",
			"Nikola Tesla",
			"Claude Shannon"];
		Players.insert({name: names[Math.floor(Math.random() * 6) + 1], score: Math.floor(Random.fraction()*10)*5});
    }
  });

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
		Players.remove(this._id);
    }
  });
}