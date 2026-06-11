import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gainz_gym',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let useMock = false;

// Initialize connection pool
try {
  pool = mysql.createPool(dbConfig);
  // Test connection immediately
  const connection = await pool.getConnection();
  console.log('Successfully connected to MySQL database: gainz_gym');
  connection.release();
} catch (error) {
  console.error('MySQL connection failed. Falling back to local mock data. Error details:');
  console.error(error.message);
  useMock = true;
}

// Fallback Mock Data in INR
const MOCK_DATA = {
  users: [
    {
      id: 1,
      username: 'admin',
      // Hash of admin123 + gainzgymsalt
      password_hash: 'bf4bdcf439785e8ad4f1f1be121c851ec38f69de473c713e731b67f9b893cef2',
      salt: 'gainzgymsalt',
      role: 'admin'
    }
  ],
  trainers: [
    {
      id: 1,
      name: 'Alex "The Titan" Vance',
      specialization: 'Bodybuilding & Hypertrophy',
      experience_years: 10,
      bio: 'Alex has helped over 500 clients achieve their dream physiques. He specializes in mechanical tension training and progressive overload strategies.',
      photo_url: '/images/trainers/alex_vance.jpg'
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      specialization: 'HIIT & Athletic Conditioning',
      experience_years: 6,
      bio: 'A former track athlete, Sarah brings high energy and science-backed interval training to build endurance and explosive power.',
      photo_url: '/images/trainers/sarah_jenkins.jpg'
    },
    {
      id: 3,
      name: 'Marcus Thorne',
      specialization: 'Powerlifting & Strength',
      experience_years: 8,
      bio: 'Marcus focuses on compound lifts (squat, bench, deadlift) and corrective movement patterns to build raw, functional strength safely.',
      photo_url: '/images/trainers/marcus_thorne.jpg'
    },
    {
      id: 4,
      name: 'Elena Rostova',
      specialization: 'Yoga, Mobility & Flexibility',
      experience_years: 7,
      bio: 'Elena combines Vinyasa flow with modern active mobility drills to help athletes recover faster and move pain-free.',
      photo_url: '/images/trainers/elena_rostova.jpg'
    }
  ],
  memberships: [
    {
      id: 1,
      name: 'Basic Access',
      price: 2499,
      period: 'month',
      features: ["Gym floor access", "Locker room & showers", "1 Fitness assessment", "Standard hours (6 AM - 10 PM)"],
      badge: null
    },
    {
      id: 2,
      name: 'Gainz VIP',
      price: 4999,
      period: 'month',
      features: ["24/7 Unlimited Access", "All Group Fitness Classes", "2 Personal training sessions/mo", "Sauna & recovery lounge", "Free customized meal plan", "10% Gym shop discount"],
      badge: 'Popular'
    },
    {
      id: 3,
      name: 'Elite Warrior',
      price: 12499,
      period: 'month',
      features: ["Everything in Gainz VIP", "Unlimited Personal Training", "Daily recovery therapy (Cryo/Compression)", "Monthly body scan & biometric analysis", "Custom workout programming app", "Complementary protein shake daily"],
      badge: 'Best Value'
    }
  ],
  equipment: [
    {
      id: 1,
      name: 'Gainz Functional Trainer',
      category: 'Strength',
      muscle_groups: 'Chest, Back, Arms, Core',
      description: 'The ultimate multi-station cable machine. Offers dual independent weight stacks and adjustable pulley positions, enabling hundreds of functional movement paths for strength, stability, and rehabilitation.',
      features: ["Dual 95kg/210lbs weight stacks", "18 adjustable vertical positions", "Premium magnetic selector pins", "Integrated multi-grip pull-up bar"],
      specs: {"Dimensions": "165 x 100 x 212 cm", "Total Weight": "370 kg", "Material": "Heavy-duty 11-gauge steel", "Pulley Ratio": "2:1"},
      photo_url: '/images/equipment/functional_trainer_front.jpg',
      rotation_photos: ["/images/equipment/functional_trainer_0.jpg", "/images/equipment/functional_trainer_90.jpg", "/images/equipment/functional_trainer_180.jpg", "/images/equipment/functional_trainer_270.jpg"]
    },
    {
      id: 2,
      name: 'Apex Horizon Treadmill',
      category: 'Cardio',
      muscle_groups: 'Legs, Cardiovascular System',
      description: 'Engineered for elite endurance training. Features a commercial-grade 4.5 HP motor, orthopedic cushioning belt, and a high-definition console simulating scenic routes. Smooth, quiet, and built to withstand intensive running.',
      features: ["4.5 HP continuous-duty motor", "0-20% motorized incline range", "Orthopedic shock absorption belt", "Integrated cooling fans & speakers"],
      specs: {"Dimensions": "215 x 92 x 150 cm", "Max User Weight": "180 kg", "Speed Range": "0.8 - 22 km/h", "Console Screen": "15.6 inch HD Touchscreen"},
      photo_url: '/images/equipment/treadmill_front.jpg',
      rotation_photos: ["/images/equipment/treadmill_0.jpg", "/images/equipment/treadmill_90.jpg", "/images/equipment/treadmill_180.jpg", "/images/equipment/treadmill_270.jpg"]
    },
    {
      id: 3,
      name: 'Heavy-Duty Power Cage',
      category: 'Strength / Free Weights',
      muscle_groups: 'Quadriceps, Hamstrings, Glutes, Back',
      description: 'A bulletproof rack designed for heavy squats, bench presses, and overhead movements. Features integrated multi-angle pull-up bars, spotter arms, and plate storage horns. Built to hold massive loads with zero wobble.',
      features: ["Laser-cut upright numbering", "3x3 inch structural steel tubing", "Magnetic locking J-Cups", "Multi-grip pull-up system"],
      specs: {"Dimensions": "145 x 168 x 230 cm", "Weight Capacity": "680 kg / 1500 lbs", "Hole Spacing": "Westside spacing (2\" on centers)", "Finish": "Matte black powder coat"},
      photo_url: '/images/equipment/power_cage_front.jpg',
      rotation_photos: ["/images/equipment/power_cage_0.jpg", "/images/equipment/power_cage_90.jpg", "/images/equipment/power_cage_180.jpg", "/images/equipment/power_cage_270.jpg"]
    },
    {
      id: 4,
      name: 'Gainz Iso-Lateral Leg Press',
      category: 'Strength',
      muscle_groups: 'Quadriceps, Glutes, Hamstrings',
      description: 'Target the lower body with perfect bio-mechanical alignment. The iso-lateral movement allows unilateral training, rectifying muscle imbalances. Linear bearings provide a silky smooth sled action under maximum load.',
      features: ["Unilateral or bilateral leg pressing", "Dual weight horns (fits Olympic plates)", "Adjustable seat angle with lumbar support", "Safety release lock handles"],
      specs: {"Dimensions": "220 x 150 x 148 cm", "Max Load Capacity": "500 kg / 1100 lbs", "Sled Angle": "45 degrees", "Bearing Type": "Industrial linear ball bearings"},
      photo_url: '/images/equipment/leg_press_front.jpg',
      rotation_photos: ["/images/equipment/leg_press_0.jpg", "/images/equipment/leg_press_90.jpg", "/images/equipment/leg_press_180.jpg", "/images/equipment/leg_press_270.jpg"]
    }
  ],
  classes: [
    { id: 1, class_name: 'Strength Conditioning', trainer_id: 3, trainer_name: 'Marcus Thorne', day_of_week: 'Monday', start_time: '07:00:00', duration_minutes: 60, room: 'Main Gym Floor', intensity: 'Advanced' },
    { id: 2, class_name: 'HIIT Core Blast', trainer_id: 2, trainer_name: 'Sarah Jenkins', day_of_week: 'Monday', start_time: '09:00:00', duration_minutes: 45, room: 'Studio A', intensity: 'Intermediate' },
    { id: 3, class_name: 'Vinyasa Flow Yoga', trainer_id: 4, trainer_name: 'Elena Rostova', day_of_week: 'Monday', start_time: '17:30:00', duration_minutes: 60, room: 'Mind-Body Room', intensity: 'Beginner' },
    { id: 4, class_name: 'Powerlifting Fundamentals', trainer_id: 3, trainer_name: 'Marcus Thorne', day_of_week: 'Tuesday', start_time: '08:00:00', duration_minutes: 75, room: 'Power Zone', intensity: 'Intermediate' },
    { id: 5, class_name: 'Cardio Kickboxing', trainer_id: 2, trainer_name: 'Sarah Jenkins', day_of_week: 'Tuesday', start_time: '18:00:00', duration_minutes: 50, room: 'Studio A', intensity: 'Intermediate' },
    { id: 6, class_name: 'Strength Conditioning', trainer_id: 3, trainer_name: 'Marcus Thorne', day_of_week: 'Wednesday', start_time: '07:00:00', duration_minutes: 60, room: 'Main Gym Floor', intensity: 'Advanced' },
    { id: 7, class_name: 'Flexibility & Mobility', trainer_id: 4, trainer_name: 'Elena Rostova', day_of_week: 'Wednesday', start_time: '12:00:00', duration_minutes: 45, room: 'Mind-Body Room', intensity: 'Beginner' },
    { id: 8, class_name: 'HIIT Core Blast', trainer_id: 2, trainer_name: 'Sarah Jenkins', day_of_week: 'Wednesday', start_time: '17:30:00', duration_minutes: 45, room: 'Studio A', intensity: 'Intermediate' },
    { id: 9, class_name: 'Olympic Weightlifting', trainer_id: 3, trainer_name: 'Marcus Thorne', day_of_week: 'Thursday', start_time: '18:00:00', duration_minutes: 90, room: 'Power Zone', intensity: 'Advanced' },
    { id: 10, class_name: 'Yin Yoga & Meditate', trainer_id: 4, trainer_name: 'Elena Rostova', day_of_week: 'Thursday', start_time: '19:45:00', duration_minutes: 60, room: 'Mind-Body Room', intensity: 'Beginner' },
    { id: 11, class_name: 'Strength Conditioning', trainer_id: 3, trainer_name: 'Marcus Thorne', day_of_week: 'Friday', start_time: '07:00:00', duration_minutes: 60, room: 'Main Gym Floor', intensity: 'Advanced' },
    { id: 12, class_name: 'Cardio Kickboxing', trainer_id: 2, trainer_name: 'Sarah Jenkins', day_of_week: 'Friday', start_time: '09:00:00', duration_minutes: 50, room: 'Studio A', intensity: 'Intermediate' },
    { id: 13, class_name: 'Sunset Flow Yoga', trainer_id: 4, trainer_name: 'Elena Rostova', day_of_week: 'Friday', start_time: '18:00:00', duration_minutes: 60, room: 'Mind-Body Room', intensity: 'Beginner' },
    { id: 14, class_name: 'Weekend Warrior Bootcamp', trainer_id: 2, trainer_name: 'Sarah Jenkins', day_of_week: 'Saturday', start_time: '08:30:00', duration_minutes: 90, room: 'Main Gym Floor', intensity: 'Advanced' },
    { id: 15, class_name: 'Powerlifting Meet Prep', trainer_id: 3, trainer_name: 'Marcus Thorne', day_of_week: 'Saturday', start_time: '10:30:00', duration_minutes: 120, room: 'Power Zone', intensity: 'Advanced' }
  ],
  inquiries: []
};

// Database queries with auto-fallback to mock JSON
export async function executeQuery(sql, params = []) {
  if (useMock) {
    return handleMockQuery(sql, params);
  }

  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    console.log('Query failed in production mode, falling back to mock data handling...');
    return handleMockQuery(sql, params);
  }
}

function handleMockQuery(sql, params) {
  const cleanSql = sql.toLowerCase().replace(/\s+/g, ' ');

  // 1. SELECT USERS
  if (cleanSql.includes('select') && cleanSql.includes('from users')) {
    if (cleanSql.includes('where username =') || cleanSql.includes('where username=?')) {
      const username = params[0];
      const user = MOCK_DATA.users.find(u => u.username === username);
      return user ? [user] : [];
    }
    return MOCK_DATA.users;
  }

  // 2. SELECT TRAINERS
  if (cleanSql.includes('select') && cleanSql.includes('from trainers')) {
    return MOCK_DATA.trainers;
  }
  
  // 3. SELECT MEMBERSHIPS
  if (cleanSql.includes('select') && cleanSql.includes('from memberships')) {
    return MOCK_DATA.memberships;
  }

  // 4. SELECT EQUIPMENT
  if (cleanSql.includes('select') && cleanSql.includes('from equipment')) {
    if (cleanSql.includes('where id =') || cleanSql.includes('where id=?')) {
      const id = params[0];
      const eq = MOCK_DATA.equipment.find(e => e.id === Number(id));
      return eq ? [eq] : [];
    }
    return MOCK_DATA.equipment;
  }

  // 5. SELECT CLASSES / SCHEDULES
  if (cleanSql.includes('select') && cleanSql.includes('from classes')) {
    return MOCK_DATA.classes;
  }

  // 5a. INSERT CLASS
  if (cleanSql.includes('insert into classes')) {
    const newClass = {
      id: MOCK_DATA.classes.length > 0 ? Math.max(...MOCK_DATA.classes.map(c => c.id)) + 1 : 1,
      class_name: params[0],
      trainer_id: Number(params[1]),
      trainer_name: MOCK_DATA.trainers.find(t => t.id === Number(params[1]))?.name || 'Staff',
      day_of_week: params[2],
      start_time: params[3],
      duration_minutes: Number(params[4]),
      room: params[5],
      intensity: params[6]
    };
    MOCK_DATA.classes.push(newClass);
    console.log('Mock: Class added locally:', newClass);
    return { insertId: newClass.id, affectedRows: 1 };
  }

  // 5b. UPDATE CLASS
  if (cleanSql.includes('update classes')) {
    const class_name = params[0];
    const trainer_id = Number(params[1]);
    const day_of_week = params[2];
    const start_time = params[3];
    const duration_minutes = Number(params[4]);
    const room = params[5];
    const intensity = params[6];
    const id = Number(params[7]);

    const cIndex = MOCK_DATA.classes.findIndex(c => c.id === id);
    if (cIndex !== -1) {
      MOCK_DATA.classes[cIndex] = {
        ...MOCK_DATA.classes[cIndex],
        class_name,
        trainer_id,
        trainer_name: MOCK_DATA.trainers.find(t => t.id === trainer_id)?.name || 'Staff',
        day_of_week,
        start_time,
        duration_minutes,
        room,
        intensity
      };
      console.log('Mock: Class updated locally:', MOCK_DATA.classes[cIndex]);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 5c. DELETE CLASS
  if (cleanSql.includes('delete from classes')) {
    const id = Number(params[0]);
    const cIndex = MOCK_DATA.classes.findIndex(c => c.id === id);
    if (cIndex !== -1) {
      MOCK_DATA.classes.splice(cIndex, 1);
      console.log('Mock: Class deleted locally with ID:', id);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 6. SELECT INQUIRIES
  if (cleanSql.includes('select') && cleanSql.includes('from inquiries')) {
    // Return newest inquiries first
    return [...MOCK_DATA.inquiries].reverse();
  }

  // 7. INSERT INQUIRY
  if (cleanSql.includes('insert into inquiries')) {
    const newInquiry = {
      id: MOCK_DATA.inquiries.length + 1,
      name: params[0],
      email: params[1],
      phone: params[2],
      subject: params[3],
      message: params[4],
      status: 'Pending',
      created_at: new Date()
    };
    MOCK_DATA.inquiries.push(newInquiry);
    console.log('Mock: Inquiry saved locally:', newInquiry);
    return { insertId: newInquiry.id, affectedRows: 1 };
  }

  // 8. INSERT TRAINER
  if (cleanSql.includes('insert into trainers')) {
    const newTrainer = {
      id: MOCK_DATA.trainers.length + 1,
      name: params[0],
      specialization: params[1],
      experience_years: Number(params[2]),
      bio: params[3],
      photo_url: params[4] || '/images/trainers/alex_vance.jpg'
    };
    MOCK_DATA.trainers.push(newTrainer);
    console.log('Mock: Trainer added locally:', newTrainer);
    return { insertId: newTrainer.id, affectedRows: 1 };
  }

  // 9. INSERT EQUIPMENT
  if (cleanSql.includes('insert into equipment')) {
    const newEq = {
      id: MOCK_DATA.equipment.length + 1,
      name: params[0],
      category: params[1],
      muscle_groups: params[2],
      description: params[3],
      features: typeof params[4] === 'string' ? JSON.parse(params[4]) : params[4],
      specs: typeof params[5] === 'string' ? JSON.parse(params[5]) : params[5],
      photo_url: params[6] || '/images/equipment/functional_trainer_front.jpg',
      rotation_photos: typeof params[7] === 'string' ? JSON.parse(params[7]) : params[7]
    };
    MOCK_DATA.equipment.push(newEq);
    console.log('Mock: Equipment added locally:', newEq);
    return { insertId: newEq.id, affectedRows: 1 };
  }

  // 10. UPDATE MEMBERSHIP PRICE
  if (cleanSql.includes('update memberships')) {
    // UPDATE memberships SET price = ? WHERE id = ?
    const price = params[0];
    const id = params[1];
    const plan = MOCK_DATA.memberships.find(m => m.id === Number(id));
    if (plan) {
      plan.price = Number(price);
      console.log('Mock: Membership price updated locally:', plan);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  return [];
}
