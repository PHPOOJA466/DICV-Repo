sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "zclaimapproval/model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,formatter) {
        "use strict";
var FinalData = [],Reasons="";
        return Controller.extend("zclaimapproval.controller.Detail", {
            formatter: formatter,
            onInit: function () {
                //this.getOwnerComponent().getModel("layoutModel").setProperty("/layout", "TwoColumnsMidExpanded");
              //  var oOwnerComponent = this.getOwnerComponent();
                //this.getOwnerComponent()._dataProvider.setDisplayModel(this.getView());
              //  this.si18n = oOwnerComponent.getModel("i18n").getResourceBundle();
                this.oRouter = this.getOwnerComponent().getRouter();
           //  this._onWFObjectMatched();
             this.oRouter.getRoute("wfobject").attachPatternMatched(this._onWFObjectMatched, this);
               
            },
            _onWFObjectMatched:function(oEvent){
                if(oEvent){
                this.InstanceId = oEvent.mParameters.arguments.wfInstanceId;
                }
                var oModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(oModel,"ClaimModel");
                this.getTaskData();
                this.getLink();
            },
            getLink:function(){
                var that = this;
                var system = 'LOCAL_TGW';
                var Path =  '/TaskCollection(SAP__Origin=' + "'" + system + "'" + ',InstanceID=' + "'" + this.InstanceId + "'" + ')' + '/TaskObjects';
                //var Path = "/TaskCollection(SAP__Origin='LOCAL_TGW',InstanceID='000000017721')/TaskObjects";
              this.getOwnerComponent().getModel("TaskProcessing").read(Path,{
           success:function(oData){
            var Results = oData;
            var oModel = new sap.ui.model.json.JSONModel(oData.results[0]);
            that.getView().setModel(oModel,"LinkModel");
           }
              });
            },
            onLinkPress:function(oEvent){
              var Data = this.getView().getModel("LinkModel").getData();
              sap.m.URLHelper.redirect(Data.ObjectLink, true);
            },
            getTaskData:function(){
           //this.InstanceId = '000000018118';
         // this.InstanceId="000000016654";
        // this.InstanceId="000000020003";
         // this.InstanceId="000000018681";
                var that=this;
                var filters=[];
                filters.push(new sap.ui.model.Filter("Taskno", sap.ui.model.FilterOperator.EQ, this.InstanceId));
                this.getOwnerComponent().getModel().read("/EtClmAppSet", {
                    urlParameters: {
                        $expand: ["ClmtyNav"]
                    },
                    filters: filters,
                    success: that.taskSuccess.bind(that),
                    error: that.Error.bind(that)
                });
            },
            taskSuccess:function(oEvent){
                FinalData = oEvent;
               var oModel = new sap.ui.model.json.JSONModel(oEvent.results[0]);
               if(oEvent.results[0]){
                Reasons = oEvent.results[0].Wrice;
               this.setHeaderData(oEvent.results[0].ClmtyNav.results);
               this.setItemData(oEvent.results[0].ClmtyNav.results);
               }
               this.getView().setModel(oModel,"ClaimModel");
               this.getimage();
            },
            Error:function(){

            },
            setHeaderData: function(array) {
                var oForm = this.getView().byId('idCheckinDispForm');
                var arr1 = array.filter((v,i,a)=>a.findIndex(v2=>(v.Grpnm === v2.Grpnm && v.Fldty === 'H'))===i);
                arr1 =  arr1.sort((a, b) => (a.Tecfl > b.Tecfl) ? 1: -1);  
                for (var index1 = 0; index1 < arr1.length; index1++) {
                    var arr = array.filter(function(val, idx) {
                        return (val.Grpnm === arr1[index1].Grpnm);
                    });
                    var container = new sap.ui.layout.form.FormContainer({
                        "expandable": true,
                        "expanded": true,
                        "title": arr1[index1].Grpnm
                    });
                    for (var index = 0; index < arr.length; index++) {
                  
                    var formelement = new sap.ui.layout.form.FormElement({
                        "label": arr[index].Fldes
                    });
                    formelement.addField(new sap.m.Label({
                        "text": arr[index].Value
                    }));
                    container.addFormElement(formelement);
                    oForm.addFormContainer(container);
                    // oForm.addContent( new sap.m.Label({ text: arr.pages[index].title }) );
                    //oForm.addContent( new sap.m.Input({ type: sap.m.InputType.Text, placeHolder: "Some Text" }) );
                }
            }
            },
            setItemData:function(Data){
              var that = this;
                var aData1 =  Data.filter(function(val, idx) {
                    return (val.Grpnm === "ITEM DETAILS");
                });
                //aData1 = aData1.sort((a, b) => (a.Slnum < b.Slnum) ? 1 : -1);
              //  aData1 = aData1.sort((a, b) => (a.Slnum > b.Slnum) ? 1: -1);
        //var abc = Data.filter((v,i,a)=>a.findIndex(v2=>(v.columnId === v2.columnId))===i);
        //var abc =  Data.filter((v,i,a)=>a.findIndex(v2=>(v.Fldes === v2.Fldes && v.Fldty === 'I'))===i);
      var abc =  aData1.filter((v,i,a)=>a.findIndex(v2=>(v.Slnum === v2.Slnum && v.Fldty === 'I'))===i);
        var aColumnData =  abc.sort((a, b) => (a.Slnum > b.Slnum) ? 1: -1);  
        var arr2 = [];
        
    for (var j = 1; j < aData1.length; j++) {
                            var obj = {},flag="";
                                var aData2 = aData1.filter(function(val, idx) {
                        return (val.Count === j.toString());
                    });
                        for (var i = 0; i < aColumnData.length; i++) {
                            var Label = aColumnData[i].Fldes;
                           
                            for(var k=0;k<aData2.length;k++){
                            
                            if(Label === aData2[k].Fldes){
                            //aData1[j].columnId;
                            flag = "X";
                            obj[Label] =  aData2[k].Value+'@$'+aData2[k].Intyp+'@$'+aData2[k].Inrds+'@$'+aData2[k].Count +"@$"+aData2[k].Dcode; 
                            }
                        }
                    
                        }
                        if(flag === 'X'){
                            arr2.push(obj);
                        }
                        }
                    
        
            
            var oModel = new sap.ui.model.json.JSONModel();
        
            oModel.setData({
                columns: aColumnData,
                rows: arr2//newArray//aData
            });
        
            var oTable = this.getView().byId("ClaimItemTable");
            oTable.setModel(oModel);
        
            oTable.bindAggregation("columns", "/columns", function(index, context) {
                return new sap.m.Column({
                    width:"8rem",
                    header: new sap.m.Label({text: context.getObject().Fldes,tooltip:context.getObject().Fldes}),
                });
            });
        
        
            oTable.bindItems("/rows", function(index, context) {
                var obj = context.getObject();
                var row = new sap.m.ColumnListItem();
        
                for(var k in obj) {
                    var ab = obj[k].split('@$');
                    if(ab[1]=== ''){
                  //  row.addCell(new sap.m.Text({text : obj[k]}));
                  row.addCell(new sap.m.Text({text : ab[0]}));
                    }else if(ab[1]=== 'M'){
                        if(ab[2] === "D"){
                            ab[2] = false;
                        }else{
                            ab[2] = true;
                        }
                     row.addCell(new sap.m.Input({value : ab[0],editable: ab[2],	change: function(oEvent) {
                        that.onInputChange(oEvent)
                    }}));	
                    }else if(ab[1]=== 'H'){
                        row.addCell(new sap.m.Link({text : ab[0]}));
                   }else if(ab[1]=== 'R'){
                    row.addCell(new sap.m.TextArea({value : ab[0],liveChange:function(oEvent){
                        that.onRemarks(oEvent);
                    }}));
               }else if(ab[1]=== 'L'){
                var bb = ab[4].split(';');
                var combobox = new sap.m.ComboBox({selectedKey:ab[0],selectionChange:function(oEvent){
                    that.onComboboxChange(oEvent);
                }});
            //	combobox.addCustomData("3");
                row.addCell(combobox);
                var combarr =[];
                for(var i=0;i<bb.length;i++){
                    var obj1 = {};
                    var hh = bb[i].split("#");
                    obj1.key = hh[0];
                    obj1.Text = hh[1];
                    obj1.Count = ab[3];
                    combarr.push(obj1);
                }
                //	var oDDL = this.byId("DropDown");
                var oTemplate = new sap.ui.core.ListItem({
                    key: "{key}",
                    text: "{Text}",
                    additionalText:"{Count}"
                });
               /* var oTemplate = new sap.ui.core.Item({
                    key: "{key}",
                    text: "{Text}"
                });*/
                var oModel = new sap.ui.model.json.JSONModel(combarr);
                combobox.setModel(oModel);
                combobox.bindAggregation("items", "/", oTemplate);
           }
                }
        
                return row;
            });
           // oTable.placeAt("content");
        },
        onInputChange: function(oEvent) {
			//	var abc = "qq";
		//	var label = oEvent.getSource().getAggregation("customData")[0].getValue();
        var label = oEvent.getSource().mAssociations.ariaLabelledBy[0];
			var columnname = sap.ui.getCore().byId(label).getText();
			//var value = oEvent.getSource().getBindingContext().getObject().columnname;
			//	var value = oEvent.getSource().getBindingContext().getObject()[columnname];
			var value = oEvent.getSource().getValue();
			var Count = oEvent.getSource().getBindingContext().getPath().split("/rows/");
			Count = parseInt(Count[1]) + parseInt(1);
            var KeyArr = FinalData.results[0].ClmtyNav.results.filter(function(val, idx) {
                return (val.Slnum === "01"  && val.Count.toString() === Count.toString())
            });
			var aData2 = FinalData.results[0].ClmtyNav.results.filter(function(val, idx) {
				if (val.Fldes === columnname && val.Count.toString() === Count.toString()) {
					val.Chgamt  = value;
                    val.Value = KeyArr[0].Value;
					val.Chgflg  = 'X';
				};
			});

		},
        onComboboxChange: function(oEvent) {
		
			var selkey = oEvent.getSource().getSelectedKey();
            var selText = oEvent.getSource()._getSelectedItemText();
			//var label = oEvent.getSource().getAggregation("customData")[0].getValue();
            var label = oEvent.getSource().mAssociations.ariaLabelledBy[0];
			var columnname = sap.ui.getCore().byId(label).getText();
			var Count = oEvent.getSource().getSelectedItem().getAdditionalText();//oEvent.getSource().getTooltip()
			var aData2 = FinalData.results[0].ClmtyNav.results.filter(function(val, idx) {
				if (val.Fldes === columnname && val.Count.toString() === Count.toString()) {
					//val.Chgflg = 'X'
					val.Value = selkey;
				};
			});
            oEvent.getSource().setTooltip(selText);
		},
        onRemarks:function(oEvent){
            var textval = oEvent.getSource().getValue();
			//var label = oEvent.getSource().getAggregation("customData")[0].getValue();
            var label = oEvent.getSource().mAssociations.ariaLabelledBy[0];
			var columnname = sap.ui.getCore().byId(label).getText();
			//var Count = oEvent.getSource().getTooltip()
            var Count = oEvent.getSource().getBindingContext().getPath().split("/rows/");
			Count = parseInt(Count[1]) + parseInt(1);

			var aData2 = FinalData.results[0].ClmtyNav.results.filter(function(val, idx) {
				if (val.Fldes === columnname && val.Count.toString() === Count.toString()) {
					//val.Chgflg = 'X'
					val.Value = textval;
				};
			});
        },
        ok:function(oEvent){
           
        },
        onApprove:function(oEvent){
            this.actionflag  = 'ZAPR';
            this.DecisionKey= '0001';
           // this.onAction();
           this.onRemarksOpen();
        },
        onReject:function(oEvent){
            this.actionflag  = 'ZREJ';
            this.DecisionKey= '0002';
            this.onRemarksOpen();
        },
        onReturnD:function(oEvent){
              this.actionflag  = 'ZRED';
            this.DecisionKey= '0003';
            this.onRemarksOpen();
        },
        onReturn:function(oEvent){
            this.actionflag  = 'ZREP';
          this.DecisionKey= '0004';
           this.onRemarksOpen();
        },
        onForward:function(){
            this.actionflag  = 'ZFWD';
          this.DecisionKey= '0005';
           this.onRemarksOpen(); 
        },
        onReassign:function(){
            this.actionflag  = 'ZRES';
          this.DecisionKey= '0006';
           this.onRemarksOpen(); 
        },
        onClose:function(){
            this.actionflag  = 'ZCLC';
          this.DecisionKey= '0007';
           this.onRemarksOpen(); 
        },

        onRemarksOpen:function(oEvent){
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment(
                    "zclaimapproval.fragments.Comments",
                    this);
                this.getView().addDependent(this._oDialog);
            }
           this._oDialog.open();
           var oReason={},RetReason=false,RejReason=false;
           if(this.DecisionKey === '0004' || this.DecisionKey === '0003'){
            RetReason = true;
            RejReason = false;
           }else if(this.DecisionKey === '0002'){
            RetReason = false;
            RejReason = true;
           }
           var aResSplit = Reasons.split(";");
           var aRejRes = [],aRetRes=[];
           for(var i=0;i<aResSplit.length;i++){
            var split=aResSplit[i].split("#");
            var oResobj = {};
            if(split[0] === "ZWTYREJREASON"){
                oResobj.key = split[1];
                oResobj.Text = split[1]
                aRejRes.push(oResobj);
            }else if(split[0] === "ZWTYRETREASON"){
                oResobj.key = split[1];
                oResobj.Text = split[1]
                aRetRes.push(oResobj);
            }
           }
           var oModel1 = new sap.ui.model.json.JSONModel();
           if(RetReason === true){
            oModel1.setData(aRetRes);
           }else if(RejReason === true){
            oModel1.setData(aRejRes);
        }
        this.getView().setModel(oModel1,"ResonsModel");
           oReason.RetReason = RetReason;
           oReason.RejReason = RejReason;
           var oModel = new sap.ui.model.json.JSONModel(oReason)
           this.getView().setModel(oModel,"ReasonVisModel")
        },
        onRemClose:function(){
            this._oDialog.close();
            this._oDialog.destroy();
            this._oDialog = null;
        },
        onWFAction:function(){
            var that = this;
            this.getOwnerComponent().getModel("TaskProcessing").callFunction(
                "/Decision", {
                    method:"POST",
                    urlParameters:{
                        	Comments: "dd",
                            DecisionKey: this.DecisionKey,
                        	InstanceID:  this.InstanceId,
                        	SAP__Origin: "LOCAL_TGW"
                        
                    },
                    success:function(oData,response){

                      //  arr=oData.results

                      //  oModel.setData(arr)
                      //  oContext.getView().setModel(oModel);
                      //  debugger;
              //   that.onAction();
                    },
                    error:function(oError)
                    {
                        sap.ui.core.BusyIndicator.hide();
                    }
                }
            );
        },
        onAction:function(){
            //var oDataModel = 
            sap.ui.core.BusyIndicator.show();
            var GenRem="",IntRem="";
            var selectedReason = "";
            if(sap.ui.getCore().byId("GenRem")){
             GenRem = sap.ui.getCore().byId("GenRem").getValue();
            IntRem =  sap.ui.getCore().byId("IntRem").getValue();
           
            if(this.DecisionKey === '0004' || this.DecisionKey === '0003'){
                selectedReason = sap.ui.getCore().byId("RetRsn").getSelectedKey();
               }else if(this.DecisionKey === '0002'){
                selectedReason = sap.ui.getCore().byId("RejRsn").getSelectedKey();
               }
            this.onRemClose();
            }
            var that = this;
            var FinalData1 = FinalData.results[0];
            FinalData1.Icomt = IntRem;
            FinalData1.Gcomt = GenRem;
            FinalData1.Appac=that.actionflag;
          FinalData1.Wrice= selectedReason;
            this.getOwnerComponent().getModel().create("/EtClmAppSet", FinalData1, {
				success: function(oData, response) {
                 //   that.onWFAction();
                 sap.ui.core.BusyIndicator.hide();
                 var DecText = "";
                 if(that.DecisionKey === '0001' ){
                      DecText = "Approved";
                 }else if(that.DecisionKey === '0002' ){
                   DecText = "Rejected";
                 }else if(that.DecisionKey === '0003' ){
                   DecText = "Returned to Dealer";
                 }else if(that.DecisionKey === '0004' ){
                   DecText = "Returned";
                 }
                 MessageBox.show("Claim has been " + DecText +" successfully", {
                   icon: MessageBox.Icon.SUCCESS,
                   title: "Success",
                   actions: [sap.m.MessageBox.Action.OK],
                   onClose: function(oAction) {
                    var href = window.location.href.split("displayInbox");
                        if(window.location.href.search("scenarioId")=== -1){
                        window.location.href = href[0]+"displayInbox";
                        	window.location.reload(true);
                        }else{
                            window.location.href=href[0]+"displayInbox"+"?scenarioId=CLAIM_APPROVAL"
                        	window.location.reload(true);
                        }
                   }
               });
				},
				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
					//that.setDeleteobj();
                    try{
					var errorMsg = $.parseJSON(oError.response.body).error.message.value;
                    }catch{
                       // var errorMsg = "Error Occurred."
                       var errorMsg = $.parseJSON(oError.responseText).error.innererror.errordetails[0].message;
                    }
					MessageBox.show(errorMsg, {
						icon: MessageBox.Icon.ERROR,
						title: "Error"
					});
				}
			});
        },
        handleUploadComplete: function (evt) {
			debugger;
			// var oFileUpload = sap.ui.getCore().byId("fileUploader");
            var that=this;
			var oFileUpload=evt.getSource();
			var domRef = oFileUpload.getFocusDomRef();
			var name = domRef.files[0].name.split(".pdf")[0];
			var file=domRef.files[0];
			that.Claim = this.getView().byId("ClaimNo").getValue();
			if (file === undefined) {} else {
				//this.fileName = file.name;
				var base64_marker = 'data:' + file.type + ';base64,';
				var reader = new FileReader();
				
				//on Load
				reader.onload = (function (theFile) {

					return function (evt) {
						//locate content
						var base64Index = evt.target.result.indexOf(base64_marker) + base64_marker.length;
						//Get content 
						var base64 = evt.target.result.substring(base64Index);
						var service = "/sap/opu/odata/sap/ZWTY_CLM_APR_INT_SRV/AttachmentSet";
						var token = that.getOwnerComponent().getModel().getSecurityToken();
						$.ajaxSetup({
							cache: false
						});
						jQuery.ajax({
							type: 'POST',
							url: service,
							async: false,
							//	headers: oHeaders,
							cache: false,
							dataType: "json",
							data: base64,
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-CSRF-Token", token);
								xhr.setRequestHeader("Content-Type", file.type);
								xhr.setRequestHeader("slug", that.Claim+"-"+"Wty_Int_"+name);
							},
							success: function (oData) {
								alert("Success");
								oFileUpload.clear();
								that.getimage();
							},
							error: function (odata) {
								alert("error");
							}
						});
					};
				})(file);
				//Read file
				reader.readAsDataURL(file);
			}
		},
        getimage: function () {
			var that=this;
			var aFilters = [];
            this.Claim = this.getView().byId("ClaimNo").getValue();
            aFilters.push(new sap.ui.model.Filter("Claimno", sap.ui.model.FilterOperator.EQ, this.Claim));
            this.getOwnerComponent().getModel().read("/AttachmentSet", {
				filters: aFilters,
				success: function (data) {
                 //   sap.ui.core.BusyIndicator.show();
					//var abc =  data.results.includes("Wty_Int_");
                  var intData =  data.results.filter(el => el.FileName.includes("Wty_Int_")); 
					var jsonModel = new sap.ui.model.json.JSONModel(intData);
					that.getView().setModel(jsonModel, "AttachmentSet");
                    var genData = data.results.filter(el => !el.FileName.includes("Wty_Int_"));
                    var jsonModel = new sap.ui.model.json.JSONModel(genData);
					that.getView().setModel(jsonModel, "GenAttachmentSet");

				}.bind(this),
				error: function (err) {
                    sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Failed!!");
				}
			});
		},
        handlePress:function(oEvent){
            var documentName = oEvent.getSource().getText();
            var Claim = this.getView().byId("ClaimNo").getValue();
			var sURL;
            var  FileFilter = 'AttachmentSet(FileName=' + "'" + documentName + "'" + ',Claimno=' + "'" + Claim + "'" + ')' + '/$value';
			sURL = "/sap/opu/odata/sap/ZWTY_CLM_APR_INT_SRV/"+FileFilter;
			sap.m.URLHelper.redirect(sURL, true);
        }
        });
    });
