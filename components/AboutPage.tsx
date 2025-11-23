import React from 'react';
import { useStore } from '../StoreContext';

const AboutPage: React.FC = () => {
  const { t } = useStore();
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t.about}</h1>
        <div className="prose prose-lg mx-auto text-gray-600 space-y-4">
          <p>
            Welcome to <strong>{t.siteName}</strong>, your number one source for all things grocery. 
            We're dedicated to providing you the very best of fresh produce, dairy, and household essentials, 
            with an emphasis on quality, convenience, and affordability.
          </p>
          <p>
            Founded in 2025, Dherkiinlay Supermarket has come a long way from its beginnings in Mogadishu. 
            When we first started out, our passion for "Quality Products for Every Family" drove us to start 
            our own business.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to you. 
            If you have any questions or comments, please don't hesitate to contact us.
          </p>
          <p className="font-bold text-primary-600 mt-8">Sincerely,<br/>The Dherkiinlay Team</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;