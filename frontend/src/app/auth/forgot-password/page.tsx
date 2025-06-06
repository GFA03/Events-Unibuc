export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="mb-6">Please enter your email address to reset your password.</p>
      <form className="w-full max-w-sm">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
