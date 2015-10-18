Meteor.methods({
    createOffer: function (selectedItemId, selectedItemOwnerId, offeredItemId) {
        check(selectedItemId, String);
        check(selectedItemOwnerId, String);
        check(offeredItemId, String);

        var now = new Date(),
            duplicateOffer = Offers.findOne({selectedItemId: selectedItemId, offeredItemId: offeredItemId}),
            user = Meteor.user();

        if (!user) {
            throw new Meteor.Error('user-not-logged-in', 'You need to login to make an offer.');
        }
        if (duplicateOffer) {
            throw new Meteor.Error('this-offer-already-exists', 'This offer was already made.');
        } else {
            Offers.insert({
                selectedItemId: selectedItemId,
                selectedItemOwner: selectedItemOwnerId,
                offeredItemId: offeredItemId,
                offeredBy: user._id,
                offeredAt: now,
                openTrade: false,
                cancelOffer: 'undefined'
            });
        }
    },
    acceptOffer: function (offerId) {
        check(offerId, String);

        var user = Meteor.user(),
            offer = Offers.findOne(offerId),
            offerStatus = typeof offer.cancelOffer,
            tradeStatus = offer.openTrade;

        if (!user) {
            throw new Meteor.Error('user-not-logged-in', 'You need to login to accept the offer.');
        }
        if (!offer) {
            throw new Meteor.Error('undefined-offer-id', 'The offerId ' + offerId + ' cannot be found in the Offers collection.');
        }
        if (offerStatus === 'object') {
            throw new Meteor.Error('offer-cancelled', 'The offerId ' + offerId + ' was already cancelled.');
        }
        if (tradeStatus) {
            throw new Meteor.Error('offer-trade-open', 'The offerId ' + offerId + ' is already open for trading in the Trades collection');
        } else {
            Offers.update(offerId, {$set: {openTrade: true}});

            // Moved this call to client in offer event - click .accept.offer.button
            // nested inside the acceptOffer call - when it passes, it calls createTrade
            // if that passes, it routes to /trade
            // you can remove this after reading
            //Meteor.call('createTrade', offerId, function (error) {
            //  console.error('createTrade method failed: ' + error.reason);
            //});
        }
    },
    cancelOffer: function (offerId, cancelAttributes) {
        check(offerId, String);

        var user = Meteor.user(),
            offer = Offers.findOne(offerId);

        if (!user) {
            throw new Meteor.Error('user-not-logged-in', 'You need to login to cancel the offer.');
        }
        if (!offer) {
            throw new Meteor.Error('undefined-offer-id', 'The offerId ' + offerId + ' cannot be found in the Offers collection.');
        } else {
            Offers.update(offerId, {$set: {cancelOffer: cancelAttributes, openTrade: false}});
            //@TODO: if offerId === tradeId => remove from trades collection
        }
    }
});