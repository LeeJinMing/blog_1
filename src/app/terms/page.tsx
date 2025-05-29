'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Welcome to MoneyGuide. Please read the following terms of service carefully. By using our services, you agree to comply with these terms.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: December 17, 2024
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              By accessing and using the MoneyGuide website (hereinafter referred to as "this website") and its services, you acknowledge that you have read, understood, and agree to be bound by these terms of service.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <strong>Important Notice:</strong> If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Service Description</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              MoneyGuide provides the following services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Financial and investment educational content</li>
              <li>Online entrepreneurship guidance articles</li>
              <li>Investment strategies and analysis</li>
              <li>Passive income method introductions</li>
              <li>Business and technology trend analysis</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">2.1 Nature of Services</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The content we provide is for educational and informational purposes only and does not constitute investment advice, financial advice, or any form of professional advice.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3.1 Lawful Use</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree to use our services only for lawful purposes and to comply with all applicable laws and regulations. You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Use for any illegal or unauthorized purposes</li>
              <li>Distribute malware or harmful code</li>
              <li>Infringe on others' intellectual property</li>
              <li>Post false, misleading, or defamatory content</li>
              <li>Interfere with the normal operation of the website</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3.2 Account Security</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you create an account, you are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Protecting the security of your account password</li>
              <li>Keeping your account information up to date</li>
              <li>Immediately reporting any security breaches</li>
              <li>Taking full responsibility for account activities</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">4.1 Our Rights</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All content on this website, including but not limited to text, images, designs, trademarks, and software, is protected by intellectual property laws. Without written permission, you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Copy, distribute, or modify our content</li>
              <li>Use for commercial purposes</li>
              <li>Remove copyright or other rights notices</li>
              <li>Reverse engineer or decompile</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">4.2 User Content</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Any content you submit (comments, suggestions, etc.):
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>You retain ownership but grant us a license to use</li>
              <li>Must be original or you have the right to use</li>
              <li>Must not infringe third-party rights</li>
              <li>We have the right to remove inappropriate content</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Disclaimers</h2>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                <strong>Important Statement:</strong> The following disclaimer terms are very important for understanding our service limitations.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">5.1 Investment Risks</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The information we provide does not constitute investment advice. All investments carry risks and may result in loss of principal. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Investment decisions made based on our content</li>
              <li>Losses caused by market volatility</li>
              <li>Issues with third-party investment platforms</li>
              <li>Impact of economic environment changes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">5.2 Information Accuracy</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              While we strive to ensure information accuracy, we do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>All information is up to date</li>
              <li>Information is free from errors or omissions</li>
              <li>Reliability of third-party links</li>
              <li>Uninterrupted service availability</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To the maximum extent permitted by law, MoneyGuide and its affiliates are not liable for the following losses:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Direct, indirect, incidental, or consequential damages</li>
              <li>Loss of profits or business interruption</li>
              <li>Data loss or corruption</li>
              <li>Third-party service issues</li>
              <li>Circumstances beyond our reasonable control</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">6.1 Damage Compensation Limitation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              If we are found liable, the total compensation amount shall not exceed the fees you paid to us in the past 12 months (if applicable).
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Third-Party Links</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our website may contain links to third-party websites. We provide these links for user convenience only and it does not mean:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>We endorse or recommend these websites</li>
              <li>We are responsible for their content</li>
              <li>We control these websites' privacy policies</li>
              <li>We guarantee their service quality</li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300">
              When using third-party services, please note their independent terms and conditions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Service Modification and Termination</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">8.1 Service Modifications</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to modify, suspend, or terminate services at any time without notice. Modifications may include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Website features and functionality</li>
              <li>Content organization and presentation</li>
              <li>Access permissions and requirements</li>
              <li>Technical specifications and requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">8.2 Account Termination</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may terminate your account in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Violation of terms of service</li>
              <li>Long-term inactivity</li>
              <li>Involvement in illegal activities</li>
              <li>Technical or business reasons</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">9.1 Governing Law</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These terms of service are governed by the laws of the relevant jurisdiction, without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">9.2 Dispute Resolution Process</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In case of disputes, we encourage resolution through the following methods:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>First attempt direct negotiation</li>
              <li>Consider mediation procedures</li>
              <li>Finally resort to arbitration or court</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Terms Modification</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may modify these terms of service at any time. For significant modifications, we will:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Post notices prominently on the website</li>
              <li>Notify registered users via email</li>
              <li>Provide a reasonable transition period</li>
              <li>Update the "Last updated" date</li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300">
              Continued use of the service after modifications indicates your acceptance of the new terms.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Other Terms</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">11.1 Entire Agreement</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These terms of service, together with our privacy policy, constitute the entire agreement between you and MoneyGuide.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">11.2 Severability</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If any part of these terms is deemed invalid or unenforceable, the remaining parts shall remain in effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">11.3 Waiver</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our failure to enforce certain parts of the terms does not constitute a waiver of those terms.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Contact Information</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have any questions about these terms of service, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Legal Email</h3>
                <p className="text-blue-600 dark:text-blue-400">legal@moneyguide.com</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support Email</h3>
                <p className="text-blue-600 dark:text-blue-400">support@moneyguide.com</p>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
              <p className="text-gray-600 dark:text-gray-300">We will reply to your inquiry within 7 business days</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/privacy"
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 