'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MAX_SKILLS } from '@/validation/user.validation';

interface SkillsInputProps {
  id: string;
  value: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
  // Lets other forms (e.g. assessment tags) reuse the chip input.
  max?: number;
  noun?: string;
}

const SkillsInput = ({ id, value, onChange, disabled, max = MAX_SKILLS, noun = 'skill' }: SkillsInputProps) => {
  const [draft, setDraft] = useState('');
  const limitReached = value.length >= max;

  const addSkill = (raw: string) => {
    const skill = raw.trim();
    setDraft('');
    if (!skill || limitReached) return;
    const exists = value.some((item) => item.toLowerCase() === skill.toLowerCase());
    if (!exists) onChange([...value, skill]);
  };

  return (
    <div className='flex flex-col gap-2'>
      <Input
        id={id}
        value={draft}
        disabled={disabled || limitReached}
        placeholder={limitReached ? `${noun[0].toUpperCase()}${noun.slice(1)} limit reached` : `Type a ${noun} and press Enter`}
        className='h-11'
        onChange={(event) => {
          const next = event.target.value;
          if (next.endsWith(',')) addSkill(next.slice(0, -1));
          else setDraft(next);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            addSkill(draft);
          } else if (event.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => addSkill(draft)}
      />
      {value.length > 0 && (
        <ul className='flex flex-wrap gap-2' aria-label={`Selected ${noun}s`}>
          {value.map((skill) => (
            <li
              key={skill}
              className='inline-flex items-center gap-1 rounded-full bg-secondary py-1 pr-1 pl-3 text-sm text-secondary-foreground'
            >
              {skill}
              <button
                type='button'
                disabled={disabled}
                aria-label={`Remove ${skill}`}
                onClick={() => onChange(value.filter((item) => item !== skill))}
                className='flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
              >
                <X className='size-3.5' />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className='text-xs text-muted-foreground' aria-live='polite'>
        {value.length}/{max} {noun}s · Press Enter or comma to add
      </p>
    </div>
  );
};

export default SkillsInput;
