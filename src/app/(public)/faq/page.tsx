export const metadata = {
  title: 'FAQ | Framework Orders & Shipping',
  description: 'Frequently asked questions regarding our closures.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'Do you offer custom embossing and lithography?',
      a: 'Yes, both our metal crowns and ROPP caps can be fully customized with your brand logo using high-fidelity lithographic printing. Contact sales for setup fees and timelines.'
    },
    {
      q: 'What is your typical Minimum Order Quantity (MOQ)?',
      a: 'MOQs vary by product type. Standard unprinted crown caps may have MOQs as low as 50,000 units, while custom-printed jobs require 100,000+ units. Create a free account to view MOQs directly on product pages.'
    },
    {
      q: 'Can I request a sample before a bulk order?',
      a: 'Absolutely. We encourage sampling to ensure cap compatibility with your specific bottle threading. Create an account to request a sample pack.'
    },
    {
      q: 'Are your liners PVC-free?',
      a: 'Yes, we transitioned to PVC-free granulate liners for our entire beverage closure line to meet stringent global food safety and environmental standards.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
      <div className="text-center mb-16">
        <h1 className="heading-editorial text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Frequently Asked Questions</h1>
        <p className="body-relaxed text-base md:text-lg text-text-secondary">Answers to common B2B manufacturing and shipping inquiries.</p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-surface border border-border-default p-6 rounded-2xl shadow-[var(--shadow-card)]">
            <h3 className="heading-editorial text-lg font-bold text-text-primary mb-3">{faq.q}</h3>
            <p className="body-relaxed text-text-secondary leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
