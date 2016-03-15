var baidu_map = {
    init: function(para) {

        var para_default = {
            map_obj_id: null, // 地图容器ID。无默认值。
            enableScrollWheelZoom: true, // 允许滚轮缩放。默认值：true
            NavigationControl: true, // 左上角缩放尺。默认值：true
            ScaleControl: true, // 左下角比例尺。默认值：true
            OverviewMapControl: true, // 右下角小地图：true
            CurrentCity: "北京", // 当前城市。默认值：北京
            MapTypeControl: true, // 右上角地图种类，仅当设置当前城市后可用。默认值：true
            PointKeywords: null, // 定点标注搜索。无默认值
            PointBounce: true, // 定点标注跳动。默认值：true
            PointClick: null, // 定点标注点击回调。无默认值
            SearchKeywords: null, // 搜索关键词。无默认值
            Zoom: 16 // 默认缩放比例。默认值：16
        };

        para = $.extend(para_default, para);

        var map = new BMap.Map(para.map_obj_id); // 创建地图实例 


        if(para.enableScrollWheelZoom)
            map.enableScrollWheelZoom(); // 允许滚轮缩放
        if (para.NavigationControl)
            map.addControl(new BMap.NavigationControl()); // 左上角缩放尺
        if (para.ScaleControl)
            map.addControl(new BMap.ScaleControl()); // 左下角比例尺
        if (para.OverviewMapControl)
            map.addControl(new BMap.OverviewMapControl()); // 右下角小地图
        if (para.MapTypeControl)
            map.addControl(new BMap.MapTypeControl()); // 右上角地图种类
        if (para.CurrentCity)
            map.setCurrentCity(para.CurrentCity); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用

        if (!para.PointKeywords && !para.SearchKeywords)
            para.PointKeywords = "北京天安门"

        // 定点标注
        this.PointMarker(map, para);

        // 关键词搜索
        this.Search(map, para);
    },

    // 定点标注
    PointMarker: function(map, para) {
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(para.PointKeywords, function(point) {
            if (point) {
                map.centerAndZoom(point, para.Zoom);
                var marker = new BMap.Marker(point); // 创建标注   
                if (para.PointBounce)
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画 

                if (para.PointClick)
                    marker.addEventListener("click", para.PointClick);

                map.addOverlay(marker);
            }
        }, para.CurrentCity);
    },

    // 关键词搜索
    Search: function(map, para) {

        var local = new BMap.LocalSearch(map, {
            renderOptions: { map: map }
        });
        local.search(para.SearchKeywords);
    }
};
