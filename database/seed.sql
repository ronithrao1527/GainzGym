-- Gainz Gym Database Seeding

USE gainz_gym;

-- Clear existing data
DELETE FROM inquiries;
DELETE FROM classes;
DELETE FROM equipment;
DELETE FROM memberships;
DELETE FROM trainers;
DELETE FROM users;

-- Reset Auto-Increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE trainers AUTO_INCREMENT = 1;
ALTER TABLE memberships AUTO_INCREMENT = 1;
ALTER TABLE equipment AUTO_INCREMENT = 1;
ALTER TABLE classes AUTO_INCREMENT = 1;
ALTER TABLE inquiries AUTO_INCREMENT = 1;

-- 1. Seed Admin User
-- Credentials: admin / admin123
-- Hash: SHA256("admin123" + "gainzgymsalt") = bf4bdcf439785e8ad4f1f1be121c851ec38f69de473c713e731b67f9b893cef2
INSERT INTO users (username, password_hash, salt, role) VALUES
(
    'admin',
    'bf4bdcf439785e8ad4f1f1be121c851ec38f69de473c713e731b67f9b893cef2',
    'gainzgymsalt',
    'admin'
);

-- 2. Seed Trainers
INSERT INTO trainers (name, specialization, experience_years, bio, photo_url) VALUES
(
    'Alex "The Titan" Vance',
    'Bodybuilding & Hypertrophy',
    10,
    'Alex has helped over 500 clients achieve their dream physiques. He specializes in mechanical tension training and progressive overload strategies.',
    '/images/trainers/alex_vance.jpg'
),
(
    'Sarah Jenkins',
    'HIIT & Athletic Conditioning',
    6,
    'A former track athlete, Sarah brings high energy and science-backed interval training to build endurance and explosive power.',
    '/images/trainers/sarah_jenkins.jpg'
),
(
    'Marcus Thorne',
    'Powerlifting & Strength',
    8,
    'Marcus focuses on compound lifts (squat, bench, deadlift) and corrective movement patterns to build raw, functional strength safely.',
    '/images/trainers/marcus_thorne.jpg'
),
(
    'Elena Rostova',
    'Yoga, Mobility & Flexibility',
    7,
    'Elena combines Vinyasa flow with modern active mobility drills to help athletes recover faster and move pain-free.',
    '/images/trainers/elena_rostova.jpg'
);

-- 3. Seed Membership Plans (in INR)
INSERT INTO memberships (name, price, period, features, badge) VALUES
(
    'Basic Access',
    2499,
    'month',
    '["Gym floor access", "Locker room & showers", "1 Fitness assessment", "Standard hours (6 AM - 10 PM)"]',
    NULL
),
(
    'Gainz VIP',
    4999,
    'month',
    '["24/7 Unlimited Access", "All Group Fitness Classes", "2 Personal training sessions/mo", "Sauna & recovery lounge", "Free customized meal plan", "10% Gym shop discount"]',
    'Popular'
),
(
    'Elite Warrior',
    12499,
    'month',
    '["Everything in Gainz VIP", "Unlimited Personal Training", "Daily recovery therapy (Cryo/Compression)", "Monthly body scan & biometric analysis", "Custom workout programming app", "Complementary protein shake daily"]',
    'Best Value'
);

-- 4. Seed Equipment
INSERT INTO equipment (name, category, muscle_groups, description, features, specs, photo_url, rotation_photos) VALUES
(
    'Gainz Functional Trainer',
    'Strength',
    'Chest, Back, Arms, Core',
    'The ultimate multi-station cable machine. Offers dual independent weight stacks and adjustable pulley positions, enabling hundreds of functional movement paths for strength, stability, and rehabilitation.',
    '["Dual 95kg/210lbs weight stacks", "18 adjustable vertical positions", "Premium magnetic selector pins", "Integrated multi-grip pull-up bar"]',
    '{"Dimensions": "165 x 100 x 212 cm", "Total Weight": "370 kg", "Material": "Heavy-duty 11-gauge steel", "Pulley Ratio": "2:1"}',
    '/images/equipment/functional_trainer_front.jpg',
    '["/images/equipment/functional_trainer_0.jpg", "/images/equipment/functional_trainer_90.jpg", "/images/equipment/functional_trainer_180.jpg", "/images/equipment/functional_trainer_270.jpg"]'
),
(
    'Apex Horizon Treadmill',
    'Cardio',
    'Legs, Cardiovascular System',
    'Engineered for elite endurance training. Features a commercial-grade 4.5 HP motor, orthopedic cushioning belt, and a high-definition console simulating scenic routes. Smooth, quiet, and built to withstand intensive running.',
    '["4.5 HP continuous-duty motor", "0-20% motorized incline range", "Orthopedic shock absorption belt", "Integrated cooling fans & speakers"]',
    '{"Dimensions": "215 x 92 x 150 cm", "Max User Weight": "180 kg", "Speed Range": "0.8 - 22 km/h", "Console Screen": "15.6 inch HD Touchscreen"}',
    '/images/equipment/treadmill_front.jpg',
    '["/images/equipment/treadmill_0.jpg", "/images/equipment/treadmill_90.jpg", "/images/equipment/treadmill_180.jpg", "/images/equipment/treadmill_270.jpg"]'
),
(
    'Heavy-Duty Power Cage',
    'Strength / Free Weights',
    'Quadriceps, Hamstrings, Glutes, Back',
    'A bulletproof rack designed for heavy squats, bench presses, and overhead movements. Features integrated multi-angle pull-up bars, spotter arms, and plate storage horns. Built to hold massive loads with zero wobble.',
    '["Laser-cut upright numbering", "3x3 inch structural steel tubing", "Magnetic locking J-Cups", "Multi-grip pull-up system"]',
    '{"Dimensions": "145 x 168 x 230 cm", "Weight Capacity": "680 kg / 1500 lbs", "Hole Spacing": "Westside spacing (2\" on centers)", "Finish": "Matte black powder coat"}',
    '/images/equipment/power_cage_front.jpg',
    '["/images/equipment/power_cage_0.jpg", "/images/equipment/power_cage_90.jpg", "/images/equipment/power_cage_180.jpg", "/images/equipment/power_cage_270.jpg"]'
),
(
    'Gainz Iso-Lateral Leg Press',
    'Strength',
    'Quadriceps, Glutes, Hamstrings',
    'Target the lower body with perfect bio-mechanical alignment. The iso-lateral movement allows unilateral training, rectifying muscle imbalances. Linear bearings provide a silky smooth sled action under maximum load.',
    '["Unilateral or bilateral leg pressing", "Dual weight horns (fits Olympic plates)", "Adjustable seat angle with lumbar support", "Safety release lock handles"]',
    '{"Dimensions": "220 x 150 x 148 cm", "Max Load Capacity": "500 kg / 1100 lbs", "Sled Angle": "45 degrees", "Bearing Type": "Industrial linear ball bearings"}',
    '/images/equipment/leg_press_front.jpg',
    '["/images/equipment/leg_press_0.jpg", "/images/equipment/leg_press_90.jpg", "/images/equipment/leg_press_180.jpg", "/images/equipment/leg_press_270.jpg"]'
);

-- 5. Seed Class Schedules
INSERT INTO classes (class_name, trainer_id, day_of_week, start_time, duration_minutes, room, intensity) VALUES
-- Monday
('Strength Conditioning', 3, 'Monday', '07:00:00', 60, 'Main Gym Floor', 'Advanced'),
('HIIT Core Blast', 2, 'Monday', '09:00:00', 45, 'Studio A', 'Intermediate'),
('Vinyasa Flow Yoga', 4, 'Monday', '17:30:00', 60, 'Mind-Body Room', 'Beginner'),

-- Tuesday
('Powerlifting Fundamentals', 3, 'Tuesday', '08:00:00', 75, 'Power Zone', 'Intermediate'),
('Cardio Kickboxing', 2, 'Tuesday', '18:00:00', 50, 'Studio A', 'Intermediate'),

-- Wednesday
('Strength Conditioning', 3, 'Wednesday', '07:00:00', 60, 'Main Gym Floor', 'Advanced'),
('Flexibility & Mobility', 4, 'Wednesday', '12:00:00', 45, 'Mind-Body Room', 'Beginner'),
('HIIT Core Blast', 2, 'Wednesday', '17:30:00', 45, 'Studio A', 'Intermediate'),

-- Thursday
('Olympic Weightlifting', 3, 'Thursday', '18:00:00', 90, 'Power Zone', 'Advanced'),
('Yin Yoga & Meditate', 4, 'Thursday', '19:45:00', 60, 'Mind-Body Room', 'Beginner'),

-- Friday
('Strength Conditioning', 3, 'Friday', '07:00:00', 60, 'Main Gym Floor', 'Advanced'),
('Cardio Kickboxing', 2, 'Friday', '09:00:00', 50, 'Studio A', 'Intermediate'),
('Sunset Flow Yoga', 4, 'Friday', '18:00:00', 60, 'Mind-Body Room', 'Beginner'),

-- Saturday
('Weekend Warrior Bootcamp', 2, 'Saturday', '08:30:00', 90, 'Main Gym Floor', 'Advanced'),
('Powerlifting Meet Prep', 3, 'Saturday', '10:30:00', 120, 'Power Zone', 'Advanced');
