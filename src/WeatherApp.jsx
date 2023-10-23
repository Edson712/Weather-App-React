import { useState } from "react"

export const WeatherApp = () => {

    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = '72adae6abf51f7287ff223a49fe67128'
    const difKelvin = 273.15

    const [city, setCity] = useState('')
    const [weatherData, setWeatherData] = useState(null)
    const [showError, setShowError] = useState(false);
    const [temperatureUnit, setTemperatureUnit] = useState('celsius');

    const toggleTemperatureUnit = () => {
        setTemperatureUnit(prevUnit => (prevUnit === 'celsius' ? 'fahrenheit' : 'celsius'));
    };

    const convertTemperature = (kelvin, unit) => {
        if (unit === 'celsius') {
            return Math.round(kelvin - difKelvin) + '°C';
        } else {
            const fahrenheit = (kelvin * 9 / 5) - 459.67;
            return Math.round(fahrenheit) + '°F';
        }
    };

    const handleCityChange = (e) => {
        setCity(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.length > 0) {
            fecthWeather();
            setShowError(false);
        } else {
            setShowError(true);
        }
    }

    const fecthWeather = async () => {
        try {
            const response = await fetch(`${baseUrl}?q=${city}&appid=${API_KEY}`);
            if (response.status === 200) {
                const data = await response.json();
                if (data.name) {
                    setWeatherData(data);
                } else {
                    setWeatherData(null);
                }
            } else {
                setWeatherData(null);
            }
        } catch (error) {
            setWeatherData(null);
            console.error('Problem found: ', error);
        }
    };



    return (
        <div className="container">
            <h1>Weather App</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                />
                <button type="submit">Search</button>
                <button onClick={toggleTemperatureUnit}>Toggle Temperature Unit</button>
            </form>
            {
                showError && (
                    <p>City no found.</p>
                )
            }
            {
                weatherData !== null ? (
                    <div>
                        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                        <p>Temperature: {convertTemperature(weatherData?.main?.temp, temperatureUnit)}</p>
                        <p>Weather Forecast: {weatherData.weather[0].description}</p>
                        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
                    </div>
                ) : weatherData === null && city && (
                    <p>City not found.</p>
                )
            }
        </div>
    )
}
