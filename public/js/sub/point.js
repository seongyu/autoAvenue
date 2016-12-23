/**
 * Created by LeonKim on 16. 12. 24..
 */
angular.module('autoAvenue.controller',[])
.controller('pointCtrl',function($scope,Request,$rootScope){
        $scope.search = {limit:15};
        $scope.items = [];

        $scope.total = 0;
        $scope.selectPage = $rootScope.savedPage ? $rootScope.savedPage : 0;
        $scope.nowPage =  parseInt($scope.selectPage/5);
        $scope.prev = function(){
            $scope.nowPage = $scope.nowPage-1;
        };
        $scope.next = function(){
            $scope.nowPage = $scope.nowPage+1;
        };
        $scope.getList = function(search,page){
            $rootScope.savedPage = page;
            search.page = page;
            Request.post('statPntAll',search)
                .then(function(rtn){
                    if(rtn.resultCode!=200){
                        alert(rtn.message);
                    }else{
                        console.log(rtn)
                        $scope.total = rtn.result.total;
                        $scope.totalPage = rtn.result.totalPage;
                        $scope.items = rtn.result.rows;
                    }
                })
        };

        $scope.find = function(search){
            search.memCd==''?delete search.memCd:null;
            search.pntType==''?delete search.pntType:null;
            $scope.getList(search,0);
        };

        $scope.getList($scope.search,$scope.selectPage);
    });