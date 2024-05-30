const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Example API endpoint to fetch data from 'Fruits' collection
app.get('/api/fruits', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('Fruits').get();
    const fruits = snapshot.docs.map(doc => doc.data());
    res.json(fruits);
  } catch (error) {
    console.error('Error fetching fruits:', error);
    res.status(500).json({ error: 'Failed to fetch fruits' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('Orders').get();
    const orders = snapshot.docs.map(doc => doc.data());
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
app.get('/api/messages', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('messages').get();
    const messages = snapshot.docs.map(doc => doc.data());
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
