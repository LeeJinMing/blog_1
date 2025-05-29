'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We value your privacy. This privacy policy explains how MoneyGuide collects, uses, and protects your personal information.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: December 17, 2024
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information Collection</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1.1 Personal Information</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may collect the following types of personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Contact information (name, email address)</li>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (page visits, time spent, click behavior)</li>
              <li>Information collected through cookies and similar technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1.2 Automatically Collected Information</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When you visit our website, we automatically collect certain technical information, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Log file information</li>
              <li>Device identifiers</li>
              <li>Geographic location information (if you allow it)</li>
              <li>Website analytics data</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information Usage</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Provide and improve our services</li>
              <li>Personalize user experience</li>
              <li>Send important notifications and updates</li>
              <li>Conduct website analysis and optimization</li>
              <li>Prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Information Sharing</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We do not sell, trade, or transfer your personal information to third parties, except when:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>We have your explicit consent</li>
              <li>It's necessary to work with trusted third parties to provide services</li>
              <li>Required by law or court order</li>
              <li>To protect our rights, property, or safety</li>
              <li>To prevent fraud or security threats</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3.1 Service Providers</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may share information with the following types of third-party service providers:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Website hosting services</li>
              <li>Analytics service providers</li>
              <li>Content delivery networks</li>
              <li>Security service providers</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Cookies Policy</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Remember your preferences</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve website functionality and performance</li>
              <li>Provide personalized content</li>
            </ul>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <strong>Cookie Management:</strong> You can control the use of cookies through your browser settings. Please note that disabling cookies may affect certain website functions.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Security</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We employ multiple security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>SSL/TLS encrypted transmission</li>
              <li>Regular security audits</li>
              <li>Access control and permission management</li>
              <li>Data backup and recovery mechanisms</li>
              <li>Employee security training</li>
            </ul>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                <strong>Important Notice:</strong> While we implement strict security measures, no internet transmission or electronic storage method is 100% secure.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Under applicable data protection laws, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Right of Access:</strong> Learn about the personal information we process about you</li>
              <li><strong>Right of Rectification:</strong> Request correction of inaccurate personal information</li>
              <li><strong>Right of Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Restrict Processing:</strong> Limit our processing of your personal information</li>
              <li><strong>Right to Data Portability:</strong> Obtain your personal information in a structured format</li>
              <li><strong>Right to Object:</strong> Object to our processing of your personal information</li>
            </ul>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-300 text-sm">
                <strong>Exercising Rights:</strong> To exercise the above rights, please contact us using the contact information at the bottom of this page.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Data Retention</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We retain your personal information only for the necessary period:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Period required to provide services</li>
              <li>Period required to comply with legal obligations</li>
              <li>Period required to resolve disputes</li>
              <li>Period required to enforce agreements</li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300">
              After the data retention period ends, we will securely delete or anonymize your personal information.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. International Data Transfer</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your information may be transferred to and processed in locations outside your country/region. We ensure:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Appropriate protective measures are in place</li>
              <li>Compliance with applicable data protection laws</li>
              <li>Data processing agreements are signed with recipients</li>
              <li>Regular review of transfer security</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Children's Privacy</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              If you discover that we have collected personal information from a child, please contact us immediately, and we will take steps to delete such information.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Policy Changes</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may update this privacy policy from time to time. For significant changes, we will:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Post update notices on the website</li>
              <li>Notify registered users via email</li>
              <li>Provide a 30-day transition period</li>
              <li>Update the "Last updated" date at the top of this page</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact Us</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have any questions or concerns about this privacy policy, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                <p className="text-blue-600 dark:text-blue-400">privacy@moneyguide.com</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-300">Reply within 5 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/terms"
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Terms of Service
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