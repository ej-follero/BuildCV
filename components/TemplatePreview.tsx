'use client';

import { ResumeData, Experience, Education, Skill, Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Globe, Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useDragDrop } from '@/lib/utils/dragDrop';

type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects';

interface Section {
  id: SectionType;
  type: SectionType;
}

interface TemplatePreviewProps {
  data: ResumeData;
  className?: string;
  onReorderExperiences?: (experiences: Experience[]) => void;
  onReorderEducation?: (education: Education[]) => void;
  onReorderSkills?: (skills: Skill[]) => void;
  onReorderProjects?: (projects: Project[]) => void;
  onReorderSections?: (sections: Section[]) => void;
  sectionOrder?: SectionType[];
}

export function TemplatePreview({ 
  data, 
  className,
  onReorderExperiences,
  onReorderEducation,
  onReorderSkills,
  onReorderProjects,
  onReorderSections,
  sectionOrder,
}: TemplatePreviewProps) {
  const { personalInfo, experiences, education, skills, projects, theme } = data;
  const isDark = theme.darkMode;

  const renderTemplate = () => {
    switch (theme.template) {
      case 'minimalist':
        return (
          <MinimalistTemplate 
            data={data} 
            isDark={isDark}
            onReorderExperiences={onReorderExperiences}
            onReorderEducation={onReorderEducation}
            onReorderSkills={onReorderSkills}
            onReorderProjects={onReorderProjects}
          />
        );
      case 'modern':
        return (
          <ModernTemplate 
            data={data} 
            isDark={isDark}
            onReorderExperiences={onReorderExperiences}
            onReorderEducation={onReorderEducation}
            onReorderSkills={onReorderSkills}
            onReorderProjects={onReorderProjects}
          />
        );
      case 'creative':
        return (
          <CreativeTemplate 
            data={data} 
            isDark={isDark}
            onReorderExperiences={onReorderExperiences}
            onReorderEducation={onReorderEducation}
            onReorderSkills={onReorderSkills}
            onReorderProjects={onReorderProjects}
          />
        );
      case 'professional':
        return (
          <ProfessionalTemplate 
            data={data} 
            isDark={isDark}
            onReorderExperiences={onReorderExperiences}
            onReorderEducation={onReorderEducation}
            onReorderSkills={onReorderSkills}
            onReorderProjects={onReorderProjects}
          />
        );
      case 'executive':
        return (
          <ExecutiveTemplate 
            data={data} 
            isDark={isDark}
            onReorderExperiences={onReorderExperiences}
            onReorderEducation={onReorderEducation}
            onReorderSkills={onReorderSkills}
            onReorderProjects={onReorderProjects}
          />
        );
      default:
        return (
          <ModernTemplate 
            data={data} 
            isDark={isDark}
            onReorderExperiences={onReorderExperiences}
            onReorderEducation={onReorderEducation}
            onReorderSkills={onReorderSkills}
            onReorderProjects={onReorderProjects}
          />
        );
    }
  };

  return (
    <div
      className={cn(
        'h-full overflow-auto bg-white dark:bg-gray-900',
        className
      )}
      style={{ colorScheme: isDark ? 'dark' : 'light' }}
      suppressHydrationWarning
    >
      <div className="p-8 max-w-4xl mx-auto">
        {renderTemplate()}
      </div>
    </div>
  );
}

interface TemplateProps {
  data: ResumeData;
  isDark: boolean;
  onReorderExperiences?: (experiences: Experience[]) => void;
  onReorderEducation?: (education: Education[]) => void;
  onReorderSkills?: (skills: Skill[]) => void;
  onReorderProjects?: (projects: Project[]) => void;
  onReorderSections?: (sections: Section[]) => void;
  sectionsOrder?: SectionType[];
}

function MinimalistTemplate({ data, isDark, onReorderExperiences, onReorderEducation, onReorderSkills, onReorderProjects, onReorderSections, sectionsOrder }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  // Set up drag/drop for experiences
  const experiencesItems = onReorderExperiences ? experiences : [];
  const experiencesHandleReorder = onReorderExperiences || (() => {});
  
  // Set up drag/drop for education
  const educationItems = onReorderEducation ? education : [];
  const educationHandleReorder = onReorderEducation || (() => {});
  
  // Set up drag/drop for skills
  const skillsItems = onReorderSkills ? skills : [];
  const skillsHandleReorder = onReorderSkills || (() => {});
  
  // Set up drag/drop for projects
  const projectsItems = onReorderProjects ? projects : [];
  const projectsHandleReorder = onReorderProjects || (() => {});

  // Create sections array for section-level drag/drop
  const availableSections: Section[] = [
    ...(personalInfo.summary ? [{ id: 'summary' as SectionType, type: 'summary' as SectionType }] : []),
    ...(experiences.length > 0 ? [{ id: 'experience' as SectionType, type: 'experience' as SectionType }] : []),
    ...(education.length > 0 ? [{ id: 'education' as SectionType, type: 'education' as SectionType }] : []),
    ...(skills.length > 0 ? [{ id: 'skills' as SectionType, type: 'skills' as SectionType }] : []),
    ...(projects && projects.length > 0 ? [{ id: 'projects' as SectionType, type: 'projects' as SectionType }] : []),
  ];

  // Filter and order sections based on sectionsOrder
  const orderedSections = sectionsOrder 
    ? sectionsOrder
        .filter(sectionId => availableSections.some(s => s.id === sectionId))
        .map(sectionId => availableSections.find(s => s.id === sectionId)!)
    : availableSections;

  const sectionsItems = onReorderSections ? orderedSections : [];
  const sectionsHandleReorder = onReorderSections || (() => {});

  // Render section content
  const renderSection = (sectionType: SectionType) => {
    switch (sectionType) {
      case 'summary':
        return personalInfo.summary ? (
          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-1">Summary</h2>
            <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
          </section>
        ) : null;
      case 'experience':
        return experiences.length > 0 ? (
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Experience</h2>
            {onReorderExperiences ? (
              <Reorder.Group axis="y" values={experiencesItems} onReorder={experiencesHandleReorder} className="space-y-6">
                {experiences.map((exp) => (
                  <Reorder.Item key={exp.id} value={exp} id={exp.id} className="cursor-move">
                    <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                        </div>
                      </div>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold">{exp.position}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null;
      case 'education':
        return education.length > 0 ? (
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Education</h2>
            {onReorderEducation ? (
              <Reorder.Group axis="y" values={educationItems} onReorder={educationHandleReorder} className="space-y-4">
                {education.map((edu) => (
                  <Reorder.Item key={edu.id} value={edu} id={edu.id} className="cursor-move">
                    <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-sm mt-1 text-muted-foreground">{edu.description}</p>
                      )}
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-sm mt-1 text-muted-foreground">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null;
      case 'skills':
        return skills.length > 0 ? (
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Skills</h2>
            {onReorderSkills ? (
              <Reorder.Group axis="y" values={skillsItems} onReorder={skillsHandleReorder} className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Reorder.Item key={skill.id} value={skill} id={skill.id} className="cursor-move">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-block">
                      {skill.name}
                    </span>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </section>
        ) : null;
      case 'projects':
        return projects && projects.length > 0 ? (
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Projects</h2>
            {onReorderProjects ? (
              <Reorder.Group axis="y" values={projectsItems} onReorder={projectsHandleReorder} className="space-y-4">
                {projects.map((project) => (
                  <Reorder.Item key={project.id} value={project} id={project.id} className="cursor-move">
                    <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm mt-1">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="text-xs text-muted-foreground">
                              {tech}{idx < project.technologies.length - 1 && ','}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm mt-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="text-xs text-muted-foreground">
                            {tech}{idx < project.technologies.length - 1 && ','}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-8', isDark && 'text-gray-100')} suppressHydrationWarning>
      {/* Header - Not draggable */}
      <div className="text-center space-y-2 border-b pb-6">
        <h1 className="text-4xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personalInfo.location}
            </div>
          )}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Sections with drag/drop */}
      {onReorderSections ? (
        <Reorder.Group axis="y" values={sectionsItems} onReorder={sectionsHandleReorder} className="space-y-8">
          {orderedSections.map((section) => (
            <Reorder.Item key={section.id} value={section} id={section.id} className="cursor-move">
              <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg -m-4 transition-colors border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                {renderSection(section.type)}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="space-y-8">
          {orderedSections.map((section) => (
            <div key={section.id}>
              {renderSection(section.type)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ModernTemplate({ data, isDark, onReorderExperiences, onReorderEducation, onReorderSkills, onReorderProjects }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  // Set up drag/drop
  const experiencesItems = onReorderExperiences ? experiences : [];
  const experiencesHandleReorder = onReorderExperiences || (() => {});
  const educationItems = onReorderEducation ? education : [];
  const educationHandleReorder = onReorderEducation || (() => {});
  const skillsItems = onReorderSkills ? skills : [];
  const skillsHandleReorder = onReorderSkills || (() => {});
  const projectsItems = onReorderProjects ? projects : [];
  const projectsHandleReorder = onReorderProjects || (() => {});

  return (
    <div className={cn('space-y-8', isDark && 'text-gray-100')} suppressHydrationWarning>
      {/* Header with colored accent */}
      <div className="relative">
        <div
          className="h-2 rounded-t-lg mb-6"
          style={{ backgroundColor: data.theme.primaryColor }}
        />
        <div className="space-y-3">
          <h1 className="text-5xl font-bold">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {personalInfo.location}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                GitHub
              </a>
            )}
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section>
          <h2 className="text-2xl font-bold mb-3" style={{ color: data.theme.primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Professional Experience
          </h2>
          {onReorderExperiences ? (
            <Reorder.Group axis="y" values={experiencesItems} onReorder={experiencesHandleReorder} className="space-y-6">
              {experiences.map((exp) => (
                <Reorder.Item key={exp.id} value={exp} id={exp.id} className="cursor-move">
                  <div className="border-l-4 pl-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors" style={{ borderColor: data.theme.primaryColor }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{exp.position}</h3>
                        <p className="text-sm font-medium">{exp.company} • {exp.location}</p>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-4 pl-4" style={{ borderColor: data.theme.primaryColor }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{exp.position}</h3>
                      <p className="text-sm font-medium">{exp.company} • {exp.location}</p>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Education
          </h2>
          {onReorderEducation ? (
            <Reorder.Group axis="y" values={educationItems} onReorder={educationHandleReorder} className="space-y-4">
              {education.map((edu) => (
                <Reorder.Item key={edu.id} value={edu} id={edu.id} className="cursor-move">
                  <div className="border-l-4 pl-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors" style={{ borderColor: data.theme.primaryColor }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                        <p className="text-sm">{edu.institution} • {edu.location}</p>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                        {edu.gpa && <div>GPA: {edu.gpa}</div>}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-sm mt-1 text-muted-foreground">{edu.description}</p>
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-4 pl-4" style={{ borderColor: data.theme.primaryColor }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm">{edu.institution} • {edu.location}</p>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                      {edu.gpa && <div>GPA: {edu.gpa}</div>}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm mt-1 text-muted-foreground">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Skills
          </h2>
          {onReorderSkills ? (
            <Reorder.Group axis="y" values={skillsItems} onReorder={skillsHandleReorder} className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <Reorder.Item key={skill.id} value={skill} id={skill.id} className="cursor-move">
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                    <span className="text-sm">{skill.name}</span>
                    <div className="flex gap-1">
                      {['beginner', 'intermediate', 'advanced', 'expert'].map((level, idx) => (
                        <div
                          key={level}
                          className={cn(
                            'w-2 h-2 rounded-full',
                            idx < ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) + 1
                              ? 'opacity-100'
                              : 'opacity-20'
                          )}
                          style={{
                            backgroundColor: idx < ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) + 1
                              ? data.theme.primaryColor
                              : 'currentColor',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-sm">{skill.name}</span>
                  <div className="flex gap-1">
                    {['beginner', 'intermediate', 'advanced', 'expert'].map((level, idx) => (
                      <div
                        key={level}
                        className={cn(
                          'w-2 h-2 rounded-full',
                          idx < ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) + 1
                            ? 'opacity-100'
                            : 'opacity-20'
                        )}
                        style={{
                          backgroundColor: idx < ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) + 1
                            ? data.theme.primaryColor
                            : 'currentColor',
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Projects
          </h2>
          {onReorderProjects ? (
            <Reorder.Group axis="y" values={projectsItems} onReorder={projectsHandleReorder} className="space-y-4">
              {projects.map((project) => (
                <Reorder.Item key={project.id} value={project} id={project.id} className="cursor-move">
                  <div className="border-l-4 pl-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors" style={{ borderColor: data.theme.primaryColor }}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{project.name}</h3>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm mb-2">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded"
                            style={{
                              backgroundColor: data.theme.primaryColor + '20',
                              color: data.theme.primaryColor,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border-l-4 pl-4" style={{ borderColor: data.theme.primaryColor }}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: data.theme.primaryColor + '20',
                            color: data.theme.primaryColor,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function CreativeTemplate({ data, isDark, onReorderExperiences, onReorderEducation, onReorderSkills, onReorderProjects }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  // Set up drag/drop
  const experiencesItems = onReorderExperiences ? experiences : [];
  const experiencesHandleReorder = onReorderExperiences || (() => {});
  const educationItems = onReorderEducation ? education : [];
  const educationHandleReorder = onReorderEducation || (() => {});
  const skillsItems = onReorderSkills ? skills : [];
  const skillsHandleReorder = onReorderSkills || (() => {});
  const projectsItems = onReorderProjects ? projects : [];
  const projectsHandleReorder = onReorderProjects || (() => {});

  return (
    <div className={cn('space-y-8', isDark && 'text-gray-100')} suppressHydrationWarning>
      {/* Creative Header */}
      <div
        className="p-8 rounded-lg text-white"
        style={{ backgroundColor: data.theme.primaryColor }}
      >
        <h1 className="text-5xl font-bold mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex gap-4 mt-4">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Website
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-3">About</h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-8 rounded" style={{ backgroundColor: data.theme.primaryColor }} />
                Experience
              </h2>
              {onReorderExperiences ? (
                <Reorder.Group axis="y" values={experiencesItems} onReorder={experiencesHandleReorder} className="space-y-6">
                  {experiences.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} id={exp.id} className="cursor-move">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold">{exp.position}</h3>
                            <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
                          </div>
                          <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                          </div>
                        </div>
                        <p className="text-sm mt-2">{exp.description}</p>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{exp.position}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                        </div>
                      </div>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-8 rounded" style={{ backgroundColor: data.theme.primaryColor }} />
                Projects
              </h2>
              {onReorderProjects ? (
                <Reorder.Group axis="y" values={projectsItems} onReorder={projectsHandleReorder} className="space-y-4">
                  {projects.map((project) => (
                    <Reorder.Item key={project.id} value={project} id={project.id} className="cursor-move">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{project.name}</h3>
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm mb-2">{project.description}</p>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{project.name}</h3>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm mb-2">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="space-y-8">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded" style={{ backgroundColor: data.theme.primaryColor }} />
                Education
              </h2>
              {onReorderEducation ? (
                <Reorder.Group axis="y" values={educationItems} onReorder={educationHandleReorder} className="space-y-4">
                  {education.map((edu) => (
                    <Reorder.Item key={edu.id} value={edu} id={edu.id} className="cursor-move">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <h3 className="font-bold text-sm">{edu.degree}</h3>
                        <p className="text-xs text-muted-foreground">{edu.field}</p>
                        <p className="text-xs mt-1">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                        </p>
                        {edu.gpa && <p className="text-xs mt-1">GPA: {edu.gpa}</p>}
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-bold text-sm">{edu.degree}</h3>
                      <p className="text-xs text-muted-foreground">{edu.field}</p>
                      <p className="text-xs mt-1">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                      </p>
                      {edu.gpa && <p className="text-xs mt-1">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded" style={{ backgroundColor: data.theme.primaryColor }} />
                Skills
              </h2>
              {onReorderSkills ? (
                <Reorder.Group axis="y" values={skillsItems} onReorder={skillsHandleReorder} className="space-y-2">
                  {skills.map((skill) => (
                    <Reorder.Item key={skill.id} value={skill} id={skill.id} className="cursor-move">
                      <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{skill.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{skill.level}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) + 1) * 25}%`,
                              backgroundColor: data.theme.primaryColor,
                            }}
                          />
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{skill.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) + 1) * 25}%`,
                            backgroundColor: data.theme.primaryColor,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfessionalTemplate({ data, isDark, onReorderExperiences, onReorderEducation, onReorderSkills, onReorderProjects }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  // Set up drag/drop
  const experiencesItems = onReorderExperiences ? experiences : [];
  const experiencesHandleReorder = onReorderExperiences || (() => {});
  const educationItems = onReorderEducation ? education : [];
  const educationHandleReorder = onReorderEducation || (() => {});
  const skillsItems = onReorderSkills ? skills : [];
  const skillsHandleReorder = onReorderSkills || (() => {});
  const projectsItems = onReorderProjects ? projects : [];
  const projectsHandleReorder = onReorderProjects || (() => {});

  return (
    <div className={cn('space-y-6', isDark && 'text-gray-100')} suppressHydrationWarning>
      {/* Header */}
      <div className="border-b-2 pb-4" style={{ borderColor: data.theme.primaryColor }}>
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section>
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide" style={{ color: data.theme.primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: data.theme.primaryColor }}>
            Professional Experience
          </h2>
          {onReorderExperiences ? (
            <Reorder.Group axis="y" values={experiencesItems} onReorder={experiencesHandleReorder} className="space-y-5">
              {experiences.map((exp) => (
                <Reorder.Item key={exp.id} value={exp} id={exp.id} className="cursor-move">
                  <div className="border-l-2 pl-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors" style={{ borderColor: data.theme.primaryColor }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-base">{exp.position}</h3>
                        <p className="text-sm font-medium">{exp.company}</p>
                      </div>
                      <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{exp.location}</p>
                    <p className="text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: data.theme.primaryColor }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-base">{exp.position}</h3>
                      <p className="text-sm font-medium">{exp.company}</p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{exp.location}</p>
                  <p className="text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: data.theme.primaryColor }}>
            Education
          </h2>
          {onReorderEducation ? (
            <Reorder.Group axis="y" values={educationItems} onReorder={educationHandleReorder} className="space-y-4">
              {education.map((edu) => (
                <Reorder.Item key={edu.id} value={edu} id={edu.id} className="cursor-move">
                  <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                        <p className="text-sm">{edu.institution}</p>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                        {edu.gpa && <div>GPA: {edu.gpa}</div>}
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm">{edu.institution}</p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                      {edu.gpa && <div>GPA: {edu.gpa}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: data.theme.primaryColor }}>
            Technical Skills
          </h2>
          {onReorderSkills ? (
            <Reorder.Group axis="y" values={skillsItems} onReorder={skillsHandleReorder} className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Reorder.Item key={skill.id} value={skill} id={skill.id} className="cursor-move">
                  <span
                    className="px-3 py-1 text-xs rounded border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-block"
                    style={{
                      borderColor: data.theme.primaryColor,
                      color: data.theme.primaryColor,
                    }}
                  >
                    {skill.name}
                  </span>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 text-xs rounded border"
                  style={{
                    borderColor: data.theme.primaryColor,
                    color: data.theme.primaryColor,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: data.theme.primaryColor }}>
            Key Projects
          </h2>
          {onReorderProjects ? (
            <Reorder.Group axis="y" values={projectsItems} onReorder={projectsHandleReorder} className="space-y-4">
              {projects.map((project) => (
                <Reorder.Item key={project.id} value={project} id={project.id} className="cursor-move">
                  <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                    <h3 className="font-bold">{project.name}</h3>
                    <p className="text-sm">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {project.technologies.join(' • ')}
                      </div>
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-bold">{project.name}</h3>
                  <p className="text-sm">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {project.technologies.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ExecutiveTemplate({ data, isDark, onReorderExperiences, onReorderEducation, onReorderSkills, onReorderProjects }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  // Set up drag/drop
  const experiencesItems = onReorderExperiences ? experiences : [];
  const experiencesHandleReorder = onReorderExperiences || (() => {});
  const educationItems = onReorderEducation ? education : [];
  const educationHandleReorder = onReorderEducation || (() => {});
  const skillsItems = onReorderSkills ? skills : [];
  const skillsHandleReorder = onReorderSkills || (() => {});
  const projectsItems = onReorderProjects ? projects : [];
  const projectsHandleReorder = onReorderProjects || (() => {});

  return (
    <div className={cn('space-y-8', isDark && 'text-gray-100')} suppressHydrationWarning>
      {/* Executive Header */}
      <div className="text-center border-b-4 pb-6" style={{ borderColor: data.theme.primaryColor }}>
        <h1 className="text-5xl font-bold mb-3 tracking-tight">
          {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex justify-center gap-4 mt-2 text-xs">
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn Profile
              </a>
            )}
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Personal Website
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="text-center">
          <p className="text-sm leading-relaxed max-w-3xl mx-auto italic">{personalInfo.summary}</p>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 uppercase tracking-wider border-b-2 pb-2" style={{ borderColor: data.theme.primaryColor }}>
                Executive Experience
              </h2>
              {onReorderExperiences ? (
                <Reorder.Group axis="y" values={experiencesItems} onReorder={experiencesHandleReorder} className="space-y-6">
                  {experiences.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} id={exp.id} className="cursor-move">
                      <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold">{exp.position}</h3>
                            <p className="text-sm font-semibold">{exp.company} | {exp.location}</p>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold">{exp.position}</h3>
                          <p className="text-sm font-semibold">{exp.company} | {exp.location}</p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 uppercase tracking-wider border-b-2 pb-2" style={{ borderColor: data.theme.primaryColor }}>
                Strategic Initiatives
              </h2>
              {onReorderProjects ? (
                <Reorder.Group axis="y" values={projectsItems} onReorder={projectsHandleReorder} className="space-y-4">
                  {projects.map((project) => (
                    <Reorder.Item key={project.id} value={project} id={project.id} className="cursor-move">
                      <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                        <h3 className="font-bold">{project.name}</h3>
                        <p className="text-sm">{project.description}</p>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="font-bold">{project.name}</h3>
                      <p className="text-sm">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="space-y-6">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: data.theme.primaryColor }}>
                Education
              </h2>
              {onReorderEducation ? (
                <Reorder.Group axis="y" values={educationItems} onReorder={educationHandleReorder} className="space-y-3">
                  {education.map((edu) => (
                    <Reorder.Item key={edu.id} value={edu} id={edu.id} className="cursor-move">
                      <div className="hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                        <h3 className="font-bold text-sm">{edu.degree}</h3>
                        <p className="text-xs">{edu.field}</p>
                        <p className="text-xs">{edu.institution}</p>
                        {edu.gpa && <p className="text-xs mt-1">GPA: {edu.gpa}</p>}
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-sm">{edu.degree}</h3>
                      <p className="text-xs">{edu.field}</p>
                      <p className="text-xs">{edu.institution}</p>
                      {edu.gpa && <p className="text-xs mt-1">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: data.theme.primaryColor }}>
                Core Competencies
              </h2>
              {onReorderSkills ? (
                <Reorder.Group axis="y" values={skillsItems} onReorder={skillsHandleReorder} className="space-y-1">
                  {skills.map((skill) => (
                    <Reorder.Item key={skill.id} value={skill} id={skill.id} className="cursor-move">
                      <div className="text-sm hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -m-2 transition-colors">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({skill.level})</span>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-1">
                  {skills.map((skill) => (
                    <div key={skill.id} className="text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({skill.level})</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
