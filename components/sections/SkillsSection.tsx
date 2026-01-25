'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Skill, Project } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useDragDrop } from '@/lib/utils/dragDrop';
import { motion, Reorder } from 'framer-motion';

interface SkillsSectionProps {
  form: UseFormReturn<{ skills: Skill[]; projects: Project[] }>;
}

export function SkillsSection({ form }: SkillsSectionProps) {
  const { register, control, formState: { errors }, watch, setValue } = form;
  
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
    move: moveSkill,
  } = useFieldArray({
    control,
    name: 'skills',
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
    move: moveProject,
  } = useFieldArray({
    control,
    name: 'projects',
  });

  const { items: skillItems, handleReorder: handleSkillReorder } = useDragDrop(skillFields, moveSkill);
  const { items: projectItems, handleReorder: handleProjectReorder } = useDragDrop(projectFields, moveProject);

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Skills</h3>
          <Button
            type="button"
            onClick={() =>
              appendSkill({
                id: generateId(),
                name: '',
                level: 'intermediate',
              })
            }
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {skillFields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No skills added yet. Click &quot;Add Skill&quot; to get started.
          </div>
        )}

        <Reorder.Group axis="y" values={skillItems} onReorder={handleSkillReorder} className="space-y-4">
          {skillFields.map((field, index) => (
            <Reorder.Item key={field.id} value={field} id={field.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-4 rounded-lg flex items-center gap-4 cursor-move"
              >
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  {...register(`skills.${index}.name`)}
                  placeholder="Skill name"
                  className="text-sm"
                />
                <Select
                  {...register(`skills.${index}.level`)}
                  className="text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </Select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Projects</h3>
          <Button
            type="button"
            onClick={() =>
              appendProject({
                id: generateId(),
                name: '',
                description: '',
                url: '',
                technologies: [],
              })
            }
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {projectFields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No projects added yet. Click &quot;Add Project&quot; to get started.
          </div>
        )}

        <Reorder.Group axis="y" values={projectItems} onReorder={handleProjectReorder} className="space-y-6">
          {projectFields.map((field, index) => (
            <Reorder.Item key={field.id} value={field} id={field.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 rounded-lg space-y-4 cursor-move"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm font-medium">Project #{index + 1}</span>
                    <span className="text-xs">(Drag to reorder)</span>
                  </div>
                  {projectFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

              <div>
                <Label htmlFor={`project-name-${index}`}>Project Name *</Label>
                <Input
                  id={`project-name-${index}`}
                  {...register(`projects.${index}.name`)}
                  placeholder="E-Commerce Platform"
                  className="mt-1"
                />
                {errors.projects?.[index]?.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.projects[index]?.name?.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`project-description-${index}`}>Description *</Label>
                <Textarea
                  id={`project-description-${index}`}
                  {...register(`projects.${index}.description`)}
                  placeholder="Describe your project..."
                  className="mt-1 min-h-[80px]"
                />
                {errors.projects?.[index]?.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.projects[index]?.description?.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`project-url-${index}`}>URL (Optional)</Label>
                <Input
                  id={`project-url-${index}`}
                  type="url"
                  {...register(`projects.${index}.url`)}
                  placeholder="https://github.com/username/project"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`project-tech-${index}`}>Technologies (comma-separated) *</Label>
                <Input
                  id={`project-tech-${index}`}
                  placeholder="React, Node.js, PostgreSQL"
                  className="mt-1"
                  defaultValue={watch(`projects.${index}.technologies`)?.join(', ') || ''}
                  onChange={(e) => {
                    const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                    setValue(`projects.${index}.technologies`, techs);
                  }}
                />
                {errors.projects?.[index]?.technologies && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.projects[index]?.technologies?.message}
                  </p>
                )}
              </div>
            </motion.div>
          </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
