function callBackChangeData(data,offset) {
	var result = data.result;
	var cloumns = data.columns;
	var resultArray = [];
	if (result == undefined || cloumns == undefined) {
		return resultArray;
	}
	for ( var i = 0; i < result.length; i++) {
		var rs = result[i];
		var dataRsult = {};
		for ( var j = 0; j < rs.length; j++) {
			// var dataC = JSON.stringify(cloumns[j]);
			var dataC = cloumns[j];
			var dataR = rs[j];
			dataRsult[dataC] = dataR;
		}
		resultArray.push(dataRsult);
	}
	return resultArray;
}

function callBackChangeData2(data,offset) {
	var result = data.result;
	var cloumns = data.columns;
	var resultArray = [];
	if (result == undefined || cloumns == undefined) {
		return resultArray;
	}
	for ( var i = 0; i < result.length; i++) {
		var rs = result[i];
		var dataRsult = {};
		if(offset!=undefined){
			dataRsult.row=offset+i;
		}
		for ( var j = 0; j < rs.length; j++) {
			// var dataC = JSON.stringify(cloumns[j]);
			var dataC = cloumns[j];
			var dataR = rs[j];
			dataRsult[dataC] = dataR;
		}
		resultArray.push(dataRsult);
	}
	return resultArray;
}

function callBackChangeDataES6(data){
    let {result=[],cloumns=[],type=[]} = data;
    let resultArray = [];
    if(result.length==0 || cloumns.length==0){
        return resultArray;
    }
    for(let i=0;i<result.length;i++){
        let rs = result[i];
        let dataRsult = {};
        for ( let j = 0; j < rs.length; j++) {
            // var dataC = JSON.stringify(cloumns[j]);
            let dataC = cloumns[j];
            let dataR = rs[j];
            dataRsult[dataC] = dataR;
        }
        resultArray.push(dataRsult);
    }
    return resultArray;
}

/**********************************
 * @funcname callBackSortData
 * @funcdesc 根据传入的数据按照指定的areaList进行排序,该处理场景只适合第一个字段是区的字段数据
 * @param {data} type (input) 传入的数据进行排序处理
 * @return {data}
 * @author 沈士强
 * @create 20170612
 * @modifier 沈士强
 * @modify 20170612
 ***********************************/
function callBackSortData(data) {
	var result = data.result;
	var cloumns = data.columns;
	var resultArray = [];
	var areaList=["天河","白云","海珠","番禺","荔湾","越秀","黄萝","东山","增城","花都","南沙","从化"];
	if (result == undefined || cloumns == undefined) {
		return resultArray;
	}
	for(var h = 0;h <areaList.length; h++){
		for ( var i = 0; i < result.length; i++) {
			var rs = result[i];
			var dataN;
			var str = rs[0];//第一个字段是区的字段数据
			if(str != "" && typeof(str) !="undefined"){				
				if(str.length>8){
					//查hbase返回的key值:20170603_D_2_广州_天河
					dataN = str.substring(str.lastIndexOf("_")+1,str.length);
				}else{				
					dataN = str;
				}
			}
			var area_name = areaList[h];
			var dataRsult = {};
			if(dataN == area_name){
				for ( var j = 0; j < rs.length; j++) {
					var dataC = cloumns[j];
					var dataR = rs[j];
					dataRsult[dataC] = dataR;
				}
				resultArray.push(dataRsult);
			}
		}
	}
	return resultArray;
}

/**********************************
 * @funcname reverseChangeDataUtil
 * @funcdesc 根据传入的数据将数据反转重构成默认回调函数的数据格式
 * @param {data} type (input) 传入的数据进行排序处理
 * @return {data}
 * @author 沈士强
 * @create 20170612
 * @modifier 沈士强
 * @modify 20170612
 ***********************************/
function reverseDataForCallBackDataUtil(result){
	var data = {};
	var columns = [];
	var dataResult = [];
	if($.isArray(result)){
		for(var i=0;i<result.length;i++){
			if(i==0){
				for(var k in result[i]){
					columns.push(k);
				}
			}
			var d = [];
			for(var j=0;j<columns.length;j++){
				d.push(result[i][columns[j]]);
			}
			dataResult.push(d);
		}
	}
	data.columns = columns;
	data.result = dataResult;
	return data;
}

function reverseDataForCallBackDataUtil2(result,fileds){
	var data = {};
	var columns = [];
	var dataResult = [];
	var filedArr=[];
	if($.inArray(fileds)){
		filedArr=fileds;
	}
	if($.isArray(result)){
		for(var i=0;i<result.length;i++){
			if(i==0){
				for(var k in result[i]){
					if(!filedArr.includes(k)){
						columns.push(k);
					}
				}
			}
			var d = [];
			for(var j=0;j<columns.length;j++){
				d.push(result[i][columns[j]]);
			}
			dataResult.push(d);
		}
	}
	data.columns = columns;
	data.result = dataResult;
	return data;
}