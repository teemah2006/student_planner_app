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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/generateRecommendation', {
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
      {['subject', 'weakness', 'style', 'topics', 'examDate'].map((field) => (
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
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Generating...' : 'Generate Recommendation'}
      </button>
    </form>
  );
}
