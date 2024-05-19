import React, { useState } from 'react';
import Chat from './components/Chat';

function App() {
    const [currentUser, setCurrentUser] = useState('');
    const [recipient, setRecipient] = useState('');
    const [chatStarted, setChatStarted] = useState(false);

    const startChat = () => {
        if (currentUser && recipient) {
            setChatStarted(true);
        } else {
            alert("Both usernames are required to start the chat.");
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            {!chatStarted ? (
                <div className="p-4">
                    <input
                        className="p-2 border rounded mr-2"
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                        placeholder="Your username"
                    />
                    <input
                        className="p-2 border rounded mr-2"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Recipient's username"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={startChat}>
                        Start Chat
                    </button>
                </div>
            ) : (
                <Chat currentUser={currentUser} recipient={recipient} />
            )}
        </div>
    );
}

export default App;
