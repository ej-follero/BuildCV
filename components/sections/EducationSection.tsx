'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Education } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EducationSectionProps {
  form: UseFormReturn<{ education: Education[] }>;
}

export function EducationSection({ form }: EducationSectionProps) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button
          type="button"
          onClick={() =>
            append({
              id: generateId(),
              institution: '',
              degree: '',
              field: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              gpa: '',
              description: '',
            })
          }
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No education entries added yet. Click &quot;Add Education&quot; to get started.
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
                <span className="text-sm font-medium">Education #{index + 1}</span>
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

            <div>
              <Label htmlFor={`institution-${index}`}>Institution *</Label>
              <Input
                id={`institution-${index}`}
                {...register(`education.${index}.institution`)}
                placeholder="University of California"
                className="mt-1"
              />
              {errors.education?.[index]?.institution && (
                <p className="text-sm text-destructive mt-1">
                  {errors.education[index]?.institution?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`degree-${index}`}>Degree *</Label>
                <Input
                  id={`degree-${index}`}
                  {...register(`education.${index}.degree`)}
                  placeholder="Bachelor of Science"
                  className="mt-1"
                />
                {errors.education?.[index]?.degree && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.education[index]?.degree?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`field-${index}`}>Field of Study *</Label>
                <Input
                  id={`field-${index}`}
                  {...register(`education.${index}.field`)}
                  placeholder="Computer Science"
                  className="mt-1"
                />
                {errors.education?.[index]?.field && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.education[index]?.field?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor={`location-edu-${index}`}>Location *</Label>
              <Input
                id={`location-edu-${index}`}
                {...register(`education.${index}.location`)}
                placeholder="Berkeley, CA"
                className="mt-1"
              />
              {errors.education?.[index]?.location && (
                <p className="text-sm text-destructive mt-1">
                  {errors.education[index]?.location?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-edu-${index}`}>Start Date *</Label>
                <Input
                  id={`startDate-edu-${index}`}
                  type="date"
                  {...register(`education.${index}.startDate`)}
                  className="mt-1"
                />
                {errors.education?.[index]?.startDate && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.education[index]?.startDate?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`endDate-edu-${index}`}>End Date</Label>
                <Input
                  id={`endDate-edu-${index}`}
                  type="date"
                  {...register(`education.${index}.endDate`)}
                  className="mt-1"
                  disabled={form.watch(`education.${index}.current`)}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id={`current-edu-${index}`}
                    {...register(`education.${index}.current`)}
                  />
                  <Label htmlFor={`current-edu-${index}`} className="cursor-pointer">
                    Currently studying
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor={`gpa-${index}`}>GPA (Optional)</Label>
              <Input
                id={`gpa-${index}`}
                {...register(`education.${index}.gpa`)}
                placeholder="3.8"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor={`description-edu-${index}`}>Description (Optional)</Label>
              <Textarea
                id={`description-edu-${index}`}
                {...register(`education.${index}.description`)}
                placeholder="Relevant coursework, honors, achievements..."
                className="mt-1 min-h-[80px]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
