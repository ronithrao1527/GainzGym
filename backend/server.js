import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { executeQuery } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static images folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Authentication Token Verification Middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  // Simplistic secure token check for administrative session
  if (token === 'gainz-session-token-admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access forbidden. Invalid token.' });
  }
};

// 1. Admin Login API
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const users = await executeQuery('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];
    // Hash password + salt using SHA-256
    const calculatedHash = crypto.createHash('sha256').update(password + user.salt).digest('hex');

    if (calculatedHash !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return simple admin token and role
    res.json({
      token: 'gainz-session-token-admin',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server login error', details: error.message });
  }
});

// 2. Get all trainers
app.get('/api/trainers', async (req, res) => {
  try {
    const trainers = await executeQuery('SELECT * FROM trainers ORDER BY id ASC');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trainers', details: error.message });
  }
});

// 3. Add new trainer (Protected Admin Endpoint)
app.post('/api/trainers', verifyAdmin, async (req, res) => {
  const { name, specialization, experience_years, bio, photo_url } = req.body;

  if (!name || !specialization || !experience_years || !bio) {
    return res.status(400).json({ error: 'Name, specialization, experience years, and bio are required' });
  }

  try {
    const sql = 'INSERT INTO trainers (name, specialization, experience_years, bio, photo_url) VALUES (?, ?, ?, ?, ?)';
    // Default portrait placeholder if not provided
    const imgUrl = photo_url || '/images/trainers/alex_vance.jpg';
    const result = await executeQuery(sql, [name, specialization, parseInt(experience_years), bio, imgUrl]);
    
    res.status(201).json({ 
      message: 'Trainer profile added successfully', 
      trainerId: result.insertId,
      trainer: { id: result.insertId, name, specialization, experience_years, bio, photo_url: imgUrl }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trainer profile', details: error.message });
  }
});

// 4. Get all membership plans
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await executeQuery('SELECT * FROM memberships ORDER BY price ASC');
    const formattedPlans = plans.map(p => {
      let features = p.features;
      if (typeof features === 'string') {
        try { features = JSON.parse(features); } catch (e) { features = []; }
      }
      return { ...p, features };
    });
    res.json(formattedPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve plans', details: error.message });
  }
});

// 5. Modify plan price (Protected Admin Endpoint)
app.put('/api/plans/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ error: 'Valid pricing number is required' });
  }

  try {
    const sql = 'UPDATE memberships SET price = ? WHERE id = ?';
    const result = await executeQuery(sql, [parseInt(price), parseInt(id)]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Membership plan not found' });
    }
    
    res.json({ message: 'Membership price updated successfully', planId: id, price });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update membership pricing', details: error.message });
  }
});

// 6. Get all classes and schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const sql = `
      SELECT c.*, t.name as trainer_name 
      FROM classes c 
      LEFT JOIN trainers t ON c.trainer_id = t.id 
      ORDER BY FIELD(c.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), c.start_time
    `;
    const schedules = await executeQuery(sql);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve schedule', details: error.message });
  }
});

// 6a. Add new class schedule (Protected Admin Endpoint)
app.post('/api/schedules', verifyAdmin, async (req, res) => {
  const { class_name, trainer_id, day_of_week, start_time, duration_minutes, room, intensity } = req.body;

  if (!class_name || !trainer_id || !day_of_week || !start_time || !duration_minutes || !room || !intensity) {
    return res.status(400).json({ error: 'All fields are required to create a schedule.' });
  }

  try {
    const sql = 'INSERT INTO classes (class_name, trainer_id, day_of_week, start_time, duration_minutes, room, intensity) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const result = await executeQuery(sql, [class_name, parseInt(trainer_id), day_of_week, start_time, parseInt(duration_minutes), room, intensity]);
    
    // Fetch newly created class details including trainer name
    const fetchSql = `
      SELECT c.*, t.name as trainer_name 
      FROM classes c 
      LEFT JOIN trainers t ON c.trainer_id = t.id 
      WHERE c.id = ?
    `;
    const newClasses = await executeQuery(fetchSql, [result.insertId]);
    
    res.status(201).json({ 
      message: 'Class schedule added successfully', 
      schedule: newClasses[0] || { id: result.insertId, class_name, trainer_id, day_of_week, start_time, duration_minutes, room, intensity }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add class schedule', details: error.message });
  }
});

// 6b. Update class schedule (Protected Admin Endpoint)
app.put('/api/schedules/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { class_name, trainer_id, day_of_week, start_time, duration_minutes, room, intensity } = req.body;

  if (!class_name || !trainer_id || !day_of_week || !start_time || !duration_minutes || !room || !intensity) {
    return res.status(400).json({ error: 'All fields are required to modify a schedule.' });
  }

  try {
    const sql = 'UPDATE classes SET class_name = ?, trainer_id = ?, day_of_week = ?, start_time = ?, duration_minutes = ?, room = ?, intensity = ? WHERE id = ?';
    const result = await executeQuery(sql, [class_name, parseInt(trainer_id), day_of_week, start_time, parseInt(duration_minutes), room, intensity, parseInt(id)]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Class schedule not found' });
    }
    
    // Fetch updated class details including trainer name
    const fetchSql = `
      SELECT c.*, t.name as trainer_name 
      FROM classes c 
      LEFT JOIN trainers t ON c.trainer_id = t.id 
      WHERE c.id = ?
    `;
    const updatedClasses = await executeQuery(fetchSql, [parseInt(id)]);
    
    res.json({ 
      message: 'Class schedule updated successfully', 
      schedule: updatedClasses[0] || { id, class_name, trainer_id, day_of_week, start_time, duration_minutes, room, intensity }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to modify class schedule', details: error.message });
  }
});

// 6c. Delete class schedule (Protected Admin Endpoint)
app.delete('/api/schedules/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'DELETE FROM classes WHERE id = ?';
    const result = await executeQuery(sql, [parseInt(id)]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Class schedule not found' });
    }
    
    res.json({ message: 'Class schedule deleted successfully', scheduleId: id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class schedule', details: error.message });
  }
});

// 7. Get all equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const equipment = await executeQuery('SELECT * FROM equipment ORDER BY name ASC');
    const formattedEquipment = equipment.map(eq => {
      let features = eq.features;
      let specs = eq.specs;
      let rotationPhotos = eq.rotation_photos;
      
      if (typeof features === 'string') {
        try { features = JSON.parse(features); } catch (e) { features = []; }
      }
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
      }
      if (typeof rotationPhotos === 'string') {
        try { rotationPhotos = JSON.parse(rotationPhotos); } catch (e) { rotationPhotos = []; }
      }
      
      return { ...eq, features, specs, rotation_photos: rotationPhotos };
    });
    res.json(formattedEquipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve equipment', details: error.message });
  }
});

// 8. Add new equipment (Protected Admin Endpoint)
app.post('/api/equipment', verifyAdmin, async (req, res) => {
  const { name, category, muscle_groups, description, features, specs, photo_url, rotation_photos } = req.body;

  if (!name || !category || !muscle_groups || !description || !features || !specs) {
    return res.status(400).json({ error: 'Name, category, muscle groups, description, features, and specs are required' });
  }

  try {
    const sql = 'INSERT INTO equipment (name, category, muscle_groups, description, features, specs, photo_url, rotation_photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    const mainPhoto = photo_url || '/images/equipment/functional_trainer_front.jpg';
    
    // Default rotation frames if not provided
    const rotationList = rotation_photos || [
      '/images/equipment/functional_trainer_0.jpg',
      '/images/equipment/functional_trainer_90.jpg',
      '/images/equipment/functional_trainer_180.jpg',
      '/images/equipment/functional_trainer_270.jpg'
    ];

    const result = await executeQuery(sql, [
      name, 
      category, 
      muscle_groups, 
      description, 
      JSON.stringify(features), 
      JSON.stringify(specs), 
      mainPhoto, 
      JSON.stringify(rotationList)
    ]);
    
    res.status(201).json({ 
      message: 'Equipment successfully added to catalog', 
      equipmentId: result.insertId,
      equipment: {
        id: result.insertId,
        name,
        category,
        muscle_groups,
        description,
        features,
        specs,
        photo_url: mainPhoto,
        rotation_photos: rotationList
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create equipment catalog entry', details: error.message });
  }
});

// 9. Submit Contact Inquiry Form
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const sql = 'INSERT INTO inquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
    const result = await executeQuery(sql, [name, email, phone, subject, message]);
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiryId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit inquiry', details: error.message });
  }
});

// 10. Get Inquiry log (Protected Admin Endpoint)
app.get('/api/inquiries', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await executeQuery('SELECT * FROM inquiries ORDER BY id DESC');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inquiries', details: error.message });
  }
});

// Start Server and export for Vercel Serverless
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Gainz Gym Backend Server running on port ${PORT}`);
  });
}

export default app;
