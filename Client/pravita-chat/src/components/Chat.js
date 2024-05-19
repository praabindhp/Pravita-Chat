import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const APP_URL_BE = 'http://localhost:1028';

const socket = io(APP_URL_BE);

const Chat = ({ currentUser, recipient }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${APP_URL_BE}/api/messages/${currentUser}/${recipient}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (currentUser && recipient) {
            fetchMessages();
        }

        socket.on('message', (message) => {
            if ((message.sender === currentUser && message.recipient === recipient) ||
                (message.sender === recipient && message.recipient === currentUser)) {
                setMessages(messages => [...messages, message]);
            }
        });

        return () => {
            socket.off('message');
        };
    }, [currentUser, recipient]);

    const sendMessage = async () => {
        const message = { sender: currentUser, recipient, content: newMessage };
        try {
            await axios.post(`${APP_URL_BE}/api/messages/send`, message);
            socket.emit('sendMessage', message);
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const clearMessages = async () => {
        try {
            await axios.delete(`${APP_URL_BE}/api/messages/${currentUser}/${recipient}`);
            setMessages([]);
        } catch (error) {
            console.error("Error clearing messages:", error);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto">
            <div className="flex-grow p-4 overflow-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.sender === currentUser ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded ${msg.sender === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {msg.content}
                        </span>
                        <div className="text-xs text-gray-500">{msg.hash}</div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-300">
                <input
                    className="w-full p-2 border rounded"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button className="mt-2 w-full bg-blue-500 text-white p-2 rounded" onClick={sendMessage}>Send</button>
                <button className="mt-2 w-full bg-red-500 text-white p-2 rounded" onClick={clearMessages}>Clear Chat</button>
            </div>
        </div>
    );
};

export default Chat;
