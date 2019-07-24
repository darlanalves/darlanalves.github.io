angular.module('test', []).controller('TestCtrl', function($scope) {
    var User = Gisele.Model.create({
        id: {
            type: Number,
            readOnly: true
        },
        name: String,
        email: String,
        active: {
            type: Boolean,
            default: false
        }
    });

    var bob = new User({
        id: 1,
        name: 'Bob',
        email: 'bob@example.com'
    });

    $scope.user = bob;

    var commit = Gisele.Model.fn.commit;

    Gisele.Model.fn.commit = function() {
        console.log('Changes applied', this.changed);
        commit.call(this);
    };

});
