'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowLeftRight, Copy, Check } from 'lucide-react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [meetingDateTime, setMeetingDateTime] = useState('');
  const [fromTimezone, setFromTimezone] = useState('cleveland');
  const [convertedTime, setConvertedTime] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get current time in Cleveland (Eastern Time)
  const getClevelandTime = () => {
    const now = new Date();
    const clevelandTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    
    const dayOfWeek = clevelandTime.toLocaleDateString('en-US', { weekday: 'short' });
    const month = clevelandTime.toLocaleDateString('en-US', { month: 'short' });
    const day = clevelandTime.toLocaleDateString('en-US', { day: '2-digit' });
    const year = clevelandTime.getFullYear();
    const time = clevelandTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
    
    return `${dayOfWeek} ${month} ${day} ${year} ${time}`;
  };

  // Get current time in Nablus (Palestine Time - UTC+2)
  const getNablusTime = () => {
    const now = new Date();
    const nablusTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Hebron' }));
    
    const dayOfWeek = nablusTime.toLocaleDateString('en-US', { weekday: 'short' });
    const month = nablusTime.toLocaleDateString('en-US', { month: 'short' });
    const day = nablusTime.toLocaleDateString('en-US', { day: '2-digit' });
    const year = nablusTime.getFullYear();
    const time = nablusTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
    
    return `${dayOfWeek} ${month} ${day} ${year} ${time}`;
  };

  // Calculate time difference
  const getTimeDifference = () => {
    const now = new Date();
    const clevelandTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const nablusTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Hebron' }));
    
    const diffHours = Math.round((nablusTime.getTime() - clevelandTime.getTime()) / (1000 * 60 * 60));
    
    return diffHours > 0 ? `+${diffHours}` : `${diffHours}`;
  };

  // Convert meeting time
  const convertMeetingTime = () => {
    if (!meetingDateTime) {
      setConvertedTime(null);
      return;
    }

    const inputDate = new Date(meetingDateTime);
    
    if (isNaN(inputDate.getTime())) {
      setConvertedTime({ error: 'Invalid date/time format' });
      return;
    }

    let sourceTime, targetTime, sourceZone, targetZone;

    if (fromTimezone === 'cleveland') {
      // Input is Cleveland time, convert to Nablus
      sourceTime = new Date(meetingDateTime + (meetingDateTime.includes('T') ? '' : 'T00:00'));
      // Treat input as Cleveland time
      const clevelandTime = new Date(sourceTime.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const utcTime = new Date(sourceTime.getTime() + (sourceTime.getTimezoneOffset() * 60000));
      targetTime = new Date(utcTime.toLocaleString('en-US', { timeZone: 'Asia/Hebron' }));
      
      sourceZone = 'Cleveland (Eastern Time)';
      targetZone = 'Nablus (Palestine Time)';
    } else {
      // Input is Nablus time, convert to Cleveland
      sourceTime = new Date(meetingDateTime + (meetingDateTime.includes('T') ? '' : 'T00:00'));
      const nablusTime = new Date(sourceTime.toLocaleString('en-US', { timeZone: 'Asia/Hebron' }));
      const utcTime = new Date(sourceTime.getTime() + (sourceTime.getTimezoneOffset() * 60000));
      targetTime = new Date(utcTime.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      
      sourceZone = 'Nablus (Palestine Time)';
      targetZone = 'Cleveland (Eastern Time)';
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const formatDateTime = (date: Date) => {
      // Get individual components directly from the date
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.toLocaleDateString('en-US', { day: '2-digit' });
      const year = date.getFullYear();
      const time = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
      
      return `${dayOfWeek} ${month} ${day} ${year} ${time}`;
    };

    setConvertedTime({
      source: {
        time: formatDateTime(sourceTime),
        zone: sourceZone
      },
      target: {
        time: formatDateTime(targetTime),
        zone: targetZone
      }
    });
  };

  useEffect(() => {
    convertMeetingTime();
  }, [meetingDateTime, fromTimezone]);

  const swapTimezones = () => {
    setFromTimezone(fromTimezone === 'cleveland' ? 'nablus' : 'cleveland');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Clock className="text-blue-600" />
            Cleveland ↔ Nablus Time Converter
          </h1>
          <p className="text-gray-600">Coordinate meetings between Cleveland, OH and Nablus, Palestine</p>
        </div>

        {/* Current Time Display */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Clock size={20} />
              Cleveland, OH (Eastern Time)
            </h2>
            <p className="text-xl font-mono text-blue-700">
              {isMounted ? getClevelandTime() : 'Loading...'}
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Clock size={20} />
              Nablus, Palestine
            </h2>
            <p className="text-xl font-mono text-green-700">
              {isMounted ? getNablusTime() : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Time Difference */}
        <div className="text-center mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-700">
            <strong>Time Difference:</strong> Nablus is <span className="text-blue-600 font-semibold">
              {isMounted ? getTimeDifference() : '...'}
            </span> hours ahead of Cleveland
          </p>
        </div>

        {/* Meeting Time Converter */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Meeting Time Converter
          </h2>
          
          <div className="space-y-4">
            {/* Timezone Selection */}
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-gray-700 font-medium">Convert from:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFromTimezone('cleveland')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    fromTimezone === 'cleveland'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cleveland
                </button>
                <button onClick={swapTimezones} className="p-2 text-gray-500 hover:text-gray-700">
                  <ArrowLeftRight size={16} />
                </button>
                <button
                  onClick={() => setFromTimezone('nablus')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    fromTimezone === 'nablus'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Nablus
                </button>
              </div>
            </div>

            {/* Date/Time Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Meeting Date & Time in {fromTimezone === 'cleveland' ? 'Cleveland' : 'Nablus'}:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={meetingDateTime.split('T')[0] || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      const time = meetingDateTime.split('T')[1] || '09:00';
                      setMeetingDateTime(date ? `${date}T${time}` : '');
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hour</label>
                  <select
                    value={meetingDateTime.split('T')[1]?.split(':')[0] || '09'}
                    onChange={(e) => {
                      const date = meetingDateTime.split('T')[0] || '';
                      const minutes = meetingDateTime.split('T')[1]?.split(':')[1] || '00';
                      if (date) {
                        setMeetingDateTime(`${date}T${e.target.value.padStart(2, '0')}:${minutes}`);
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                  <select
                    value={meetingDateTime.split('T')[1]?.split(':')[1] || '00'}
                    onChange={(e) => {
                      const date = meetingDateTime.split('T')[0] || '';
                      const hour = meetingDateTime.split('T')[1]?.split(':')[0] || '09';
                      if (date) {
                        setMeetingDateTime(`${date}T${hour}:${e.target.value}`);
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="00">:00</option>
                    <option value="15">:15</option>
                    <option value="30">:30</option>
                    <option value="45">:45</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Conversion Result */}
            {convertedTime && !convertedTime.error && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Conversion Result:</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="text-blue-700 font-medium min-w-0 flex-shrink-0">{convertedTime.source.zone}:</div>
                    <div className="font-mono text-blue-800 flex-grow">{convertedTime.source.time}</div>
                    <button
                      onClick={() => copyToClipboard(convertedTime.source.time)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors self-start"
                      title="Copy to clipboard"
                    >
                      {copiedText === convertedTime.source.time ? (
                        <><Check size={14} /> Copied!</>
                      ) : (
                        <><Copy size={14} /> Copy</>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="text-green-700 font-medium min-w-0 flex-shrink-0">{convertedTime.target.zone}:</div>
                    <div className="font-mono text-green-800 flex-grow">{convertedTime.target.time}</div>
                    <button
                      onClick={() => copyToClipboard(convertedTime.target.time)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors self-start"
                      title="Copy to clipboard"
                    >
                      {copiedText === convertedTime.target.time ? (
                        <><Check size={14} /> Copied!</>
                      ) : (
                        <><Copy size={14} /> Copy</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {convertedTime && convertedTime.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{convertedTime.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Quick Reference:</h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• Cleveland observes Daylight Saving Time (March - November)</li>
            <li>• Palestine stopped observing DST in 2018, staying at UTC+2 year-round</li>
            <li>• Time difference varies between 7-8 hours depending on US DST</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
