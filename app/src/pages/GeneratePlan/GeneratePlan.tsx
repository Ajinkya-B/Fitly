import React, { useState } from 'react';
import './GeneratePlan.css';

type FieldType = 'select' | 'number' | 'text' | 'checkbox-group';

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

const fields: FieldConfig[] = [
  {
    name: 'goal',
    label: 'Goal',
    type: 'select',
    options: ['Build Muscle', 'Lose Fat'],
  },
  {
    name: 'experience',
    label: 'Experience Level',
    type: 'select',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    name: 'days',
    label: 'Days per week',
    type: 'number',
    min: 1,
    max: 7,
  },
  {
    name: 'duration',
    label: 'Duration per session (minutes)',
    type: 'number',
    min: 10,
    max: 180,
  },
  {
    name: 'equipment',
    label: 'Available Equipment',
    type: 'text',
    placeholder: 'e.g. Dumbbells, Bands',
  },
  {
    name: 'muscles',
    label: 'Muscle Groups to Target',
    type: 'checkbox-group',
    options: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'],
  },
];

const initialState = {
  goal: '',
  experience: '',
  days: 3,
  duration: 45,
  equipment: '',
  muscles: [] as string[],
};

export const GeneratePlan = () => {
  const [form, setForm] = useState(initialState);

  const renderInput = (field: FieldConfig) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            name={field.name}
            value={form[field.name as keyof typeof form] as string}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select {field.label.toLowerCase()}
            </option>
            {field.options?.map((opt) => (
              <option value={opt} key={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            min={field.min}
            max={field.max}
            value={form[field.name as keyof typeof form] as number}
            onChange={handleChange}
            required
          />
        );
      case 'text':
        return (
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name as keyof typeof form] as string}
            onChange={handleChange}
          />
        );
      case 'checkbox-group':
        return (
          <div className="muscle-group-options">
            {field.options?.map((opt) => (
              <label key={opt} className="muscle-checkbox">
                <input
                  type="checkbox"
                  checked={form.muscles.includes(opt)}
                  onChange={() => handleMuscleChange(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  function handleMuscleChange(muscle: string) {
    setForm((prev) => ({
      ...prev,
      muscles: prev.muscles.includes(muscle)
        ? prev.muscles.filter((m) => m !== muscle)
        : [...prev.muscles, muscle],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('Plan generated! (demo)');
  }

  return (
    <div className="generate-plan-container">
      <h2>Customize Your Plan</h2>
      <form className="generate-plan-form" onSubmit={handleSubmit}>
        {fields.map((field) =>
          field.type === 'checkbox-group' ? (
            <fieldset key={field.name}>
              <legend>{field.label}</legend>
              {renderInput(field)}
            </fieldset>
          ) : (
            <label key={field.name}>
              {field.label}
              {renderInput(field)}
            </label>
          ),
        )}
        <button type="submit" className="generate-btn">
          Generate Plan
        </button>
      </form>
    </div>
  );
};
