sap.ui.define([], function() {
	"use strict";
	return {
        getdateformat:function(val){
         var datetime = "";
          if(val && val !== "" && val !=="0" && val !== '0 ' ){
             
             datetime = val.slice(6,8) + "."+ val.slice(4,6) + "."+ val.slice(0,4);
          }
          return datetime;
      },

      getBtnVisibilityLock:function(Arr,type){
         var flag = false,check=[];
        
         if(Arr.ClmtyNav){
            if(Arr.Ulflg === 'X'){
            if(type === 'Lock'){
               check = Arr.ClmtyNav.results.filter(function(val,idx){
                  return (val.Tecfl.toString() === '2'&& val.Fldty === 'H' && val.Slnum === "01" && val.Appac === "ZLOC");
               });
            }else if(type === 'UnLock'){
               check = Arr.ClmtyNav.results.filter(function(val,idx){
                  return (val.Tecfl.toString() === '2'&& val.Fldty === 'H' && val.Slnum === "01" && val.Rejac === "ZLUC");
               });
            }else if(type === 'ByPass'){
               check = Arr.ClmtyNav.results.filter(function(val,idx){
                  return (val.Tecfl.toString() === '2'&& val.Fldty === 'H' && val.Slnum === "01" && val.Retac === "ZBYP");
               });
            }
         }
         }
         if(check.length > 0){
            flag = true;
         }
         return flag;
      },
      getBtnVisibility:function(Arr,type){
         
         var flag = false,check=[];
         if(Arr.ClmtyNav){
            if(Arr.Ulflg === ''){
         if(type === 'Aprv'){
        check = Arr.ClmtyNav.results.filter(function(val,idx){
            return (val.Tecfl.toString() === '1'&& val.Fldty === 'H' && val.Slnum === "01" && val.Appac === "ZAPR")
         });
      }else if(type === 'Rej'){
         check = Arr.ClmtyNav.results.filter(function(val,idx){
            return (val.Tecfl.toString() === '1'&& val.Fldty === 'H' && val.Slnum === "01" && val.Rejac === "ZREJ")
         });
      }else if(type === 'Ret'){
         check = Arr.ClmtyNav.results.filter(function(val,idx){
            return (val.Tecfl.toString() === '1'&& val.Fldty === 'H' && val.Slnum === "01" && val.Retac === "ZRET")
         });
      }else if(type === 'RetD'){
         check = Arr.ClmtyNav.results.filter(function(val,idx){
            return (val.Tecfl.toString() === '1'&& val.Fldty === 'H' && val.Slnum === "01" && val.RTDAC === "ZRED")
         });
      }else if(type === 'Fwd'){
         check = Arr.ClmtyNav.results.filter(function(val,idx){
            return (val.Tecfl.toString() === '1'&& val.Fldty === 'H' && val.Slnum === "01" && val.Retac === "ZFWD")
         });
      }else if(type === 'Ran'){
         check = Arr.ClmtyNav.results.filter(function(val,idx){
            return (val.Tecfl.toString() === '1'&& val.Fldty === 'H' && val.Slnum === "01" && val.RTDAC === "ZRES")
         });
      }else if(type === 'Cls'){
         check = Arr.ClmtyNav.results.filter(function(val,idx){
            return (val.Tecfl.toString() === '1'&& val.Fldty === 'H' && val.Slnum === "01" && val.RTDAC === "ZCLC")
         });
      }
   }
   }
         if(check.length>0){
            flag = true;
         
         }

         return flag;
      }
      
	};
});