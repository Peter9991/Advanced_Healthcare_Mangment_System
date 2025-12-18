import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService, AppointmentCreateRequest } from '@/services/appointment.service';
import { doctorService } from '@/services/doctor.service';
import { patientAuthService } from '@/services/patientAuth.service';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import './PatientBookAppointmentPage.css';

const PatientBookAppointmentPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Time, 3: Payment
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState(1);
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'visa'>('cash');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatient] = useState<any>(null);

  const appointmentTypes = [
    { id: 1, name: 'Consultation', nameAr: 'استشارة', fee: 300 },
    { id: 2, name: 'Follow-up', nameAr: 'متابعة', fee: 200 },
    { id: 3, name: 'Emergency', nameAr: 'طوارئ', fee: 500 },
    { id: 4, name: 'Surgery Consultation', nameAr: 'استشارة جراحية', fee: 400 },
    { id: 5, name: 'Routine Check', nameAr: 'فحص روتيني', fee: 150 }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientData] = await Promise.all([
          doctorService.getAll({ page: 1, limit: 100 }),
          patientAuthService.getCurrentPatient()
        ]);
        setDoctors(doctorsRes.data);
        setPatient(patientData);
        setSelectedDate(new Date().toISOString().split('T')[0]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
      setCardDetails({ ...cardDetails, cardNumber: value });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      setCardDetails({ ...cardDetails, expiryDate: value });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError(language === 'ar' ? 'يرجى اختيار الطبيب والتاريخ والوقت' : 'Please select doctor, date, and time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const appointmentData: AppointmentCreateRequest = {
        patient_id: patient.patient_id,
        doctor_id: selectedDoctor.doctor_id,
        appointment_date: selectedDate,
        appointment_time: selectedTime + ':00',
        appointment_type_id: appointmentType,
        status_id: 1, // Scheduled
        reason_for_visit: reason
      };

      await appointmentService.create(appointmentData);
      alert(language === 'ar' ? 'تم حجز الموعد بنجاح!' : 'Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = appointmentTypes.find(t => t.id === appointmentType);
  const totalFee = selectedType?.fee || 0;

  return (
    <div className="book-appointment-page">
      <header className="appointment-header">
        <div className="header-content">
          <h1>{language === 'ar' ? 'حجز موعد' : 'Book Appointment'}</h1>
          <LanguageToggle />
        </div>
      </header>

      <div className="appointment-container">
        <div className="appointment-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">{language === 'ar' ? 'اختر الطبيب' : 'Select Doctor'}</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">{language === 'ar' ? 'اختر الوقت' : 'Select Time'}</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">{language === 'ar' ? 'الدفع' : 'Payment'}</div>
          </div>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {step === 1 && (
          <div className="step-content">
            <h2>{language === 'ar' ? 'اختر الطبيب' : 'Select a Doctor'}</h2>
            <div className="doctors-grid">
              {doctors.map(doctor => (
                <div
                  key={doctor.doctor_id}
                  className={`doctor-card ${selectedDoctor?.doctor_id === doctor.doctor_id ? 'selected' : ''}`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="doctor-avatar">
                    {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                  </div>
                  <div className="doctor-info">
                    <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
                    <p className="specialty">{doctor.specialty_name || 'General Medicine'}</p>
                    <p className="department">{doctor.department_name}</p>
                    {doctor.consultation_fee && (
                      <p className="fee">{doctor.consultation_fee} EGP</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedDoctor && (
              <button className="btn-primary" onClick={() => setStep(2)}>
                {language === 'ar' ? 'التالي' : 'Next'}
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>{language === 'ar' ? 'اختر التاريخ والوقت' : 'Select Date & Time'}</h2>
            
            <div className="form-group">
              <label>{language === 'ar' ? 'نوع الموعد' : 'Appointment Type'}</label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(parseInt(e.target.value))}
                className="form-input"
              >
                {appointmentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {language === 'ar' ? type.nameAr : type.name} - {type.fee} EGP
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{language === 'ar' ? 'التاريخ' : 'Date'}</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>{language === 'ar' ? 'الوقت' : 'Time'}</label>
              <div className="time-slots-grid">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{language === 'ar' ? 'سبب الزيارة (اختياري)' : 'Reason for Visit (Optional)'}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-input"
                rows={3}
                placeholder={language === 'ar' ? 'أدخل سبب الزيارة...' : 'Enter reason for visit...'}
              />
            </div>

            <div className="fee-summary">
              <div className="fee-item">
                <span>{language === 'ar' ? 'رسوم الموعد:' : 'Appointment Fee:'}</span>
                <span className="fee-amount">{totalFee} EGP</span>
              </div>
            </div>

            <div className="step-buttons">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                {language === 'ar' ? 'السابق' : 'Back'}
              </button>
              <button className="btn-primary" onClick={() => setStep(3)}>
                {language === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h2>
            
            <div className="payment-methods">
              <div
                className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="payment-icon">💵</div>
                <div className="payment-label">{language === 'ar' ? 'نقدي' : 'Cash'}</div>
              </div>
              <div
                className={`payment-option ${paymentMethod === 'visa' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('visa')}
              >
                <div className="payment-icon">💳</div>
                <div className="payment-label">{language === 'ar' ? 'بطاقة ائتمانية' : 'Credit Card'}</div>
              </div>
            </div>

            {paymentMethod === 'visa' && (
              <div className="card-payment-section">
                <div className="card-preview">
                  <div className="card-front">
                    <div className="card-chip"></div>
                    <div className="card-number">
                      {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-footer">
                      <div className="card-holder">
                        {cardDetails.cardHolder || language === 'ar' ? 'اسم حامل البطاقة' : 'CARD HOLDER'}
                      </div>
                      <div className="card-expiry">
                        {cardDetails.expiryDate || 'MM/YY'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-form">
                  <div className="form-group">
                    <label>{language === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{language === 'ar' ? 'اسم حامل البطاقة' : 'Card Holder Name'}</label>
                    <input
                      type="text"
                      value={cardDetails.cardHolder}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value.toUpperCase() })}
                      placeholder={language === 'ar' ? 'اسم حامل البطاقة' : 'CARD HOLDER NAME'}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        maxLength={3}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="fee-summary">
              <div className="fee-item">
                <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                <span className="fee-amount">{totalFee} EGP</span>
              </div>
            </div>

            <div className="step-buttons">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                {language === 'ar' ? 'السابق' : 'Back'}
              </button>
              <button
                className="btn-primary"
                onClick={handleBookAppointment}
                disabled={loading || (paymentMethod === 'visa' && (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv))}
              >
                {loading
                  ? (language === 'ar' ? 'جاري الحجز...' : 'Booking...')
                  : (language === 'ar' ? 'احجز الموعد' : 'Book Appointment')
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientBookAppointmentPage;

