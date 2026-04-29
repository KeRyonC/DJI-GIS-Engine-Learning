import pyproj

class GISDataProcessor:
    """
    处理大疆无人机外业 POS 数据的高精度坐标转换工具
    """
    def __init__(self):
        # 定义 WGS84 坐标系 (EPSG:4326)
        self.wgs84 = pyproj.CRS("EPSG:4326")
        # 定义 CGCS2000 坐标系 (以国家 2000 投影坐标系为例，如 EPSG:4490 或具体的投影分带)
        self.cgcs2000 = pyproj.CRS("EPSG:4490")
        
        # 初始化转换器
        self.transformer = pyproj.Transformer.from_crs(self.wgs84, self.cgcs2000, always_xy=True)

    def transform_point(self, lon, lat, alt):
        """
        单点转换逻辑
        """
        x, y, z = self.transformer.transform(lon, lat, alt)
        return {
            "east": round(x, 4),
            "north": round(y, 4),
            "height": round(z, 4)
        }

# 模拟大疆 POS 数据解析
if __name__ == "__main__":
    processor = GISDataProcessor()
    # 模拟一个大疆无人机记录的经纬度点
    dji_pos = (116.397, 39.908, 100.5) 
    result = processor.transform_point(*dji_pos)
    print(f"转换后的 CGCS2000 坐标: {result}")