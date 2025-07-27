// Selfbot Dashboard - Premium UI with Console and Config Access
import { useEffect, useRef, useState } from 'react';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [prefix, setPrefix] = useState('');
  const [channelId, setChannelId] = useState('');
  const [command, setCommand] = useState('');
  const logRef = useRef(null);

  useEffect(() => {
    if (loggedIn) {
      const interval = setInterval(() => {
        fetch('http://127.0.0.1:5000/api/logs')
          .then((res) => res.json())
          .then((data) => setLogs(data));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const login = () => {
    fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLoggedIn(true);
        else alert('Incorrect Password');
      });
  };

  const clearLogs = () => {
    fetch('http://127.0.0.1:5000/api/clear', { method: 'POST' }).then(() => setLogs([]));
  };

  const exportLogs = () => {
    window.open('http://127.0.0.1:5000/api/export');
  };

  const sendCommand = () => {
    fetch('http://127.0.0.1:5000/api/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channelId, command }),
    });
  };

  const updateConfig = () => {
    fetch('http://127.0.0.1:5000/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, prefix }),
    });
  };

  const controlBot = (action) => {
    fetch(`http://127.0.0.1:5000/api/bot/${action}`, { method: 'POST' });
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-sm border border-blue-500">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">🔐 Selfbot Login</h1>
          <input
            className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 text-lg"
            placeholder="Enter Dashboard Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-lg">
            Unlock Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400 drop-shadow">🧠 Discord Selfbot Dashboard</h1>
        <p className="text-gray-400">Advanced controls, real-time logs, and full config access.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-5 rounded-xl shadow space-y-3 border border-green-500">
          <h2 className="text-xl font-semibold">🟢 Bot Controls</h2>
          <button onClick={() => controlBot('start')} className="w-full bg-green-600 hover:bg-green-700 p-2 rounded">Start Bot</button>
          <button onClick={() => controlBot('stop')} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded">Stop Bot</button>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl shadow space-y-3 border border-cyan-500">
          <h2 className="text-xl font-semibold">🛠 Config Editor</h2>
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
          <button onClick={updateConfig} className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">Save Config</button>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl shadow space-y-3 border border-yellow-500">
          <h2 className="text-xl font-semibold">📨 Command Console</h2>
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Channel ID"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Command (e.g. !ping)"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <button onClick={sendCommand} className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded">Execute Command</button>
        </div>
      </div>

      <div className="bg-gray-800 p-5 mt-8 rounded-xl shadow border border-purple-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">📜 Live Logs</h2>
          <div className="flex gap-3">
            <button onClick={clearLogs} className="bg-yellow-600 hover:bg-yellow-700 p-2 px-4 rounded">Clear</button>
            <button onClick={exportLogs} className="bg-purple-600 hover:bg-purple-700 p-2 px-4 rounded">Export</button>
          </div>
        </div>
        <pre ref={logRef} className="bg-black text-green-300 p-4 rounded h-[300px] overflow-y-auto text-sm font-mono whitespace-pre-wrap">
          {logs.join('\n')}
        </pre>
      </div>
    </div>
  );
}
