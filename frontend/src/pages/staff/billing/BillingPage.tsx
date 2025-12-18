import { useState, useEffect } from 'react';
import { billingService } from '@/services/billing.service';
import type { Invoice } from '@/services/billing.service';
import '@/pages/staff/patients/PatientsPage.css';

const BillingPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching invoices...');
        const response = await billingService.getAll({ page: 1, limit: 50 });
        console.log('Billing response:', response);
        if (response && response.data && Array.isArray(response.data)) {
          setInvoices(response.data);
        } else {
          console.warn('Empty response from billing service');
          setInvoices([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch invoices:', err);
        console.error('Error response:', err.response);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view billing information.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch invoices. Please check your authentication.');
        }
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading invoices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Billing & Invoices</h1>
        </div>
        <div style={{ padding: '2rem', color: 'red', background: '#fee', borderRadius: '8px', marginTop: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Error Loading Invoices</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Billing & Invoices</h1>
      </div>

      {invoices.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <h3 className="empty-state-title">No invoices found</h3>
          <p className="empty-state-text">
            Billing and invoicing will be available once the backend API is implemented.
            <br />
            This module will allow managing patient invoices, payments, and insurance claims.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Patient</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.invoice_id}>
                  <td><strong>{invoice.invoice_number}</strong></td>
                  <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                  <td>{invoice.patient_name || '—'}</td>
                  <td>{Number(invoice.total_amount || 0).toFixed(2)} EGP</td>
                  <td>
                    <span className="status-badge status-active">{invoice.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillingPage;

