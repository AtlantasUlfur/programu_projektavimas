import React, {Component, useEffect, useState} from 'react';
import ReactDOM  from 'react-dom';
import { IMessageEvent, w3cwebsocket as W3CWebSocket} from 'websocket'
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';
import { setConstantValue } from 'typescript';


const client = new W3CWebSocket('ws://127.0.0.1:8000');

function App() {
  const [sent, setSent] = useState(0);
  const [received, setReceived] = useState(0);

  client.onopen = () => {
      console.log('Websocket Client Connected');
  };

  client.onmessage = (message: IMessageEvent) => {
    const dataFromServer = JSON.parse(String(message.data));
    console.log('got reply!', dataFromServer);
    setReceived(received + 1);
  }

  function handleClick(value: string){
      client.send(JSON.stringify({
        type: "message",
        msg: value
      }))
      setSent(sent + 1)
      console.log(sent)
  }

  useEffect(() =>{
    
  });

  return (
    <div>
      <header>
        received
      </header>
      <div id="received">
        {received}
      </div>
      <div>
        <button onClick={() => handleClick("hello")}> Send Message</button>
      </div>
      <header>
          sent
      </header>
      <div id="sent">
          {sent}
      </div>
    </div>
    
  );
}

export default App;
