export const metadata = { title: 'Disclaimer' };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Disclaimer</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-slate-700">
        <p>
          By using SarandaGuide.com (the "Site"), you agree to the terms below. If you do not
          agree, please do not use the Site.
        </p>

        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            General information only
          </h2>
          <p className="mt-2">
            The Site provides travel information, business listings, and related content for
            general informational purposes only. While we work hard to keep information accurate
            and up to date, we make no warranties or representations of any kind, express or
            implied, about the completeness, accuracy, reliability, or availability of the Site
            or its content. Prices, opening hours, and other details change frequently. Always
            confirm important details directly with the business or venue.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Third-party content and listings
          </h2>
          <p className="mt-2">
            Business listings, photos, reviews, and other content may be submitted by third
            parties, including business owners and visitors. SarandaGuide.com does not endorse,
            guarantee, or accept responsibility for any third-party content, or for the quality,
            safety, or legality of any business, product, or service listed on the Site. Any
            dealings between you and a listed business are solely between you and that business.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Limitation of liability
          </h2>
          <p className="mt-2">
            To the fullest extent permitted by law, SarandaGuide.com and its owner shall not be
            liable for any loss, injury, damage, cost, or inconvenience of any kind, whether
            direct, indirect, incidental, or consequential, arising from your use of the Site,
            reliance on its content, or your dealings with any business or service found through
            the Site. You use the Site, and you travel, entirely at your own risk.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">External links</h2>
          <p className="mt-2">
            The Site contains links to external websites that are not operated by us. We have no
            control over their content and accept no responsibility for them.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Images and copyright
          </h2>
          <p className="mt-2">
            We have done our best to use only images that are our own, submitted by their owners,
            or published under free commercial-use licenses (such as the Unsplash License). If
            you believe an image on this Site belongs to you and is being used without proper
            permission, please contact us at{' '}
            <a href="mailto:info@sarandaguide.com" className="text-sea-700 underline">
              info@sarandaguide.com
            </a>{' '}
            and we will remove it immediately. Any such use would be an honest mistake, and it
            was never our intention to use anyone's work without permission.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Changes to this disclaimer
          </h2>
          <p className="mt-2">
            We may update this disclaimer from time to time. Continued use of the Site after
            changes are posted means you accept the updated terms.
          </p>
        </div>
      </div>
    </div>
  );
}
