Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
        var userLily = Accounts.createUser({
            'username': 'lily',
            'password': 'lily123',
            'profile': {
                'name': 'Lily Ebele',
                'email': 'lily@quicktrade.com'
            }
        });
        var userOskar = Accounts.createUser({
            'username': 'oskar',
            'password': 'oskar123',
            'profile': {
                'name': 'Oskar Sarika',
                'email': 'oskar@quicktrade.com'
            }
        });
    }

    if (Posts.find().count() === 0) {
        var now = new Date(),
            lily = Meteor.users.findOne(userLily),
            oskar = Meteor.users.findOne(userOskar);

        Posts.insert({
            title: 'Les Paul',
            thumbnail: '/images/posts/lily/lespaul.jpg',
            userId: lily._id,
            username: lily.username,
            submitted: now,
            likes: 0
        });

        Posts.insert({
            title: 'Old Guitar',
            thumbnail: '/images/posts/lily/lespaul.jpg',
            userId: lily._id,
            username: lily.username,
            submitted: now,
            likes: 0
        });

        Posts.insert({
            title: 'AMP',
            thumbnail: '/images/posts/oskar/amp.jpg',
            userId: oskar._id,
            username: oskar.username,
            submitted: now,
            likes: 0
        });
    }
});