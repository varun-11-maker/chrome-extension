// src/tabs/tabs.tsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import './tabs.css';

const Tabs: React.FC = () => {
  interface WeatherData {
    temperature: number;
    description: string;
    city: string;
  }

  const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('London');

    // useEffect(() => {
      const fetchWeather = async (city: string) => {
        try {
          console.log(`Fetching weather for city: ${city}`); 
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cf057b0a3793d2aebd75543f45eee778&units=metric`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('API response:', data);
          setWeather({
            temperature: data.main.temp,
          description: data.weather[0].description,
          city: data.name
          });
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchWeather(city);
      }, []);

      const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
      };
    
      const handleSearch = () => {
        setLoading(true);
        fetchWeather(city);
      };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="weather-widget">
        <h2>Weather in {weather?.city}</h2>
        <p>Temperature: {weather?.temperature}°C</p>
        <p>Description: {weather?.description}</p>
        <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city name"
      />
      <button onClick={handleSearch}>Get Weather</button>
      </div>
    );  
  };
  const GoogleSlidesWidget: React.FC = () => {
    const presentationId = '0B9bBq3u7pNHNaEFVS3hNbHVvY2s'; // Replace with your Google Slides presentation ID
  
    return (
      <div className="google-slides-widget">
        <h2>Google Slides Presentation</h2>
        <iframe
          src={`https://docs.google.com/presentation/d/${presentationId}/embed`}
          width="800"
          height="600"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const PomodoroTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // Initial time in seconds (25 minutes)
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isBreak, setIsBreak] = useState<boolean>(false);
  
    useEffect(() => {
      let timerId: NodeJS.Timeout | null = null;
  
      if (isRunning) {
        timerId = setInterval(() => {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              clearInterval(timerId!);
              if (isBreak) {
                // Start a new Pomodoro session after break
                setIsBreak(false);
                setTimeLeft(25 * 60); // Reset to 25 minutes
              } else {
                // Start a break period
                setIsBreak(true);
                setTimeLeft(5 * 60); // Set to 5 minutes
              }
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
  
      return () => {
        if (timerId) clearInterval(timerId);
      };
    }, [isRunning, isBreak]);
  
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
  
    const handleStart = () => {
      setIsRunning(true);
    };
  
    const handleStop = () => {
      setIsRunning(false);
    };
  
    const handleReset = () => {
      setIsRunning(false);
      setIsBreak(false);
      setTimeLeft(25 * 60); // Reset to 25 minutes
    };
  
    return (
      <div className="pomodoro-timer">
        <h2>{isBreak ? 'Break Time!' : 'Pomodoro Timer'}</h2>
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
        <div className="buttons">
          <button onClick={handleStart} disabled={isRunning}>Start</button>
          <button onClick={handleStop} disabled={!isRunning}>Stop</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    );
  };

const GoogleCalendarWidget: React.FC = () => {
  const calendarId = 'https://calendar.google.com/calendar/embed?src=varunsinghal2003%40gmail.com&ctz=Asia%2FKolkata'; // Replace with your calendar ID
  const view = 'day'; // Set the view to 'day'
  
  return (
    <div className="google-calendar-widget">
      <h2>Google Calendar - Day View</h2>
      <iframe
        src={`https://calendar.google.com/calendar/embed?src=${calendarId}&mode=${view}&ctz=YOUR_TIMEZONE`}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      ></iframe>
    </div>
  );
};
return (
  <div>
    <WeatherWidget />
    <GoogleSlidesWidget />
    <PomodoroTimer/>
    <GoogleCalendarWidget/>
  </div>
);
};
export default Tabs;
