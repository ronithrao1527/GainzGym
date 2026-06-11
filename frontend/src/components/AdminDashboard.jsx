import React, { useState, useEffect } from 'react';
import { X, Mail, DollarSign, UserPlus, PlusCircle, Trash, Check, AlertCircle, Loader2, Calendar, Edit3, Trash2 } from 'lucide-react';
import { getApiHost } from '../utils/api';

export default function AdminDashboard({ onClose, plans, onPlanUpdated, onTrainerAdded, onEquipmentAdded }) {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }
  const [formLoading, setFormLoading] = useState(false);

  // Forms states
  const [priceData, setPriceData] = useState({});
  const [trainerForm, setTrainerForm] = useState({
    name: '',
    specialization: '',
    experience_years: '',
    bio: '',
    photo_url: ''
  });
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    category: 'Strength',
    muscle_groups: '',
    description: '',
    features: '',
    dimensions: '',
    weight: '',
    material: '',
    photo_url: ''
  });
  const [scheduleForm, setScheduleForm] = useState({
    id: null, // null for new schedule, numeric ID for edit mode
    class_name: '',
    trainer_id: '',
    day_of_week: 'Monday',
    start_time: '08:00',
    duration_minutes: '60',
    room: 'Studio A',
    intensity: 'Intermediate'
  });

  // Fetch Inquiries when tab opens
  useEffect(() => {
    if (activeTab === 'inquiries') {
      const fetchInquiries = async () => {
        setInquiriesLoading(true);
        try {
          const host = getApiHost();
          const token = localStorage.getItem('gainz_admin_token');
          const res = await fetch(`${host}/api/inquiries`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            setInquiries(await res.json());
          }
        } catch (err) {
          console.error('Failed to fetch inquiries:', err);
        } finally {
          setInquiriesLoading(false);
        }
      };
      fetchInquiries();
    }
  }, [activeTab]);

  // Fetch Schedules & Trainers when tab opens
  useEffect(() => {
    if (activeTab === 'schedules') {
      const fetchSchedulesAndTrainers = async () => {
        setSchedulesLoading(true);
        try {
          const host = getApiHost();
          const token = localStorage.getItem('gainz_admin_token');
          
          // Fetch schedules
          const schedulesRes = await fetch(`${host}/api/schedules`);
          if (schedulesRes.ok) {
            setSchedules(await schedulesRes.json());
          }

          // Fetch trainers (to populate dropdown)
          const trainersRes = await fetch(`${host}/api/trainers`);
          if (trainersRes.ok) {
            setTrainers(await trainersRes.json());
          }
        } catch (err) {
          console.error('Failed to fetch schedules or trainers:', err);
        } finally {
          setSchedulesLoading(false);
        }
      };
      fetchSchedulesAndTrainers();
    }
  }, [activeTab]);

  // Sync pricing values
  useEffect(() => {
    const prices = {};
    plans.forEach(p => {
      prices[p.id] = p.price;
    });
    setPriceData(prices);
  }, [plans]);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // 1. Update Price
  const handleUpdatePrice = async (planId) => {
    const newPrice = priceData[planId];
    if (newPrice === undefined || isNaN(newPrice) || newPrice < 0) {
      showToast('error', 'Please enter a valid price.');
      return;
    }

    try {
      const host = getApiHost();
      const token = localStorage.getItem('gainz_admin_token');
      const res = await fetch(`${host}/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ price: Number(newPrice) })
      });

      if (res.ok) {
        onPlanUpdated(planId, Number(newPrice));
        showToast('success', 'Plan price updated successfully in INR (₹).');
      } else {
        // Fallback for mock mode
        onPlanUpdated(planId, Number(newPrice));
        showToast('success', 'Plan price updated (Local mock mode).');
      }
    } catch (err) {
      console.warn('API error, executing locally:', err);
      onPlanUpdated(planId, Number(newPrice));
      showToast('success', 'Plan price updated (Local mock mode).');
    }
  };

  // 2. Add Trainer
  const handleTrainerSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!trainerForm.name || !trainerForm.specialization || !trainerForm.experience_years || !trainerForm.bio) {
      showToast('error', 'All fields are required.');
      setFormLoading(false);
      return;
    }

    const payload = {
      ...trainerForm,
      experience_years: Number(trainerForm.experience_years)
    };

    try {
      const host = getApiHost();
      const token = localStorage.getItem('gainz_admin_token');
      const res = await fetch(`${host}/api/trainers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        onTrainerAdded(data.trainer);
        showToast('success', 'Trainer profile created successfully!');
        setTrainerForm({ name: '', specialization: '', experience_years: '', bio: '', photo_url: '' });
      } else {
        // Fallback for mock
        const mockTrainer = { ...payload, id: Date.now(), photo_url: payload.photo_url || '/images/trainers/alex_vance.jpg' };
        onTrainerAdded(mockTrainer);
        showToast('success', 'Trainer profile created (Local mock mode)!');
        setTrainerForm({ name: '', specialization: '', experience_years: '', bio: '', photo_url: '' });
      }
    } catch (err) {
      const mockTrainer = { ...payload, id: Date.now(), photo_url: payload.photo_url || '/images/trainers/alex_vance.jpg' };
      onTrainerAdded(mockTrainer);
      showToast('success', 'Trainer profile created (Local mock mode)!');
      setTrainerForm({ name: '', specialization: '', experience_years: '', bio: '', photo_url: '' });
    } finally {
      setFormLoading(false);
    }
  };

  // 3. Add Equipment
  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!equipmentForm.name || !equipmentForm.muscle_groups || !equipmentForm.description || !equipmentForm.features) {
      showToast('error', 'Please fill in all required fields.');
      setFormLoading(false);
      return;
    }

    // Split features by commas
    const featuresList = equipmentForm.features.split(',').map(f => f.trim()).filter(Boolean);
    const specsData = {
      "Dimensions": equipmentForm.dimensions || 'N/A',
      "Total Weight": equipmentForm.weight || 'N/A',
      "Material": equipmentForm.material || 'N/A'
    };

    const payload = {
      name: equipmentForm.name,
      category: equipmentForm.category,
      muscle_groups: equipmentForm.muscle_groups,
      description: equipmentForm.description,
      features: featuresList,
      specs: specsData,
      photo_url: equipmentForm.photo_url || '/images/equipment/functional_trainer_front.jpg',
      rotation_photos: [
        '/images/equipment/functional_trainer_0.jpg',
        '/images/equipment/functional_trainer_90.jpg',
        '/images/equipment/functional_trainer_180.jpg',
        '/images/equipment/functional_trainer_270.jpg'
      ]
    };

    try {
      const host = getApiHost();
      const token = localStorage.getItem('gainz_admin_token');
      const res = await fetch(`${host}/api/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        onEquipmentAdded(data.equipment);
        showToast('success', 'Equipment item added to inventory!');
        setEquipmentForm({ name: '', category: 'Strength', muscle_groups: '', description: '', features: '', dimensions: '', weight: '', material: '', photo_url: '' });
      } else {
        // Fallback for mock
        const mockEq = { ...payload, id: Date.now() };
        onEquipmentAdded(mockEq);
        showToast('success', 'Equipment added (Local mock mode)!');
        setEquipmentForm({ name: '', category: 'Strength', muscle_groups: '', description: '', features: '', dimensions: '', weight: '', material: '', photo_url: '' });
      }
    } catch (err) {
      const mockEq = { ...payload, id: Date.now() };
      onEquipmentAdded(mockEq);
      showToast('success', 'Equipment added (Local mock mode)!');
      setEquipmentForm({ name: '', category: 'Strength', muscle_groups: '', description: '', features: '', dimensions: '', weight: '', material: '', photo_url: '' });
    } finally {
      setFormLoading(false);
    }
  };

  const handlePriceChange = (id, val) => {
    setPriceData(prev => ({ ...prev, [id]: val }));
  };

  // 4. Submit Schedule (Add / Edit)
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const { id, class_name, trainer_id, day_of_week, start_time, duration_minutes, room, intensity } = scheduleForm;

    if (!class_name || !trainer_id || !day_of_week || !start_time || !duration_minutes || !room || !intensity) {
      showToast('error', 'All fields are required.');
      setFormLoading(false);
      return;
    }

    // Format start time to hh:mm:ss if it is hh:mm
    let formattedTime = start_time;
    if (start_time.split(':').length === 2) {
      formattedTime = `${start_time}:00`;
    }

    const payload = {
      class_name,
      trainer_id: Number(trainer_id),
      day_of_week,
      start_time: formattedTime,
      duration_minutes: Number(duration_minutes),
      room,
      intensity
    };

    const host = getApiHost();
    const token = localStorage.getItem('gainz_admin_token');
    const isEdit = id !== null;

    try {
      const url = isEdit ? `${host}/api/schedules/${id}` : `${host}/api/schedules`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        showToast('success', isEdit ? 'Class schedule modified successfully!' : 'Class schedule added successfully!');
        
        // Refresh local list
        if (isEdit) {
          setSchedules(prev => prev.map(s => s.id === Number(id) ? data.schedule : s));
        } else {
          setSchedules(prev => [...prev, data.schedule]);
        }
        
        // Reset form
        setScheduleForm({
          id: null,
          class_name: '',
          trainer_id: '',
          day_of_week: 'Monday',
          start_time: '08:00',
          duration_minutes: '60',
          room: 'Studio A',
          intensity: 'Intermediate'
        });

        // Dispatch change event to sync with frontend ScheduleBoard
        window.dispatchEvent(new Event('schedule-changed'));
      } else {
        // Fallback for mock mode
        const mockTrainer = trainers.find(t => t.id === Number(trainer_id)) || { name: 'Staff' };
        const mockSchedule = {
          ...payload,
          id: isEdit ? Number(id) : Date.now(),
          trainer_name: mockTrainer.name
        };

        if (isEdit) {
          setSchedules(prev => prev.map(s => s.id === Number(id) ? mockSchedule : s));
          showToast('success', 'Class schedule modified (Local mock mode).');
        } else {
          setSchedules(prev => [...prev, mockSchedule]);
          showToast('success', 'Class schedule added (Local mock mode).');
        }

        setScheduleForm({
          id: null,
          class_name: '',
          trainer_id: '',
          day_of_week: 'Monday',
          start_time: '08:00',
          duration_minutes: '60',
          room: 'Studio A',
          intensity: 'Intermediate'
        });
        window.dispatchEvent(new Event('schedule-changed'));
      }
    } catch (err) {
      console.warn('API error, executing locally:', err);
      const mockTrainer = trainers.find(t => t.id === Number(trainer_id)) || { name: 'Staff' };
      const mockSchedule = {
        ...payload,
        id: isEdit ? Number(id) : Date.now(),
        trainer_name: mockTrainer.name
      };

      if (isEdit) {
        setSchedules(prev => prev.map(s => s.id === Number(id) ? mockSchedule : s));
        showToast('success', 'Class schedule modified (Local mock mode).');
      } else {
        setSchedules(prev => [...prev, mockSchedule]);
        showToast('success', 'Class schedule added (Local mock mode).');
      }

      setScheduleForm({
        id: null,
        class_name: '',
        trainer_id: '',
        day_of_week: 'Monday',
        start_time: '08:00',
        duration_minutes: '60',
        room: 'Studio A',
        intensity: 'Intermediate'
      });
      window.dispatchEvent(new Event('schedule-changed'));
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete Schedule
  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule slot?')) return;

    try {
      const host = getApiHost();
      const token = localStorage.getItem('gainz_admin_token');
      const res = await fetch(`${host}/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
        showToast('success', 'Class schedule deleted successfully!');
        window.dispatchEvent(new Event('schedule-changed'));
      } else {
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
        showToast('success', 'Class schedule deleted (Local mock mode).');
        window.dispatchEvent(new Event('schedule-changed'));
      }
    } catch (err) {
      console.warn('API error, executing locally:', err);
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      showToast('success', 'Class schedule deleted (Local mock mode).');
      window.dispatchEvent(new Event('schedule-changed'));
    }
  };

  // Prepare edit mode
  const startEditSchedule = (s) => {
    let shortTime = s.start_time || '08:00';
    if (shortTime.split(':').length === 3) {
      shortTime = shortTime.substring(0, 5);
    }

    setScheduleForm({
      id: s.id,
      class_name: s.class_name,
      trainer_id: s.trainer_id,
      day_of_week: s.day_of_week,
      start_time: shortTime,
      duration_minutes: String(s.duration_minutes),
      room: s.room,
      intensity: s.intensity
    });
  };

  return (
    <div className="admin-overlay">
      <div className="admin-container">
        
        {/* Close */}
        <button className="close-btn" onClick={onClose} aria-label="Close dashboard">
          <X size={22} />
        </button>

        {/* Dashboard HUD header */}
        <div className="admin-hud-header">
          <h2>Gainz Gym <span>Command Panel</span></h2>
          <p>Logged in as Administrator | Security Session active</p>
        </div>

        {/* Toast Notification */}
        {message && (
          <div className={`admin-toast ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="admin-dashboard-grid">
          
          {/* Side Menu */}
          <div className="admin-sidebar">
            <button 
              className={`sidebar-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              <Mail size={16} /> Customer Inquiries
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              <DollarSign size={16} /> Edit Plan Pricing
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'trainer' ? 'active' : ''}`}
              onClick={() => setActiveTab('trainer')}
            >
              <UserPlus size={16} /> Add New Trainer
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'equipment' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              <PlusCircle size={16} /> Add Equipment
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'schedules' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedules')}
            >
              <Calendar size={16} /> Modify Schedules
            </button>
          </div>

          {/* Main Pane */}
          <div className="admin-main-pane glass-card">
            
            {/* 1. Tab: Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="tab-view animate-fade">
                <h3 className="tab-heading">Customer Inquiries Log</h3>
                {inquiriesLoading ? (
                  <div className="pane-loader">
                    <Loader2 className="animate-spin" />
                    <span>Accessing inquiries ledger...</span>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="pane-empty">
                    <p>No customer inquiries recorded in the database ledger.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Contact Details</th>
                          <th>Subject / Message</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((inq) => (
                          <tr key={inq.id}>
                            <td className="cell-name">{inq.name}</td>
                            <td className="cell-contact">
                              <div>{inq.email}</div>
                              <div className="text-muted">{inq.phone}</div>
                            </td>
                            <td className="cell-message">
                              <div className="msg-subject">{inq.subject}</div>
                              <div className="msg-text">{inq.message}</div>
                            </td>
                            <td>
                              <span className="badge-neon lime">{inq.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. Tab: Pricing */}
            {activeTab === 'pricing' && (
              <div className="tab-view animate-fade">
                <h3 className="tab-heading">Modify Membership Rates (INR)</h3>
                <p className="tab-subtext">Adjust the pricing tier values in Gainz Gym. All modifications render immediately in the lobby cards.</p>
                
                <div className="pricing-modifier-list">
                  {plans.map((plan) => (
                    <div key={plan.id} className="plan-edit-row">
                      <div className="plan-meta-brief">
                        <h4>{plan.name}</h4>
                        <span>Frequency: every {plan.period}</span>
                      </div>
                      
                      <div className="plan-input-action">
                        <span className="currency-prefix">₹</span>
                        <input
                          type="number"
                          value={priceData[plan.id] || ''}
                          onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                          placeholder="Price"
                          min="0"
                        />
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdatePrice(plan.id)}
                        >
                          Save Price
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Tab: Add Trainer */}
            {activeTab === 'trainer' && (
              <div className="tab-view animate-fade">
                <h3 className="tab-heading">Register New Fitness Trainer</h3>
                
                <form onSubmit={handleTrainerSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="trainerName">Trainer Full Name *</label>
                      <input
                        id="trainerName"
                        type="text"
                        value={trainerForm.name}
                        onChange={(e) => setTrainerForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Vikram Singh"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="trainerExp">Experience (Years) *</label>
                      <input
                        id="trainerExp"
                        type="number"
                        value={trainerForm.experience_years}
                        onChange={(e) => setTrainerForm(prev => ({ ...prev, experience_years: e.target.value }))}
                        placeholder="e.g. 8"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="trainerSpec">Specialization Category *</label>
                    <input
                      id="trainerSpec"
                      type="text"
                      value={trainerForm.specialization}
                      onChange={(e) => setTrainerForm(prev => ({ ...prev, specialization: e.target.value }))}
                      placeholder="e.g. Kettlebell Dynamics & Crossfit"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="trainerBio">Short Biography / Bio *</label>
                    <textarea
                      id="trainerBio"
                      value={trainerForm.bio}
                      onChange={(e) => setTrainerForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Describe trainer background and philosophy..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="trainerPhoto">Portrait Image URL (Optional)</label>
                    <input
                      id="trainerPhoto"
                      type="text"
                      value={trainerForm.photo_url}
                      onChange={(e) => setTrainerForm(prev => ({ ...prev, photo_url: e.target.value }))}
                      placeholder="/images/trainers/alex_vance.jpg"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                    <span>Save Trainer Profile</span>
                  </button>
                </form>
              </div>
            )}

            {/* 4. Tab: Add Equipment */}
            {activeTab === 'equipment' && (
              <div className="tab-view animate-fade">
                <h3 className="tab-heading">Add New Equipment Catalog Entry</h3>
                
                <form onSubmit={handleEquipmentSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="eqName">Equipment Name *</label>
                      <input
                        id="eqName"
                        type="text"
                        value={equipmentForm.name}
                        onChange={(e) => setEquipmentForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Smith Machine X2"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="eqCategory">Category *</label>
                      <select
                        id="eqCategory"
                        value={equipmentForm.category}
                        onChange={(e) => setEquipmentForm(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="Strength">Strength</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Free Weights">Free Weights</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="eqMuscle">Target Muscle Groups *</label>
                    <input
                      id="eqMuscle"
                      type="text"
                      value={equipmentForm.muscle_groups}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, muscle_groups: e.target.value }))}
                      placeholder="e.g. Chest, Triceps, Anterior Deltoids"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="eqDesc">Equipment Description *</label>
                    <textarea
                      id="eqDesc"
                      value={equipmentForm.description}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter detailed bio-mechanical descriptions..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="eqFeatures">Key Features * (Comma-separated benefits)</label>
                    <input
                      id="eqFeatures"
                      type="text"
                      value={equipmentForm.features}
                      onChange={(e) => setEquipmentForm(prev => ({ ...prev, features: e.target.value }))}
                      placeholder="e.g. Adjustable safety locks, Linear ball bearings, Heavy steel frame"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="eqDim">Dimensions (L x W x H)</label>
                      <input
                        id="eqDim"
                        type="text"
                        value={equipmentForm.dimensions}
                        onChange={(e) => setEquipmentForm(prev => ({ ...prev, dimensions: e.target.value }))}
                        placeholder="e.g. 140x160x220 cm"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="eqWeight">Total Weight Stack / Capacity</label>
                      <input
                        id="eqWeight"
                        type="text"
                        value={equipmentForm.weight}
                        onChange={(e) => setEquipmentForm(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="e.g. 150 kg Stack"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="eqMaterial">Structural Material</label>
                      <input
                        id="eqMaterial"
                        type="text"
                        value={equipmentForm.material}
                        onChange={(e) => setEquipmentForm(prev => ({ ...prev, material: e.target.value }))}
                        placeholder="e.g. 11-Gauge Structural Steel"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="eqPhoto">Main Photo URL (Optional)</label>
                      <input
                        id="eqPhoto"
                        type="text"
                        value={equipmentForm.photo_url}
                        onChange={(e) => setEquipmentForm(prev => ({ ...prev, photo_url: e.target.value }))}
                        placeholder="/images/equipment/functional_trainer_front.jpg"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                    <span>Save Equipment Catalog Item</span>
                  </button>
                </form>
              </div>
            )}

            {/* 5. Tab: Modify Schedules */}
            {activeTab === 'schedules' && (
              <div className="tab-view animate-fade">
                <h3 className="tab-heading">{scheduleForm.id ? 'Edit Class Schedule Slot' : 'Add New Class Schedule Slot'}</h3>
                
                <form onSubmit={handleScheduleSubmit} className="admin-form" style={{ marginBottom: '40px' }}>
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="schedClassName">Class Name *</label>
                      <input
                        id="schedClassName"
                        type="text"
                        value={scheduleForm.class_name}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, class_name: e.target.value }))}
                        placeholder="e.g. Strength Conditioning"
                        required
                      />
                    </div>
                    
                    <div className="form-field">
                      <label htmlFor="schedTrainer">Instructor / Coach *</label>
                      <select
                        id="schedTrainer"
                        value={scheduleForm.trainer_id}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, trainer_id: e.target.value }))}
                        required
                      >
                        <option value="">Select Instructor</option>
                        {trainers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="schedDay">Day of Week *</label>
                      <select
                        id="schedDay"
                        value={scheduleForm.day_of_week}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, day_of_week: e.target.value }))}
                        required
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor="schedTime">Start Time (HH:MM) *</label>
                      <input
                        id="schedTime"
                        type="time"
                        value={scheduleForm.start_time}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, start_time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="schedDuration">Duration (Minutes) *</label>
                      <input
                        id="schedDuration"
                        type="number"
                        value={scheduleForm.duration_minutes}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                        placeholder="e.g. 60"
                        min="5"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="schedRoom">Room / Zone *</label>
                      <input
                        id="schedRoom"
                        type="text"
                        value={scheduleForm.room}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, room: e.target.value }))}
                        placeholder="e.g. Studio A"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field" style={{ maxWidth: '300px' }}>
                    <label htmlFor="schedIntensity">Intensity Level *</label>
                    <select
                      id="schedIntensity"
                      value={scheduleForm.intensity}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, intensity: e.target.value }))}
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-actions-row" style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={formLoading}>
                      {formLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                      <span>{scheduleForm.id ? 'Modify Class Slot' : 'Add Class Slot'}</span>
                    </button>
                    {scheduleForm.id && (
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setScheduleForm({
                          id: null,
                          class_name: '',
                          trainer_id: '',
                          day_of_week: 'Monday',
                          start_time: '08:00',
                          duration_minutes: '60',
                          room: 'Studio A',
                          intensity: 'Intermediate'
                        })}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                <h3 className="tab-heading" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>Scheduled Classes Directory</h3>
                {schedulesLoading ? (
                  <div className="pane-loader">
                    <Loader2 className="animate-spin" />
                    <span>Accessing schedules roster...</span>
                  </div>
                ) : schedules.length === 0 ? (
                  <div className="pane-empty">
                    <p>No class schedules registered in the system database.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Day & Time</th>
                          <th>Class Details</th>
                          <th>Trainer & Room</th>
                          <th>Intensity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.map((s) => (
                          <tr key={s.id}>
                            <td className="cell-name">
                              <div>{s.day_of_week}</div>
                              <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                                {s.start_time ? s.start_time.substring(0, 5) : ''} ({s.duration_minutes} Mins)
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: '600' }}>{s.class_name}</div>
                            </td>
                            <td>
                              <div>{s.trainer_name || 'Staff'}</div>
                              <div className="text-muted" style={{ fontSize: '0.8rem' }}>{s.room}</div>
                            </td>
                            <td>
                              <span className={`intensity-badge ${s.intensity ? s.intensity.toLowerCase() : ''}`} style={{ display: 'inline-block', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                {s.intensity}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  className="btn-action-edit" 
                                  onClick={() => startEditSchedule(s)}
                                  title="Edit slot details"
                                  style={{ background: 'rgba(var(--accent-gold-rgb), 0.12)', border: 'none', color: 'var(--accent-gold)', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button 
                                  className="btn-action-delete" 
                                  onClick={() => handleDeleteSchedule(s.id)}
                                  title="Delete slot"
                                  style={{ background: 'rgba(239, 68, 68, 0.12)', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      <style>{`
        .admin-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .admin-container {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 24px;
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          max-height: 800px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          padding: 30px;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .admin-hud-header {
          margin-bottom: 24px;
        }

        .admin-hud-header h2 {
          font-size: 2rem;
          text-transform: uppercase;
        }

        .admin-hud-header h2 span {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-hud-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .admin-dashboard-grid {
          display: grid;
          grid-template-columns: 0.28fr 0.72fr;
          gap: 24px;
          flex: 1;
          overflow: hidden;
        }

        /* Sidebar */
        .admin-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-tab {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 14px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: var(--transition-smooth);
          text-align: left;
        }

        .sidebar-tab:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .sidebar-tab.active {
          background: rgba(var(--accent-cyan-rgb), 0.08);
          color: var(--accent-cyan);
          border-color: var(--accent-cyan);
          box-shadow: none;
        }

        /* Main Pane */
        .admin-main-pane {
          overflow-y: auto;
          padding: 30px;
          position: relative;
        }

        .tab-heading {
          font-size: 1.4rem;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .tab-subtext {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .pane-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 12px;
          color: var(--text-muted);
        }

        .pane-empty {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
          border: 1px dashed var(--border-color);
          border-radius: 12px;
        }

        /* Table */
        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .admin-table th {
          background: var(--bg-secondary);
          padding: 12px 16px;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }

        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: top;
        }

        .cell-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .cell-contact {
          font-size: 0.85rem;
        }

        .cell-message {
          max-width: 300px;
        }

        .msg-subject {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .msg-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          word-break: break-word;
        }

        /* Pricing modifier */
        .pricing-modifier-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .plan-edit-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 16px 24px;
          border-radius: 12px;
        }

        .plan-meta-brief h4 {
          font-size: 1.1rem;
          text-transform: uppercase;
        }

        .plan-meta-brief span {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .plan-input-action {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .currency-prefix {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: bold;
          color: var(--accent-gold);
        }

        .plan-input-action input {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          color: var(--text-primary);
          padding: 8px 12px;
          border-radius: 6px;
          width: 120px;
          font-size: 1rem;
          outline: none;
          transition: var(--transition-smooth);
        }

        .plan-input-action input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(var(--accent-cyan-rgb), 0.15);
        }

        /* Forms */
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          color: var(--text-primary);
          padding: 12px;
          border-radius: 8px;
          outline: none;
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(var(--accent-cyan-rgb), 0.15);
        }

        .form-field select option {
          background: #ffffff;
          color: var(--text-primary);
        }

        /* Toast Alert */
        .admin-toast {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          z-index: 100;
          font-size: 0.85rem;
          animation: slideInRight 0.3s ease-out;
        }

        .admin-toast.error {
          background: #ef4444;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-fade {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .intensity-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          width: fit-content;
          letter-spacing: 0.04em;
        }

        .intensity-badge.beginner {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .intensity-badge.intermediate {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .intensity-badge.advanced {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .admin-container {
            height: 95vh;
            max-height: none;
            overflow-y: auto;
          }
          .admin-dashboard-grid {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </div>
  );
}
