'use strict';

function loginCtrl($scope,$location, LoginService) {
    $scope.loginData = {isValid:false};
    $scope.showLoginError= false;
    $scope.authenticate = function(){
        LoginService.authenticate($scope.loginData,function (data) {
            $scope.loginData.isValid = data.isValid;
            if(data.isValid){
                $scope.showLoginError= false;
                $location.path("/landing");
                $scope.closeModal();
            }else{
                $scope.showLoginError= true;
            }
        });
    }

    $scope.closeModal = function () {
        $('#type').focus();
        $('.modal').modal('hide');
    };

}

