import { useState } from 'react';
import { PlanCard } from '.';
import './PlanHistorySection.css';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GroupQuestion {
  key: string;
  question: string;
  placeholder: string;
}

interface GroupStep {
  key: string;
  type: 'group';
  questions: GroupQuestion[];
}

interface MultiSelectStep {
  key: string;
  type: 'multiSelect';
  label: string;
  options: string[];
}

interface SingleSelectStep {
  key: string;
  type: 'singleSelect';
  label: string;
  options: string[];
}

interface InputStep {
  key: string;
  type: 'input';
  label: string;
  placeholder: string;
}

type Step = GroupStep | MultiSelectStep | SingleSelectStep | InputStep;

type Answers = {
  age?: string;
  height?: string;
  weight?: string;
  goal?: string[];
  facilities?: string;
  daysPerWeek?: number;
  limitations?: string;
  activityLevel?: string;
};

const steps: Step[] = [
  {
    key: 'basicInfo',
    type: 'group',
    questions: [
      { key: 'age', question: 'What is your age?', placeholder: 'e.g., 25' },
      // height and weight will be handled with unit toggle below
      { key: 'height', question: 'What is your height?', placeholder: '' },
      { key: 'weight', question: 'What is your weight?', placeholder: '' },
    ],
  },
  {
    key: 'goal',
    type: 'multiSelect',
    label: 'What are your fitness goals?',
    options: [
      'Lose weight',
      'Build muscle',
      'Improve endurance',
      'General fitness',
    ],
  },
  {
    key: 'facilities',
    type: 'singleSelect',
    label: 'What equipment do you have access to?',
    options: ['Gym', 'Dumbbells', 'Bodyweight only', 'None'],
  },
  {
    key: 'daysPerWeek',
    type: 'input',
    label: 'How many days per week can you work out?',
    placeholder: 'e.g., 4',
  },
  {
    key: 'limitations',
    type: 'singleSelect',
    label: 'Do you have any injuries or limitations?',
    options: ['No', 'Yes'],
  },
  {
    key: 'activityLevel',
    type: 'singleSelect',
    label: 'What is your current activity level?',
    options: [
      'Sedentary',
      'Lightly active',
      'Moderately active',
      'Very active',
    ],
  },
];

export const PlanHistorySection = () => {
  const userPlans = [
    { name: 'Push Pull Legs', date: 'Jul 2', days: 3, progress: 70 },
    { name: 'Full Body Beginner', date: 'Jun 18', days: 5, progress: 40 },
    { name: 'Upper Lower', date: 'Jun 5', days: 4, progress: 90 },
  ];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  // Track unit system for height and weight
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  const step = steps[currentStep];

  const handleChange = (key: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiSelect = (values: string[]) => {
    setAnswers((prev) => ({ ...prev, [step.key]: values }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      console.log('User answers:', answers);
      setDialogOpen(false);
      setCurrentStep(0);
      setAnswers({});
      setUnitSystem('metric');
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const isStepValid = (): boolean => {
    if (step.type === 'group') {
      return step.questions.every((q) => {
        const val = answers[q.key as keyof Answers];
        return (
          val !== undefined &&
          val !== null &&
          (typeof val === 'number' ? true : val !== '')
        );
      });
    }
    if (step.type === 'multiSelect') {
      const key = step.key as 'goal';
      return Array.isArray(answers[key]) && answers[key]!.length > 0;
    }
    if (step.type === 'singleSelect') {
      const key = step.key as 'facilities' | 'limitations' | 'activityLevel';
      return !!answers[key];
    }
    if (step.type === 'input') {
      const key = step.key as 'daysPerWeek';
      const val = answers[key];
      // val could be number or undefined
      return (
        val !== undefined &&
        val !== null &&
        (typeof val === 'number' ? true : val !== '')
      );
    }
    return false;
  };

  // Conversion helpers
  const cmToFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const feetInchesToCm = (feet: number, inches: number) => {
    return (feet * 12 + inches) * 2.54;
  };

  const kgToLbs = (kg: number) => {
    return Math.round(kg * 2.20462);
  };

  const lbsToKg = (lbs: number) => {
    return lbs / 2.20462;
  };

  return (
    <div className="plans-section">
      <h2>Your Plans</h2>
      <div className="plans-scroll">
        {userPlans.map((plan, idx) => (
          <PlanCard
            key={idx}
            id={idx}
            name={plan.name}
            days={plan.days}
            date={plan.date}
            progress={plan.progress}
          />
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="generate-btn text-sm flex align-center items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Plan
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tell us about you</DialogTitle>
          </DialogHeader>

          {/* Step Content */}
          {step.type === 'group' && (
            <div className="space-y-4">
              {/* Show unit toggle only on basicInfo step */}
              {step.key === 'basicInfo' && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium">Units:</span>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded ${
                      unitSystem === 'metric'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200'
                    }`}
                    onClick={() => setUnitSystem('metric')}
                  >
                    Metric (cm/kg)
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded ${
                      unitSystem === 'imperial'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200'
                    }`}
                    onClick={() => setUnitSystem('imperial')}
                  >
                    Imperial (ft/in & lbs)
                  </button>
                </div>
              )}

              {step.questions.map((q) => {
                // Handle height input
                if (q.key === 'height') {
                  if (unitSystem === 'metric') {
                    return (
                      <div key={q.key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          What is your height? (cm)
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 175"
                          value={answers.height || ''}
                          onChange={(e) =>
                            handleChange('height', e.target.value)
                          }
                          min={0}
                        />
                      </div>
                    );
                  } else {
                    // imperial: show feet and inches inputs
                    const cm = Number(answers.height) || 0;
                    const { feet, inches } = cmToFeetInches(cm);

                    return (
                      <div key={q.key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          What is your height? (ft / in)
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="ft"
                            min={0}
                            value={feet}
                            onChange={(e) => {
                              const newFeet = Number(e.target.value);
                              const newCm = feetInchesToCm(newFeet, inches);
                              handleChange('height', newCm.toFixed(2));
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="in"
                            min={0}
                            max={11}
                            value={inches}
                            onChange={(e) => {
                              let newInches = Number(e.target.value);
                              if (newInches > 11) newInches = 11;
                              if (newInches < 0) newInches = 0;
                              const newCm = feetInchesToCm(feet, newInches);
                              handleChange('height', newCm.toFixed(2));
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                }

                // Handle weight input
                if (q.key === 'weight') {
                  if (unitSystem === 'metric') {
                    return (
                      <div key={q.key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          What is your weight? (kg)
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 70"
                          value={answers.weight || ''}
                          onChange={(e) =>
                            handleChange('weight', e.target.value)
                          }
                          min={0}
                        />
                      </div>
                    );
                  } else {
                    // imperial lbs input
                    const kg = Number(answers.weight) || 0;
                    const lbs = kgToLbs(kg);

                    return (
                      <div key={q.key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          What is your weight? (lbs)
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 154"
                          value={lbs}
                          onChange={(e) => {
                            const newLbs = Number(e.target.value);
                            const newKg = lbsToKg(newLbs);
                            handleChange('weight', newKg.toFixed(2));
                          }}
                          min={0}
                        />
                      </div>
                    );
                  }
                }

                // Handle age input normally
                if (q.key === 'age') {
                  return (
                    <div key={q.key} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {q.question}
                      </label>
                      <Input
                        type="number"
                        placeholder={q.placeholder}
                        value={answers.age || ''}
                        onChange={(e) => handleChange('age', e.target.value)}
                        min={0}
                      />
                    </div>
                  );
                }

                return null; // no other inputs expected in this group
              })}
            </div>
          )}

          {/* Other step types */}
          {step.type === 'multiSelect' && (
            <div className="space-y-2">
              <p className="font-medium">{step.label}</p>
              <div className="flex flex-wrap gap-2">
                {step.options.map((opt) => {
                  // Assert step.key is 'goal' explicitly so TS allows indexing answers[step.key]
                  const selected = (
                    (answers[step.key as 'goal'] as string[]) || []
                  ).includes(opt);

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const current =
                          (answers[step.key as 'goal'] as string[]) || [];
                        const updated = selected
                          ? current.filter((o) => o !== opt)
                          : [...current, opt];
                        handleMultiSelect(updated);
                      }}
                      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                        selected
                          ? 'bg-[#4f46e5] text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step.type === 'singleSelect' && (
            <div className="space-y-2">
              <p className="font-medium">{step.label}</p>
              <div className="flex flex-wrap gap-2">
                {step.options.map((opt) => {
                  // Assert key as one of the singleselect keys in Answers
                  const key = step.key as
                    | 'facilities'
                    | 'limitations'
                    | 'activityLevel';

                  const selected = answers[key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange(key, opt)}
                      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                        selected
                          ? 'bg-[#4f46e5] text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step.key === 'daysPerWeek' && step.type === 'input' && (
            <div className="space-y-2">
              <p className="font-medium">{step.label}</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, i) => {
                  // Assert key explicitly as 'daysPerWeek' (number)
                  const key = step.key as 'daysPerWeek';
                  const selected = answers[key] === i;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleChange(key, i)}
                      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                        selected
                          ? 'bg-[#4f46e5] text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button onClick={nextStep} disabled={!isStepValid()}>
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
