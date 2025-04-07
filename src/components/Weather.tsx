import React, { useState, useEffect } from 'react';

interface LiveWeatherData {
  province: string;
  city: string;
  adcode: string;
  weather: string;
  temperature: string;
  winddirection: string;
  windpower: string;
  humidity: string;
  reporttime: string;
}

interface ForecastCast {
  date: string;
  week: string;
  dayweather: string;
  nightweather: string;
  daytemp: string;
  nighttemp: string;
  daywind: string;
  nightwind: string;
  daypower: string;
  nightpower: string;
}

interface ForecastData {
  city: string;
  adcode: string;
  province: string;
  reporttime: string;
  casts: ForecastCast[];
}

interface WeatherApiResponse {
  status: string;
  count: string;
  info: string;
  infocode: string;
  lives?: LiveWeatherData[];
  forecasts?: ForecastData[];
}

const Weather: React.FC = () => {
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastCast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // 使用高德地图天气API
        // 从环境变量获取API密钥
        let API_KEY = '';
        try {
          // @ts-ignore
          API_KEY = import.meta.env.VITE_AMAP_API_KEY || '';
        } catch (e) {
        }
        
        if (!API_KEY) {
          throw new Error('API密钥未配置');
        }
        // 使用深圳市的城市编码 440300
        let CITY = '';
        try {
          // @ts-ignore
          CITY = import.meta.env.VITE_AMAP_CITY || '';
        } catch (e) {
        }
        
        if (!CITY) {
          throw new Error('CITY未配置');
        }
        
        // 获取实时天气数据
        const liveResponse = await fetch(
          `https://restapi.amap.com/v3/weather/weatherInfo?key=${API_KEY}&city=${CITY}&extensions=base`
        );
        
        if (!liveResponse.ok) {
          throw new Error('无法获取实时天气数据');
        }
        
        const liveData: WeatherApiResponse = await liveResponse.json();
        
        if (liveData.status !== '1' || !liveData.lives || liveData.lives.length === 0) {
          throw new Error('实时天气数据获取失败');
        }
        
        setLiveWeather(liveData.lives[0]);
        
        // 获取天气预报数据
        const forecastResponse = await fetch(
          `https://restapi.amap.com/v3/weather/weatherInfo?key=${API_KEY}&city=${CITY}&extensions=all`
        );
        
        if (!forecastResponse.ok) {
          throw new Error('无法获取天气预报数据');
        }
        
        const forecastData: WeatherApiResponse = await forecastResponse.json();
        
        if (forecastData.status !== '1' || !forecastData.forecasts || forecastData.forecasts.length === 0) {
          throw new Error('天气预报数据获取失败');
        }
        
        setForecast(forecastData.forecasts[0].casts);

      } catch (err) {
        console.error('获取天气失败:', err);
        setError('无法获取天气信息');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
    
    // 每小时更新一次天气
    const interval = setInterval(fetchWeather, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="weather-container">
        <div className="card weather-card">
          <div className="weather-loading">加载天气信息...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="weather-container">
        <div className="card weather-card">
          <div className="weather-error">{error}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="weather-container">
      <div className="card weather-card">
        {liveWeather && (
          <div className="weather-current">
            <div className="weather-city">{liveWeather.city}</div>
            <div className="weather-main">
              <div className="weather-temp">{liveWeather.temperature}°C</div>
            </div>
            <div className="weather-condition">{liveWeather.weather}</div>
            <div className="weather-details">
              <div className="weather-detail-item">湿度: {liveWeather.humidity}%</div>
              <div className="weather-detail-item">{liveWeather.winddirection}风 {liveWeather.windpower}级</div>
            </div>
          </div>
        )}
        
        {forecast && forecast.length > 0 && (
          <div className="weather-forecast">
            <div className="forecast-container">
              {forecast.slice(0, 4).map((day, index) => (
                <div key={index} className="forecast-day">
                  <div className="forecast-date">{day.date.substring(5)}</div>
                  <div className="forecast-weather">
                    <div>白天: {day.dayweather} {day.daytemp}°C</div>
                    <div>夜间: {day.nightweather} {day.nighttemp}°C</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather; 