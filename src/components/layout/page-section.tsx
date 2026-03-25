interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  centered?: boolean;
}

export function PageSection({ children, className = '', title, description, centered = false }: PageSectionProps) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
            {title && <h2 className="heading-editorial text-2xl sm:text-3xl font-bold text-text-primary">{title}</h2>}
            {description && <p className="body-relaxed mt-2 text-text-secondary max-w-2xl">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
