export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
    <div className="max-w-md w-full bg-cyan-600 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl text-white font-bold mb-4">Forgot Password</h1>
      <p className="mb-6 text-gray-200">Please enter your email address to reset your password.</p>
      <form className="w-full max-w-sm">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-2 mb-4 border bg-white border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Send Reset Link
        </button>
      </form>
    </div>
    </div>
  );
}
