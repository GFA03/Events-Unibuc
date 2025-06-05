export default function Footer() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-center text-sm text-gray-500">
        Need help?{' '}
        <a
          href="/support"
          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
          Contact Support
        </a>
      </p>
    </div>
  );
}
