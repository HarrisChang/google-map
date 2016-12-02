//获取全部省份信息
$.ajax({
	type: "get",
	url: "./mapdata.json",
	dataType: "json",
	async: true,
	success: function(data) {
		resetSelectList(data);
	},
	error: function(error) {
		alert("error!");
	}
});
//将省份信息生成下拉列表
function resetSelectList(data){
	var dataLists = data.provinces;
	console.log(dataLists);
	$(".diy_select_txt").text(dataLists[0].name);
	for(var i = 0; i < dataLists.length; i++){
		var $lis = $("<li>"+ dataLists[i].name +"</li>");
		$(".diy_select_list").append($lis);
	};
	//默认显示北京市的城市列表并在地图上标记
	for(var j = 0; j < dataLists[0].cities.length; j++){
		setMapMark(dataLists[0].cities[j],j);
	};
	resetCityList(dataLists[0].cities);
};
//点击下拉列表时显示该省份的城市
$("body").on("click",".diy_select_list li",function(){
	var select_index = $(this).index();
	$.ajax({
		type: "get",
		url: "./mapdata.json",
		dataType: "json",
		async: true,
		success: function(data) {
			var cities_details = data.provinces[select_index].cities;
			resetCityList(cities_details);
			clearMarkers();
			for(var i = 0; i < cities_details.length; i++){
				setMapMark(cities_details[i],i);
			}
		},
		error: function(error) {
			alert("error!");
		}
	});
});

//在右侧列表中生成对应省份的城市名
function resetCityList(cities_details){
	$(".cities").html("");
	for(var i = 0; i < cities_details.length; i++){
		var $lis = $("<li>" + cities_details[i].name + "</li>");
		$(".cities").append($lis);
	}
}
