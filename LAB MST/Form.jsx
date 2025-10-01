import { useState } from 'react'
import React from 'react' 

function Form() {
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [data, setData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.course) {
      setData([...data, formData]);
      setFormData({ name: '', email: '', course: '' });
    }
  }

  const inputClasses = `
    w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150
  `;
  const submitButtonClasses = `
    w-full bg-purple-600 text-white font-bold py-3 rounded-lg shadow-xl hover:bg-purple-700 transition duration-200 transform hover:scale-[1.01]
  `;
  const tableHeaderClasses = `
    px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider
  `;
  const tableCellClasses = `
    px-6 py-4 whitespace-nowrap text-sm
  `;


  return (
    <div className="p-8 bg-white shadow-2xl rounded-3xl w-full max-w-4xl mx-auto my-8 border-t-4 border-purple-500">
      <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
        Student Enrollment
      </h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 items-end">
        
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Name" 
          className={inputClasses}
          required
        />
        
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          className={inputClasses}
          required
        />
        
        <input 
          type="text" 
          name="course" 
          value={formData.course} 
          onChange={handleChange} 
          placeholder="Course" 
          className={inputClasses}
          required
        />
        
        <button 
          type="submit"
          className={submitButtonClasses}
        >
          Submit
        </button>
      </form>
      
      <h3 className="text-xl font-bold text-gray-700 mb-4">
        Enrollment List ({data.length})
      </h3>
      
      {data.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-100">
              <tr>
                <th className={tableHeaderClasses}>Name</th>
                <th className={tableHeaderClasses}>Email</th>
                <th className={tableHeaderClasses}>Course</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className={`${tableCellClasses} font-medium text-gray-900`}>
                    {item.name}
                  </td>
                  <td className={`${tableCellClasses} text-gray-500`}>
                    {item.email}
                  </td>
                  <td className={`${tableCellClasses} text-gray-500`}>
                    {item.course}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 italic py-4">No data entered yet.</p>
      )}
    </div>
  )
}

export default Form;
