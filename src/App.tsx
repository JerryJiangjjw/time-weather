import React from 'react';
import TimeDisplay from './components/TimeDisplay';
import Weather from './components/Weather';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

// 设置dayjs为中文
dayjs.locale('zh-cn');

const App: React.FC = () => {
  return (
    <div className="app-container">
      <main>
        <div className="card-section top-section">
          <TimeDisplay />
        </div>
        <div className="card-section bottom-section">
          <Weather />
        </div>
      </main>
    </div>
  );
};

export default App; 