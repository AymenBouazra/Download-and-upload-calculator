import React, { useState } from 'react';
import { Download, Upload, Gauge } from 'lucide-react';

interface CalculationResult {
  seconds: number;
  formatted: string;
  speed: 'fast' | 'moderate' | 'slow';
}

const Calculator: React.FC = () => {
  // Download states
  const [downloadFileSize, setDownloadFileSize] = useState<number>(100);
  const [downloadFileSizeUnit, setDownloadFileSizeUnit] = useState<string>('MB');
  const [downloadSpeed, setDownloadSpeed] = useState<number>(100);
  const [downloadSpeedUnit, setDownloadSpeedUnit] = useState<string>('Mbps');
  
  // Upload states
  const [uploadFileSize, setUploadFileSize] = useState<number>(100);
  const [uploadFileSizeUnit, setUploadFileSizeUnit] = useState<string>('MB');
  const [uploadSpeed, setUploadSpeed] = useState<number>(50);
  const [uploadSpeedUnit, setUploadSpeedUnit] = useState<string>('Mbps');

  const speedPresets = [
    { name: 'Dial-up', speed: 0.056, unit: 'Mbps' },
    { name: 'DSL', speed: 25, unit: 'Mbps' },
    { name: 'Cable', speed: 100, unit: 'Mbps' },
    { name: 'Fiber', speed: 1000, unit: 'Mbps' },
    { name: '5G', speed: 2000, unit: 'Mbps' },
  ];

  const fileSizeUnits = {
    'KB': 1000,
    'MB': 1000 * 1000,
    'GB': 1000 * 1000 * 1000,
    'TB': 1000 * 1000 * 1000 * 1000,
  };

  const speedUnits = {
    'Kbps': 1,
    'Mbps': 1000,
    'Gbps': 1000000,
  };

  const calculateTime = (fileSize: number, fileSizeUnit: string, internetSpeed: number, speedUnit: string): CalculationResult => {
    // Convert file size to bits (not bytes)
    const fileSizeInBits = fileSize * fileSizeUnits[fileSizeUnit as keyof typeof fileSizeUnits] * 8;
    
    // Convert speed to bits per second
    const speedInBps = internetSpeed * speedUnits[speedUnit as keyof typeof speedUnits];
    
    // Calculate time in seconds
    const timeInSeconds = fileSizeInBits / speedInBps;
    
    // Format time
    let formatted = '';
    let speed: 'fast' | 'moderate' | 'slow' = 'fast';
    
    if (timeInSeconds < 1) {
      formatted = '<1 second';
      speed = 'fast';
    } else if (timeInSeconds < 60) {
      formatted = `${Math.ceil(timeInSeconds)}s`;
      speed = timeInSeconds < 10 ? 'fast' : 'moderate';
    } else if (timeInSeconds < 3600) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.ceil(timeInSeconds % 60);
      if (seconds === 60) {
        formatted = `${minutes + 1}m`;
      } else if (seconds < 10) {
        formatted = `${minutes}m`;
      } else {
        formatted = `${minutes}m ${seconds}s`;
      }
      speed = timeInSeconds < 300 ? 'moderate' : 'slow';
    } else {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      formatted = `${hours}h ${minutes}m`;
      speed = 'slow';
    }
    
    return { seconds: timeInSeconds, formatted, speed };
  };
  const downloadTime = calculateTime(downloadFileSize, downloadFileSizeUnit, downloadSpeed, downloadSpeedUnit);
  const uploadTime = calculateTime(uploadFileSize, uploadFileSizeUnit, uploadSpeed, uploadSpeedUnit);

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-600';
      case 'moderate': return 'text-orange-500';
      case 'slow': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  const getSpeedBg = (speed: string) => {
    switch (speed) {
      case 'fast': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-orange-50 border-orange-200';
      case 'slow': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getSpeedText = (speed: string) => {
    switch (speed) {
      case 'fast': return 'Fast Connection';
      case 'moderate': return 'Moderate Connection';
      case 'slow': return 'Slow Connection';
      default: return 'Connection';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Gauge className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Transfer Time Calculator</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Calculate download and upload times for any file size and internet connection speed
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Download Calculator */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Download Calculator</h2>
            </div>

            <div className="space-y-6">
              {/* File Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">File Size</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={downloadFileSize}
                    onChange={(e) => setDownloadFileSize(Number(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                    min="0.1"
                    step="0.1"
                  />
                  <select
                    value={downloadFileSizeUnit}
                    onChange={(e) => setDownloadFileSizeUnit(e.target.value)}
                    className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  >
                    {Object.keys(fileSizeUnits).map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Download Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Download Speed</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={downloadSpeed}
                    onChange={(e) => setDownloadSpeed(Number(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                    min="0.1"
                    step="0.1"
                  />
                  <select
                    value={downloadSpeedUnit}
                    onChange={(e) => setDownloadSpeedUnit(e.target.value)}
                    className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  >
                    {Object.keys(speedUnits).map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Download Time Result */}
              <div className={`rounded-xl p-6 border-2 ${getSpeedBg(downloadTime.speed)}`}>
                <div className="text-sm font-medium text-gray-600 mb-2">Download Time</div>
                <div className={`text-3xl font-bold ${getSpeedColor(downloadTime.speed)} mb-1`}>
                  {downloadTime.formatted}
                </div>
                <div className="text-sm text-gray-500">
                  {getSpeedText(downloadTime.speed)}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {speedPresets.map((preset) => (
                    <button
                      key={`download-${preset.name}`}
                      onClick={() => {
                        setDownloadSpeed(preset.speed);
                        setDownloadSpeedUnit(preset.unit);
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 font-medium"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Calculator */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Upload Calculator</h2>
            </div>

            <div className="space-y-6">
              {/* File Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">File Size</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={uploadFileSize}
                    onChange={(e) => setUploadFileSize(Number(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
                    min="0.1"
                    step="0.1"
                  />
                  <select
                    value={uploadFileSizeUnit}
                    onChange={(e) => setUploadFileSizeUnit(e.target.value)}
                    className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
                  >
                    {Object.keys(fileSizeUnits).map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Upload Speed</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={uploadSpeed}
                    onChange={(e) => setUploadSpeed(Number(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
                    min="0.1"
                    step="0.1"
                  />
                  <select
                    value={uploadSpeedUnit}
                    onChange={(e) => setUploadSpeedUnit(e.target.value)}
                    className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
                  >
                    {Object.keys(speedUnits).map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Time Result */}
              <div className={`rounded-xl p-6 border-2 ${getSpeedBg(uploadTime.speed)}`}>
                <div className="text-sm font-medium text-gray-600 mb-2">Upload Time</div>
                <div className={`text-3xl font-bold ${getSpeedColor(uploadTime.speed)} mb-1`}>
                  {uploadTime.formatted}
                </div>
                <div className="text-sm text-gray-500">
                  {getSpeedText(uploadTime.speed)}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {speedPresets.map((preset) => (
                    <button
                      key={`upload-${preset.name}`}
                      onClick={() => {
                        setUploadSpeed(preset.speed);
                        setUploadSpeedUnit(preset.unit);
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-green-100 hover:text-green-700 rounded-lg transition-all duration-200 border border-gray-200 hover:border-green-300 font-medium"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;