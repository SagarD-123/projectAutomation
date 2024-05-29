import React, { useState } from 'react';
import axios from 'axios';
import './Email.css';

const Email = () => {
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleSendEmail = async () => {
        const formData = new FormData();
        formData.append('to', to);
        formData.append('cc', cc);
        formData.append('subject', subject);
        formData.append('text', text);
        formData.append('attachment', attachment);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/send-email', formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Error sending email');
        }
    };

    return (
        <div className="email-container">
            <div className="email-box">
                <h2>Send Email</h2>
                <input type="email" placeholder="To" value={to} onChange={e => setTo(e.target.value)} />
                <input type="email" placeholder="CC" value={cc} onChange={e => setCc(e.target.value)} />
                <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
                <textarea placeholder="Text" value={text} onChange={e => setText(e.target.value)}></textarea>
                <input type="file" onChange={e => setAttachment(e.target.files[0])} />
                <button onClick={handleSendEmail}>Send Email</button>
            </div>
        </div>
    );
};

export default Email;
