// /client/src/components/dashboard/PaymentsDashboard.tsx

import React from 'react';

const PaymentsDashboard: React.FC = () => {
  const studentInfo = {
    id: '2032882642',
    name: 'Atique Shahrier Chalkloder',
    balance: 'Tk. 35,725/-',
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-gray-800">

      {/* Student Payment Status Card */}
      <div className="bg-white rounded-lg shadow">
        <div style={{ backgroundColor: '#0073a9' }} className="text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-semibold">Student Payment Status</h3>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Student ID:</span>
            <span className="font-mono">{studentInfo.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Student Name:</span>
            <span className="font-semibold">{studentInfo.name}</span>
          </div>
           <div className="flex justify-between items-center pt-2">
            <span className="font-medium text-gray-600">Current balance:</span>
            <span className="font-bold text-red-600">{studentInfo.balance} (Please Pay)</span>
          </div>
        </div>
      </div>

      {/* Pay Registration Fee Online Card */}
      <div className="bg-white rounded-lg shadow">
        <div style={{ backgroundColor: '#0073a9' }} className="text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-semibold">Pay registration Fee Online</h3>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">
              Payment Type:
            </label>
            <select
              id="paymentType"
              name="paymentType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue="Registration Fee"
            >
              <option>Registration Fee</option>
              <option>Tuition Fee</option>
              <option>Other Fees</option>
            </select>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600">Payable Balance:</span>
            <span className="font-semibold">{studentInfo.balance}</span>
          </div>
          <div className="flex justify-end pt-2">
             <button
                type="button"
                style={{ backgroundColor: '#d9534f' }}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsDashboard;