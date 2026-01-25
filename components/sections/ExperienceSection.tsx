'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Experience } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ExperienceSectionProps {
  form: UseFormReturn<{ experiences: Experience[] }>;
}

export function ExperienceSection({ form }: ExperienceSectionProps) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experiences',
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button
          type="button"
          onClick={() =>
            append({
              id: generateId(),
              company: '',
              position: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              description: '',
            })
          }
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No experiences added yet. Click &quot;Add Experience&quot; to get started.
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-lg space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm font-medium">Experience #{index + 1}</span>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`company-${index}`}>Company *</Label>
                <Input
                  id={`company-${index}`}
                  {...register(`experiences.${index}.company`)}
                  placeholder="Tech Corp"
                  className="mt-1"
                />
                {errors.experiences?.[index]?.company && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.experiences[index]?.company?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`position-${index}`}>Position *</Label>
                <Input
                  id={`position-${index}`}
                  {...register(`experiences.${index}.position`)}
                  placeholder="Senior Software Engineer"
                  className="mt-1"
                />
                {errors.experiences?.[index]?.position && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.experiences[index]?.position?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor={`location-${index}`}>Location *</Label>
              <Input
                id={`location-${index}`}
                {...register(`experiences.${index}.location`)}
                placeholder="San Francisco, CA"
                className="mt-1"
              />
              {errors.experiences?.[index]?.location && (
                <p className="text-sm text-destructive mt-1">
                  {errors.experiences[index]?.location?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
                <Input
                  id={`startDate-${index}`}
                  type="date"
                  {...register(`experiences.${index}.startDate`)}
                  className="mt-1"
                />
                {errors.experiences?.[index]?.startDate && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.experiences[index]?.startDate?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  type="date"
                  {...register(`experiences.${index}.endDate`)}
                  className="mt-1"
                  disabled={form.watch(`experiences.${index}.current`)}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id={`current-${index}`}
                    {...register(`experiences.${index}.current`)}
                  />
                  <Label htmlFor={`current-${index}`} className="cursor-pointer">
                    Currently working here
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${index}`}>Description *</Label>
              <Textarea
                id={`description-${index}`}
                {...register(`experiences.${index}.description`)}
                placeholder="Describe your responsibilities and achievements..."
                className="mt-1 min-h-[100px]"
              />
              {errors.experiences?.[index]?.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.experiences[index]?.description?.message}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
