import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const RequestAdminPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && message) {
      const templateParams = {
        from_email: email,
        message: message,
        to_email: 'bscs23134@itu.edu.pk, bscs23204@itu.edu.pk, bscs23095@itu.edu.pk',
      };

      emailjs.send('service_8408j7h', 'template_4sn7n55', templateParams, 'jGC5oEbnm7Ixc0q69')
        .then((response) => {
          console.log('Email sent successfully:', response);
          setSubmitted(true);
          setShowToast(true);
        })
        .catch((err) => {
          console.error('Error sending email:', err);
          setError('An error occurred while submitting your request. Please try again.');
          setShowToast(true);
        });
    } else {
      setError('Please fill out both fields.');
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-600">Request Administrator Account</h2>

        {submitted ? (
          <div className="text-center text-indigo-600">
            <p className="text-lg font-semibold">Thank you for your request!</p>
            <p className="mt-2 text-gray-600">Our team will review your request and get back to you shortly. Please be patient while we process your request.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-center mb-8">To request an administrator account, please fill out the form below or email us directly at <strong>bscs23134@itu.edu.pk</strong>, <strong>bscs23204@itu.edu.pk</strong>, or <strong>bscs23095@itu.edu.pk</strong>.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
                <textarea
                  id="message"
                  placeholder="Why do you need an admin account?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Submit Request
              </button>
            </form>
          </>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500"><a href="/" className="text-indigo-600 hover:text-indigo-700">Back to Login</a></p>
        </div>
      </div>

      {showToast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg ${error ? 'bg-red-600' : 'bg-indigo-950'} text-white`}>
          {error || 'Your request has been successfully submitted!'}
        </div>
      )}
    </div>
  );
};

export default RequestAdminPage;
