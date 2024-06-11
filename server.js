const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure CORS to allow requests from Netlify domain
const allowedOrigins = ['https://raidfruits.netlify.app']; 
app.use(cors({
  origin: allowedOrigins
}));

// Users Routes
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    const docRef = await db.collection('users').add(user);
    res.status(201).json({ id: docRef.id, ...user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = req.body;
    await db.collection('users').doc(req.params.id).update(user);
    res.status(200).json({ id: req.params.id, ...user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).delete();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders Routes
app.get('/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('Orders').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//customer adds an order and update stock count
app.post('/orders', async (req, res) => {
  const { order, purchasedate, totalCost, status, customerUid } = req.body;

  try {
    // Update stock
    await Promise.all(order.map(async (item) => {
      const fruitRef = db.collection('Fruits').doc(item.fruitId);
      const fruitDoc = await fruitRef.get();
      if (!fruitDoc.exists) {
        throw new Error(`Fruit with ID ${item.fruitId} not found`);
      }
      //reduce stock count after customer purchase 
      const newStock = fruitDoc.data().stock - item.quantity;
      if (newStock < 0) {
        throw new Error(`Insufficient stock for fruit with ID ${item.fruitId}`);
      }
      await fruitRef.update({ stock: newStock });
    }));

    // Add order
    const newOrder = {
      order,
      purchasedate: admin.firestore.Timestamp.fromDate(new Date(purchasedate)),
      totalCost,
      status,
      customerUid,
    };
    const docRef = await db.collection('Orders').add(newOrder);
    res.status(201).json({ id: docRef.id, ...newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const doc = await db.collection('Orders').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const order = req.body;
    await db.collection('Orders').doc(req.params.id).update(order);
    res.status(200).json({ id: req.params.id, ...order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    await db.collection('Orders').doc(req.params.id).delete();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Fruits Routes
app.get('/fruits', async (req, res) => {
  try {
    const snapshot = await db.collection('Fruits').get();
    const fruits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(fruits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fruits', async (req, res) => {
  try {
    const fruit = req.body;
    const docRef = await db.collection('Fruits').add(fruit);
    res.status(201).json({ id: docRef.id, ...fruit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fruits/:id', async (req, res) => {
  try {
    const doc = await db.collection('Fruits').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Fruit not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/fruits/:id', async (req, res) => {
  try {
    const fruitId = req.params.id;
    const { fruits, price, stock, place } = req.body;

    const fruitRef = db.collection('Fruits').doc(fruitId);
    await fruitRef.update({
      fruits,
      price,
      stock,
      place
    });

    res.status(200).json({ id: fruitId, fruits, price, stock, place });
  } catch (error) {
    console.error('Error updating fruit:', error);
    res.status(500).json({ error: 'Error updating fruit' });
  }
});

app.delete('/fruits/:id', async (req, res) => {
  try {
    await db.collection('Fruits').doc(req.params.id).delete();
    res.status(200).json({ message: 'Fruit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Messages Routes
app.get('/messages', async (req, res) => {
  try {
    const snapshot = await db.collection('Messages').get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const message = req.body;
    const docRef = await db.collection('Messages').add(message);
    res.status(201).json({ id: docRef.id, ...message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/messages/:id', async (req, res) => {
  try {
    const doc = await db.collection('Messages').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/messages/:id', async (req, res) => {
  try {
    const message = req.body;
    await db.collection('Messages').doc(req.params.id).update(message);
    res.status(200).json({ id: req.params.id, ...message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/messages/:id', async (req, res) => {
  try {
    await db.collection('Messages').doc(req.params.id).delete();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
