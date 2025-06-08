import FeatureHighlight from '@/components/ui/home/FeatureHighlight';

export default function HighlightsPresentation() {
  return (
    <section className="min-h-screen w-full flex flex-col justify-between gap-8 sm:gap-16 md:gap-32 bg-cyan-700 py-16">
      <FeatureHighlight
        title="Find people with the same values"
        imageSrc="/highlight-1.jpg"
        alt="Find people"
        items={[
          'Joining an event has never been easier',
          'Search after event title, organizer name or location',
          'Filter by tags and date',
        ]}
      />
      <FeatureHighlight
        title="Build lasting connections"
        imageSrc="/highlight-2.jpg"
        alt="Lasting connections"
        items={[
          'Enjoy cool networking opportunities',
          'Learn from the best speakers',
          'Meet students with shared interests'
        ]}
        reverse
      />
      <FeatureHighlight
        title="Stay updated on campus life"
        imageSrc="/highlight-3.jpg"
        alt="Stay updated"
        items={[
          'New events each day',
          'Search after categories you love',
          'Never miss an opportunity'
        ]}
      />
    </section>
  );
}
