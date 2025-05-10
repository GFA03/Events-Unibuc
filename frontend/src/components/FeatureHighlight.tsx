import Image from 'next/image';

interface FeatureHighlightProps {
    title: string;
    imageSrc: string;
    alt: string;
    items: string[];
    reverse?: boolean;
}

export default function FeatureHighlight({
                                         title,
                                         imageSrc,
                                         alt,
                                         items,
                                         reverse = false,
                                     }: FeatureHighlightProps) {
    return (
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-around bg-blue-400 gap-8`}>
                <Image
                    src={imageSrc}
                    alt={alt}
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg"
                />
            <div className="">
                <h3 className="text-2xl font-semibold mb-4">{title}</h3>
                <ul className="list-disc list-inside text-gray-200 space-y-2">
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
