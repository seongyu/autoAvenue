/**
 * Created by LeonKim on 16. 12. 23..
 */
angular.module('autoAvenue.service',[])
.factory('Request',function($http,$q){
        var request = {};
        var headers = {'Content-Type':'application/json'};
        request.get = function(uri){
            var defer = $q.defer();
            $http({
                method:'GET',
                url:token+'/'+uri,
                headers:headers
            }).then(function(result){
                defer.resolve(result.data);
            },function(err){
                defer.reject(err);
            });
            return defer.promise;
        };
        request.post = function(uri,param){
            var defer = $q.defer();
            $http({
                method:'POST',
                url:token+'/'+uri,
                data:param,
                headers:headers
            }).then(function(result){
                defer.resolve(result.data);
            },function(err){
                defer.reject(err);
            });
            return defer.promise;
        };
        request.put = function(uri,param){
            var defer = $q.defer();
            $http({
                method:'PUT',
                url:token+'/'+uri,
                data:param,
                headers:headers
            }).then(function(result){
                defer.resolve(result.data);
            },function(err){
                defer.reject(err);
            });
            return defer.promise;
        };

        return request;
    });