var progressbarTwo = {};
progressbarTwo.startTime;// 查询开始时间
progressbarTwo.endTime;// 查询的结束时间
progressbarTwo.canel;// 是否取消查询（1时取消继续查询）
progressbarTwo.statusSum;// 统计已经查询完毕的所有sql的条数
progressbarTwo.percentValue = 0;// 累计进度条的百分比
progressbarTwo.perList = new Array();
progressbarTwo.handIds = new Array();
progressbarTwo.logTimeoutIds = new Array();
progressbarTwo.sqlsum = 0;
progressbarTwo.req_start_time=""; //请求开始的时间戳
progressbarTwo.req_complete_time=""; //请求结束的时间戳
progressbarTwo.callback_start_time=""; //回调开始的时间戳
progressbarTwo.callback_complete_time=""; //回调完成的时间戳
progressbarTwo.userName = $("#headerUserForm_a").text(); //获取用户名称

/**********************************
 * @funcname Map
 * @funcdesc 自定义的Map
 * @param null
 * @return {Map}
 * @author 林楚佳
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
function Map() {     
    this.elements = new Array();     
       
    //获取MAP元素个数     
    this.size = function() {     
        return this.elements.length;     
    }     
       
    //判断MAP是否为空     
    this.isEmpty = function() {     
        return(this.elements.length < 1);     
    }     
       
    //删除MAP所有元素     
    this.clear = function() {     
        this.elements = new Array();     
    }     
       
    //向MAP中增加元素（key, value)      
    this.put = function(_key, _value) {     
        this.elements.push( {     
            key : _key,     
            value : _value     
        });     
    }     
       
    //删除指定KEY的元素，成功返回True，失败返回False     
    this.remove = function(_key) {     
        var bln = false;     
        try{     
            for(i = 0; i < this.elements.length; i++) {     
                if(this.elements[i].key == _key) {     
                    this.elements.splice(i, 1);     
                    return true;     
                }     
            }     
        } catch(e) {     
            bln = false;     
        }     
        return bln;     
    }     
       
    //获取指定KEY的元素值VALUE，失败返回NULL     
    this.get = function(_key) {     
        try{     
            for(i = 0; i < this.elements.length; i++) {     
                if(this.elements[i].key == _key) {     
                    return this.elements[i].value;     
                }     
            }     
        } catch(e) {     
            return null;     
        }     
    }     
       
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL     
    this.element = function(_index) {     
        if(_index < 0 || _index >= this.elements.length) {     
            return null;     
        }     
        return this.elements[_index];     
    }     
       
    //判断MAP中是否含有指定KEY的元素     
    this.containsKey = function(_key) {     
        varbln = false;     
        try{     
            for(i = 0; i < this.elements.length; i++) {     
                if(this.elements[i].key == _key) {     
                    bln = true;     
                }     
            }     
        } catch(e) {     
            bln = false;     
        }     
        return bln;     
    }     
       
    //判断MAP中是否含有指定VALUE的元素     
    this.containsValue = function(_value) {     
        var bln = false;     
        try{     
            for(i = 0; i < this.elements.length; i++) {     
                if(this.elements[i].value == _value) {     
                    bln = true;     
                }     
            }     
        } catch(e) {     
            bln = false;     
        }     
        return bln;     
    }     
       
    //获取MAP中所有VALUE的数组（ARRAY）     
    this.values = function() {     
        var arr = new Array();     
        for(i = 0; i < this.elements.length; i++) {     
            arr.push(this.elements[i].value);     
        }     
        return arr;     
    }     
       
    //获取MAP中所有KEY的数组（ARRAY）     
    this.keys = function() {     
        var arr = new Array();     
        for(i = 0; i < this.elements.length; i++) {     
            arr.push(this.elements[i].key);     
        }     
        return arr;     
    }     
} 

progressbarTwo.handleIdMap = new Map(); // 创建一个存放handleId的Map对象。 在 progressbarTwo.getOperationId中使用

/**********************************
 * @funcname getQueryString
 * @funcdesc 通过名称获取url中参数的值
 * @param {String} name (input)
      需要获取到的参数的名称
 * @return {String}
 * @author 林楚佳
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
progressbarTwo.getQueryString = function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

/**********************************
 * @funcname getReqTime
 * @funcdesc 获取请求所用的时间
 * @param null
 * @return {int}
 * @author 林楚佳	
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
progressbarTwo.getReqTime= function(){
	return progressbarTwo.req_complete_time.getTime() - progressbarTwo.req_start_time.getTime();
}

/**********************************
 * @funcname getCallbackTime
 * @funcdesc 获取回调所用的时间
 * @param null
 * @return {int}
 * @author 林楚佳	
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
progressbarTwo.getCallbackTime = function(){
	return progressbarTwo.callback_complete_time.getTime() - progressbarTwo.callback_start_time.getTime();
}

/**********************************
 * @funcname getConsuming
 * @funcdesc 获取两个时间的时间差
 * @param null
 * @return {int}
 * @author 林楚佳	
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
progressbarTwo.getConsuming = function(start , end) {
	return end.getTime() - start.getTime();
}
/**********************************
 * @funcname getFunctionName
 * @funcdesc 获取方法的方法名称，如果方法有方法名称则将方法的名称截取下来
 * @param {String} str (input)
      方法的整个实体
 * @return {String}
 * @author 林楚佳
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
function getFunctionName(str){
	var functionName = str.substring(str.indexOf("function")+8,str.indexOf("(")-1);
	return functionName;
}

progressbarTwo.userMap = new Map(); //由于impala的异步查询横跨多个方法，所以需要声明一个全局变量来保存数据

/**********************************
 * @funcname Date.prototype.Format 
 * @funcdesc 重写Date方法的Format方法，用于将时间进行格式转换，转换成想要的格式的字符串
 * @param {Date} fmt (input)
      想要进行转换的日期
 * @return {String}
 * @author 林楚佳
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


/**********************************
 * @funcname submitUserOperateRecord
 * @funcdesc 将map中的数据通过异步的方式上传到服务器进行保存
 * @param {Map} uor (input )
      存放了记录用户操作时请求的耗时以及回调耗时的map
 * @return null
 * @author 林楚佳	
 * @create 20170418
 * @modifier  
 * @modify  
 ***********************************/
progressbarTwo.submitUserOperateRecord = function(uor) {
	// return ;//暂时返回掉
	$.ajax({
		type : "post",
		url : "pages_userOperateRecord_UserOperateRecord_saveOrUpdate.action" ,
		data:{
			"userName" : uor.get("userName").trim(),
			"appId" : uor.get("appId"),
			"appName" :uor.get("appName"),
			"operateTime" : uor.get("operateTime"),
			"reqParams" : uor.get("reqParams"),
			"reqTimeConsuming" : uor.get("reqTimeConsuming"),
			"callbackName" : uor.get("callbackName"),
			"callbackTimeConsuming" : uor.get("callbackTimeConsuming"),
			"totalTimeConsuming" : uor.get("totalTimeConsuming")
		},
		success : function(){
//			console.log("操作成功");
		},
		error : function(err){
			console.log("操作失败");
		}
	})
}

/**
 * sqllist:模板参数数组。
 * functionlist：回调函数数组。格式：[func1,func2,...]
 * dataBase：数据库类型集合，可以不传（可选）。格式：[2,3,3,...] 说明：2:impala 3:mysql
 * paraArray：往回调函数中放入的参数，可以不传（可选）。格式：[any,any,any,...] 说明：any可以为数组、jquery对象等类型
 * isAsync_ImpalaQuery:是否impala异步查询（可选） 说明：true为impala异步查询，false为不使用impala异步查询
 * callType调用类别（可选）: 
 * 1:tableTools(表格组件)  
 * callPara格式：
 * tableToolsPara = {
		"sortColumn":sortColumn,
		"pageSize":pageSize,
		"pageIndex":pageIndex,
		"sortType":"desc"
	};
 */


/**********************************
 * @funcname progressbarTwo.submitSql
 * @funcdesc 查询组件入口，首先判断参数，如果使用impala的异步查询，则使用impala异步查询逻辑，再判断是组件查询，然后判断是否是同步请求进行查询，如果前面的都不符合，则使用正常的异步请求进行查询
 * @param {array} sqllist (input ) 数组的每个为替换sql模板的参数数组  格式：[["id","key:value","key:value",…],[ "id","key:value","key:value",…],...]
 * @param {array} functionlist (input ) 数组的每个为查询的回调函数 格式:[func1,func2,...]
 * @param {array} dataBase (input optional) 如果不传该参数，则默认使用impala的同步查询（默认为2），3：mysql 4：hbase thrift 5：Elasticsearch 6：postgreSql 7：hbase api（无认证的方式）
 * @param {array} paraArray (input optional) 往回调函数带入的参数（对象、数组等），如果要带入，则需要一一对应，比如在第三个查询模板带入，则需要将前两个位置填满，第三个位置放入需要带入的参数
 * @param {boolean} isAsync_ImpalaQuery (input optional) 该参数为true的时候使用impala的后台异步查询，其他情况为不使用impala的异步查询
 * @param {number} callType (input optional) 使用的组件标识，目前暂时只有一个组件使用（1：表格组件）
 * @param {object} callPara (input optional) 本参数需要和callType配合使用，请求会将这个对象发送到后台（如果增加组件，则需要在后台新增实体类接收该参数）进行sql拼接后者其他处理
 * callPara = {
		"sql":sqlPara,
		"sortColumn":sortColumn,
		"pageSize":pageSize,
		"pageIndex":pageIndex,
		"thead":thead,
		"sortType":sortType,
		"dataType":dataType,
		"pageFlag":pageFlag,
		"sceneId":sceneId
	};
	sceneId:场景0的功能展示:
	a.	加载更多。
	b.	排序（可升降排序）
	c.	导出。
	d.	超长缩略（前后取10个字符，鼠标浮动显示完整信息）。
	e.	数值型样式右对齐，字符型左对齐。
	场景1的功能展示:
	a.实现复杂表头（表头可跨列）
	b.支持按列或按行冻结
	c.支持表头或按列绑定函数（包括悬停、单击、双击）
	d.支持表头或按列指定css class,class名称可以整列相同，可以按列值对应，可以按取值范围对应
	e.支持不分页，不添加表头排序，不指定order by字段
	f.支持前端直接提供数据去生成表格
 //-------修改参数为可传入对象，使用解构赋值的方式取值  by liangjy 20200526-----------
 增加场景应用，传入的只有一个参数，使用解构赋值的方式获取参数，按照解构赋值的规则，不需要的参数可以不填，默认为undefined，但是sqlListPara、functionListPara、dataBasePara三个是必须的，注意参数为对象，下面是例子
 let submitObject = {
 sqlListPara:[],
 functionListPara:[],
 dataBasePara:[],
 paraArrayPara:[],
 isAsync_ImpalaQueryPara:false,
 callTypePara:null,
 callParaPara:null,
 isSyncPara:null,
 dbNamePara:null,
 showResultXPath:'',
 }
 *
 * @param {boolean} isSync (input optional) 本参数标识使用ajax的同步请求，即一个请求处理完才发起下一个请求
 * @param {Array} dbName : 当database等于3时，根据这个名称去获取不同的Mysql数据库  MYSQL_BROADBAND ： 宽带库  ； Alarms ： 告警库  ；  UserComplain ：用户抱怨库；不传就是默认的业务数据库
 * @return null
 * @author 梁杰禹	
 * @create 20170808
 * @modifier  梁杰禹
 * @modify  20200526
 ***********************************/

/**
 *  let submitObject = {sqlListPara:[],functionListPara:[],dataBasePara:[],paraArrayPara:[],isAsync_ImpalaQueryPara,callTypePara,callParaPara,isSyncPara,dbNamePara}
 */

// progressbarTwo.submitSql = function(sqllist, functionlist,dataBase,paraArray,isAsync_ImpalaQuery,callType,callPara,isSync,dbName) {
progressbarTwo.submitSql = function() {
	// console.log("方法参数长度:",arguments.length)
	let sqllist = [], functionlist = [],dataBase = [],paraArray =[],isAsync_ImpalaQuery =false,callType,callPara,isSync,dbName,showResultXPath
	if (arguments.length == 1 && (typeof arguments[0] == 'object')){
		//只有一个参数，并且是对象，进行解构赋值获取参数
		let {sqlListPara,functionListPara,dataBasePara,paraArrayPara,isAsync_ImpalaQueryPara,callTypePara,callParaPara,isSyncPara,dbNamePara,xPath} = arguments[0]
		sqllist = sqlListPara
		functionlist = functionListPara
		dataBase = dataBasePara
		paraArray = paraArrayPara
		isAsync_ImpalaQuery = isAsync_ImpalaQueryPara
		callType =callTypePara
		callPara = callParaPara
		isSync = isSyncPara
		dbName = dbNamePara
		showResultXPath = xPath
	}else{
		sqllist = arguments[0];
		functionlist = arguments[1];
		dataBase = arguments[2];
		paraArray = arguments[3];
		isAsync_ImpalaQuery = arguments[4];
		callType = arguments[5];
		callPara = arguments[6];
		isSync = arguments[7];
		dbName = arguments[8];
	}

	let showDataXPathNode = document.evaluate(showResultXPath,document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
	let showDataXPathNodeElement = null;
	if (showDataXPathNode.snapshotLength > 0){
		showDataXPathNodeElement = showDataXPathNode.snapshotItem(0);
		// $(showDataXPathNodeElement).html('');
	}


	if(dbName!=undefined||dbName!=null){
		for ( let i = 0; i < sqllist.length; i++) {
			let submitSqlAjaxParaObj = {
				sqlParaListP:sqllist[i],
				callBackFuncP:functionlist[i],
				dataBaseP:dataBase[i],
				paraAnyP:null,
				paraUrlP:null,
				databaseNameP:dbName[i],
				showXPathNodeElement:showDataXPathNodeElement
			}

			if(Array.isArray(paraArray)){
				if(i<paraArray.length){
					submitSqlAjaxParaObj.paraAny = paraArray[i];
					// progressbarTwo.submitSqlAjax(sqllist[i],functionlist[i],dataBase[i],paraArray[i],null,dbName[i],showDataXPathNodeElement);
				}else{
					submitSqlAjaxParaObj.paraAny = null;
					// progressbarTwo.submitSqlAjax(sqllist[i],functionlist[i],dataBase[i],null,null,dbName[i],showDataXPathNodeElement);
				}
			}else{
				submitSqlAjaxParaObj.paraAny = null;
				// progressbarTwo.submitSqlAjax(sqllist[i],functionlist[i],dataBase[i],null,null,dbName[i],showDataXPathNodeElement);
			}
			progressbarTwo.submitSqlAjax(submitSqlAjaxParaObj);
		}
		return;
	}
	if(isAsync_ImpalaQuery==undefined||isAsync_ImpalaQuery==null){
		isAsync_ImpalaQuery = false;
	}
	if(isSync==undefined||isSync==null){
		isSync = false;
	}
	if(callType == undefined || callType==null){
		callType = false;
	}
	
	if(!Array.isArray(paraArray)){
		paraArray = [];
	}
	
	if(sqllist.length==0){
		alert("传入的sql参数长度为0，请检查....");
		return;
	}
	
	if(isAsync_ImpalaQuery){
		progressbarTwo.submitSqlAsync(sqllist,functionlist,paraArray,callType,callPara); //-----
		return;
	}
	if(noceUtil.isUndefined(dataBase)){
		dataBase = [];
	}
	
	if(callType==1||callType=="1"){
		var paraUrl = progressbarTwo.getParaUrl(1,callPara);
		progressbarTwo.submitSqlAjax(sqllist[0], functionlist[0],dataBase[0],paraArray[0],paraUrl);  //--------
		return;
	}
	
	if(isSync){
		//依次对每条sql提交查询
		for ( var i = 0; i < sqllist.length; i++) {  
			if(dataBase[i]==null||dataBase[i]==undefined||dataBase[i].length==0){
				dataBase[i] = 2;
			}
			let submitSqlAjaxParaObj = {
				sqlParaListP:sqllist[i],
				callBackFuncP:functionlist[i],
				dataBaseP:dataBase[i],
				paraAnyP:paraArray[i],
				paraUrlP:null,
				databaseNameP:null,
				showXPathNodeElement:showDataXPathNodeElement
			}
			// progressbarTwo.submitSqlSync(sqllist[i], functionlist[i],dataBase[i],paraArray[i],null); //-------
			progressbarTwo.submitSqlSync(submitSqlAjaxParaObj); //-------
		}
		return;
	}
	//依次对每条sql提交查询
	for ( var i = 0; i < sqllist.length; i++) {  
		if(dataBase[i]==null||dataBase[i]==undefined||dataBase[i].length==0){
			dataBase[i] = 2;
		}
		let submitSqlAjaxParaObj = {
			sqlParaListP:sqllist[i],
			callBackFuncP:functionlist[i],
			dataBaseP:dataBase[i],
			paraAnyP:paraArray[i],
			paraUrlP:null,
			databaseNameP:null,
			showXPathNodeElement:showDataXPathNodeElement
		}
		// progressbarTwo.submitSqlAjax(sqllist[i], functionlist[i],dataBase[i],paraArray[i],null);
		progressbarTwo.submitSqlAjax(submitSqlAjaxParaObj);
	}
};


/**********************************
 * @funcname progressbarTwo.submitSqlAjax
 * @funcdesc ajax异步请求，同步查询数据
 * @param {array} sqlParaList (input) 模板参数数组 格式：["id","key:value","key:value",…]
 * @param {function} callBackFunc (input) 回调函数 格式: func1方法
 * @param {number} dataBase (input) 数据库类型
 * @param {object} paraArray (input optional) 往回调函数中放入的参数 说明：附带上的参数
 * @param {string} paraUrl (input optional) 组件拼装的url
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.submitSqlAjax = function(){
	let sqlParaList, callBackFunc,dataBase,paraAny,paraUrl,databaseName,xPathNodeElement
	if (arguments.length == 1 && (typeof arguments[0] == 'object')){
		//只有一个参数，并且是对象，进行解构赋值获取参数
		let {sqlParaListP, callBackFuncP,dataBaseP,paraAnyP,paraUrlP,databaseNameP,showXPathNodeElement} = arguments[0]
		sqlParaList = sqlParaListP
		callBackFunc = callBackFuncP
		dataBase = dataBaseP
		paraAny = paraAnyP
		paraUrl = paraUrlP
		databaseName =databaseNameP
		xPathNodeElement =showXPathNodeElement
	}else{
		sqlParaList = arguments[0]
		callBackFunc = arguments[1]
		dataBase = arguments[2]
		paraAny = arguments[3]
		paraUrl = arguments[4]
		databaseName =arguments[5]
		xPathNodeElement =arguments[6]
	}
	var appId=$('#currentAppId').val();
	var appName = $('#'+appId).text();
	if(paraUrl==""||paraUrl==undefined||paraUrl==null){
		paraUrl = "";
	}
	var uor = new Map(); //创建一个map保存所有的信息
	var operate_time = new Date().Format("yyyy-MM-dd HH:mm:ss");  //创建操作时间
	progressbarTwo.req_start_time = new Date(); // 初始时间
	let req_start_time = new Date();
	noce.ajax("pages_util_ProgressbarTwo_submitCmd.action", "cmd=" + encodeURIComponent(JSON.stringify(sqlParaList)) + "&database=" + dataBase +"&appId="+appId+"&appName="+encodeURIComponent(appName)+paraUrl+"&dbName="+databaseName, function(data) {
		progressbarTwo.req_complete_time = new Date(); // 创建请求结束时间
		var totalReq = progressbarTwo.getReqTime(); // 计算总的加载时间
		//回调开始 
		progressbarTwo.callback_start_time = new Date(); // 记录回调函数开始时间

		progressbarTwo.handleDataToShow(data,sqlParaList,req_start_time,xPathNodeElement)

		if(typeof(paraAny) == "undefined" || paraAny == null){
			if(callBackFunc.name != null || callBackFunc.name != ""){
				uor.put("callbackName", callBackFunc.name);
			}else{
				uor.put("callbackName", " ");
			}
			callBackFunc(data);
		}else{
			if(callBackFunc.name != null || callBackFunc.name != ""){
				uor.put("callbackName", callBackFunc.name);
			}else{
				uor.put("callbackName", " ");
			}
			callBackFunc(data,paraAny);
		}
		
		//回调结束
		progressbarTwo.callback_complete_time = new Date(); // 记录回调结束时间
		var totalCallback = progressbarTwo.getCallbackTime(); // 计算回调函数总耗时
		//在这里将所有的参数都放到数组中并调用上面的方法将数据传入后台进行持久化操作
		uor.put("userName" , progressbarTwo.userName);
		uor.put("appId" , progressbarTwo.getQueryString("appId"));
		uor.put("appName" , progressbarTwo.getQueryString("appName"));
		uor.put("operateTime" , operate_time);
		uor.put("reqParams" , JSON.stringify(sqlParaList));
		uor.put("reqTimeConsuming" , totalReq);
		uor.put("callbackTimeConsuming" , totalCallback);
		uor.put("totalTimeConsuming" , totalReq + totalCallback);
		//调用方法将数据保存到数据库中
		progressbarTwo.submitUserOperateRecord(uor);
	}, true);
	
};



/**********************************
 * @funcname progressbarTwo.submitSqlSync
 * @funcdesc ajax同步请求，同步查询数据
 * @param {array} sqlParaList (input) 模板参数数组 格式：["id","key:value","key:value",…]
 * @param {function} callBackFunc (input) 回调函数 格式: func1方法
 * @param {number} dataBase (input) 数据库类型
 * @param {object} paraArray (input optional) 往回调函数中放入的参数 说明：附带上的参数
 * @param {string} paraUrl (input optional) 组件拼装的url
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.submitSqlSync = function(){
	let sqlParaList, callBackFunc,dataBase,paraAny,paraUrl,databaseName,xPathNodeElement
	if (arguments.length == 1 && (typeof arguments[0] == 'object')){
		//只有一个参数，并且是对象，进行解构赋值获取参数
		let {sqlParaListP, callBackFuncP,dataBaseP,paraAnyP,paraUrlP,databaseNameP,showXPathNodeElement} = arguments[0]
		sqlParaList = sqlParaListP
		callBackFunc = callBackFuncP
		dataBase = dataBaseP
		paraAny = paraAnyP
		paraUrl = paraUrlP
		databaseName =databaseNameP
		xPathNodeElement =showXPathNodeElement
	}else{
		sqlParaList = arguments[0]
		callBackFunc = arguments[1]
		dataBase = arguments[2]
		paraAny = arguments[3]
		paraUrl = arguments[4]
		databaseName =arguments[5]
		xPathNodeElement =arguments[6]
	}


	var appId=$('#currentAppId').val();
	var appName = $('#'+appId).text();
	if(paraUrl==""||paraUrl==undefined||paraUrl==null){
		paraUrl = "";
	}
	
	var uor = new Map();//创建一个map保存所有的信息
	var operate_time = new Date().Format("yyyy-MM-dd HH:mm:ss");  
	//初始时间
	progressbarTwo.req_start_time = new Date();
	let req_start_time = new Date();
	noce.ajaxAsync("pages_util_ProgressbarTwo_submitCmd.action", "cmd=" + encodeURIComponent(JSON.stringify(sqlParaList)) + "&database=" + dataBase +"&appId="+appId+"&appName="+encodeURIComponent(appName)+paraUrl, function(data) {
		progressbarTwo.req_complete_time = new Date();
		var totalReq = progressbarTwo.getReqTime();
		//回调开始 
		progressbarTwo.callback_start_time = new Date();

		progressbarTwo.handleDataToShow(data,sqlParaList,req_start_time,xPathNodeElement)

		//回调开始  声明一个回调开始时间
		if(typeof(paraAny) == "undefined"){
			if(callBackFunc.name != null || callBackFunc.name != ""){
				uor.put("callbackName", callBackFunc.name);
			}else{
				uor.put("callbackName", " ");
			}
			callBackFunc(data);
		}else{
			if(callBackFunc.name != null || callBackFunc.name != ""){
				uor.put("callbackName", callBackFunc.name);
			}else{
				uor.put("callbackName", " ");
			}
			callBackFunc(data,paraAny);
		}
		//回调结束
		progressbarTwo.callback_complete_time = new Date();
		var totalCallback = progressbarTwo.getCallbackTime();
		//在这里将所有的参数都放到数组中并调用上面的方法将数据传入后台进行持久化操作
		uor.put("userName" , progressbarTwo.userName);
		uor.put("appId" , progressbarTwo.getQueryString("appId"));
		uor.put("appName" , progressbarTwo.getQueryString("appName"));
		uor.put("operateTime" , operate_time);
		uor.put("reqParams" , JSON.stringify(sqlParaList));
		uor.put("reqTimeConsuming" , totalReq);
		uor.put("callbackTimeConsuming" , totalCallback);
		uor.put("totalTimeConsuming" , totalReq + totalCallback);
		//调用方法将数据保存到数据库中
		progressbarTwo.submitUserOperateRecord(uor);
	});
};


progressbarTwo.handleQuerySql = function (handleQueryResult,xPathNodeElement){
	// 查询时间，请求参数，结果示例
	let {queryTotalTime,queryPara,querySql,queryDataResult} = handleQueryResult;
	// console.log('回调需要显示的结果对象',handleQueryResult)
	if($(xPathNodeElement).length > 0){
		// /html/body/div[5]
		let showTextarea = document.createElement("textarea");
		// let valueString = `查询时间:${queryTotalTime}\n 请求参数:${JSON.stringify(queryPara)}\n 请求sql:${querySql}\n 结果示例:${JSON.stringify(queryDataResult)}`
		let valueString = `查询时间:${queryTotalTime}\n 请求参数:${queryPara}\n 请求sql:${querySql}\n 结果示例:${JSON.stringify(queryDataResult)}`
		// showTextarea.setAttribute("value",valueString)
		$(showTextarea).html(valueString)
		$(showTextarea).addClass('debugElement')
		$(xPathNodeElement).append(showTextarea)
	}
}



/**********************************
 * @funcname progressbarTwo.submitSqlAsync
 * @funcdesc impala异步查询
 * @param {array} sqlParaList (input) 模板参数数组 格式：["id","key:value","key:value",…]
 * @param {function} callBackFunc (input) 回调函数 格式: func1方法
 * @param {number} dataBase (input) 数据库类型
 * @param {object} paraArray (input optional) 往回调函数中放入的参数 说明：附带上的参数
 * @param {number} callType (input optional) 组件类型
 * @param {object} callPara (input optional) 组件参数
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.submitSqlAsync = function(sqllist, functionlist,paraArray,callType,callPara) {
//	if(isShow==undefined||isShow==null){
//		isShow = true;
//	}
	
	$("#win_4_loading").show();
	document.getElementById("progressBar").style.width = "0%";
//	$("#win_4_loading").show();
	
	progressbarTwo.statusSum = 0; //统计已经查询完毕的所有sql的条数
	progressbarTwo.percentValue = 0;  // 累计进度条的百分比
	
	progressbarTwo.perList = new Array(); //记录每条sql的百分比
	
	var sqllist_inner = {};  //存储SQL语句
	
	
	for ( var i = 0; i < sqllist.length; i++) {
		sqllist_inner[i] = sqllist[i];
	}
	progressbarTwo.sqlsum = sqllist.length; //sqlsum这个变量没有定义?? 但它的作用是用来记录要查询的sql条数
	
	for ( var i = 0; i < progressbarTwo.sqlsum; i++) {// 初始化百分比数组，全部置为0
		progressbarTwo.perList[i] = 0;
		// console.log("初始化"+i+"=="+progressbar.perList[i]);
	}

	var progressbarUlHtml = "";
	var progressbartabHtml = "";
	
	//这里应该是点击详细信息时出现的内容
	for ( var i = 0; i < sqllist.length; i++) {
		if (i == 0) {
			progressbarUlHtml += '<li class="down">查询1</li>';
			progressbartabHtml += '<div class="tbli"><div class="lti_tip"><span class="tip_boxspan">查询SQL模板id='
					+ sqllist_inner[i][0]
					+ '...'
					+ '<div class="tip_box" >'
					+ sqllist_inner[i][0]
					+ '</div></span></div><div class="lti_box" id="div_executeLog'
					+ i + '"></div></div>';
		} else {
			progressbarUlHtml += "<li>查询" + (i + 1) + "</li>";
			progressbartabHtml += '<div class="tbli" style="display:none;"><div class="lti_tip"><span class="tip_boxspan">查询SQL模板id='
					+ sqllist_inner[i][0]
					+ '...'
					+ '<div class="tip_box" >'
					+ sqllist_inner[i][0]
					+ '</div></span></div><div class="lti_box" id="div_executeLog'
					+ i + '"></div></div>';

		}
	}
	
	
	$("#progressbarUl").html(progressbarUlHtml);
	$("#progressbartab").html(progressbartabHtml);
	
	progressbarTwo.initTab();
	
	var curSum = 0;//修改
	if(callType==1||callType=="1"){
		var paraUrl = progressbarTwo.getParaUrl(1,callPara);
		progressbarTwo.getOperationId(sqllist[0], functionlist[0],0,1,curSum,paraArray[0],paraUrl);
		return;
	}
	for ( var i = 0; i < sqllist.length; i++) {  //依次对每条sql提交查询
		progressbarTwo.getOperationId(sqllist_inner[i], functionlist[i], i, progressbarTwo.sqlsum, curSum,paraArray[i]);
	}
};

/**********************************
 * @funcname progressbarTwo.getOperationId
 * @funcdesc sql提交查询（返回操作的operationId）
 * @param {array} sqlParaList (input) 模板参数数组 格式：["id","key:value","key:value",…]
 * @param {function} fun (input) 回调函数 格式: func1方法
 * @param {number} bb (input) 表示第几条sql
 * @param {number} sqlsum (input) 总共要查询的sql条数
 * @param {number} curSum (input) 查询完成的条数
 * @param {object} para (input optional) 往回调函数里面带的参数
 * @param {object} paraUrl (input optional) 组件参数字符串
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.getOperationId = function(sqlParaList, fun, bb, sqlsum, curSum,para,paraUrl) {
	progressbarTwo.canel = 0;
	progressbarTwo.startTime = new Date();
	var appId=$('#currentAppId').val();
	var appName = $('#'+appId).text();
	if(paraUrl==""||paraUrl==undefined||paraUrl==null){
		paraUrl = "";
	}
	var operate_time = new Date().Format("yyyy-MM-dd HH:mm:ss"); //用户操作的时间
	progressbarTwo.userMap.put("operateTime" ,operate_time );
	progressbarTwo.userMap.put("reqParams", JSON.stringify(sqlParaList));  //请求参数
	noce.ajax("pages_util_ProgressbarTwo_submitCmdAsync.action", "cmd=" + encodeURIComponent(JSON.stringify(sqlParaList)) + "&database=" + "2"+"&appId="+appId+"&appName="+encodeURIComponent(appName)+paraUrl, function(msg) {
		var reqStart = new Date();
		var operationId = msg.cmdId;
		progressbarTwo.handIds.push(operationId);
		progressbarTwo.handleIdMap.put(operationId, reqStart);  // 这里将处理的ID和时间对应起来
		progressbarTwo.getStatusAnsLogs(operationId, fun, bb, sqlsum, curSum,para);
		
	}, false);
};
/**********************************
 * @funcname progressbarTwo.getStatusAnsLogs
 * @funcdesc 通过查询返回的operationId标志查询日志
 * @param {number} cmdId (input) 后台提交impala返回的标志id
 * @param {function} fun (input) 回调函数 格式: func1方法
 * @param {number} bb (input) 表示第几条sql
 * @param {number} sqlsum (input) 总共要查询的sql条数
 * @param {number} curSum (input) 查询完成的条数
 * @param {object} para (input optional) 往回调函数里面带的参数
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.getStatusAnsLogs = function(cmdId, fun, bb, sqlsum, curSum,para) {
	noce.ajax(
					"pages_util_Progressbar_getCmdExecLogBy.action",
					"cmdId=" + cmdId,
					function(msg) {
						var status = msg.status;
						var log = msg.log;
						var i = log.indexOf("%");
						var log1 = log.substring(0, i);
						var j = log1.lastIndexOf(" ");
						var log2 = log1.substring(j, i);

						// progressbar.percentValue=progressbar.percentValue+parseInt(log2)/sqlsum;

						progressbarTwo.perList[parseInt(bb)] = parseInt(log2)
								/ sqlsum;

						// 取值
						var percent = 0;
						for ( var i = 0; i < sqlsum; i++) {// 初始化百分比数组，全部置为0
							percent += parseInt(progressbarTwo.perList[i]);
						}

						percent += "%";
						// console.log("percent"+bb+"=="+percent);
						document.getElementById("progressBar").style.width = percent;
						$("#div_executeLog" + bb).append(log);

						if (progressbarTwo.canel == 0) {
							if (status == true) {
								progressbarTwo.statusSum++;
								curSum = curSum+1;
								progressbarTwo.endTime = new Date(); // 为查询结束时间赋值
								progressbarTwo.userMap.put("", progressbarTwo.getUseTime(progressbarTwo.startTime,progressbarTwo.endTime)); //请求消耗的时间
								$("#div_executeLog" + bb).append(progressbarTwo.getUseTime(progressbarTwo.startTime,progressbarTwo.endTime));
								$("#div_executeLog" + bb).append("<hr>");
								if (progressbarTwo.statusSum == sqlsum) {
									document.getElementById("progressBar").style.width = "100%";
									// $("#win_4_loading").hide();
									document.getElementById("progressBar").style.width = "0%";
								}
								progressbarTwo.getResult(cmdId, fun, bb,sqlsum, curSum,para);
							} else {
								var timeoutId = setTimeout(progressbarTwo.getStatusAnsLogs(cmdId, fun, bb, sqlsum, curSum,para), 3000);
								progressbarTwo.logTimeoutIds.push(timeoutId);

							}
						}

					}, false);
};
/**********************************
 * @funcname progressbarTwo.getResult
 * @funcdesc 通过操作码查询，返回查询结果
 * @param {number} cmdId (input) 后台提交impala返回的标志id
 * @param {function} fun (input) 回调函数 格式: func1方法
 * @param {number} bb (input) 表示第几条sql
 * @param {number} sqlsum (input) 总共要查询的sql条数
 * @param {number} curSum (input) 查询完成的条数
 * @param {object} para (input optional) 往回调函数里面带的参数
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.getResult = function(cmdId, fun, bb, sqlsum, curSum,para) {
	noce.ajaxAsync("pages_util_Progressbar_getCmdExecResult2.action",
			"cmdId=" + cmdId, function(msg) {
				//--------- 请求结束的时间--------
				progressbarTwo.userMap.put("userName", progressbarTwo.userName);
				progressbarTwo.userMap.put("appId" , progressbarTwo.getQueryString("appId"));
				progressbarTwo.userMap.put("appName" , progressbarTwo.getQueryString("appName"));
				
				var reqComplete = new Date(); // 执行完毕的时间
				var req_consuming_time = ""; // 请求耗时
				// 查询完成。清除handleId
				var handIds = progressbarTwo.handIds;
				var newHandIds = new Array();	
				for ( var i = 0; i < handIds.length; i++) {
					var handleId = handIds[i];
					if (Number(cmdId) != Number(handleId)) {
						newHandIds.push(handleId);
					}else{
						//hanleId所对应的handle已经执行完毕，这里可以获取打上结束时间 并且获取到这个hanleId所对应的开始时间，然后清除map中的handleId所对应的时间
						req_consuming_time = progressbarTwo.getConsuming(progressbarTwo.handleIdMap.get(handleId), reqComplete);
						progressbarTwo.handleIdMap.remove(handleId); //在获取到Map中的数据之后要把已经完成请求的handleId释放出去
						progressbarTwo.userMap.put("reqTimeConsuming", req_consuming_time);
					}
				}

				progressbarTwo.handIds = newHandIds;
//				console.log(msg);
				// var result=msg[0].result;
				//回调开始时间
				progressbarTwo.callback_start_time = new Date();
				var result = msg[0];
				if(para==undefined){
					if(fun.name != null || fun.name != ""){
						progressbarTwo.userMap.put("callbackName", fun.name);
					}else{
						progressbarTwo.userMap.put("callbackName", " ");
					}
					fun(result);	
				}else{
					if(fun.name != null || fun.name != ""){
						progressbarTwo.userMap.put("callbackName", fun.name);
					}else{
						progressbarTwo.userMap.put("callbackName", "");
					}
					fun(result,para);
				}
				
				//回调结束时间
				progressbarTwo.callback_complete_time = new Date();
				progressbarTwo.userMap.put("callbackTimeConsuming", progressbarTwo.getCallbackTime());
				progressbarTwo.userMap.put("totalTimeConsuming",req_consuming_time +  progressbarTwo.getCallbackTime());
				progressbarTwo.submitUserOperateRecord(progressbarTwo.userMap);
				if (progressbarTwo.statusSum == sqlsum) {
					$("#win_4_loading").hide();
				}
				if (curSum == sqlsum) {
					$("#win_4_loading").hide();
				}
			});
};

/**********************************
 * @funcname progressbarTwo.getUseTime
 * @funcdesc 通过查询的开始时间和结束时间计算出查询耗时
 * @param {object} startDate (input) 开始时间
 * @param {object} endDate (input) 结束时间
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.getUseTime = function(startDate, endDate) {
	var dateTime = endDate.getTime() - startDate.getTime(); // 时间差的毫秒数
	var milli = Math.abs(endDate.getMilliseconds()
			- startDate.getMilliseconds());

	// 计算出相差天数
	var days = Math.floor(dateTime / (24 * 3600 * 1000));
	// 计算出小时数
	var leave1 = dateTime % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));

	// 计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));

	// 计算相差秒数
	var leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000);

	return " 耗时: " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒" + milli + " 毫秒";
};

/**********************************
 * @funcname progressbarTwo.canelFunction
 * @funcdesc 取消当前impala异步查询
 * @param {null}
 * @return {null}
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.canelFunction = function() {
	// 取消轮询
	progressbarTwo.canel = 1;
	var logTimeoutIds = progressbarTwo.logTimeoutIds;
	for ( var i = 0; i < logTimeoutIds.length; i++) {
		clearTimeout(logTimeoutIds[i]);
	}

	// 后台发送取消请求
	if (progressbarTwo.handIds.length > 0) {
		$.ajax({
			type : "post",// 使用post方法访问后台
			data : {
				'cmdIds' : progressbarTwo.handIds.toString()
			},
			// dataType: "json",//返回json格式的数据
			url : "pages_util_Progressbar_cancelCmd.action",// 要访问的后台地址
			success : function(msg) {// msg为返回的数据，在这里做数据绑定
				progressbarTwo.handIds = new Array();
				progressbarTwo.logTimeoutIds = new Array();
			}
		});
	}
};

/**********************************
 * @funcname progressbarTwo.getParaUrl
 * @funcdesc 返回根据组件类型和参数拼装的字符串
 * @param {number} type 组件类型
 * @param {object} callPara 组件参数
 * @return {string} 根据组件类型拼接后的字符串
 * @author 梁杰禹
 * @create 20170808
 * @modifier 
 * @modify 
 ***********************************/
progressbarTwo.getParaUrl = function(type,callPara){
	var paraUrl = "";
	
	if(type==1){
		for(var item in callPara){
			paraUrl = paraUrl+"&tableToolsPara."+item+"="+callPara[item];
		} 
		paraUrl +="&toolsType="+type;
	}
	return paraUrl;
};
$(function(){
	// 浏览器关闭，浏览器刷新 ，取消查询
	$(window).unload(function() {
		progressbarTwo.canelFunction();
	});

	document.onkeydown = function (e) {
		if (e.altKey && e.ctrlKey && e.shiftKey && e.keyCode == 68) {//ctrl+alt+shift+D
			if ($('.debugElement').is(':hidden')){
				$('.debugElement').show()
			}else{
				$('.debugElement').hide()
			}

		}
	}

	
});
progressbarTwo.initTab = function() {
	// 关闭加载条，先将click事件解绑，在绑定
	$("#win_4_loadingClose").unbind("click").bind("click",function() {
		$("#win_4_loading").hide();
		progressbarTwo.canelFunction();
	});
	
	// 日志信息显示，先将click事件解绑，在绑定
	$("#win_4_infobtn").unbind("click").bind("click",function() {
		var ob = $("#win_4_info");
		var b_dis = ob.css("display");
		if (b_dis == "none") {
			ob.show();
		} else {
			ob.hide();
		}
		;
	});
	
	$(".pcbox_nr .tab li").click(
			function() {
				var idx = $(this).index();
				$(this).addClass("down").siblings().removeClass("down");
				$(this).parent().parent().siblings(".tabbox").children(".tbli")
						.eq(idx).show().siblings().hide();
			});
};


//------------------增加多实例的提交方法，适用于可取消本次的ajax请求-------------------------
// function progressbarTwoMultiple(sqllist, functionlist,dataBase,paraArray,isAsync_ImpalaQuery,callType,callPara,isSync,dbName){
function progressbarTwoMultiple(){

	// console.log("方法参数长度:",arguments.length)
	let sqllist = [], functionlist = [],dataBase = [],paraArray =[],isAsync_ImpalaQuery =false,callType,callPara,isSync,dbName,showXPath
	if (arguments.length == 1 && (typeof arguments[0] == 'object')){
		//只有一个参数，并且是对象，进行解构赋值获取参数
		let {sqlListPara,functionListPara,dataBasePara,paraArrayPara,isAsync_ImpalaQueryPara,callTypePara,callParaPara,isSyncPara,dbNamePara,xpath} = arguments[0]
		sqllist = sqlListPara
		functionlist = functionListPara
		dataBase = dataBasePara
		paraArray = paraArrayPara
		isAsync_ImpalaQuery = isAsync_ImpalaQueryPara
		callType =callTypePara
		callPara = callParaPara
		isSync = isSyncPara
		dbName = dbNamePara
		showXPath = xpath
	}else{
		sqllist = arguments[0];
		functionlist = arguments[1];
		dataBase = arguments[2];
		paraArray = arguments[3];
		isAsync_ImpalaQuery = arguments[4];
		callType = arguments[5];
		callPara = arguments[6];
		isSync = arguments[7];
		dbName = arguments[8];
		showXPath = arguments[8];
	}

	this.sqllist = sqllist;
	this.functionlist = functionlist;
	this.dataBase = dataBase;
	this.paraArray = paraArray;
	this.isAsync_ImpalaQuery = isAsync_ImpalaQuery;
	this.callType = callType;
	this.callPara = callPara;
	this.isSync = isSync;
	this.dbName = dbName;
	this.sqlListCount = 0;
	this.completeCount = 0;
	this.sqlListAjax = [];
	this.xpath = showXPath
	this.showDataXPathNodeElement = null;
	let showDataXPathNode = document.evaluate(this.xpath,document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
	let showDataXPathNodeElement = null;
	if (showDataXPathNode.snapshotLength > 0){
		showDataXPathNodeElement = showDataXPathNode.snapshotItem(0);
		// $(showDataXPathNodeElement).html('');
		this.showDataXPathNodeElement = showDataXPathNodeElement;
	}


	if(dbName!=undefined||dbName!=null){
		this.sqlListCount = sqllist.length;
		for ( var i = 0; i < sqllist.length; i++) {  
			this.submitSqlAjax(sqllist[i],functionlist[i],dataBase[i],null,null,dbName[i]);
		}
		return;
	}
	if(isAsync_ImpalaQuery==undefined||isAsync_ImpalaQuery==null){
		isAsync_ImpalaQuery = false;
	}
	if(isSync==undefined||isSync==null){
		isSync = false;
	}
	if(callType == undefined || callType==null){
		callType = false;
	}
	
	if(!Array.isArray(paraArray)){
		paraArray = [];
	}
	
	if(sqllist.length==0){
		alert("传入的sql参数长度为0，请检查....");
		return;
	}
	//impala后台异步查询
	if(isAsync_ImpalaQuery){
		progressbarTwo.submitSqlAsync(sqllist,functionlist,paraArray,callType,callPara); // -----
		return;
	}
	if(noceUtil.isUndefined(dataBase)){
		dataBase = [];
	}
	
	if(callType==1||callType=="1"){
		this.sqlListCount = 1;
		var paraUrl = progressbarTwo.getParaUrl(1,callPara);
		this.submitSqlAjax(sqllist[0], functionlist[0],dataBase[0],paraArray[0],paraUrl);  // --------
		return;
	}
	
	if(isSync){
		// 依次对每条sql提交查询
		this.sqlListCount = sqllist.length;
		for ( var i = 0; i < sqllist.length; i++) {  
			if(dataBase[i]==null||dataBase[i]==undefined||dataBase[i].length==0){
				dataBase[i] = 2;
			}
			this.submitSqlSync(sqllist[i], functionlist[i],dataBase[i],paraArray[i]); // -------
		}
		return;
	}
	
	//依次对每条sql提交查询
	this.sqlListCount = sqllist.length;
	for ( var i = 0; i < sqllist.length; i++) {  
		if(dataBase[i]==null||dataBase[i]==undefined||dataBase[i].length==0){
			dataBase[i] = 2;
		}
		this.submitSqlAjax(sqllist[i], functionlist[i],dataBase[i],paraArray[i]);
	}
	
	
}

progressbarTwoMultiple.prototype = {
	sqllist: [],
	functionlist : [],
	dataBase : [],
	paraArray : [],
	isAsync_ImpalaQuery : false,
	callType : 1,
	callPara : {},
	isSync : false,
	dbName : null,
	sqlListCount : 0,
	completeCount : 0,
	sqlListAjax : [],
	submitSqlAjax: function(sqlParaList, callBackFunc,dataBase,paraAny,paraUrl,databaseName){
		var appId=$('#currentAppId').val();
		var appName = $('#'+appId).text();
		if(paraUrl==""||paraUrl==undefined||paraUrl==null){
			paraUrl = "";
		}
		var uor = new Map(); //创建一个map保存所有的信息
		var operate_time = new Date().Format("yyyy-MM-dd HH:mm:ss");  //创建操作时间
		progressbarTwo.req_start_time = new Date(); // 初始时间
		let req_start_time = new Date(); // 初始时间
		let objectThis = this;
		var $ajax = noce.ajax("pages_util_ProgressbarTwo_submitCmd.action", "cmd=" + encodeURIComponent(JSON.stringify(sqlParaList)) + "&database=" + dataBase +"&appId="+appId+"&appName="+encodeURIComponent(appName)+paraUrl+"&dbName="+databaseName, function(data) {
			progressbarTwo.req_complete_time = new Date(); // 创建请求结束时间
			var totalReq = progressbarTwo.getReqTime(); // 计算总的加载时间
			//回调开始 
			progressbarTwo.callback_start_time = new Date(); // 记录回调函数开始时间

			progressbarTwo.handleDataToShow(data,sqlParaList,req_start_time,this.showDataXPathNodeElement)

			if(typeof(paraAny) == "undefined"){
				if(callBackFunc.name != null || callBackFunc.name != ""){
					uor.put("callbackName", callBackFunc.name);
				}else{
					uor.put("callbackName", " ");
				}
				callBackFunc(data);
			}else{
				if(callBackFunc.name != null || callBackFunc.name != ""){
					uor.put("callbackName", callBackFunc.name);
				}else{
					uor.put("callbackName", " ");
				}
				callBackFunc(data,paraAny);
			}
            objectThis.completeCount++;
			if(objectThis.completeCount == objectThis.sqlListCount){
				// console.log("submitSqlAjax：sql查询完成");
			}
			//回调结束
			progressbarTwo.callback_complete_time = new Date(); // 记录回调结束时间
			var totalCallback = progressbarTwo.getCallbackTime(); // 计算回调函数总耗时
			//在这里将所有的参数都放到数组中并调用上面的方法将数据传入后台进行持久化操作
			uor.put("userName" , progressbarTwo.userName);
			uor.put("appId" , progressbarTwo.getQueryString("appId"));
			uor.put("appName" , progressbarTwo.getQueryString("appName"));
			uor.put("operateTime" , operate_time);
			uor.put("reqParams" , JSON.stringify(sqlParaList));
			uor.put("reqTimeConsuming" , totalReq);
			uor.put("callbackTimeConsuming" , totalCallback);
			uor.put("totalTimeConsuming" , totalReq + totalCallback);
			//调用方法将数据保存到数据库中
			progressbarTwo.submitUserOperateRecord(uor);
		}, true);
		this.sqlListAjax.push($ajax);
	},
	submitSqlSync:function(sqlParaList, callBackFunc,dataBase,paraAny,paraUrl){
		var appId=$('#currentAppId').val();
		var appName = $('#'+appId).text();
		if(paraUrl==""||paraUrl==undefined||paraUrl==null){
			paraUrl = "";
		}
		
		var uor = new Map();//创建一个map保存所有的信息
		var operate_time = new Date().Format("yyyy-MM-dd HH:mm:ss");  
		//初始时间
		progressbarTwo.req_start_time = new Date();
		let req_start_time = new Date();

		var objectThis = this;

		var $ajax = noce.ajaxAsync("pages_util_ProgressbarTwo_submitCmd.action", "cmd=" + encodeURIComponent(JSON.stringify(sqlParaList)) + "&database=" + dataBase +"&appId="+appId+"&appName="+encodeURIComponent(appName)+paraUrl, function(data) {
			progressbarTwo.req_complete_time = new Date();
			var totalReq = progressbarTwo.getReqTime();
			//回调开始 
			progressbarTwo.callback_start_time = new Date();

			progressbarTwo.handleDataToShow(data,sqlParaList,req_start_time,this.showDataXPathNodeElement)

			//回调开始  声明一个回调开始时间
			if(typeof(paraAny) == "undefined"){
				if(callBackFunc.name != null || callBackFunc.name != ""){
					uor.put("callbackName", callBackFunc.name);
				}else{
					uor.put("callbackName", " ");
				}
				callBackFunc(data);
			}else{
				if(callBackFunc.name != null || callBackFunc.name != ""){
					uor.put("callbackName", callBackFunc.name);
				}else{
					uor.put("callbackName", " ");
				}
				callBackFunc(data,paraAny);
			}

            objectThis.completeCount++;
			if(objectThis.completeCount == objectThis.sqlListCount){
				// console.log("submitSqlSync：sql查询完成");
			}
			
			//回调结束
			progressbarTwo.callback_complete_time = new Date();
			var totalCallback = progressbarTwo.getCallbackTime();
			//在这里将所有的参数都放到数组中并调用上面的方法将数据传入后台进行持久化操作
			uor.put("userName" , progressbarTwo.userName);
			uor.put("appId" , progressbarTwo.getQueryString("appId"));
			uor.put("appName" , progressbarTwo.getQueryString("appName"));
			uor.put("operateTime" , operate_time);
			uor.put("reqParams" , JSON.stringify(sqlParaList));
			uor.put("reqTimeConsuming" , totalReq);
			uor.put("callbackTimeConsuming" , totalCallback);
			uor.put("totalTimeConsuming" , totalReq + totalCallback);
			//调用方法将数据保存到数据库中
			progressbarTwo.submitUserOperateRecord(uor);
		});
		this.sqlListAjax.push($ajax);
		
	},
	cancelSqlAjax: function(){
		for(var i=0;i<this.sqlListAjax.length;i++){
			if (this.sqlListAjax[i] != null && this.sqlListAjax[i].state() === 'pending') {
				this.sqlListAjax[i].abort();
                this.sqlListAjax[i] = null;
		    }
		}
		this.sqlListAjax = null;
		this.sqlListAjax = [];
	}
}

progressbarTwo.handleDataToShow = function (data,sqlParaList,req_start_time,showDataXPathNodeElement){
	let callback_start_time = new Date();
	let showData = []
	if(Array.isArray(data.result)){
		let dataResultLength = data.result.length
		let top5Result = [];
		if(dataResultLength < 5){
			top5Result = [...data.result]
		}else{
			top5Result = data.result.slice(0,5)
		}
		let top5Data = {
			types:data.types,
			result:top5Result,
			columns:data.columns,
		}
		showData = callBackChangeData(top5Data)
	}

	let queryDataResult = {
		queryTotalTime: (callback_start_time.getTime() - req_start_time.getTime()),
		queryPara: JSON.stringify(sqlParaList),
		querySql:data['SQL'],
		queryDataResult:showData,
	}

	progressbarTwo.handleQuerySql(queryDataResult,showDataXPathNodeElement);
}


//------------------增加多实例的提交方法，适用于可取消本次的ajax请求 end -------------------------

function isNull(obj){
	if(obj == undefined || obj == null || obj.length == 0){
		return true;
	}
	return false;
}

function isArray(object){
    return object && typeof object==='object' &&
        Array == object.constructor;
}

/**
 * ********************************
 * @funcname progressbarTwo.excuteSimpleQuery
 * @funcdesc 将简单查询的参数进行封装，然后执行submitSQL的方法进行查询
 * @param {String/Array} queryTemplete : 查询的模板条件
 * 		  {Object/Array} callbackFun ： 回调函数
 *		  {int/Array} database : 数据库条件
 *		  {Object/Array} params : 参数
 *		  {String/Array} dbName : 数据源的名称
 * @return
 * @author 林楚佳
 * @create
 **********************************
 */
progressbarTwo.excuteSimpleQuery = function(queryTemplete , callbackFun , database , params , dbName ){
    var sqlList = [];
    var list = [];
    var databaseList = [];
    var funcList = [];
    var paramsList = [];
    var dbNameList = [];
    if(!isNull(queryTemplete) && !isNull(callbackFun) && !isNull(database)){ //这三个必要条件一定不能为空
		//这里对参数进行封装
		//第一步： 将queryTemplete封装成一个二维数组sqlList
		if(!isArray(queryTemplete)){ //如果不是数组，需要将这个变量设置为数组
			list.push(queryTemplete); //将queryTemplete放入数组中
			sqlList.push(list);
		}else{
			if(queryTemplete.length > 0 && isArray(queryTemplete[0])){  //queryTemplete为二维数组，不需要进行封装
                sqlList = queryTemplete;
			}else if(queryTemplete.length > 0 && !isArray(queryTemplete[0])){ //将这个一位数组放入sqlList中
                sqlList.push(queryTemplete);
			}else{
                console.log("缺失必要的参数");
			}
		}

		//第二步：将callbackFun进行封装，封装成一个数组
		if(!isArray(callbackFun)){ //不是一个数组
			funcList.push(callbackFun); //将回调函数放入数组中
		}else{
			funcList = callbackFun; //这是一个回调函数的数组，直接将funcList设置为callbackFunc
		}

		//第三步：将database封装成一个数组
        if(!isArray(database)){ //不是一个数组
            databaseList.push(database); //将回调函数放入数组中
        }else{
            databaseList = database; //这是一个回调函数的数组，直接将databaseList设置为database
        }

        //第四步：如果params参数不为空的时候，需要将其封装成一个数组
		if(!isNull(params)){
			if(!isArray(params)){ //params不是数组
				paramsList.push(params); //将参数放入到数组中
			}else{
				if(params.length > 0 && isArray(params[0])){ //params是一个二维数组
                    paramsList = params; //直接将paramsList设置为params
				}else{
                    paramsList.push(params);
				}
			}
		}

		//第五步：如果dbName不为空的时候，需要将其封装成一个数组
        if(!isNull(dbName)){
            if(!isArray(dbName)){ //dbName不是数组
                dbNameList.push(dbName); //将dbName放入到数组中
            }else{
                dbNameList =dbName ;
            }
        }

        progressbarTwo.submitSql(sqlList, funcList,databaseList,paramsList,null,null,null,null,dbNameList); //执行查询

	}else{
        console.log("缺失必要的参数");
	}

}


