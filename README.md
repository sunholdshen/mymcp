# 天气查询 MCP 服务

这是一个简单的天气查询MCP（Model Completion Plugin）服务，可以让你通过Cursor AI助手查询全球城市的天气状况。

## 准备工作

1. 注册并获取OpenWeatherMap API密钥：
   - 访问 [OpenWeatherMap](https://openweathermap.org/) 网站
   - 注册一个免费账户
   - 获取API密钥

2. 配置环境变量：
   - 在项目根目录中找到`.env`文件
   - 将你的API密钥填入`OPENWEATHER_API_KEY=your_api_key_here`

## 本地运行

1. 安装依赖：
```
npm install
```

2. 启动服务：
```
npm start
```

或者使用开发模式（自动重启）：
```
npm run dev
```

3. 服务将在 http://localhost:3001 上运行
   - MCP清单: http://localhost:3001/mcp-manifest.json
   - OpenAPI规范: http://localhost:3001/openapi.json

## 部署到公网

为了让Cursor能够使用这个MCP服务，你需要将其部署到公网可访问的地址。以下是几种简单的方法：

### 使用ngrok进行临时公开（开发测试用）

1. 安装ngrok：
   - 访问 [ngrok.com](https://ngrok.com/) 注册并下载
   - 按照官方指南设置ngrok

2. 在本地启动你的服务：
```
npm start
```

3. 在另一个终端窗口启动ngrok：
```
ngrok http 3001
```

4. ngrok会提供一个公开URL（例如 `https://abc123.ngrok.io`）
   - 使用这个URL来配置Cursor中的MCP服务

### 部署到Render.com（免费方案）

1. 注册 [Render.com](https://render.com/) 账户

2. 创建新的Web服务：
   - 连接你的GitHub仓库
   - 设置构建命令：`npm install`
   - 设置启动命令：`npm start`
   - 添加环境变量：`OPENWEATHER_API_KEY`

3. 部署完成后，Render会提供一个类似于 `https://your-service-name.onrender.com` 的URL
   - 使用这个URL来配置Cursor中的MCP服务

## 在Cursor中配置MCP服务

1. 打开Cursor编辑器
2. 点击设置图标
3. 选择"MCP服务"
4. 点击"添加MCP服务"
5. 输入你的MCP清单URL（例如`https://your-service.onrender.com/mcp-manifest.json`）
6. 保存设置

现在你可以通过Cursor AI助手查询天气了，例如：
- "北京今天的天气怎么样？"
- "查询上海的气温"
- "纽约现在的天气状况"

## API使用

如果你想直接调用API，可以使用以下端点：

```
GET /weather?city={城市名}
```

示例响应：
```json
{
  "city": "北京",
  "temperature": 25.6,
  "description": "晴",
  "humidity": 45,
  "wind_speed": 5.7
}
```

## 许可证

MIT 