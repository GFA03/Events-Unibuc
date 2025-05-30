import FeatureHighlight from '@/components/FeatureHighlight';

export default function HighlightsPresentation() {
  return (
    <section className="min-h-screen w-full flex flex-col justify-between gap-8 sm:gap-16 md:gap-32 bg-cyan-700 py-16">
      <FeatureHighlight
        title="Find people with the same values"
        imageSrc="/hero-bg.jpg"
        alt="Find people"
        items={[
          'Joining an event has never been easier',
          'Filter by interests, date, and location',
          'Build lasting connections'
        ]}
      />
      <FeatureHighlight
        title="Plan your own events effortlessly"
        imageSrc="/hero-bg.jpg"
        alt="Easy planning"
        items={[
          'Create event pages in minutes',
          'Invite friends with a click',
          'Manage RSVPs seamlessly'
        ]}
        reverse
      />
      <FeatureHighlight
        title="Stay updated on campus life"
        imageSrc="/hero-bg.jpg"
        alt="Stay updated"
        items={[
          'Real-time notifications',
          'Subscribe to categories you love',
          'Never miss an opportunity'
        ]}
      />
    </section>
  );
}
