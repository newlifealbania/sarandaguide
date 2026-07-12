export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Privacy Policy</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-slate-700">
        <p>
          SarandaGuide.com respects your privacy. This page explains what data we collect and how
          we use it.
        </p>
        <p>
          <strong>What we collect.</strong> When you create an account we store your name and
          email address. When you list a business we store the business details you provide.
          Payments are processed by Stripe — we never see or store your card details.
        </p>
        <p>
          <strong>How we use it.</strong> We use your data only to operate the directory: showing
          listings, processing subscriptions, and contacting you about your account. We do not
          sell your data to third parties.
        </p>
        <p>
          <strong>Your rights.</strong> You can request a copy or deletion of your data at any
          time by contacting us.
        </p>
        <p>
          Questions? Email us at info@sarandaguide.com.
        </p>
      </div>
    </div>
  );
}
