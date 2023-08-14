import './App.css';
import { Client } from 'paho-mqtt';

function App() {
  const mqttOptions = {
    server: 'localhost',  // Sunucu adresini buraya girin
    port: 1883,           // WebSocket bağlantı noktasını buraya girin (örneğin, 9001)
           // WebSocket yolunu belirtin (broker yapılandırmasına uygun olarak)
  };
  
  const client = new Client(mqttOptions.server, Number(mqttOptions.port), 'clientId');

  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.error('MQTT bağlantısı kaybedildi:', responseObject.errorMessage);
    }
  };

  client.connect({
    onSuccess: () => {
      console.log('MQTT bağlantısı başarılı!');
      const topic = 'mytopic';
      const message = new window.Paho.MQTT.Message('Merhaba, MQTT!');
      message.destinationName = topic;
      client.send(message);
    },
    onFailure: (errorCode) => {
      console.error('MQTT bağlantı hatası:', errorCode.errorCode);
    },
  });

  return (
    <div className="App">
      <p>MQTT bağlantısı yapılıyor...</p>
    </div>
  );
}

export default App;
