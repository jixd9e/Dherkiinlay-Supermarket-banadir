import React from 'react';
import { useStore } from '../StoreContext';

const PrivacyPage: React.FC = () => {
  const { t } = useStore();
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">{t.privacy} Policy</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h2>
            <p>
              At Dherkiinlay Supermarket, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Identity Data (Name, Username)</li>
              <li>Contact Data (Email, Phone Number, Delivery Address)</li>
              <li>Transaction Data (Payments, Orders)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your order.</li>
              <li>To manage our relationship with you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at support@dherkiinlay.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;