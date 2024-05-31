
import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({ ...formData, [name]: name === 'agreeTerms' ? checked : value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/signup', formData);
      console.log(response);
      setSuccess('User registered successfully');
      setError('');
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response.data.error);
      setSuccess('');
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-3xl mb-6 text-center font-semibold text-gray-800">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full mb-4 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <br/>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full mb-4 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <br/>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full mb-4 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <br/>
          <label className="flex items-center mb-4">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mr-2" required />
            <span className="text-gray-600">I agree to the terms and conditions</span>
            <br/>
          </label>
          <button type="submit" className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
