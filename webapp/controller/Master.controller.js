sap.ui.define([
    "sap/ui/core/mvc/Controller",	
    'sap/f/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,fioriLibrary) {
        "use strict";

        return Controller.extend("zclaimapproval.controller.Master", {
            onInit: function () {
               this.onSort();
            },
            onSort:function(){
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("detail", {
                    layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
                    //	layout:fioriLibrary.LayoutType.TwoColumnsBeginExpanded,
                    ID: "123"
                });
            }
        });
    });
