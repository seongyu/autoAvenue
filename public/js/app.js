/**
 * Created by LeonKim on 16. 12. 23..
 */
angular.module('autoAvenue.controller',[])
.controller('appCtrl',function($scope){
        $scope.defaultPage = 5;
        $scope.totalPage = 0;
        $('body').fadeIn();
    });