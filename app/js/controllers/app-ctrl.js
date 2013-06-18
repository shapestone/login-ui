'use strict';

function appCtrl($rootScope, AclService) {
    $rootScope.acl = AclService.query(function (data) {
        $rootScope.acl = data;
    });
}
