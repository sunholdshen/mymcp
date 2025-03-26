require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 服务器健康检查端点
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '天气查询MCP服务运行中' });
});

// MCP清单文件
app.get('/mcp-manifest.json', (req, res) => {
  res.json({
    schema_version: "v1",
    name_for_human: "天气查询服务",
    name_for_model: "weather_service",
    description_for_human: "查询全球城市的天气状况",
    description_for_model: "这个服务允许用户查询全球城市的当前天气状况，包括温度、湿度、风速等信息。",
    auth: {
      type: "none"
    },
    api: {
      type: "openapi",
      url: `/openapi.json`
    },
    logo_url: "https://cdn-icons-png.flaticon.com/512/4052/4052984.png",
    contact_email: "example@example.com",
    legal_info_url: "http://example.com/legal"
  });
});

// OpenAPI规范
app.get('/openapi.json', (req, res) => {
  // 获取请求的主机地址
  const host = req.get('host');
  const protocol = req.protocol;
  
  res.json({
    openapi: "3.0.0",
    info: {
      title: "天气查询API",
      description: "查询全球城市的天气状况",
      version: "1.0.0"
    },
    servers: [
      {
        url: `${protocol}://${host}`
      }
    ],
    paths: {
      "/weather": {
        get: {
          operationId: "getWeather",
          summary: "获取城市天气",
          description: "根据城市名称查询当前天气状况",
          parameters: [
            {
              name: "city",
              in: "query",
              description: "城市名称",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            "200": {
              description: "成功获取天气信息",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      city: { type: "string" },
                      temperature: { type: "number" },
                      description: { type: "string" },
                      humidity: { type: "number" },
                      wind_speed: { type: "number" }
                    }
                  }
                }
              }
            },
            "400": {
              description: "请求参数错误",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "城市未找到",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
});

// 天气查询端点
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ error: '城市参数是必需的' });
  }
  
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
        lang: 'zh_cn'
      }
    });
    
    const data = response.data;
    
    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: '城市未找到' });
    }
    console.error('天气API错误:', error.message);
    res.status(500).json({ error: '获取天气信息时出错' });
  }
});

// 使用stderr而不是stdout输出日志，避免干扰MCP通信
app.listen(port, () => {
  // 完全不输出日志，符合Smithery的要求
}); 