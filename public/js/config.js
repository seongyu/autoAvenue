/**
 * Created by LeonKim on 16. 12. 23..
 */
angular.module('autoAvenue',[
    'ngRoute',
    'oc.lazyLoad',
    'autoAvenue.service',
    'autoAvenue.controller',
    'angular-loading-bar',
    'angularMoment'
]).run(function($location,$rootScope){
    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        var nowUrl = newLocation.split('/');
        var oldUrl = oldLocation.split('/');
        if(nowUrl[1]!=oldUrl[1]){
            $rootScope.savedPage = 0;
        }
    });
}).config(['$routeProvider','cfpLoadingBarProvider','$locationProvider',
    function($routeProvider, cfpLoadingBarProvider,$locationProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'html/login.html',
            controller: 'loginCtrl',
            resolve: {
                lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'init First',
                        files: ['js/sub/login.js']
                    }]);
                }]
            }
        })
        .when('/point',{
            templateUrl: 'html/pointList.html',
            controller: 'pointCtrl',
            resolve: {
                lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'init First',
                        files: ['js/sub/point.js']
                    }]);
                }]
            }
        })
        .otherwise({redirectTo: '/'});
        $locationProvider.hashPrefix('');
        cfpLoadingBarProvider.spinnerTemplate = spinnerTpl;
}]);

var token = '8fe1b4808c9bc3083eb4f33ad4086b41';
var spinnerTpl = '<div class="loading">' +
    '<div class="table_center"><p class="cell_center">' +
    '<i class="glyphicon glyphicon-refresh loading-spin"></i>' +
    '</p></div></div>';