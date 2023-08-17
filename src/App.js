import React, { useState, useEffect } from 'react';
import { Client } from 'paho-mqtt';

function App() {
  const [messages, setMessages] = useState([]);
  const [mqttClient, setMqttClient] = useState(null); // MQTT istemcisini durum olarak tutun

  const mqttOptions = {
    server: 'localhost', // Broker'ın adresini buraya girin
    port: 9001,          // Broker'ın WebSocket portunu buraya girin
    clientId: 'mqtt-react-app', // İstemci kimliği
  };

  useEffect(() => {
    const client = new Client(mqttOptions.server, mqttOptions.port, mqttOptions.clientId);

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Bağlantı kesildi:', responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (message) => {
      console.log('Yeni mesaj:', message.payloadString);
      setMessages((prevMessages) => [...prevMessages, message.payloadString]);
    };

    client.connect({
      onSuccess: () => {
        console.log('MQTT bağlantısı başarılı.');
        client.subscribe('dataTopic'); // Dinlenecek konuyu belirleyin
        setMqttClient(client); // MQTT istemcisini duruma ayarla
      },
      onFailure: (e) => {
        console.log('MQTT bağlantısı başarısız:', e);
      },
    });

    return () => {
      client.disconnect();
    };
  }, []);

  const publishMessage = () => {
    if (mqttClient) { // MQTT istemcisini kontrol et
      const message = 'SendData';
      mqttClient.publish('reactCommand', message); // Yayınlanacak konuyu ve mesajı belirleyin
    } else {
      console.log('Mqtt bağlantısı henüz yapılmadı.');
    }
  };

  return (
    <div className="App">
      <h1>MQTT Mesajları</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <button onClick={publishMessage}>Mesaj Yayınla</button>
    </div>
  );
}

export default App;
