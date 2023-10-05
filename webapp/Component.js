/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "zclaimapproval/model/models",
        "sap/f/library"
    ],
    function (UIComponent, Device, models,fioriLibrary) {
        "use strict";

        return UIComponent.extend("zclaimapproval.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                var oModel = new sap.ui.model.json.JSONModel();
                this.setModel(oModel, "layoutModel");
               //var oRouter = this.getRouter();
               this.getRouter().attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
               
            },
            _onBeforeRouteMatched: function(oEvent) {
                var oModel = this.getModel("layoutModel"),
                    sLayout = oEvent.getParameters().arguments.layout;
    
                if (!sLayout) {
                    sLayout = fioriLibrary.LayoutType.OneColumn;
                }
                if (sLayout !== "Shell-home") {
                    oModel.setProperty("/layout", sLayout);
                }
    
            }
        });
    }
);