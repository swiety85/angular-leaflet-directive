angular.module("leaflet-directive").directive('controls', function ($log, leafletHelpers, leafletControlHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: '?^leaflet',

        link: function(scope, element, attrs, controller) {
            if(!controller) {
                return;
            }

            var createControl = leafletControlHelpers.createControl;
            var isValidControlType = leafletControlHelpers.isValidControlType;
            var leafletScope  = controller.getLeafletScope();
            var isDefined = leafletHelpers.isDefined;
            var leafletControls = {};
            var errorHeader = leafletHelpers.errorHeader + ' [Controls] ';

            controller.getMap().then(function(map) {

                leafletScope.$watchCollection('controls', function(newControls) {

                    // Delete controls from the array
                    for (var name in leafletControls) {
                        if (!isDefined(newControls[name])) {
                            if (map.hasControl(leafletControls[name])) {
                                map.removeControl(leafletControls[name]);
                            }
                            delete leafletControls[name];
                        }
                    }

                    for (var newName in newControls) {
                        var control;

                        var controlType = isDefined(newControls[newName].type) ? newControls[newName].type : newName;

                        if (!isValidControlType(controlType)) {
                            $log.error(errorHeader + ' Invalid control type: ' + controlType + '.');
                            return;
                        }

                        if (controlType !== 'custom') {
                            control = createControl(controlType, newControls[newName]);
                        } else {
                            control = newControls[newName];
                        }
                        map.addControl(control);

                        leafletControls[newName] = control;
                    }

                });

            });
        }
    };
});
