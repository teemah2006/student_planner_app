'use client';
import { useState } from 'react';

export default function RecommendationForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    subject: '',
    weakness: '',
    style: '',
    topics: '',
    examDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/generate-recommendations', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSuccess(); // notify parent to refresh and close form
    } else {
      alert('Something went wrong');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      {['subject', 'topics'].map((field) => (
        <div key={field}>
          <label className="block capitalize">{field}</label>
          <input
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>
      ))}
      <div>
        <label className="block capitalize">Weakness(es)</label>
        <textarea name="weakness" id="" value={formData.weakness} onChange={handleChange} 
        placeholder='what area are you struggling with? e.g naming of organic compounds' className="border rounded w-full p-2" required>

        </textarea>
      </div>
      <div>
      <label className="block capitalize">Exam date</label>
          <input 
          type='date'
            name='examDate'
            value={formData.examDate}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
      </div>
      <div>
        <label className="block capitalize">Learning style</label>
        <select name="style" id="" onChange={handleChange} value={formData.style} className="border rounded w-full p-2"
          required>
          <option value="">Select learning style</option>
          <option value="visual">Visual</option>
          <option value="auditory">Auditory</option>
          <option value="kinesthetic">Kinesthetic</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 font-semibold rounded hover:bg-blue-700 cursor-pointer"
      >
        {loading ? 'Generating...' : 'Generate Recommendation'}
      </button>
    </form>
  );
}
