'use client';

import { UseFormReturn } from 'react-hook-form';
import { PersonalInfo } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfoSectionProps {
  form: UseFormReturn<{ personalInfo: PersonalInfo }>;
}

export function PersonalInfoSection({ form }: PersonalInfoSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register('personalInfo.firstName')}
            placeholder="John"
            className="mt-1"
          />
          {errors.personalInfo?.firstName && (
            <p className="text-sm text-destructive mt-1">
              {errors.personalInfo.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register('personalInfo.lastName')}
            placeholder="Doe"
            className="mt-1"
          />
          {errors.personalInfo?.lastName && (
            <p className="text-sm text-destructive mt-1">
              {errors.personalInfo.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('personalInfo.email')}
            placeholder="john.doe@example.com"
            className="mt-1"
          />
          {errors.personalInfo?.email && (
            <p className="text-sm text-destructive mt-1">
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('personalInfo.phone')}
            placeholder="+1 (555) 123-4567"
            className="mt-1"
          />
          {errors.personalInfo?.phone && (
            <p className="text-sm text-destructive mt-1">
              {errors.personalInfo.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          {...register('personalInfo.location')}
          placeholder="San Francisco, CA"
          className="mt-1"
        />
        {errors.personalInfo?.location && (
          <p className="text-sm text-destructive mt-1">
            {errors.personalInfo.location.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            {...register('personalInfo.website')}
            placeholder="https://johndoe.dev"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            type="url"
            {...register('personalInfo.linkedin')}
            placeholder="https://linkedin.com/in/johndoe"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            type="url"
            {...register('personalInfo.github')}
            placeholder="https://github.com/johndoe"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary *</Label>
        <Textarea
          id="summary"
          {...register('personalInfo.summary')}
          placeholder="Write a brief summary of your professional background..."
          className="mt-1 min-h-[120px]"
        />
        {errors.personalInfo?.summary && (
          <p className="text-sm text-destructive mt-1">
            {errors.personalInfo.summary.message}
          </p>
        )}
      </div>
    </div>
  );
}
