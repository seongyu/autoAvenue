/**
 * Created by LeonKim on 16. 12. 24..
 */
angular.module('autoAvenue.controller',[])
.controller('loginCtrl',function($scope,$location){
        $scope.login = function(pwd){
            if(pwd=='auto4avenue'){
                location.href = '#/point';
            }
        }
    });