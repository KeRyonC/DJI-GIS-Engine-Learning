/**
 * 基于 Cesium.js 的大疆三维模型加载与优化模块
 */
async function initDJIModelViewer(viewer, tilesetUrl) {
    try {
        // 加载大疆智图生成的 3D Tiles 倾斜摄影模型
        const tileset = await Cesium.Cesium3DTileset.fromUrl(tilesetUrl, {
            // 性能优化配置：控制内存占用与加载精细度
            maximumScreenSpaceError: 16, // 数值越大，加载越粗糙，但性能越好
            maximumMemoryUsage: 512,    // 限制最大显存占用 (MB)
            skipLevelOfDetail: true,     // 跳过层级加载，加快显示速度
        });

        // 将模型添加到场景中
        viewer.scene.primitives.add(tileset);

        // 视角自动跳转至模型位置
        await viewer.zoomTo(tileset);
        
        console.log("大疆倾斜摄影模型加载成功！");

        // 添加一个点击交互：获取空间坐标
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click) => {
            const cartesian = viewer.scene.pickPosition(click.position);
            if (Cesium.defined(cartesian)) {
                const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                const lat = Cesium.Math.toDegrees(cartographic.latitude);
                const lon = Cesium.Math.toDegrees(cartographic.longitude);
                console.log(`当前测区采集点坐标: 经度 ${lon.toFixed(6)}, 纬度 ${lat.toFixed(6)}`);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    } catch (error) {
        console.error("模型加载失败，请检查 tileset.json 路径:", error);
    }
}
