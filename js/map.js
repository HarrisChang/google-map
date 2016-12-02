var map, myOptions, mapobj = {};
mapobj.latlng = [];
mapobj.markerArr = [];
mapobj.infowindow = [];
mapobj.zd = [];
myOptions = {
	zoom: 8,
	center: new google.maps.LatLng(22.3175355, 114.1600872),
	panControl: false,
	zoomControl: false,
	mapTypeControl: false,
	scaleControl: false,
	streetViewControl: false,
	overviewMapControl: false,
	rotateControl: false,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

map = new google.maps.Map(document.getElementById("google_map"), myOptions);
var geocoder = new google.maps.Geocoder();
var bounds = new google.maps.LatLngBounds();

// 清空地图上的标记
function clearMarkers() {
	for(var j = 0; j < mapobj.markerArr.length; j++) {
		mapobj.markerArr[j].setMap(null);
	}
	mapobj.latlng = [];
	mapobj.markerArr = [];
	mapobj.infowindow = [];
	mapobj.zd = [];
};

function setMapMark(data, i) {
	var gps_01 = data.lat,
		gps_02 = data.lng,
		cityName = data.name;
	if(i == 0) {
		var centerL = new google.maps.LatLng(gps_01, gps_02);
		map.setCenter(centerL);
	}
	var marker = new MarkerWithLabel({
		position: new google.maps.LatLng(gps_01, gps_02),
		map: map,
		title: cityName,
		zIndex: 2 * i + 1,
		icon: "./images/map-a.png",
		labelContent: "<img src='./images/map-a.png' /><div>" + (i + 1) + "</div><p>" + data.name + "</p>",
		labelClass: "mapIconLabel",
		labelInBackground: true
	})
	mapobj.latlng.push(new google.maps.LatLng(gps_01, gps_02));
	mapobj.markerArr.push(marker);
	mapobj.zd.push(2 * i);
	setInfoWin(marker, '<p>消息框</p>');
};

function setInfoWin(marker, con) {
	var $F = $(con).appendTo("body");
	var Info_height = $F.height() * (-1) - 60;
	$F.remove();
	var myInfo = {
		content: con,
		disableAutoPan: true,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(-213, Info_height),
		zIndex: 1,
		boxStyle: {
			background: "#fff",
			border: "3px solid #f9333c",
			opacity: 1,
			borderRadius: "8px",
			width: "420px"
		},
		closeBoxMargin: "2px 2px 2px 2px",
		closeBoxUrl: "/images/cha.png",
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: "floatPane",
		enableEventPropagation: false
	};
	var ib = new InfoBox(myInfo);
	mapobj.infowindow.push(ib);
	google.maps.event.addListener(marker, "click", function(e) {
		//关闭所有视窗
		for(var i = 0; i < mapobj.infowindow.length; i++) {
			mapobj.infowindow[i].close();
		}
		//还原所有旗子
		for(var i = 0; i < mapobj.infowindow.length; i++) {
			mapobj.markerArr[i].setZIndex(mapobj.zd[i]); //还原层级
			var Mhtms = mapobj.markerArr[i].get("labelContent");
			mapobj.markerArr[i].set("labelContent", Mhtms.replace("map-b.png", "map-a.png")); //还原图标颜色
		};

		var selectItem = $(this)[0].labelContent.split("<div>")[1].split("</div>")[0];
		map.setCenter(mapobj.latlng[selectItem]);
		marker.setZIndex(99999);
		var Mhtm = marker.get("labelContent");
		marker.set("labelContent", Mhtm.replace("map-a.png", "map-b.png"));
		$("ul.cities li").css("color", "black");
		$("ul.cities li:eq(" + (selectItem - 1) + ")").css("color", "red");
		//滚动条位置
		var t = selectItem * 20 - 20;
		$("ul.cities").scrollTop(t);
	})
}

Array.prototype.getIndex = function(item) {
	if(!this.length || !item) {
		return -1;
	};
	var len = this.length;
	for(var i = 0; i < len; i++) {
		if(this[i] == item) {
			return 1;
		}
	}
	return -1;
}

function setMarkers() {
	var Gps_group = $("#lal_Gps").html().slice(0, -1).split("#");
	var Names_group = $("#lal_Name").html().slice(0, -1).split("#");
	//将地图中心定位至数据库中第一家营业厅处
	var centerL = new google.maps.LatLng(Gps_group[0].split(", ")[0], Gps_group[0].split(", ")[1]);
	map.setCenter(centerL);
	//默认地址和营业时间          
	$(".store-address .c_Info").css("display", "none");
	$(".store-address .c_Info").eq(0).css("display", "block");
	$(".business-hour .c_time").css("display", "none");
	$(".business-hour .c_time").eq(0).css("display", "block");
	for(var i = 0; i < Gps_group.length; i++) {
		var gps_01 = Gps_group[i].split(", ")[0];
		var gps_02 = Gps_group[i].split(", ")[1];
		var titles = (Names_group[i].split("- ")[1] == undefined) ? Names_group[i] : Names_group[i].split("- ")[1];
		if((Gps_group[i] != "") && (gps_01 != undefined) && (gps_02 != undefined)) {

			//获取营业点名称及对应的GPS信息                                              
			bounds.extend(new google.maps.LatLng(gps_01, gps_02));
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(gps_01, gps_02),
				map: map,
				title: titles,
				icon: ""
			});
			mapobj.latlng.push(new google.maps.LatLng(gps_01, gps_02));
			mapobj.markerArr.push(marker);
			google.maps.event.addListener(marker, 'click', function(e) {
				var this_title = $(this)[0].title;
				for(var j = 0; j < Names_group.length; j++) {
					if(this_title == Names_group[j].split("- ")[1]) {
						var centerL = new google.maps.LatLng(Gps_group[j].split(", ")[0], Gps_group[j].split(", ")[1]);
						map.setCenter(centerL);
						$(".store-address .c_Info").css("display", "none");
						$(".store-address .c_Info").eq(j).css("display", "block");
						$(".business-hour .c_time").css("display", "none");
						$(".business-hour .c_time").eq(j).css("display", "block");
					}
				}
			});
			map.fitBounds(bounds);
		}
	}
}